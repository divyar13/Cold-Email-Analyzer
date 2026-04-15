import HallOfShame from '../components/HallOfShame.jsx';

export default function Community() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-ink mb-1">Hall of Shame</h1>
        <p style={{ fontSize: '14px', color: '#9C9690', maxWidth: '580px', lineHeight: '1.6', marginBottom: '16px' }}>
          The internet's finest collection of terrible recruiter emails. Community-judged, anonymously submitted.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { emoji: '👎', text: 'Downvote the worst' },
            { emoji: '😂', text: 'React with cringe' },
            { emoji: '📊', text: 'AI-scored only' },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: '#FEFDFB', border: '1px solid #EDE9E3', fontSize: '12px', color: '#9C9690' }}>
              <span>{emoji}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <HallOfShame />
    </main>
  );
}
