import express from 'express';
import {
  getHistory,
  getAnalysisById,
  deleteAnalysis,
  getSenderScores,
  getLeaderboard,
} from '../controllers/historyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getHistory);
router.get('/sender-scores', requireAuth, getSenderScores);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', requireAuth, getAnalysisById);
router.delete('/:id', requireAuth, deleteAnalysis);

export default router;
