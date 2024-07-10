// Assign ticket to currently logged in HR employee
// TODO: Allow HR employees to un-assign tickets
const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();
router.put('/:id', async (req, res) => {
    // Check that the user is logged in as an HR employee
    if (!req.user || req.user.role !== "hr") return res.status(401).json({message: 'Unauthorized. Please log in as an HR employee.'});

    // Get the ticket ID from the URL
    const ticketId = req.params.id;

    // Update the ticket status to closed
    const query = 'UPDATE ticket SET managedBy = $1 WHERE id = $2;';
    const result = await db.query(query, [req.user.id, ticketId]);

    // If the query is successful, return the ticket
    if (result) {
        res.status(200).json({message: 'Ticket assigned.'});
    } else {
        res.status(400).json({message: 'Error assigning ticket.'});
    }
});

module.exports = router;