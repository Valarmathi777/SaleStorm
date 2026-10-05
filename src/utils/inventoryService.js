/**
 * SOLID: SRP — Manages only inventory state and persistence.
 * SOLID: OCP — Storage key is configurable; new inventory operations
 *              can be added without modifying existing ones.
 */

const STORAGE_KEY = 'salestorm_inventory';

const DEFAULT_STATE = {
  availableStock: 100,
  reservedStock: 0,
  soldStock: 0,
};

export function getInventory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveInventory(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function reserveUnit() {
  const inv = getInventory();
  if (inv.availableStock <= 0) return { success: false, reason: 'OUT_OF_STOCK' };
  inv.availableStock -= 1;
  inv.reservedStock += 1;
  saveInventory(inv);
  return {
    success: true,
    reservationId: `RES-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
  };
}

export function releaseReservation() {
  const inv = getInventory();
  if (inv.reservedStock <= 0) return;
  inv.reservedStock -= 1;
  inv.availableStock += 1;
  saveInventory(inv);
}

export function confirmSale() {
  const inv = getInventory();
  if (inv.reservedStock <= 0) return;
  inv.reservedStock -= 1;
  inv.soldStock += 1;
  saveInventory(inv);
}

export function resetInventory() {
  saveInventory({ ...DEFAULT_STATE });
}
