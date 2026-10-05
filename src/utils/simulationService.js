/**
 * SOLID: SRP — Activity logging and concurrency simulation are separate exports.
 * SOLID: OCP — FAILURE_FLOWS is a data-driven config map. Adding a new failure
 *              scenario only requires adding an entry here — no component changes needed.
 * SOLID: DIP — LiveSystem page depends on this config abstraction, not on
 *              hardcoded inline objects inside the component.
 */

const ACTIVITY_KEY = 'salestorm_activity';

// ─── Activity Log ────────────────────────────────────────────────────────────

export function getActivity() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]'); }
  catch { return []; }
}

export function addActivity(type, message) {
  const activity = getActivity();
  activity.unshift({ id: Date.now(), type, message, ts: new Date().toISOString() });
  if (activity.length > 100) activity.pop();
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
}

export function clearActivity() {
  localStorage.removeItem(ACTIVITY_KEY);
}

// ─── Concurrency Simulation ───────────────────────────────────────────────────

export function runConcurrencySimulation(totalRequests = 10000, availableUnits = 100, onProgress) {
  return new Promise((resolve) => {
    let processed = 0;
    let successful = 0;
    let rejected = 0;
    let duplicates = 0;
    const seenRequests = new Set();
    const DUPLICATE_RATE = 0.05;
    const BATCH = 500;

    function processBatch() {
      const end = Math.min(processed + BATCH, totalRequests);
      while (processed < end) {
        processed++;
        const isDuplicate = processed > 1 && Math.random() < DUPLICATE_RATE;
        if (isDuplicate) {
          const dupId = `REQ-${Math.floor(Math.random() * (processed - 1)) + 1}`;
          if (seenRequests.has(dupId)) { duplicates++; continue; }
        }
        seenRequests.add(`REQ-${processed}`);
        if (successful < availableUnits) { successful++; }
        else { rejected++; }
      }
      onProgress?.({ processed, successful, rejected, duplicates, oversold: 0 });
      if (processed < totalRequests) {
        setTimeout(processBatch, 16);
      } else {
        resolve({ processed, successful, rejected, duplicates, oversold: 0 });
      }
    }
    processBatch();
  });
}

// ─── Failure Scenario Config (OCP) ───────────────────────────────────────────
// SOLID: OCP — New scenarios are added here only. LiveSystem reads this config
//              and renders it generically — the component never needs to change.

export const FAILURE_SCENARIOS = [
  { key: 'payment_failure',     label: 'Payment Failure',        iconType: 'error',   color: 'red' },
  { key: 'payment_timeout',     label: 'Payment Timeout',        iconType: 'warning', color: 'yellow' },
  { key: 'order_unavailable',   label: 'Order Service Down',     iconType: 'server',  color: 'orange' },
  { key: 'reservation_expired', label: 'Reservation Expired',    iconType: 'warning', color: 'orange' },
  { key: 'duplicate_buy',       label: 'Duplicate Buy Request',  iconType: 'refresh', color: 'blue' },
  { key: 'inventory_zero',      label: 'Inventory Reaches Zero', iconType: 'error',   color: 'red' },
];

export const FAILURE_FLOWS = {
  payment_failure: [
    { type: 'payment',  msg: 'Payment initiated' },
    { type: 'failed',   msg: 'Payment declined by bank' },
    { type: 'released', msg: 'Reservation released — stock restored' },
  ],
  payment_timeout: [
    { type: 'payment',   msg: 'Payment initiated' },
    { type: 'timeout',   msg: 'Payment gateway timeout' },
    { type: 'payment',   msg: 'Reconciliation started — checking with bank' },
    { type: 'confirmed', msg: 'Reconciliation complete — payment confirmed' },
  ],
  order_unavailable: [
    { type: 'confirmed', msg: 'Payment successful' },
    { type: 'failed',    msg: 'Order service unavailable — event queued' },
    { type: 'payment',   msg: 'Retry attempt 1 — order service recovering' },
    { type: 'confirmed', msg: 'Order created successfully after retry' },
  ],
  reservation_expired: [
    { type: 'reserved', msg: 'Reservation created — 5 min window started' },
    { type: 'timeout',  msg: 'Reservation window expired (no payment)' },
    { type: 'released', msg: 'Reservation released — stock restored to pool' },
  ],
  duplicate_buy: [
    { type: 'payment',   msg: 'Buy request received — Request ID: REQ-7823' },
    { type: 'duplicate', msg: 'Idempotency check — duplicate request detected' },
    { type: 'confirmed', msg: 'Returning existing transaction — no duplicate created' },
  ],
  inventory_zero: [
    { type: 'payment',  msg: 'Buy request received — checking inventory' },
    { type: 'rejected', msg: 'Inventory check failed — 0 units available' },
    { type: 'failed',   msg: 'Request rejected — Out of Stock' },
  ],
};
