import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { toggleTheme } from '../store';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Moon, 
  Sun, 
  ChevronRight, 
  ChevronDown,
  User,
  Settings,
  LogOut,
  Command
} from 'lucide-react';
import { UserAvatar, Badge } from './ui';

const breadcrumbMap = {
  '/': ['Dashboard'],
  '/leads': ['CRM', 'Leads'],
  '/clients': ['CRM', 'Clients'],
  '/deals': ['CRM', 'Deals'],
  '/projects': ['Work', 'Projects'],
  '/tasks': ['Work', 'Tasks'],
  '/invoices': ['Finance', 'Invoices'],
  '/payments': ['Finance', 'Payments'],
  '/tickets': ['Support', 'Tickets'],
  '/team': ['Organization', 'Team'],
  '/calendar': ['Work', 'Calendar'],
  '/reports': ['Analytics', 'Reports'],
  '/settings': ['System', 'Settings'],
};

export default function Topbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const crumbs = breadcrumbMap[location.pathname] || ['Dashboard'];

  return (
    <header className="sticky top-0 z-[1100] h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 overflow-hidden">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i > 0 && <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
            <span className={`text-[12px] whitespace-nowrap transition-colors tracking-tight ${
              i === crumbs.length - 1 
                ? 'font-black text-slate-800' 
                : 'font-bold text-slate-400'
            }`}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 border border-slate-100 rounded-xl px-3 py-1.5 w-64 group focus-within:ring-2 focus-within:ring-indigo-600/10 focus-within:border-indigo-600/30 transition-all">
          <Search size={16} className="text-slate-400 group-focus-within:text-indigo-600" />
          <input 
            type="text" 
            placeholder="Search console..." 
            className="bg-transparent border-none outline-none text-[13px] font-medium text-slate-600 placeholder:text-slate-400 w-full"
          />
          <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded-md border border-slate-100 shadow-sm">
            <Command size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400">K</span>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center gap-1 border-x border-slate-100 px-4">
          <button 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all relative"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/10" />
          </button>
          
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <MessageSquare size={19} />
          </button>

          <button 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
            onClick={() => dispatch(toggleTheme())}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-100/50 transition-all group"
          >
            <div className="relative">
              <UserAvatar name="Admin User" size={36} />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="hidden sm:block text-left pr-2">
              <p className="text-[12px] font-black text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">Admin User</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin</p>
            </div>
            <ChevronDown size={14} className={`text-slate-300 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-indigo-100/50 p-2 z-20 animate-in fade-in zoom-in duration-200">
                <div className="p-4 mb-2">
                  <p className="text-[13px] font-black text-slate-800 tracking-tight">Admin User</p>
                  <p className="text-[11px] font-medium text-slate-400">admin@averqon.ai</p>
                </div>
                <div className="space-y-1">
                  <button className="flex items-center gap-3 w-full p-3 rounded-2xl text-[12px] font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all">
                      <User size={16} />
                    </div>
                    Account Profile
                  </button>
                  <Link 
                    to="/settings"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 w-full p-3 rounded-2xl text-[12px] font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all">
                      <Settings size={16} />
                    </div>
                    Workspace Settings
                  </Link>
                  <hr className="my-2 border-slate-50" />
                  <button className="flex items-center gap-3 w-full p-3 rounded-2xl text-[12px] font-black text-rose-500 hover:bg-rose-50 transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-rose-500 shadow-sm transition-all">
                      <LogOut size={16} />
                    </div>
                    Sign Out Account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Notifications Dropdown (Simplified) */}
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-indigo-100/50 p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 flex items-center justify-between">
                  <h3 className="text-[13px] font-black text-slate-800 tracking-tight">Recent Activity</h3>
                  <span className="text-[10px] font-black px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">3 NEW</span>
                </div>
                <div className="space-y-4 p-4">
                  {[
                    { title: 'New lead assigned', time: '5m', color: 'bg-blue-500' },
                    { title: 'Deal pipeline updated', time: '1h', color: 'bg-emerald-500' },
                    { title: 'Ticket escalated', time: '2h', color: 'bg-rose-500' },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className={`w-1.5 h-auto rounded-full ${n.color} transition-all group-hover:w-2`} />
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-slate-700 leading-none">{n.title}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1">{n.time} ago • Activity Alert</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-2 p-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] border-t border-slate-50 hover:text-indigo-600 transition-colors">
                  View Notification Center
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
