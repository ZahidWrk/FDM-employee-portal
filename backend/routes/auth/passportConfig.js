const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = new (require('../../db'))(); // Instantiate a database connection
const crypto = require('crypto');

// Serialize will store the user object in the session
passport.serializeUser(function(user, done) {
    done(null,
        {
            id: user.id,
            name: user.firstname,
            role: user.account_type
        });
});

// Everytime a request is made, deserialize will retrieve the user object from the session
passport.deserializeUser(function(user, done) {
  // Can be accessed in req.user
  done(null,
      {
          id: user.id,
          name: user.name,
          role: user.role
      });
});

// Register strategy
passport.use("register", new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    async function (req, email, password, done) {
        const { firstname, lastname } = req.body;

        // Hash the password
        password = crypto.createHash('sha256').update(password).digest('hex');

        const values = [firstname, lastname, email, password];
        const query = "INSERT INTO employees (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
        const res = await db.query(query, values);

        // If the query fails, return an error
        if (res === false || res.rows.length === 0) return done(null, false, {message: "Database error"});

        return done(null, res.rows[0]);
    }
));

// Login strategy
passport.use("login", new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    async function (req, email, password, done) {
        // Hash the password
        password = crypto.createHash('sha256').update(password).digest('hex');

        const values = [email, password];
        const query = "SELECT * FROM employees WHERE email = $1 AND password = $2";

        const res = await db.query(query, values);

        // If the query fails, return an error message
        if (res === false) return done(null, false, {message: "Database error"});
        if (res.rows.length !== 1) return done(null, false, {message: "Invalid credentials"});

        return done(null, res.rows[0]);

    }
));

module.exports = passport;