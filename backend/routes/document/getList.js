// Get a list of all documents uploaded by the current logged-in user
const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

router.get('/', async (req, res) => {
        // Check that the user is logged in
        if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

        // Get all documents uploaded by the current user
        const uploadedByQuery = `SELECT * FROM document WHERE owner = $1`;
        const queryResult = await db.query(uploadedByQuery, [req.user.id]);

        // Get all documents shared with the current user
        let sharedResult;
        const sharedWithQuery = `SELECT * FROM documentaccess WHERE employee_id = $1`;
        sharedResult = await db.query(sharedWithQuery, [req.user.id]);

        // Get the document details for each shared document
        if (sharedResult && sharedResult.rows) {
                for (let i = 0; i < sharedResult.rows.length; i++) {
                        const documentQuery = `SELECT * FROM document WHERE id = $1`;
                        const documentResult = await db.query(documentQuery, [sharedResult.rows[i].document_id]);
                        sharedResult.rows[i].document = documentResult.rows[0];
                }
        }

        // Get all documents shared with all HR users (only if the current user is an HR user)
        let sharedWithHRResult; // In case the user is not an HR user
        if (req.user.role === "hr") {
            const sharedWithHRQuery = `SELECT * FROM documentaccess WHERE role = 'hr'`;
            sharedWithHRResult = await db.query(sharedWithHRQuery, [req.user.id]);
        }

        // Get the document details for each shared document
        if (sharedWithHRResult && sharedWithHRResult.rows) {
                for (let i = 0; i < sharedWithHRResult.rows.length; i++) {
                        const documentQuery = `SELECT * FROM document WHERE id = $1`;
                        const documentResult = await db.query(documentQuery, [sharedWithHRResult.rows[i].document_id]);
                        sharedWithHRResult.rows[i].document = documentResult.rows[0];
                }
        }

        // Append sharedWithHRResult to and sharedResult to queryResult
        const allDocuments = queryResult.rows.concat(
            sharedResult && sharedResult.rows ? sharedResult.rows.document : [],
            sharedWithHRResult && sharedWithHRResult.rows ? sharedWithHRResult.rows.document : []
        );

        res.status(200).json(allDocuments);
});

module.exports = router;