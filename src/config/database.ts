// handles database connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fotherbys";

export const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log('mongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
};