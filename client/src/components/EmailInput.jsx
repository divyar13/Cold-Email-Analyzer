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

  return (
    <div className="rounded-2xl shadow-soft" style={{ background: '#FEFDFB', border: '1px solid #EDE9E3' }}>
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #F0EDE8' }}>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-ink">Paste your email</h2>
          <button
            type="button"
            onClick={loadExample}
            disabled={loading}
            className="text-xs text-ink-muted hover:text-slate-warm transition-colors disabled:opacity-40"
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
            className="w-full resize-none rounded-xl p-4 text-sm text-ink leading-relaxed placeholder:text-ink-faint transition-all disabled:opacity-60 focus:outline-none"
            style={{
              background: '#FAF9F6',
              border: '1px solid #DDD9D0',
              fontSize: '13.5px',
              lineHeight: '1.7',
            }}
            onFocus={(e) => e.target.style.borderColor = '#7A8FA6'}
            onBlur={(e) => e.target.style.borderColor = '#DDD9D0'}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2" style={{ fontSize: '11px', color: '#C4C0BA' }}>
            <span>{charCount}c</span>
            <span>·</span>
            <span className={wordCount > 0 && wordCount < 20 ? 'text-rose-dust' : ''}>
              {wordCount}w{wordCount > 0 && wordCount < 20 && ` · need ${20 - wordCount} more`}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block mb-2" style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', color: '#9C9690', textTransform: 'uppercase' }}>
              I am the
            </label>
            <div className="flex gap-2">
              {[{ value: 'receiver', label: 'Receiver' }, { value: 'sender', label: 'Sender' }].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setContext(value)}
                  className="flex-1 py-2 px-3 rounded-lg text-sm transition-all"
                  style={{
                    border: '1px solid',
                    borderColor: context === value ? '#7A8FA6' : '#DDD9D0',
                    background: context === value ? '#EAEEf2' : '#FEFDFB',
                    color: context === value ? '#7A8FA6' : '#5C5750',
                    fontWeight: context === value ? '500' : '400',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block mb-2" style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', color: '#9C9690', textTransform: 'uppercase' }}>
              Sender company
            </label>
            <input
              type="text"
              value={senderCompany}
              onChange={(e) => setSenderCompany(e.target.value)}
              placeholder="e.g. Google, Infosys..."
              className="w-full py-2 px-3 rounded-lg text-sm text-ink placeholder:text-ink-faint focus:outline-none transition-all"
              style={{ background: '#FEFDFB', border: '1px solid #DDD9D0' }}
              onFocus={(e) => e.target.style.borderColor = '#7A8FA6'}
              onBlur={(e) => e.target.style.borderColor = '#DDD9D0'}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2" style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', color: '#9C9690', textTransform: 'uppercase' }}>
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="px-3 py-1 rounded-full text-xs transition-all"
                style={{
                  border: '1px solid',
                  borderColor: tags.includes(tag) ? '#C08088' : '#DDD9D0',
                  background: tags.includes(tag) ? '#F2E8EA' : '#FEFDFB',
                  color: tags.includes(tag) ? '#C08088' : '#9C9690',
                  fontWeight: tags.includes(tag) ? '500' : '400',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-2.5 px-6 rounded-xl text-sm font-medium transition-all disabled:cursor-not-allowed"
          style={{
            background: canSubmit ? '#7A8FA6' : '#EDE9E3',
            color: canSubmit ? '#FFFFFF' : '#C4C0BA',
          }}
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
              <span style={{ opacity: 0.6, fontSize: '11px' }}>⌘↵</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
