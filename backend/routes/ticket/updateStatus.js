// Update ticket status (for HR use)
const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

router.put('/:id', async (req, res) => {
    // Check that the user is logged in as an HR employee
    if (!req.user || req.user.role !== "hr") return res.status(401).json({message: 'Unauthorized. Please log in as an HR employee.'});

    // Get the ticket ID from the URL
    const ticketId = req.params.id;
    const status = req.body.status;

    // Update the ticket status to closed
    const query = 'UPDATE ticket SET status = $1 WHERE id = $2;';
    const result = await db.query(query, [status, ticketId]);

    // If the query is successful, return the ticket
    if (result) {
        res.status(200).json({message: 'Ticket status updated.'});
    } else {
        res.status(400).json({message: 'Error updating ticket status.'});
    }
});

module.exports = router;