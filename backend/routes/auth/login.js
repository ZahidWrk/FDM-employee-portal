const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/', (req, res, next) => {
    passport.authenticate('login', (err, user) => {
        if (err) return res.status(500).json({message: 'An error occurred'});
        if (!user) return res.status(401).json({message: 'Invalid credentials'});

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({message: 'An error occurred'});
            return res.status(200).json({user: user});
        });
    })(req, res, next);
});

module.exports = router;