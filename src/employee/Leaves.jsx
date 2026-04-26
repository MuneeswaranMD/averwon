import React, { useState } from 'react';
import { Calendar, Thermometer, Sun, TreePalm, Home, Plus, X, Paperclip, Info } from 'lucide-react';

const Z = {
  accent:  '#2563EB', 
  success: '#10B981', 
  warning: '#F59E0B', 
  danger: '#EF4444',
  purple: '#8B5CF6', 
  text: '#1E293B', 
  muted: '#64748B', 
  border: '#E2E8F0',
  cardBg: '#FFFFFF', 
  pageBg: '#F8FAFC', 
  inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: Z.cardBg, borderRadius: 12, border: `1px solid ${Z.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const PageBand = ({ icon: Icon, title, sub }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
    borderRadius: 16,
    padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }}>
    <img src="/logo.png" alt="Averqon" style={{ height: 34, objectFit: 'contain' }} />
    <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{title}</div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{sub}</div>
    </div>
  </div>
);

const Th = ({ children }) => (
  <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, background: '#F8FAFC', borderBottom: `1px solid ${Z.border}`, whiteSpace: 'nowrap' }}>{children}</th>
);
const Td = ({ children, bold }) => (
  <td style={{ padding: '12px 14px', borderBottom: `1px solid ${Z.border}`, fontSize: 13, color: Z.text, fontWeight: bold ? 600 : 400 }}>{children}</td>
);

const StatusBadge = ({ status }) => {
  const map = {
    Approved: [`${Z.success}15`, Z.success],
    Pending:  [`${Z.warning}15`, Z.warning],
    Rejected: [`${Z.danger}15`, Z.danger],
    Cancelled:[`${Z.muted}15`, Z.muted],
  };
  const [bg, fg] = map[status] || [`${Z.muted}15`, Z.muted];
  return <span style={{ display:'inline-block', padding:'4px 12px', background:bg, color:fg, borderRadius:20, fontSize:11, fontWeight:700 }}>{status}</span>;
};

const leaveSummary = [
  { type: 'Sick Leave',    total: 5,  used: 2,  remaining: 3,  color: Z.danger,   icon: Thermometer },
  { type: 'Casual Leave',  total: 12, used: 4,  remaining: 8,  color: Z.accent,   icon: Sun },
  { type: 'Paid Leave',    total: 15, used: 5,  remaining: 10, color: Z.success,  icon: TreePalm },
  { type: 'WFH Balance',   total: 24, used: 10, remaining: 14, color: Z.purple,   icon: Home },
];

const leaveHistory = [
  { id: 1, type: 'Sick Leave',    start: '2024-04-10', end: '2024-04-11', days: 2, reason: 'Fever and flu',        status: 'Approved'  },
  { id: 2, type: 'Casual Leave',  start: '2024-05-15', end: '2024-05-16', days: 2, reason: 'Family function',      status: 'Pending'   },
  { id: 3, type: 'Work From Home',start: '2024-03-20', end: '2024-03-20', days: 1, reason: 'Home delivery',        status: 'Approved'  },
  { id: 4, type: 'Paid Leave',    start: '2024-01-05', end: '2024-01-10', days: 5, reason: 'Vacation',             status: 'Approved'  },
  { id: 5, type: 'Sick Leave',    start: '2023-12-12', end: '2023-12-12', days: 1, reason: 'Doctor appointment',   status: 'Rejected'  },
];

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Paid Leave', 'Work From Home', 'Emergency Leave'];

const inp = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 14px', border: `1.5px solid ${Z.border}`,
  borderRadius: 8, fontSize: 14, background: Z.inputBg, outline: 'none',
};

const Leaves = () => {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ type: 'Sick Leave', start: '', end: '', reason: '' });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: Z.text }}>
      <PageBand icon={Calendar} title="Leave Management" sub="Apply for leaves and track your leave balance" />

      {/* Balance cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        {leaveSummary.map(l => (
          <Card key={l.type} style={{ padding: '20px', borderTop: `4px solid ${l.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.4 }}>{l.type}</div>
              <div style={{ color: l.color }}>
                <l.icon size={22} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: l.color, lineHeight: 1, marginBottom: 4 }}>{l.remaining}</div>
            <div style={{ fontSize: 11, color: Z.muted, marginBottom: 10 }}>available of {l.total}</div>
            <div style={{ height: 5, background: '#EEF0F5', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(l.remaining / l.total) * 100}%`, height: '100%', background: l.color, borderRadius: 4 }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>Leave History</div>
        <button onClick={() => setModal(true)} style={{
          padding: '9px 18px', background: Z.accent, color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* Table */}
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><Th>Type</Th><Th>Start</Th><Th>End</Th><Th>Days</Th><Th>Reason</Th><Th>Status</Th><Th>Action</Th></tr>
          </thead>
          <tbody>
            {leaveHistory.map(row => (
              <tr key={row.id}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <Td bold>{row.type}</Td>
                <Td>{new Date(row.start).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</Td>
                <Td>{new Date(row.end).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</Td>
                <Td>{row.days}</Td>
                <Td><span style={{ display:'block', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.reason}</span></Td>
                <Td><StatusBadge status={row.status} /></Td>
                <Td>
                  <button
                    disabled={row.status !== 'Pending'}
                    style={{
                      padding: '5px 12px', borderRadius: 6,
                      border: `1px solid ${row.status === 'Pending' ? Z.danger : Z.border}`,
                      background: '#fff', fontSize: 12, cursor: row.status === 'Pending' ? 'pointer' : 'default',
                      color: row.status === 'Pending' ? Z.danger : Z.muted, fontWeight: 600,
                    }}
                  >Cancel</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Apply modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:16, width:500, padding:32, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:22 }}>
              <div style={{ fontWeight:800, fontSize:17 }}>Apply for Leave</div>
              <button onClick={() => setModal(false)} style={{ border:'none', background:'none', cursor:'pointer', color:Z.muted, padding: 4 }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:Z.text, marginBottom:6 }}>Leave Type</label>
              <select value={form.type} onChange={set('type')} style={inp}>
                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:Z.text, marginBottom:6 }}>Start Date</label>
                <input type="date" value={form.start} onChange={set('start')} style={inp}
                  onFocus={e => e.target.style.borderColor = Z.accent}
                  onBlur={e => e.target.style.borderColor = Z.border} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:Z.text, marginBottom:6 }}>End Date</label>
                <input type="date" value={form.end} onChange={set('end')} style={inp}
                  onFocus={e => e.target.style.borderColor = Z.accent}
                  onBlur={e => e.target.style.borderColor = Z.border} />
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:Z.text, marginBottom:6 }}>Reason</label>
              <textarea value={form.reason} onChange={set('reason')} rows={4}
                placeholder="Describe the reason for your leave..."
                style={{ ...inp, resize:'vertical' }}
                onFocus={e => e.target.style.borderColor = Z.accent}
                onBlur={e => e.target.style.borderColor = Z.border}
              />
            </div>

            {/* Upload area */}
            <div style={{
              border: `2px dashed ${Z.border}`, borderRadius:10,
              padding:'16px', textAlign:'center', marginBottom:18,
              cursor:'pointer', color:Z.muted, fontSize:13,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              <Paperclip size={20} /> Upload Medical Certificate / Document (optional)
              <div style={{ fontSize:11 }}>Max 2 MB · PDF, JPG, PNG</div>
            </div>

            <div style={{ 
              background:'#F8FAFC', border:`1px solid ${Z.border}`, borderRadius:10, 
              padding:'10px 14px', fontSize:13, color:Z.text, marginBottom:20,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Info size={18} color={Z.accent} /> Leave request will be sent to HR for approval. You'll be notified once reviewed.
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setModal(false)} style={{ flex:1, padding:'11px', border:`1.5px solid ${Z.border}`, borderRadius:8, background:'#fff', cursor:'pointer', fontSize:14, color:Z.muted, fontWeight:600 }}>Cancel</button>
              <button onClick={() => setModal(false)} style={{ flex:2, padding:'11px', background:Z.accent, color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;
