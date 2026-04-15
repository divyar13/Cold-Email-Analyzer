import express from 'express';
import { googleAuth, googleCallback, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/me', requireAuth, getMe);

export default router;
