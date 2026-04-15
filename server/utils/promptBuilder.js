export const buildAnalyzePrompt = (emailText, context) => {
  const contextDesc =
    context === 'sender'
      ? 'The user WROTE this email. Analyze how well they crafted it.'
      : 'The user RECEIVED this email. Analyze how good or bad it is.';

  return `You are an expert in communication, hiring, and cold outreach. Analyze this email critically and thoroughly.

Email:
"""
${emailText}
"""

Context: ${contextDesc}

Score across 5 dimensions (each out of 20):
- Personalization (0-20): Is it researched or copy-paste generic? Does it reference specific details?
- Clarity (0-20): Is the purpose and ask clearly stated? Can the reader immediately understand what is being requested?
- CTA (0-20): Is the call to action specific and compelling? Does it make responding easy?
- Tone (0-20): Is the tone appropriate — not desperate, not robotic, not overly formal or too casual?
- Red Flags (0-20): Check for bond clauses, vague roles, unrealistic expectations, lowball salary, pressure tactics. Higher score = fewer red flags.

Respond ONLY in valid JSON. No markdown. No explanation outside the JSON. Use this exact structure:
{
  "overallScore": <number 0-100>,
  "breakdown": {
    "personalization": { "score": <number 0-20>, "feedback": "<2-3 sentences>" },
    "clarity": { "score": <number 0-20>, "feedback": "<2-3 sentences>" },
    "cta": { "score": <number 0-20>, "feedback": "<2-3 sentences>" },
    "tone": { "score": <number 0-20>, "feedback": "<2-3 sentences>" },
    "redFlags": { "score": <number 0-20>, "feedback": "<2-3 sentences>" }
  },
  "topFixes": ["<specific actionable fix 1>", "<specific actionable fix 2>", "<specific actionable fix 3>"],
  "rewrittenVersion": "<complete rewritten improved version of the email>"
}`;
};

export const buildComparePrompt = (email1, email2, context) => {
  const contextDesc =
    context === 'sender'
      ? 'The user sent both emails.'
      : 'The user received both emails.';

  return `You are an expert in communication and cold outreach. Compare these two emails.

Email A:
"""
${email1}
"""

Email B:
"""
${email2}
"""

Context: ${contextDesc}

Score both emails on the same 5 dimensions (each out of 20): personalization, clarity, cta, tone, redFlags.
Determine the winner. Explain specifically why the winner is better.

Respond ONLY in valid JSON. No markdown outside JSON:
{
  "emailA": {
    "overallScore": <number 0-100>,
    "breakdown": {
      "personalization": { "score": <number 0-20>, "feedback": "<string>" },
      "clarity": { "score": <number 0-20>, "feedback": "<string>" },
      "cta": { "score": <number 0-20>, "feedback": "<string>" },
      "tone": { "score": <number 0-20>, "feedback": "<string>" },
      "redFlags": { "score": <number 0-20>, "feedback": "<string>" }
    }
  },
  "emailB": {
    "overallScore": <number 0-100>,
    "breakdown": {
      "personalization": { "score": <number 0-20>, "feedback": "<string>" },
      "clarity": { "score": <number 0-20>, "feedback": "<string>" },
      "cta": { "score": <number 0-20>, "feedback": "<string>" },
      "tone": { "score": <number 0-20>, "feedback": "<string>" },
      "redFlags": { "score": <number 0-20>, "feedback": "<string>" }
    }
  },
  "winner": "A" | "B" | "tie",
  "winnerReason": "<detailed explanation>",
  "emailAAdvantages": ["<advantage 1>", "<advantage 2>"],
  "emailBAdvantages": ["<advantage 1>", "<advantage 2>"]
}`;
};
