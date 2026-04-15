import { useEffect, useState } from 'react';

const getScoreMeta = (score) => {
  if (score >= 80) return { label: 'Excellent', color: '#6B9E6B', light: '#EAF2EB', border: '#C4DCC8', desc: 'Well-crafted and effective — strong across the board.' };
  if (score >= 65) return { label: 'Good',      color: '#7A8FA6', light: '#EAEEf2', border: '#C4CED8', desc: 'Solid email with a few areas to sharpen.' };
  if (score >= 45) return { label: 'Average',   color: '#C49640', light: '#F5EDD8', border: '#DEC898', desc: 'Decent foundation but needs meaningful work.' };
  if (score >= 25) return { label: 'Poor',      color: '#C47840', light: '#F5EDE0', border: '#DECAB0', desc: 'Significant issues — a rewrite is recommended.' };
  return             { label: 'Terrible',   color: '#C05860', light: '#F2E8EA', border: '#E0C4C8', desc: 'Needs to be rebuilt from scratch.' };
};

export default function ScoreCard({ score, saved }) {
  const [displayScore, setDisplayScore] = useState(0);
  const meta = getScoreMeta(score);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    setDisplayScore(0);
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplayScore(Math.min(Math.round((score / steps) * step), score));
      if (step >= steps) clearInterval(timer);
    }, 1000 / steps);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="rounded-2xl shadow-soft p-5" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', color: '#9C9690', textTransform: 'uppercase' }}>
          Overall Score
        </p>
        {saved && (
          <span className="flex items-center gap-1" style={{ fontSize: '11px', color: '#7A9E82' }}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width="112" height="112" className="-rotate-90">
            <circle cx="56" cy="56" r={radius} fill="none" stroke="#EDE9E3" strokeWidth="6" />
            <circle cx="56" cy="56" r={radius} fill="none"
              stroke={meta.color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.05s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif font-bold tabular-nums leading-none" style={{ fontSize: '34px', color: meta.color }}>
              {displayScore}
            </span>
            <span style={{ fontSize: '11px', color: '#C4C0BA', marginTop: '1px' }}>/100</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2.5"
            style={{ background: meta.light, color: meta.color, border: `1px solid ${meta.border}` }}>
            {meta.label}
          </span>
          <div className="h-1.5 rounded-full mb-2.5" style={{ background: '#EDE9E3' }}>
            <div className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${displayScore}%`, background: meta.color }} />
          </div>
          <p style={{ fontSize: '12px', color: '#9C9690', lineHeight: '1.65' }}>{meta.desc}</p>
        </div>
      </div>
    </div>
  );
}
