import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Shield } from 'lucide-react';
import { getOrderById } from '../utils/orderService';
import './OrderTracking.css';

const ALL_STATES = ['CREATED', 'PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
const STATE_LABELS = {
  CREATED: 'Order Created', PAYMENT_PENDING: 'Payment Pending', CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing', SHIPPED: 'Shipped', OUT_FOR_DELIVERY: 'Out for Delivery', DELIVERED: 'Delivered',
};
const STATE_ICONS = { CREATED: '📋', PAYMENT_PENDING: '💳', CONFIRMED: '✅', PROCESSING: '⚙️', SHIPPED: '📦', OUT_FOR_DELIVERY: '🚚', DELIVERED: '🎉' };

const MOCK_ORDERS = {
  'ST-DEMO01': { id: 'ST-DEMO01', productName: 'SALESTORM X1 Pro', amount: 50098, status: 'DELIVERED', paymentStatus: 'SUCCESS', transactionId: 'TXN-DEMO001', reservationId: 'RES-DEMO001', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), estimatedDelivery: new Date(Date.now() - 2 * 86400000).toISOString(), address: { name: 'Rahul Sharma', line1: '42, Tech Park Road', city: 'Bengaluru', state: 'Karnataka', pin: '560001' }, timeline: ALL_STATES.map((s, i) => ({ state: s, ts: new Date(Date.now() - (7 - i) * 86400000).toISOString() })) },
  'ST-DEMO02': { id: 'ST-DEMO02', productName: 'AeroBuds Max', amount: 9098, status: 'SHIPPED', paymentStatus: 'SUCCESS', transactionId: 'TXN-DEMO002', reservationId: 'RES-DEMO002', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), estimatedDelivery: new Date(Date.now() + 1 * 86400000).toISOString(), address: { name: 'Rahul Sharma', line1: '42, Tech Park Road', city: 'Bengaluru', state: 'Karnataka', pin: '560001' }, timeline: ALL_STATES.slice(0, 5).map((s, i) => ({ state: s, ts: new Date(Date.now() - (2 - i * 0.4) * 86400000).toISOString() })) },
  'ST-DEMO03': { id: 'ST-DEMO03', productName: 'SmartFit Ultra', amount: 13098, status: 'PROCESSING', paymentStatus: 'SUCCESS', transactionId: 'TXN-DEMO003', reservationId: 'RES-DEMO003', createdAt: new Date(Date.now() - 86400000).toISOString(), estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(), address: { name: 'Rahul Sharma', line1: '42, Tech Park Road', city: 'Bengaluru', state: 'Karnataka', pin: '560001' }, timeline: ALL_STATES.slice(0, 4).map((s, i) => ({ state: s, ts: new Date(Date.now() - (1 - i * 0.25) * 86400000).toISOString() })) },
  'ST-DEMO04': { id: 'ST-DEMO04', productName: 'GameCore X', amount: 60098, status: 'CANCELLED', paymentStatus: 'FAILED', transactionId: 'TXN-DEMO004', reservationId: 'RES-DEMO004', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), estimatedDelivery: null, address: { name: 'Rahul Sharma', line1: '42, Tech Park Road', city: 'Bengaluru', state: 'Karnataka', pin: '560001' }, timeline: [{ state: 'CREATED', ts: new Date(Date.now() - 5 * 86400000).toISOString() }, { state: 'PAYMENT_PENDING', ts: new Date(Date.now() - 5 * 86400000).toISOString() }] },
};

export default function OrderTracking() {
  const { id } = useParams();
  const order = getOrderById(id) || MOCK_ORDERS[id];

  if (!order) return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: 16 }}>
      <Package size={64} style={{ color: 'var(--text-muted)' }} />
      <h2>Order not found</h2>
      <Link to="/orders" className="btn btn-primary">View Orders</Link>
    </div>
  );

  const completedStates = new Set(order.timeline.map(t => t.state));
  const currentIdx = ALL_STATES.indexOf(order.status);

  return (
    <div className="page ot-page">
      <div className="container section">
        <div className="ot-header">
          <div>
            <h1 className="section-title">Order Tracking</h1>
            <p className="ot-order-id">Order ID: <span>{order.id}</span></p>
          </div>
          <Link to="/orders" className="btn btn-ghost">← All Orders</Link>
        </div>

        {/* Timeline */}
        <div className="card ot-timeline-card">
          <div className="ot-timeline">
            {ALL_STATES.map((state, idx) => {
              const done = completedStates.has(state);
              const current = state === order.status;
              const ts = order.timeline.find(t => t.state === state);
              return (
                <div key={state} className={`ot-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                  <div className="ot-step-icon">{STATE_ICONS[state]}</div>
                  <div className="ot-step-label">{STATE_LABELS[state]}</div>
                  {ts && <div className="ot-step-ts">{new Date(ts.ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>}
                  {idx < ALL_STATES.length - 1 && <div className={`ot-connector ${idx < currentIdx ? 'done' : ''}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="ot-details-grid">
          <div className="card">
            <div className="ot-detail-header"><Package size={16} /> Order Details</div>
            <div className="ot-detail-rows">
              <div className="ot-detail-row"><span>Product</span><span>{order.productName}</span></div>
              <div className="ot-detail-row"><span>Amount</span><span>₹{order.amount.toLocaleString()}</span></div>
              <div className="ot-detail-row"><span>Status</span><span className="badge badge-green">{order.status.replace(/_/g, ' ')}</span></div>
              {order.estimatedDelivery && <div className="ot-detail-row"><span>Est. Delivery</span><span>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>}
            </div>
          </div>
          <div className="card">
            <div className="ot-detail-header"><CreditCard size={16} /> Payment Info</div>
            <div className="ot-detail-rows">
              <div className="ot-detail-row"><span>Payment</span><span className={`badge badge-${order.paymentStatus === 'SUCCESS' ? 'green' : 'red'}`}>{order.paymentStatus}</span></div>
              {order.transactionId && <div className="ot-detail-row"><span>Transaction ID</span><span className="mono-sm">{order.transactionId}</span></div>}
              {order.reservationId && <div className="ot-detail-row"><span>Reservation ID</span><span className="mono-sm">{order.reservationId}</span></div>}
            </div>
          </div>
          {order.address && (
            <div className="card">
              <div className="ot-detail-header"><MapPin size={16} /> Delivery Address</div>
              <div className="ot-address">
                <div>{order.address.name}</div>
                <div>{order.address.line1}</div>
                <div>{order.address.city}, {order.address.state} — {order.address.pin}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
