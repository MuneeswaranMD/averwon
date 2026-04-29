import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Building2, Home, CheckCircle, LogOut,
  Calendar, Timer, BarChart, AlertTriangle, Download, Loader2, AlertCircle
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  accent: '#2563EB', success: '#10B981', warning: '#F59E0B', danger: '#EF4444',
  text: '#1E293B', muted: '#64748B', border: '#E2E8F0', cardBg: '#FFFFFF',
  pageBg: '#F8FAFC', inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: Z.cardBg, borderRadius: 12, border: `1px solid ${Z.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

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

const StatBox = ({ label, value, color, icon: Icon }) => (
  <Card style={{ padding: '18px 20px', textAlign: 'center' }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
      <Icon size={24} color={color} />
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: Z.muted, marginTop: 6, fontWeight: 600 }}>{label}</div>
  </Card>
);

const StatusBadge = ({ status }) => {
  const map = { Present: [`${Z.success}15`, Z.success], Late: [`${Z.warning}15`, Z.warning], Absent: [`${Z.danger}15`, Z.danger], 'Half Day': [`${Z.accent}15`, Z.accent] };
  const [bg, fg] = map[status] || [`${Z.muted}15`, Z.muted];
  return <span style={{ display: 'inline-block', padding: '4px 12px', background: bg, color: fg, borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{status}</span>;
};

const Th = ({ children }) => <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, background: '#F8FAFC', borderBottom: `1px solid ${Z.border}`, whiteSpace: 'nowrap' }}>{children}</th>;
const Td = ({ children, bold }) => <td style={{ padding: '12px 14px', borderBottom: `1px solid ${Z.border}`, fontSize: 13, color: Z.text, fontWeight: bold ? 600 : 400 }}>{children}</td>;

const getToken = () => localStorage.getItem('employeeToken');

const Attendance = () => {
  const [attData, setAttData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [mode, setMode] = useState('Office');
  const [time, setTime] = useState(new Date());
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchAttendance = () => {
    const token = getToken();
    if (!token) { navigate('/employee/login'); return; }
    fetch(API_ENDPOINTS.EMPLOYEE_ATTENDANCE, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAttData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAttendance(); }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMsg(null);
    try {
      const r = await fetch(API_ENDPOINTS.EMPLOYEE_ATTENDANCE_CHECKIN, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ workMode: mode }),
      });
      const d = await r.json();
      if (!r.ok) { setMsg({ type: 'error', text: d.error || 'Check-in failed' }); return; }
      setMsg({ type: 'success', text: `✅ Checked in at ${d.attendance.checkInTime}` });
      fetchAttendance();
    } catch (e) { setMsg({ type: 'error', text: e.message }); }
    finally { setActionLoading(false); }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMsg(null);
    try {
      const r = await fetch(API_ENDPOINTS.EMPLOYEE_ATTENDANCE_CHECKIN.replace('check-in', 'check-out'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      });
      const d = await r.json();
      if (!r.ok) { setMsg({ type: 'error', text: d.error || 'Check-out failed' }); return; }
      setMsg({ type: 'success', text: `✅ Checked out at ${d.attendance.checkOutTime}` });
      fetchAttendance();
    } catch (e) { setMsg({ type: 'error', text: e.message }); }
    finally { setActionLoading(false); }
  };

  const today = attData?.todayRecord;
  const stats = attData?.stats || {};
  const records = attData?.records || [];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: Z.text }}>
      <PageBand icon={Clock} title="Attendance" sub="Mark your daily check-in and view attendance history" />

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 24 }}>
        {/* Clock card */}
        <Card style={{ padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Live Clock</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: Z.text, letterSpacing: 1, marginBottom: 4 }}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: 13, color: Z.muted, marginBottom: 22 }}>
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          {/* Work mode toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {['Office', 'WFH'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: `1.5px solid ${mode === m ? Z.accent : Z.border}`,
                background: mode === m ? `${Z.accent}12` : '#fff',
                color: mode === m ? Z.accent : Z.muted,
                fontWeight: 700, fontSize: 13,
              }}>
                {m === 'Office' ? <Building2 size={16} /> : <Home size={16} />} {m}
              </button>
            ))}
          </div>

          {/* Message */}
          {msg && (
            <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: 12, fontWeight: 600, background: msg.type === 'success' ? '#F0FDF4' : '#FEF2F2', color: msg.type === 'success' ? Z.success : Z.danger, border: `1px solid ${msg.type === 'success' ? '#BBF7D0' : '#FECACA'}` }}>
              {msg.text}
            </div>
          )}

          {/* Check-in / Check-out */}
          {loading ? (
            <div style={{ padding: 14, textAlign: 'center', color: Z.muted }}>Loading...</div>
          ) : !today?.checkInTime ? (
            <button onClick={handleCheckIn} disabled={actionLoading} style={{
              width: '100%', padding: '14px', background: actionLoading ? Z.muted : Z.success, color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: actionLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {actionLoading ? <Loader2 size={18} /> : <CheckCircle size={20} />} Check In
            </button>
          ) : !today?.checkOutTime ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F0FDF4', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: Z.success, fontWeight: 600 }}>
                <CheckCircle size={16} color={Z.success} /> Checked in at {today.checkInTime}
              </div>
              <button onClick={handleCheckOut} disabled={actionLoading} style={{
                width: '100%', padding: '14px', background: actionLoading ? Z.muted : Z.danger, color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: actionLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {actionLoading ? <Loader2 size={18} /> : <LogOut size={20} />} Check Out
              </button>
            </>
          ) : (
            <div style={{ padding: '14px', background: '#F0FDF4', borderRadius: 10, fontSize: 13, fontWeight: 600, color: Z.success, textAlign: 'center' }}>
              ✅ Done for today · {today.checkInTime} – {today.checkOutTime}
            </div>
          )}
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <StatBox label="Present Days"   value={stats.present || 0}  color={Z.accent}   icon={Calendar} />
          <StatBox label="Late Entries"   value={stats.late || 0}     color={Z.warning}  icon={Clock} />
          <StatBox label="Total Hours"    value={`${stats.totalHours || 0}h`} color={Z.text} icon={Timer} />
          <StatBox label="Absent Days"    value={stats.absent || 0}   color={Z.danger}   icon={BarChart} />
        </div>
      </div>

      {/* Policy notice */}
      <div style={{ background: '#F8FAFC', border: `1px solid ${Z.border}`, borderRadius: 10, padding: '12px 18px', marginBottom: 24, fontSize: 13, color: Z.text, display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertTriangle size={18} color={Z.warning} /> <strong>Policy:</strong>&nbsp;Daily minimum 8 hours. Arrival after 9:30 AM is marked <strong>Late</strong>.
      </div>

      {/* History table */}
      <Card>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Attendance History (Last 30 Days)</div>
          <div style={{ fontSize: 12, color: Z.muted }}>{records.length} records</div>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Z.muted }}>Loading records...</div>
        ) : records.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: Z.muted }}>No attendance records found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><Th>Date</Th><Th>Check-In</Th><Th>Check-Out</Th><Th>Mode</Th><Th>Status</Th></tr>
            </thead>
            <tbody>
              {records.map((row, i) => (
                <tr key={row._id || i} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <Td bold>{new Date(row.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Td>
                  <Td>{row.checkInTime || '—'}</Td>
                  <Td>{row.checkOutTime || '—'}</Td>
                  <Td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {row.workMode === 'WFH' ? <Home size={14} /> : <Building2 size={14} />} {row.workMode || 'Office'}
                    </span>
                  </Td>
                  <Td><StatusBadge status={row.status} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Attendance;
