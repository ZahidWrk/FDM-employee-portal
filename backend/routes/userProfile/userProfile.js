const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();
require("crypto");
const crypto = require("crypto");

// GET user information
router.get('/', async (req, res)  => {
    // Check that the user is logged in
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get user information
    const query = 'SELECT firstname, lastname, email, phone, hoursworked, leavebalance, canpost, manager FROM employees WHERE id = $1;';
    const userInfo = await db.query(query, [req.user.id]);

    // If the query is successful, return the user information
    if (userInfo && userInfo.rows.length === 1) {
        res.status(200).json(userInfo.rows[0]);
    } else {
        res.status(400).json({message: 'Error fetching user information.'});
    }
});

// Modify user information
router.patch('/', async (req, res) => {
    const query = 'UPDATE employees SET firstname = $1, lastname = $2, email = $3, phone = $4 WHERE id = $5;';
    let updatedPassword = true; // In case the user does not want to change the password

    // Check that the user is logged in
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Update user information
    // The user can only change own information
    let { firstname, lastname, email, password, phone} = req.body;
    const updatedInfo = await db.query(query, [firstname, lastname, email, phone, req.user.id]);

    // If the user wants to change the password
    if (password) {
        password = crypto.createHash('sha256').update(password).digest('hex');
        const query = 'UPDATE employees SET password = $1 WHERE id = $2;';
        updatedPassword = await db.query(query, [password, req.user.id]);
    }

    // If the query is successful, return the updated information
    if (updatedInfo && updatedPassword) {
        res.status(200).json({message: 'User information updated.'});
    } else {
        res.status(400).json({message: 'Error updating user information.'});
    }
});

module.exports = router;