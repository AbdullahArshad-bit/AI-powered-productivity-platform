// server.js (Modified)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/timelogs', require('./routes/timeLogRoutes'));
console.log('All routes loaded successfully!');

// Test Route
app.get('/test-projects', (req, res) => {
  res.json({ 
    message: 'Projects route is accessible', 
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: err.message });
});

// YAHAN SE app.listen HATA DIYA HAI

module.exports = app; // Sirf App export hogi