import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Middleware to protect routes and verify JWT token from cookies or headers
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

/**
 * Middleware to restrict access to employees only
 */
export const isEmployee = (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
    next();
  } else {
    res.status(403);
    next(new Error('Access denied. Only employees can perform this action.'));
  }
};

/**
 * Middleware to restrict access to recruiters only
 */
export const isRecruiter = (req, res, next) => {
  if (req.user && req.user.role === 'recruiter') {
    next();
  } else {
    res.status(403);
    next(new Error('Access denied. Only recruiters can perform this action.'));
  }
};
