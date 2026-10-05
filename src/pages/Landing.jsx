import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, Star, Shield, Truck, RotateCcw,
  Headphones, ChevronRight, TrendingUp, Award, Users, Clock
} from 'lucide-react';
import { PRODUCTS, CATEGORIES_MAP, CATEGORY_EMOJIS } from '../data/products';
import './Landing.css';

// ─── Section 1: Hero ────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="land-hero">
      <div className="land-hero-bg">
        <div className="land-hero-orb orb1" />
        <div className="land-hero-orb orb2" />
        <div className="land-hero-orb orb3" />
        <div className="land-hero-grid" />
      </div>
      <div className="container land-hero-inner">
        <div className="land-hero-content">
          <div className="land-hero-eyebrow">
            <span className="status-dot red" />
            <span>FLASH SALE LIVE NOW</span>
            <span className="land-eyebrow-sep">·</span>
            <span>Up to 40% OFF</span>
          </div>
          <h1 className="land-hero-h1">
            Shop Smarter.<br />
            <span className="land-hero-gradient">Save Bigger.</span>
          </h1>
          <p className="land-hero-sub">
            Premium tech at unbeatable prices. 10,000 shoppers. 100 units. Zero overselling — ever.
          </p>
          <div className="land-hero-cta">
            <Link to="/flash-sale" className="btn btn-primary btn-lg land-cta-main">
              <Zap size={18} /> Shop Flash Sale
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg">
              Browse All <ArrowRight size={18} />
            </Link>
          </div>
          <div className="land-hero-trust">
            {[
              { icon: <Shield size={14} />, text: 'Secure Checkout' },
              { icon: <Truck size={14} />, text: 'Free Delivery' },
              { icon: <RotateCcw size={14} />, text: '30-Day Returns' },
            ].map(t => (
              <span key={t.text} className="land-trust-item">
                {t.icon} {t.text}
              </span>
            ))}
          </div>
        </div>

        <div className="land-hero-showcase">
          <div className="land-showcase-card">
            <div className="land-showcase-badge">
              <Zap size={12} /> BEST SELLER
            </div>
            <div className="land-showcase-img" style={{ background: PRODUCTS[0].gradient }}>
              <div className="land-showcase-emoji">📱</div>
            </div>
            <div className="land-showcase-info">
              <p className="land-showcase-name">{PRODUCTS[0].name}</p>
              <div className="land-showcase-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < 5 ? '#eab308' : 'none'} color="#eab308" />)}
                <span>4.8 (2.3k)</span>
              </div>
              <div className="land-showcase-price">
                <span className="price-main">₹{PRODUCTS[0].price.toLocaleString()}</span>
                <span className="price-original">₹{PRODUCTS[0].originalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

            <div className="land-showcase-mini-grid">
            {PRODUCTS.slice(1, 4).map((p, i) => (
              <Link to={`/product/${p.id}`} key={p.id} className="land-mini-card">
                <div className="land-mini-img" style={{ background: p.gradient }}>
                  <span>{p.emoji}</span>
                </div>
                <div className="land-mini-info">
                  <p>{p.name}</p>
                  <span className="badge badge-orange">{p.discount}% OFF</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Categories ───────────────────────────────────────────────────
const CAT_COLORS = { Smartphones:'#4f8ef7', Laptops:'#7c3aed', TVs:'#f97316', Refrigerators:'#00b4d8', 'Washing Machines':'#22c55e', Audio:'#22c55e', Wearables:'#ef4444', Gaming:'#eab308', 'Air Conditioners':'#4f8ef7', Cameras:'#c0c0c0', Kitchen:'#f97316', Tablets:'#7c3aed' };
const CATEGORIES = Object.keys(CATEGORIES_MAP).filter(k => k !== 'All').map(k => ({
  emoji: CATEGORY_EMOJIS[k], label: k,
  count: `${CATEGORIES_MAP[k].length} products`,
  color: CAT_COLORS[k] || '#4f8ef7',
  bg: 'rgba(79,142,247,0.08)',
}));

function CategoriesSection() {
  return (
    <section className="land-section land-categories-section">
      <div className="container">
        <div className="land-section-header">
          <h2 className="land-section-title">Shop by Category</h2>
          <Link to="/products" className="land-see-all">See all <ChevronRight size={16} /></Link>
        </div>
        <div className="land-categories-grid">
          {CATEGORIES.map(c => (
            <Link to="/products" key={c.label} className="land-category-card" style={{ '--cat-color': c.color, '--cat-bg': c.bg }}>
              <div className="land-cat-icon">{c.emoji}</div>
              <div className="land-cat-label">{c.label}</div>
              <div className="land-cat-count">{c.count}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Featured Products (Netflix row style) ───────────────────────
const EMOJIS = {}; PRODUCTS.forEach(p => { EMOJIS[p.id] = p.emoji; });

function FeaturedSection() {
  return (
    <section className="land-section land-featured-section">
      <div className="container">
        <div className="land-section-header">
          <div>
            <h2 className="land-section-title">Featured Products</h2>
            <p className="land-section-sub">Handpicked deals, updated daily</p>
          </div>
          <Link to="/products" className="land-see-all">View all <ChevronRight size={16} /></Link>
        </div>
        <div className="land-products-row">
          {PRODUCTS.map(p => (
            <Link to={`/product/${p.id}`} key={p.id} className="land-product-card">
              {p.isFlashSale && (
                <div className="land-flash-tag"><Zap size={10} /> FLASH</div>
              )}
              <div className="land-product-img" style={{ background: p.gradient }}>
                <span className="land-product-emoji">{EMOJIS[p.id]}</span>
              </div>
              <div className="land-product-body">
                <div className="land-product-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill={i < Math.floor(p.rating) ? '#eab308' : 'none'} color="#eab308" />
                  ))}
                  <span>({p.reviews.toLocaleString()})</span>
                </div>
                <p className="land-product-name">{p.name}</p>
                <p className="land-product-tagline">{p.tagline}</p>
                <div className="land-product-price">
                  <span className="price-main">₹{p.price.toLocaleString()}</span>
                  <span className="badge badge-orange">{p.discount}% OFF</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Flash Deal Banner + Stats ───────────────────────────────────
const STATS = [
  { icon: <Users size={28} />, value: '2M+', label: 'Happy Customers' },
  { icon: <Award size={28} />, value: '50K+', label: 'Products Sold' },
  { icon: <TrendingUp size={28} />, value: '99.9%', label: 'Uptime SLA' },
  { icon: <Clock size={28} />, value: '24/7', label: 'Support' },
];

function DealsSection() {
  return (
    <section className="land-section land-deals-section">
      <div className="container">
        {/* Flash Deal Banner */}
        <div className="land-deal-banner">
          <div className="land-deal-banner-bg" />
          <div className="land-deal-content">
            <div className="badge badge-red land-deal-badge"><Zap size={12} /> LIMITED TIME</div>
            <h2 className="land-deal-title">Flash Sale — Up to 40% OFF</h2>
            <p className="land-deal-sub">100 units. First come, first served. Zero overselling guaranteed.</p>
            <Link to="/flash-sale" className="btn btn-primary btn-lg">
              <Zap size={18} /> Grab the Deal
            </Link>
          </div>
          <div className="land-deal-products">
            {PRODUCTS.filter(p => p.isFlashSale).map(p => (
              <div key={p.id} className="land-deal-product-chip">
                <span>{EMOJIS[p.id]}</span>
                <div>
                  <p>{p.name}</p>
                  <span className="badge badge-orange">{p.discount}% OFF</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="land-stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="land-stat-card card">
              <div className="land-stat-icon">{s.icon}</div>
              <div className="land-stat-value">{s.value}</div>
              <div className="land-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Why Us + Footer ─────────────────────────────────────────────
const WHY = [
  { icon: <Shield size={24} />, title: 'Zero Overselling', desc: 'Atomic inventory reservation ensures you never lose a confirmed order.' },
  { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'Built for 10,000 concurrent users with sub-100ms response times.' },
  { icon: <Truck size={24} />, title: 'Fast Delivery', desc: 'Same-day dispatch on orders placed before 2 PM.' },
  { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Real humans available around the clock to help you.' },
];

const FOOTER_LINKS = {
  Shop: ['Flash Sale', 'All Products', 'New Arrivals', 'Best Sellers'],
  Account: ['Sign In', 'Create Account', 'My Orders', 'Wishlist'],
  Support: ['Help Center', 'Track Order', 'Returns', 'Contact Us'],
  Company: ['About Us', 'Careers', 'Press', 'Privacy Policy'],
};

function WhyAndFooter() {
  return (
    <>
      <section className="land-section land-why-section">
        <div className="container">
          <div className="land-section-header land-section-header-center">
            <h2 className="land-section-title">Why SALESTORM?</h2>
            <p className="land-section-sub">Built on solid engineering principles for reliability at scale.</p>
          </div>
          <div className="land-why-grid">
            {WHY.map(w => (
              <div key={w.title} className="land-why-card card">
                <div className="land-why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="land-footer">
        <div className="container">
          <div className="land-footer-top">
            <div className="land-footer-brand">
              <div className="land-footer-logo">
                <Zap size={22} fill="currentColor" />
                <span>SALE<span>STORM</span></span>
              </div>
              <p>The flash sale platform built for correctness, speed, and scale.</p>
              <div className="land-footer-social">
                {['𝕏', 'in', 'f', 'yt'].map(s => (
                  <span key={s} className="land-social-btn">{s}</span>
                ))}
              </div>
            </div>
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group} className="land-footer-col">
                <h4>{group}</h4>
                <ul>
                  {links.map(l => <li key={l}><Link to={l === 'Sign In' ? '/login' : l === 'Create Account' ? '/signup' : '/products'}>{l}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="land-footer-bottom">
            <p>© 2025 SALESTORM. All rights reserved.</p>
            <p>Built with SOLID principles · HLD/LLD architecture · Zero overselling</p>
          </div>
        </div>
      </footer>
    </>
  );
}

// ─── Main Landing Page (SRP: composes sections) ─────────────────────────────
export default function Landing() {
  return (
    <div className="land-page">
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <DealsSection />
      <WhyAndFooter />
    </div>
  );
}
