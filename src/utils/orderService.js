/**
 * SOLID: SRP — Manages only order creation, retrieval and persistence.
 * SOLID: OCP — Order shape can be extended via the builder pattern
 *              without modifying createOrder's signature.
 */

const ORDERS_KEY = 'salestorm_orders';

export function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
  catch { return []; }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// SOLID: OCP — buildOrderTimeline is a separate concern, easy to extend
function buildOrderTimeline() {
  const now = new Date().toISOString();
  return [
    { state: 'CREATED', ts: now },
    { state: 'PAYMENT_PENDING', ts: now },
    { state: 'CONFIRMED', ts: now },
  ];
}

export function createOrder({ product, reservationId, transactionId, address, amount }) {
  const order = {
    id: `ST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    productId: product.id,
    productName: product.name,
    amount,
    reservationId,
    transactionId,
    address,
    status: 'CONFIRMED',
    paymentStatus: 'SUCCESS',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: buildOrderTimeline(),
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function getOrderById(id) {
  return getOrders().find(o => o.id === id);
}

export function clearOrders() {
  localStorage.removeItem(ORDERS_KEY);
}
