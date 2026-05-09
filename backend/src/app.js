import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Configuration for CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Middleware to parse JSON payloads
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to parse cookies securely
app.use(cookieParser());

// Base Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import routers
import authRouter from './routes/auth.routes.js';
import employeeProfileRouter from './routes/employeeProfile.routes.js';
import recruiterProfileRouter from './routes/recruiterProfile.routes.js';
import jobRouter from './routes/job.routes.js';
import searchRouter from './routes/search.routes.js';
import applicationRouter from './routes/application.routes.js';
import notificationRouter from './routes/notification.routes.js';
import aiRouter from './routes/ai.routes.js';
import workSessionRouter from './routes/workSession.routes.js';
import ratingRouter from './routes/rating.routes.js';

// Mount routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/employee-profiles', employeeProfileRouter);
app.use('/api/v1/recruiter-profiles', recruiterProfileRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/work-sessions', workSessionRouter);
app.use('/api/v1/ratings', ratingRouter);

// Centralized error handling middleware should be added after all routes
app.use(errorHandler);

export { app };
