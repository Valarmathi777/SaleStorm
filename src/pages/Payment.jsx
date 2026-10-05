/**
 * SOLID: SRP — Payment is a pure UI component.
 *              All payment orchestration lives in usePayment.
 * SOLID: DIP — Depends on usePayment and useReservation hooks,
 *              not on paymentService / orderService directly.
 */
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, AlertTriangle, CheckCircle, XCircle, Clock, Package, FlaskConical } from 'lucide-react';
import { useState } from 'react';
import { useReservation } from '../hooks/useReservation';
import { usePayment } from '../hooks/usePayment';
import './Payment.css';

const METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks supported' },
];

export default function Payment() {
  const { reservation } = useReservation();
  const { pay, retry, status, txnId } = usePayment();
  const location = useLocation();
  const { address, total } = location.state || {};
  const [method, setMethod] = useState('upi');

  if (!reservation) return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: 16 }}>
      <Package size={64} style={{ color: 'var(--text-muted)' }} />
      <h2>No active reservation</h2>
      <Link to="/flash-sale" className="btn btn-primary">Go to Flash Sale</Link>
    </div>
  );

  const { product } = reservation;
  const amount = total || product.price + 99;

  const handlePay = (scenario) => pay(scenario, address, amount);

  return (
    <div className="page payment-page">
      <div className="container section">
        <h1 className="section-title">Payment</h1>
        <div className="payment-layout">
          <div className="payment-main">
            {/* Method */}
            <div className="card payment-section">
              <h3>Select Payment Method</h3>
              <div className="payment-methods">
                {METHODS.map(m => (
                  <button key={m.id} className={`payment-method-btn ${method === m.id ? 'active' : ''}`} onClick={() => setMethod(m.id)}>
                    <m.icon size={20} />
                    <div>
                      <div className="pm-label">{m.label}</div>
                      <div className="pm-desc">{m.desc}</div>
                    </div>
                    <div className={`pm-radio ${method === m.id ? 'selected' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Status display */}
            {status !== 'idle' && (
              <div className={`payment-status-card card payment-status-${status}`}>
                {status === 'processing' && <><Clock size={32} className="spin" /><h3>Processing Payment...</h3><p>Please wait while we process your payment.</p></>}
                {status === 'success' && <><CheckCircle size={32} /><h3>Payment Successful!</h3><p>Redirecting to order confirmation...</p></>}
                {status === 'failed' && <><XCircle size={32} /><h3>Payment Failed</h3><p>Your reservation has been released. Please try again.</p><button className="btn btn-primary" onClick={retry}>Retry Payment</button></>}
                {status === 'timeout' && <><AlertTriangle size={32} /><h3>Payment Status Unknown</h3><p>Gateway timeout. Verifying payment status...</p></>}
                {status === 'reconciling' && <><Clock size={32} className="spin" /><h3>Reconciling Payment</h3><p>Checking payment status with bank. No duplicate charge will be made.</p></>}
              </div>
            )}

            {/* Demo controls */}
            {status === 'idle' && (
              <div className="card demo-controls">
                <div className="demo-header">
                  <FlaskConical size={18} style={{ color: 'var(--blue)' }} />
                  <h3>Demo Payment Scenarios</h3>
                  <span className="badge badge-blue">DEMO ONLY</span>
                </div>
                <p className="demo-desc">This is a frontend simulation. No real payment is processed.</p>
                <div className="demo-btns">
                  <button className="btn btn-success" onClick={() => handlePay('success')}><CheckCircle size={16} /> Simulate Success</button>
                  <button className="btn btn-danger" onClick={() => handlePay('failure')}><XCircle size={16} /> Simulate Failure</button>
                  <button className="btn btn-ghost" onClick={() => handlePay('timeout')}><Clock size={16} /> Simulate Timeout</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="payment-sidebar">
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
              <div className="pay-product-row">
                <span className="pay-product-name">{product.name}</span>
                <span>₹{product.price.toLocaleString()}</span>
              </div>
              <div className="summary-row"><span>Delivery</span><span>₹99</span></div>
              <div className="divider" />
              <div className="summary-row summary-total"><span>Total</span><span>₹{amount.toLocaleString()}</span></div>
              <div className="divider" />
              <div className="pay-res-info">
                <div className="pay-res-row"><span>Reservation ID</span><span className="res-id">{reservation.id}</span></div>
                {txnId && <div className="pay-res-row"><span>Transaction ID</span><span className="res-id">{txnId}</span></div>}
              </div>
              {status === 'idle' && (
                <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={() => handlePay('success')}>
                  Pay ₹{amount.toLocaleString()}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
