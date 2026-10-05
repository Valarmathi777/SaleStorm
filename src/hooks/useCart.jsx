/**
 * SOLID: SRP — Manages only shopping cart state and persistence.
 * SOLID: ISP — Components that only need cart data import useCart,
 *              not inventory or toast state.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './useToast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { addToast } = useToast();

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('salestorm_cart') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('salestorm_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    addToast(`${product.name} added to cart`, 'success');
  }, [addToast]);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateCartQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, removeFromCart, updateCartQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
