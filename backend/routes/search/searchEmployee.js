const express = require('express');
const router = express.Router();

const db = new (require('../../db'))()

// search for an employee
router.post('/', (req, res) => {
    const search = async () => {

        const searchParam = req.body.searchParam

        const values = [`%${searchParam}%`]; // Note the backticks to interpolate the value
        const query = "SELECT * FROM employees WHERE firstname LIKE $1;";
        const data = await db.query(query, values);
        

        if (data === false) {
            console.log("Not Working.")
        } else {
            console.log("Working.")
            res.json({searchResults: data.rows})
        }
    }

    search(req, res)
})

module.exports = router;