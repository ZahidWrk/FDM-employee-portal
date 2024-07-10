const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

router.get('/', async (req, res) => {
    const query = `SELECT * FROM faq`;
    const faq = await db.query(query);

    if (faq && faq.rows.length > 0) {
        res.status(200).json(faq.rows);
    } else {
        res.status(400).json({message: 'Error fetching FAQ.'});
    }
});

module.exports = router;