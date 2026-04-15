import { getGeminiModel } from '../config/gemini.js';
import { buildComparePrompt } from '../utils/promptBuilder.js';

const parseGeminiResponse = (text) => {
  const fenceMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  const raw = fenceMatch ? fenceMatch[1] : text;
  const objMatch = raw.match(/(\{[\s\S]*\})/);
  if (!objMatch) throw new Error('No JSON object found in response');
  return JSON.parse(objMatch[1]);
};

const callGemini = async (prompt) => {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const compareEmails = async (req, res) => {
  const { emailA, emailB, context = 'receiver' } = req.body;

  if (!emailA || !emailB) {
    return res.status(400).json({ error: 'Both emails are required for comparison' });
  }

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
  if (countWords(emailA) < 10 || countWords(emailB) < 10) {
    return res.status(400).json({
      error: 'Both emails need at least 10 words to compare meaningfully',
    });
  }

  const prompt = buildComparePrompt(emailA, emailB, context);

  let parsed;
  try {
    const text = await callGemini(prompt);
    parsed = parseGeminiResponse(text);
  } catch {
    try {
      const text = await callGemini(prompt);
      parsed = parseGeminiResponse(text);
    } catch (retryError) {
      console.error('Gemini compare error after retry:', retryError);
      return res.status(503).json({ error: 'AI comparison failed. Please try again.' });
    }
  }

  res.json(parsed);
};
