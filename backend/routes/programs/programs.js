const express = require('express');
const router = express.Router();
const db = new (require('../../db'))();

// Get list of all networks
router.get('/', async (req, res) => {
    // Check that the user is logged in
    // if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get the list of networks
    const query = 'SELECT * FROM companyprogram;';
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
    const programId = req.body.programId;

    // needs to check if ignored

    // Enroll the user in the program
    const query = 'INSERT INTO enrolee (employee_id, program_id) VALUES ($1, $2);';
    const values = [userId, programId];
    const result = await db.query(query, values);

    if (result) {
        res.status(200).json(
            {
                message: 'User enrolled in program.',
                programs: {result}
            }
        );
    } else {
        res.status(400).json({message: 'Error enrolling user in program.'});
    }
});


router.post('/unenrol', async (req, res) => {
    // Get the user's ID
    const userId = req.body.userId;

    // Get the program ID
    const programId = req.body.programId;

    // Unenroll the user from the program
    const query = 'DELETE FROM enrolee WHERE employee_id = $1 AND program_id = $2;';
    const values = [userId, programId];
    const result = await db.query(query, values);

    if (result) {
        res.status(200).json({message: 'User unenrolled from program.'});
    } else {
        res.status(400).json({message: 'Error unenrolling user from program.'});
    }
})

router.post('/yourPrograms', async (req, res) => {
    // Check that the user is logged in
    // if (!req.user) return res.status(401).json({message: 'Unauthorized. Please log in.'});

    // Get the user's ID
    const userId = req.body.userId;

    // Get the user's programs
    const query = 'SELECT er.id, et.firstname, cp.name, cp.description, cp.link FROM enrolee er JOIN employees et ON er.employee_id = et.id JOIN companyprogram cp ON er.program_id = cp.id WHERE et.id = $1;';
    const values = [userId];
    const programs = await db.query(query, values);

    if (programs) {
        console.log(userId)
        res.status(200).json(programs.rows);
    } else {
        res.status(400).json({message: 'Error fetching user programs.'});
    }
})

module.exports = router;