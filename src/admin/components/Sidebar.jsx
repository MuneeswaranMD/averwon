import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Search, Briefcase, Headset, Wallet, 
  Target, Shield, ChevronDown, ChevronLeft, ChevronRight, LogOut,
  BadgeCheck, GraduationCap, Clock, Palmtree, CreditCard, UserCheck,
  FolderOpen, CheckSquare, Video, Ticket, TrendingUp, ReceiptText,
  Settings, ShieldAlert
} from 'lucide-react';

const averqonLogo = '/logo.png';

const COLLAPSED_W = 72;
const EXPANDED_W = 260;

const navConfig = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard size={22} />,
    path: '/admin',
  },
  {
    name: 'HR Management',
    icon: <Users size={22} />,
    items: [
      { name: 'Employees', path: '/admin/resources/Employee', icon: <BadgeCheck size={18} /> },
      { name: 'Interns', path: '/admin/resources/Intern', icon: <GraduationCap size={18} /> },
      { name: 'Attendance', path: '/admin/resources/Attendance', icon: <Clock size={18} /> },
      { name: 'Leave Requests', path: '/admin/resources/LeaveRequest', icon: <Palmtree size={18} /> },
      { name: 'Payroll', path: '/admin/resources/Payroll', icon: <CreditCard size={18} /> },
    ],
  },
  {
    name: 'Recruitment',
    icon: <Search size={22} />,
    items: [
      { name: 'Job Postings', path: '/admin/resources/JobPosting', icon: <Briefcase size={18} /> },
      { name: 'Applications', path: '/admin/resources/JobApplication', icon: <UserCheck size={18} /> },
    ],
  },
  {
    name: 'Operations',
    icon: <Briefcase size={22} />,
    items: [
      { name: 'Projects', path: '/admin/resources/Project', icon: <FolderOpen size={18} /> },
      { name: 'Tasks', path: '/admin/resources/Task', icon: <CheckSquare size={18} /> },
      { name: 'Meetings', path: '/admin/resources/Meeting', icon: <Video size={18} /> },
    ],
  },
  {
    name: 'Support',
    icon: <Headset size={22} />,
    items: [
      { name: 'Tickets', path: '/admin/resources/Ticket', icon: <Ticket size={18} /> },
    ],
  },
  {
    name: 'Finance',
    icon: <Wallet size={22} />,
    items: [
      { name: 'Revenue', path: '/admin/resources/Revenue', icon: <TrendingUp size={18} /> },
      { name: 'Invoices', path: '/admin/resources/Invoice', icon: <ReceiptText size={18} /> },
      { name: 'Bills', path: '/admin/resources/Bill', icon: <CreditCard size={18} /> },
    ],
  },
  {
    name: 'Sales & CRM',
    icon: <Target size={22} />,
    items: [
      { name: 'Dashboard', path: '/admin/sales-dashboard', icon: <LayoutDashboard size={18} /> },
      { name: 'Leads', path: '/admin/sales/leads', icon: <UserCheck size={18} /> },
      { name: 'Deals', path: '/admin/sales/deals', icon: <Briefcase size={18} /> },
    ],
  },
  {
    name: 'System',
    icon: <Shield size={22} />,
    items: [
      { name: 'Admins', path: '/admin/system/admins', icon: <ShieldAlert size={18} /> },
      { name: 'Settings', path: '/admin/system/settings', icon: <Settings size={18} /> },
    ],
  }
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    window.location.href = '/admin/logout';
  };

  return (
    <div 
      className="h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 shadow-sm"
      style={{ width: isCollapsed ? COLLAPSED_W : EXPANDED_W }}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100 h-20">
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 invisible' : 'opacity-100'}`}>
          <img src={averqonLogo} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-xl text-slate-800 tracking-tight">Averqon</span>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 scrollbar-hide px-3">
        <nav className="space-y-1">
          {navConfig.map((group) => (
            <div key={group.name}>
              {group.items ? (
                <>
                  <button
                    onClick={() => toggleMenu(group.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                      ${openMenus[group.name] ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                  >
                    <span className={`${openMenus[group.name] ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`}>
                      {group.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-semibold">{group.name}</span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${openMenus[group.name] ? 'rotate-180' : ''}`} 
                        />
                      </>
                    )}
                  </button>
                  
                  {!isCollapsed && openMenus[group.name] && (
                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-blue-100 pl-2">
                      {group.items.map((item) => (
                        <a
                          key={item.name}
                          href={item.path}
                          className="flex items-center gap-3 p-2.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all text-sm font-medium"
                        >
                          <span className="text-slate-300">{item.icon}</span>
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={group.path}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all group"
                >
                  <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
                    {group.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm font-semibold">{group.name}</span>
                  )}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            M
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">Munees Waran</p>
              <p className="text-[11px] text-slate-500 font-medium">Super Admin</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 font-bold text-sm transition-all shadow-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
