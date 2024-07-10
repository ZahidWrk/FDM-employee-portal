// Given an employee ID, return their full name
const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

router.get('/', async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    const query = "SELECT (firstname, lastname) FROM employees WHERE id = $1";
    const result = await db.query(query, [req.user.id]);

    if (result) {
        res.status(200).json(result.rows);
    } else {
        res.status(400).json({message: 'Error getting name.'});
    }
})


module.exports = router;