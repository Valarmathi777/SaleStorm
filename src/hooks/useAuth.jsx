import { createContext, useContext, useState, useCallback } from 'react';
import { UsersDB } from '../utils/db';

const AuthContext = createContext(null);
const SESSION_KEY = 'salestorm_session';

// Admin secret code — only admins know this
const ADMIN_SECRET_CODE = 'STORM2025#ADMIN';

const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
const setSession = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));
const clearSession = () => localStorage.removeItem(SESSION_KEY);

const seedAdmin = () => {
  if (!UsersDB.findOne(u => u.email === 'admin@salestorm.com')) {
    UsersDB.insert({
      id: 'admin_001', name: 'Admin', email: 'admin@salestorm.com',
      password: 'admin123', role: 'admin', avatar: 'A', createdAt: Date.now(),
    });
  }
};
seedAdmin();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  const signup = useCallback((name, email, password) => {
    if (UsersDB.findOne(u => u.email === email)) return { error: 'Email already registered.' };
    const newUser = {
      id: `u_${Date.now()}`, name, email, password,
      role: 'user', avatar: name[0].toUpperCase(), createdAt: Date.now(),
    };
    UsersDB.insert(newUser);
    const { password: _, ...safe } = newUser;
    setSession(safe); setUser(safe);
    return { user: safe };
  }, []);

  const login = useCallback((email, password) => {
    const found = UsersDB.findOne(u => u.email === email && u.password === password);
    if (!found) return { error: 'Invalid email or password.' };
    const { password: _, ...safe } = found;
    setSession(safe); setUser(safe);
    return { user: safe };
  }, []);

  // Admin login via secret code — no email/password needed
  const adminCodeLogin = useCallback((code) => {
    if (code.trim() !== ADMIN_SECRET_CODE) return { error: 'Invalid admin code.' };
    const admin = UsersDB.findOne(u => u.role === 'admin');
    if (!admin) return { error: 'Admin account not found.' };
    const { password: _, ...safe } = admin;
    setSession(safe); setUser(safe);
    return { user: safe };
  }, []);

  const logout = useCallback(() => { clearSession(); setUser(null); }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, signup, adminCodeLogin, logout, isAuthenticated: !!user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
