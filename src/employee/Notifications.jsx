import React, { useState } from 'react';
import { Bell, Calendar, CheckCircle2, Video, CreditCard, Clock, Check, PartyPopper } from 'lucide-react';

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

const notifications = [
  { id:1, type:'leave',    icon:Calendar,    title:'Leave Request Approved',          body:'Your Casual Leave (Apr 15–16) has been approved by HR.',            time:'2 hours ago',  read:false },
  { id:2, type:'task',     icon:CheckCircle2, title:'New Task Assigned',               body:'API Integration with AWS IoT assigned to you by Sarah Chen.',       time:'5 hours ago',  read:false },
  { id:3, type:'meeting',  icon:Video,       title:'Meeting Reminder',                body:'Project Sync with AverLink team starts in 30 minutes.',             time:'Today 1:30 PM', read:false },
  { id:4, type:'payroll',  icon:CreditCard,  title:'Payroll Processed',               body:'Your salary for April 2024 has been credited to your account.',     time:'Yesterday',    read:true  },
  { id:5, type:'task',     icon:Clock,       title:'Task Deadline Approaching',       body:'Encrypted Records Audit is due in 2 days. Progress: 95%.',          time:'Yesterday',    read:true  },
  { id:6, type:'system',   icon:Bell,        title:'System Maintenance Scheduled',   body:'Portal will be under maintenance on Sunday, 12:00 AM – 2:00 AM.',   time:'2 days ago',   read:true  },
];

const typeColor = {
  leave:   '#10B981', task: '#2563EB', meeting: '#8B5CF6',
  payroll: '#6366F1', system: '#F59E0B',
};

const Notifications = () => {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState('All');

  const markRead = id => setItems(p => p.map(n => n.id === id ? { ...n, read:true } : n));
  const markAll  = ()  => setItems(p => p.map(n => ({ ...n, read:true })));

  const tabs = ['All', 'Unread'];
  const shown = filter === 'Unread' ? items.filter(n => !n.read) : items;
  const unread = items.filter(n => !n.read).length;

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", color:Z.text }}>
      <PageBand icon={Bell} title="Notifications" sub="Stay up to date with your latest alerts" />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding:'7px 16px', borderRadius:20,
              border:`1.5px solid ${filter===t ? Z.accent : Z.border}`,
              background:filter===t ? Z.accent : '#fff',
              color:filter===t ? '#fff' : Z.muted,
              fontSize:12, fontWeight:600, cursor:'pointer',
            }}>{t}{t==='Unread' && unread > 0 ? ` (${unread})` : ''}</button>
          ))}
        </div>
        {unread > 0 && (
          <button onClick={markAll} style={{
            padding:'7px 14px', border:`1px solid ${Z.border}`,
            borderRadius:8, background:'#fff', fontSize:12,
            cursor:'pointer', color:Z.accent, fontWeight:600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Check size={14} /> Mark all as read
          </button>
        )}
      </div>

      <Card>
        {shown.map((n, i) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            style={{
              display:'flex', alignItems:'flex-start', gap:14,
              padding:'16px 20px',
              borderBottom: i < shown.length-1 ? `1px solid ${Z.border}` : 'none',
              background: n.read ? '#fff' : `${Z.accent}05`,
              cursor:'pointer',
              transition:'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = n.read ? '#F8FAFC' : `${Z.accent}10`}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? '#fff' : `${Z.accent}05`}
          >
            {/* Icon badge */}
            <div style={{
              width:42, height:42, borderRadius:12, flexShrink:0,
              background:`${typeColor[n.type]}18`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color: typeColor[n.type],
            }}>
              <n.icon size={18} />
            </div>

            {/* Content */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <div style={{ fontWeight: n.read ? 600 : 700, fontSize:14 }}>{n.title}</div>
                {!n.read && (
                  <span style={{ width:8, height:8, borderRadius:'50%', background:Z.accent, flexShrink:0 }} />
                )}
              </div>
              <div style={{ fontSize:13, color:Z.muted, lineHeight:1.5 }}>{n.body}</div>
            </div>

            {/* Time */}
            <div style={{ fontSize:11, color:Z.muted, whiteSpace:'nowrap', flexShrink:0 }}>{n.time}</div>
          </div>
        ))}

        {shown.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', color:Z.muted, fontSize:14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <PartyPopper size={32} color={Z.accent} />
            You're all caught up!
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
