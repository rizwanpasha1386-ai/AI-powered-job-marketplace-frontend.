import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

// All notification routes require authentication
router.use(verifyJWT);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router;
