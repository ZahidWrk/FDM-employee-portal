const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    req.logout((err) => {
        // handle errors
        if (err) {
            console.log(err);
            res.status(500).send('Error occurred during logout');
        }

        // Redirect to the home page
        res.redirect('/');
    });
});
module.exports = router;