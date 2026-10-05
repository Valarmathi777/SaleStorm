/**
 * SOLID: SRP — Manages only reservation state and persistence.
 * SOLID: ISP — Components that only need reservation data import useReservation,
 *              not cart or inventory state.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ReservationContext = createContext(null);

export function ReservationProvider({ children }) {
  const [reservation, setReservationState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('salestorm_reservation') || 'null'); }
    catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem('salestorm_reservation', JSON.stringify(reservation));
  }, [reservation]);

  const setReservation = useCallback((res) => {
    setReservationState(res);
  }, []);

  const clearReservation = useCallback(() => {
    setReservationState(null);
    localStorage.removeItem('salestorm_reservation');
  }, []);

  return (
    <ReservationContext.Provider value={{ reservation, setReservation, clearReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

export const useReservation = () => useContext(ReservationContext);
