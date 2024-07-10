const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

// GET all tickets owned by the user
// TODO: Implement filter by status (open, closed, etc.)
router.get('/', async (req, res) => {
    // Check that the user is logged in
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get all tickets owned by the user
    const query = 'SELECT * FROM ticket WHERE submittedby = $1;';
    const tickets = await db.query(query, [req.user.id]);

    // If the query is successful, return the tickets
    if (tickets) {
        res.status(200).json(tickets.rows);
    } else {
        res.status(400).json({message: 'Error getting tickets.'});
    }
});

// Create a new ticket (for employees)
router.post('/', async (req, res) => {
    const { title, description, type} = req.body;
    const submittedBy = req.user.id;
    let newLeave = true; // Assume that the ticket is not a leave request

    // Check that the user is logged in
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Check that fields are not empty
    if (!title || !description) return res.status(400).json({message: 'Please fill in all fields.'});

    // Create a new ticket
    const ticketQuery = 'INSERT INTO ticket (title, description, date, submittedby, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
    const newTicket = await db.query(ticketQuery, [title, description, new Date(), submittedBy, false]);

    // If the type is leave request, create a new leave request
    // TODO: Use can select the type of ticket from a dropdown menu/checkbox
    if (type === 'leave-request') {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        // Check that the start date is before the end date
        if (startDate > endDate) return res.status(400).json({message: 'Start date must be before end date.'});

        const leaveQuery = 'INSERT INTO leaverequest (id, startdate, enddate) VALUES ($1, $2, $3) RETURNING *;';
        newLeave = await db.query(leaveQuery, [newTicket.rows[0].id, new Date(startDate), new Date(endDate)]);
        console.log(newLeave.rows[0])
    }

    // If the query is successful, return the ticket information
    if (newTicket && newLeave) {
        res.status(200).json({message: 'Ticket created.'});
        console.log(newTicket.rows[0]);
        // TODO: Redirect to the ticket page
    } else {
        res.status(400).json({message: 'Error creating ticket.'});
    }
});

module.exports = router;