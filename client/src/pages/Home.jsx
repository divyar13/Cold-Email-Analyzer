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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight leading-tight" style={{ color: '#F1F5F9' }}>
          Is that email{' '}
          <span style={{ color: '#38BDF8' }}>actually good?</span>
        </h1>
        <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#64748B' }}>
          Paste any cold email or recruiter message. AI scores it across 5 dimensions and rewrites it better.
        </p>
        {!user && (
          <p className="mt-2 text-xs" style={{ color: '#475569' }}>
            <a href="/api/auth/google" className="font-medium hover:underline" style={{ color: '#38BDF8' }}>Sign in</a>
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
            <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171' }}>
              {error}
            </div>
          )}
        </div>

        {/* Right: results */}
        <div className="lg:col-span-3" id="results-panel">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 rounded-2xl" style={{ border: '1px dashed #334155', background: '#1E293B' }}>
              <div className="mb-4" style={{ color: '#38BDF8' }}><Spinner /></div>
              <p className="font-medium text-sm animate-pulse" style={{ color: '#94A3B8' }}>Reading between the lines...</p>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>This takes a few seconds</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Action bar */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#475569' }}>Analysis complete</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAll}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={copyAll
                      ? { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ADE80' }
                      : { background: 'transparent', border: '1px solid #334155', color: '#64748B' }
                    }
                  >
                    {copyAll ? '✓ Copied' : 'Copy all'}
                  </button>
                  {user && result._id && (
                    <button
                      onClick={handleShare}
                      disabled={sharing || shared}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                      style={shared
                        ? { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171' }
                        : { background: 'transparent', border: '1px solid #334155', color: '#64748B' }
                      }
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
            <div className="flex flex-col items-center justify-center py-28 rounded-2xl" style={{ border: '1px dashed #334155' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#1E293B', border: '1px solid #334155' }}>
                <svg className="w-5 h-5" style={{ color: '#475569' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-medium text-sm" style={{ color: '#475569' }}>Analysis will appear here</p>
              <p className="text-xs mt-1" style={{ color: '#334155' }}>Paste an email and click Analyze</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
