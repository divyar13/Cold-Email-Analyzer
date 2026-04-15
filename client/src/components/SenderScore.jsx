import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const getBarFill = (score) => {
  if (score >= 75) return '#6B9E6B';
  if (score >= 50) return '#C49640';
  if (score >= 25) return '#C47840';
  return '#C05860';
};

const getScoreLabel = (score) => {
  if (score >= 75) return { label: 'Good', bg: '#EAF2EB', color: '#6B9E6B', border: '#C4DCC8' };
  if (score >= 50) return { label: 'Average', bg: '#F5EDD8', color: '#C49640', border: '#DEC898' };
  if (score >= 25) return { label: 'Poor', bg: '#F5EDE0', color: '#C47840', border: '#DECAB0' };
  return { label: 'Terrible', bg: '#F2E8EA', color: '#C05860', border: '#E0C4C8' };
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl p-3" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3', boxShadow: '0 4px 12px rgba(42,39,36,0.08)', fontSize: '12px', fontFamily: 'Inter' }}>
      <p style={{ fontWeight: '600', color: '#2A2724', marginBottom: '4px' }}>{d.name}</p>
      <p style={{ color: '#9C9690' }}>Avg: <strong style={{ color: '#2A2724' }}>{d.score}/100</strong></p>
      <p style={{ color: '#C4C0BA' }}>{d.count} email{d.count !== 1 ? 's' : ''}</p>
    </div>
  );
};

export default function SenderScore() {
  const { getToken } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/history/sender-scores', { headers: { Authorization: `Bearer ${getToken()}` } });
        setData(res.data);
      } catch {
        // failed
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  if (loading) return (
    <div className="rounded-2xl p-6 text-center shadow-soft" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3', fontSize: '13px', color: '#C4C0BA' }}>
      Loading sender scores...
    </div>
  );

  if (data.length === 0) return (
    <div className="rounded-2xl p-6 text-center shadow-soft" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
      <p style={{ fontSize: '13px', color: '#C4C0BA' }}>No sender data yet.</p>
      <p style={{ fontSize: '11px', color: '#DDD9D0', marginTop: '4px' }}>Add a company name when analyzing to track reputation.</p>
    </div>
  );

  const chartData = data.map((d) => ({ name: d._id, score: Math.round(d.avgScore), count: d.count }));

  return (
    <div className="rounded-2xl p-5 shadow-soft" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
      <p style={{ fontSize: '11px', color: '#C4C0BA', marginBottom: '20px' }}>Companies ranked by average email quality</p>
      <div style={{ height: Math.max(180, chartData.length * 44) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#C4C0BA', fontFamily: 'Inter' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9C9690', fontFamily: 'Inter' }} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[0, 5, 5, 0]} barSize={14}>
              {chartData.map((entry, idx) => <Cell key={idx} fill={getBarFill(entry.score)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((d) => {
          const { label, bg, color, border } = getScoreLabel(d.avgScore);
          return (
            <div key={d._id} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: '#FAF9F6', border: '1px solid #EDE9E3' }}>
              <div>
                <span style={{ fontWeight: '600', color: '#2A2724', fontSize: '13px' }}>{d._id}</span>
                <span style={{ color: '#C4C0BA', fontSize: '11px', marginLeft: '8px' }}>
                  {d.count} email{d.count !== 1 ? 's' : ''} · {d.minScore}–{d.maxScore}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: bg, color, border: `1px solid ${border}` }}>{label}</span>
                <span style={{ fontWeight: '700', color: '#2A2724', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                  {Math.round(d.avgScore)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
