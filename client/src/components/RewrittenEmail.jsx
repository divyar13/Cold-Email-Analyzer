import { useState } from 'react';

export default function RewrittenEmail({ original, rewritten }) {
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard failed
    }
  };

  return (
    <div className="rounded-2xl" style={{ background: '#1E293B', border: '1px solid #334155' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #334155' }}>
        <h2 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Rewritten Email</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{ background: 'transparent', border: '1px solid #334155', color: '#64748B' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.color = '#94A3B8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#64748B'; }}
          >
            {showDiff ? 'Show Improved' : 'Compare'}
          </button>
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
            style={copied
              ? { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ADE80' }
              : { background: '#38BDF8', color: '#0F172A' }
            }
            onMouseEnter={e => { if (!copied) e.currentTarget.style.background = '#7DD3FC'; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.background = '#38BDF8'; }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="p-5">
        {showDiff ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: '#F87171' }}>Original</p>
              <div
                className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed min-h-24"
                style={{
                  background: 'rgba(248,113,113,0.05)',
                  border: '1px solid rgba(248,113,113,0.15)',
                  fontSize: '12.5px',
                  lineHeight: '1.7',
                  color: '#94A3B8',
                }}
              >
                {original}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: '#4ADE80' }}>Improved</p>
              <div
                className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed min-h-24"
                style={{
                  background: 'rgba(74,222,128,0.05)',
                  border: '1px solid rgba(74,222,128,0.15)',
                  fontSize: '12.5px',
                  lineHeight: '1.7',
                  color: '#CBD5E1',
                }}
              >
                {rewritten}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed"
            style={{
              background: 'rgba(56,189,248,0.05)',
              border: '1px solid rgba(56,189,248,0.12)',
              fontSize: '12.5px',
              lineHeight: '1.75',
              color: '#CBD5E1',
            }}
          >
            {rewritten}
          </div>
        )}
      </div>
    </div>
  );
}
