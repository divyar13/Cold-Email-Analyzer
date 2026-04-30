import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import History from './pages/History.jsx';
import Compare from './pages/Compare.jsx';

function AuthSuccess() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) loginWithToken(token);
    navigate('/', { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0F172A', color: '#94A3B8' }}>
      Signing you in...
    </div>
  );
}

function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ background: '#0F172A' }}>
      <p className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>Authentication failed.</p>
      <a href="/" className="text-sm hover:underline" style={{ color: '#38BDF8' }}>Go back home</a>
    </div>
  );
}

function AppRoutes() {
  return (
    <div className="min-h-screen" style={{ background: '#0F172A' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/compare" element={<Compare />} />
<Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/error" element={<AuthError />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
