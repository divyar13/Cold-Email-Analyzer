import { getGeminiModel } from '../config/gemini.js';
import { buildAnalyzePrompt } from '../utils/promptBuilder.js';
import EmailAnalysis from '../models/EmailAnalysis.js';

const parseGeminiResponse = (text) => {
  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  const raw = fenceMatch ? fenceMatch[1] : text;
  // Find the JSON object
  const objMatch = raw.match(/(\{[\s\S]*\})/);
  if (!objMatch) throw new Error('No JSON object found in response');
  return JSON.parse(objMatch[1]);
};

const callGemini = async (prompt) => {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const analyzeEmail = async (req, res) => {
  const { emailText, context = 'receiver', senderCompany = '', tags = [] } = req.body;

  if (!emailText || typeof emailText !== 'string') {
    return res.status(400).json({ error: 'Email text is required' });
  }

  const wordCount = emailText.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 20) {
    return res
      .status(400)
      .json({ error: 'This is too short to analyze meaningfully. Please paste at least 20 words.' });
  }

  const prompt = buildAnalyzePrompt(emailText, context);

  let parsed;
  try {
    const text = await callGemini(prompt);
    parsed = parseGeminiResponse(text);
  } catch {
    // Retry once
    try {
      const text = await callGemini(prompt);
      parsed = parseGeminiResponse(text);
    } catch (retryError) {
      console.error('Gemini error after retry:', retryError);
      return res.status(503).json({ error: 'AI analysis failed. Please try again in a moment.' });
    }
  }

  const { overallScore, breakdown, topFixes, rewrittenVersion } = parsed;
  if (
    overallScore == null ||
    !breakdown?.personalization ||
    !breakdown?.clarity ||
    !breakdown?.cta ||
    !breakdown?.tone ||
    !breakdown?.redFlags ||
    !topFixes ||
    !rewrittenVersion
  ) {
    return res.status(500).json({ error: 'Unexpected AI response format. Please try again.' });
  }

  const analysis = {
    originalEmail: emailText,
    context,
    overallScore,
    breakdown,
    topFixes,
    rewrittenVersion,
    senderCompany,
    tags,
  };

  if (req.user) {
    try {
      const saved = await EmailAnalysis.create({ ...analysis, userId: req.user._id });
      return res.json({ ...analysis, _id: saved._id, saved: true });
    } catch (dbError) {
      console.error('DB save error:', dbError);
      return res.json({ ...analysis, saved: false });
    }
  }

  res.json({ ...analysis, saved: false });
};
