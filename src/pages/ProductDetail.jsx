/**
 * SOLID: SRP — ProductDetail is a pure UI component.
 *              All purchase logic lives in usePurchase.
 * SOLID: DIP — Depends on usePurchase, useInventory, useCart hooks,
 *              not on raw service imports.
 */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Zap, ShoppingBag, Shield, Truck, Clock, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useInventory } from '../hooks/useInventory';
import { useCart } from '../hooks/useCart';
import { usePurchase } from '../hooks/usePurchase';
import ProductImage from '../components/ProductImage';
import StarRating from '../components/StarRating';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { inventory } = useInventory();
  const { addToCart } = useCart();
  const { buyNow, loading } = usePurchase();
  const [qty, setQty] = useState(1);
  const [openSpec, setOpenSpec] = useState(true);

  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: 16 }}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  );

  const isSoldOut = inventory.availableStock <= 0;

  return (
    <div className="page product-detail-page">
      <div className="container section">
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
        </div>
        <div className="pd-layout">
          <div className="pd-gallery">
            <ProductImage product={product} size="xl" />
            <div className="pd-gallery-thumbs">
              {[1,2,3].map(i => (
                <div key={i} className="pd-thumb" style={{ background: product.gradient, opacity: i === 1 ? 1 : 0.5 }}>
                  <span style={{ fontSize: '1.2rem' }}>📱</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-info">
            {product.isFlashSale && (
              <div className="badge badge-red pd-flash-badge"><Zap size={12} /> FLASH SALE — LIMITED STOCK</div>
            )}
            <h1 className="pd-name">{product.name}</h1>
            <p className="pd-tagline">{product.tagline}</p>
            <StarRating rating={product.rating} reviews={product.reviews} />

            <div className="pd-price-block">
              <span className="price-main" style={{ fontSize: '2.2rem' }}>₹{product.price.toLocaleString()}</span>
              <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
              <span className="badge badge-orange" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>{product.discount}% OFF</span>
            </div>
            <p className="pd-savings">You save ₹{(product.originalPrice - product.price).toLocaleString()}</p>

            <div className="pd-stock-status">
              {isSoldOut ? (
                <div className="badge badge-red" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>SOLD OUT</div>
              ) : (
                <div className="pd-stock-info">
                  <span className="status-dot green" />
                  <span>Only <strong>{inventory.availableStock}</strong> units available</span>
                  {inventory.reservedStock > 0 && (
                    <span className="pd-reserved-note">({inventory.reservedStock} currently reserved)</span>
                  )}
                </div>
              )}
            </div>

            <div className="pd-reservation-note card" style={{ padding: '16px' }}>
              <div className="pd-res-header"><Shield size={16} style={{ color: 'var(--blue)' }} /> Limited Inventory Protection</div>
              <p>Your unit is reserved only after successful inventory reservation. Reservation expires in 5 minutes if payment is not completed.</p>
            </div>

            <div className="pd-qty-row">
              <span className="pd-qty-label">Quantity</span>
              <div className="pd-qty-ctrl">
                <button className="btn btn-ghost btn-sm" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                <span className="pd-qty-val">{qty}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setQty(q => Math.min(inventory.availableStock, q + 1))}><Plus size={14} /></button>
              </div>
            </div>

            <div className="pd-actions">
              <button className="btn btn-primary btn-lg" onClick={() => buyNow(product, qty)} disabled={isSoldOut || loading} style={{ flex: 2 }}>
                {loading ? 'Reserving...' : isSoldOut ? 'Sold Out' : <><Zap size={18} /> Buy Now</>}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => addToCart(product, qty)} style={{ flex: 1 }}>
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>

            <div className="pd-meta-row">
              <div className="pd-meta-item"><Truck size={16} /> <span>Delivery in {product.delivery}</span></div>
              <div className="pd-meta-item"><Shield size={16} /> <span>{product.warranty}</span></div>
              <div className="pd-meta-item"><Clock size={16} /> <span>5-min reservation window</span></div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="pd-sections">
          <div className="pd-section card">
            <h3>Product Highlights</h3>
            <ul className="pd-highlights">
              {product.highlights.map(h => <li key={h}><span className="status-dot green" />{h}</li>)}
            </ul>
          </div>

          <div className="pd-section card">
            <button className="pd-spec-toggle" onClick={() => setOpenSpec(o => !o)}>
              <h3>Specifications</h3>
              {openSpec ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSpec && (
              <table className="pd-spec-table">
                <tbody>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <tr key={k}><td className="spec-key">{k}</td><td className="spec-val">{v}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pd-section card">
            <h3>Flash Sale Information</h3>
            <div className="pd-flash-info">
              <div className="pd-flash-info-item">
                <span className="pd-flash-info-label">Total Units</span>
                <span className="pd-flash-info-val">100</span>
              </div>
              <div className="pd-flash-info-item">
                <span className="pd-flash-info-label">Available Now</span>
                <span className="pd-flash-info-val" style={{ color: 'var(--green)' }}>{inventory.availableStock}</span>
              </div>
              <div className="pd-flash-info-item">
                <span className="pd-flash-info-label">Reserved</span>
                <span className="pd-flash-info-val" style={{ color: 'var(--orange)' }}>{inventory.reservedStock}</span>
              </div>
              <div className="pd-flash-info-item">
                <span className="pd-flash-info-label">Sold</span>
                <span className="pd-flash-info-val" style={{ color: 'var(--red)' }}>{inventory.soldStock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
