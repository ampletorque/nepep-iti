const { Client } = require("pg");
const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true
});
//connection query & creation of tables
client.connect();
const db_creation_string = `CREATE TABLE IF NOT EXISTS invitations(id SERIAL PRIMARY KEY, created_at TIMESTAMP, updated_at TIMESTAMP, link TEXT, senderId TEXT, sendermsg TEXT, senderName TEXT, receiverId TEXT);
CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name TEXT, link TEXT, email TEXT);`;
