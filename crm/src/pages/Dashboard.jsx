import React from 'react';
import { useSelector } from 'react-redux';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip as RTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Building2, Handshake, Ticket, Plus, ArrowRight, Clock, 
  ChevronRight, FolderOpen, CheckSquare, CalendarDays, Target, Zap
} from 'lucide-react';
import { StatCard, SectionHeader, UserAvatar } from '../components/ui';

const dealStageData = [
  { stage: 'New', count: 5, value: 210000 },
  { stage: 'Qualification', count: 4, value: 88000 },
  { stage: 'Proposal', count: 2, value: 325000 },
  { stage: 'Negotiation', count: 1, value: 480000 },
  { stage: 'Won', count: 3, value: 195000 },
];

const leadSourceData = [
  { name: 'LinkedIn', value: 35, color: '#0A66C2' },
  { name: 'Website', value: 28, color: '#2563EB' },
  { name: 'Referral', value: 20, color: '#7C3AED' },
  { name: 'Email', value: 12, color: '#F59E0B' },
  { name: 'Cold Call', value: 5, color: '#EF4444' },
];

const activities = [
  { action: 'New lead added', detail: 'Arjun Sharma from TechWave', time: '5 min ago', color: '#2563EB', icon: '👤' },
  { action: 'Deal won', detail: 'Zenith Analytics — ₹1,95,000', time: '1 hr ago', color: '#10B981', icon: '🎉' },
  { action: 'Lead updated', detail: 'Meena Iyer from GreenBridge', time: '2 hr ago', color: '#F59E0B', icon: '👤' },
  { action: 'Ticket raised', detail: 'TKT-004 — CloudForge integration', time: '3 hr ago', color: '#EF4444', icon: '🎫' },
  { action: 'Meeting scheduled', detail: 'TechWave demo — Apr 25', time: '5 hr ago', color: '#7C3AED', icon: '📅' },
];

const quickActions = [
  { label: 'Add Lead', color: 'bg-blue-600', icon: <Plus size={16} /> },
  { label: 'New Deal', color: 'bg-indigo-600', icon: <Handshake size={16} /> },
  { label: 'Add Task', color: 'bg-amber-500', icon: <Zap size={16} /> },
];

export default function Dashboard() {
  const { themeMode }  = useSelector(s => s.ui);
  const currentUser    = useSelector(s => s.auth.currentUser);
  const leads          = useSelector(s => s.leads.items);
  const clients        = useSelector(s => s.clients.items);
  const deals          = useSelector(s => s.deals.items);
  const tickets        = useSelector(s => s.tickets.items);
  const projects       = useSelector(s => s.projects.items);
  const tasks          = useSelector(s => s.tasks.items);
  const leaveRequests  = useSelector(s => s.leave.items);
  const users          = useSelector(s => s.users.items);

  const isAdmin        = currentUser?.role === 'admin';
  const dark           = themeMode === 'dark';
  const activeDeals    = deals.filter(d => !['Won', 'Lost'].includes(d.stage)).length;
  const openTickets    = tickets.filter(t => t.status !== 'Resolved').length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const pendingTasks   = tasks.filter(t => t.status !== 'Done').length;
  const pendingLeaves  = leaveRequests.filter(l => l.status === 'Pending').length;
  const teamSize       = users.filter(u => u.role !== 'admin').length;

  const gridColor = dark ? '#334155' : '#F1F5F9';
  const textColor = dark ? '#94A3B8' : '#64748B';

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Good morning, {currentUser?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {pendingLeaves > 0 && isAdmin && <span className="ml-2 text-amber-500 font-bold">· {pendingLeaves} leave request{pendingLeaves > 1 ? 's' : ''} pending</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map(a => (
            <button 
              key={a.label} 
              className={`${a.color} text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-100`}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Projects" value={activeProjects} icon={<FolderOpen />} color="#2563EB" trend={8} trendLabel="vs last month" />
        <StatCard label="Pending Tasks"   value={pendingTasks}  icon={<CheckSquare />} color="#F59E0B" trend={-3} trendLabel="vs last month" />
        <StatCard label="Team Members"    value={teamSize}       icon={<Users />}   color="#7C3AED" trend={2} trendLabel="this month" />
        <StatCard label="Leave Requests"  value={pendingLeaves}  icon={<CalendarDays />} color="#EF4444" trend={pendingLeaves} trendLabel="awaiting approval" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Activity or My Projects */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          {isAdmin ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800">Recent Activity</h2>
                <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  View all <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-1">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 rounded-2xl transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${a.color}15` }}>
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{a.action}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{a.detail}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-slate-800 mb-6">My Recent Tasks</h2>
              <div className="space-y-3">
                {tasks.filter(t => t.assignee === currentUser?.name && t.status !== 'Done').slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <CheckSquare size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{task.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{task.project}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-blue-50 text-blue-600">{task.status}</span>
                  </div>
                ))}
                {tasks.filter(t => t.assignee === currentUser?.name && t.status !== 'Done').length === 0 && (
                  <p className="text-center py-10 text-slate-300 font-bold text-sm">All caught up! No pending tasks.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Lead Sources or My Leaves */}
        <div className="lg:col-span-12 xl:col-span-4">
          {isAdmin ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col h-full">
              <h2 className="text-xl font-black text-slate-800 mb-1">Lead Sources</h2>
              <p className="text-xs font-medium text-slate-400 mb-6">Origins for this month</p>
              
              <div className="h-[200px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={6} dataKey="value" stroke="none">
                      {leadSourceData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <RTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: '800' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {leadSourceData.map(s => (
                  <div key={s.name} className="flex justify-between items-center group text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="font-bold text-slate-600 uppercase tracking-tight">{s.name}</span>
                    </div>
                    <span className="font-black text-slate-400">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col h-full">
              <h2 className="text-xl font-black text-slate-800 mb-6">Leave Balance</h2>
              <div className="space-y-4">
                {[
                  { label: 'Sick Leave', used: 2, total: 12, color: 'bg-rose-500' },
                  { label: 'Casual Leave', used: 5, total: 12, color: 'bg-blue-500' },
                  { label: 'Earned Leave', used: 0, total: 18, color: 'bg-emerald-500' },
                ].map(l => (
                  <div key={l.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{l.label}</span>
                      <span>{l.used}/{l.total} days</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${l.color}`} style={{ width: `${(l.used / l.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-8">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Upcoming Holiday</p>
                  <p className="text-sm font-bold text-slate-800">May Day — May 01</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Row: Pipeline or Projects */}
      {isAdmin ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-800 mb-6">Deal Pipeline</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealStageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="6 6" stroke={gridColor} vertical={false} />
                <XAxis dataKey="stage" tick={{ fill: textColor, fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor, fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <RTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: '800' }} />
                <Bar dataKey="count" name="Deals" fill="#2563EB" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-slate-800 mb-6">Assigned Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.assignedUsers.includes(currentUser?.id)).slice(0, 3).map(p => (
              <div key={p.id} className="p-5 border border-slate-100 rounded-3xl hover:border-blue-200 transition-colors group">
                <h3 className="font-black text-slate-800 group-hover:text-blue-600 truncate">{p.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.client}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-black text-blue-600">{p.progress}%</span>
                  <div className="flex -space-x-2">
                    {p.assignedUsers.slice(0, 3).map(uid => (
                      <div key={uid} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {projects.filter(p => p.assignedUsers.includes(currentUser?.id)).length === 0 && (
              <div className="md:col-span-3 text-center py-10 text-slate-300 font-bold">No projects assigned to you yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
