import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, switchRole } from '../store';
import { 
  LayoutDashboard, Users, Building2, Handshake, FolderOpen, 
  CheckSquare, Ticket, Calendar, BarChart3, Settings,
  ChevronLeft, ChevronRight, CalendarDays, ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const EXPANDED_W = 265;
const COLLAPSED_W = 75;

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { label: 'Projects',  icon: <FolderOpen size={20} />,     path: '/projects' },
  { label: 'Tasks',     icon: <CheckSquare size={20} />,    path: '/tasks', badge: 3 },
  { label: 'Leave',     icon: <CalendarDays size={20} />,   path: '/leave', badge: null },
  { label: 'Leads',     icon: <Users size={20} />,          path: '/leads', badge: 6 },
  { label: 'Clients',   icon: <Building2 size={20} />,      path: '/clients' },
  { label: 'Deals',     icon: <Handshake size={20} />,      path: '/deals' },
  { label: 'Tickets',   icon: <Ticket size={20} />,         path: '/tickets', badge: 2 },
  { label: 'Calendar',  icon: <Calendar size={20} />,       path: '/calendar' },
  { label: 'Reports',   icon: <BarChart3 size={20} />,      path: '/reports' },
  { label: 'Settings',  icon: <Settings size={20} />,       path: '/settings' },
];

const ROLE_COLORS = {
  admin:    'from-emerald-500 to-teal-600',
  employee: 'from-blue-500 to-indigo-600',
  intern:   'from-purple-500 to-pink-600',
};

const DEMO_USERS = [
  { id: 'u1', name: 'Muneeswaran', role: 'admin'    },
  { id: 'u2', name: 'Priya Nair',  role: 'employee' },
  { id: 'u4', name: 'Ankit Joshi', role: 'intern'   },
];

export default function Sidebar() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const location    = useLocation();
  const { sidebarOpen } = useSelector(s => s.ui);
  const currentUser = useSelector(s => s.auth.currentUser);
  const [showSwitch, setShowSwitch] = useState(false);

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const gradient = ROLE_COLORS[currentUser?.role] || 'from-emerald-500 to-teal-600';
  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD';

  // Filter nav items for non-admins (hide CRM items)
  const isAdmin = currentUser?.role === 'admin';
  const visible = isAdmin
    ? navItems
    : navItems.filter(n => ['/', '/projects', '/tasks', '/leave', '/calendar', '/tickets'].includes(n.path));

  return (
    <div 
      className="fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out border-r z-50 flex flex-col bg-white border-slate-200"
      style={{ width: sidebarOpen ? EXPANDED_W : COLLAPSED_W }}
    >
      {/* Brand */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100 min-h-[72px] relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg shadow-blue-100">
          A
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-black text-slate-800 leading-none truncate">averqon HRMS</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Enterprise Suite</p>
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm z-10"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-hide">
        {visible.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                ${active ? 'bg-blue-50/80 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-500'}
              `}
              title={sidebarOpen ? '' : item.label}
            >
              <div className={`flex-shrink-0 transition-colors ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="flex-1 text-left text-sm font-bold tracking-tight">{item.label}</span>
              )}
              {sidebarOpen && item.badge && (
                <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer with Role Switcher */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 relative">
        <button
          onClick={() => sidebarOpen && setShowSwitch(v => !v)}
          className="flex items-center gap-3 w-full"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-lg`}>
            {initials}
          </div>
          {sidebarOpen && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-black text-slate-800 truncate">{currentUser?.name || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter capitalize">{currentUser?.role || 'admin'}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ${showSwitch ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {/* Demo Role Switcher */}
        {sidebarOpen && showSwitch && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-20">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 pb-2">Switch Demo Role</p>
            {DEMO_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => { dispatch(switchRole(u.id)); setShowSwitch(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${currentUser?.id === u.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${ROLE_COLORS[u.role]} flex items-center justify-center text-white text-[9px] font-black`}>
                  {u.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span>{u.name}</span>
                <span className="ml-auto text-[9px] capitalize text-slate-400">{u.role}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
