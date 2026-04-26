import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

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
};

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

const events = [
  { day:5,  label:'Leave: Sick',         color:Z.danger  },
  { day:10, label:'Meeting: Team Sync',  color:Z.accent  },
  { day:15, label:'Task Due: API Audit', color:Z.warning },
  { day:18, label:'Meeting: Design Rev', color:Z.purple  },
  { day:22, label:'Holiday: Earth Day',  color:Z.success },
  { day:25, label:'Leave: Casual',       color:Z.danger  },
];

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const Calendar = () => {
  const now   = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const today = now.getDate();
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const upcoming = events.slice(0, 4);

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", color:Z.text }}>
      <PageBand icon={CalendarIcon} title="My Calendar" sub="View your schedule, events and leave days" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, alignItems:'start' }}>

        {/* Calendar grid */}
        <div style={{ background:Z.cardBg, borderRadius:12, border:`1px solid ${Z.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', overflow:'hidden' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', borderBottom:`1px solid ${Z.border}` }}>
            <button onClick={prev} style={{ width:34, height:34, borderRadius:8, border:`1px solid ${Z.border}`, background:'#fff', cursor:'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={18} color={Z.muted} />
            </button>
            <div style={{ fontWeight:800, fontSize:17 }}>{MONTHS[month]} {year}</div>
            <button onClick={next} style={{ width:34, height:34, borderRadius:8, border:`1px solid ${Z.border}`, background:'#fff', cursor:'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={18} color={Z.muted} />
            </button>
          </div>

          {/* Day labels */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'#F8FAFC', borderBottom:`1px solid ${Z.border}` }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize:11, fontWeight:700, color:Z.muted, textTransform:'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
            {cells.map((day, i) => {
              const ev = day && events.find(e => e.day === day);
              const isToday = isCurrentMonth && day === today;
              return (
                <div key={i} style={{
                  minHeight:80, padding:'8px', borderRight: (i+1)%7===0 ? 'none' : `1px solid ${Z.border}`,
                  borderBottom:`1px solid ${Z.border}`,
                  background: isToday ? '#F9FAFB' : '#fff',
                }}>
                  {day && (
                    <>
                      <div style={{
                        width:28, height:28, borderRadius:'50%',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        background: isToday ? Z.accent : 'transparent',
                        color: isToday ? '#fff' : Z.text,
                        fontWeight: isToday ? 800 : 400,
                        fontSize:13, marginBottom:4,
                      }}>{day}</div>
                      {ev && (
                        <div style={{
                          fontSize:10, fontWeight:600, color:'#fff',
                          background:ev.color, borderRadius:4,
                          padding:'2px 5px',
                          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                        }}>{ev.label}</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Legend */}
          <div style={{ background:Z.cardBg, borderRadius:12, border:`1px solid ${Z.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', padding:'18px 20px' }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Legend</div>
            {[
              { label:'Leave Day',    color:Z.danger  },
              { label:'Meeting',      color:Z.accent  },
              { label:'Task Due',     color:Z.warning },
              { label:'Holiday',      color:Z.success },
            ].map(l => (
              <div key={l.label} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:l.color, flexShrink:0 }} />
                <span style={{ fontSize:13, color:Z.text }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div style={{ background:Z.cardBg, borderRadius:12, border:`1px solid ${Z.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', padding:'18px 20px' }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Upcoming Events</div>
            {upcoming.map((ev, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'9px 0',
                borderBottom: i < upcoming.length-1 ? `1px solid ${Z.border}` : 'none',
              }}>
                <div style={{
                  width:36, height:36, borderRadius:10, flexShrink:0,
                  background:`${ev.color}18`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:ev.color, fontWeight:800, fontSize:13,
                }}>{ev.day}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:Z.text }}>{ev.label}</div>
                  <div style={{ fontSize:11, color:Z.muted }}>{MONTHS[month].slice(0,3)} {ev.day}, {year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
