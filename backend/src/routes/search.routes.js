import { Router } from 'express';
import { searchEmployees } from '../controllers/search.controller.js';
import { verifyJWT, isRecruiter } from '../middleware/authMiddleware.js';

const router = Router();

// All search routes require authentication and recruiter role
router.use(verifyJWT);
router.use(isRecruiter);

// Search nearby employees
router.get('/employees', searchEmployees);

export default router;
