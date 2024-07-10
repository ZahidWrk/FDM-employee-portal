// Accept or reject leave requests
const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

router.post('/', async (req, res) => {
    // Check that the user is logged in as an HR employee
    if (!req.user || req.user.role !== "hr")
        return res.status(401).json({message: 'Unauthorized. Please log in as an HR employee.'});

    const { requestId, status } = req.body;

    // Update the status of the leave request
    const query = `UPDATE leaverequest SET accepted = $1 WHERE id = $2`;
    const updated = await db.query(query, [status, requestId]);

    // Also update its status on the ticket table
    const query2 = `UPDATE ticket SET status = true WHERE id = $1`;
    const updated2 = await db.query(query2, [requestId]);

    if (updated && updated2) {
        res.status(200).json({message: 'Leave request updated successfully.'});
    } else {
        res.status(400).json({message: 'Error updating leave request.'});
    }
});

module.exports = router;