const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

// Get list of all networks
router.get('/', async (req, res) => {
    // Check that the user is logged in
    // if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get the list of networks
    const query = 'SELECT * FROM training;';
    const networks = await db.query(query);

    if (networks) {
        res.status(200).json(networks.rows);
    } else {
        res.status(400).json({message: 'Error fetching networks.'});
    }
});


router.post('/enrol', async (req, res) => {
    // Check that the user is logged in
    // if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get the user's ID
    const userId = req.body.userId;

    // Get the program ID
    const trainingId = req.body.trainingId;

    // needs to check if ignored

    // Enroll the user in the program
    const query = 'INSERT INTO trainee (employee_id, training_id) VALUES ($1, $2);';
    const values = [userId, trainingId];
    const result = await db.query(query, values);

    if (result) {
        res.status(200).json({message: 'User enrolled in training.'});
    } else {
        res.status(400).json({message: 'Error enrolling user in training.'});
    }
});


router.post('/unenrol', async (req, res) => {
    // Get the user's ID
    const userId = req.body.userId;

    // Get the program ID
    const trainingId = req.body.trainingId;

    // Unenroll the user from the program
    const query = 'DELETE FROM trainee WHERE employee_id = $1 AND training_id = $2;';
    const values = [userId, trainingId];
    const result = await db.query(query, values);

    if (result) {
        res.status(200).json({message: 'User unenrolled from training.'});
    } else {
        res.status(400).json({message: 'Error unenrolling user from training.'});
    }
})

router.post('/yourTrainings', async (req, res) => {
    // Check that the user is logged in
    // if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get the user's ID
    const userId = req.body.userId;

    // Get the user's programs
    const query = 'SELECT tr.id, et.firstname, t.name, t.description FROM trainee tr JOIN employees et ON tr.employee_id = et.id JOIN training t ON tr.training_id = t.id WHERE et.id = $1;';
    const values = [userId];
    const programs = await db.query(query, values);

    if (programs) {
        console.log(userId)
        res.status(200).json(programs.rows);
    } else {
        res.status(400).json({message: 'Error fetching user training.'});
    }
})

module.exports = router;