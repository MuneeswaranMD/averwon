import React, { useState, useEffect, useCallback } from 'react';
import { useNotice } from 'adminjs';
import { Download, Eye, X, FileText, CheckCircle, Clock, AlertTriangle, Filter, Trash2, Printer, BarChart3, PieChart } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

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
  light: '#F1F5F9'
};

const STATUS_COLORS = { Paid: C.success, Pending: C.warning, Overdue: C.error, Rejected: C.muted };
const getStatusColor = (s) => STATUS_COLORS[s] || C.muted;
const CATS = ['Salary', 'Software', 'Office Expense', 'Hardware', 'Marketing', 'Travel', 'Internet', 'Maintenance'];
const CAT_COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F43F5E', '#64748B'];

const card = { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '20px' };
const inp = { border: `1px solid ${C.border}`, borderRadius: '6px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter', outline: 'none', color: '#1E293B', width: '100%', boxSizing: 'border-box' };
const btn = { padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', border: 'none' };

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const DEFAULT_FORM = { vendorName: '', category: 'Software', amount: '', dueDate: '', paymentMethod: 'Bank Transfer', status: 'Pending' };

// ─── BILL PREVIEW COMPONENT ───
const BillPreview = ({ bill, onClose, onPrint }) => {
  if (!bill) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
      <div style={{ background: '#fff', width: '800px', maxHeight: '95vh', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={20} color={C.accent} />
            <span style={{ fontWeight: 800, fontSize: '16px', color: C.text }}>{bill.billId || 'BILL DETAIL'}</span>
            <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: getStatusColor(bill.status) + '15', color: getStatusColor(bill.status) }}>{bill.status.toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onPrint} style={{ ...btn, background: C.light, color: C.text }}> <Printer size={16} /> Print </button>
            <button onClick={onClose} style={{ ...btn, background: C.primary, color: '#fff' }}> <X size={16} /> Close </button>
          </div>
        </div>

        <div id="printable-bill" style={{ flex: 1, overflowY: 'auto', padding: '60px', background: '#fff', color: '#000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
            <div>
              <img src="/logo.png" alt="Averqon Logo" style={{ height: '40px', marginBottom: '20px' }} />
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-0.04em' }}>EXPENSE BILL</h1>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>#{bill.billId}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', display: 'inline-block', textAlign: 'left', minWidth: '200px' }}>
                <p style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 800, color: '#94A3B8', marginBottom: '4px', letterSpacing: '0.05em' }}>Vendor Info</p>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{bill.vendorName}</h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Category: {bill.category}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '60px', padding: '24px', border: '1px solid #F1F5F9', borderRadius: '12px' }}>
            <div>
              <p style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 800, color: '#94A3B8', marginBottom: '4px' }}>Bill Date</p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{fmtDate(bill.createdAt)}</p>
            </div>
            <div>
              <p style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 800, color: '#94A3B8', marginBottom: '4px' }}>Due Date</p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: bill.status === 'Pending' ? C.error : '#000' }}>{fmtDate(bill.dueDate)}</p>
            </div>
            <div>
              <p style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 800, color: '#94A3B8', marginBottom: '4px' }}>Payment Method</p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{bill.paymentMethod}</p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Description</th>
                <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '24px 0' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{bill.category} Subscription / Payment</div>
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>Expense registered to vendor {bill.vendorName}</div>
                </td>
                <td style={{ textAlign: 'right', padding: '24px 0', fontWeight: 700, fontSize: '18px' }}>{fmt(bill.amount)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginLeft: 'auto', width: '280px', padding: '20px', background: '#F8FAFC', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#64748B' }}>Total Payable</span>
              <span style={{ fontWeight: 900, fontSize: '20px', color: C.error }}>{fmt(bill.amount)}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-bill, #printable-bill * { visibility: visible; }
          #printable-bill { position: absolute; left: 0; top: 0; width: 100%; height: auto; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default function BillPage() {
  const sendNotice = useNotice();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/finance/bills');
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
    return (!q || r.vendorName?.toLowerCase().includes(q) || r.billId?.toLowerCase().includes(q))
      && (catFilter === 'All' || r.category === catFilter)
      && (statusFilter === 'All' || r.status === statusFilter);
  });

  const save = async () => {
    try {
      const url = editItem ? `/api/admin/finance/bills/${editItem._id}` : '/api/admin/finance/bills';
      const response = await fetch(url, { 
        method: editItem ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      });
      if (response.ok) {
        sendNotice({ message: `Bill ${editItem ? 'updated' : 'created'} successfully!`, type: 'success' });
        setShowForm(false); setEditItem(null); setForm(DEFAULT_FORM); load();
      } else {
        const err = await response.json().catch(() => ({}));
        sendNotice({ message: err.error || 'Failed to save bill.', type: 'error' });
      }
    } catch (e) {
      sendNotice({ message: 'Network error occurred.', type: 'error' });
    }
  };

  const del = async (id) => { if (window.confirm('Delete this bill?')) { await fetch(`/api/admin/finance/bills/${id}`, { method: 'DELETE' }); load(); } };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ vendorName: item.vendorName, category: item.category, amount: item.amount, dueDate: item.dueDate?.split('T')[0] || '', paymentMethod: item.paymentMethod, status: item.status });
    setShowForm(true);
  };

  const exportCSV = () => {
    const rows = [['Bill ID', 'Vendor Name', 'Category', 'Amount', 'Due Date', 'Payment Method', 'Status'], ...filtered.map(r => [r.billId, r.vendorName, r.category, r.amount, fmtDate(r.dueDate), r.paymentMethod, r.status])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'bills_report.csv'; a.click();
  };

  const Summary = ({ label, value, color, icon: Icon }) => (
    <div style={{ ...card, flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: (color || C.accent) + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Icon && <Icon size={24} color={color || C.accent} />}
      </div>
      <div>
        <span style={{ fontSize: '11px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <div style={{ fontSize: '24px', fontWeight: 800, color: C.text, marginTop: '2px' }}>{value}</div>
      </div>
    </div>
  );

  const catData = { labels: CATS, datasets: [{ data: CATS.map(c => data.filter(b => b.category === c).reduce((a, b) => a + b.amount, 0)), backgroundColor: CAT_COLORS, borderWidth: 0 }] };
  const monthlyData = { labels: charts.labels || [], datasets: [{ label: 'Expenses', data: charts.monthly || [], backgroundColor: C.error + 'CC', borderRadius: 6 }] };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: C.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: C.primary }}>Bills & Expenses</h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: '14px', fontWeight: 500 }}>Track vendor payments and operational overhead</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} style={{ ...btn, background: C.white, border: `1px solid ${C.border}`, color: C.text }}> <Download size={16} /> Export </button>
          <button onClick={() => { setShowForm(true); setEditItem(null); setForm(DEFAULT_FORM); }} style={{ ...btn, background: C.accent, color: '#fff' }}> + Add Bill </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <Summary label="Total Bills" value={stats.total || 0} icon={FileText} />
        <Summary label="Paid" value={stats.paid || 0} color={C.success} icon={CheckCircle} />
        <Summary label="Pending" value={stats.pending || 0} color={C.warning} icon={Clock} />
        <Summary label="Expenses" value={fmt(stats.monthlyExpenses)} color={C.error} icon={BarChart3} />
        <Summary label="Outstanding" value={fmt(stats.outstanding)} color={C.purple} icon={AlertTriangle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Monthly Expense Trend</h3>
            <BarChart3 size={18} color={C.muted} />
          </div>
          <div style={{ height: '260px' }}>
            <Bar data={monthlyData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F1F5F9' } }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Expense by Category</h3>
            <PieChart size={18} color={C.muted} />
          </div>
          <div style={{ height: '260px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={catData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 10, weight: 600 } } } } }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...card, marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input style={inp} placeholder="Search vendor or bill ID..." value={search} onChange={e => setSearch(e.target.value)} />
          <Filter size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
        </div>
        <select style={{ ...inp, width: '180px' }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select style={{ ...inp, width: '180px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All Status', 'Paid', 'Pending', 'Overdue', 'Rejected'].map(s => <option key={s} value={s === 'All Status' ? 'All' : s}>{s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', color: C.muted, fontSize: '13px', fontWeight: 600 }}>{filtered.length} bills found</span>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: C.light, borderBottom: `1px solid ${C.border}` }}>
              {['Bill ID', 'Vendor / Category', 'Amount', 'Due Date', 'Payment', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}> <Clock size={32} style={{ animation: 'spin 2s linear infinite', color: C.accent }} /> </td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: C.muted }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '20px', fontWeight: 700, color: C.accent }}>{r.billId || '—'}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{r.vendorName}</div>
                    <div style={{ fontSize: '12px', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: CAT_COLORS[CATS.indexOf(r.category)] || C.muted }}></span>
                      {r.category}
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 800, color: C.error }}>-{fmt(r.amount)}</div>
                  </td>
                  <td style={{ padding: '20px', fontWeight: 600, color: new Date(r.dueDate) < new Date() && r.status !== 'Paid' ? C.error : C.text }}>{fmtDate(r.dueDate)}</td>
                  <td style={{ padding: '20px', color: C.muted, fontWeight: 500 }}>{r.paymentMethod}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: STATUS_COLORS[r.status] + '15', color: STATUS_COLORS[r.status] }}>{r.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setPreviewItem(r)} style={{ ...btn, padding: '6px', background: C.light }} title="View"> <Eye size={16} /> </button>
                      <button onClick={() => openEdit(r)} style={{ ...btn, padding: '6px', background: C.light }} title="Edit"> <FileText size={16} /> </button>
                      <button onClick={() => del(r._id)} style={{ ...btn, padding: '6px', background: '#FEF2F2', color: C.error }} title="Delete"> <Trash2 size={16} /> </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {previewItem && <BillPreview bill={previewItem} onClose={() => setPreviewItem(null)} onPrint={() => window.print()} />}

      {/* Centered Modal for Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: C.white, borderRadius: '20px', padding: '40px', width: '560px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em', fontSize: '24px' }}>{editItem ? 'Edit Bill' : 'Record New Bill'}</h2>
              <button onClick={() => setShowForm(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted }}> <X size={24} /> </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Vendor Name</label>
                <input style={inp} value={form.vendorName} onChange={e => setForm({...form, vendorName: e.target.value})} placeholder="e.g. Amazon Web Services" />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Amount (₹)</label>
                <input type="number" style={inp} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Due Date</label>
                <input type="date" style={inp} value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Category</label>
                <select style={inp} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Status</label>
                <select style={inp} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {['Paid', 'Pending', 'Overdue', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Payment Method</label>
                <select style={inp} value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                  {['Bank Transfer', 'Credit Card', 'Cash', 'UPI', 'Cheque'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button onClick={save} style={{ ...btn, flex: 1, background: C.accent, color: '#fff', justifyContent: 'center', height: '48px' }}>Save Changes</button>
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
