import { Router } from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getAllJobs,
  getJobById,
} from '../controllers/job.controller.js';
import { verifyJWT, isRecruiter } from '../middleware/authMiddleware.js';
import { validateJob } from '../middleware/validationMiddleware.js';

const router = Router();

// All job routes require authentication
router.use(verifyJWT);

// Routes open to all authenticated users (Employees and Recruiters)
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Routes restricted to recruiters
router.post('/', isRecruiter, validateJob, createJob);
router.get('/recruiter/me', isRecruiter, getRecruiterJobs);
router.put('/:id', isRecruiter, updateJob);
router.delete('/:id', isRecruiter, deleteJob);

export default router;
