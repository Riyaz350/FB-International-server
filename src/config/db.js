const mongoose = require("mongoose");
const config = require("./config");

const connection = { isConnected: 0 };

async function dbConnect() {
    try {
        if (connection.isConnected) {
            console.log('Using existing database connection');
            return;
        }

        // Get MongoDB URI from config
        const mongoUri = config.mongodb.uri;
        
        if (!mongoUri) {
            console.error('MONGODB URI is missing. Please check your .env file');
            throw new Error('MONGODB URI is not defined');
        }

        console.log('Connecting to MongoDB...');
        const db = await mongoose.connect(mongoUri);
        
        connection.isConnected = db.connections[0].readyState;
        console.log('MongoDB connected successfully');
        
        // Log connection state
        

        // Handle connection errors
        db.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            connection.isConnected = 0;
        });

        db.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            connection.isConnected = 0;
        });

    } catch (error) {
        console.error('Database connection error:', error);
        connection.isConnected = 0;
        throw error;
    }
}
module.exports = dbConnect;