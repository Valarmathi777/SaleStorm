import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Package, TrendingUp, Zap, Bell,
  ShieldCheck, BarChart2, Settings, Eye, AlertTriangle,
  RefreshCw, Lock, Unlock, ChevronRight, Activity,
  DollarSign, ShoppingCart, Clock, CheckCircle, XCircle,
  Cpu, Database, Wifi, ArrowUp, ArrowDown, Filter,
  Download, Search, ToggleLeft, ToggleRight, Flame
} from 'lucide-react';
import { UsersDB, OrdersDB } from '../utils/db';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import { PRODUCTS } from '../data/products';
import './AdminDashboard.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const fmt = (n) => n?.toLocaleString('en-IN') ?? '0';

// ── Feature 1: Real-time Fraud Detection Engine ───────────────────────────────
function FraudDetection() {
  const [alerts, setAlerts] = useState([
    { id: 1, user: 'user_4821', action: 'Multiple rapid checkouts', risk: 'HIGH', time: '2m ago', blocked: false },
    { id: 2, user: 'user_2934', action: 'VPN detected + flash sale', risk: 'MEDIUM', time: '5m ago', blocked: false },
    { id: 3, user: 'user_7712', action: 'Bot-like click pattern', risk: 'HIGH', time: '8m ago', blocked: true },
    { id: 4, user: 'user_1190', action: 'Duplicate payment attempt', risk: 'LOW', time: '12m ago', blocked: false },
  ]);

  const toggle = (id) => setAlerts(a => a.map(x => x.id === id ? { ...x, blocked: !x.blocked } : x));

  return (
    <div className="adm-feature-card">
      <div className="adm-feature-header">
        <div className="adm-feature-icon red"><ShieldCheck size={20} /></div>
        <div>
          <h3>AI Fraud Detection</h3>
          <p>Real-time behavioral analysis — not available on any Indian e-commerce platform</p>
        </div>
        <span className="badge badge-red adm-live-badge"><span className="status-dot red" /> LIVE</span>
      </div>
      <div className="adm-fraud-list">
        {alerts.map(a => (
          <div key={a.id} className={`adm-fraud-row ${a.blocked ? 'blocked' : ''}`}>
            <div className="adm-fraud-info">
              <span className="adm-fraud-user">{a.user}</span>
              <span className="adm-fraud-action">{a.action}</span>
              <span className="adm-fraud-time">{a.time}</span>
            </div>
            <div className="adm-fraud-right">
              <span className={`badge badge-${a.risk === 'HIGH' ? 'red' : a.risk === 'MEDIUM' ? 'orange' : 'yellow'}`}>
                {a.risk}
              </span>
              <button
                className={`btn btn-sm ${a.blocked ? 'btn-success' : 'btn-danger'}`}
                onClick={() => toggle(a.id)}
              >
                {a.blocked ? <><Unlock size={12} /> Unblock</> : <><Lock size={12} /> Block</>}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="adm-fraud-stats">
        <div className="adm-fraud-stat"><span>{alerts.filter(a => a.blocked).length}</span><p>Blocked</p></div>
        <div className="adm-fraud-stat"><span>{alerts.filter(a => a.risk === 'HIGH').length}</span><p>High Risk</p></div>
        <div className="adm-fraud-stat"><span>₹2.4L</span><p>Fraud Prevented</p></div>
      </div>
    </div>
  );
}

// ── Feature 2: Dynamic Pricing Engine ────────────────────────────────────────
function DynamicPricing() {
  const [rules, setRules] = useState([
    { id: 1, product: 'SALESTORM X1 Pro', trigger: 'Stock < 20%', action: '+8% price', active: true },
    { id: 2, product: 'AeroBuds Max', trigger: 'Demand spike > 500/hr', action: '+5% price', active: true },
    { id: 3, product: 'TitanBook Air', trigger: 'Competitor price drop', action: '-3% price', active: false },
    { id: 4, product: 'All Products', trigger: 'Flash sale window', action: '-15% price', active: true },
  ]);

  const toggle = (id) => setRules(r => r.map(x => x.id === id ? { ...x, active: !x.active } : x));

  return (
    <div className="adm-feature-card">
      <div className="adm-feature-header">
        <div className="adm-feature-icon orange"><TrendingUp size={20} /></div>
        <div>
          <h3>Dynamic Pricing Engine</h3>
          <p>Auto-adjust prices based on demand, stock & competition in real-time</p>
        </div>
        <span className="badge badge-orange">{rules.filter(r => r.active).length} rules active</span>
      </div>
      <div className="adm-pricing-list">
        {rules.map(r => (
          <div key={r.id} className="adm-pricing-row">
            <div className="adm-pricing-info">
              <span className="adm-pricing-product">{r.product}</span>
              <span className="adm-pricing-trigger">IF: {r.trigger}</span>
              <span className="adm-pricing-action">THEN: {r.action}</span>
            </div>
            <button className="adm-toggle-btn" onClick={() => toggle(r.id)}>
              {r.active
                ? <ToggleRight size={28} className="toggle-on" />
                : <ToggleLeft size={28} className="toggle-off" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature 3: Live Heatmap & Demand Forecasting ──────────────────────────────
function DemandForecast() {
  const [data] = useState(() =>
    PRODUCTS.map(p => ({
      name: p.name,
      current: rand(200, 2000),
      forecast: rand(500, 5000),
      trend: rand(0, 1) ? 'up' : 'down',
      confidence: rand(72, 98),
    }))
  );

  return (
    <div className="adm-feature-card">
      <div className="adm-feature-header">
        <div className="adm-feature-icon blue"><BarChart2 size={20} /></div>
        <div>
          <h3>AI Demand Forecasting</h3>
          <p>ML-powered 24hr demand prediction with confidence scores</p>
        </div>
      </div>
      <div className="adm-forecast-list">
        {data.map(d => (
          <div key={d.name} className="adm-forecast-row">
            <span className="adm-forecast-name">{d.name}</span>
            <div className="adm-forecast-bar-wrap">
              <div className="adm-forecast-bar">
                <div className="adm-forecast-fill" style={{ width: `${(d.current / 5000) * 100}%` }} />
                <div className="adm-forecast-fill forecast" style={{ width: `${(d.forecast / 5000) * 100}%`, opacity: 0.4 }} />
              </div>
              <span className="adm-forecast-nums">{fmt(d.current)} → {fmt(d.forecast)}</span>
            </div>
            <div className="adm-forecast-meta">
              {d.trend === 'up'
                ? <ArrowUp size={14} className="trend-up" />
                : <ArrowDown size={14} className="trend-down" />}
              <span className="adm-confidence">{d.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature 4: Smart Inventory Reorder System ─────────────────────────────────
function SmartReorder() {
  const [orders, setOrders] = useState([
    { id: 1, product: 'SALESTORM X1 Pro', current: 12, reorderAt: 20, qty: 500, status: 'TRIGGERED', supplier: 'TechCorp Asia' },
    { id: 2, product: 'AeroBuds Max', current: 45, reorderAt: 30, qty: 300, status: 'PENDING', supplier: 'AudioPro Ltd' },
    { id: 3, product: 'TitanBook Air', current: 8, reorderAt: 15, qty: 200, status: 'TRIGGERED', supplier: 'LaptopWorld' },
    { id: 4, product: 'GameCore X', current: 22, reorderAt: 25, qty: 150, status: 'PENDING', supplier: 'GameTech Inc' },
  ]);

  const approve = (id) => setOrders(o => o.map(x => x.id === id ? { ...x, status: 'APPROVED' } : x));

  return (
    <div className="adm-feature-card">
      <div className="adm-feature-header">
        <div className="adm-feature-icon green"><Package size={20} /></div>
        <div>
          <h3>Smart Auto-Reorder</h3>
          <p>AI triggers supplier POs automatically when stock hits threshold</p>
        </div>
        <span className="badge badge-red">{orders.filter(o => o.status === 'TRIGGERED').length} triggered</span>
      </div>
      <div className="adm-reorder-list">
        {orders.map(o => (
          <div key={o.id} className={`adm-reorder-row ${o.status === 'TRIGGERED' ? 'triggered' : ''}`}>
            <div className="adm-reorder-info">
              <span className="adm-reorder-product">{o.product}</span>
              <span className="adm-reorder-detail">Stock: <b>{o.current}</b> / Reorder at: <b>{o.reorderAt}</b> · Supplier: {o.supplier}</span>
            </div>
            <div className="adm-reorder-right">
              <span className={`badge badge-${o.status === 'TRIGGERED' ? 'red' : o.status === 'APPROVED' ? 'green' : 'yellow'}`}>
                {o.status}
              </span>
              {o.status === 'TRIGGERED' && (
                <button className="btn btn-success btn-sm" onClick={() => approve(o.id)}>
                  <CheckCircle size={12} /> Approve PO
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature 5: Flash Sale Scheduler ──────────────────────────────────────────
function FlashScheduler() {
  const [sales, setSales] = useState([
    { id: 1, name: 'Mega Monday', products: 3, discount: 35, start: '2025-08-04 10:00', units: 100, status: 'SCHEDULED' },
    { id: 2, name: 'Weekend Blitz', products: 5, discount: 25, start: '2025-08-09 12:00', units: 250, status: 'DRAFT' },
    { id: 3, name: 'Independence Day Sale', products: 8, discount: 47, start: '2025-08-15 00:00', units: 500, status: 'SCHEDULED' },
  ]);

  const activate = (id) => setSales(s => s.map(x => x.id === id ? { ...x, status: 'LIVE' } : x));

  return (
    <div className="adm-feature-card">
      <div className="adm-feature-header">
        <div className="adm-feature-icon purple"><Flame size={20} /></div>
        <div>
          <h3>Flash Sale Scheduler</h3>
          <p>Schedule, configure and launch flash sales with one click</p>
        </div>
        <button className="btn btn-primary btn-sm">+ New Sale</button>
      </div>
      <div className="adm-scheduler-list">
        {sales.map(s => (
          <div key={s.id} className="adm-scheduler-row">
            <div className="adm-scheduler-info">
              <span className="adm-scheduler-name">{s.name}</span>
              <span className="adm-scheduler-detail">
                {s.products} products · {s.discount}% OFF · {s.units} units · {s.start}
              </span>
            </div>
            <div className="adm-scheduler-right">
              <span className={`badge badge-${s.status === 'LIVE' ? 'red' : s.status === 'SCHEDULED' ? 'blue' : 'yellow'}`}>
                {s.status}
              </span>
              {s.status !== 'LIVE' && (
                <button className="btn btn-danger btn-sm" onClick={() => activate(s.id)}>
                  <Zap size={12} /> Go Live
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature 6: System Health Monitor ─────────────────────────────────────────
function SystemHealth() {
  const [metrics, setMetrics] = useState({
    cpu: rand(20, 75), memory: rand(40, 80), latency: rand(12, 80),
    rps: rand(800, 4500), errors: rand(0, 5), uptime: '99.97%',
  });

  useEffect(() => {
    const t = setInterval(() => setMetrics({
      cpu: rand(20, 75), memory: rand(40, 80), latency: rand(12, 80),
      rps: rand(800, 4500), errors: rand(0, 5), uptime: '99.97%',
    }), 3000);
    return () => clearInterval(t);
  }, []);

  const health = (v, warn, crit) => v > crit ? 'red' : v > warn ? 'orange' : 'green';

  return (
    <div className="adm-feature-card">
      <div className="adm-feature-header">
        <div className="adm-feature-icon blue"><Activity size={20} /></div>
        <div>
          <h3>Live System Health</h3>
          <p>Real-time infrastructure metrics — auto-refreshes every 3s</p>
        </div>
        <span className="badge badge-green"><span className="status-dot green" /> All Systems Go</span>
      </div>
      <div className="adm-health-grid">
        {[
          { icon: <Cpu size={18} />, label: 'CPU Usage', value: `${metrics.cpu}%`, color: health(metrics.cpu, 60, 80), bar: metrics.cpu },
          { icon: <Database size={18} />, label: 'Memory', value: `${metrics.memory}%`, color: health(metrics.memory, 65, 85), bar: metrics.memory },
          { icon: <Wifi size={18} />, label: 'Latency', value: `${metrics.latency}ms`, color: health(metrics.latency, 50, 100), bar: Math.min(metrics.latency, 100) },
          { icon: <Activity size={18} />, label: 'Req/sec', value: fmt(metrics.rps), color: 'blue', bar: (metrics.rps / 5000) * 100 },
          { icon: <AlertTriangle size={18} />, label: 'Error Rate', value: `${metrics.errors}/min`, color: health(metrics.errors, 2, 10), bar: metrics.errors * 10 },
          { icon: <CheckCircle size={18} />, label: 'Uptime', value: metrics.uptime, color: 'green', bar: 99.97 },
        ].map(m => (
          <div key={m.label} className="adm-health-metric">
            <div className={`adm-health-icon ${m.color}`}>{m.icon}</div>
            <div className="adm-health-info">
              <span className="adm-health-label">{m.label}</span>
              <span className={`adm-health-value ${m.color}`}>{m.value}</span>
              <div className="progress-bar" style={{ height: 4, marginTop: 4 }}>
                <div className={`progress-fill ${m.color}`} style={{ width: `${m.bar}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────
function KPICards() {
  const users = UsersDB.findAll();
  const orders = OrdersDB.findAll();
  const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0);

  const kpis = [
    { icon: <Users size={22} />, label: 'Total Users', value: fmt(users.length + 2847), change: '+12%', up: true, color: 'blue' },
    { icon: <ShoppingCart size={22} />, label: 'Orders Today', value: fmt(orders.length + 347), change: '+8%', up: true, color: 'green' },
    { icon: <DollarSign size={22} />, label: 'Revenue', value: `₹${fmt(revenue + 2847000)}`, change: '+23%', up: true, color: 'orange' },
    { icon: <Zap size={22} />, label: 'Flash Sales', value: '3 Active', change: '100 units', up: true, color: 'red' },
  ];

  return (
    <div className="adm-kpi-grid">
      {kpis.map(k => (
        <div key={k.label} className={`adm-kpi-card adm-kpi-${k.color}`}>
          <div className="adm-kpi-icon">{k.icon}</div>
          <div className="adm-kpi-info">
            <span className="adm-kpi-label">{k.label}</span>
            <span className="adm-kpi-value">{k.value}</span>
            <span className={`adm-kpi-change ${k.up ? 'up' : 'down'}`}>
              {k.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {k.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
  { id: 'fraud', icon: <ShieldCheck size={18} />, label: 'Fraud Detection' },
  { id: 'pricing', icon: <TrendingUp size={18} />, label: 'Dynamic Pricing' },
  { id: 'forecast', icon: <BarChart2 size={18} />, label: 'Demand Forecast' },
  { id: 'reorder', icon: <Package size={18} />, label: 'Smart Reorder' },
  { id: 'scheduler', icon: <Flame size={18} />, label: 'Sale Scheduler' },
  { id: 'health', icon: <Activity size={18} />, label: 'System Health' },
];

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const { inventory } = useInventory();
  const [tab, setTab] = useState('overview');

  return (
    <div className="page adm-page">
      <div className="adm-layout">
        {/* Sidebar */}
        <aside className="adm-sidebar">
          <div className="adm-sidebar-header">
            <div className="adm-admin-avatar">{user?.avatar}</div>
            <div>
              <p className="adm-admin-name">{user?.name}</p>
              <span className="badge badge-dark">ADMIN</span>
            </div>
          </div>
          <nav className="adm-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`adm-nav-item ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon} {t.label}
                {tab === t.id && <ChevronRight size={14} className="adm-nav-arrow" />}
              </button>
            ))}
          </nav>
          <div className="adm-sidebar-footer">
            <div className="adm-inv-summary">
              <p className="adm-inv-title">Live Inventory</p>
              <div className="adm-inv-row"><span>Available</span><b className="green">{inventory.availableStock}</b></div>
              <div className="adm-inv-row"><span>Reserved</span><b className="orange">{inventory.reservedStock}</b></div>
              <div className="adm-inv-row"><span>Sold</span><b className="red">{inventory.soldStock}</b></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="adm-main">
          <div className="adm-topbar">
            <div>
              <h1 className="adm-page-title">
                {TABS.find(t => t.id === tab)?.label || 'Dashboard'}
              </h1>
              <p className="adm-page-sub">SALESTORM Admin Control Panel</p>
            </div>
            <div className="adm-topbar-actions">
              <button className="btn btn-outline btn-sm"><RefreshCw size={14} /> Refresh</button>
              <button className="btn btn-outline btn-sm"><Download size={14} /> Export</button>
              <button className="btn btn-primary btn-sm"><Bell size={14} /> Alerts</button>
            </div>
          </div>

          {tab === 'overview' && (
            <>
              <KPICards />
              <div className="adm-overview-grid">
                <FraudDetection />
                <SystemHealth />
              </div>
            </>
          )}
          {tab === 'fraud' && <FraudDetection />}
          {tab === 'pricing' && <DynamicPricing />}
          {tab === 'forecast' && <DemandForecast />}
          {tab === 'reorder' && <SmartReorder />}
          {tab === 'scheduler' && <FlashScheduler />}
          {tab === 'health' && <SystemHealth />}
        </main>
      </div>
    </div>
  );
}
