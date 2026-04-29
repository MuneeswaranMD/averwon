import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api-config';

const getToken = () => localStorage.getItem('employeeToken');

const Z = {
  accent: '#2563EB', success: '#10B981', warning: '#F59E0B', danger: '#EF4444',
  text: '#1E293B', muted: '#64748B', border: '#E2E8F0', cardBg: '#FFFFFF', pageBg: '#F8FAFC',
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

const platformColor = { 'Google Meet': '#2563EB', 'Zoom': '#0E4491', 'Teams': '#6264A7' };

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate('/employee/login'); return; }
    fetch(API_ENDPOINTS.EMPLOYEE_MEETINGS, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setMeetings(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs = ['All', 'Upcoming', 'Completed'];
  const now = new Date();
  const shown = filter === 'All' ? meetings
    : filter === 'Upcoming' ? meetings.filter(m => new Date(m.date) >= now)
    : meetings.filter(m => new Date(m.date) < now);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: Z.text }}>
      <PageBand icon={Video} title="My Meetings" sub="View and join your scheduled meetings" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '7px 16px', borderRadius: 20,
            border: `1.5px solid ${filter === t ? Z.accent : Z.border}`,
            background: filter === t ? Z.accent : '#fff',
            color: filter === t ? '#fff' : Z.muted,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: Z.muted }}>
          <Loader2 size={22} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} /> Loading meetings...
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {shown.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: Z.muted, fontSize: 14 }}>
              No {filter === 'All' ? '' : filter.toLowerCase()} meetings found.
            </div>
          )}
          {shown.map(m => {
            const mDate = new Date(m.date);
            const isUpcoming = mDate >= now;
            const isPast = mDate < now;
            return (
              <Card key={m._id} style={{ padding: '20px 24px', borderLeft: `4px solid ${isUpcoming ? Z.accent : Z.muted}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: isUpcoming ? `${Z.accent}15` : Z.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isPast ? <CheckCircle2 size={20} color={Z.muted} /> : <Video size={20} color={Z.accent} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{m.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px', fontSize: 12, color: Z.muted }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={14} /> {mDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        {m.time && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={14} /> {m.time}
                          </span>
                        )}
                        {m.participants?.length > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Users size={14} /> {m.participants.length} participants
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {m.platform && (
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${platformColor[m.platform] || '#64748B'}18`, color: platformColor[m.platform] || Z.muted }}>
                        {m.platform}
                      </span>
                    )}
                    {isUpcoming && m.meetingLink && (
                      <a href={m.meetingLink} target="_blank" rel="noreferrer"
                        style={{ padding: '9px 20px', borderRadius: 8, textDecoration: 'none', background: Z.accent, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        Join
                      </a>
                    )}
                    {!m.meetingLink && isUpcoming && (
                      <span style={{ padding: '4px 12px', background: `${Z.accent}15`, color: Z.accent, borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Upcoming</span>
                    )}
                    {isPast && (
                      <span style={{ padding: '4px 12px', background: `${Z.muted}15`, color: Z.muted, borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Completed</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Meetings;
