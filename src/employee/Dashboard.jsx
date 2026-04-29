import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, CheckSquare, ClipboardList, CheckCircle, Timer,
  Calendar, Video, ArrowRight, TrendingUp, Activity,
  Check, AlertCircle, Loader2, Briefcase, Wrench, History
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  accent: '#2563EB', success: '#10B981', warning: '#F59E0B',
  danger: '#EF4444', purple: '#8B5CF6', text: '#1E293B',
  muted: '#64748B', border: '#E2E8F0', cardBg: '#FFFFFF',
  pageBg: '#F8FAFC', inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: Z.cardBg, borderRadius: 12, border: `1px solid ${Z.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const StatCard = ({ title, value, sub, color, icon: Icon, loading }) => (
  <Card style={{ padding: '20px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: Z.text, lineHeight: 1 }}>
          {loading ? <Loader2 size={24} className="animate-spin" style={{ color: Z.muted }} /> : value}
        </div>
        <div style={{ fontSize: 12, color: Z.muted, marginTop: 6 }}>{sub}</div>
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={24} color={color} />
      </div>
    </div>
  </Card>
);

const ProgressBar = ({ label, pct, color }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: Z.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
    </div>
    <div style={{ height: 7, background: '#EEF0F5', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 8, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);

const getToken = () => localStorage.getItem('employeeToken');

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate('/employee/login'); return; }

    fetch(API_ENDPOINTS.EMPLOYEE_DASHBOARD, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const priBadge = { Urgent: Z.danger, High: Z.warning, Medium: Z.accent, Low: Z.success };
  const statusColor = { 'Done': Z.success, 'In Progress': Z.accent, 'Review': Z.purple, 'To Do': Z.muted };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, flexDirection: 'column', gap: 12 }}>
      <Loader2 size={36} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: Z.muted, fontSize: 14 }}>Loading your dashboard...</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24, background: '#FEF2F2', borderRadius: 12, border: '1px solid #FECACA', color: Z.danger }}>
      <AlertCircle size={20} /> Error loading dashboard: {error}
    </div>
  );

  const { employee, stats, tasks, meetings, recentLeaves, recentActivities, todayAttendance } = data || {};

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: Z.text }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        borderRadius: 20, padding: '40px', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap',
        boxShadow: '0 12px 24px -6px rgba(15,23,42,0.4)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05, transform: 'rotate(-15deg)' }}>
          <img src="/logo.png" alt="" style={{ height: 180 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {employee?.name?.charAt(0) || 'E'}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              {greet()}, {employee?.name?.split(' ')[0] || 'Employee'} 👋
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              {today} · {employee?.designation || 'Staff'} · {employee?.department || 'Department'}
            </div>
            {todayAttendance?.checkInTime && (
              <div style={{ fontSize: 12, color: '#86EFAC', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} strokeWidth={3} />
                Checked in at {todayAttendance.checkInTime} · {todayAttendance.workMode}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/employee/attendance')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Clock size={16} /> {todayAttendance?.checkInTime ? 'View Attendance' : 'Mark Attendance'}
          </button>
          <button
            onClick={() => navigate('/employee/tasks')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: '#FFFFFF', color: '#1E293B', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          >
            <CheckSquare size={16} /> My Tasks
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 28 }}>
        <StatCard title="Active Projects" value={stats?.activeProjects ?? '—'} sub="Assigned to you" color={Z.purple} icon={Briefcase} />
        <StatCard title="Total Tasks"     value={stats?.totalTasks ?? '—'}   sub={`${stats?.completedTasks ?? 0} completed`} color={Z.accent} icon={ClipboardList} />
        <StatCard title="Pending Tasks"   value={stats?.pendingTasks ?? '—'}  sub="Requires action" color={Z.warning} icon={Timer} />
        <StatCard title="Attendance"      value={`${stats?.attendanceRate ?? 0}%`} sub="Current month" color={Z.success} icon={Activity} />
      </div>

      {/* Bottom section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Projects & Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Projects</div>
              <button onClick={() => navigate('/employee/projects')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: Z.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                View All <ArrowRight size={14} />
              </button>
            </div>
            {data?.projects?.length > 0 ? data.projects.map((p, i) => (
              <div key={p._id} style={{ 
                padding: '12px 0', 
                borderBottom: i < data.projects.length - 1 ? `1px solid ${Z.border}` : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: Z.muted }}>Deadline: {new Date(p.deadline).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: Z.accent, background: `${Z.accent}15`, padding: '2px 8px', borderRadius: 4 }}>
                  {p.status}
                </div>
              </div>
            )) : (
              <div style={{ color: Z.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No active projects</div>
            )}
          </Card>

          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Task Progress</div>
              <button onClick={() => navigate('/employee/tasks')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: Z.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                View All <ArrowRight size={14} />
              </button>
            </div>
            {tasks?.length > 0 ? tasks.slice(0, 3).map(t => (
              <ProgressBar key={t._id} label={t.title} pct={t.progress || 0} color={priBadge[t.priority] || Z.muted} />
            )) : (
              <div style={{ color: Z.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No tasks assigned yet</div>
            )}
          </Card>
        </div>

        {/* Leave Balance + Working Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ padding: '22px 24px', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, textAlign: 'left' }}>Leave Balance</div>
            <div style={{
              width: 90, height: 90, borderRadius: '50%', margin: '0 auto 10px',
              border: `8px solid ${Z.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: Z.accent }}>{stats?.leaveBalance ?? '—'}</span>
            </div>
            <div style={{ fontSize: 12, color: Z.muted, marginBottom: 6 }}>Days remaining this year</div>
            {stats?.pendingLeaves > 0 && (
              <div style={{ fontSize: 12, color: Z.warning, marginBottom: 10, fontWeight: 600 }}>
                {stats.pendingLeaves} leave request(s) pending approval
              </div>
            )}
            <button
              onClick={() => navigate('/employee/leaves')}
              style={{ width: '100%', padding: '9px', borderRadius: 8, border: `1.5px solid ${Z.accent}`, background: 'none', color: Z.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >Apply Leave</button>
          </Card>

          <Card style={{ padding: '22px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Today's Status</div>
            {todayAttendance ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: Z.muted }}>Check-in</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: Z.success }}>{todayAttendance.checkInTime || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: Z.muted }}>Check-out</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: todayAttendance.checkOutTime ? Z.text : Z.muted }}>
                    {todayAttendance.checkOutTime || 'Not yet'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: Z.muted }}>Mode</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{todayAttendance.workMode}</span>
                </div>
              </>
            ) : (
              <div style={{ color: Z.muted, fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
                Not checked in today
              </div>
            )}
          </Card>

          <Card style={{ padding: '20px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Quick Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => navigate('/employee/tools')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px', borderRadius: 8, border: `1px solid ${Z.border}`, background: 'none', cursor: 'pointer' }}>
                <Wrench size={18} color={Z.muted} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Tools</span>
              </button>
              <button onClick={() => navigate('/employee/activities')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px', borderRadius: 8, border: `1px solid ${Z.border}`, background: 'none', cursor: 'pointer' }}>
                <History size={18} color={Z.muted} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Logs</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Meetings + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Upcoming Meetings</div>
            {meetings?.length > 0 ? meetings.map((m, i) => (
              <div key={m._id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderBottom: i < meetings.length - 1 ? `1px solid ${Z.border}` : 'none',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={16} color={Z.accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: Z.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: Z.muted }}>
                    {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {m.time}
                  </div>
                </div>
                {m.meetingLink && (
                  <a href={m.meetingLink} target="_blank" rel="noreferrer"
                    style={{ fontSize: 10, fontWeight: 700, color: Z.accent, background: `${Z.accent}15`, borderRadius: 4, padding: '2px 6px', textDecoration: 'none' }}>
                    JOIN
                  </a>
                )}
              </div>
            )) : (
              <div style={{ color: Z.muted, fontSize: 13, textAlign: 'center', padding: '12px 0' }}>No upcoming meetings</div>
            )}
            <button onClick={() => navigate('/employee/calendar')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, width: '100%', padding: '8px', borderRadius: 8, border: `1px solid ${Z.border}`, background: 'none', fontSize: 13, color: Z.muted, cursor: 'pointer' }}>
              View Calendar <ArrowRight size={14} />
            </button>
          </Card>

          <Card style={{ padding: '22px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Recent Activity</div>
            {recentActivities?.length > 0 ? recentActivities.map((a, i) => (
              <div key={a._id} style={{
                display: 'flex', gap: 10, paddingBottom: 10,
                borderBottom: i < recentActivities.length - 1 ? `1px solid ${Z.border}` : 'none',
                marginBottom: 10,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: Z.accent, marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, color: Z.text }}><strong>{a.action}</strong></div>
                  <div style={{ fontSize: 11, color: Z.muted }}>
                    {new Date(a.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ color: Z.muted, fontSize: 13, textAlign: 'center', padding: '12px 0' }}>No recent activity</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
