import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;

export function formatApiErrorDetail(detail) {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).filter(Boolean).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = checking, false = guest, object = signed in
  const [authView, setAuthView] = useState(null); // null | 'login' | 'register' | 'forgot' | 'reset'

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/me`, { withCredentials: true });
        setUser(data);
      } catch {
        setUser(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/login`, { email, password }, { withCredentials: true });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/register`, { name, email, password }, { withCredentials: true });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/logout`, {}, { withCredentials: true });
    } catch {}
    setUser(false);
  };

  const forgotPassword = async (email) => {
    const { data } = await axios.post(`${API}/forgot-password`, { email });
    return data;
  };

  const resetPassword = async (token, newPassword) => {
    const { data } = await axios.post(`${API}/reset-password`, { token, new_password: newPassword });
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, authView, setAuthView, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
