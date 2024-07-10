const express = require('express');
const router = express.Router();

const db = new (require('../../db'))();

// get all blog posts from the database
router.get('/', async (req, res) => {
    try {
        const query = "SELECT p.id, p.title, p.body, p.date, e.firstname, e.lastname FROM post p INNER JOIN employees e ON p.author = e.id;";
        const data = await db.query(query);

        if (data === false) {
            console.log("Error getting posts.");
            res.status(400).send("Error getting posts.");
        } else {
            console.log(data.rows);
            res.status(200).json(data.rows);
        }
    } catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).send("Server error.");
    }
});

// create a post
router.post('/newblog', async (req, res) => {
    try {
        const { title, body, date, author } = req.body;
        const query = "INSERT INTO post (title, body, date, author) VALUES ($1, $2, $3, $4);";
        const values = [title, body, date, author];
        const data = await db.query(query, values);

        if (data === false) {
            console.log("Error creating post.");
            res.status(400).send("Error creating post.");
        } else {
            console.log("Post created.");
            res.status(200).send("Post created.");
        }
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Server error.");
    }
});

// reply to a post
// reply to a post
router.post('/reply', async (req, res) => {
  const { postid, body, author } = req.body;
  if (!postid || !body || !author) {
    return res.status(400).send("Missing required fields.");
  }

  try {
    // Check if postid is a valid integer
    if (isNaN(parseInt(postid))) {
      console.log("Invalid postid:", postid);
      return res.status(400).send("Invalid postid.");
    }

    const query = "INSERT INTO postreplies (replyto, body, author) VALUES ($1, $2, $3);";
    const values = [postid, body, author];
    const data = await db.query(query, values);

    if (data === false) {
      console.log("Error replying to post.");
      return res.status(400).send("Error replying to post.");
    } else {
      console.log("Reply posted.");
      return res.status(200).send("Reply posted.");
    }
  } catch (error) {
    console.error("Error replying to post:", error);
    return res.status(500).send("Internal Server Error.");
  }
});


// get all replies for a specific post
router.get('/replies/:postid', async (req, res) => {
    try {
        const postid = req.params.postid;
        console.log("Fetching replies for post:", postid);

        const query = "SELECT pr.*, e.firstname, e.lastname FROM postreplies pr INNER JOIN employees e ON pr.author = e.id WHERE pr.replyto = $1;";
        const values = [postid];
        const data = await db.query(query, values);

        if (data === false) {
            console.log("Error getting replies.");
            res.status(400).send("Error getting replies.");
        } else {
            console.log(data.rows);
            res.status(200).json(data.rows);
        }
    } catch (error) {
        console.error("Error fetching replies for post:", error);
        res.status(500).send("Server error.");
    }
});

// get a single post by ID
router.get('/:postid', async (req, res) => {
    try {
        const postid = req.params.postid;
        console.log("Fetching post by ID:", postid);

        const query = "SELECT p.*, e.firstname, e.lastname FROM post p INNER JOIN employees e ON p.author = e.id WHERE p.id = $1;";
        const values = [postid];
        const data = await db.query(query, values);

        if (data === false || data.rows.length === 0) {
            console.log("Post not found.");
            res.status(404).send("Post not found.");
        } else {
            console.log(data.rows[0]);
            res.status(200).json(data.rows[0]);
        }
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        res.status(500).send("Server error.");
    }
});

module.exports = router;
