/**
 * db.js — SRP: Single responsibility = localStorage-backed database layer.
 * LLD: Repository pattern — all data access goes through this module.
 * HLD: Acts as the Data Layer in the 3-tier architecture (UI → Service → Data).
 * OCP: New collections can be added without modifying existing ones.
 */

const DB_PREFIX = 'salestorm_db_';

// Generic CRUD for any collection
const collection = (name) => {
  const key = `${DB_PREFIX}${name}`;
  const getAll = () => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const save = (data) => localStorage.setItem(key, JSON.stringify(data));

  return {
    findAll: () => getAll(),
    findById: (id) => getAll().find(r => r.id === id) || null,
    findOne: (predicate) => getAll().find(predicate) || null,
    insert: (record) => { const all = getAll(); all.push(record); save(all); return record; },
    update: (id, patch) => {
      const all = getAll().map(r => r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r);
      save(all); return all.find(r => r.id === id);
    },
    remove: (id) => { const all = getAll().filter(r => r.id !== id); save(all); },
    clear: () => localStorage.removeItem(key),
  };
};

export const UsersDB = collection('users');
export const OrdersDB = collection('orders');
export const WishlistDB = collection('wishlist');
export const ReviewsDB = collection('reviews');
