import React, { useState } from 'react';
import { CheckCircle2, Plus, X, Eye } from 'lucide-react';

const Z = {
  accent:   '#2563EB',
  accentH:  '#1D4ED8',
  success:  '#10B981',
  warning:  '#F59E0B',
  danger:   '#EF4444',
  purple:   '#8B5CF6',
  text:     '#1E293B',
  muted:    '#64748B',
  border:   '#E2E8F0',
  cardBg:   '#FFFFFF',
  pageBg:   '#F8FAFC',
  inputBg:  '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: Z.cardBg, borderRadius: 12, border: `1px solid ${Z.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const PageBand = ({ icon: Icon, title, sub }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
    borderRadius: 16, padding: '24px 32px',
    display: 'flex', alignItems: 'center', gap: 16,
    marginBottom: 24,
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

const Badge = ({ label, color }) => {
  const cfg = {
    success: { bg: `${Z.success}15`, fg: Z.success },
    warning: { bg: `${Z.warning}15`, fg: Z.warning },
    danger:  { bg: `${Z.danger}15`, fg: Z.danger },
    purple:  { bg: `${Z.purple}15`, fg: Z.purple },
    blue:    { bg: `${Z.accent}15`, fg: Z.accent },
    default: { bg: `${Z.muted}10`, fg: Z.muted },
  };
  const c = cfg[color] || cfg.default;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px',
      background: c.bg, color: c.fg, borderRadius: 20,
      fontSize: 11, fontWeight: 700,
    }}>{label}</span>
  );
};

const Th = ({ children }) => (
  <th style={{
    padding: '11px 14px', textAlign: 'left',
    fontSize: 11, fontWeight: 700, color: Z.muted,
    textTransform: 'uppercase', letterSpacing: 0.5,
    background: '#F8FAFC', borderBottom: `1px solid ${Z.border}`,
    whiteSpace: 'nowrap',
  }}>{children}</th>
);

const Td = ({ children, bold }) => (
  <td style={{
    padding: '12px 14px', borderBottom: `1px solid ${Z.border}`,
    fontSize: 13, color: Z.text, fontWeight: bold ? 600 : 400,
  }}>{children}</td>
);

/* ─── TASKS ──────────────────────────────────────────────── */
const Tasks = () => {
  const [tab, setTab] = useState('All');
  const [modal, setModal] = useState(null);

  const tasks = [
    { id: 1, title: 'API Integration with AWS IoT',  project: 'AverLink Logistics',   priority: 'Urgent',  deadline: '2024-05-10', status: 'In Progress', progress: 75  },
    { id: 2, title: 'Inventory Forecasting Logic',   project: 'NeoRetail Core',        priority: 'High',    deadline: '2024-05-15', status: 'To Do',      progress: 0   },
    { id: 3, title: 'Encrypted Records Audit',       project: 'Pulse Health Suite',    priority: 'Medium',  deadline: '2024-05-12', status: 'Review',     progress: 95  },
    { id: 4, title: 'UI Component Library Update',   project: 'Global Design',         priority: 'Low',     deadline: '2024-05-20', status: 'Completed',  progress: 100 },
  ];

  const priBadge   = { Urgent: 'danger', High: 'warning', Medium: 'blue', Low: 'success' };
  const statusBadge= { Completed: 'success', 'In Progress': 'blue', Review: 'purple', 'To Do': 'default' };
  const tabs = ['All', 'To Do', 'In Progress', 'Review', 'Completed'];
  const filtered = tab === 'All' ? tasks : tasks.filter(t => t.status === tab);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: Z.text }}>
      <PageBand icon={CheckCircle2} title="My Tasks" sub="Track and manage your assigned tasks" />

      {/* Filter tabs + New Task button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 14px', borderRadius: 20,
              border: `1.5px solid ${tab === t ? Z.accent : Z.border}`,
              background: tab === t ? Z.accent : '#fff',
              color: tab === t ? '#fff' : Z.muted,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>
        <button style={{
          padding: '9px 18px', background: Z.accent, color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Plus size={16} /> New Task
        </button>
      </div>

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <Th>Task Title</Th><Th>Project</Th><Th>Priority</Th>
              <Th>Deadline</Th><Th>Status</Th><Th>Progress</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(task => (
              <tr key={task.id} style={{ transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <Td bold>{task.title}</Td>
                <Td>{task.project}</Td>
                <Td><Badge label={task.priority} color={priBadge[task.priority]} /></Td>
                <Td>{new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Td>
                <Td><Badge label={task.status} color={statusBadge[task.status]} /></Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: '#EEF0F5', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${task.progress}%`, height: '100%', background: task.progress === 100 ? Z.success : Z.accent, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: Z.muted, minWidth: 28 }}>{task.progress}%</span>
                  </div>
                </Td>
                <Td>
                  <button onClick={() => setModal(task)} style={{ 
                    padding: '6px 14px', borderRadius: 6, border: `1px solid ${Z.border}`, 
                    background: '#fff', fontSize: 12, cursor: 'pointer', color: Z.accent, 
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 
                  }}>
                    <Eye size={14} /> View
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: Z.text }}>Task Details</div>
              <button onClick={() => setModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: Z.muted, padding: 4 }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ marginBottom: 12 }}><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>PROJECT</span><div style={{ fontWeight: 700, marginTop: 3 }}>{modal.project}</div></div>
            <div style={{ marginBottom: 12 }}><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>TASK</span><div style={{ fontWeight: 700, marginTop: 3 }}>{modal.title}</div></div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>PRIORITY</span><div style={{ marginTop: 4 }}><Badge label={modal.priority} color={priBadge[modal.priority]} /></div></div>
              <div><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>DEADLINE</span><div style={{ fontWeight: 700, marginTop: 4 }}>{new Date(modal.deadline).toLocaleDateString()}</div></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>PROGRESS</span>
              <div style={{ marginTop: 8, height: 8, background: '#EEF0F5', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${modal.progress}%`, height: '100%', background: Z.accent, borderRadius: 4 }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: Z.muted, marginTop: 4 }}>{modal.progress}%</div>
            </div>
            <button onClick={() => setModal(null)} style={{ width: '100%', padding: 12, background: Z.accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
