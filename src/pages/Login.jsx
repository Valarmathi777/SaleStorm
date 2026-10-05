import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Login() {
  const { login, adminCodeLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [tab, setTab] = useState('user'); // 'user' | 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [adminCode, setAdminCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submitUser = (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.error) { setError(result.error); setLoading(false); }
      else navigate(from, { replace: true });
    }, 500);
  };

  const submitAdmin = (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    setTimeout(() => {
      const result = adminCodeLogin(adminCode);
      if (result.error) { setError(result.error); setLoading(false); }
      else navigate('/admin', { replace: true });
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />

      <div className="auth-logo">
        <Link to="/" className="auth-brand">
          <Zap size={22} fill="currentColor" />
          <span>SALE<span>STORM</span></span>
        </Link>
      </div>

      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'user' ? 'active' : ''}`}
            onClick={() => { setTab('user'); setError(''); }}
          >
            Customer Login
          </button>
          <button
            className={`auth-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => { setTab('admin'); setError(''); }}
          >
            <ShieldCheck size={14} /> Admin Access
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === 'user' ? (
          <>
            <form onSubmit={submitUser} className="auth-form">
              <div className="auth-field">
                <Mail size={15} className="auth-field-icon" />
                <input
                  type="email" name="email" placeholder="Email address"
                  value={form.email} onChange={handle} required autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <Lock size={15} className="auth-field-icon" />
                <input
                  type={showPw ? 'text' : 'password'} name="password" placeholder="Password"
                  value={form.password} onChange={handle} required autoComplete="current-password"
                />
                <button type="button" className="auth-eye" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button type="submit" className="btn auth-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Sign In'}
              </button>
            </form>
            <div className="auth-divider">or</div>
            <p className="auth-switch">
              New to SALESTORM? <Link to="/signup">Create account</Link>
            </p>
          </>
        ) : (
          <>
            <div className="auth-admin-info">
              <ShieldCheck size={20} />
              <div>
                <p>Admin access requires a secret code.</p>
                <p>Contact your system administrator for the code.</p>
              </div>
            </div>
            <form onSubmit={submitAdmin} className="auth-form">
              <div className="auth-field">
                <ShieldCheck size={15} className="auth-field-icon" />
                <input
                  type={showCode ? 'text' : 'password'}
                  placeholder="Enter admin secret code"
                  value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowCode(s => !s)}>
                  {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button type="submit" className="btn auth-submit auth-submit-admin" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : <><ShieldCheck size={16} /> Access Admin Panel</>}
              </button>
            </form>
            <div className="auth-demo">
              <p>Secret code: <b>STORM2025#ADMIN</b></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
