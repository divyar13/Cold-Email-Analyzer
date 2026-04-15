import EmailAnalysis from '../models/EmailAnalysis.js';

export const getHistory = async (req, res) => {
  const { keyword, minScore, maxScore, startDate, endDate, tag, page = 1, limit = 10 } = req.query;

  const query = { userId: req.user._id };

  if (keyword) {
    query.$or = [
      { originalEmail: { $regex: keyword, $options: 'i' } },
      { senderCompany: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (minScore || maxScore) {
    query.overallScore = {};
    if (minScore) query.overallScore.$gte = Number(minScore);
    if (maxScore) query.overallScore.$lte = Number(maxScore);
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (tag) {
    query.tags = tag;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [analyses, total] = await Promise.all([
    EmailAnalysis.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-rewrittenVersion -__v'),
    EmailAnalysis.countDocuments(query),
  ]);

  res.json({
    analyses,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
};

export const getAnalysisById = async (req, res) => {
  const analysis = await EmailAnalysis.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found' });
  }

  res.json(analysis);
};

export const deleteAnalysis = async (req, res) => {
  const result = await EmailAnalysis.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!result) {
    return res.status(404).json({ error: 'Analysis not found' });
  }

  res.json({ message: 'Analysis deleted' });
};

export const getSenderScores = async (req, res) => {
  const senderScores = await EmailAnalysis.aggregate([
    {
      $match: {
        userId: req.user._id,
        senderCompany: { $ne: '', $exists: true },
      },
    },
    {
      $group: {
        _id: '$senderCompany',
        avgScore: { $avg: '$overallScore' },
        count: { $sum: 1 },
        minScore: { $min: '$overallScore' },
        maxScore: { $max: '$overallScore' },
      },
    },
    { $sort: { avgScore: 1 } },
    { $limit: 20 },
  ]);

  res.json(senderScores);
};

export const getLeaderboard = async (req, res) => {
  const leaderboard = await EmailAnalysis.aggregate([
    { $match: { senderCompany: { $ne: '', $exists: true } } },
    {
      $group: {
        _id: '$senderCompany',
        avgScore: { $avg: '$overallScore' },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gte: 2 } } },
    { $sort: { avgScore: 1 } },
    { $limit: 10 },
  ]);

  res.json(leaderboard);
};
