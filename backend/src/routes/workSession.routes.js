import { Router } from 'express';
import { 
  getMyWorkSessions, 
  getWorkSessionDetails, 
  updateWorkSessionStatus, 
  sendMessage, 
  getMessages 
} from '../controllers/workSession.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

// All work session routes require authentication
router.use(verifyJWT);

// Session core routes
router.get('/', getMyWorkSessions);
router.get('/:id', getWorkSessionDetails);
router.put('/:id/status', updateWorkSessionStatus);

// Session messaging routes
router.post('/:id/messages', sendMessage);
router.get('/:id/messages', getMessages);

export default router;
