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
    <div className="rounded-2xl shadow-soft" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F0EDE8' }}>
        <h2 className="font-serif text-base font-semibold text-ink">Rewritten Email</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-cream-200"
            style={{ border: '1px solid #DDD9D0', color: '#9C9690' }}
          >
            {showDiff ? 'Show Improved' : 'Compare'}
          </button>
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
            style={{
              background: copied ? '#EAF2EB' : '#7A8FA6',
              color: copied ? '#6B9E6B' : '#FFFFFF',
              border: copied ? '1px solid #C4DCC8' : 'none',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="p-5">
        {showDiff ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="mb-2" style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: '#C08088', textTransform: 'uppercase' }}>
                Original
              </p>
              <div className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed min-h-24"
                style={{ background: '#F2E8EA', border: '1px solid #E0C4C8', fontSize: '12.5px', color: '#5C5750', lineHeight: '1.7' }}>
                {original}
              </div>
            </div>
            <div>
              <p className="mb-2" style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: '#7A9E82', textTransform: 'uppercase' }}>
                Improved
              </p>
              <div className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed min-h-24"
                style={{ background: '#EAF2EB', border: '1px solid #C4DCC8', fontSize: '12.5px', color: '#5C5750', lineHeight: '1.7' }}>
                {rewritten}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-4 whitespace-pre-wrap leading-relaxed"
            style={{ background: '#EAEEf2', border: '1px solid #C4CED8', fontSize: '12.5px', color: '#2A2724', lineHeight: '1.75' }}>
            {rewritten}
          </div>
        )}
      </div>
    </div>
  );
}
