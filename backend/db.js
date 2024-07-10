// Database Connection (Singleton)
const { Client } = require('pg');
require('dotenv').config();

class Database {
    constructor(options) {
        // Create a new client if one does not exist
        if (!Database.client) {
            Database.client = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: {rejectUnauthorized: false},
                application_name: `expressJS`
            });
            // Connect to the database
            this.connect(options).catch(e => console.error(e));
        }

        // If a client already exists, return that client
        return this;
    }

    // Query wrapper with error handling
    async query(query, values) {
        try {
            return await Database.client.query(query, values);
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Connect to the database
    async connect(options) {
        await Database.client.connect(options)
            .then(() => console.log('Connected to database'))
            .catch(e => console.error('Database connection error', e.stack));
    }
}

// Export the Database class so that it can be used in other files
module.exports = Database;