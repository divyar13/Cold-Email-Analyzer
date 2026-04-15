import { useState, useEffect } from 'react';
import axios from 'axios';

const REACTIONS = [
  { key: 'reactions.cringe', field: 'cringe', emoji: '😂', label: 'Cringe' },
  { key: 'reactions.facepalm', field: 'facepalm', emoji: '🤦', label: 'Facepalm' },
  { key: 'reactions.angry', field: 'angry', emoji: '😤', label: 'Annoyed' },
];

const scoreBadge = (score) => {
  if (score >= 75) return { bg: '#EAF2EB', color: '#6B9E6B', border: '#C4DCC8' };
  if (score >= 50) return { bg: '#F5EDD8', color: '#C49640', border: '#DEC898' };
  if (score >= 25) return { bg: '#F5EDE0', color: '#C47840', border: '#DECAB0' };
  return { bg: '#F2E8EA', color: '#C05860', border: '#E0C4C8' };
};

const TAG_LABELS = {
  recruiter: 'Recruiter',
  'cold-outreach': 'Cold Outreach',
  'follow-up': 'Follow Up',
  'offer-letter': 'Offer Letter',
};

function EmailCard({ email }) {
  const [reactions, setReactions] = useState(email.reactions || { cringe: 0, facepalm: 0, angry: 0 });
  const [upvotes, setUpvotes] = useState(email.upvotes || 0);
  const [expanded, setExpanded] = useState(false);
  const [reacting, setReacting] = useState(false);

  const text = email.originalEmail;
  const isLong = text.length > 280;
  const badge = scoreBadge(email.overallScore);

  const handleReact = async (reactionKey) => {
    if (reacting) return;
    setReacting(true);
    try {
      const res = await axios.post(`/api/community/${email._id}/react`, { reaction: reactionKey });
      setReactions(res.data.reactions);
      setUpvotes(res.data.upvotes);
    } catch {
      // failed
    } finally {
      setReacting(false);
    }
  };

  return (
    <div className="rounded-2xl flex flex-col transition-all hover:shadow-soft-md"
      style={{ background: '#FEFDFB', border: '1px solid #EDE9E3', boxShadow: '0 1px 3px rgba(42,39,36,0.04)' }}>
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex flex-wrap gap-1.5">
            {email.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: '#F0EDE8', color: '#9C9690', border: '1px solid #DDD9D0' }}>
                {TAG_LABELS[tag] || tag}
              </span>
            ))}
            {email.senderCompany && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: '#EAEEf2', color: '#7A8FA6', border: '1px solid #C4CED8' }}>
                {email.senderCompany}
              </span>
            )}
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg shrink-0 tabular-nums"
            style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
            {email.overallScore}/100
          </span>
        </div>

        <p style={{ fontSize: '12.5px', color: '#5C5750', lineHeight: '1.7' }} className="whitespace-pre-wrap">
          {expanded || !isLong ? text : text.substring(0, 280) + '...'}
        </p>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
            style={{ fontSize: '12px', color: '#7A8FA6', marginTop: '6px' }}
            className="hover:underline">
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {email.topFixes && email.topFixes.length > 0 && (
          <div className="mt-3 p-3 rounded-xl" style={{ background: '#F2E8EA', border: '1px solid #E0C4C8' }}>
            <p className="mb-1.5" style={{ fontSize: '10px', fontWeight: '700', color: '#C05860', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              What's wrong
            </p>
            <ul className="space-y-1">
              {email.topFixes.slice(0, 2).map((fix, i) => (
                <li key={i} className="flex gap-1.5" style={{ fontSize: '11.5px', color: '#9C5860' }}>
                  <span style={{ color: '#E0B4B8', flexShrink: 0 }}>·</span>{fix}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #F0EDE8' }}>
        <div className="flex items-center gap-1">
          {REACTIONS.map((r) => (
            <button key={r.key} onClick={() => handleReact(r.key)} disabled={reacting}
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all disabled:opacity-40 hover:bg-cream-200"
              style={{ fontSize: '12px' }}>
              <span>{r.emoji}</span>
              <span style={{ fontSize: '11px', color: '#9C9690' }}>{reactions[r.field] || 0}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleReact('upvotes')} disabled={reacting}
            className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all disabled:opacity-40"
            style={{ background: '#F2E8EA', color: '#C08088', fontSize: '12px' }}>
            <span>👎</span>
            <span style={{ fontSize: '11px', fontWeight: '500' }}>{upvotes}</span>
          </button>
          <span style={{ fontSize: '11px', color: '#DDD9D0' }}>{new Date(email.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function HallOfShame({ limit = null }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('upvotes');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tag, setTag] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const params = { sort, page, limit: limit || 12 };
        if (tag) params.tag = tag;
        const res = await axios.get('/api/community', { params });
        if (!cancelled) { setEmails(res.data.emails); setTotalPages(res.data.totalPages); }
      } catch {
        // failed
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEmails();
    return () => { cancelled = true; };
  }, [sort, page, tag, limit]);

  const selectCls = 'px-3 py-2 rounded-lg text-sm focus:outline-none transition-all';
  const selectStyle = { background: '#FEFDFB', border: '1px solid #DDD9D0', color: '#5C5750', fontFamily: 'Inter' };

  return (
    <div>
      {!limit && (
        <div className="flex flex-wrap gap-2 mb-5">
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className={selectCls} style={selectStyle}>
            <option value="upvotes">Most Downvoted</option>
            <option value="score">Lowest Score</option>
            <option value="recent">Most Recent</option>
          </select>
          <select value={tag} onChange={(e) => { setTag(e.target.value); setPage(1); }} className={selectCls} style={selectStyle}>
            <option value="">All types</option>
            <option value="recruiter">Recruiter</option>
            <option value="cold-outreach">Cold Outreach</option>
            <option value="offer-letter">Offer Letter</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: '#C4C0BA' }}>
          <svg className="animate-spin h-5 w-5 mx-auto mb-3" style={{ color: '#7A8FA6' }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p style={{ fontSize: '13px' }}>Loading the shame...</p>
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed #DDD9D0' }}>
          <p style={{ fontSize: '14px', color: '#C4C0BA', fontWeight: '500' }}>The Hall of Shame is empty.</p>
          <p style={{ fontSize: '12px', color: '#DDD9D0', marginTop: '4px' }}>Analyze a terrible email and share it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {emails.map((email) => <EmailCard key={email._id} email={email} />)}
        </div>
      )}

      {!limit && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          {[
            { label: '← Prev', disabled: page === 1, action: () => setPage((p) => p - 1) },
            { label: 'Next →', disabled: page === totalPages, action: () => setPage((p) => p + 1) },
          ].map(({ label, disabled, action }) => (
            <button key={label} disabled={disabled} onClick={action}
              className="px-3 py-2 rounded-lg transition-all disabled:opacity-40"
              style={{ border: '1px solid #DDD9D0', color: '#9C9690', fontSize: '13px', background: '#FEFDFB' }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
