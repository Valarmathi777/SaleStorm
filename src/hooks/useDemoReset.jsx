/**
 * SOLID: SRP — Orchestrates demo reset across all services.
 *              This is the only place that knows about the full reset sequence.
 * SOLID: DIP — Depends on service abstractions and context hooks,
 *              not on localStorage directly.
 */

import { useCallback } from 'react';
import { clearOrders } from '../utils/orderService';
import { clearActivity } from '../utils/simulationService';
import { idempotencyService } from '../utils/idempotencyService';
import { useInventory } from './useInventory';
import { useCart } from './useCart';
import { useReservation } from './useReservation';
import { useToast } from './useToast';

export function useDemoReset() {
  const { resetStock } = useInventory();
  const { clearCart } = useCart();
  const { clearReservation } = useReservation();
  const { addToast } = useToast();

  const resetDemo = useCallback(() => {
    resetStock();
    clearOrders();
    clearActivity();
    idempotencyService.clear();
    clearCart();
    clearReservation();
    addToast('Demo reset successfully', 'success');
  }, [resetStock, clearOrders, clearActivity, clearCart, clearReservation, addToast]);

  return { resetDemo };
}
