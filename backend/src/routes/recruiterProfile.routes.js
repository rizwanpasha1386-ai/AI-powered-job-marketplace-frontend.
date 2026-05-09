import { Router } from 'express';
import {
  createProfile,
  getOwnProfile,
  updateProfile,
} from '../controllers/recruiterProfile.controller.js';
import { verifyJWT, isRecruiter } from '../middleware/authMiddleware.js';
import { validateRecruiterProfile } from '../middleware/validationMiddleware.js';

const router = Router();

// All routes require authentication and recruiter role
router.use(verifyJWT);
router.use(isRecruiter);

router.post('/', validateRecruiterProfile, createProfile);
router.get('/me', getOwnProfile);
router.put('/me', updateProfile);

export default router;
