const CATEGORY_META = {
  personalization: { label: 'Personalization', accent: '#7A8FA6' },
  clarity:         { label: 'Clarity',         accent: '#C49640' },
  cta:             { label: 'CTA Strength',     accent: '#C08088' },
  tone:            { label: 'Tone',             accent: '#7A9E82' },
  redFlags:        { label: 'Red Flags',        accent: '#C05860' },
};

export default function FeedbackList({ breakdown, topFixes }) {
  return (
    <div className="rounded-2xl shadow-soft p-5" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
      <h2 className="font-serif text-base font-semibold text-ink mb-4">Detailed Feedback</h2>

      {topFixes?.length > 0 && (
        <div className="mb-4 rounded-xl p-4" style={{ background: '#FEFDFB', border: '1px solid #DEC898', borderLeft: '3px solid #C49640' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: '#C49640', textTransform: 'uppercase', marginBottom: '10px' }}>
            Top Fixes
          </p>
          <ol className="space-y-2">
            {topFixes.map((fix, i) => (
              <li key={i} className="flex gap-2.5" style={{ fontSize: '12.5px', color: '#6B5B30', lineHeight: '1.65' }}>
                <span style={{ fontWeight: '700', color: '#C49640', flexShrink: 0, minWidth: '18px' }}>{i + 1}.</span>
                <span>{fix}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="space-y-2">
        {Object.entries(breakdown).map(([key, val]) => {
          const { label, accent } = CATEGORY_META[key];
          const pct = Math.round((val.score / 20) * 100);
          return (
            <div key={key} className="rounded-xl p-4"
              style={{ background: '#FAF9F6', border: '1px solid #EDE9E3', borderLeft: `3px solid ${accent}` }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#2A2724' }}>{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: '#EDE9E3' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: accent, fontVariantNumeric: 'tabular-nums', minWidth: '30px', textAlign: 'right' }}>
                    {val.score}/20
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '12px', lineHeight: '1.7', color: '#6B6560' }}>{val.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
