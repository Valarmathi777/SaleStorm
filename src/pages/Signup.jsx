import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    setTimeout(() => {
      const result = signup(form.name, form.email, form.password);
      if (result.error) { setError(result.error); setLoading(false); }
      else navigate('/', { replace: true });
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />

      <div className="auth-logo">
        <Link to="/" className="auth-brand">
          <Zap size={28} fill="currentColor" />
          <span>SALE<span>STORM</span></span>
        </Link>
      </div>

      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <User size={16} className="auth-field-icon" />
            <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handle} required />
          </div>

          <div className="auth-field">
            <Mail size={16} className="auth-field-icon" />
            <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handle} required />
          </div>

          <div className="auth-field">
            <Lock size={16} className="auth-field-icon" />
            <input
              type={showPw ? 'text' : 'password'} name="password" placeholder="Password (min 6 chars)"
              value={form.password} onChange={handle} required
            />
            <button type="button" className="auth-eye" onClick={() => setShowPw(s => !s)}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="auth-field">
            <Lock size={16} className="auth-field-icon" />
            <input
              type={showPw ? 'text' : 'password'} name="confirm" placeholder="Confirm password"
              value={form.confirm} onChange={handle} required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
