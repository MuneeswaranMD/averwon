import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw, Activity, Clock, CheckCircle, AlertCircle,
  UserCheck, Timer, TrendingUp, ChevronDown, ChevronRight,
  Building2, Home, Loader2, Users, CheckSquare, XCircle, Calendar
} from 'lucide-react';

const C = {
  accent: '#2563EB', success: '#10B981', warning: '#F59E0B', danger: '#EF4444',
  purple: '#8B5CF6', text: '#1E293B', muted: '#64748B', border: '#E2E8F0',
  cardBg: '#FFFFFF', pageBg: '#F8FAFC',
};

const StatusDot = ({ status }) => {
  const map = {
    Online: C.success,
    'Checked Out': C.muted,
    Absent: C.danger,
  };
  const color = map[status] || C.muted;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0,
        boxShadow: status === 'Online' ? `0 0 0 3px ${color}30` : 'none',
        animation: status === 'Online' ? 'pulse 2s infinite' : 'none',
      }} />
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{status}</span>
    </span>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.cardBg, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, sub }) => (
  <Card style={{ padding: '18px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{value}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
    </div>
  </Card>
);

const EmployeeTracking = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [approving, setApproving] = useState(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [trackRes, leaveRes] = await Promise.all([
        fetch('/api/admin/tracking/employees'),
        fetch('/api/admin/leaves/pending'),
      ]);
      const [trackData, leaveData] = await Promise.all([trackRes.json(), leaveRes.json()]);
      if (Array.isArray(trackData)) setData(trackData);
      if (Array.isArray(leaveData)) setPendingLeaves(leaveData);
      setLastRefresh(new Date());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLeaveAction = async (leaveId, status) => {
    setApproving(leaveId);
    try {
      await fetch(`/api/admin/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setPendingLeaves(prev => prev.filter(l => l._id !== leaveId));
    } catch (e) { console.error(e); }
    finally { setApproving(null); }
  };

  // Summary stats
  const online = data.filter(d => d.status === 'Online').length;
  const checkedOut = data.filter(d => d.status === 'Checked Out').length;
  const absent = data.filter(d => d.status === 'Absent').length;
  const totalTasks = data.reduce((sum, d) => sum + (d.pendingTasks || 0), 0);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12, flexDirection: 'column' }}>
      <Loader2 size={32} color={C.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ color: C.muted, fontSize: 14 }}>Loading employee tracking...</div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', gap: 12, padding: 20, background: '#FEF2F2', borderRadius: 12, color: C.danger }}>
      <AlertCircle size={20} /> {error}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: C.text }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>Employee Tracking</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Real-time overview · Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
        <button onClick={() => fetchData(true)} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: `1.5px solid ${C.border}`, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: C.text }}>
          <RefreshCw size={16} color={C.accent} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard title="Active Now"     value={online}      icon={Activity}    color={C.success}  sub="Checked in today" />
        <StatCard title="Checked Out"    value={checkedOut}  icon={UserCheck}   color={C.muted}    sub="Left for the day" />
        <StatCard title="Absent Today"   value={absent}      icon={XCircle}     color={C.danger}   sub="Not checked in" />
        <StatCard title="Pending Tasks"  value={totalTasks}  icon={CheckSquare} color={C.warning}  sub="Across all employees" />
      </div>

      {/* Pending Leave Approvals */}
      {pendingLeaves.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={18} color={C.warning} />
            <div style={{ fontWeight: 800, fontSize: 15 }}>Pending Leave Approvals</div>
            <span style={{ background: `${C.warning}18`, color: C.warning, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
              {pendingLeaves.length}
            </span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {pendingLeaves.map(leave => (
              <div key={leave._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 22px', borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{leave.employeeName}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {leave.leaveType} · {leave.startDate ? new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'} – {leave.endDate ? new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    {leave.reason && ` · "${leave.reason}"`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleLeaveAction(leave._id, 'Approved')}
                    disabled={approving === leave._id}
                    style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: C.success, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => handleLeaveAction(leave._id, 'Rejected')}
                    disabled={approving === leave._id}
                    style={{ padding: '7px 16px', borderRadius: 8, border: `1px solid ${C.danger}`, background: '#fff', color: C.danger, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Employee Table */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={18} color={C.accent} />
          <div style={{ fontWeight: 800, fontSize: 15 }}>All Active Employees</div>
          <span style={{ background: `${C.accent}12`, color: C.accent, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
            {data.length}
          </span>
        </div>

        {data.length === 0 ? (
          <div style={{ padding: 50, textAlign: 'center', color: C.muted }}>No active employees found.</div>
        ) : (
          <div>
            {data.map((row, i) => {
              const emp = row.employee;
              const isExpanded = expanded === emp._id;
              const att = row.todayAttendance;

              return (
                <div key={emp._id} style={{ borderBottom: i < data.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  {/* Main row */}
                  <div
                    onClick={() => setExpanded(isExpanded ? null : emp._id)}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '14px 22px', cursor: 'pointer',
                      background: isExpanded ? '#F8FAFC' : '#fff',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => !isExpanded && (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => !isExpanded && (e.currentTarget.style.background = '#fff')}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0, marginRight: 14,
                      background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 800, fontSize: 16,
                    }}>
                      {emp.name?.charAt(0) || 'E'}
                    </div>

                    {/* Name + dept */}
                    <div style={{ flex: '0 0 200px' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{emp.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{emp.designation || emp.role} · {emp.department}</div>
                    </div>

                    {/* Status */}
                    <div style={{ flex: '0 0 120px' }}>
                      <StatusDot status={row.status} />
                    </div>

                    {/* Check-in/out */}
                    <div style={{ flex: '0 0 160px', fontSize: 12, color: C.muted }}>
                      {att?.checkInTime ? (
                        <div>
                          <span style={{ color: C.success, fontWeight: 600 }}>In: {att.checkInTime}</span>
                          {att.checkOutTime && <span style={{ marginLeft: 8, color: C.muted }}>Out: {att.checkOutTime}</span>}
                        </div>
                      ) : (
                        <span style={{ color: C.danger }}>Not checked in</span>
                      )}
                    </div>

                    {/* Mode */}
                    <div style={{ flex: '0 0 110px', fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {att?.workMode === 'WFH' ? <Home size={14} /> : <Building2 size={14} />}
                      {att?.workMode || 'Office'}
                    </div>

                    {/* Tasks */}
                    <div style={{ flex: '0 0 100px', fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: row.pendingTasks > 0 ? C.warning : C.success }}>
                        {row.pendingTasks} pending
                      </span>
                      <span style={{ color: C.muted }}> / {row.completedTasks} done</span>
                    </div>

                    {/* Leave flag */}
                    <div style={{ flex: '0 0 90px' }}>
                      {row.hasPendingLeave && (
                        <span style={{ fontSize: 11, fontWeight: 700, background: `${C.warning}18`, color: C.warning, padding: '3px 9px', borderRadius: 20 }}>
                          Leave Pending
                        </span>
                      )}
                    </div>

                    {/* Expand icon */}
                    <div style={{ marginLeft: 'auto', color: C.muted }}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ padding: '0 22px 18px 76px', borderTop: `1px solid ${C.border}`, background: '#F8FAFC' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 14 }}>
                        {/* Recent Activity */}
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Recent Activity</div>
                          {row.recentActivities?.length > 0 ? row.recentActivities.map((a, ai) => (
                            <div key={a._id || ai} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, marginTop: 6, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: 13, color: C.text }}>{a.action}</div>
                                <div style={{ fontSize: 11, color: C.muted }}>{new Date(a.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                            </div>
                          )) : (
                            <div style={{ fontSize: 13, color: C.muted }}>No recent activity</div>
                          )}
                        </div>

                        {/* Additional info */}
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Employee Info</div>
                          <div style={{ fontSize: 13, color: C.text, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div><span style={{ color: C.muted }}>Email:</span> {emp.email}</div>
                            <div><span style={{ color: C.muted }}>Department:</span> {emp.department}</div>
                            <div><span style={{ color: C.muted }}>Role:</span> {emp.role}</div>
                            {row.lastSeen && (
                              <div><span style={{ color: C.muted }}>Last Activity:</span> {new Date(row.lastSeen).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployeeTracking;
