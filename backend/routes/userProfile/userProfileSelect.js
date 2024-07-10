const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();
const crypto = require("crypto");

// GET user information (No changes from your provided code)
router.get('/', async (req, res) => {
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

// Modify user information without checks
router.patch('/', async (req, res) => {
    // Directly use targetUserId from the request body, falling back to a default if not provided
    const { targetUserId, firstname, lastname, email, phone, password } = req.body;

    // Ensure targetUserId is provided, otherwise return an error
    if (!targetUserId) {
        return res.status(400).json({ message: "Missing targetUserId for update." });
    }

    const updateQuery = 'UPDATE employees SET firstname = $1, lastname = $2, email = $3, phone = $4 WHERE id = $5;';
    let updatedPassword = true; // Assume password update is successful unless attempted and fails

    const updatedInfo = await db.query(updateQuery, [firstname, lastname, email, phone, targetUserId]);

    // If the user wants to change the password
    if (password) {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const passwordQuery = 'UPDATE employees SET password = $1 WHERE id = $2;';
        const passwordResult = await db.query(passwordQuery, [hashedPassword, targetUserId]);
        updatedPassword = passwordResult.rowCount > 0;
    }

    // If the queries are successful, return a success message
    if (updatedInfo.rowCount > 0 && updatedPassword) {
        res.status(200).json({message: 'User information updated successfully.'});
    } else {
        res.status(400).json({message: 'Error updating user information.'});
    }
});

module.exports = router;