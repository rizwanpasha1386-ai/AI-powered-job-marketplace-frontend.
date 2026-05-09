import { Router } from 'express';
import {
  generateEmployeeSummary,
  getEmployeeTrustSummary,
  getRecruiterTrustSummary,
} from '../controllers/ai.controller.js';
import { verifyJWT, isRecruiter } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyJWT);

// Legacy trust summary (recruiter-only, random mock data - kept for UI card compatibility)
router.post('/employees/:id/generate-summary', isRecruiter, generateEmployeeSummary);

// ── New data-driven trust analytics endpoints (any authenticated user) ──────
router.get('/employees/:userId/trust-summary', getEmployeeTrustSummary);
router.get('/recruiters/:userId/trust-summary', getRecruiterTrustSummary);

export default router;
