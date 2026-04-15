import express from 'express';
import { analyzeEmail } from '../controllers/analyzeController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, analyzeEmail);

export default router;
