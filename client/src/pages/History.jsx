import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import HistoryList from '../components/HistoryList.jsx';
import SenderScore from '../components/SenderScore.jsx';

export default function History() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
          style={{ background: '#F0EDE8', border: '1px solid #DDD9D0' }}>
          <svg className="w-5 h-5" style={{ color: '#C4C0BA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-2">Sign in to see your history</h2>
        <p style={{ fontSize: '14px', color: '#9C9690', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
          All analyzed emails are saved automatically when you're signed in.
        </p>
        <a href="/api/auth/google"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium rounded-xl transition-all hover:opacity-90"
          style={{ background: '#7A8FA6' }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">My History</h1>
          <p style={{ fontSize: '13px', color: '#9C9690', marginTop: '3px' }}>All your analyzed emails</p>
        </div>
        <Link to="/"
          className="px-3 py-2 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90"
          style={{ background: '#7A8FA6' }}>
          + Analyze New
        </Link>
      </div>
      <div className="space-y-8">
        <HistoryList />
        <div>
          <h2 className="font-serif text-lg font-semibold text-ink mb-1">Sender Reputation</h2>
          <p style={{ fontSize: '12px', color: '#9C9690', marginBottom: '16px' }}>
            Companies ranked by average email quality
          </p>
          <SenderScore />
        </div>
      </div>
    </main>
  );
}
