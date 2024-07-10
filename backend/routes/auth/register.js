const express = require('express');
const router = express.Router();
const passport = require('passport');

// Handle input from the form
router.post('/', (req, res, next) => {
    passport.authenticate('register', (err, user) => {
        if (err) return res.status(500).json({message: 'An error occurred'});
        if (!user) return res.status(401).json({message: 'Registration failed due to illegal credentials.'});

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({message: 'An error occurred'});
            return res.status(200).json({message: 'Registration successful'});
        });
    })(req, res, next);
});

module.exports = router;