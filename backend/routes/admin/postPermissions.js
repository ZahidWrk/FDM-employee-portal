const express = require('express');
const router = express.Router();

const db = new (require('../../db'))()

// handle change in permissions (remove or add)
router.post('/permissions', (req, res, next) => {
    
    const alterPermission = async (req) => {

        // req body values
        const canPost = req.body.canPost
        const account_type = req.body.account_type
        const firstname = req.body.firstname
        const lastname = req.body.lastname

        // debug outputs
        // console.log(canPost)

        const values = [canPost, account_type, firstname, lastname]
        const query = "UPDATE employees SET canpost = $1, account_type = $2 WHERE firstname = $3 AND lastname = $4"


        // maybe rename "res" to "data" or something
        const data = await db.query(query, values)
        console.log(values)

        // If the query fails, return an error message
        // if (res === false) return done(null, false, {message: "Database error"});
        // if (res.rows.length === 1) {
        //     return done(null, res.rows[0])
        // } else {
        //     return done(null, false, {message: "Invalid query"})
        // }

        // temporary response --> needs to be altered for a proper error response
        if (!data) {
            res.status(400).json({message: "What is going on."})
            console.log("Not Working.")
        } else {
            console.log("Working.")
            res.status(200).json({message: "Permissions Updated"})
        }
    }

    alterPermission(req)
});


// for now I am quering "issues" - but maybe supportRequests Table is needed.
router.get('/supportRequests', (req, res) => {

    const getSupportRequests = async () => {
        
        // INNER JOIN to include the author name
        const query = "SELECT i.*, e.firstname, e.lastname FROM issue i INNER JOIN employees e ON i.author = e.id WHERE i.solved = 'false' ORDER BY i.date DESC;                                                      "
        const data = await db.query(query)

        if (data === false) {
            console.log("Not Working.")
        } else {
            res.json(data.rows)
            console.log("Working.")
        }
    }

    getSupportRequests(req, res)
})


// for now I am quering "issues" - but maybe supportRequests Table is needed.
router.post('/supportRequests/personal', (req, res) => {

    const getSupportRequests = async () => {
        
        const userId = req.body.userId

        // INNER JOIN to include the author name
        const query = "SELECT i.*, e.firstname, e.lastname FROM issue i INNER JOIN employees e ON i.author = e.id WHERE e.id = $1 ORDER BY i.date DESC;";
        const data = await db.query(query, [userId])                                         

        if (data === false) {
            console.log("Not Working.")
        } else {
            res.json(data.rows)
            console.log("Working.")
        }
    }

    getSupportRequests(req, res)
})



// end point and function for marking an issue solved or unsolved.
router.post('/markIssueSolved', (req, res) => {
    const markSolved = async () => {

        const solved = req.body.solved
        const id = req.body.id

        const values = [solved, id]
        const query = "UPDATE issue SET solved = $1 WHERE id = $2"
        const data = await db.query(query, values)

        if (data === false) {
            console.log("Not Working.")
        } else {
            console.log("Working.")
            res.json({message: "Issue Resolved"})
        }
    }

    markSolved(req, res)
})


router.post('/makeSupportRequest', (req, res) => {
    const makeSupportRequest = async () => {

        const title = req.body.title
        const description = req.body.description
        const date = req.body.date
        const author = req.body.author

        const values = [title, description, date, author]
        const query = "INSERT INTO issue (title, description, date, author, solved) VALUES ($1, $2, $3, $4, 'false')"
        const data = await db.query(query, values)

        if (data === false) {
            console.log("Not Working.")
        } else {
            console.log("Working.")
            res.json({message: "Support Request Sent"})
        }
    }

    makeSupportRequest(req, res)
})

module.exports = router;