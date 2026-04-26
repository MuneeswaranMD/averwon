import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, CheckCircle2, Activity } from 'lucide-react';

const Z = {
  accent:  '#2563EB', 
  success: '#10B981', 
  warning: '#F59E0B', 
  danger: '#EF4444',
  text: '#1E293B', 
  muted: '#64748B', 
  border: '#E2E8F0',
  cardBg: '#FFFFFF', 
  pageBg: '#F8FAFC', 
  inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:Z.cardBg, borderRadius:12, border:`1px solid ${Z.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', ...style }}>
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
    <img src="/logo.png" alt="Averqon" style={{ height:34, objectFit:'contain' }} />
    <div style={{ width:1, height:36, background:'rgba(255,255,255,0.2)' }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ color:'#fff', fontSize:17, fontWeight:700 }}>{title}</div>
      <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12 }}>{sub}</div>
    </div>
  </div>
);

const meetings = [
  { id:1, title:'Project Sync — AverLink',      date:'2024-04-22', time:'2:00 PM',  platform:'Google Meet',  status:'Join Now',  link:'#', participants:5  },
  { id:2, title:'Weekly Team Catch-up',          date:'2024-04-23', time:'10:00 AM', platform:'Zoom',         status:'Upcoming',  link:'#', participants:12 },
  { id:3, title:'Design Review — Pulse Health',  date:'2024-04-24', time:'3:30 PM',  platform:'Teams',        status:'Upcoming',  link:'#', participants:4  },
  { id:4, title:'Sprint Planning Q2',            date:'2024-04-25', time:'11:00 AM', platform:'Google Meet',  status:'Upcoming',  link:'#', participants:8  },
  { id:5, title:'Client Presentation',           date:'2024-04-18', time:'2:00 PM',  platform:'Zoom',         status:'Completed', link:'#', participants:6  },
];

const platformColor = { 'Google Meet':'#2563EB', 'Zoom':'#0E4491', 'Teams':'#6264A7' };

const Meetings = () => {
  const [filter, setFilter] = useState('All');
  const tabs = ['All', 'Upcoming', 'Completed'];
  const shown = filter === 'All' ? meetings : meetings.filter(m => m.status === filter || (filter === 'Upcoming' && m.status === 'Join Now'));

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", color:Z.text }}>
      <PageBand icon={Video} title="My Meetings" sub="View and join your scheduled meetings" />

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding:'7px 16px', borderRadius:20,
            border:`1.5px solid ${filter===t ? Z.accent : Z.border}`,
            background:filter===t ? Z.accent : '#fff',
            color:filter===t ? '#fff' : Z.muted,
            fontSize:12, fontWeight:600, cursor:'pointer',
          }}>{t}</button>
        ))}
      </div>

      {/* Meeting cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {shown.map(m => {
          const live = m.status === 'Join Now';
          const done = m.status === 'Completed';
          return (
            <Card key={m.id} style={{ padding:'20px 24px', borderLeft:`4px solid ${live ? Z.danger : done ? Z.muted : Z.accent}` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{
                    width:48, height:48, borderRadius:12, flexShrink:0,
                    background:live ? `${Z.danger}15` : done ? Z.pageBg : `${Z.accent}15`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {live ? <Activity size={20} color={Z.danger} /> : done ? <CheckCircle2 size={20} color={Z.muted} /> : <Video size={20} color={Z.accent} />}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:3 }}>{m.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px', fontSize:12, color:Z.muted }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={14} /> {new Date(m.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} /> {m.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={14} /> {m.participants} participants
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{
                    padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700,
                    background:platformColor[m.platform] ? `${platformColor[m.platform]}18` : '#F1F5F9',
                    color:platformColor[m.platform] || Z.muted,
                  }}>{m.platform}</span>
                  {!done && (
                    <a href={m.link} style={{
                      padding:'9px 20px', borderRadius:8, textDecoration:'none',
                      background:live ? Z.danger : Z.accent, color:'#fff',
                      fontSize:13, fontWeight:700, display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {live && <span style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', boxShadow: '0 0 8px #fff' }} />}
                      {live ? 'Join Now' : 'Join'}
                    </a>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:Z.muted, fontSize:14 }}>
          No meetings found for this filter.
        </div>
      )}
    </div>
  );
};

export default Meetings;
