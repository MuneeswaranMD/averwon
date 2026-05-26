import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  CheckSquare, 
  Clock, 
  Calendar, 
  Video, 
  CalendarDays, 
  Bell, 
  File, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronDown,
  ChevronRight,
  Briefcase,
  History,
  Wrench,
  MessageSquare,
  TrendingUp,
  ClipboardList,
  Shield
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  sidebarBg: '#0F172A', // Premium sleeker darker slate        
  sidebarText: '#94A3B8',
  sidebarHover: 'rgba(255,255,255,0.06)',
  sidebarActive: '#FFFFFF',
  sidebarActiveTxt: '#FFFFFF',
  sidebarActiveBg: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  topbarBg: '#FFFFFF',
  topbarBorder: '#E2E8F0',
  pageBg: '#F8FAFC',
  text: '#1E293B',
  muted: '#64748B',
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  red: '#EF4444',
  drawerW: 260,
};

/* ─── Grouped Nav structure ─── */
const MENU_SECTIONS = [
  {
    title: 'Core Portal',
    isCollapsible: false,
    items: [
      { label: 'Dashboard',      path: '/employee/dashboard',     icon: LayoutDashboard, permission: 'Dashboard' },
      { label: 'My Profile',     path: '/employee/profile',        icon: User, permission: 'My Profile' },
      { label: 'My Projects',    path: '/employee/projects',       icon: Briefcase, permission: 'My Projects' },
      { label: 'My Tasks',       path: '/employee/tasks',          icon: CheckSquare, permission: 'My Tasks' },
      { label: 'Attendance',     path: '/employee/attendance',     icon: Clock, permission: 'Attendance' },
      { label: 'Leave Requests', path: '/employee/leaves',         icon: Calendar, permission: 'Leave Requests' },
      { label: 'Meetings',       path: '/employee/meetings',       icon: Video, permission: 'Meetings' },
      { label: 'Activity Logs',  path: '/employee/activities',     icon: History, permission: 'Activity Logs' },
      { label: 'Live Chat',      path: '/employee/chat',           icon: MessageSquare, permission: 'Live Chat' },
      { label: 'Tools',          path: '/employee/tools',          icon: Wrench, permission: 'Tools' },
      { label: 'Calendar',       path: '/employee/calendar',       icon: CalendarDays, permission: 'Calendar' },
      { label: 'Notifications',  path: '/employee/notifications',  icon: Bell, permission: 'Notifications' },
      { label: 'Documents',      path: '/employee/documents',      icon: File, permission: 'Documents' },
      { label: 'Personal Settings', path: '/employee/settings',    icon: Settings, permission: 'Settings' },
    ]
  },
  {
    title: 'Sales & CRM',
    isCollapsible: true,
    permissionGroup: ['Sales Dashboard', 'Leads', 'Deals'],
    items: [
      { label: 'Sales Dashboard', path: '/employee/sales/dashboard', icon: TrendingUp, permission: 'Sales Dashboard' },
      { label: 'Leads',           path: '/employee/sales/leads',     icon: ClipboardList, permission: 'Leads' },
      { label: 'Deals',           path: '/employee/sales/deals',     icon: Briefcase, permission: 'Deals' },
    ]
  },
  {
    title: 'System',
    isCollapsible: true,
    permissionGroup: ['Admins', 'Settings'],
    items: [
      { label: 'Admins',          path: '/employee/admin/admins',    icon: Shield, permission: 'Admins' },
      { label: 'System Settings', path: '/employee/admin/settings',  icon: Settings, permission: 'Settings' },
    ]
  }
];

