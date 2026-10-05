import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Menu, X, LogOut, User, ChevronDown, Search, LayoutDashboard } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropRef = useRef(null);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/flash-sale', label: '🔥 Flash Sale', live: true },
    { to: '/products', label: 'Products' },
    { to: '/orders', label: 'My Orders' },
    { to: '/live-system', label: 'Live System' },
  ];

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); setDropOpen(false); navigate('/'); };
  const handleSearch = (e) => { e.preventDefault(); if (search.trim()) navigate('/products'); };

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <nav className="navbar">
      {/* Top bar */}
      <div className="navbar-top">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
            <Zap size={20} fill="currentColor" />
            <span>SALE<span className="logo-storm">STORM</span></span>
          </Link>

          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text" placeholder="Search products, brands and more..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="navbar-search-btn"><Search size={18} /></button>
          </form>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="nav-user-menu" ref={dropRef}>
                <button className="nav-avatar-btn" onClick={() => setDropOpen(d => !d)}>
                  <span className="nav-avatar">{user.avatar}</span>
                  <span style={{ fontSize: '0.82rem', color: '#fff' }}>Hi, {user.name.split(' ')[0]}</span>
                  <ChevronDown size={13} className={dropOpen ? 'rotated' : ''} />
                </button>
                {dropOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <span className="nav-avatar nav-avatar-lg">{user.avatar}</span>
                      <div>
                        <p className="nav-dropdown-name">{user.name}</p>
                        <p className="nav-dropdown-email">{user.email}</p>
                      </div>
                    </div>
                    <div className="nav-dropdown-divider" />
                    {isAdmin && (
                      <Link to="/admin" className="nav-dropdown-item nav-dropdown-admin" onClick={() => setDropOpen(false)}>
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/orders" className="nav-dropdown-item" onClick={() => setDropOpen(false)}>
                      <User size={15} /> My Orders
                    </Link>
                    <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-btns">
                <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            <Link to="/cart" className="nav-icon-btn" onClick={() => setOpen(false)}>
              <ShoppingCart size={22} />
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <button className="nav-hamburger" onClick={() => setOpen(o => !o)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom nav strip */}
      <div className="navbar-bottom">
        <div className="container">
          <div className={`navbar-links ${open ? 'open' : ''}`}>
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`} onClick={() => setOpen(false)}>
                {l.label}
                {l.live && <span className="nav-live-dot" />}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="nav-link nav-admin-link" onClick={() => setOpen(false)}>
                <LayoutDashboard size={14} /> Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
