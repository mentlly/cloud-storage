const db = require('./database');
const login = require('./login');
const bcrypt = require('bcrypt');

const signup = async (email, password) => {
    if (!email) {
      return {status: 401, message: 'Email is required'};
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {status: 401, message: 'Please enter a valid email'};
    }

    if (!password) {
      return {status: 401, message: 'Password is required'};
    } else if (password.length < 8) {
      return {status: 401, message: 'Password must be at least 8 characters'};
    }
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            return {status: 401, message: 'This email is already registered'};
        } else {
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);

            const queryText = 'INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING *';
            const res = await db.query(queryText, [email, hash]);
            return {status: 200, message: 'User registered successfully.'};
        }
    } catch(err) {
        console.error(err);
        return {status: 500, message: "Server error"};
    }
}

module.exports = { signup };