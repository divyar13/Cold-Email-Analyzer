import EmailAnalysis from '../models/EmailAnalysis.js';

export const getSharedEmails = async (req, res) => {
  const { sort = 'upvotes', tag, page = 1, limit = 12 } = req.query;

  const query = { isShared: true };
  if (tag) query.tags = tag;

  const sortOptions = {
    upvotes: { upvotes: -1 },
    score: { overallScore: 1 },
    recent: { createdAt: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [emails, total] = await Promise.all([
    EmailAnalysis.find(query)
      .sort(sortOptions[sort] || { upvotes: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select(
        'originalEmail overallScore breakdown topFixes tags upvotes reactions senderCompany createdAt'
      ),
    EmailAnalysis.countDocuments(query),
  ]);

  res.json({
    emails,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
};

export const shareEmail = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Login required to share emails' });
  }

  const { analysisId } = req.body;
  if (!analysisId) {
    return res.status(400).json({ error: 'analysisId is required' });
  }

  const analysis = await EmailAnalysis.findOneAndUpdate(
    { _id: analysisId, userId: req.user._id },
    { isShared: true },
    { new: true }
  );

  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found' });
  }

  res.json({ message: 'Email shared to Hall of Shame', analysisId: analysis._id });
};

export const reactToEmail = async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body;

  const validReactions = ['upvotes', 'reactions.cringe', 'reactions.facepalm', 'reactions.angry'];
  if (!validReactions.includes(reaction)) {
    return res.status(400).json({ error: 'Invalid reaction type' });
  }

  const update = { $inc: {} };
  update.$inc[reaction] = 1;

  const analysis = await EmailAnalysis.findOneAndUpdate({ _id: id, isShared: true }, update, {
    new: true,
  });

  if (!analysis) {
    return res.status(404).json({ error: 'Email not found' });
  }

  res.json({
    upvotes: analysis.upvotes,
    reactions: analysis.reactions,
  });
};
