// Import libraries
const knex = require('knex');
const config = require("../config/config");

// Initialize Knex connection
const db = knex({
    client: 'mysql2',
    connection: {
        host: config.db_host,
        user: config.db_user,
        password: config.db_password,
        database: config.db_name
    }
});

module.exports = db;


