import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, X, Loader2, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  accent: '#2563EB', accentH: '#1D4ED8', success: '#10B981', warning: '#F59E0B',
  danger: '#EF4444', purple: '#8B5CF6', text: '#1E293B', muted: '#64748B',
  border: '#E2E8F0', cardBg: '#FFFFFF', pageBg: '#F8FAFC', inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => <div style={{ background: Z.cardBg, borderRadius: 12, border: `1px solid ${Z.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>{children}</div>;

const PageBand = ({ icon: Icon, title, sub }) => (
  <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', borderRadius: 16, padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
    <img src="/logo.png" alt="Averqon" style={{ height: 34, objectFit: 'contain' }} />
    <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />
    <Icon size={24} color="#fff" />
    <div>
      <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{title}</div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{sub}</div>
    </div>
  </div>
);

const Badge = ({ label, color }) => {
  const cfg = {
    success: { bg: `${Z.success}15`, fg: Z.success }, warning: { bg: `${Z.warning}15`, fg: Z.warning },
    danger: { bg: `${Z.danger}15`, fg: Z.danger }, purple: { bg: `${Z.purple}15`, fg: Z.purple },
    blue: { bg: `${Z.accent}15`, fg: Z.accent }, default: { bg: `${Z.muted}10`, fg: Z.muted },
  };
  const c = cfg[color] || cfg.default;
  return <span style={{ display: 'inline-block', padding: '2px 10px', background: c.bg, color: c.fg, borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{label}</span>;
};

const Th = ({ children }) => <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, background: '#F8FAFC', borderBottom: `1px solid ${Z.border}`, whiteSpace: 'nowrap' }}>{children}</th>;
const Td = ({ children, bold }) => <td style={{ padding: '12px 14px', borderBottom: `1px solid ${Z.border}`, fontSize: 13, color: Z.text, fontWeight: bold ? 600 : 400 }}>{children}</td>;

const priBadge = { Urgent: 'danger', High: 'warning', Medium: 'blue', Low: 'success' };
const statusBadge = { Done: 'success', 'In Progress': 'blue', Review: 'purple', 'To Do': 'default' };
const tabs = ['All', 'To Do', 'In Progress', 'Review', 'Done'];

const getToken = () => localStorage.getItem('employeeToken');

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('All');
  const [modal, setModal] = useState(null);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = () => {
    const token = getToken();
    if (!token) { navigate('/employee/login'); return; }
    fetch(API_ENDPOINTS.EMPLOYEE_TASKS, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setTasks(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const updateTask = async (id, updates) => {
    setUpdating(id);
    try {
      const r = await fetch(API_ENDPOINTS.EMPLOYEE_TASK_UPDATE(id), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (r.ok) {
        const updated = await r.json();
        setTasks(prev => prev.map(t => t._id === id ? updated : t));
        if (modal?._id === id) setModal(updated);
      }
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const filtered = tab === 'All' ? tasks : tasks.filter(t => t.status === tab);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
      <Loader2 size={28} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
      <span style={{ color: Z.muted }}>Loading tasks...</span>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', gap: 10, padding: 24, background: '#FEF2F2', borderRadius: 12, color: Z.danger }}>
      <AlertCircle size={20} /> {error}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: Z.text }}>
      <PageBand icon={CheckCircle2} title="My Tasks" sub="Track and manage your assigned tasks" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 14px', borderRadius: 20,
              border: `1.5px solid ${tab === t ? Z.accent : Z.border}`,
              background: tab === t ? Z.accent : '#fff',
              color: tab === t ? '#fff' : Z.muted,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{t} {t === 'All' ? `(${tasks.length})` : `(${tasks.filter(x => x.status === t).length})`}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: Z.muted }}>{tasks.filter(t => t.status === 'Done').length} / {tasks.length} completed</div>
      </div>

      {filtered.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center', color: Z.muted }}>
          No {tab === 'All' ? '' : tab} tasks found. Your manager will assign tasks soon.
        </Card>
      ) : (
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><Th>Task</Th><Th>Project</Th><Th>Priority</Th><Th>Deadline</Th><Th>Status</Th><Th>Progress</Th><Th>Actions</Th></tr>
            </thead>
            <tbody>
              {filtered.map(task => (
                <tr key={task._id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <Td bold>{task.title}</Td>
                  <Td>{task.project || '—'}</Td>
                  <Td><Badge label={task.priority} color={priBadge[task.priority]} /></Td>
                  <Td>{task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</Td>
                  <Td>
                    <select
                      value={task.status}
                      onChange={e => updateTask(task._id, { status: e.target.value })}
                      disabled={!!updating}
                      style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: `1px solid ${Z.border}`, background: '#fff', cursor: 'pointer', color: Z.text }}
                    >
                      {['To Do', 'In Progress', 'Review', 'Done'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#EEF0F5', borderRadius: 4, overflow: 'hidden', minWidth: 60 }}>
                        <div style={{ width: `${task.progress || 0}%`, height: '100%', background: task.progress === 100 ? Z.success : Z.accent, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: Z.muted, minWidth: 28 }}>{task.progress || 0}%</span>
                    </div>
                  </Td>
                  <Td>
                    <button onClick={() => setModal(task)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${Z.border}`, background: '#fff', fontSize: 12, cursor: 'pointer', color: Z.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Eye size={14} /> View
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Detail Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 500, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: Z.text }}>Task Details</div>
              <button onClick={() => setModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: Z.muted }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: 12 }}><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>PROJECT</span><div style={{ fontWeight: 700, marginTop: 3 }}>{modal.project || '—'}</div></div>
            <div style={{ marginBottom: 12 }}><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>TASK</span><div style={{ fontWeight: 700, marginTop: 3 }}>{modal.title}</div></div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>PRIORITY</span><div style={{ marginTop: 4 }}><Badge label={modal.priority} color={priBadge[modal.priority]} /></div></div>
              <div><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>STATUS</span><div style={{ marginTop: 4 }}><Badge label={modal.status} color={statusBadge[modal.status]} /></div></div>
              <div><span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>DEADLINE</span><div style={{ fontWeight: 700, marginTop: 4 }}>{modal.deadline ? new Date(modal.deadline).toLocaleDateString() : '—'}</div></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: Z.muted, fontWeight: 600 }}>PROGRESS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <input type="range" min="0" max="100" step="5"
                  value={modal.progress || 0}
                  onChange={e => setModal(prev => ({ ...prev, progress: Number(e.target.value) }))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, fontWeight: 700, minWidth: 36 }}>{modal.progress || 0}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: 12, borderRadius: 8, border: `1px solid ${Z.border}`, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: Z.muted }}>Cancel</button>
              <button
                onClick={() => { updateTask(modal._id, { progress: modal.progress, status: modal.status }); setModal(null); }}
                disabled={!!updating}
                style={{ flex: 1, padding: 12, background: Z.accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
