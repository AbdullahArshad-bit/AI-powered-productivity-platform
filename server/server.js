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
console.log('✓ Auth routes loaded');
app.use('/api/tasks', require('./routes/taskRoutes'));
console.log('✓ Task routes loaded');
app.use('/api/notes', require('./routes/noteRoutes'));
console.log('✓ Note routes loaded');
app.use('/api/projects', require('./routes/projectRoutes'));
console.log('✓ Project routes loaded');
app.use('/api/tags', require('./routes/tagRoutes'));
console.log('✓ Tag routes loaded');
app.use('/api/ai', require('./routes/aiRoutes'));
console.log('✓ AI routes loaded');
app.use('/api/timelogs', require('./routes/timeLogRoutes'));
console.log('✓ Time log routes loaded');
console.log('All routes loaded successfully!');

// Test route to verify projects endpoint (before other routes)
app.get('/test-projects', (req, res) => {
  res.json({ 
    message: 'Projects route is accessible', 
    routes: ['GET /api/projects', 'POST /api/projects'],
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
