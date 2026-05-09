import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using the URI from environment variables.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection FAILED: ", error);
    process.exit(1);
  }
};

export default connectDB;
