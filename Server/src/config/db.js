import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexusmarket';
    
    console.log('⏳ Connecting to MongoDB...');
    
    // We await the connection completely before letting the code move forward
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s instead of 10s) if the server is unreachable
    });

    console.log('🚀 MongoDB connected successfully.');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    
    // CRITICAL: If your app can't talk to the DB, it shouldn't be running.
    // Exit the Node process with a failure code (1)
    process.exit(1);
  }
};

export default connectDB;