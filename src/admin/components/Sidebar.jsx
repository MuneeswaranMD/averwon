import React, { useState } from 'react';

// ── Icons (Pure SVG for 100% compatibility) ──────────────────────────────────
const Icon = {
  HR: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Recruit: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Ops: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  Supp: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  Fin: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  Sales: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>,
  Sys: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>,
  Dash: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  Down: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>,
  Right: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>,
  Out: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
};

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  bg: '#F8FAFC',
  white: '#FFFFFF',
  border: '#E5E7EB',
  primary: '#2563EB',
  primaryLight: '#EEF4FF',
  text: '#111827',
  textMuted: '#6B7280',
  textDim: '#9CA3AF',
};

const Sidebar = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({ 'HR Management': true, 'Operations': true });

  const toggleSection = (name) => {
    setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const nav = [
    {
      name: 'HR Management', icon: Icon.HR(),
      items: [
        { name: 'Employees', path: '/admin/resources/Employee' },
        { name: 'Interns', path: '/admin/resources/Intern' },
        { name: 'Attendance', path: '/admin/resources/Attendance' },
        { name: 'Leave Requests', path: '/admin/resources/LeaveRequest' },
        { name: 'Payroll', path: '/admin/resources/Payroll' },
      ]
    },
    {
      name: 'Recruitment', icon: Icon.Recruit(),
      items: [
        { name: 'Job Postings', path: '/admin/resources/JobPosting' },
        { name: 'Applications', path: '/admin/resources/JobApplication' },
      ]
    },
    {
      name: 'Operations', icon: Icon.Ops(),
      items: [
        { name: 'Projects', path: '/admin/resources/Project' },
        { name: 'Tasks', path: '/admin/resources/Task' },
        { name: 'Meetings', path: '/admin/resources/Meeting' },
        { name: 'Calendar', path: '#' },
        { name: 'Team Activity', path: '#' },
      ]
    },
    {
      name: 'Support', icon: Icon.Supp(),
      items: [
        { name: 'Tickets', path: '/admin/resources/Ticket' },
        { name: 'Live Chat', path: '#' },
      ]
    },
    {
      name: 'Finance', icon: Icon.Fin(),
      items: [
        { name: 'Revenue', path: '/admin/resources/Finance' },
        { name: 'Invoices', path: '#' },
        { name: 'Bills', path: '#' },
      ]
    },
    {
      name: 'Sales', icon: Icon.Sales(),
      items: [
        { name: 'Leads', path: '/admin/resources/ClientRequest' },
        { name: 'Deals', path: '#' },
      ]
    },
    {
      name: 'System', icon: Icon.Sys(),
      items: [
        { name: 'Settings', path: '#' },
        { name: 'Admin Account', path: '/admin/resources/Manager' },
      ]
    }
  ];

  const currentPath = window.location.pathname;

  return (
    <div style={{
      width: isCollapsed ? '72px' : '260px',
      height: '100vh',
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.3s ease',
      position: 'relative',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* ── Brand ── */}
      <div style={{ padding: isCollapsed ? '24px 0' : '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', borderBottom: `1px solid ${C.border}`, marginBottom: '12px' }}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ position: 'absolute', right: '-12px', top: '24px', width: '24px', height: '24px', borderRadius: '50%', background: C.white, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', zIndex: 10 }}>
          {isCollapsed ? Icon.Right(12) : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>}
        </button>
        <div style={{ width: isCollapsed ? '40px' : '52px', height: isCollapsed ? '40px' : '52px', marginBottom: isCollapsed ? 0 : '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
        </div>
        {!isCollapsed && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: C.text }}>averqon HRMS</h1>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: C.textMuted, fontWeight: 500 }}>Smart Business Management</p>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <a href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', color: currentPath === '/admin' ? C.primary : C.text, background: currentPath === '/admin' ? C.white : 'transparent', border: `1px solid ${currentPath === '/admin' ? C.border : 'transparent'}`, boxShadow: currentPath === '/admin' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
          {Icon.Dash(18)}
          {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: 600 }}>Dashboard</span>}
        </a>

        {nav.map((sec, idx) => (
          <div key={idx}>
            <button onClick={() => toggleSection(sec.name)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: C.text }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {sec.icon}
                {!isCollapsed && <span style={{ fontSize: '13px', fontWeight: 600 }}>{sec.name}</span>}
              </div>
              {!isCollapsed && <div style={{ transform: openSections[sec.name] ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>{Icon.Down(12)}</div>}
            </button>
            {!isCollapsed && openSections[sec.name] && (
              <div style={{ margin: '4px 0 8px', padding: '4px', background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {sec.items.map((item, i) => {
                  const active = currentPath === item.path;
                  return (
                    <a key={i} href={item.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', color: active ? C.primary : C.textMuted, background: active ? C.primaryLight : 'transparent', fontSize: '13px', fontWeight: active ? 600 : 400 }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: active ? C.primary : C.textDim }} />
                      {item.name}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Profile ── */}
      <div style={{ padding: '16px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="https://ui-avatars.com/api/?name=Admin&background=2563EB&color=fff&size=36" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
        {!isCollapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Admin User</p>
            <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>Super Admin</p>
          </div>
        )}
        {!isCollapsed && <a href="/admin/logout" style={{ color: C.textDim }}>{Icon.Out(16)}</a>}
      </div>
    </div>
  );
};

export default Sidebar;
