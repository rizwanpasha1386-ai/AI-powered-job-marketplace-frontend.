import { Router } from 'express';
import { createRating, getUserRatings } from '../controllers/rating.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

// All rating routes require authentication
router.use(verifyJWT);

// Submit a new rating
router.post('/', createRating);

// Get ratings and stats for a specific user
router.get('/user/:userId', getUserRatings);

export default router;
