const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// --- CORS CONFIGURATION (Updated) ---
// Humne config ko alag variable mein rakh liya taake do jagah use kar sakein
const corsOptions = {
  origin: function (origin, callback) {
    // Logic: Localhost ya Vercel ka koi bhi link allow karo
    const isAllowed = !origin || origin.includes("localhost") || origin.includes("vercel.app");
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Cookies/Headers allow
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"] // Headers explicitly allow kiye
};

// 1. Regular Requests ke liye CORS lagao
app.use(cors(corsOptions));

// 2. Preflight (OPTIONS) Requests ke liye bhi Same CORS lagao (Ye Missing tha!)
app.options('*', cors(corsOptions));
// ------------------------------------

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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;