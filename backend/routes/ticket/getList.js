// Manage ticket routes for HR employees
const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

// GET unresolved tickets (Page for HR employees to view all unresolved tickets)
// TODO: Implement sort/filter by status (open, closed, managedBy HR user XYZ etc.)
router.get('/', async (req, res) => {
    // Check that the user is logged in as an HR employee
    if (!req.user || req.user.role !== "hr") return res.status(401).json({message: 'Unauthorized. Please log in as an HR employee.'});

    // Get all unresolved tickets and get the submittedBy's full name from the employee table
    // If the ticket is a leave request, set the request_type to 'leave-request', otherwise set it to 'general-ticket'
    const query = `SELECT t.*, e.firstname || ' ' || e.lastname AS submittedBy, 
        CASE WHEN lr.id IS NOT NULL THEN 'leave-request' ELSE 'general-ticket' END AS ticket_type 
        FROM ticket t
        LEFT JOIN employees e ON t.submittedBy = e.id
        LEFT JOIN leaverequest lr ON t.id = lr.id
        WHERE status = $1
    `;
    const tickets = await db.query(query, [false]);

    // If the query is successful, return the tickets
    if (tickets) {
        res.status(200).json(tickets.rows);
    } else {
        res.status(400).json({message: 'Error getting tickets.'});
    }
});

module.exports = router;