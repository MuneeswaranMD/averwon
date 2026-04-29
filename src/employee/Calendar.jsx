import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const Calendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = now.getDate();
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) return;

      const [leaves, tasks, meetings] = await Promise.all([
        fetch('/api/employee/leaves', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch('/api/employee/tasks', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch('/api/employee/meetings', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
      ]);

      const allEvents = [];

      // Process Leaves
      if (Array.isArray(leaves)) {
        leaves.forEach(l => {
          if (l.status === 'Rejected') return;
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            allEvents.push({
              date: new Date(d),
              label: `Leave: ${l.leaveType}`,
              color: Z.danger,
              type: 'leave'
            });
          }
        });
      }

      // Process Tasks
      if (Array.isArray(tasks)) {
        tasks.forEach(t => {
          if (!t.dueDate) return;
          allEvents.push({
            date: new Date(t.dueDate),
            label: `Task: ${t.title}`,
            color: Z.warning,
            type: 'task'
          });
        });
      }

      // Process Meetings
      if (Array.isArray(meetings)) {
        meetings.forEach(m => {
          allEvents.push({
            date: new Date(m.date),
            label: `Meeting: ${m.title}`,
            color: Z.purple,
            type: 'meeting'
          });
        });
      }

      setEvents(allEvents);
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(e => 
      e.date.getDate() === day && 
      e.date.getMonth() === month && 
      e.date.getFullYear() === year
    );
  };

  const upcoming = events
    .filter(e => e.date >= new Date().setHours(0,0,0,0))
    .sort((a,b) => a.date - b.date)
    .slice(0, 5);

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:Z.accent }}>
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

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
              const dayEvents = getEventsForDay(day);
              const isToday = isCurrentMonth && day === today;
              return (
                <div key={i} style={{
                  minHeight:100, padding:'8px', borderRight: (i+1)%7===0 ? 'none' : `1px solid ${Z.border}`,
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
                      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                        {dayEvents.map((ev, idx) => (
                          <div key={idx} style={{
                            fontSize:10, fontWeight:600, color:'#fff',
                            background:ev.color, borderRadius:4,
                            padding:'2px 5px',
                            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                            cursor:'help'
                          }} title={ev.label}>{ev.label}</div>
                        ))}
                      </div>
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
              { label:'Meeting',      color:Z.purple  },
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
            {upcoming.length === 0 ? (
              <div style={{ fontSize:12, color:Z.muted, textAlign:'center', padding:'20px 0' }}>No upcoming events</div>
            ) : upcoming.map((ev, i) => (
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
                }}>{ev.date.getDate()}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:Z.text }}>{ev.label}</div>
                  <div style={{ fontSize:11, color:Z.muted }}>{MONTHS[ev.date.getMonth()].slice(0,3)} {ev.date.getDate()}, {ev.date.getFullYear()}</div>
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
