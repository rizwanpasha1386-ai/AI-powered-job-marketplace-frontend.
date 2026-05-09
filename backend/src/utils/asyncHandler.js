/**
 * Wrapper for async route handlers to automatically catch exceptions
 * and pass them to the express error handling middleware.
 * Prevents the need to write try-catch blocks in every controller.
 * 
 * @param {Function} requestHandler - The async route handler function
 * @returns {Function} - A wrapped middleware function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
