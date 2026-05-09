import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { app } from './app.js';

// Configure dotenv to load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start Express server after successful DB connection
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });
