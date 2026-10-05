/**
 * SOLID: SRP — Encapsulates the entire "buy now" flow:
 *              idempotency check → inventory reservation → reservation state.
 *              ProductDetail becomes a pure UI component.
 *
 * SOLID: DIP — ProductDetail depends on this hook abstraction,
 *              not on inventoryService / idempotencyService directly.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { reserveUnit } from '../utils/inventoryService';
import { idempotencyService } from '../utils/idempotencyService';
import { addActivity } from '../utils/simulationService';
import { useInventory } from './useInventory';
import { useReservation } from './useReservation';
import { useToast } from './useToast';

export function usePurchase() {
  const navigate = useNavigate();
  const { refreshInventory } = useInventory();
  const { setReservation } = useReservation();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const buyNow = useCallback(async (product, qty = 1) => {
    const requestId = `BUY-${product.id}-${Date.now()}`;

    // SOLID: SRP — idempotency check is delegated to idempotencyService
    const existing = idempotencyService.check(requestId);
    if (existing) {
      addToast('Duplicate request detected — returning existing transaction.', 'warning');
      addActivity('duplicate', `Duplicate buy request blocked for ${product.name}`);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    // SOLID: DIP — depends on reserveUnit abstraction
    const result = reserveUnit();

    if (!result.success) {
      addToast('Out of stock! No units available.', 'error');
      addActivity('rejected', `Request rejected — Out of Stock for ${product.name}`);
      refreshInventory();
      setLoading(false);
      return;
    }

    idempotencyService.register(requestId, {
      reservationId: result.reservationId,
      productId: product.id,
    });

    setReservation({
      id: result.reservationId,
      productId: product.id,
      product,
      qty,
      expiresAt: Date.now() + 5 * 60 * 1000,
      requestId,
    });

    refreshInventory();
    addActivity('reserved', `Reservation created: ${result.reservationId} for ${product.name}`);
    addToast('Inventory reserved! Proceed to checkout.', 'success');
    setLoading(false);
    navigate('/checkout');
  }, [navigate, refreshInventory, setReservation, addToast]);

  return { buyNow, loading };
}
