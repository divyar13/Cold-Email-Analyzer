import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const CATEGORY_META = {
  personalization: { label: 'Personalization', icon: null },
  clarity: { label: 'Clarity', icon: null },
  cta: { label: 'CTA Strength', icon: null },
  tone: { label: 'Tone', icon: null },
  redFlags: { label: 'Red Flags', icon: null },
};

const getBarColor = (score) => {
  if (score >= 16) return '#6B9E6B';
  if (score >= 12) return '#7A8FA6';
  if (score >= 8) return '#C49640';
  return '#C05860';
};

export default function ScoreBreakdown({ breakdown }) {
  const chartData = Object.entries(breakdown).map(([key, val]) => ({
    subject: CATEGORY_META[key]?.label || key,
    score: val.score,
    fullMark: 20,
  }));

  return (
    <div className="rounded-2xl shadow-soft p-5" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
      <h2 className="font-serif text-base font-semibold text-ink mb-5">Score Breakdown</h2>

      <div className="mb-5" style={{ height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
            <PolarGrid stroke="#EDE9E3" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9C9690', fontFamily: 'Inter' }} />
            <Radar name="Score" dataKey="score" stroke="#7A8FA6" fill="#7A8FA6" fillOpacity={0.1} strokeWidth={1.5} />
            <Tooltip
              formatter={(value) => [`${value} / 20`, 'Score']}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #EDE9E3',
                background: '#FEFDFB',
                fontSize: '12px',
                color: '#2A2724',
                fontFamily: 'Inter',
                boxShadow: '0 4px 12px rgba(42,39,36,0.08)',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {Object.entries(breakdown).map(([key, val]) => {
          const meta = CATEGORY_META[key];
          const pct = (val.score / 20) * 100;
          const color = getBarColor(val.score);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#5C5750' }}>
                  {meta?.label || key}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '600', color, fontVariantNumeric: 'tabular-nums' }}>
                  {val.score}/20
                </span>
              </div>
              <div className="h-1 rounded-full" style={{ background: '#EDE9E3' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
