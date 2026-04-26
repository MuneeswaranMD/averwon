import React, { useState, useEffect, useCallback } from 'react';
import { useNotice } from 'adminjs';
import { 
  Download, Plus, X, FileText, Trash2, Filter, Clock, CheckCircle, 
  AlertTriangle, TrendingUp, Briefcase, Users, Target, ShieldCheck,
  ChevronRight, Search, BarChart3, PieChart
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const C = { 
  bg: '#F8FAFC', 
  white: '#FFFFFF', 
  primary: '#1E293B', 
  accent: '#1D4ED8',
  border: '#E2E8F0', 
  text: '#1E293B', 
  success: '#10B981', 
  warning: '#F59E0B', 
  error: '#EF4444', 
  muted: '#64748B', 
  purple: '#8B5CF6',
  light: '#F1F5F9',
  cyan: '#06B6D4'
};

const STATUS_COLORS = { Open: C.cyan, Negotiation: C.warning, 'Proposal Sent': C.accent, Won: C.success, Lost: C.error };
const STATUSES = ['Open', 'Negotiation', 'Proposal Sent', 'Won', 'Lost'];

const card = { background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '24px' };
const inp = { border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px 16px', fontSize: '14px', fontFamily: 'Inter', outline: 'none', color: C.text, width: '100%', boxSizing: 'border-box', transition: 'all 0.2s' };
const btn = { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', border: 'none' };

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const DEFAULT_FORM = { dealName: '', clientName: '', assignedSalesperson: '', dealValue: '', expectedClosingDate: '', status: 'Open', probability: 50 };

export default function DealsPage() {
  const sendNotice = useNotice();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/sales/deals');
      const json = await r.json();
      setData(json.records || []);
      setStats(json.stats || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.dealName?.toLowerCase().includes(q) || r.clientName?.toLowerCase().includes(q) || r.dealId?.toLowerCase().includes(q))
      && (statusFilter === 'All' || r.status === statusFilter);
  });

  const saveDeal = async () => {
    try {
      const url = editItem ? `/api/admin/sales/deals/${editItem._id}` : '/api/admin/sales/deals';
      const response = await fetch(url, { 
        method: editItem ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      });
      if (response.ok) {
        sendNotice({ message: `Deal ${editItem ? 'updated' : 'created'} successfully!`, type: 'success' });
        setShowForm(false); setEditItem(null); setForm(DEFAULT_FORM); load();
      } else {
        const err = await response.json().catch(() => ({}));
        sendNotice({ message: err.error || 'Failed to save deal.', type: 'error' });
      }
    } catch (e) {
      sendNotice({ message: 'Network error occurred.', type: 'error' });
    }
  };

  const deleteDeal = async (id) => { 
    if (window.confirm('Are you sure you want to delete this deal?')) { 
      await fetch(`/api/admin/sales/deals/${id}`, { method: 'DELETE' }); 
      load(); 
      sendNotice({ message: 'Deal deleted successfully', type: 'success' });
    } 
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ 
      dealName: item.dealName, 
      clientName: item.clientName, 
      assignedSalesperson: item.assignedSalesperson || '', 
      dealValue: item.dealValue, 
      expectedClosingDate: item.expectedClosingDate?.split('T')[0] || '', 
      status: item.status, 
      probability: item.probability 
    });
    setShowForm(true);
  };

  const exportCSV = () => {
    const rows = [['Deal ID', 'Deal Name', 'Client', 'Salesperson', 'Value', 'Closing Date', 'Status', 'Probability'], ...filtered.map(r => [r.dealId, r.dealName, r.clientName, r.assignedSalesperson, r.dealValue, fmtDate(r.expectedClosingDate), r.status, r.probability + '%'])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'deals_report.csv'; a.click();
  };

  const forecastValue = data.filter(d => !['Won', 'Lost'].includes(d.status)).reduce((acc, d) => acc + (d.dealValue * d.probability / 100), 0);

  const Summary = ({ label, value, sub, color, icon: Icon }) => (
    <div style={{ ...card, flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: (color || C.accent) + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {Icon && <Icon size={28} color={color || C.accent} />}
      </div>
      <div>
        <span style={{ fontSize: '11px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</span>
        <div style={{ fontSize: '24px', fontWeight: 900, color: C.text, marginTop: '2px' }}>{value}</div>
        {sub && <div style={{ fontSize: '12px', color: C.muted, fontWeight: 500, marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );

  const stageData = { labels: STATUSES, datasets: [{ data: STATUSES.map(s => data.filter(d => d.status === s).length), backgroundColor: Object.values(STATUS_COLORS), borderWidth: 0 }] };
  const valueData = { labels: STATUSES, datasets: [{ label: 'Deal Value', data: STATUSES.map(s => data.filter(d => d.status === s).reduce((a, d) => a + d.dealValue, 0)), backgroundColor: Object.values(STATUS_COLORS).map(c => c + 'CC'), borderRadius: 8 }] };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: C.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 900, letterSpacing: '-0.05em', color: C.primary }}>Sales Pipeline</h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: '15px', fontWeight: 500 }}>Track deals through stages and forecast revenue</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} style={{ ...btn, background: C.white, border: `1px solid ${C.border}`, color: C.text }}> <Download size={16} /> Export CSV </button>
          <button onClick={() => { setShowForm(true); setEditItem(null); setForm(DEFAULT_FORM); }} style={{ ...btn, background: C.accent, color: '#fff', boxShadow: '0 4px 6px -1px rgba(29, 78, 216, 0.2)' }}> <Plus size={18} /> New Deal </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <Summary label="Pipeline Value" value={fmt(stats.totalValue)} sub={`Forecast: ${fmt(forecastValue)}`} icon={TrendingUp} color={C.accent} />
        <Summary label="Total Deals" value={stats.total || 0} sub="Lifetime entries" icon={Briefcase} color={C.primary} />
        <Summary label="Won Deals" value={stats.Won || 0} sub="Closed successfully" icon={ShieldCheck} color={C.success} />
        <Summary label="Open Opportunities" value={stats.Open || 0} sub="Pending action" icon={Target} color={C.cyan} />
        <Summary label="Lost" value={stats.Lost || 0} sub="Past 30 days" icon={AlertTriangle} color={C.error} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Value by Stage</h3>
            <BarChart3 size={20} color={C.muted} />
          </div>
          <div style={{ height: '280px' }}>
            <Bar data={valueData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Deal Distribution</h3>
            <PieChart size={20} color={C.muted} />
          </div>
          <div style={{ height: '280px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={stageData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15, font: { size: 12, weight: 600 } } } }, cutout: '70%' }} />
          </div>
        </div>
      </div>

      <div style={{ ...card, marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input style={inp} placeholder="Search deal or client..." value={search} onChange={e => setSearch(e.target.value)} />
          <Search size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} color={C.muted} />
          <select style={{ ...inp, width: '180px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {['All Stages', ...STATUSES].map(s => <option key={s} value={s === 'All Stages' ? 'All' : s}>{s}</option>)}
          </select>
        </div>
        <button onClick={() => { setSearch(''); setStatusFilter('All'); }} style={{ ...btn, background: C.light, color: C.text }}>Clear</button>
        <span style={{ marginLeft: 'auto', color: C.muted, fontSize: '14px', fontWeight: 600 }}>{filtered.length} active deals</span>
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: C.light, borderBottom: `1px solid ${C.border}` }}>
              {['Deal / Client', 'Salesperson', 'Value', 'Expected Close', 'Status', 'Probability', 'Actions'].map(h => (
                <th key={h} style={{ padding: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}> <Clock size={40} className="spin" style={{ color: C.accent }} /> </td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: C.muted, fontSize: '15px' }}>No deals in this stage</td></tr>
              : filtered.map((r) => (
                <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '24px 20px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: C.primary }}>{r.dealName}</div>
                    <div style={{ fontSize: '13px', color: C.muted, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}> <Users size={12} /> {r.clientName} </div>
                  </td>
                  <td style={{ padding: '24px 20px', color: C.text, fontWeight: 500 }}>{r.assignedSalesperson || 'Unassigned'}</td>
                  <td style={{ padding: '24px 20px' }}>
                    <div style={{ fontWeight: 800, fontSize: '16px' }}>{fmt(r.dealValue)}</div>
                  </td>
                  <td style={{ padding: '24px 20px', color: new Date(r.expectedClosingDate) < new Date() && !['Won','Lost'].includes(r.status) ? C.error : C.muted, fontWeight: 600 }}>
                    {fmtDate(r.expectedClosingDate)}
                  </td>
                  <td style={{ padding: '24px 20px' }}>
                    <span style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: STATUS_COLORS[r.status] + '15', color: STATUS_COLORS[r.status] }}>{r.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '24px 20px' }}>
                    <div style={{ width: '120px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: C.muted }}>Win Rate</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: C.text }}>{r.probability}%</span>
                      </div>
                      <div style={{ height: '6px', background: C.light, borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.probability}%`, background: STATUS_COLORS[r.status], borderRadius: '3px' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px 20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => openEdit(r)} style={{ ...btn, padding: '8px', background: C.light, color: C.primary }} title="Edit Deal"> <FileText size={18} /> </button>
                      <button onClick={() => deleteDeal(r._id)} style={{ ...btn, padding: '8px', background: '#FEF2F2', color: C.error }} title="Delete Deal"> <Trash2 size={18} /> </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: C.white, borderRadius: '24px', padding: '48px', width: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em', fontSize: '28px' }}>{editItem ? 'Edit Deal' : 'Add New Deal'}</h2>
              <button onClick={() => setShowForm(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted }}> <X size={28} /> </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Deal Name</label>
                <input style={inp} value={form.dealName} onChange={e => setForm({...form, dealName: e.target.value})} placeholder="e.g. Enterprise License Expansion" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Client / Company</label>
                <input style={inp} value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} placeholder="e.g. Microsoft India" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Deal Value (₹)</label>
                <input type="number" style={inp} value={form.dealValue} onChange={e => setForm({...form, dealValue: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Win Probability (%)</label>
                <input type="number" style={inp} value={form.probability} onChange={e => setForm({...form, probability: e.target.value})} min="0" max="100" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Expected Close Date</label>
                <input type="date" style={inp} value={form.expectedClosingDate} onChange={e => setForm({...form, expectedClosingDate: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Salesperson</label>
                <input style={inp} value={form.assignedSalesperson} onChange={e => setForm({...form, assignedSalesperson: e.target.value})} placeholder="Owner name" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Pipeline Stage</label>
                <select style={inp} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '48px' }}>
              <button onClick={saveDeal} style={{ ...btn, flex: 1, background: C.accent, color: '#fff', justifyContent: 'center', height: '52px', fontSize: '15px' }}>Save Deal Details</button>
              <button onClick={() => setShowForm(false)} style={{ ...btn, background: C.light, color: C.text, height: '52px', padding: '0 24px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.spin { animation: spin 2s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
