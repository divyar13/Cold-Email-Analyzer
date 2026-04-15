import mongoose from 'mongoose';

const breakdownItemSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true, min: 0, max: 20 },
    feedback: { type: String, required: true },
  },
  { _id: false }
);

const emailAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  originalEmail: { type: String, required: true },
  context: { type: String, enum: ['sender', 'receiver'], default: 'receiver' },
  overallScore: { type: Number, required: true, min: 0, max: 100 },
  breakdown: {
    personalization: breakdownItemSchema,
    clarity: breakdownItemSchema,
    cta: breakdownItemSchema,
    tone: breakdownItemSchema,
    redFlags: breakdownItemSchema,
  },
  topFixes: [{ type: String }],
  rewrittenVersion: { type: String, required: true },
  senderCompany: { type: String, default: '' },
  tags: [{ type: String, enum: ['recruiter', 'cold-outreach', 'follow-up', 'offer-letter'] }],
  isShared: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 },
  reactions: {
    cringe: { type: Number, default: 0 },
    facepalm: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

emailAnalysisSchema.index({ userId: 1, createdAt: -1 });
emailAnalysisSchema.index({ isShared: 1, upvotes: -1 });
emailAnalysisSchema.index({ senderCompany: 1 });

export default mongoose.model('EmailAnalysis', emailAnalysisSchema);
