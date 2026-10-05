import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Clock, MapPin, Package, AlertTriangle } from 'lucide-react';
import { useReservation } from '../hooks/useReservation';
import { useToast } from '../hooks/useToast';
import { useCountdown } from '../hooks/useCountdown';
import ProductImage from '../components/ProductImage';
import './Checkout.css';

const DEFAULT_ADDRESS = {
  name: 'Rahul Sharma', phone: '+91 98765 43210',
  line1: '42, Tech Park Road', city: 'Bengaluru', state: 'Karnataka', pin: '560001',
};

export default function Checkout() {
  const { reservation } = useReservation();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState(DEFAULT_ADDRESS);

  const remaining = reservation ? Math.max(0, Math.floor((reservation.expiresAt - Date.now()) / 1000)) : 0;
  const { display, expired } = useCountdown(remaining);

  if (!reservation) return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: 16 }}>
      <Package size={64} style={{ color: 'var(--text-muted)' }} />
      <h2>No active reservation</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Please select a product and reserve inventory first.</p>
      <Link to="/flash-sale" className="btn btn-primary">Go to Flash Sale</Link>
    </div>
  );

  if (expired) return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: 16 }}>
      <AlertTriangle size={64} style={{ color: 'var(--red)' }} />
      <h2>Reservation Expired</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Your inventory reservation has expired. Please try again.</p>
      <Link to={`/product/${reservation.productId}`} className="btn btn-primary">Try Again</Link>
    </div>
  );

  const { product } = reservation;
  const delivery = 99;
  const total = product.price + delivery;

  return (
    <div className="page checkout-page">
      <div className="container section">
        <h1 className="section-title">Checkout</h1>

        <div className={`checkout-reservation-banner ${remaining < 60 ? 'urgent' : ''}`}>
          <Clock size={18} />
          <span>Your item is reserved for <strong>{display}</strong> — complete payment before it expires.</span>
          {remaining < 60 && <span className="badge badge-red">EXPIRING SOON</span>}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Address */}
            <div className="card checkout-section">
              <div className="checkout-section-header">
                <MapPin size={18} style={{ color: 'var(--blue)' }} />
                <h3>Delivery Address</h3>
              </div>
              <div className="address-grid">
                {[
                  { label: 'Full Name', key: 'name' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Address', key: 'line1' },
                  { label: 'City', key: 'city' },
                  { label: 'State', key: 'state' },
                  { label: 'PIN Code', key: 'pin' },
                ].map(f => (
                  <div key={f.key} className={`address-field ${f.key === 'line1' ? 'full-width' : ''}`}>
                    <label>{f.label}</label>
                    <input
                      value={address[f.key]}
                      onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                      className="checkout-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reservation */}
            <div className="card checkout-section">
              <div className="checkout-section-header">
                <Shield size={18} style={{ color: 'var(--green)' }} />
                <h3>Inventory Reservation</h3>
              </div>
              <div className="reservation-details">
                <div className="res-detail-row">
                  <span>Reservation ID</span>
                  <span className="res-id">{reservation.id}</span>
                </div>
                <div className="res-detail-row">
                  <span>Product</span>
                  <span>{product.name}</span>
                </div>
                <div className="res-detail-row">
                  <span>Status</span>
                  <span className="badge badge-green">RESERVED</span>
                </div>
                <div className="res-detail-row">
                  <span>Expires</span>
                  <span className={remaining < 60 ? 'text-red' : ''}>{display}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="checkout-sidebar">
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
              <div className="checkout-product-row">
                <ProductImage product={product} size="sm" />
                <div>
                  <div className="font-bold">{product.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Qty: {reservation.qty}</div>
                </div>
                <div className="font-bold">₹{product.price.toLocaleString()}</div>
              </div>
              <div className="divider" />
              <div className="summary-row"><span>Subtotal</span><span>₹{product.price.toLocaleString()}</span></div>
              <div className="summary-row"><span>Delivery</span><span>₹{delivery}</span></div>
              <div className="divider" />
              <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 16 }}
                onClick={() => navigate('/payment', { state: { address, total } })}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
