import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Clock, 
  CheckSquare, 
  ClipboardList, 
  CheckCircle, 
  Timer, 
  Calendar, 
  Video, 
  ArrowRight,
  TrendingUp,
  Activity,
  Check
} from 'lucide-react';

const Z = {
  accent:   '#2563EB',
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
  <div style={{
    background: Z.cardBg,
    borderRadius: 12,
    border: `1px solid ${Z.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    ...style,
  }}>{children}</div>
);

const StatCard = ({ title, value, sub, color, icon: Icon }) => (
  <Card style={{ padding: '20px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: Z.text, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 12, color: Z.muted, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
             {sub}
          </div>
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}><Icon size={24} color={color} /></div>
    </div>
  </Card>
);

const ProgressBar = ({ label, pct, color }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: Z.text }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
    </div>
    <div style={{ height: 7, background: '#EEF0F5', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 8, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);

const Dashboard = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('employeeData');
    if (data) setEmployee(JSON.parse(data));
  }, []);

  const meetings = [
    { title: 'Project Sync — AverLink', time: 'Today, 2:00 PM', live: true },
    { title: 'Weekly Team Catch-up', time: 'Tomorrow, 10:00 AM', live: false },
    { title: 'Design Review — Pulse Health', time: '24 Apr, 3:30 PM', live: false },
  ];

  const activity = [
    { action: 'Completed task', detail: 'API Integration Audit', ago: '2h ago' },
    { action: 'Updated progress', detail: 'NeoRetail UI Revamp', ago: '5h ago' },
    { action: 'Submitted leave', detail: 'Sick Leave (2 days)', ago: 'Yesterday' },
    { action: 'Clocked out', detail: 'Daily Attendance', ago: 'Yesterday 6:30 PM' },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: Z.text }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        borderRadius: 20,
        padding: '40px',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
        boxShadow: '0 12px 24px -6px rgba(15, 23, 42, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background logo */}
        <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05, transform: 'rotate(-15deg)' }}>
          <img src="/logo.png" alt="" style={{ height: 180 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {employee?.name?.charAt(0) || 'E'}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              Good morning, {employee?.name?.split(' ')[0] || 'Employee'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              {today} · {employee?.designation || 'Staff'} · {employee?.department || 'Department'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/employee/attendance')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Clock size={16} /> Mark Attendance
          </button>
          <button
            onClick={() => navigate('/employee/tasks')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: '#FFFFFF', color: '#1E293B',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CheckSquare size={16} /> My Tasks
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 28 }}>
        <StatCard title="Total Tasks"   value="12"   sub="2 assigned this week" color={Z.accent}   icon={ClipboardList} />
        <StatCard title="Completed"     value="8"    sub="+15% from last month" color={Z.success}  icon={CheckCircle} />
        <StatCard title="Pending"       value="4"    sub="Due soon"             color={Z.warning}  icon={Timer} />
        <StatCard title="Attendance"    value="95%"  sub="This month"           color={Z.purple}   icon={Calendar} />
      </div>

      {/* Bottom section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Task progress */}
        <Card style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Task Progress</div>
            <button onClick={() => navigate('/employee/tasks')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: Z.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <ProgressBar label="AverLink Logistics — API"        pct={75} color={Z.accent} />
          <ProgressBar label="NeoRetail Core — Database"       pct={40} color={Z.warning} />
          <ProgressBar label="Pulse Health Suite — Security"   pct={95} color={Z.success} />
          <ProgressBar label="CloudMap Dashboard — Frontend"   pct={60} color={Z.purple} />
        </Card>

        {/* Leave & Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ padding: '22px 24px', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, textAlign: 'left' }}>Leave Balance</div>
            <div style={{
              width: 90, height: 90, borderRadius: '50%', margin: '0 auto 10px',
              border: `8px solid ${Z.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: Z.accent }}>14</span>
            </div>
            <div style={{ fontSize: 12, color: Z.muted, marginBottom: 14 }}>Days remaining this year</div>
            <button
              onClick={() => navigate('/employee/leaves')}
              style={{
                width: '100%', padding: '9px', borderRadius: 8,
                border: `1.5px solid ${Z.accent}`, background: 'none',
                color: Z.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >Apply Leave</button>
          </Card>

          <Card style={{ padding: '22px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Working Hours</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: Z.accent, lineHeight: 1 }}>168h</div>
            <div style={{ fontSize: 12, color: Z.muted, marginTop: 4, marginBottom: 12 }}>Total this month</div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              background: Z.inputBg, borderRadius: 8, padding: '10px 14px', fontSize: 12,
            }}>
              <span style={{ color: Z.muted }}>Avg: <strong style={{ color: Z.text }}>8.5h/day</strong></span>
              <span style={{ color: Z.success, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>Target: 160h <Check size={14} strokeWidth={3} /></span>
            </div>
          </Card>
        </div>

        {/* Meetings + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Upcoming Meetings</div>
            {meetings.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < meetings.length - 1 ? `1px solid ${Z.border}` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {m.live ? <Activity size={16} color={Z.accent} /> : <Video size={16} color={Z.muted} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: Z.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: Z.muted }}>{m.time}</div>
                </div>
                {m.live && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: Z.accent,
                    background: `${Z.accent}15`, borderRadius: 4, padding: '2px 6px',
                  }}>LIVE</span>
                )}
              </div>
            ))}
            <button onClick={() => navigate('/employee/calendar')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, width: '100%', padding: '8px', borderRadius: 8, border: `1px solid ${Z.border}`, background: 'none', fontSize: 13, color: Z.muted, cursor: 'pointer' }}>
              View Calendar <ArrowRight size={14} />
            </button>
          </Card>

          <Card style={{ padding: '22px 24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Recent Activity</div>
            {activity.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, paddingBottom: 10,
                borderBottom: i < activity.length - 1 ? `1px solid ${Z.border}` : 'none',
                marginBottom: 10,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: Z.accent, marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, color: Z.text }}>
                    <strong>{a.action}</strong> - {a.detail}
                  </div>
                  <div style={{ fontSize: 11, color: Z.muted }}>{a.ago}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
