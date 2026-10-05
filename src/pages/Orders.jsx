import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { getOrders } from '../utils/orderService';
import './Orders.css';

const MOCK_ORDERS = [
  { id: 'ST-DEMO01', productName: 'SALESTORM X1 Pro', amount: 50098, status: 'DELIVERED', paymentStatus: 'SUCCESS', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'ST-DEMO02', productName: 'AeroBuds Max', amount: 9098, status: 'SHIPPED', paymentStatus: 'SUCCESS', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'ST-DEMO03', productName: 'SmartFit Ultra', amount: 13098, status: 'PROCESSING', paymentStatus: 'SUCCESS', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'ST-DEMO04', productName: 'GameCore X', amount: 60098, status: 'CANCELLED', paymentStatus: 'FAILED', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const STATUS_COLORS = {
  DELIVERED: 'green', SHIPPED: 'blue', PROCESSING: 'orange',
  CONFIRMED: 'blue', PAYMENT_PENDING: 'yellow', CANCELLED: 'red',
  OUT_FOR_DELIVERY: 'blue',
};

export default function Orders() {
  const realOrders = getOrders();
  const allOrders = [...realOrders, ...MOCK_ORDERS];

  return (
    <div className="page orders-page">
      <div className="container section">
        <h1 className="section-title">My Orders</h1>
        <p className="section-sub">{allOrders.length} orders total</p>

        {allOrders.length === 0 ? (
          <div className="flex-center" style={{ flexDirection: 'column', gap: 16, padding: '80px 0' }}>
            <Package size={64} style={{ color: 'var(--text-muted)' }} />
            <h3>No orders yet</h3>
            <Link to="/flash-sale" className="btn btn-primary">Shop Flash Sale</Link>
          </div>
        ) : (
          <div className="orders-list">
            {allOrders.map(order => (
              <Link key={order.id} to={`/order-tracking/${order.id}`} className="order-card card">
                <div className="order-card-left">
                  <div className="order-id">{order.id}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="order-card-mid">
                  <div className="order-product">{order.productName}</div>
                  <div className="order-amount">₹{order.amount.toLocaleString()}</div>
                </div>
                <div className="order-card-right">
                  <span className={`badge badge-${STATUS_COLORS[order.status] || 'blue'}`}>{order.status.replace(/_/g, ' ')}</span>
                  <span className={`badge badge-${order.paymentStatus === 'SUCCESS' ? 'green' : 'red'}`}>
                    {order.paymentStatus === 'SUCCESS' ? 'Paid' : 'Failed'}
                  </span>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
