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

// ── Color Tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  text: '#1E293B',
  textMuted: '#64748B',
  textSub: '#334155',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate400: '#94A3B8',
  hover: '#F8FAFC',
  activeMenu: '#EFF6FF',
  activeText: '#2563EB',
  footerBg: '#F8FAFC',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
};

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
  },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [hovered, setHovered] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);

  const toggleMenu = (name) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    window.location.href = '/admin/logout';
  };

  const sidebarStyle = {
    width: isCollapsed ? COLLAPSED_W : EXPANDED_W,
    minWidth: isCollapsed ? COLLAPSED_W : EXPANDED_W,
    height: '100vh',
    background: C.bg,
    borderRight: `1px solid ${C.border}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    alignSelf: 'flex-start',
    flexShrink: 0,
    zIndex: 50,
    boxShadow: '1px 0 4px rgba(0,0,0,0.06)',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)',
    overflowX: 'hidden',
  };

  const headerStyle = {
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'space-between',
    borderBottom: `1px solid ${C.borderLight}`,
    height: '64px',
    flexShrink: 0,
  };

  const logoWrapStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    opacity: isCollapsed ? 0 : 1,
    width: isCollapsed ? 0 : 'auto',
    overflow: 'hidden',
    transition: 'opacity 0.2s, width 0.2s',
  };

  const navStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '12px 8px',
  };

  return (
    <div style={sidebarStyle}>
      {/* Inject global keyframes & scrollbar hiding */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .adminjs-sidebar-nav::-webkit-scrollbar { display: none; }
        .adminjs-sidebar-nav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={headerStyle}>
        <div style={logoWrapStyle}>
          <img src={averqonLogo} alt="Logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: C.text, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>Averqon</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            padding: '6px',
            background: 'transparent',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.textMuted,
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className="adminjs-sidebar-nav" style={navStyle}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navConfig.map((group) => {
            const isOpen = openMenus[group.name];
            const isHov = hovered === group.name;
            return (
              <div key={group.name}>
                {group.items ? (
                  <>
                    {/* Group header button */}
                    <button
                      onClick={() => toggleMenu(group.name)}
                      onMouseEnter={() => setHovered(group.name)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: isCollapsed ? '10px 0' : '9px 12px',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        background: isOpen ? C.activeMenu : isHov ? C.slate100 : 'transparent',
                        color: isOpen ? C.activeText : C.textSub,
                        fontFamily: 'inherit',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                    >
                      <span style={{ color: isOpen ? C.primary : isHov ? C.primary : C.slate400, display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s' }}>
                        {group.icon}
                      </span>
                      {!isCollapsed && (
                        <>
                          <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>{group.name}</span>
                          <ChevronDown
                            size={15}
                            style={{
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                              color: C.slate400,
                            }}
                          />
                        </>
                      )}
                    </button>

                    {/* Submenu */}
                    {!isCollapsed && isOpen && (
                      <div style={{ marginTop: 2, marginLeft: 16, paddingLeft: 10, borderLeft: `2px solid ${C.primaryLight}`, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {group.items.map((item) => {
                          const isSubHov = hoveredSub === item.name;
                          return (
                            <a
                              key={item.name}
                              href={item.path}
                              onMouseEnter={() => setHoveredSub(item.name)}
                              onMouseLeave={() => setHoveredSub(null)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 10px',
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                color: isSubHov ? C.primary : C.textMuted,
                                background: isSubHov ? C.primaryLight : 'transparent',
                                textDecoration: 'none',
                                transition: 'background 0.15s, color 0.15s',
                              }}
                            >
                              <span style={{ color: isSubHov ? C.primary : C.slate400, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}>
                                {item.icon}
                              </span>
                              {item.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  /* Direct link (Dashboard) */
                  <a
                    href={group.path}
                    onMouseEnter={() => setHovered(group.name)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: isCollapsed ? '10px 0' : '9px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: 10,
                      color: hovered === group.name ? C.primary : C.textSub,
                      background: hovered === group.name ? C.activeMenu : 'transparent',
                      textDecoration: 'none',
                      transition: 'background 0.15s, color 0.15s',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: hovered === group.name ? C.primary : C.slate400, display: 'flex', alignItems: 'center', transition: 'color 0.15s', flexShrink: 0 }}>
                      {group.icon}
                    </span>
                    {!isCollapsed && <span>{group.name}</span>}
                  </a>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ── Footer / User Profile ────────────────────────────────────────── */}
      <div style={{ padding: '12px', borderTop: `1px solid ${C.border}`, background: C.footerBg, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: C.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
          }}>
            M
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Munees Waran</p>
              <p style={{ margin: 0, fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Super Admin</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '9px 12px',
              borderRadius: 10,
              background: '#fff',
              border: `1px solid ${C.border}`,
              color: C.textSub,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.danger; e.currentTarget.style.borderColor = '#FECACA'; e.currentTarget.style.background = C.dangerLight; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.textSub; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff'; }}
          >
            <LogOut size={15} /> Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
