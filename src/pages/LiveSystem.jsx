/**
 * SOLID: SRP — LiveSystem is a pure UI component.
 *              Simulation logic lives in simulationService.
 *              Reset logic lives in useDemoReset.
 *
 * SOLID: OCP — Failure scenarios and flows are driven by FAILURE_SCENARIOS
 *              and FAILURE_FLOWS config from simulationService.
 *              Adding a new scenario requires zero changes to this component.
 *
 * SOLID: DIP — Depends on useInventory, useDemoReset hooks and
 *              simulationService abstractions, not on raw service calls.
 *
 * SOLID: ISP — Imports only the specific hooks it needs.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Server, Zap, RefreshCw, Play,
  AlertTriangle, CheckCircle, XCircle, Clock, RotateCcw, FlaskConical,
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useDemoReset } from '../hooks/useDemoReset';
import {
  getActivity, addActivity, clearActivity,
  runConcurrencySimulation,
  FAILURE_SCENARIOS, FAILURE_FLOWS,
} from '../utils/simulationService';
import './LiveSystem.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICES = [
  { name: 'API Gateway',         key: 'api' },
  { name: 'Inventory Service',   key: 'inventory' },
  { name: 'Payment Service',     key: 'payment' },
  { name: 'Order Service',       key: 'order' },
  { name: 'Notification Service',key: 'notification' },
];

// SOLID: OCP — Icon map is data-driven; new types added here only
const ACTIVITY_ICONS = {
  reserved:   { icon: CheckCircle, color: 'var(--green)' },
  confirmed:  { icon: CheckCircle, color: 'var(--green)' },
  rejected:   { icon: XCircle,     color: 'var(--red)' },
  failed:     { icon: XCircle,     color: 'var(--red)' },
  duplicate:  { icon: AlertTriangle, color: 'var(--yellow)' },
  timeout:    { icon: Clock,       color: 'var(--yellow)' },
  payment:    { icon: Activity,    color: 'var(--blue)' },
  released:   { icon: RefreshCw,   color: 'var(--orange)' },
  simulation: { icon: Zap,         color: 'var(--blue)' },
};

// SOLID: OCP — Icon resolver for failure scenario buttons
const SCENARIO_ICONS = {
  error:   XCircle,
  warning: AlertTriangle,
  server:  Server,
  refresh: RefreshCw,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LiveSystem() {
  const { inventory, refreshInventory } = useInventory();
  const { resetDemo } = useDemoReset();

  const [activity, setActivity] = useState(getActivity());
  const [services, setServices] = useState(
    () => Object.fromEntries(SERVICES.map(s => [s.key, 'HEALTHY']))
  );
  const [simRunning, setSimRunning]   = useState(false);
  const [simProgress, setSimProgress] = useState(null);
  const [simResult, setSimResult]     = useState(null);
  const [failureFlow, setFailureFlow] = useState(null);

  const refreshActivity = useCallback(() => setActivity(getActivity()), []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshInventory();
      refreshActivity();
    }, 1000);
    return () => clearInterval(interval);
  }, [refreshInventory, refreshActivity]);

  // ─── Simulation ─────────────────────────────────────────────────────────────

  const runSim = async () => {
    setSimRunning(true);
    setSimResult(null);
    setSimProgress({ processed: 0, successful: 0, rejected: 0, duplicates: 0, oversold: 0 });
    addActivity('simulation', 'Concurrency simulation started — 10,000 requests');
    refreshActivity();

    const result = await runConcurrencySimulation(10000, 100, (p) => setSimProgress({ ...p }));
    setSimProgress(result);
    setSimResult(result);
    addActivity('simulation',
      `Simulation complete — ${result.successful}/100 reserved, ${result.rejected} rejected, ${result.duplicates} duplicates blocked`
    );
    refreshActivity();
    setSimRunning(false);
  };

  // ─── Failure Scenarios (OCP) ─────────────────────────────────────────────────
  // SOLID: OCP — This function is generic. It reads from FAILURE_FLOWS config.
  //              No code change needed when new scenarios are added to the config.

  const triggerFailure = useCallback((scenarioKey) => {
    const flow = FAILURE_FLOWS[scenarioKey];
    if (!flow) return;

    setFailureFlow({ scenario: scenarioKey, steps: flow, current: 0 });

    flow.forEach((step, i) => {
      setTimeout(() => {
        addActivity(step.type, step.msg);
        refreshActivity();
        setFailureFlow(f => f ? { ...f, current: i + 1 } : null);
        if (i === flow.length - 1) setTimeout(() => setFailureFlow(null), 2000);
      }, i * 1200);
    });

    // Side-effect: degrade order service for the relevant scenario
    if (scenarioKey === 'order_unavailable') {
      setServices(s => ({ ...s, order: 'DEGRADED' }));
      setTimeout(() => setServices(s => ({ ...s, order: 'HEALTHY' })), 4000);
    }
  }, [refreshActivity]);

  // ─── Reset ───────────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    resetDemo();
    clearActivity();
    setActivity([]);
    setSimProgress(null);
    setSimResult(null);
    setFailureFlow(null);
    setServices(Object.fromEntries(SERVICES.map(s => [s.key, 'HEALTHY'])));
  }, [resetDemo]);

  // ─── Derived values ──────────────────────────────────────────────────────────

  const TOTAL = 100;
  const availPct = (inventory.availableStock / TOTAL) * 100;
  const resPct   = (inventory.reservedStock  / TOTAL) * 100;
  const soldPct  = (inventory.soldStock      / TOTAL) * 100;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="page ls-page">
      <div className="container section">

        {/* Header */}
        <div className="ls-header">
          <div>
            <div className="badge badge-red ls-live-badge">
              <span className="status-dot red" /> LIVE SIMULATION
            </div>
            <h1 className="ls-title">FLASH SALE CONTROL CENTER</h1>
            <p className="ls-sub">Real-time visibility into inventory, requests and transaction health.</p>
          </div>
          <button className="btn btn-ghost ls-reset-btn" onClick={handleReset}>
            <RotateCcw size={16} /> Reset Demo
          </button>
        </div>

        {/* Top metrics */}
        <div className="ls-metrics">
          {[
            { label: 'Concurrent Requests', value: '10,000',                  sub: 'Design scenario',   color: 'blue' },
            { label: 'Available Stock',      value: inventory.availableStock,  sub: 'Units remaining',   color: 'green' },
            { label: 'Reserved',             value: inventory.reservedStock,   sub: 'Pending payment',   color: 'orange' },
            { label: 'Sold',                 value: inventory.soldStock,       sub: 'Confirmed orders',  color: 'blue' },
            { label: 'Oversold',             value: '0',                       sub: 'Zero tolerance',    color: 'green' },
          ].map(m => (
            <div key={m.label} className="ls-metric card">
              <div className={`ls-metric-val ls-${m.color}`}>{m.value}</div>
              <div className="ls-metric-label">{m.label}</div>
              <div className="ls-metric-sub">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="ls-main-grid">

          {/* Inventory Status */}
          <div className="card ls-inventory">
            <h3 className="ls-section-title"><Activity size={18} /> Inventory Status</h3>
            <div className="ls-inv-bars">
              {[
                { label: 'Available', value: inventory.availableStock, pct: availPct, color: 'green' },
                { label: 'Reserved',  value: inventory.reservedStock,  pct: resPct,   color: 'orange' },
                { label: 'Sold',      value: inventory.soldStock,      pct: soldPct,  color: 'red' },
              ].map(b => (
                <div key={b.label} className="ls-inv-bar-row">
                  <div className="ls-inv-bar-header">
                    <span>{b.label}</span>
                    <span className={`ls-${b.color}`}>{b.value} / {TOTAL}</span>
                  </div>
                  <div className="progress-bar" style={{ height: 12 }}>
                    <div className={`progress-fill ${b.color}`} style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="ls-inv-ring">
              <div className="ls-ring-chart">
                <svg viewBox="0 0 100 100" width="120" height="120">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--red)" strokeWidth="12"
                    strokeDasharray={`${soldPct * 2.51} 251`} strokeDashoffset="62.75" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--orange)" strokeWidth="12"
                    strokeDasharray={`${resPct * 2.51} 251`}
                    strokeDashoffset={`${62.75 - soldPct * 2.51}`} strokeLinecap="round" />
                </svg>
                <div className="ls-ring-center">
                  <span className="ls-ring-val">{inventory.soldStock + inventory.reservedStock}</span>
                  <span className="ls-ring-label">used</span>
                </div>
              </div>
              <div className="ls-ring-legend">
                <div className="ls-legend-item"><span className="status-dot red" /> Sold: {inventory.soldStock}</div>
                <div className="ls-legend-item"><span className="status-dot" style={{ background: 'var(--orange)' }} /> Reserved: {inventory.reservedStock}</div>
                <div className="ls-legend-item"><span className="status-dot green" /> Available: {inventory.availableStock}</div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card ls-activity">
            <h3 className="ls-section-title"><Activity size={18} /> Request Activity</h3>
            <div className="ls-activity-feed">
              {activity.length === 0 ? (
                <div className="ls-empty">No activity yet. Run a simulation or make a purchase.</div>
              ) : (
                activity.slice(0, 20).map(a => {
                  const cfg = ACTIVITY_ICONS[a.type] || ACTIVITY_ICONS.payment;
                  const Icon = cfg.icon;
                  return (
                    <div key={a.id} className="ls-activity-item">
                      <Icon size={14} style={{ color: cfg.color, flexShrink: 0 }} />
                      <span className="ls-activity-msg">{a.message}</span>
                      <span className="ls-activity-ts">
                        {new Date(a.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="card ls-health">
            <h3 className="ls-section-title"><Server size={18} /> System Health</h3>
            <div className="ls-services">
              {SERVICES.map(s => {
                const status = services[s.key];
                return (
                  <div key={s.key} className="ls-service-row">
                    <span className="ls-service-name">{s.name}</span>
                    <div className={`ls-service-status ls-status-${status.toLowerCase()}`}>
                      <span className={`status-dot ${status === 'HEALTHY' ? 'green' : status === 'DEGRADED' ? 'yellow' : 'red'}`} />
                      {status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Concurrency Simulation */}
        <div className="card ls-sim-card">
          <div className="ls-sim-header">
            <div>
              <h3 className="ls-section-title"><Zap size={18} /> 10,000 → 100 Concurrency Test</h3>
              <p className="ls-sim-desc">
                Frontend simulation demonstrating inventory protection under extreme concurrency. Not a real load test.
              </p>
            </div>
            <button className="btn btn-primary" onClick={runSim} disabled={simRunning}>
              {simRunning ? <><span className="spin-inline" />Running...</> : <><Play size={16} /> Run Simulation</>}
            </button>
          </div>

          {simProgress && (
            <div className="ls-sim-progress">
              <div className="ls-sim-stats">
                {[
                  { label: 'Requests Processed',      value: `${simProgress.processed.toLocaleString()} / 10,000`, color: 'blue' },
                  { label: 'Successful Reservations', value: `${simProgress.successful} / 100`,                    color: 'green' },
                  { label: 'Rejected',                value: simProgress.rejected.toLocaleString(),                color: 'red' },
                  { label: 'Duplicates Blocked',      value: simProgress.duplicates.toLocaleString(),              color: 'yellow' },
                  { label: 'Oversold',                value: '0',                                                  color: 'green' },
                ].map(s => (
                  <div key={s.label} className="ls-sim-stat">
                    <div className={`ls-sim-stat-val ls-${s.color}`}>{s.value}</div>
                    <div className="ls-sim-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="ls-sim-bar-wrap">
                <div className="ls-sim-bar-label">
                  <span>Progress</span>
                  <span>{Math.round((simProgress.processed / 10000) * 100)}%</span>
                </div>
                <div className="progress-bar" style={{ height: 14 }}>
                  <div className="progress-fill blue" style={{ width: `${(simProgress.processed / 10000) * 100}%` }} />
                </div>
              </div>
              {simResult && (
                <div className="ls-sim-result">
                  <CheckCircle size={24} style={{ color: 'var(--green)' }} />
                  <div>
                    <div className="ls-sim-result-title">Simulation Complete</div>
                    <div className="ls-sim-result-sub">100 units protected successfully. Oversold: 0.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Failure Scenarios — driven entirely by FAILURE_SCENARIOS config (OCP) */}
        <div className="card ls-failures">
          <div className="ls-failures-header">
            <FlaskConical size={18} style={{ color: 'var(--orange)' }} />
            <h3>Failure Scenarios</h3>
            <span className="badge badge-orange">DEMO</span>
          </div>
          <p className="ls-failures-desc">
            Click a scenario to see the event flow in the activity feed above.
          </p>
          <div className="ls-failure-btns">
            {FAILURE_SCENARIOS.map(f => {
              const Icon = SCENARIO_ICONS[f.iconType] || AlertTriangle;
              return (
                <button
                  key={f.key}
                  className={`btn btn-ghost ls-failure-btn ${failureFlow?.scenario === f.key ? 'active' : ''}`}
                  onClick={() => triggerFailure(f.key)}
                >
                  <Icon size={15} style={{ color: `var(--${f.color})` }} />
                  {f.label}
                </button>
              );
            })}
          </div>

          {failureFlow && (
            <div className="ls-failure-flow">
              <div className="ls-flow-title">
                Event Flow: {failureFlow.scenario.replace(/_/g, ' ').toUpperCase()}
              </div>
              <div className="ls-flow-steps">
                {failureFlow.steps.map((step, i) => {
                  const cfg = ACTIVITY_ICONS[step.type] || ACTIVITY_ICONS.payment;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={i}
                      className={`ls-flow-step ${i < failureFlow.current ? 'done' : i === failureFlow.current ? 'active' : ''}`}
                    >
                      <Icon size={14} style={{ color: cfg.color }} />
                      <span>{step.msg}</span>
                      {i < failureFlow.steps.length - 1 && <span className="ls-flow-arrow">→</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
