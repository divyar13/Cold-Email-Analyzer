import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Analyze' },
    { path: '/compare', label: 'Compare' },
    ...(user ? [{ path: '/history', label: 'History' }] : []),
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav style={{ background: '#FAF9F6', borderBottom: '1px solid #EDE9E3' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <svg className="w-5 h-5 text-slate-warm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="font-serif font-semibold text-sm text-ink tracking-tight hidden sm:block">
                Cold Email Analyzer
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    isActive(path)
                      ? 'text-ink font-medium bg-cream-300'
                      : 'text-ink-light hover:text-ink hover:bg-cream-200'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7A8FA6&color=fff&size=32`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full"
                  style={{ border: '1px solid #DDD9D0' }}
                />
                <span className="text-sm text-ink-light hidden md:block max-w-28 truncate">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-xs text-ink-muted hover:text-ink px-3 py-1.5 rounded-lg transition-colors"
                  style={{ border: '1px solid #DDD9D0' }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <a
                href="/api/auth/google"
                className="flex items-center gap-2 px-3.5 py-1.5 text-white text-sm font-medium rounded-lg transition-all hover:opacity-90"
                style={{ background: '#7A8FA6' }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in
              </a>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-0.5 pb-2 overflow-x-auto">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                isActive(path) ? 'text-ink font-medium bg-cream-300' : 'text-ink-light hover:text-ink hover:bg-cream-200'
              }`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
