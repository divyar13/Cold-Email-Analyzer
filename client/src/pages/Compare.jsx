import CompareMode from '../components/CompareMode.jsx';

export default function Compare() {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-ink mb-1">Compare Mode</h1>
        <p style={{ fontSize: '14px', color: '#9C9690', lineHeight: '1.6' }}>
          Paste two emails side by side — AI picks the better one and explains exactly why.
        </p>
      </div>
      <CompareMode />
    </main>
  );
}
