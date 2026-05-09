import { Router } from 'express';
import {
  applyToJob,
  getEmployeeApplications,
  getJobApplicants,
  updateApplicationStatus,
} from '../controllers/application.controller.js';
import { verifyJWT, isEmployee, isRecruiter } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// --- Employee Routes ---
router.post('/apply/:jobId', isEmployee, applyToJob);
router.get('/me', isEmployee, getEmployeeApplications);

// --- Recruiter Routes ---
router.get('/job/:jobId', isRecruiter, getJobApplicants);
router.put('/:id/status', isRecruiter, updateApplicationStatus);

export default router;
