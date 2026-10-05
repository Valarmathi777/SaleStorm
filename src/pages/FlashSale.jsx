import { Link } from 'react-router-dom';
import { Zap, Eye, ShoppingBag } from 'lucide-react';
import { FLASH_SALE_PRODUCTS } from '../data/products';
import { useInventory } from '../hooks/useInventory';
import { useCart } from '../hooks/useCart';
import { useFlashSaleCountdown } from '../hooks/useCountdown';
import ProductImage from '../components/ProductImage';
import StarRating from '../components/StarRating';
import './FlashSale.css';

export default function FlashSale() {
  const { inventory } = useInventory();
  const { addToCart } = useCart();
  const countdown = useFlashSaleCountdown();
  const [hh, mm, ss] = countdown.split(':');

  return (
    <div className="page flash-page">
      <div className="flash-hero">
        <div className="flash-hero-bg" />
        <div className="container flash-hero-inner">
          <div className="badge badge-red flash-live-badge"><span className="status-dot red" /> LIVE NOW</div>
          <h1 className="flash-title"><Zap size={36} fill="currentColor" /> FLASH SALE</h1>
          <p className="flash-sub">Only 100 units. Thousands are waiting.</p>
          <div className="flash-timer">
            <div className="timer-block"><span className="timer-num">{hh}</span><span className="timer-label">HRS</span></div>
            <span className="timer-sep">:</span>
            <div className="timer-block"><span className="timer-num">{mm}</span><span className="timer-label">MIN</span></div>
            <span className="timer-sep">:</span>
            <div className="timer-block"><span className="timer-num">{ss}</span><span className="timer-label">SEC</span></div>
          </div>
          <div className="flash-demand">
            <Eye size={16} />
            <span><strong>9,847</strong> customers watching right now</span>
            <span className="badge badge-orange">DEMO VALUE</span>
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="flash-inventory-bar card">
          <div className="fib-item">
            <span className="fib-label">Available</span>
            <span className="fib-val fib-green">{inventory.availableStock}</span>
          </div>
          <div className="fib-divider" />
          <div className="fib-item">
            <span className="fib-label">Reserved</span>
            <span className="fib-val fib-orange">{inventory.reservedStock}</span>
          </div>
          <div className="fib-divider" />
          <div className="fib-item">
            <span className="fib-label">Sold</span>
            <span className="fib-val fib-red">{inventory.soldStock}</span>
          </div>
          <div className="fib-divider" />
          <div className="fib-item">
            <span className="fib-label">Oversold</span>
            <span className="fib-val fib-blue">0</span>
          </div>
          <div className="fib-progress">
            <div className="progress-bar" style={{ height: 10 }}>
              <div className="progress-fill red" style={{ width: `${(inventory.soldStock / 100) * 100}%` }} />
            </div>
            <span className="fib-progress-label">{inventory.soldStock}/100 units sold</span>
          </div>
        </div>

        <div className="flash-grid">
          {FLASH_SALE_PRODUCTS.map(p => (
            <div key={p.id} className={`flash-card card ${p.isPrimary ? 'flash-card-primary' : ''}`}>
              {p.isPrimary && <div className="flash-card-crown"><Zap size={12} /> FEATURED DEAL</div>}
              {p.isFlashSale && !p.isPrimary && <div className="flash-card-tag badge badge-orange">FLASH SALE</div>}
              <Link to={`/product/${p.id}`}>
                <ProductImage product={p} size="md" />
              </Link>
              <div className="flash-card-body">
                <StarRating rating={p.rating} reviews={p.reviews} />
                <Link to={`/product/${p.id}`}><h3 className="flash-card-name">{p.name}</h3></Link>
                <p className="flash-card-tagline">{p.tagline}</p>
                <div className="flash-card-price">
                  <span className="price-main">₹{p.price.toLocaleString()}</span>
                  <span className="price-original">₹{p.originalPrice.toLocaleString()}</span>
                  <span className="badge badge-orange">{p.discount}% OFF</span>
                </div>
                {p.isPrimary && (
                  <div className="flash-card-stock-info">
                    <div className="flash-stock-row">
                      <span>Available: <strong style={{ color: 'var(--green)' }}>{inventory.availableStock}</strong></span>
                      <span>Reserved: <strong style={{ color: 'var(--orange)' }}>{inventory.reservedStock}</strong></span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill red" style={{ width: `${(inventory.soldStock / 100) * 100}%` }} />
                    </div>
                  </div>
                )}
                {!p.isPrimary && (
                  <div className="flash-stock-simple">
                    <span className="status-dot green" /> {p.stock} units left
                  </div>
                )}
                <div className="flash-card-actions">
                  <Link to={`/product/${p.id}`} className="btn btn-primary" style={{ flex: 1 }}>
                    <Zap size={14} /> Buy Now
                  </Link>
                  <button className="btn btn-ghost" onClick={() => addToCart(p)}>
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
