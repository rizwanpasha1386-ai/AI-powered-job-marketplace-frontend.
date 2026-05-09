import { Router } from 'express';
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
} from '../middleware/validationMiddleware.js';

const router = Router();

// Public routes
router.post('/signup', validateRegister, signupUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.post('/logout', verifyJWT, logoutUser);
router.get('/me', verifyJWT, getCurrentUser);

export default router;
