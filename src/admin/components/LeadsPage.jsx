import React, { useState, useEffect, useCallback } from 'react';
import { useNotice } from 'adminjs';
import { 
  Download, Plus, X, FileText, Trash2, Filter, Clock, CheckCircle, 
  Search, Phone, Mail, Building2, UserPlus, Globe, MessageSquare,
  BarChart3, PieChart, ChevronRight, Magnet, ArrowUpRight
} from 'lucide-react';
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
  light: '#F1F5F9',
  cyan: '#06B6D4'
};

const STATUS_COLORS = { New: C.accent, Contacted: C.cyan, Qualified: C.purple, 'Proposal Sent': C.warning, Converted: C.success, Closed: C.muted };
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp', 'Direct Call'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'];

const card = { background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '24px' };
const inp = { border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px 16px', fontSize: '14px', fontFamily: 'Inter', outline: 'none', color: C.text, width: '100%', boxSizing: 'border-box' };
const btn = { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', border: 'none' };

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const DEFAULT_FORM = { leadName: '', companyName: '', phoneNumber: '', email: '', leadSource: 'Website', assignedTo: '', status: 'New', followupDate: '', notes: '' };

export default function LeadsPage() {
  const sendNotice = useNotice();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/sales/leads');
      const json = await r.json();
      setData(json.records || []);
      setStats(json.stats || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.leadName?.toLowerCase().includes(q) || r.companyName?.toLowerCase().includes(q) || r.leadId?.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || r.status === statusFilter;
    const matchSrc = sourceFilter === 'All' || r.leadSource === sourceFilter;
    return matchQ && matchS && matchSrc;
  });

  const saveLead = async () => {
    try {
      const url = editItem ? `/api/admin/sales/leads/${editItem._id}` : '/api/admin/sales/leads';
      const response = await fetch(url, { 
        method: editItem ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      });
      if (response.ok) {
        sendNotice({ message: `Lead ${editItem ? 'updated' : 'created'} successfully!`, type: 'success' });
        setShowForm(false); setEditItem(null); setForm(DEFAULT_FORM); load();
      } else {
        const err = await response.json().catch(() => ({}));
        sendNotice({ message: err.error || 'Failed to save lead.', type: 'error' });
      }
    } catch (e) {
      sendNotice({ message: 'Network error occurred.', type: 'error' });
    }
  };

  const deleteLead = async (id) => { 
    if (window.confirm('Delete this lead permanently?')) { 
      await fetch(`/api/admin/sales/leads/${id}`, { method: 'DELETE' }); 
      load(); 
      sendNotice({ message: 'Lead deleted.', type: 'success' });
    } 
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ 
      leadName: item.leadName, 
      companyName: item.companyName, 
      phoneNumber: item.phoneNumber, 
      email: item.email, 
      leadSource: item.leadSource, 
      assignedTo: item.assignedTo || '', 
      status: item.status, 
      followupDate: item.followupDate?.split('T')[0] || '', 
      notes: item.notes || '' 
    });
    setShowForm(true);
  };

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

  const funnelData = { labels: STATUSES, datasets: [{ data: STATUSES.map(s => data.filter(l => l.status === s).length), backgroundColor: Object.values(STATUS_COLORS).map(c => c + 'DD'), borderRadius: 6 }] };
  const sourceData = { labels: SOURCES, datasets: [{ data: SOURCES.map(s => data.filter(l => l.leadSource === s).length), backgroundColor: [C.accent, C.success, C.warning, C.error, C.purple, C.cyan, '#F97316'], borderWidth: 0 }] };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: C.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 900, letterSpacing: '-0.05em', color: C.primary }}>Leads Center</h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: '15px', fontWeight: 500 }}>Capture, qualify and nurture potential customer relationships</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ ...btn, background: C.white, border: `1px solid ${C.border}`, color: C.text }}> <Download size={16} /> Export </button>
          <button onClick={() => { setShowForm(true); setEditItem(null); setForm(DEFAULT_FORM); }} style={{ ...btn, background: C.accent, color: '#fff', boxShadow: '0 4px 6px -1px rgba(29, 78, 216, 0.2)' }}> <Plus size={18} /> Add Lead </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <Summary label="Total Leads" value={stats.total || 0} sub="Cumulative" icon={Magnet} color={C.primary} />
        <Summary label="Hot Leads" value={data.filter(l => l.status === 'Qualified').length} sub="Ready to pitch" icon={ArrowUpRight} color={C.error} />
        <Summary label="Converted" value={stats.Converted || 0} sub="Past 30 days" icon={CheckCircle} color={C.success} />
        <Summary label="Pending Follow-up" value={data.filter(l => l.followupDate && new Date(l.followupDate) < new Date()).length} sub="Overdue" icon={Clock} color={C.warning} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Lead Funnel</h3>
            <BarChart3 size={20} color={C.muted} />
          </div>
          <div style={{ height: '280px' }}>
            <Bar data={funnelData} options={{ maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#F1F5F9' } }, y: { grid: { display: false } } } }} />
          </div>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Sources</h3>
            <PieChart size={20} color={C.muted} />
          </div>
          <div style={{ height: '280px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={sourceData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11, weight: 600 }, padding: 15 } } } }} />
          </div>
        </div>
      </div>

      <div style={{ ...card, marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input style={inp} placeholder="Search lead or company..." value={search} onChange={e => setSearch(e.target.value)} />
          <Search size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
        </div>
        <select style={{ ...inp, width: '160px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All Status', ...STATUSES].map(s => <option key={s} value={s.includes('All') ? 'All' : s}>{s}</option>)}
        </select>
        <select style={{ ...inp, width: '160px' }} value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
          {['All Sources', ...SOURCES].map(s => <option key={s} value={s.includes('All') ? 'All' : s}>{s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', color: C.muted, fontSize: '14px', fontWeight: 600 }}>{filtered.length} leads found</span>
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: C.light, borderBottom: `1px solid ${C.border}` }}>
              {['Lead Profile', 'Contact Details', 'Source', 'Assigned To', 'Status', 'Follow-up', 'Actions'].map(h => (
                <th key={h} style={{ padding: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}> <Clock size={40} className="spin" style={{ color: C.accent }} /> </td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: C.muted }}>No leads available</td></tr>
              : filtered.map((r) => (
                <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '24px 20px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px' }}>{r.leadName}</div>
                    <div style={{ fontSize: '13px', color: C.muted, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}> <Building2 size={12} /> {r.companyName} </div>
                  </td>
                  <td style={{ padding: '24px 20px' }}>
                    <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: C.primary, fontWeight: 500 }}> <Phone size={14} /> {r.phoneNumber || '—'} </div>
                    <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: C.muted, marginTop: '4px' }}> <Mail size={14} /> {r.email} </div>
                  </td>
                  <td style={{ padding: '24px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '4px', background: C.light, fontSize: '11px', fontWeight: 700, color: C.primary, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                      <Globe size={11} /> {r.leadSource.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '24px 20px', color: C.text, fontWeight: 500 }}>{r.assignedTo || 'Unassigned'}</td>
                  <td style={{ padding: '24px 20px' }}>
                    <span style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, background: STATUS_COLORS[r.status] + '15', color: STATUS_COLORS[r.status] }}>{r.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '24px 20px', color: new Date(r.followupDate) < new Date() && r.status !== 'Closed' ? C.error : C.muted, fontWeight: 600 }}>
                    {fmtDate(r.followupDate)}
                  </td>
                  <td style={{ padding: '24px 20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => openEdit(r)} style={{ ...btn, padding: '8px', background: C.light }} title="Edit Lead"> <FileText size={18} /> </button>
                      <button onClick={() => deleteLead(r._id)} style={{ ...btn, padding: '8px', background: '#FEF2F2', color: C.error }} title="Delete Lead"> <Trash2 size={18} /> </button>
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
              <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em', fontSize: '28px' }}>{editItem ? 'Edit Lead' : 'Create New Lead'}</h2>
              <button onClick={() => setShowForm(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted }}> <X size={28} /> </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Lead Name</label>
                <input style={inp} value={form.leadName} onChange={e => setForm({...form, leadName: e.target.value})} placeholder="e.g. John Smith" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Company Name</label>
                <input style={inp} value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} placeholder="e.g. Acme Tech" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Phone Number</label>
                <input style={inp} value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Email Address</label>
                <input type="email" style={inp} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Lead Source</label>
                <select style={inp} value={form.leadSource} onChange={e => setForm({...form, leadSource: e.target.value})}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Status</label>
                <select style={inp} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Assigned To</label>
                <input style={inp} value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} placeholder="Sales Owner" />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Follow-up Date</label>
                <input type="date" style={inp} value={form.followupDate} onChange={e => setForm({...form, followupDate: e.target.value})} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: C.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Notes</label>
                <textarea style={{ ...inp, minHeight: '100px', resize: 'vertical' }} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Key points from interaction..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '48px' }}>
              <button onClick={saveLead} style={{ ...btn, flex: 1, background: C.accent, color: '#fff', justifyContent: 'center', height: '52px', fontSize: '15px' }}>Save Lead Profile</button>
              <button onClick={() => setShowForm(false)} style={{ ...btn, background: C.light, color: C.text, height: '52px', padding: '0 24px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.spin { animation: spin 2s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
