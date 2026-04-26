import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, MapPin, Bell, MoreVertical, Briefcase, 
  CheckSquare, Plane, User, Info
} from 'lucide-react';
import { SectionHeader, Card, Button } from '../components/ui';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const projects      = useSelector(s => s.projects.items);
  const tasks         = useSelector(s => s.tasks.items);
  const leaveRequests = useSelector(s => s.leave.items);
  const currentUser   = useSelector(s => s.auth.currentUser);
  const isAdmin       = currentUser?.role === 'admin';

  // ── Transform Data into Events ───────────────────────────────────────────
  const dynamicEvents = useMemo(() => {
    const evs = [];

    // Projects (Deadlines)
    projects.forEach(p => {
      const isMyProject = isAdmin || p.assignedUsers.includes(currentUser?.id);
      if (p.deadline && isMyProject) {
        evs.push({ date: p.deadline, title: `Proj: ${p.name}`, color: 'bg-emerald-500', icon: <Briefcase size={10} />, type: 'project' });
      }
    });

    // Tasks (Due dates)
    tasks.forEach(t => {
      const isMyTask = isAdmin || t.assignee === currentUser?.name;
      if (t.due && isMyTask) {
        evs.push({ date: t.due, title: `Task: ${t.title}`, color: 'bg-indigo-500', icon: <CheckSquare size={10} />, type: 'task' });
      }
    });

    // Leaves
    const myLeaves = isAdmin ? leaveRequests : leaveRequests.filter(l => l.userId === currentUser?.id);
    myLeaves.forEach(l => {
      const color = l.status === 'Approved' ? 'bg-blue-500' : l.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500';
      const title = isAdmin ? `${l.userName}: Leave` : `My Leave (${l.status})`;
      evs.push({ date: l.fromDate, title, color, icon: <Plane size={10} />, type: 'leave' });
      // If it spans multiple days, we could add more entries here, but for simplicity we just show start date
    });

    return evs;
  }, [projects, tasks, leaveRequests, currentUser, isAdmin]);

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDay(current.year, current.month);

  const getEventsForDay = (day) => {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dynamicEvents.filter(e => e.date === dateStr);
  };

  const isToday = (day) => today.getFullYear() === current.year && today.getMonth() === current.month && today.getDate() === day;

  const upcoming = dynamicEvents
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <SectionHeader title="Team Calendar" subtitle={isAdmin ? "Track deadlines and leaves across the team" : "Manage your projects and schedule"} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-8">
          <Card className="!p-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {MONTHS[current.month]} <span className="text-indigo-600">{current.year}</span>
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}>Today</Button>
                <div className="flex border border-slate-100 rounded-xl overflow-hidden p-1 bg-slate-50/50">
                  <button onClick={prev} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600 shadow-sm shadow-transparent hover:shadow-indigo-100/50">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={next} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-indigo-600 shadow-sm shadow-transparent hover:shadow-indigo-100/50">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 mb-2 text-center border-b border-slate-50 pb-2">
              {DAYS.map(d => (
                <span key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 border-l border-t border-slate-50">
              {[...Array(firstDay)].map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[110px] border-r border-b border-slate-50 bg-slate-50/20" />
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const events = getEventsForDay(day);
                const todayFlag = isToday(day);
                return (
                  <div key={day} className={`min-h-[110px] p-2 border-r border-b border-slate-50 group hover:bg-blue-50/30 transition-all cursor-pointer ${todayFlag ? 'bg-indigo-50/40' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-black rounded-lg transition-all ${todayFlag ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 group-hover:text-slate-800'}`}>
                        {day}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {events.map((ev, idx) => (
                        <div key={idx} className={`${ev.color} rounded-md px-1.5 py-1 shadow-sm flex items-center gap-1 overflow-hidden`}>
                          <div className="text-white opacity-80">{ev.icon}</div>
                          <p className="text-[9px] text-white font-black truncate tracking-tight">{ev.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Upcoming List */}
        <div className="lg:col-span-4">
          <Card title="Upcoming Highlights" className="h-full">
            <div className="space-y-6 mt-6">
              {upcoming.map((event, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={`w-1 shadow-sm rounded-full ${event.color} self-stretch transition-transform group-hover:scale-y-110`} />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-slate-100 text-slate-500">{event.icon}</span>
                      <p className="text-[12px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate">
                        {event.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <CalendarIcon size={12} className="text-slate-300" />
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        {event.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcoming.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                    <CalendarIcon size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-300">Nothing on the horizon</p>
                </div>
              )}
            </div>

            <div className="mt-12 bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 border-dashed relative overflow-hidden">
               <div className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-100/50 rounded-full blur-2xl" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600">
                  <Info size={18} />
                </div>
                <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">Notice Board</p>
              </div>
              <p className="text-[11px] font-bold text-indigo-600/80 leading-relaxed">
                Task deadlines and project completion dates are automatically synced. 
                Keep your status updated for accurate reporting.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

