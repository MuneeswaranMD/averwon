import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  Bell,
  MoreVertical
} from 'lucide-react';
import { SectionHeader, Card, Button } from '../components/ui';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const EVENTS = [
  { date: '2026-04-18', title: 'TechWave Demo Call', color: 'bg-blue-500', time: '10:00 AM' },
  { date: '2026-04-21', title: 'Deal Review - CloudForge', color: 'bg-purple-500', time: '2:00 PM' },
  { date: '2026-04-24', title: 'Team Standup', color: 'bg-emerald-500', time: '09:00 AM' },
  { date: '2026-04-28', title: 'Invoice Due - DataSync', color: 'bg-rose-500', time: 'All day' },
  { date: '2026-05-02', title: 'Q2 Pipeline Review', color: 'bg-amber-500', time: '11:00 AM' },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDay(current.year, current.month);

  const upcoming = EVENTS.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);

  const getEventsForDay = (day) => {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return EVENTS.filter(e => e.date === dateStr);
  };

  const isToday = (day) => today.getFullYear() === current.year && today.getMonth() === current.month && today.getDate() === day;

  return (
    <div className="space-y-6">
      <SectionHeader title="Calendar" subtitle="Schedule and manage your events" />

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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
                >
                  Today
                </Button>
                <div className="flex border border-slate-100 rounded-xl overflow-hidden p-1">
                  <button onClick={prev} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={next} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 mb-2 text-center border-b border-slate-50 pb-2">
              {DAYS.map(d => (
                <span key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{d}</span>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 border-l border-t border-slate-50">
              {[...Array(firstDay)].map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] border-r border-b border-slate-50 bg-slate-50/10" />
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const events = getEventsForDay(day);
                const todayFlag = isToday(day);
                return (
                  <div 
                    key={day} 
                    className={`min-h-[100px] p-2 border-r border-b border-slate-50 group hover:bg-slate-50/50 transition-all cursor-pointer ${todayFlag ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-lg transition-colors ${todayFlag ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 group-hover:text-slate-800'}`}>
                        {day}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {events.map((ev, idx) => (
                        <div 
                          key={idx} 
                          className={`${ev.color} rounded-md px-1.5 py-0.5 shadow-sm`}
                        >
                          <p className="text-[9px] text-white font-bold truncate tracking-tight">{ev.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-4">
          <Card title="Upcoming Events" className="h-full">
            <div className="space-y-6 mt-4">
              {upcoming.map((event, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={`w-1.5 rounded-full ${event.color} self-stretch transition-transform group-hover:scale-y-110`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-[13px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <CalendarIcon size={12} />
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <Clock size={12} />
                        {event.time}
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))}
              
              {upcoming.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <CalendarIcon size={24} />
                  </div>
                  <p className="text-[12px] font-bold text-slate-400">No events scheduled</p>
                </div>
              )}
            </div>

            <div className="mt-12 bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 border-dashed">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                  <Bell size={16} />
                </div>
                <p className="text-[12px] font-black text-indigo-900 uppercase">Pro Tip</p>
              </div>
              <p className="text-[11px] font-medium text-indigo-600 leading-relaxed">
                Connect your Google or Outlook calendar in <span className="font-black italic underline">Settings</span> to sync all your client meetings automatically.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
