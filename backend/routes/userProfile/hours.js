const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

// GET all tickets owned by the user
// TODO: Implement filter by status (open, closed, etc.)
router.post('/', async (req, res) => {
    // Check that the user is logged in
    // if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    const userId = req.body.userId
    const hours = req.body.hours

    // Get all tickets owned by the user
    const query = 'UPDATE employees SET hoursworked = $2 WHERE id = $1;';
    const result = await db.query(query, [userId, hours]);

    // If the query is successful, return the tickets
    if (result) {
        res.status(200).json({message: 'Hours updated.'});
    } else {
        res.status(400).json({message: 'Error updated hours.'});
    }
});


module.exports = router;