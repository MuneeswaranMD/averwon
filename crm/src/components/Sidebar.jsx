import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store';
import { 
  LayoutDashboard, Users, Building2, Handshake, FolderOpen, 
  CheckSquare, Ticket, Groups, Calendar, BarChart3, Settings,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const EXPANDED_W = 265;
const COLLAPSED_W = 75;

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', badge: null },
  { label: 'Leads', icon: <Users size={20} />, path: '/leads', badge: 6 },
  { label: 'Clients', icon: <Building2 size={20} />, path: '/clients', badge: null },
  { label: 'Deals', icon: <Handshake size={20} />, path: '/deals', badge: null },
  { label: 'Projects', icon: <FolderOpen size={20} />, path: '/projects', badge: null },
  { label: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks', badge: 3 },
  { label: 'Tickets', icon: <Ticket size={20} />, path: '/tickets', badge: 2 },
  { label: 'Team', icon: <Zap size={20} />, path: '/team', badge: null },
  { label: 'Calendar', icon: <Calendar size={20} />, path: '/calendar', badge: null },
  { label: 'Reports', icon: <BarChart3 size={20} />, path: '/reports', badge: null },
  { label: 'Settings', icon: <Settings size={20} />, path: '/settings', badge: null },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div 
      className={`fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out border-r z-50 flex flex-col bg-white border-slate-200`}
      style={{ width: sidebarOpen ? EXPANDED_W : COLLAPSED_W }}
    >
      {/* Brand */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100 min-h-[72px] relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg shadow-blue-100">
          A
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-black text-slate-800 leading-none truncate">averqon CRM</h1>
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
        {navItems.map((item) => {
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

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-lg shadow-emerald-100">
            AD
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-800 truncate">Admin User</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
