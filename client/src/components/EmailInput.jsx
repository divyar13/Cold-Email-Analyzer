import { useState, useRef } from 'react';

const TAG_OPTIONS = ['recruiter', 'cold-outreach', 'follow-up', 'offer-letter'];

const EXAMPLE_EMAILS = [
  `Hi,

I came across your profile and thought you'd be a great fit for an exciting opportunity at our company. We are looking for talented individuals to join our dynamic and fast-growing team.

The role offers a competitive salary, great benefits, and opportunities for growth. We work with Fortune 500 clients and have a collaborative culture.

Would you be open to a quick 15-minute call this week to explore this further?

Best regards,
Sarah — HR Team`,
  `Dear Candidate,

I hope this message finds you well. I'm reaching out regarding a fantastic job opportunity that aligns perfectly with your background.

We have multiple openings across various departments and your profile stood out to us. Please send your updated resume and we will review it within 24-48 hours.

Looking forward to connecting!

Thanks,
The Recruitment Team`,
];

export default function EmailInput({ onAnalyze, loading }) {
  const [emailText, setEmailText] = useState('');
  const [context, setContext] = useState('receiver');
  const [senderCompany, setSenderCompany] = useState('');
  const [tags, setTags] = useState([]);
  const textareaRef = useRef(null);

  const toggleTag = (tag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailText.trim() || loading) return;
    onAnalyze({ emailText, context, senderCompany, tags });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit)
      onAnalyze({ emailText, context, senderCompany, tags });
  };

  const loadExample = () => {
    setEmailText(EXAMPLE_EMAILS[Math.floor(Math.random() * EXAMPLE_EMAILS.length)]);
    textareaRef.current?.focus();
  };

  const wordCount = emailText.trim() ? emailText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = emailText.length;
  const canSubmit = wordCount >= 20 && !loading;

  const inputBase = {
    background: '#0F172A',
    border: '1px solid #334155',
    color: '#F1F5F9',
  };

  return (
    <div className="rounded-2xl" style={{ background: '#1E293B', border: '1px solid #334155' }}>
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #334155' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Paste your email</h2>
          <button
            type="button"
            onClick={loadExample}
            disabled={loading}
            className="text-xs font-medium transition-colors disabled:opacity-40"
            style={{ color: '#64748B' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#38BDF8'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
          >
            Try an example
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste any cold email, recruiter message, or outreach email here..."
            rows={11}
            disabled={loading}
            className="w-full resize-none rounded-xl p-4 text-sm leading-relaxed transition-all disabled:opacity-50 focus:outline-none"
            style={{
              ...inputBase,
              fontSize: '13.5px',
              lineHeight: '1.7',
              caretColor: '#38BDF8',
            }}
            onFocus={e => { e.target.style.borderColor = '#38BDF8'; e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#334155'; e.target.style.boxShadow = 'none'; }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs pointer-events-none select-none" style={{ color: '#475569' }}>
            <span>{charCount}c</span>
            <span>·</span>
            <span style={wordCount > 0 && wordCount < 20 ? { color: '#FCD34D' } : {}}>
              {wordCount}w{wordCount > 0 && wordCount < 20 && ` · need ${20 - wordCount} more`}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: '#475569' }}>
              I am the
            </label>
            <div className="flex gap-2">
              {[{ value: 'receiver', label: 'Receiver' }, { value: 'sender', label: 'Sender' }].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setContext(value)}
                  className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  style={context === value
                    ? { background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: '#38BDF8' }
                    : { background: '#0F172A', border: '1px solid #334155', color: '#64748B' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: '#475569' }}>
              Sender company
            </label>
            <input
              type="text"
              value={senderCompany}
              onChange={(e) => setSenderCompany(e.target.value)}
              placeholder="e.g. Google, Infosys..."
              className="w-full py-2 px-3 rounded-lg text-sm focus:outline-none transition-all"
              style={{ ...inputBase }}
              onFocus={e => { e.target.style.borderColor = '#38BDF8'; e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = '#334155'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: '#475569' }}>
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={tags.includes(tag)
                  ? { background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: '#38BDF8' }
                  : { background: 'transparent', border: '1px solid #334155', color: '#64748B' }
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-2.5 px-6 rounded-xl text-sm font-semibold transition-all"
          style={canSubmit
            ? { background: '#38BDF8', color: '#0F172A' }
            : { background: '#1E293B', color: '#475569', cursor: 'not-allowed', border: '1px solid #334155' }
          }
          onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = '#7DD3FC'; }}
          onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = '#38BDF8'; }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              Analyze Email
              <span className="text-xs" style={{ opacity: 0.5 }}>⌘↵</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
