import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import compareRoutes from './routes/compareRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/community', communityRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
