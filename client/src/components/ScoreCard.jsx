import { useEffect, useState } from 'react';

const getScoreMeta = (score) => {
  if (score >= 80) return { label: 'Excellent', color: '#4ADE80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)',  desc: 'Well-crafted and effective — strong across the board.' };
  if (score >= 65) return { label: 'Good',      color: '#38BDF8', bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)',  desc: 'Solid email with a few areas to sharpen.' };
  if (score >= 45) return { label: 'Average',   color: '#FCD34D', bg: 'rgba(252,211,77,0.08)',  border: 'rgba(252,211,77,0.2)',  desc: 'Decent foundation but needs meaningful work.' };
  if (score >= 25) return { label: 'Poor',      color: '#FB923C', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.2)',  desc: 'Significant issues — a rewrite is recommended.' };
  return             { label: 'Terrible',   color: '#F87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', desc: 'Needs to be rebuilt from scratch.' };
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
    <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid #334155' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#475569' }}>
          Overall Score
        </p>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#4ADE80' }}>
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
            <circle cx="56" cy="56" r={radius} fill="none" stroke="#0F172A" strokeWidth="7" />
            <circle cx="56" cy="56" r={radius} fill="none"
              stroke={meta.color} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.05s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums leading-none" style={{ color: meta.color }}>
              {displayScore}
            </span>
            <span className="text-xs mt-0.5" style={{ color: '#475569' }}>/100</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
          >
            {meta.label}
          </span>
          <div className="h-1.5 rounded-full mb-3" style={{ background: '#0F172A' }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${displayScore}%`, background: meta.color }}
            />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{meta.desc}</p>
        </div>
      </div>
    </div>
  );
}
