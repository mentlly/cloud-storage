// database.js
const bcrypt = require('bcrypt');
const { Pool, Client } = require('pg');

async function ensureDatabaseExists() {
  const client = new Client({
    user: 'sam',
    host: 'localhost',
    database: 'postgres',
    port: 5432,
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'main_db'"
    );

    if (res.rowCount === 0) {
      console.log("main_db not found. Creating it...");
      await client.query('CREATE DATABASE main_db');
      console.log("main_db created successfully.");
    }
  } catch (err) {
    console.error("Error in ensuring database exists:", err);
  } finally {
    await client.end();
  }
}

const pool = new Pool({
  user: 'sam',
  host: 'localhost',
  database: 'main_db',
  port: 5432,
});

const initDb = async () => {
    await ensureDatabaseExists();
    const queryText = `
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(queryText);
    } catch(err) {
        console.error("Error in creating user table", err)
    }
};
initDb();

async function seedUser() {
  const email = 'sam@mbcet.ac.in';
  const plainPassword = 'password123';
  const saltRounds = 10;

  try {
    // 1. Create a real hash
    const hash = await bcrypt.hash(plainPassword, saltRounds);

    // 2. Insert into the database
    const queryText = 'INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING *';
    const res = await pool.query(queryText, [email, hash]);

    console.log("✅ User created successfully:", res.rows[0].email);
    console.log("🔑 You can now log in with password: password123");
  } catch (err) {
    console.error("❌ Error seeding user:", err.stack);
  }
}
seedUser();

// Export the query function so index.js can use it
module.exports = {
  query: (text, params) => pool.query(text, params),
};