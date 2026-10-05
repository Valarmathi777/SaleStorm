import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { getOrderById } from '../utils/orderService';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const order = getOrderById(id);

  if (!order) return (
    <div className="page flex-center" style={{ flexDirection: 'column', gap: 16 }}>
      <Package size={64} style={{ color: 'var(--text-muted)' }} />
      <h2>Order not found</h2>
      <Link to="/orders" className="btn btn-primary">View Orders</Link>
    </div>
  );

  return (
    <div className="page oc-page">
      <div className="container section">
        <div className="oc-card card">
          <div className="oc-icon"><CheckCircle size={64} /></div>
          <h1 className="oc-title">Order Confirmed!</h1>
          <p className="oc-sub">Your order has been placed successfully.</p>

          <div className="oc-details">
            {[
              { label: 'Order ID', value: order.id, mono: true },
              { label: 'Payment', value: 'Successful', green: true },
              { label: 'Reservation', value: 'Confirmed', green: true },
              { label: 'Product', value: order.productName },
              { label: 'Total', value: `₹${order.amount.toLocaleString()}`, bold: true },
              { label: 'Estimated Delivery', value: new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
            ].map(d => (
              <div key={d.label} className="oc-detail-row">
                <span className="oc-detail-label">{d.label}</span>
                <span className={`oc-detail-val ${d.mono ? 'mono' : ''} ${d.green ? 'green' : ''} ${d.bold ? 'bold' : ''}`}>{d.value}</span>
              </div>
            ))}
          </div>

          <div className="oc-actions">
            <Link to={`/order-tracking/${order.id}`} className="btn btn-primary btn-lg">
              Track Order <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-ghost btn-lg">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
