import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useReservation } from '../hooks/useReservation';
import { useCountdown } from '../hooks/useCountdown';
import ProductImage from '../components/ProductImage';
import './Cart.css';

function ReservationTimer({ expiresAt }) {
  const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const { display, expired } = useCountdown(remaining);
  return (
    <div className={`reservation-timer ${expired ? 'expired' : remaining < 60 ? 'urgent' : ''}`}>
      <Clock size={14} />
      {expired ? <span>Reservation expired</span> : <span>Reservation expires in <strong>{display}</strong></span>}
    </div>
  );
}

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateCartQty } = useCart();
  const { reservation } = useReservation();

  if (cart.length === 0) return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: 20 }}>
      <ShoppingBag size={64} style={{ color: 'var(--text-muted)' }} />
      <h2>Your cart is empty</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Add some products to get started.</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  );

  const delivery = 99;
  const total = cartTotal + delivery;

  return (
    <div className="page cart-page">
      <div className="container section">
        <h1 className="section-title">Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => {
              const isReserved = reservation?.productId === item.id;
              return (
                <div key={item.id} className={`cart-item card ${isReserved ? 'cart-item-reserved' : ''}`}>
                  <div className="cart-item-img">
                    <ProductImage product={item} size="sm" />
                  </div>
                  <div className="cart-item-info">
                    <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                    <p className="cart-item-tagline">{item.tagline}</p>
                    {isReserved && (
                      <div className="cart-reserved-badge">
                        <span className="status-dot green" /> Inventory Reserved
                      </div>
                    )}
                    {isReserved && reservation.expiresAt && (
                      <ReservationTimer expiresAt={reservation.expiresAt} />
                    )}
                  </div>
                  <div className="cart-item-qty">
                    <button className="btn btn-ghost btn-sm" onClick={() => updateCartQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <div className="cart-item-price">
                    <span className="cart-item-total">₹{(item.price * item.qty).toLocaleString()}</span>
                    <span className="cart-item-unit">₹{item.price.toLocaleString()} each</span>
                  </div>
                  <button className="btn btn-ghost btn-sm cart-remove" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="divider" />
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Delivery</span><span>₹{delivery}</span></div>
            <div className="divider" />
            <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            {reservation ? (
              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }}>
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/product/x1pro" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }}>
                Reserve & Checkout <ArrowRight size={18} />
              </Link>
            )}
            <Link to="/products" className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
