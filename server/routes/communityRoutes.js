import express from 'express';
import { getSharedEmails, shareEmail, reactToEmail } from '../controllers/communityController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getSharedEmails);
router.post('/share', requireAuth, shareEmail);
router.post('/:id/react', optionalAuth, reactToEmail);

export default router;
