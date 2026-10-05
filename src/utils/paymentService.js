/**
 * SOLID: SRP — Handles only payment processing and reconciliation.
 * SOLID: OCP — New payment scenarios can be added to PAYMENT_HANDLERS
 *              without modifying processPayment's core logic.
 * SOLID: DIP — Depends on inventoryService abstractions (confirmSale,
 *              releaseReservation), not on storage directly.
 */

import { confirmSale, releaseReservation } from './inventoryService';

const generateTxnId = () =>
  `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

// SOLID: OCP — Add new scenarios here without touching processPayment
const PAYMENT_HANDLERS = {
  success: (transactionId) =>
    new Promise((resolve) =>
      setTimeout(() => {
        confirmSale();
        resolve({ status: 'SUCCESS', transactionId });
      }, 1500)
    ),

  failure: (transactionId) =>
    new Promise((resolve) =>
      setTimeout(() => {
        releaseReservation();
        resolve({ status: 'FAILED', transactionId, reason: 'Payment declined by bank' });
      }, 1500)
    ),

  timeout: (transactionId) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({ status: 'TIMEOUT', transactionId, reason: 'Payment gateway timeout' });
      }, 2000)
    ),
};

export function processPayment(scenario = 'success') {
  const transactionId = generateTxnId();
  const handler = PAYMENT_HANDLERS[scenario];
  if (!handler) return Promise.reject(new Error(`Unknown payment scenario: ${scenario}`));
  return handler(transactionId);
}

export function reconcilePayment(transactionId) {
  return new Promise((resolve) =>
    setTimeout(() => {
      confirmSale();
      resolve({ status: 'SUCCESS', transactionId, reconciled: true });
    }, 3000)
  );
}
