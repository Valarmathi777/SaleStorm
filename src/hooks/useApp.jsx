/**
 * SOLID: ISP — useApp is kept as a convenience re-export for components
 * that genuinely need multiple contexts (e.g. Navbar needs cart + toast).
 * Components that need only one concern should import the focused hook directly.
 */

export { useToast } from './useToast';
export { useInventory } from './useInventory';
export { useCart } from './useCart';
export { useReservation } from './useReservation';
