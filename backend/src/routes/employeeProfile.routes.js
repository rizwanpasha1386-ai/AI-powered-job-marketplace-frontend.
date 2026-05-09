import { Router } from 'express';
import {
  createProfile,
  getOwnProfile,
  updateProfile,
} from '../controllers/employeeProfile.controller.js';
import { verifyJWT, isEmployee } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication and employee role
router.use(verifyJWT);
router.use(isEmployee);

router.post('/', createProfile);
router.get('/me', getOwnProfile);
router.put('/me', updateProfile);

export default router;
