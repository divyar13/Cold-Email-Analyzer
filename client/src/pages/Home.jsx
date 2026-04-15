import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import EmailInput from '../components/EmailInput.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import ScoreBreakdown from '../components/ScoreBreakdown.jsx';
import FeedbackList from '../components/FeedbackList.jsx';
import RewrittenEmail from '../components/RewrittenEmail.jsx';
const Spinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export default function Home() {
  const { getToken, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [copyAll, setCopyAll] = useState(false);

  const handleAnalyze = async ({ emailText, context, senderCompany, tags }) => {
    setError(''); setLoading(true); setResult(null); setShared(false);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/analyze', { emailText, context, senderCompany, tags }, { headers });
      setResult(res.data);
      setTimeout(() => document.getElementById('results-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result?._id || sharing) return;
    setSharing(true);
    try {
      await axios.post('/api/community/share', { analysisId: result._id }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setShared(true);
    } catch {
      // failed silently
    } finally {
      setSharing(false);
    }
  };

  const handleCopyAll = async () => {
    if (!result) return;
    const text = [
      `Cold Email Analysis — Score: ${result.overallScore}/100`,
      '',
      'Score Breakdown:',
      ...Object.entries(result.breakdown).map(([k, v]) => `  ${k}: ${v.score}/20`),
      '',
      'Top Fixes:',
      ...result.topFixes.map((f, i) => `  ${i + 1}. ${f}`),
      '',
      'Rewritten Email:',
      result.rewrittenVersion,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyAll(true);
      setTimeout(() => setCopyAll(false), 2000);
    } catch {
      // failed
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-serif font-bold text-ink mb-3 leading-tight" style={{ fontSize: 'clamp(28px, 4.5vw, 48px)' }}>
          Is that email{' '}
          <em className="not-italic" style={{ color: '#7A8FA6' }}>actually good?</em>
        </h1>
        <p className="max-w-md mx-auto" style={{ fontSize: '14.5px', color: '#9C9690', lineHeight: '1.7' }}>
          Paste any cold email or recruiter message. AI scores it across 5 dimensions and rewrites it better.
        </p>
        {!user && (
          <p className="mt-2.5" style={{ fontSize: '12px', color: '#C4C0BA' }}>
            <a href="/api/auth/google" style={{ color: '#7A8FA6' }} className="hover:underline">Sign in</a>
            {' '}to save history · Guest mode available
          </p>
        )}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left: input */}
        <div className="lg:col-span-2 sticky top-20">
          <EmailInput onAnalyze={handleAnalyze} loading={loading} />
          {error && (
            <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: '#F2E8EA', border: '1px solid #E0C4C8', color: '#C05860' }}>
              {error}
            </div>
          )}
        </div>

        {/* Right: results */}
        <div className="lg:col-span-3" id="results-panel">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 rounded-2xl"
              style={{ border: '1px dashed #DDD9D0', background: '#FAF9F6' }}>
              <div style={{ color: '#7A8FA6' }} className="mb-4"><Spinner /></div>
              <p className="font-medium animate-pulse" style={{ fontSize: '14px', color: '#7A8FA6' }}>
                Reading between the lines...
              </p>
              <p style={{ fontSize: '12px', color: '#C4C0BA', marginTop: '4px' }}>This takes a few seconds</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Action bar */}
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '11px', color: '#C4C0BA' }}>Analysis complete</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAll}
                    className="text-xs px-2.5 py-1.5 rounded-lg transition-all hover:bg-cream-200"
                    style={{
                      border: '1px solid',
                      borderColor: copyAll ? '#C4DCC8' : '#DDD9D0',
                      color: copyAll ? '#7A9E82' : '#9C9690',
                      background: copyAll ? '#EAF2EB' : 'transparent',
                    }}
                  >
                    {copyAll ? '✓ Copied' : 'Copy all'}
                  </button>
                  {user && result._id && (
                    <button
                      onClick={handleShare}
                      disabled={sharing || shared}
                      className="text-xs px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      style={{
                        border: '1px solid',
                        borderColor: shared ? '#E0C4C8' : '#DDD9D0',
                        color: shared ? '#C08088' : '#9C9690',
                        background: shared ? '#F2E8EA' : 'transparent',
                      }}
                    >
                      {sharing ? 'Sharing...' : shared ? '🏛 Shared!' : '🏛 Hall of Shame'}
                    </button>
                  )}
                </div>
              </div>

              <ScoreCard score={result.overallScore} saved={result.saved} />
              <ScoreBreakdown breakdown={result.breakdown} />
              <FeedbackList breakdown={result.breakdown} topFixes={result.topFixes} />
              <RewrittenEmail original={result.originalEmail} rewritten={result.rewrittenVersion} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 rounded-2xl"
              style={{ border: '1px dashed #DDD9D0' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: '#F0EDE8', border: '1px solid #DDD9D0' }}>
                <svg className="w-5 h-5" style={{ color: '#C4C0BA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-medium" style={{ fontSize: '14px', color: '#C4C0BA' }}>Analysis will appear here</p>
              <p style={{ fontSize: '12px', color: '#DDD9D0', marginTop: '4px' }}>Paste an email and click Analyze</p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
