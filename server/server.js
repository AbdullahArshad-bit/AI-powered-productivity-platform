const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// --- SIMPLE CORS FOR LOCALHOST ---
app.use(cors({
  origin: "http://localhost:5173", // Tumhara Frontend Localhost
  credentials: true // Agar cookies use kar rahe ho to
}));

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/timelogs', require('./routes/timeLogRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running locally...');
});

// Server Start Logic (Simple)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT}`);
});