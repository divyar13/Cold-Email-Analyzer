import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = (token) => {
    localStorage.setItem('token', token);
    fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, loading, loginWithToken, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
