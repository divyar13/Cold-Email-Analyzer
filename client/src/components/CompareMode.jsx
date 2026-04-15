import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import ScoreBreakdown from './ScoreBreakdown.jsx';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export default function CompareMode() {
  const { getToken } = useAuth();
  const [emailA, setEmailA] = useState('');
  const [emailB, setEmailB] = useState('');
  const [context, setContext] = useState('receiver');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!emailA.trim() || !emailB.trim()) { setError('Both emails are required'); return; }
    setError(''); setResult(null); setLoading(true);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/compare', { emailA, emailB, context }, { headers });
      setResult(res.data);
      setTimeout(() => document.getElementById('compare-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const winnerMeta = result
    ? result.winner === 'tie'
      ? { icon: '🤝', title: "It's a tie!", bg: '#FAF9F6', border: '#DDD9D0' }
      : { icon: '🏆', title: `Email ${result.winner} Wins!`, bg: '#EAF2EB', border: '#C4DCC8' }
    : null;

  const textareaStyle = {
    background: '#FAF9F6',
    border: '1px solid #DDD9D0',
    color: '#2A2724',
    fontSize: '13px',
    lineHeight: '1.7',
    fontFamily: 'Inter',
    resize: 'none',
    width: '100%',
    borderRadius: '12px',
    padding: '16px',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {[{ value: 'receiver', label: 'I received both' }, { value: 'sender', label: 'I sent both' }].map(({ value, label }) => (
          <button key={value} onClick={() => setContext(value)}
            className="flex-1 py-2 px-4 rounded-xl text-sm transition-all"
            style={{
              border: '1px solid',
              borderColor: context === value ? '#7A8FA6' : '#DDD9D0',
              background: context === value ? '#EAEEf2' : '#FEFDFB',
              color: context === value ? '#7A8FA6' : '#5C5750',
              fontWeight: context === value ? '500' : '400',
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[{ label: 'Email A', value: emailA, onChange: setEmailA }, { label: 'Email B', value: emailB, onChange: setEmailB }].map(({ label, value, onChange }) => (
          <div key={label}>
            <label className="block mb-2" style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', color: '#9C9690', textTransform: 'uppercase' }}>
              {label}
            </label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)}
              placeholder={`Paste ${label.toLowerCase()} here...`} rows={10} disabled={loading}
              style={{ ...textareaStyle, opacity: loading ? 0.6 : 1 }}
              onFocus={(e) => e.target.style.borderColor = '#7A8FA6'}
              onBlur={(e) => e.target.style.borderColor = '#DDD9D0'} />
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl text-xs" style={{ background: '#F2E8EA', border: '1px solid #E0C4C8', color: '#C05860' }}>
          {error}
        </div>
      )}

      <button onClick={handleCompare} disabled={loading}
        className="w-full py-2.5 rounded-xl font-medium text-sm text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: '#7A8FA6' }}>
        {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> Comparing emails...</span> : 'Compare Emails →'}
      </button>

      {result && (
        <div id="compare-results" className="mt-8 space-y-5">
          <div className="p-6 rounded-2xl text-center shadow-soft"
            style={{ background: winnerMeta.bg, border: `1px solid ${winnerMeta.border}` }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{winnerMeta.icon}</div>
            <h3 className="font-serif font-bold text-ink mb-2" style={{ fontSize: '22px' }}>{winnerMeta.title}</h3>
            <p style={{ fontSize: '13.5px', color: '#5C5750', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
              {result.winnerReason}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'A', data: result.emailA, advantages: result.emailAAdvantages },
              { key: 'B', data: result.emailB, advantages: result.emailBAdvantages },
            ].map(({ key, data, advantages }) => {
              const isWinner = result.winner === key;
              return (
                <div key={key} className="rounded-2xl p-5 shadow-soft"
                  style={{ background: '#FEFDFB', border: `2px solid ${isWinner ? '#C4DCC8' : '#EDE9E3'}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-semibold text-ink">Email {key}</h3>
                      {isWinner && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: '#EAF2EB', color: '#6B9E6B', border: '1px solid #C4DCC8' }}>
                          Winner
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold tabular-nums" style={{ fontSize: '26px', color: isWinner ? '#6B9E6B' : '#2A2724' }}>
                        {data.overallScore}
                      </span>
                      <span style={{ fontSize: '12px', color: '#C4C0BA' }}>/100</span>
                    </div>
                  </div>
                  {advantages?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#9C9690', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Strengths
                      </p>
                      <ul className="space-y-1.5">
                        {advantages.map((adv, i) => (
                          <li key={i} className="flex gap-2" style={{ fontSize: '12px', color: '#5C5750', lineHeight: '1.6' }}>
                            <span style={{ color: '#7A9E82', flexShrink: 0, marginTop: '1px' }}>✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ScoreBreakdown breakdown={result.emailA.breakdown} />
            <ScoreBreakdown breakdown={result.emailB.breakdown} />
          </div>
        </div>
      )}
    </div>
  );
}
