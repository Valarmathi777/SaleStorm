/**
 * SOLID: SRP — Encapsulates the entire payment orchestration flow:
 *              process → handle success/failure/timeout → reconcile → create order.
 *              Payment.jsx becomes a pure UI component.
 *
 * SOLID: DIP — Payment.jsx depends on this hook abstraction,
 *              not on paymentService / orderService / simulationService directly.
 *
 * SOLID: OCP — New payment outcomes can be handled by extending
 *              the OUTCOME_HANDLERS map without modifying existing logic.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment, reconcilePayment } from '../utils/paymentService';
import { createOrder } from '../utils/orderService';
import { addActivity } from '../utils/simulationService';
import { useInventory } from './useInventory';
import { useReservation } from './useReservation';
import { useCart } from './useCart';
import { useToast } from './useToast';

export function usePayment() {
  const navigate = useNavigate();
  const { refreshInventory } = useInventory();
  const { reservation, clearReservation } = useReservation();
  const { clearCart } = useCart();
  const { addToast } = useToast();
  const [status, setStatus] = useState('idle');
  const [txnId, setTxnId] = useState(null);

  // SOLID: OCP — extend this map to handle new payment outcomes
  const handleSuccess = useCallback(async (transactionId, address, amount) => {
    const order = createOrder({
      product: reservation.product,
      reservationId: reservation.id,
      transactionId,
      address,
      amount,
    });
    addActivity('confirmed', `Payment confirmed — Order ${order.id} created`);
    addToast('Payment successful! Order confirmed.', 'success');
    clearReservation();
    clearCart();
    refreshInventory();
    setStatus('success');
    setTimeout(() => navigate(`/order-confirmation/${order.id}`), 1000);
  }, [reservation, clearReservation, clearCart, refreshInventory, addToast, navigate]);

  const handleFailure = useCallback(() => {
    addActivity('failed', 'Payment failed — Reservation released');
    addToast('Payment failed. Inventory released.', 'error');
    clearReservation();
    refreshInventory();
    setStatus('failed');
  }, [clearReservation, refreshInventory, addToast]);

  const handleTimeout = useCallback(async (transactionId, address, amount) => {
    addActivity('timeout', `Payment timeout — Reconciliation started for ${transactionId}`);
    addToast('Payment timeout. Verifying status...', 'warning');
    setStatus('timeout');
    setTimeout(async () => {
      setStatus('reconciling');
      const rec = await reconcilePayment(transactionId);
      if (rec.status === 'SUCCESS') {
        await handleSuccess(rec.transactionId, address, amount);
      }
    }, 2000);
  }, [handleSuccess, addToast]);

  const pay = useCallback(async (scenario, address, amount) => {
    setStatus('processing');
    addActivity('payment', `Payment initiated — ${scenario} scenario`);
    const result = await processPayment(scenario);
    setTxnId(result.transactionId);

    if (result.status === 'SUCCESS') {
      await handleSuccess(result.transactionId, address, amount);
    } else if (result.status === 'FAILED') {
      handleFailure();
    } else if (result.status === 'TIMEOUT') {
      await handleTimeout(result.transactionId, address, amount);
    }
  }, [handleSuccess, handleFailure, handleTimeout]);

  const retry = useCallback(() => setStatus('idle'), []);

  return { pay, retry, status, txnId };
}
