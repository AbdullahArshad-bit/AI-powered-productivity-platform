const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// --- CORS CONFIGURATION (Sabse Zaroori Hissa) ---
const allowedOrigins = [
  "https://ai-productivity-frontend.vercel.app", // Tumhari Live Website
  "https://ai-powered-productivity-platform-wvsoq4l7h.vercel.app", // Backend Link (Self)
  "http://localhost:5173", // Vite Localhost
  "http://localhost:3000"  // React Localhost
];

app.use(cors({
  origin: function (origin, callback) {
    // Agar koi origin nahi hai (matlab Postman ya Server-to-Server) ya list mein hai
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Logs check karne ke liye
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Cookies aur Headers allow karne ke liye
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
// ------------------------------------------------

// Middleware
app.use(express.json());

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

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

// --- SERVER START LOGIC ---

const PORT = process.env.PORT || 5000;

// Logic: Agar file direct run ho rahi hai (Local PC) to Listen karo
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel ke liye export
module.exports = app;