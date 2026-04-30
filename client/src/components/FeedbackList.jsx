const CATEGORY_META = {
  personalization: { label: 'Personalization', color: '#A78BFA' },
  clarity:         { label: 'Clarity',         color: '#38BDF8' },
  cta:             { label: 'CTA Strength',     color: '#4ADE80' },
  tone:            { label: 'Tone',             color: '#FCD34D' },
  redFlags:        { label: 'Red Flags',        color: '#F87171' },
};

export default function FeedbackList({ breakdown, topFixes }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid #334155' }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: '#F1F5F9' }}>Detailed Feedback</h2>

      {topFixes?.length > 0 && (
        <div className="mb-4 rounded-xl p-4" style={{
          background: 'rgba(252,211,77,0.05)',
          border: '1px solid rgba(252,211,77,0.15)',
          borderLeft: '3px solid #FCD34D',
        }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#FCD34D' }}>Top Fixes</p>
          <ol className="space-y-2">
            {topFixes.map((fix, i) => (
              <li key={i} className="flex gap-2.5 text-xs leading-relaxed" style={{ color: '#CBD5E1' }}>
                <span className="font-bold shrink-0 min-w-[18px]" style={{ color: '#FCD34D' }}>{i + 1}.</span>
                <span>{fix}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="space-y-2">
        {Object.entries(breakdown).map(([key, val]) => {
          const { label, color } = CATEGORY_META[key];
          const pct = Math.round((val.score / 20) * 100);
          return (
            <div
              key={key}
              className="rounded-xl p-4"
              style={{
                background: '#0F172A',
                border: '1px solid #1E293B',
                borderLeft: `3px solid ${color}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: '#F1F5F9' }}>{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#1E293B' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="text-xs font-semibold tabular-nums min-w-[32px] text-right" style={{ color }}>
                    {val.score}/20
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{val.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
