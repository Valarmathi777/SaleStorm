import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { PRIMARY_PRODUCT } from '../data/products';
import { useInventory } from '../hooks/useInventory';
import { useFlashSaleCountdown } from '../hooks/useCountdown';
import ProductImage from '../components/ProductImage';
import StarRating from '../components/StarRating';
import './Home.css';

const STATS = [
  { value: '10,000', label: 'Concurrent Purchase Attempts', sub: 'Design target scenario' },
  { value: '100', label: 'Available Units', sub: 'Hard inventory limit' },
  { value: '0', label: 'Allowed Oversold Units', sub: 'Zero tolerance' },
  { value: '99.99%+', label: 'Target Reliability', sub: 'System design goal' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '🔍', title: 'Browse', desc: 'Discover flash-sale products with live stock visibility.' },
  { step: '02', icon: '🔒', title: 'Reserve', desc: 'Inventory is atomically reserved — no overselling possible.' },
  { step: '03', icon: '💳', title: 'Pay', desc: 'Complete payment within the reservation window.' },
  { step: '04', icon: '✅', title: 'Order', desc: 'Order confirmed with idempotency-safe transaction.' },
  { step: '05', icon: '🚚', title: 'Deliver', desc: 'Track your order through every lifecycle stage.' },
];

export default function Home() {
  const { inventory } = useInventory();
  const countdown = useFlashSaleCountdown();
  const p = PRIMARY_PRODUCT;

  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="badge badge-red hero-badge">
              <span className="status-dot red" /> FLASH SALE LIVE
            </div>
            <h1 className="hero-headline">
              THE SALE<br />
              <span className="hero-headline-accent">EVERYONE IS</span><br />
              WAITING FOR.
            </h1>
            <p className="hero-sub">
              10,000 customers. 100 units. One system designed to keep every transaction correct.
            </p>
            <div className="hero-actions">
              <Link to="/flash-sale" className="btn btn-primary btn-lg">
                <Zap size={18} /> Shop Flash Sale
              </Link>
              <Link to="/live-system" className="btn btn-outline btn-lg">
                View Live System <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hero-trust">
              <Shield size={14} /> <span>No overselling guaranteed</span>
              <span className="hero-trust-sep">·</span>
              <Clock size={14} /> <span>Timed reservation</span>
              <span className="hero-trust-sep">·</span>
              <TrendingUp size={14} /> <span>High-concurrency safe</span>
            </div>
          </div>

          <div className="hero-product-card">
            <div className="hero-card-inner">
              <div className="hero-card-badges">
                <span className="badge badge-red"><Zap size={10} /> FLASH SALE</span>
                <span className="badge badge-blue">LIMITED STOCK</span>
              </div>
              <ProductImage product={p} size="md" />
              <div className="hero-card-info">
                <h3>{p.name}</h3>
                <p className="hero-card-tagline">{p.tagline}</p>
                <StarRating rating={p.rating} reviews={p.reviews} />
                <div className="hero-card-price">
                  <span className="price-main">₹{p.price.toLocaleString()}</span>
                  <span className="price-original">₹{p.originalPrice.toLocaleString()}</span>
                  <span className="badge badge-orange">{p.discount}% OFF</span>
                </div>
                <div className="hero-card-stock">
                  <div className="stock-bar-wrap">
                    <div className="stock-bar-label">
                      <span>Available: {inventory.availableStock}</span>
                      <span>of 100 units</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill red" style={{ width: `${(inventory.soldStock / 100) * 100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="hero-card-timer">
                  <Clock size={14} />
                  <span>Sale ends in</span>
                  <span className="timer-display">{countdown}</span>
                </div>
                <Link to={`/product/${p.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                  Buy Now <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats-section">
        <div className="container">
          <p className="stats-disclaimer">SALESTORM design targets — simulated scenario values</p>
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="stat-card card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How SALESTORM Works</h2>
            <p className="section-sub">A system designed for correctness under extreme concurrency.</p>
          </div>
          <div className="how-steps">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} className="how-step">
                <div className="how-step-num">{s.step}</div>
                <div className="how-step-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && <div className="how-step-arrow"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-sm cta-banner-section">
        <div className="container">
          <div className="cta-banner card">
            <div className="cta-banner-content">
              <h2>Ready to experience the flash sale?</h2>
              <p>See how SALESTORM handles 10,000 concurrent requests for 100 units — safely.</p>
            </div>
            <div className="cta-banner-actions">
              <Link to="/flash-sale" className="btn btn-primary btn-lg"><Zap size={18} /> Shop Flash Sale</Link>
              <Link to="/live-system" className="btn btn-ghost btn-lg">Live System →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
