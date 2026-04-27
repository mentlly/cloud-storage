const express = require("express")
const cors = require("cors")
const app = express()

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

app.get('/api/signup', (req, res) => {
    res.json({ message: 'Hello' })
})

app.listen(8000, () => {
    console.log("Started the backend at port 8000")
})