const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const db = require("./modules/database");
const bcrypt = require('bcrypt');
const app = express()

app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000'
]

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result && result.rows) {
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const isMatch = await bcrypt.compare(password, user.password_hash);
          if(isMatch) {
            res.status(200).json({ message: "Login successful" });
          } else {
            res.status(401).json({ error: "Invalid email or password" });
          }
        } else {
            return res.status(401).json({error: 'Invalid email or password'});
        }
    }
    // if(result.rows.length === 0) {
    //   return res.status(401).json({error: 'Invalid email or password'});
    // }
    // const user = result.rows[0];
    // const isMatch = await bcrypt.compare(password, user.password_hash);
    // if(isMatch) {
    //   res.status(200).json({ message: "Login successful" });
    // } else {
    //   res.status(401).json({ error: "Invalid email or password" });
    // }
  } catch(err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// for secure server
// const options = {
//   key: fs.readFileSync('./localhost+3-key.pem'),
//   cert: fs.readFileSync('./localhost+3.pem')
// };
// https.createServer(options, app).listen(8000, '0.0.0.0', () => {
//   console.log('Secure Server running on https://192.168.1.35:8000');
// });

app.listen(8000, () => {
  console.log('running on port 8000');
});