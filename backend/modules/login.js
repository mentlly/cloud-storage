const bcrypt = require("bcrypt");
const db = require('./database');

const login = async (email, password) => {
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
        if (result && result.rows) {
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password_hash);
                if(isMatch) {
                    return {status: 200, message: "Login successful"};
                } else {
                    return {status: 401, message: "Invalid email or password"};
                }
            } else {
                return {status: 401, message: "Invalid email or password"};
            }
        }
    } catch(err) {
        console.error(err);
        return {status: 500, message: "Server error"}
    }
}

module.exports = { login }