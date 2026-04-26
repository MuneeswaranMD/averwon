import React, { useState, useEffect, useCallback } from 'react';
import { useNotice } from 'adminjs';
import { Download, Eye, X, FileText, CheckCircle, Clock, AlertTriangle, Filter, Trash2, Printer, LineChart, PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

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
  light: '#F1F5F9'
};

const STATUS_COLORS = { Paid: C.success, Pending: C.warning, Overdue: C.error, 'Partially Paid': C.purple };

const card = { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '20px' };
const inp = { border: `1px solid ${C.border}`, borderRadius: '6px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter', outline: 'none', color: '#1E293B', width: '100%', boxSizing: 'border-box' };
const btn = { padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', border: 'none' };

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function RevenuePage() {
  const sendNotice = useNotice();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ clientName: '', projectName: '', paymentMethod: 'Bank Transfer', amount: '', receivedDate: '', status: 'Paid' });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/finance/revenue');
      const json = await r.json();
      setData(json.records || []);
      setStats(json.stats || {});
      setCharts(json.charts || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.clientName?.toLowerCase().includes(q) || r.revenueId?.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || r.status === statusFilter;
    const matchD = (!dateFrom || new Date(r.receivedDate) >= new Date(dateFrom)) && (!dateTo || new Date(r.receivedDate) <= new Date(dateTo));
    return matchQ && matchS && matchD;
  });

  const saveForm = async () => {
    try {
      const url = editItem ? `/api/admin/finance/revenue/${editItem._id}` : '/api/admin/finance/revenue';
      const method = editItem ? 'PUT' : 'POST';
      const response = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      });
      
      if (response.ok) {
        sendNotice({ message: `Revenue record ${editItem ? 'updated' : 'created'} successfully!`, type: 'success' });
        setShowForm(false); 
        setEditItem(null);
        setForm({ clientName: '', projectName: '', paymentMethod: 'Bank Transfer', amount: '', receivedDate: '', status: 'Paid' });
        load();
      } else {
        const errData = await response.json().catch(() => ({}));
        sendNotice({ message: `Error: ${errData.error || 'Failed to save record'}`, type: 'error' });
      }
    } catch (error) {
      sendNotice({ message: `Network Error: ${error.message}`, type: 'error' });
    }
  };

  const del = async (id) => { if (window.confirm('Delete this revenue entry?')) { await fetch(`/api/admin/finance/revenue/${id}`, { method: 'DELETE' }); load(); } };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ clientName: item.clientName, projectName: item.projectName, paymentMethod: item.paymentMethod, amount: item.amount, receivedDate: item.receivedDate?.split('T')[0] || '', status: item.status });
    setShowForm(true);
  };

  const exportCSV = () => {
    const rows = [['Revenue ID', 'Client', 'Project', 'Method', 'Amount', 'Date', 'Status'], ...filtered.map(r => [r.revenueId, r.clientName, r.projectName, r.paymentMethod, r.amount, fmtDate(r.receivedDate), r.status])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'revenue_report.csv'; a.click();
  };

  const Summary = ({ label, value, sub, color, icon: Icon }) => (
    <div style={{ ...card, flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: (color || C.accent) + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Icon && <Icon size={24} color={color || C.accent} />}
      </div>
      <div>
        <span style={{ fontSize: '11px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <div style={{ fontSize: '20px', fontWeight: 800, color: C.text, marginTop: '2px' }}>{value}</div>
        {sub && <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );

  const lineChart = { labels: charts.monthlyLabels || [], datasets: [{ label: 'Revenue', data: charts.monthly || [], borderColor: C.accent, backgroundColor: 'rgba(29,78,216,0.05)', fill: true, tension: 0.4, pointBackgroundColor: C.accent }] };
  const deptChart = { labels: charts.deptLabels || [], datasets: [{ data: charts.deptValues || [], backgroundColor: [C.accent, C.success, C.warning, C.purple, C.error, '#06B6D4'], borderWidth: 0 }] };
  const projChart = { labels: charts.projLabels || [], datasets: [{ data: charts.projValues || [], backgroundColor: C.accent, borderRadius: 6 }] };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: C.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: C.primary }}>Revenue Analytics</h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: '14px', fontWeight: 500 }}>Monitor cash flow and project-wise profitability</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} style={{ ...btn, background: C.white, border: `1px solid ${C.border}`, color: C.text }}> <Download size={16} /> Export </button>
          <button onClick={() => { setShowForm(true); setEditItem(null); }} style={{ ...btn, background: C.accent, color: '#fff' }}> + Record Revenue </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <Summary label="Total Revenue" value={fmt(stats.total)} sub="All time collection" icon={TrendingUp} />
        <Summary label="This Month" value={fmt(stats.thisMonth)} color={C.accent} icon={Clock} />
        <Summary label="This Year" value={fmt(stats.thisYear)} color={C.success} icon={CheckCircle} />
        <Summary label="Profit Margin" value={stats.profitMargin || '32.4%'} color={C.purple} icon={TrendingUp} />
        <Summary label="Growth" value={stats.growth || '+18.2%'} color={C.success} icon={TrendingUp} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Revenue Trend</h3>
            <LineChart size={18} color={C.muted} />
          </div>
          <div style={{ height: '220px' }}>
            <Line data={lineChart} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div style={card}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 800 }}>By Department</h3>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={deptChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 600 } } } } }} />
          </div>
        </div>
        <div style={card}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 800 }}>By Project</h3>
          <div style={{ height: '220px' }}>
            <Bar data={projChart} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } } }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...card, marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '240px' }}>
          <input style={inp} placeholder="Search client..." value={search} onChange={e => setSearch(e.target.value)} />
          <Filter size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
        </div>
        <select style={{ ...inp, width: '160px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All Status', 'Paid', 'Pending', 'Overdue', 'Partially Paid'].map(s => <option key={s} value={s === 'All Status' ? 'All' : s}>{s}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="date" style={{ ...inp, width: '150px' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span style={{ color: C.muted, fontWeight: 700 }}>TO</span>
          <input type="date" style={{ ...inp, width: '150px' }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        <button onClick={() => { setSearch(''); setStatusFilter('All'); setDateFrom(''); setDateTo(''); }} style={{ ...btn, background: C.light, color: C.text }}>Clear</button>
        <span style={{ marginLeft: 'auto', color: C.muted, fontSize: '13px', fontWeight: 600 }}>{filtered.length} entries</span>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: C.light, borderBottom: `1px solid ${C.border}` }}>
              {['Revenue ID', 'Client / Project', 'Payment Method', 'Amount', 'Received Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}> <Clock size={32} style={{ animation: 'spin 2s linear infinite', color: C.accent }} /> </td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: C.muted }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '20px', fontWeight: 700, color: C.accent }}>{r.revenueId || '—'}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{r.clientName}</div>
                    <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px' }}>{r.projectName}</div>
                  </td>
                  <td style={{ padding: '20px', color: C.muted, fontWeight: 500 }}>{r.paymentMethod}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 800, color: C.success }}>{fmt(r.amount)}</div>
                  </td>
                  <td style={{ padding: '20px', color: C.muted }}>{fmtDate(r.receivedDate)}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: STATUS_COLORS[r.status] + '15', color: STATUS_COLORS[r.status] }}>{r.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(r)} style={{ ...btn, padding: '6px', background: C.light }} title="Edit"> <FileText size={16} /> </button>
                      <button onClick={() => del(r._id)} style={{ ...btn, padding: '6px', background: '#FEF2F2', color: C.error }} title="Delete"> <Trash2 size={16} /> </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: C.white, borderRadius: '20px', padding: '40px', width: '560px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em', fontSize: '24px' }}>{editItem ? 'Edit Revenue' : 'Add Revenue Entry'}</h2>
              <button onClick={() => setShowForm(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted }}> <X size={24} /> </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Client Name</label>
                <input style={inp} value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Project Name</label>
                <input style={inp} value={form.projectName} onChange={e => setForm({...form, projectName: e.target.value})} placeholder="e.g. Website Overhaul" />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Amount (₹)</label>
                <input type="number" style={inp} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Received Date</label>
                <input type="date" style={inp} value={form.receivedDate} onChange={e => setForm({...form, receivedDate: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Payment Method</label>
                <select style={inp} value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                  {['Bank Transfer', 'Credit Card', 'Cash', 'UPI', 'Cheque'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Status</label>
                <select style={inp} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {['Paid', 'Pending', 'Overdue', 'Partially Paid'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button onClick={saveForm} style={{ ...btn, flex: 1, background: C.accent, color: '#fff', justifyContent: 'center', height: '48px' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
      `}</style>
    </div>
  );
}
