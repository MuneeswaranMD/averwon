import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNotice } from 'adminjs';
import { Download, Eye, X, FileText, CheckCircle, Clock, AlertTriangle, Filter, MoreVertical, Printer } from 'lucide-react';

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

const STATUS_COLORS = { Paid: C.success, Pending: C.warning, Overdue: C.error, Cancelled: C.muted };
const getStatusColor = (s) => STATUS_COLORS[s] || C.muted;
const card = { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '20px' };
const inp = { border: `1px solid ${C.border}`, borderRadius: '6px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter', outline: 'none', color: '#1E293B', width: '100%', boxSizing: 'border-box' };
const btn = { padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', border: 'none' };

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const DEFAULT_FORM = { clientName: '', projectName: '', invoiceAmount: '', taxAmount: '', discountAmount: 0, dueDate: '', status: 'Pending' };

// ─── INVOICE PREVIEW COMPONENT ───
const InvoicePreview = ({ invoice, onClose, onPrint }) => {
  if (!invoice) return null;
  const total = (Number(invoice.invoiceAmount) + Number(invoice.taxAmount || 0)) - Number(invoice.discountAmount || 0);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
      <div style={{ background: '#fff', width: '850px', maxHeight: '95vh', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        {/* Header toolbar */}
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={20} color={C.accent} />
            <span style={{ fontWeight: 800, fontSize: '16px', color: C.text }}>{invoice.invoiceId}</span>
            <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: getStatusColor(invoice.status) + '15', color: getStatusColor(invoice.status) }}>{invoice.status.toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onPrint} style={{ ...btn, background: C.light, color: C.text }}> <Printer size={16} /> Print / PDF </button>
            <button onClick={onClose} style={{ ...btn, background: C.primary, color: '#fff' }}> <X size={16} /> Close </button>
          </div>
        </div>

        {/* Paper content */}
        <div id="printable-invoice" style={{ flex: 1, overflowY: 'auto', padding: '60px', background: '#fff', color: '#000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
            <div>
              <img src="/logo.png" alt="Averqon Logo" style={{ height: '48px', marginBottom: '20px' }} />
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em' }}>INVOICE</h1>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>#{invoice.invoiceId}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Averqon Technologies</h3>
              <p style={{ color: '#666', fontSize: '13px', margin: '4px 0' }}>Plot No. 42, Knowledge Park III<br/>Greater Noida, UP - 201310</p>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>finance@averqon.ai</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '80px', marginBottom: '60px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: '#999', marginBottom: '10px', letterSpacing: '1px' }}>Bill To</p>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{invoice.clientName}</h4>
              <p style={{ color: '#555', fontSize: '14px', margin: '6px 0' }}>Project: {invoice.projectName}</p>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: '#999', marginBottom: '4px' }}>Invoice Date</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{fmtDate(invoice.createdAt)}</p>
              </div>
              <div>
                <p style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: '#999', marginBottom: '4px' }}>Due Date</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{fmtDate(invoice.dueDate)}</p>
              </div>
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
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{invoice.projectName || 'Professional Services'}</div>
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>Consultancy and development services for the period.</div>
                </td>
                <td style={{ textAlign: 'right', padding: '24px 0', fontWeight: 600, fontSize: '15px' }}>{fmt(invoice.invoiceAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginLeft: 'auto', width: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
              <span color="#666">Sub Total</span>
              <span style={{ fontWeight: 600 }}>{fmt(invoice.invoiceAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
              <span color="#666">Tax (GST)</span>
              <span style={{ fontWeight: 600 }}>{fmt(invoice.taxAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#EF4444' }}>
              <span>Discount</span>
              <span style={{ fontWeight: 600 }}>-{fmt(invoice.discountAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #000', marginTop: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '18px' }}>Total Amount</span>
              <span style={{ fontWeight: 900, fontSize: '20px', color: C.accent }}>{fmt(total)}</span>
            </div>
          </div>

          <div style={{ marginTop: '100px', borderTop: '1px solid #eee', paddingTop: '30px', color: '#999', fontSize: '12px' }}>
            <p style={{ margin: 0 }}>Terms & Conditions: Please make the payment within 15 days of receiving this invoice. Late payments are subject to a 2% monthly interest charge.</p>
          </div>
        </div>
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; height: auto; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default function InvoicePage() {
  const sendNotice = useNotice();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/finance/invoices');
      const json = await r.json();
      setData(json.records || []);
      setStats(json.stats || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.clientName?.toLowerCase().includes(q) || r.invoiceId?.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || r.status === statusFilter;
    return matchQ && matchS;
  });

  const save = async () => {
    try {
      const url = editItem ? `/api/admin/finance/invoices/${editItem._id}` : '/api/admin/finance/invoices';
      const response = await fetch(url, { 
        method: editItem ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      });
      if (response.ok) {
        sendNotice({ message: `Invoice ${editItem ? 'updated' : 'created'} successfully!`, type: 'success' });
        setShowForm(false); setEditItem(null); setForm(DEFAULT_FORM); load();
      } else {
        const err = await response.json().catch(() => ({}));
        sendNotice({ message: err.error || 'Failed to save invoice.', type: 'error' });
      }
    } catch (e) {
      sendNotice({ message: 'Network error occurred.', type: 'error' });
    }
  };

  const del = async (id) => { if (window.confirm('Delete this invoice?')) { await fetch(`/api/admin/finance/invoices/${id}`, { method: 'DELETE' }); load(); } };

  const markPaid = async (id) => { 
    const response = await fetch(`/api/admin/finance/invoices/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Paid', paymentDate: new Date() }) });
    if (response.ok) sendNotice({ message: 'Invoice marked as Paid', type: 'success' });
    load();
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ clientName: item.clientName, projectName: item.projectName, invoiceAmount: item.invoiceAmount, taxAmount: item.taxAmount, discountAmount: item.discountAmount || 0, dueDate: item.dueDate?.split('T')[0] || '', status: item.status });
    setShowForm(true);
  };

  const exportCSV = () => {
    const rows = [['Invoice ID', 'Client', 'Project', 'Invoice Amt', 'Tax', 'Total', 'Due Date', 'Payment Date', 'Status'], ...filtered.map(r => [r.invoiceId, r.clientName, r.projectName, r.invoiceAmount, r.taxAmount, r.totalAmount, fmtDate(r.dueDate), fmtDate(r.paymentDate), r.status])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'invoices.csv'; a.click();
  };

  const Summary = ({ label, value, color, icon: Icon }) => (
    <div style={{ ...card, flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: (color || C.accent) + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Icon && <Icon size={24} color={color || C.accent} />}
      </div>
      <div>
        <span style={{ fontSize: '12px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <div style={{ fontSize: '24px', fontWeight: 800, color: C.text, marginTop: '2px' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: C.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: C.primary }}>Invoices</h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: '14px', fontWeight: 500 }}>Comprehensive billing and payment tracking system</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} style={{ ...btn, background: C.white, border: `1px solid ${C.border}`, color: C.text }}> <Download size={16} /> Export </button>
          <button onClick={() => { setShowForm(true); setEditItem(null); setForm(DEFAULT_FORM); }} style={{ ...btn, background: C.accent, color: '#fff' }}> + Create Invoice </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <Summary label="All Invoices" value={stats.total || 0} icon={FileText} />
        <Summary label="Paid" value={stats.paid || 0} color={C.success} icon={CheckCircle} />
        <Summary label="Outstanding" value={stats.pending || 0} color={C.warning} icon={Clock} />
        <Summary label="Overdue" value={stats.overdue || 0} color={C.error} icon={AlertTriangle} />
        <Summary label="Revenue" value={fmt(stats.outstanding)} color={C.purple} icon={CheckCircle} />
      </div>

      {/* Filters */}
      <div style={{ ...card, marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input style={{ ...inp, paddingLeft: '40px' }} placeholder="Search client or invoice ID..." value={search} onChange={e => setSearch(e.target.value)} />
          <Filter size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
        </div>
        <select style={{ ...inp, width: '180px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All Invoices', 'Paid', 'Pending', 'Overdue', 'Cancelled'].map(s => <option key={s} value={s === 'All Invoices' ? 'All' : s}>{s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', color: C.muted, fontSize: '13px', fontWeight: 600 }}>{filtered.length} records found</span>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: C.light, borderBottom: `1px solid ${C.border}` }}>
              {['Invoice ID', 'Client Details', 'Project', 'Amount', 'Due Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}> <Clock size={32} style={{ animation: 'spin 2s linear infinite', color: C.accent }} /> </td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: C.muted }}>No records found</td></tr>
              : filtered.map((r, i) => (
                <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '20px', fontWeight: 700, color: C.accent }}>{r.invoiceId || '—'}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{r.clientName}</div>
                    <div style={{ fontSize: '12px', color: C.muted }}>{fmtDate(r.createdAt)}</div>
                  </td>
                  <td style={{ padding: '20px', color: C.muted, fontWeight: 500 }}>{r.projectName}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 800 }}>{fmt(r.totalAmount)}</div>
                    <div style={{ fontSize: '11px', color: C.muted }}>{fmt(r.invoiceAmount)} + Tax</div>
                  </td>
                  <td style={{ padding: '20px', fontWeight: 600, color: new Date(r.dueDate) < new Date() && r.status !== 'Paid' ? C.error : C.text }}>{fmtDate(r.dueDate)}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: STATUS_COLORS[r.status] + '15', color: STATUS_COLORS[r.status] }}>{r.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setPreviewItem(r)} style={{ ...btn, padding: '6px', background: C.light }} title="View"> <Eye size={16} /> </button>
                      <button onClick={() => openEdit(r)} style={{ ...btn, padding: '6px', background: C.light }} title="Edit"> <FileText size={16} /> </button>
                      {r.status !== 'Paid' && <button onClick={() => markPaid(r._id)} style={{ ...btn, padding: '6px', background: '#DCFCE7', color: C.success }} title="Mark Paid"> <CheckCircle size={16} /> </button>}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {previewItem && <InvoicePreview invoice={previewItem} onClose={() => setPreviewItem(null)} onPrint={() => window.print()} />}

      {/* Centered Modal for Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: C.white, borderRadius: '20px', padding: '40px', width: '560px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em', fontSize: '24px' }}>{editItem ? 'Edit Invoice' : 'Create New Invoice'}</h2>
              <button onClick={() => setShowForm(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted }}> <X size={24} /> </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Client Name</label>
                <input style={inp} value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Project</label>
                <input style={inp} value={form.projectName} onChange={e => setForm({...form, projectName: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Amount (₹)</label>
                <input type="number" style={inp} value={form.invoiceAmount} onChange={e => setForm({...form, invoiceAmount: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Tax / GST (₹)</label>
                <input type="number" style={inp} value={form.taxAmount} onChange={e => setForm({...form, taxAmount: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Discount (₹)</label>
                <input type="number" style={inp} value={form.discountAmount} onChange={e => setForm({...form, discountAmount: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Status</label>
                <select style={inp} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {['Paid', 'Pending', 'Overdue', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Due Date</label>
                <input type="date" style={inp} value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button onClick={save} style={{ ...btn, flex: 1, background: C.accent, color: '#fff', justifyContent: 'center', height: '48px' }}>Save Changes</button>
              {editItem && <button onClick={() => del(editItem._id)} style={{ ...btn, background: '#FEF2F2', color: C.error, border: '1px solid #FEE2E2', height: '48px' }}>Delete</button>}
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
