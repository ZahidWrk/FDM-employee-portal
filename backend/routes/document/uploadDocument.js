// Upload a document to Firebase Storage
// TODO: Create a form in React to handle file uploads and send them here
const express = require('express');
const router = express.Router();
const db = new (require("../../db"))();
require('dotenv').config();
const ENV = process.env;

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Store file in RAM temporarily

// Firebase
const { getStorage } = require('firebase-admin/storage');
const admin = require("firebase-admin");
const serviceAccount = require("./" + ENV.FIREBASE_SERVICE_ACCOUNT_KEY + ".json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const bucket = getStorage().bucket('gs://' + ENV.FIREBASE_STORAGE_BUCKET);

router.post('/', upload.single('file'), async (req, res) => {

    // Check that the user is logged in
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Validate file
    let file = req.file;
    if (!file || !file.buffer) { // If no file is uploaded
        return res.status(400).send('No file uploaded');
    // If multiple files are uploaded
    } else if (!file.originalname.match(/\.(pdf|docx|doc|png|jpeg)$/)) { // Only allow certain file types
        return res.status(400).send('Invalid File Type: File must be a PDF, DOCX, DOC, PNG, or JPEG');
    }  else if (file.size > 8388608 ) { // Limit file size to 8Megabytes
        return res.status(400).send('File too large: File must be less than 8MB');
    }

    // Determine who has access to the document depending on the type of document
    const type = req.body.type ? req.body.type : "Uncategorized";
    let giveAccessTo = req.user.id; // By default, the user who uploaded the file will have access
    let role = null;

    if (type==="progress_report"){ // Give access to manager
        const managerQuery = `SELECT manager FROM employees WHERE id = $1`;
        const managerResult = await db.query(managerQuery, [req.user.id]);
        giveAccessTo = managerResult ? managerResult.rows[0].manager : req.user.id;
    } else if (type==="payslip"){ // Give access to all HR users
        // Prevent non-HR users from uploading payslips
        if (req.user.role !== "hr"){
            return res.status(401).send('Unauthorized: Only HR users can upload payslips');
        }
        role = "hr";
        giveAccessTo = req.body.employee_id; // Give access to the employee whose payslip is being uploaded
    }

    // Modify filename
    file.originalname = file.originalname.replace(/ /g, "_"); // Replace spaces with underscores
    file.originalname = file.originalname.replace(/[^a-zA-Z0-9.]/g, ""); // Remove special characters
    let name = file.originalname.split('.');
    const timestamp = Date.now()
    file.originalname = name[0] + "_" + timestamp + "." + name[1]; // Keep file extension

    // Create a reference to file.originalname in Firebase Storage
    const storageRef = bucket.file(file.originalname);

    // Upload file to Firebase Storage
    const blobStream = storageRef.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });

    blobStream.on('error', (error) => {
        res.status(500).send('Error uploading file: ' + error.message);
    });

    // When the file upload is complete, get the download URL and save a record to the database
    blobStream.on('finish', async () => {
        // Get download URL (does not expire or require further authentication)
        // TODO: Allow users delete file (delete: true)
        const url = await storageRef.getSignedUrl({
            action: 'read',
            expires: '12-31-9999'
        });

        // Save file metadata to database
        const postgresTimestamp = new Date(timestamp).toISOString();
        const query = `INSERT INTO document (title, owner, uploaddate, url, type) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const documentResult = await db.query(query, [file.originalname, req.user.id, postgresTimestamp, url[0], type])
            .catch((error) => res.status(500).send('Error saving file to database: ' + error.message));

        // Give access to additional users
        const permissionQuery = `INSERT INTO documentaccess (document_id, employee_id, role) VALUES ($1, $2, $3)`;
        await db.query(permissionQuery, [documentResult.rows[0].id, giveAccessTo, role])
            .then(() => res.status(200).send('File uploaded successfully'))
            .catch((error) => res.status(500).send('Error saving file to database: ' + error.message));
    });

    blobStream.end(file.buffer);
}, (error, req, res, next) => {
    // Prevent multiple files from being uploaded
    if (error instanceof multer.MulterError && error.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).send('Only one file can be uploaded at a time');
    } else {
        next(error);
    }
});

module.exports = router;