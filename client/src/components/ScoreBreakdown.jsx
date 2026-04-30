import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const CATEGORY_META = {
  personalization: { label: 'Personalization' },
  clarity:         { label: 'Clarity' },
  cta:             { label: 'CTA Strength' },
  tone:            { label: 'Tone' },
  redFlags:        { label: 'Red Flags' },
};

const getBarColor = (score) => {
  if (score >= 16) return '#4ADE80';
  if (score >= 12) return '#38BDF8';
  if (score >= 8)  return '#FCD34D';
  return '#F87171';
};

export default function ScoreBreakdown({ breakdown }) {
  const chartData = Object.entries(breakdown).map(([key, val]) => ({
    subject: CATEGORY_META[key]?.label || key,
    score: val.score,
    fullMark: 20,
  }));

  return (
    <div className="rounded-2xl p-5" style={{ background: '#1E293B', border: '1px solid #334155' }}>
      <h2 className="text-sm font-semibold mb-5" style={{ color: '#F1F5F9' }}>Score Breakdown</h2>

      <div className="mb-5" style={{ height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
            <PolarGrid stroke="#1E293B" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'Inter' }} />
            <Radar name="Score" dataKey="score" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.1} strokeWidth={1.5} />
            <Tooltip
              formatter={(value) => [`${value} / 20`, 'Score']}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #334155',
                background: '#0F172A',
                fontSize: '12px',
                color: '#F1F5F9',
                fontFamily: 'Inter',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {Object.entries(breakdown).map(([key, val]) => {
          const label = CATEGORY_META[key]?.label || key;
          const pct = (val.score / 20) * 100;
          const color = getBarColor(val.score);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{label}</span>
                <span className="text-xs font-semibold tabular-nums" style={{ color }}>{val.score}/20</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: '#0F172A' }}>
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
