const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

// Join a network
router.post('/', async (req, res) => {
    // Make sure the user is logged in
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get the network ID from the request
    const {network_id} = req.body;
    if (!network_id) return res.status(400).json({message: 'No network ID provided.'});

    // Check if the network exists
    const networkCheckQuery = 'SELECT * FROM network WHERE id = $1;';
    const networkCheckResult = await db.query(networkCheckQuery, [network_id]);
    if (networkCheckResult && networkCheckResult.rows.length !== 1) {
        return res.status(400).json({message: 'Network does not exist.'});
    }

    // Check if the user is already in the network
    const userNetworkCheckQuery = 'SELECT * FROM networkmembers WHERE network_id = $1 AND employee_id = $2;';
    const userNetworkCheckResult = await db.query(userNetworkCheckQuery, [network_id, req.user.id]);
    if (userNetworkCheckResult && userNetworkCheckResult.rows.length === 1) {
        return res.status(400).json({message: 'User is already in the network.'});
    }

    // Add the user to the network
    const query = 'INSERT INTO networkmembers (network_id, employee_id) VALUES ($1, $2);';
    const result = await db.query(query, [network_id, req.user.id]);
    if (result) { res.status(200).json({message: 'User successfully joined network.'});}
    else {res.status(400).json({message: 'Error joining network.'});}
});

module.exports = router;