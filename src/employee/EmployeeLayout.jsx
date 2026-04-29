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
  Briefcase,
  History,
  Wrench
} from 'lucide-react';

const Z = {
  sidebarBg: '#1E293B',        
  sidebarText: '#94A3B8',
  sidebarHover: 'rgba(255,255,255,0.08)',
  sidebarActive: '#FFFFFF',
  sidebarActiveTxt: '#FFFFFF',
  sidebarActiveBg: '#2563EB',
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

/* ─── Nav items ──────────────────────────────────────────────────── */
const NAV = [
  { label: 'Dashboard',      path: '/employee/dashboard',     icon: LayoutDashboard },
  { label: 'My Profile',     path: '/employee/profile',        icon: User },
  { label: 'My Projects',    path: '/employee/projects',       icon: Briefcase },
  { label: 'My Tasks',       path: '/employee/tasks',          icon: CheckSquare },
  { label: 'Attendance',     path: '/employee/attendance',     icon: Clock },
  { label: 'Leave Requests', path: '/employee/leaves',         icon: Calendar },
  { label: 'Meetings',       path: '/employee/meetings',       icon: Video },
  { label: 'Activity Logs',  path: '/employee/activities',     icon: History },
  { label: 'Tools',          path: '/employee/tools',          icon: Wrench },
  { label: 'Calendar',       path: '/employee/calendar',       icon: CalendarDays },
  { label: 'Notifications',  path: '/employee/notifications',  icon: Bell },
  { label: 'Documents',      path: '/employee/documents',      icon: File },
  { label: 'Settings',       path: '/employee/settings',       icon: Settings },
];

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    const data  = localStorage.getItem('employeeData');
    if (!token || !data) { navigate('/employee/login'); return; }
    setEmployee(JSON.parse(data));

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

  const currentLabel = NAV.find(n => n.path === location.pathname)?.label || 'Portal';

  /* ─── Sidebar ───────────────────────────────────────────────── */
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
      boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
      transition: 'transform 0.25s ease',
      transform: sidebarOpen ? 'translateX(0)' : `translateX(-${Z.drawerW}px)`,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <img src="/logo.png" alt="Averqon" style={{ height: 32, objectFit: 'contain' }} />
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>AVERQON</div>
          <div style={{ color: Z.sidebarText, fontSize: 10, marginTop: 1, fontWeight: 600, opacity: 0.7 }}>Employee Portal</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(item => {
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
                marginBottom: 2,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? Z.sidebarActiveBg : 'transparent',
                color: active ? '#FFFFFF' : Z.sidebarText,
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = Z.sidebarHover; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, flexShrink: 0 }}>
                {React.createElement(item.icon, { size: 18, color: active ? '#FFFFFF' : Z.sidebarText })}
              </span>
              <span>{item.label}</span>
              {active && (
                <div style={{
                  marginLeft: 'auto',
                  width: 3, height: 20,
                  borderRadius: 4,
                  background: Z.accent,
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: Z.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
          }}>
            {employee?.name?.charAt(0) || 'E'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {employee?.name || 'Employee'}
            </div>
            <div style={{ color: Z.sidebarText, fontSize: 11 }}>{employee?.designation || 'Staff'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '9px 12px',
            borderRadius: 8, border: 'none',
            cursor: 'pointer',
            background: 'transparent', color: '#FF6B6B',
            fontSize: 14, fontWeight: 500,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  const mainLeft = sidebarOpen ? Z.drawerW : 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: Z.pageBg, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      {sidebar}

      {/* Overlay on mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1100 }}
        />
      )}

      {/* Main area */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (sidebarOpen ? Z.drawerW : 0),
        transition: 'margin-left 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 1000,
          height: 60,
          background: Z.topbarBg,
          borderBottom: `1px solid ${Z.topbarBorder}`,
          display: 'flex', alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          {/* Left: hamburger + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${Z.topbarBorder}`,
                background: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: Z.muted,
              }}
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {!sidebarOpen && <img src="/logo.png" alt="Averqon" style={{ height: 24, objectFit: 'contain' }} />}
              <span style={{ fontWeight: 700, fontSize: 16, color: Z.text }}>{currentLabel}</span>
            </div>
          </div>

          {/* Right: actions + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Notification bell */}
            <button 
              onClick={() => navigate('/employee/notifications')}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${Z.topbarBorder}`, background: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}
            >
              <Bell size={18} color={Z.muted} />
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 8, height: 8, borderRadius: '50%',
                background: Z.red, border: '1.5px solid white',
              }} />
            </button>

            {/* Avatar dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 10px 4px 4px',
                  border: `1px solid ${Z.topbarBorder}`, borderRadius: 8,
                  background: '#fff', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: Z.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                }}>
                  {employee?.name?.charAt(0) || 'E'}
                </div>
                <div style={{ textAlign: 'left', display: isMobile ? 'none' : 'block' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: Z.text, lineHeight: 1.2 }}>{employee?.name || 'Employee'}</div>
                  <div style={{ fontSize: 11, color: Z.muted }}>{employee?.department || ''}</div>
                </div>
                <ChevronDown size={14} color={Z.muted} />
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 48, right: 0,
                  background: '#fff', borderRadius: 10,
                  border: `1px solid ${Z.topbarBorder}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  minWidth: 180, zIndex: 2000, overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${Z.topbarBorder}` }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: Z.text }}>{employee?.name}</div>
                    <div style={{ fontSize: 12, color: Z.muted }}>{employee?.email}</div>
                  </div>
                  {[
                    { label: 'My Profile', path: '/employee/profile', icon: User },
                    { label: 'Settings',   path: '/employee/settings', icon: Settings },
                  ].map(item => (
                    <button key={item.path} onClick={() => { navigate(item.path); setProfileOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none', background: 'none', textAlign: 'left', fontSize: 14, color: Z.text, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = Z.pageBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {React.createElement(item.icon, { size: 16, color: Z.muted })}
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${Z.topbarBorder}` }}>
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', fontSize: 14, color: Z.red, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 28px 40px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
