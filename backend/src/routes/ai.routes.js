import { Router } from 'express';
import { generateEmployeeSummary } from '../controllers/ai.controller.js';
import { verifyJWT, isRecruiter } from '../middleware/authMiddleware.js';

const router = Router();

// All AI generation routes require authentication and recruiter role
router.use(verifyJWT);
router.use(isRecruiter);

// Generate Trust Summary Endpoint
router.post('/employees/:id/generate-summary', generateEmployeeSummary);

export default router;
