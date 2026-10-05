/**
 * SOLID: SRP — Manages only inventory state and refresh.
 * SOLID: ISP — Components that only need inventory data import useInventory,
 *              not cart or toast state.
 * SOLID: DIP — Depends on inventoryService abstraction, not localStorage directly.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { getInventory, resetInventory } from '../utils/inventoryService';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(getInventory());

  const refreshInventory = useCallback(() => {
    setInventory(getInventory());
  }, []);

  const resetStock = useCallback(() => {
    resetInventory();
    setInventory(getInventory());
  }, []);

  return (
    <InventoryContext.Provider value={{ inventory, refreshInventory, resetStock }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
