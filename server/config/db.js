const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Fail fast if DB is unreachable (avoid hanging requests)
        mongoose.set('bufferCommands', false);

        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            console.error('❌ MONGO_URI is not defined in .env file');
            console.error('Please set MONGO_URI in your .env file');
            console.error('For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database');
            console.error('For Local MongoDB: mongodb://localhost:27017/database');
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
            return null;
        }

        console.log('🔄 Connecting to MongoDB...');
        console.log('📍 Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide password
        
        const conn = await mongoose.connect(mongoURI, {
            // Connection options for better reliability
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Type: ${mongoURI.includes('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        
        if (error.message.includes('authentication failed')) {
            console.error('💡 Tip: Check your username and password in the connection string');
        } else if (error.message.includes('timeout')) {
            console.error('💡 Tip: Check your network connection and IP whitelist in MongoDB Atlas');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Tip: Check your MongoDB Atlas cluster URL');
        }
        
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        // In dev, don't crash the server; allow routes to respond with errors.
        return null;
    }
};

module.exports = connectDB;
