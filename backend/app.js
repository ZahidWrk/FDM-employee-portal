// Importing express module
const express = require('express');
const app = express();
const session = require('express-session');

// Use environment variables
require('dotenv').config();
const ENV = process.env;

// Passport
const passport = require('passport');
require('./routes/auth/passportConfig');

// Use session middleware to store user data
app.use(session({
    secret: ENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Middleware for JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session(undefined));

// running the express app --> run with "npm start"
app.listen(ENV.PORT, () => {
    console.log(`listening on port ${ENV.PORT}`)
});

// CORS middleware to allow for requests from the frontend
const cors = require('cors');
app.use(cors({
    origin: ENV.FRONTEND_URL + ':' + ENV.FRONTEND_PORT,
    credentials: true
}));

// Home Page
app.get('/', async (req, res) => {
    res.send('Welcome to FDM Employee Portal!');
});

// Routes //

// Auth
app.use('/api/login', require('./routes/auth/login'));
app.use('/api/register', require('./routes/auth/register'));
app.use('/api/logout', require('./routes/auth/logout'));

// Admin
app.use('/api/admin', require('./routes/admin/postPermissions'));

// Blog
app.use('/api/posts', require('./routes/blog/post'));

// User Profile
app.use('/api/userProfile', require('./routes/userProfile/userProfile'));

app.use('/api/loghours/', require('./routes/userProfile/hours'));

// FAQ
app.use('/api/faq', require('./routes/faq/faq'));

// Ticket
app.use('/api/ticket', require('./routes/ticket/ticket'));
app.use('/api/ticket/getList', require('./routes/ticket/getList'));
app.use('/api/ticket/updateStatus', require('./routes/ticket/updateStatus'));
app.use('/api/ticket/assignTicket', require('./routes/ticket/assignTicket'));
app.use('/api/ticket/updateLeaveRequest', require('./routes/ticket/updateLeaveRequest'));

// Search
app.use('/api/search', require('./routes/search/searchEmployee'));

// Document
app.use('/api/document/upload', require('./routes/document/uploadDocument'));
app.use('/api/document/getList', require('./routes/document/getList'));

// Network
app.use('/api/network/join/', require('./routes/network/join'));
app.use('/api/network/getList', require('./routes/network/getList'));

// Program
app.use('/api/programs/', require('./routes/programs/programs'));

// Training
app.use('/api/training/', require('./routes/training/training'));

// HR
app.use('/api/userProfileSelect', require('./routes/userProfile/userProfileSelect'));

// Other
app.use('/api/idToName', require('./routes/other/idToName'));
