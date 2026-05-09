/**
 * Centralized error handling middleware.
 * Formats the error response consistently across the application.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose bad ObjectId error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    // Only show stack trace in development mode for debugging
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { errorHandler };