// Flat helper for label retrieval
const flatNavItems = MENU_SECTIONS.flatMap(sec => sec.items);

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const navigate = useNavigate();
  const location = useLocation();

  // Collapsed states for dynamic dropdown folders
  const [collapsedSections, setCollapsedSections] = useState(() => {
    const isSalesActive = location.pathname.startsWith('/employee/sales');
    const isSystemActive = location.pathname.startsWith('/employee/admin');
    return {
      'Sales & CRM': !isSalesActive,
      'System': !isSystemActive,
    };
  });

  const toggleSection = (title) => {
    setCollapsedSections(p => ({ ...p, [title]: !p[title] }));
  };

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    const data  = localStorage.getItem('employeeData');
    if (!token || !data) { navigate('/employee/login'); return; }
    
    const parsed = JSON.parse(data);
    setEmployee(parsed);

    // Fetch latest profile status to dynamic update permissions cleanly
    fetch(API_ENDPOINTS.EMPLOYEE_PROFILE, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d && !d.error) {
          setEmployee(d);
          localStorage.setItem('employeeData', JSON.stringify(d));
        }
      })
      .catch(err => console.error('Error syncing profile:', err));

    // Fetch global system settings (public to logged-in employees for branding updates)
    fetch(API_ENDPOINTS.EMPLOYEE_ADMIN_SETTINGS, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d && !d.error) setSystemSettings(d);
      })
      .catch(err => console.error('Error loading brand config:', err));

    const onResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    if (window.innerWidth < 900) setSidebarOpen(false);
    return () => window.removeEventListener('resize', onResize);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeData');
    navigate('/employee/login');
  };

  const currentLabel = flatNavItems.find(n => n.path === location.pathname)?.label || 'Portal';

  // Allowed pages fallback array ensuring maximum backwards compatibility
  const allowedPages = employee?.allowedPages || [
    'Dashboard', 'My Profile', 'My Projects', 'My Tasks', 'Attendance', 
    'Leave Requests', 'Meetings', 'Activity Logs', 'Live Chat', 'Tools', 
    'Calendar', 'Notifications', 'Documents', 'Settings'
  ];

  /* ─── Sidebar Rendering ─── */
  const sidebar = (
    <div style={{
      width: Z.drawerW,
      minHeight: '100vh',
      background: Z.sidebarBg,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 1200,
      boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
      transition: 'transform 0.25s ease',
      transform: sidebarOpen ? 'translateX(0)' : `translateX(-${Z.drawerW}px)`,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '22px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <img src="/logo.png" alt="Logo" style={{ height: 32, objectFit: 'contain' }} />
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ 
            color: '#FFFFFF', 
            fontWeight: 800, 
            fontSize: 14, 
            letterSpacing: 1,
            textTransform: 'uppercase',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {systemSettings?.companyName || 'AVERQON'}
          </div>
          <div style={{ color: Z.sidebarText, fontSize: 9, marginTop: 1, fontWeight: 600, opacity: 0.6, letterSpacing: 0.5 }}>
            Portal Control
          </div>
        </div>
      </div>

      {/* Nav items list */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {MENU_SECTIONS.map((section, sIdx) => {
          // Check access at group level for collapsible items
          if (section.isCollapsible) {
            const hasAnyAccess = section.permissionGroup.some(p => allowedPages.includes(p));
            if (!hasAnyAccess) return null; // Hide the entire folder if none are allowed
          }

          // Filter section sub-items
          const visibleItems = section.items.filter(item => {
            return !item.permission || allowedPages.includes(item.permission);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} style={{ marginBottom: 16 }}>
              {/* Folder header or Section Separator */}
              {section.isCollapsible ? (
                <button
                  onClick={() => toggleSection(section.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    marginBottom: 6,
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                >
                  <span>{section.title}</span>
                  {!collapsedSections[section.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div style={{
                  padding: '4px 10px',
                  marginBottom: 6,
                  color: '#475569',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}>
                  {section.title}
                </div>
              )}

              {/* Items in section */}
              {(!section.isCollapsible || !collapsedSections[section.title]) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: section.isCollapsible ? 6 : 0 }}>
                  {visibleItems.map(item => {
                    const active = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); if (isMobile) setSidebarOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 8,
                          border: 'none',
                          cursor: 'pointer',
                          background: active ? Z.sidebarActiveBg : 'transparent',
                          color: active ? Z.sidebarActive : Z.sidebarText,
                          fontWeight: active ? 600 : 400,
                          fontSize: 13.5,
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          boxShadow: active ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = Z.sidebarHover; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, flexShrink: 0 }}>
                          {React.createElement(item.icon, { size: 17, color: active ? '#FFFFFF' : Z.sidebarText })}
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                        {active && (
                          <div style={{
                            marginLeft: 'auto',
                            width: 4, height: 16,
                            borderRadius: 4,
                            background: '#FFFFFF',
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User profile section at the bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 12px', background: 'rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: Z.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
          }}>
            {employee?.name?.charAt(0) || 'E'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {employee?.name || 'Employee'}
            </div>
            <div style={{ color: Z.sidebarText, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {employee?.designation || 'Staff'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '8px 10px',
            borderRadius: 6, border: 'none',
            cursor: 'pointer',
            background: 'transparent', color: '#FDA4AF',
            fontSize: 12.5, fontWeight: 500,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(253,164,175,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={14} /> Logout Portal
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: Z.pageBg, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      {sidebar}

      {/* Overlay on mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1100, backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (sidebarOpen ? Z.drawerW : 0),
        transition: 'margin-left 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Top Header bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 1000,
          height: 60,
          background: Z.topbarBg,
          borderBottom: `1px solid ${Z.topbarBorder}`,
          display: 'flex', alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
        }}>
          {/* Toggle sidebar button and page heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${Z.topbarBorder}`,
                background: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: Z.muted,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = Z.pageBg}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <Menu size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {!sidebarOpen && <img src="/logo.png" alt="Logo" style={{ height: 24, objectFit: 'contain' }} />}
              <span style={{ fontWeight: 800, fontSize: 16, color: Z.text, letterSpacing: -0.2 }}>
                {currentLabel}
              </span>
            </div>
          </div>

          {/* User notification bell & details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Notifications panel toggle button */}
            <button 
              onClick={() => navigate('/employee/notifications')}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${Z.topbarBorder}`, background: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = Z.pageBg}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <Bell size={17} color={Z.muted} />
              <span style={{
                position: 'absolute', top: 5, right: 5,
                width: 7, height: 7, borderRadius: '50%',
                background: Z.red, border: '1.5px solid white',
              }} />
            </button>

            {/* Profile trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 10px 4px 4px',
                  border: `1px solid ${Z.topbarBorder}`, borderRadius: 8,
                  background: '#fff', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = Z.accent}
                onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.borderColor = Z.topbarBorder; }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: Z.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
                }}>
                  {employee?.name?.charAt(0) || 'E'}
                </div>
                <div style={{ textAlign: 'left', display: isMobile ? 'none' : 'block' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: Z.text, lineHeight: 1.2 }}>{employee?.name || 'Employee'}</div>
                  <div style={{ fontSize: 10.5, color: Z.muted }}>{employee?.department || ''}</div>
                </div>
                <ChevronDown size={13} color={Z.muted} />
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 48, right: 0,
                  background: '#fff', borderRadius: 10,
                  border: `1px solid ${Z.topbarBorder}`,
                  boxShadow: '0 8px 30px rgba(15,23,42,0.15)',
                  minWidth: 190, zIndex: 2000, overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${Z.topbarBorder}`, background: '#F8FAFC' }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: Z.text }}>{employee?.name}</div>
                    <div style={{ fontSize: 11, color: Z.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee?.email}</div>
                  </div>
                  {[
                    { label: 'My Profile', path: '/employee/profile', icon: User },
                    { label: 'Personal Settings',   path: '/employee/settings', icon: Settings },
                  ].map(item => (
                    <button key={item.path} onClick={() => { navigate(item.path); setProfileOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13.5, color: Z.text, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = Z.pageBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {React.createElement(item.icon, { size: 15, color: Z.muted })}
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${Z.topbarBorder}` }}>
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13.5, color: Z.red, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={15} /> Logout Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested View Routing Outlet */}
        <main style={{ flex: 1, padding: isMobile ? '16px' : '28px 28px 40px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
