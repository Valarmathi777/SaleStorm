/**
 * SOLID: OCP — Storage strategy is injected, not hardcoded.
 * The service is open for extension (swap to sessionStorage, IndexedDB)
 * without modifying the core idempotency logic.
 *
 * SOLID: SRP — This module only handles duplicate-request detection.
 */

// Default storage strategy — can be replaced for testing or extension
const createLocalStorageStrategy = (key) => ({
  read: () => {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  },
  write: (data) => localStorage.setItem(key, JSON.stringify(data)),
  clear: () => localStorage.removeItem(key),
});

// Factory: creates an idempotency checker bound to a storage strategy
// SOLID: DIP — consumers depend on this abstraction, not on localStorage directly
export function createIdempotencyService(storageStrategy = createLocalStorageStrategy('salestorm_idempotency')) {
  return {
    check(requestId) {
      const store = storageStrategy.read();
      return store[requestId] || null;
    },
    register(requestId, data) {
      const store = storageStrategy.read();
      store[requestId] = { ...data, timestamp: Date.now() };
      storageStrategy.write(store);
    },
    clear() {
      storageStrategy.clear();
    },
  };
}

// Singleton instance used throughout the app
export const idempotencyService = createIdempotencyService();
