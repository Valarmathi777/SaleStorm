import { useState, useEffect } from 'react';

export function useCountdown(seconds) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return { remaining, display: `${mm}:${ss}`, expired: remaining === 0 };
}

export function useFlashSaleCountdown() {
  const TARGET_SECONDS = 14 * 60 + 52;
  const [remaining, setRemaining] = useState(() => {
    const stored = localStorage.getItem('salestorm_flash_end');
    if (stored) {
      const diff = Math.floor((parseInt(stored) - Date.now()) / 1000);
      return diff > 0 ? diff : TARGET_SECONDS;
    }
    const end = Date.now() + TARGET_SECONDS * 1000;
    localStorage.setItem('salestorm_flash_end', end.toString());
    return TARGET_SECONDS;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          const end = Date.now() + TARGET_SECONDS * 1000;
          localStorage.setItem('salestorm_flash_end', end.toString());
          return TARGET_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hh = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}
