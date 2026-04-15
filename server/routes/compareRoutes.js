import express from 'express';
import { compareEmails } from '../controllers/compareController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, compareEmails);

export default router;
