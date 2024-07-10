const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

// Get list of all networks
router.get('/', async (req, res) => {
    // Check that the user is logged in
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get the list of networks
    const query = 'SELECT * FROM network;';
    const networks = await db.query(query);

    if (networks) {
        res.status(200).json(networks.rows);
    } else {
        res.status(400).json({message: 'Error fetching networks.'});
    }
});

module.exports = router;