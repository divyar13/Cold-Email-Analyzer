import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const scoreBadge = (score) => {
  if (score >= 75) return { bg: '#EAF2EB', color: '#6B9E6B', border: '#C4DCC8' };
  if (score >= 50) return { bg: '#F5EDD8', color: '#C49640', border: '#DEC898' };
  if (score >= 25) return { bg: '#F5EDE0', color: '#C47840', border: '#DECAB0' };
  return { bg: '#F2E8EA', color: '#C05860', border: '#E0C4C8' };
};

const TAG_COLORS = {
  recruiter:       { bg: '#EAEEf2', color: '#7A8FA6', border: '#C4CED8' },
  'cold-outreach': { bg: '#EAEEf2', color: '#7A8FA6', border: '#C4CED8' },
  'follow-up':     { bg: '#EAF2EB', color: '#7A9E82', border: '#C4DCC8' },
  'offer-letter':  { bg: '#F5EDD8', color: '#C49640', border: '#DEC898' },
};

const inputCls = "w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all";
const inputStyle = { background: '#FEFDFB', border: '1px solid #DDD9D0', color: '#2A2724', fontFamily: 'Inter' };

export default function HistoryList() {
  const { getToken } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', minScore: '', maxScore: '', tag: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.minScore) params.minScore = filters.minScore;
      if (filters.maxScore) params.maxScore = filters.maxScore;
      if (filters.tag) params.tag = filters.tag;
      const res = await axios.get('/api/history', { params, headers: { Authorization: `Bearer ${getToken()}` } });
      setAnalyses(res.data.analyses);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      // failed
    } finally {
      setLoading(false);
    }
  }, [page, filters, getToken]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await axios.delete(`/api/history/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
      setTotal((t) => t - 1);
    } catch {
      // failed
    }
  };

  const hasFilters = filters.keyword || filters.minScore || filters.maxScore || filters.tag;

  return (
    <div>
      {/* Filter bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); setPage(1); fetchHistory(); }}
        className="rounded-2xl p-4 mb-5 shadow-soft"
        style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}
      >
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="Search keyword..." value={filters.keyword}
            onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
            className={`${inputCls} flex-1 min-w-40`} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#7A8FA6'}
            onBlur={(e) => e.target.style.borderColor = '#DDD9D0'} />

          <select value={filters.tag} onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
            className={`${inputCls} w-36`} style={inputStyle}>
            <option value="">All tags</option>
            <option value="recruiter">Recruiter</option>
            <option value="cold-outreach">Cold Outreach</option>
            <option value="follow-up">Follow Up</option>
            <option value="offer-letter">Offer Letter</option>
          </select>

          <div className="flex gap-2">
            <input type="number" placeholder="Min" min="0" max="100" value={filters.minScore}
              onChange={(e) => setFilters((f) => ({ ...f, minScore: e.target.value }))}
              className={`${inputCls} w-20`} style={{ ...inputStyle, textAlign: 'center' }} />
            <input type="number" placeholder="Max" min="0" max="100" value={filters.maxScore}
              onChange={(e) => setFilters((f) => ({ ...f, maxScore: e.target.value }))}
              className={`${inputCls} w-20`} style={{ ...inputStyle, textAlign: 'center' }} />
          </div>

          <button type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: '#7A8FA6' }}>
            Search
          </button>

          {hasFilters && (
            <button type="button"
              onClick={() => { setFilters({ keyword: '', minScore: '', maxScore: '', tag: '' }); setPage(1); }}
              className="px-3 py-2 rounded-lg text-sm transition-all"
              style={{ border: '1px solid #DDD9D0', color: '#9C9690' }}>
              Clear
            </button>
          )}
        </div>
      </form>

      {total > 0 && (
        <p style={{ fontSize: '11px', color: '#C4C0BA', marginBottom: '10px' }}>
          {total} {total === 1 ? 'analysis' : 'analyses'} found
        </p>
      )}

      {loading ? (
        <div className="text-center py-16">
          <svg className="animate-spin h-5 w-5 mx-auto mb-3" style={{ color: '#7A8FA6' }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p style={{ fontSize: '13px', color: '#C4C0BA' }}>Loading history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed #DDD9D0' }}>
          <p style={{ fontSize: '14px', color: '#C4C0BA', marginBottom: '6px' }}>No analyses found.</p>
          <Link to="/" style={{ fontSize: '12px', color: '#7A8FA6' }} className="hover:underline">
            Analyze your first email →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {analyses.map((a) => {
            const badge = scoreBadge(a.overallScore);
            return (
              <div key={a._id} className="rounded-xl p-4 group transition-all hover:shadow-soft"
                style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
                <div className="flex items-start gap-4">
                  {/* Score badge */}
                  <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl"
                    style={{ background: badge.bg, border: `1px solid ${badge.border}` }}>
                    <span className="font-bold tabular-nums leading-none" style={{ fontSize: '16px', color: badge.color }}>
                      {a.overallScore}
                    </span>
                    <span style={{ fontSize: '9px', color: badge.color, opacity: 0.7 }}>/100</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="mb-2" style={{ fontSize: '12.5px', color: '#5C5750', lineHeight: '1.65',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {a.originalEmail}
                    </p>
                    <div className="flex items-center flex-wrap gap-1.5">
                      {a.senderCompany && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#F0EDE8', color: '#9C9690', border: '1px solid #DDD9D0' }}>
                          {a.senderCompany}
                        </span>
                      )}
                      {a.tags?.map((tag) => {
                        const t = TAG_COLORS[tag] || { bg: '#F0EDE8', color: '#9C9690', border: '#DDD9D0' };
                        return (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}` }}>
                            {tag}
                          </span>
                        );
                      })}
                      <span style={{ fontSize: '11px', color: '#C4C0BA' }}>
                        {new Date(a.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button onClick={() => handleDelete(a._id)}
                    className="opacity-0 group-hover:opacity-100 transition-all shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50"
                    style={{ color: '#C4C0BA' }} title="Delete">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-5">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40 hover:bg-cream-200"
            style={{ border: '1px solid #DDD9D0', color: '#9C9690' }}>
            ← Prev
          </button>
          <span style={{ fontSize: '12px', color: '#9C9690' }}>
            {page} <span style={{ color: '#DDD9D0' }}>of</span> {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40 hover:bg-cream-200"
            style={{ border: '1px solid #DDD9D0', color: '#9C9690' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
