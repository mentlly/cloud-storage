const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const db = require("./modules/database");
const login = require("./modules/login");
const signup = require("./modules/signup");
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
  const result = await login.login(email, password);
  return res.status(result.status).json({message: result.message});
});

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const result = await signup.signup(email, password);
  return res.status(result.status).json({message: result.message});
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