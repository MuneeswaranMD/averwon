import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  FolderOpen, 
  CheckSquare, 
  IndianRupee, 
  FileText, 
  CalendarCheck, 
  Mail, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Bell, 
  ChevronDown, 
  Video,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Briefcase,
  Layers,
  Wrench,
  Clock,
  Loader2,
  Globe,
  Repeat,
  AlertTriangle,
  ShieldCheck,
  Send,
  ExternalLink,
  Star
} from 'lucide-react';

// ── Clean Corporate Light Theme Color Tokens ──────────────────────────────────────────
const C = {
  bg: '#F8FAFC', // Slate 50 - extremely clean off-white background
  card: '#FFFFFF', // Pure white cards
  border: '#E2E8F0', // Slate 200 - clean border
  borderHover: '#CBD5E1', // Slate 300 - hover border
  text: '#0F172A', // Slate 900 - readable deep slate
  textSub: '#475569', // Slate 600 - secondary text
  textMuted: '#94A3B8', // Slate 400 - muted text
  
  // Standard branding colors (Clean & Non-generic)
  primary: '#2563EB', // Royal Blue
  primaryLight: '#EFF6FF',
  
  indigo: '#4F46E5', // Indigo
  indigoLight: '#EEF2FF',
  
  emerald: '#10B981', // Emerald Green
  emeraldLight: '#ECFDF5',
  
  amber: '#F59E0B', // Warm Amber
  amberLight: '#FFFBEB',
  
  rose: '#EF4444', // Soft Red
  roseLight: '#FEF2F2',
};

// ── Typography ────────────────────────────────────────────────────────────────
const T = {
  h1: { fontSize: '24px', fontWeight: 700, color: C.text, margin: 0, letterSpacing: '-0.02em' },
  h2: { fontSize: '15px', fontWeight: 700, color: C.textSub, margin: 0, letterSpacing: '-0.01em' },
  h3: { fontSize: '13.5px', fontWeight: 600, color: C.text, margin: 0 },
  body: { fontSize: '13px', fontWeight: 400, color: C.textSub, lineHeight: 1.5 },
  small: { fontSize: '11px', fontWeight: 400, color: C.textMuted },
  label: { fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' },
};

// ── Clean Simple Card Wrap ───────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      background: C.card, 
      borderRadius: '12px', 
      border: `1px solid ${C.border}`, 
      padding: '20px',
      transition: 'all 0.2s ease-in-out',
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      ...style 
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = C.borderHover;
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = C.border;
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)';
      }
    }}
  >
    {children}
  </div>
);

// ── SVG: Simple Line Spline Chart ──────────────────────────────────────────────
const LineChart = ({ data, color = C.primary, height = 110 }) => {
  const W = 400, H = height, pad = 10;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y];
  });
  
  let pathD = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpX = pts[i][0] + (pts[i+1][0] - pts[i][0]) / 2;
    pathD += ` C ${cpX} ${pts[i][1]}, ${cpX} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;
  }
  const areaD = `${pathD} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px` }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#ffffff" stroke={color} strokeWidth="1.5" />
      ))}
    </svg>
  );
};

// ── SVG: Simple Bar Chart ──────────────────────────────────────────────────────
const BarChart = ({ data, labels, color = C.primary, height = 110 }) => {
  const W = 400, H = height, gap = 16, pad = 20;
  const max = Math.max(...data) || 1;
  const bw = (W - pad * 2 - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px` }} preserveAspectRatio="none">
      {data.map((v, i) => {
        const bh = ((v / max) * (H - 20));
        const x = pad + i * (bw + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - bh - 10} width={bw} height={bh} rx="3" fill={color} fillOpacity="0.8" />
            {labels && <text x={x + bw / 2} y={H - 1} textAnchor="middle" fontSize="9" fill={C.textMuted} fontWeight="500">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ── SVG: Simple Doughnut Chart ──────────────────────────────────────────────────
const DoughnutChart = ({ data, colors, size = 80 }) => {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size * 0.4, ir = size * 0.28;
  let angle = -Math.PI / 2;
  
  const slices = data.map((v, i) => {
    const sweep = (v / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const xi1 = cx + ir * Math.cos(angle - sweep), yi1 = cy + ir * Math.sin(angle - sweep);
    const xi2 = cx + ir * Math.cos(angle), yi2 = cy + ir * Math.sin(angle);
    return { d: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${ir},${ir} 0 ${large},0 ${xi1},${yi1} Z`, color: colors[i] };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: `${size}px`, height: `${size}px` }}>
      {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} />)}
      <circle cx={cx} cy={cy} r={ir - 1} fill="#FFFFFF" />
    </svg>
  );
};

// ── Simple Badge ────────────────────────────────────────────────────────────────
const Badge = ({ label, type = 'default' }) => {
  const map = {
    success: { bg: C.emeraldLight, color: C.emerald },
    warning: { bg: C.amberLight, color: C.amber },
    danger: { bg: C.roseLight, color: C.rose },
    primary: { bg: C.primaryLight, color: C.primary },
    default: { bg: '#F1F5F9', color: C.textSub },
  };
  const { bg, color } = map[type] || map.default;
  return (
    <span style={{ 
      display: 'inline-block', 
      padding: '2px 8px', 
      borderRadius: '6px', 
      fontSize: '11px', 
      fontWeight: 600, 
      background: bg, 
      color, 
      border: `1px solid ${color}15` 
    }}>
      {label}
    </span>
  );
};

// ── Section Header ──
const SectionHeader = ({ title, action, actionUrl }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
    <h2 style={T.h2}>{title}</h2>
    {action && (
      <button 
        onClick={() => { if (actionUrl) window.location.href = actionUrl; }}
        style={{ 
          border: 'none',
          background: 'none',
          color: C.primary,
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.primaryLight}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        {action}
      </button>
    )}
  </div>
);

// ── Main Dashboard ──
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectTab, setProjectTab] = useState('portfolio');

  // Renewal & Upsell Module States
  const [renewalSearch, setRenewalSearch] = useState('');
  const [renewalStatusFilter, setRenewalStatusFilter] = useState('All');
  const [renewalTypeFilter, setRenewalTypeFilter] = useState('All');
  const [renewalTab, setRenewalTab] = useState('active'); // 'active' | 'history' | 'upsells'
  const [isManualCheckingReminders, setIsManualCheckingReminders] = useState(false);
  const [reminderStatusMsg, setReminderStatusMsg] = useState(null);

  const fetchStats = () => {
    fetch('/api/admin/dashboard-stats')
      .then(r => r.json())
      .then(json => setData(json))
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTriggerReminderCheck = async () => {
    setIsManualCheckingReminders(true);
    setReminderStatusMsg('Dispatching automated email reminder checks...');
    try {
      const res = await fetch('/api/admin/renewals/check-reminders', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setReminderStatusMsg(`✓ Checked ${json.report.evaluatedCount} services. Dispatched ${json.report.adminEmailsSent} admin alert(s) & ${json.report.clientEmailsSent} client notification(s).`);
        fetchStats();
      } else {
        setReminderStatusMsg('Failed to run reminder checks.');
      }
    } catch (err) {
      setReminderStatusMsg('Error executing reminder check.');
    } finally {
      setIsManualCheckingReminders(false);
      setTimeout(() => setReminderStatusMsg(null), 6000);
    }
  };

  const handleConvertUpsellOnDashboard = async (upsell) => {
    if (!confirm(`Convert opportunity "${upsell.title}" into an active Project for ${upsell.clientName}?`)) return;
    try {
      const res = await fetch(`/api/admin/upsells/${upsell._id}/convert-to-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: upsell.title })
      });
      const resData = await res.json();
      if (resData.success) {
        alert(`✓ Opportunity converted to Project "${resData.project.name}"! Status updated to Won.`);
        fetchStats();
      } else {
        alert(resData.error || 'Failed to convert');
      }
    } catch (err) {
      console.error(err);
      alert('Error converting opportunity');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: C.bg }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={36} color={C.primary} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <p style={{ ...T.body, color: C.textMuted }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const projects = data?.projects || [];
  const portfolioProjects = data?.portfolioProjects || [];
  const tasks = data?.tasks || [];
  const finance = data?.finance || [];
  const activities = data?.activities || [];
  const meetings = data?.meetings || [];

  // Services, Renewals & Upsells Data
  const services = data?.services || [];
  const renewalHistory = data?.renewalHistory || [];
  const upsellOpportunities = data?.upsellOpportunities || [];
  const renewalStats = stats?.renewalStats || {
    upcomingRenewalsCount: 0,
    overdueServicesCount: 0,
    expectedRenewalRevenue: 0,
    openUpsellsCount: 0,
    openUpsellsValue: 0,
    revenueForecast: { next30Days: 0, next60Days: 0, next90Days: 0, total90Days: 0 }
  };
  const revenueForecast = renewalStats.revenueForecast || { next30Days: 0, next60Days: 0, next90Days: 0, total90Days: 0 };

  const clientSummary = stats?.clientSummary || {
    totalConfirmedClients: 5,
    totalProjectValue: 82000,
    totalRecordedPayments: 82000,
    recordedOutstandingBalance: 0,
    totalTestimonials: 5,
    testimonialsAwaitingApproval: 5,
    publishedTestimonials: 0,
    upcomingRenewalReviews: 1,
    pendingMaintenanceFollowups: 1,
    clientsList: [],
    projectsList: [],
    testimonialsList: []
  };

  const revenueData = data?.monthlyRevenue?.data || [0, 0, 0, 0, 0, 0];
  const revLabels = data?.monthlyRevenue?.labels || ['', '', '', '', '', ''];
  const attendData = [95, 96, 92, 94, 95, 82, 48];
  const attendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const totalRev = stats.monthlyRevenue || 0;
  const totalExp = finance.filter(f => f.type === 'Expense').reduce((sum, f) => sum + (f.amount || 0), 0) || 35000;

  // Filtered Services
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const filteredServices = services.filter(s => {
    if (renewalSearch) {
      const q = renewalSearch.toLowerCase();
      const matchName = s.serviceName?.toLowerCase().includes(q);
      const matchClient = s.clientName?.toLowerCase().includes(q);
      const matchProject = s.projectName?.toLowerCase().includes(q);
      const matchType = s.serviceType?.toLowerCase().includes(q);
      if (!matchName && !matchClient && !matchProject && !matchType) return false;
    }
    if (renewalTypeFilter !== 'All' && s.serviceType !== renewalTypeFilter) return false;
    if (renewalStatusFilter === 'overdue') {
      const exp = s.expiryDate ? new Date(s.expiryDate) : null;
      return exp && exp < today && s.status !== 'Renewed';
    }
    if (renewalStatusFilter === '7days') {
      const exp = s.expiryDate ? new Date(s.expiryDate) : null;
      if (!exp) return false;
      const days = (exp - today) / 86400000;
      return days >= 0 && days <= 7;
    }
    if (renewalStatusFilter === '30days') {
      const exp = s.expiryDate ? new Date(s.expiryDate) : null;
      if (!exp) return false;
      const days = (exp - today) / 86400000;
      return days >= 0 && days <= 30;
    }
    if (renewalStatusFilter === 'active') {
      return s.status === 'Active' || s.status === 'Pending Renewal';
    }
    return true;
  });

  // Compact Renewal Cards
  const renewalCards = [
    {
      icon: <Repeat />,
      label: 'Upcoming Renewals',
      value: renewalStats.upcomingRenewalsCount || 0,
      sub: 'Expiring in next 30 days',
      badge: '30 Days',
      badgeType: 'warning',
      color: C.amber,
      bg: C.amberLight
    },
    {
      icon: <AlertTriangle />,
      label: 'Overdue Services',
      value: renewalStats.overdueServicesCount || 0,
      sub: (renewalStats.overdueServicesCount || 0) > 0 ? 'Follow-up required' : 'All services current',
      badge: (renewalStats.overdueServicesCount || 0) > 0 ? 'Urgent' : 'All Clear',
      badgeType: (renewalStats.overdueServicesCount || 0) > 0 ? 'danger' : 'success',
      color: C.rose,
      bg: C.roseLight
    },
    {
      icon: <IndianRupee />,
      label: 'Expected Renewal Revenue',
      value: "₹" + (renewalStats.expectedRenewalRevenue || 0).toLocaleString('en-IN'),
      sub: 'Next 90 days projected',
      badge: 'Forecast',
      badgeType: 'success',
      color: C.emerald,
      bg: C.emeraldLight
    },
    {
      icon: <TrendingUp />,
      label: 'Open Upsell Opportunities',
      value: `${renewalStats.openUpsellsCount || 0} (${renewalStats.openUpsellsValue ? '₹' + renewalStats.openUpsellsValue.toLocaleString('en-IN') : '₹0'})`,
      sub: 'Identified client pipeline',
      badge: 'Pipeline',
      badgeType: 'primary',
      color: C.indigo,
      bg: C.indigoLight
    },
  ];

  const statCards = [
    { icon: <Users />, label: 'Active Employees', value: stats.totalEmployees || 0, sub: 'Registered staff', badge: 'Active', badgeType: 'success', color: C.primary, bg: C.primaryLight },
    { icon: <GraduationCap />, label: 'Active Interns', value: stats.totalInterns || 0, sub: 'Assigned interns', badge: 'Active', badgeType: 'primary', color: C.indigo, bg: C.indigoLight },
    { icon: <FolderOpen />, label: 'Active Projects', value: (stats.totalPortfolioProjects || 0) + (stats.activeProjects || 0), sub: `${stats.totalPortfolioProjects || 0} showcase · ${stats.activeProjects || 0} operations`, badge: 'Active', badgeType: 'warning', color: C.amber, bg: C.amberLight },
    { icon: <CheckSquare />, label: 'Pending Tasks', value: stats.pendingTasks || 0, sub: 'Awaiting completion', badge: 'Tasks', badgeType: 'danger', color: C.rose, bg: C.roseLight },
    { icon: <IndianRupee />, label: 'Monthly Revenue', value: "₹" + (stats.monthlyRevenue || 0).toLocaleString('en-IN'), sub: 'Calculated this month', badge: '+18.5%', badgeType: 'success', color: C.emerald, bg: C.emeraldLight },
    { icon: <FileText />, label: 'Pending Invoices', value: "₹" + (stats.pendingPayments || 0).toLocaleString('en-IN'), sub: 'Unbilled payouts', badge: 'Pending', badgeType: 'warning', color: C.amber, bg: C.amberLight },
    { icon: <CalendarCheck />, label: 'Attendance Rate', value: (stats.attendanceRate || 0) + "%", sub: "Today's check-ins", badge: 'Good', badgeType: 'success', color: C.primary, bg: C.primaryLight },
    { icon: <Mail />, label: 'CRM Leads', value: stats.totalLeads || 0, sub: 'Qualified accounts', badge: 'Total', badgeType: 'primary', color: C.indigo, bg: C.indigoLight },
  ];

  const tMetrics = stats.ticketMetrics || { total: 0, open: 0, closed: 0, urgent: 0, pending: 0 };
  const ticketCards = [
    { icon: <Mail />, label: 'Total Tickets', value: tMetrics.total, sub: 'All tickets', color: C.primary, bg: C.primaryLight },
    { icon: <History />, label: 'In Progress', value: tMetrics.pending, sub: 'Assigned', color: C.amber, bg: C.amberLight },
    { icon: <CheckCircle />, label: 'Closed Tickets', value: tMetrics.closed, sub: 'Resolved', color: C.emerald, bg: C.emeraldLight },
    { icon: <AlertCircle />, label: 'Urgent Alert', value: tMetrics.urgent, sub: 'High priority', color: C.rose, bg: C.roseLight },
  ];

  return (
    
    <div style={{ minHeight: '100vh', background: C.bg, padding: '20px 24px', fontFamily: "'Inter', sans-serif", color: C.text, boxSizing: 'border-box' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={T.h1}>Admin Operations Center</h1>
          <p style={{ ...T.body, color: C.textMuted, marginTop: '4px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        {/* Search / Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 12px' }}>
            <Search size={14} color={C.textMuted} style={{ marginRight: 6 }} />
            <input 
              placeholder="Search resource..." 
              style={{ border: 'none', outline: 'none', fontSize: '12.5px', color: C.textSub, background: 'transparent', width: '130px' }} 
            />
          </div>
          
          <button style={{ position: 'relative', background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', color: C.text }}>
            <Bell size={16} color={C.primary} />
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '5px', height: '5px', background: C.rose, borderRadius: '50%' }} />
          </button>
        </div>
      </div>

      {/* ── Stat Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((s, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: s.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: s.color,
              }}>
                {React.cloneElement(s.icon, { size: 18, color: 'currentColor' })}
              </div>
              <Badge label={s.badge} type={s.badgeType} />
            </div>
            
            <p style={{ ...T.label, marginBottom: '4px' }}>{s.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.5px' }}>
              {s.value}
            </p>
            <p style={{ ...T.small, marginTop: '4px' }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="System Shortcuts" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Live chat', desc: 'Message employees', url: '/admin/pages/admin-chat', color: C.primary, icon: <Mail size={16} />, bg: C.primaryLight },
            { label: 'Project assignments', desc: 'Manage crew allocations', url: '/admin/pages/project-assignment', color: C.indigo, icon: <Briefcase size={16} />, bg: C.indigoLight },
            { label: 'Track employees', desc: 'Attendance updates', url: '/admin/pages/employee-tracking', color: C.emerald, icon: <History size={16} />, bg: C.emeraldLight },
            { label: 'System tools', desc: 'Audit configurations', url: '/admin/resources/Tool', color: C.rose, icon: <Wrench size={16} />, bg: C.roseLight },
          ].map((item, i) => (
            <Card key={i} onClick={() => window.location.href = item.url}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ ...T.h3, fontSize: '13.5px' }}>{item.label}</p>
                  <p style={T.small}>{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Ticket metrics ── */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="Complaint Tickets" action="View Tickets" actionUrl="/admin/resources/Ticket" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {ticketCards.map((s, i) => (
            <Card key={i} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {React.cloneElement(s.icon, { size: 16, color: 'currentColor' })}
                </div>
                <div>
                  <p style={{ ...T.label, marginBottom: '2px', fontSize: '9px' }}>{s.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Confirmed Clients & Testimonial Intelligence Hub ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ ...T.h2, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={18} color="#2160FF" fill="#2160FF" /> Confirmed Clients & Testimonial Management
            </h2>
            <p style={{ ...T.small, marginTop: '2px' }}>
              Confirmed client contracts, recorded project payments, and authentic testimonial approval workflows
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => window.location.href = '/admin/resources/ClientFeedback'}
              style={{
                fontSize: '12px',
                padding: '7px 14px',
                background: '#2160FF',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(33,96,255,0.2)'
              }}
            >
              <Star size={14} /> Open Testimonial Manager
            </button>
            <button
              onClick={() => window.location.href = '/admin/resources/Client'}
              style={{
                fontSize: '12px',
                padding: '7px 14px',
                background: '#fff',
                color: C.text,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600
              }}
            >
              <Users size={14} /> View All Clients
            </button>
          </div>
        </div>

        {/* 5 Core Metrics for the Confirmed Client Accounts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <Card style={{ padding: '16px 20px', borderLeft: '4px solid #2160FF' }}>
            <div style={T.label}>Confirmed Clients</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: C.text, marginTop: 4 }}>
              {clientSummary.totalConfirmedClients || 5}
            </div>
            <div style={{ ...T.small, color: C.textMuted, marginTop: 2 }}>Verified accounts</div>
          </Card>

          <Card style={{ padding: '16px 20px', borderLeft: '4px solid #10B981' }}>
            <div style={T.label}>Total Project Value</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
              ₹{(clientSummary.totalProjectValue || 82000).toLocaleString('en-IN')}
            </div>
            <div style={{ ...T.small, color: C.textMuted, marginTop: 2 }}>5 client contracts</div>
          </Card>

          <Card style={{ padding: '16px 20px', borderLeft: '4px solid #059669' }}>
            <div style={T.label}>Recorded Payments</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669', marginTop: 4 }}>
              ₹{(clientSummary.totalRecordedPayments || 82000).toLocaleString('en-IN')}
            </div>
            <div style={{ ...T.small, color: '#059669', fontWeight: 600, marginTop: 2 }}>Fully Paid · ₹0 Outstanding</div>
          </Card>

          <Card style={{ padding: '16px 20px', borderLeft: '4px solid #F59E0B' }}>
            <div style={T.label}>Testimonials Stored</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>
              {clientSummary.totalTestimonials || 5}
            </div>
            <div style={{ ...T.small, color: C.textMuted, marginTop: 2 }}>
              {clientSummary.testimonialsAwaitingApproval || 5} awaiting approval/consent
            </div>
          </Card>

          <Card style={{ padding: '16px 20px', borderLeft: '4px solid #8B5CF6' }}>
            <div style={T.label}>Website Published</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#8B5CF6', marginTop: 4 }}>
              {clientSummary.publishedTestimonials || 0}
            </div>
            <div style={{ ...T.small, color: C.textMuted, marginTop: 2 }}>Consent verified only</div>
          </Card>
        </div>

        {/* Confirmed Clients Quick Table */}
        <Card style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>Confirmed Client Contracts & Testimonial Status</span>
            <span style={{ fontSize: '11px', color: C.textMuted }}>Maintenance follow-up: Aug 19, 2027 · Review: Sept 2027</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, textAlign: 'left', color: C.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '8px 12px' }}>Client & Organization</th>
                  <th style={{ padding: '8px 12px' }}>Project Scope</th>
                  <th style={{ padding: '8px 12px' }}>Package Value</th>
                  <th style={{ padding: '8px 12px' }}>Payment Status</th>
                  <th style={{ padding: '8px 12px' }}>Testimonial Status</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'MaxxJoy Tours', org: 'MaxxJoy Tours', project: 'Travel website development & deployment', value: 10000, status: 'Draft — Client Approval Required', source: 'Suggested Draft', badgeColor: '#F59E0B' },
                  { name: 'RetroStylings', org: 'RetroStylings', project: 'E-commerce website development', value: 20000, status: 'Draft — Client Approval Required', source: 'Suggested Draft', badgeColor: '#F59E0B' },
                  { name: 'Psychologist', org: 'Private Practice', project: 'Psychology website development', value: 15000, status: 'Pending Publication Approval', source: 'Client-Provided', badgeColor: '#8B5CF6' },
                  { name: 'Peeyem Traders', org: 'South Ukkadam, Coimbatore', project: 'Website, Domain, Hosting & Maintenance', value: 22000, status: 'Draft — Client Approval Required', source: 'Suggested Draft', badgeColor: '#F59E0B', amc: 'AMC Review Sept 2027' },
                  { name: 'Dr. R. Murugadoss', org: 'V.S.B. College of Engineering (Prof. & HoD)', project: 'Website redesign & server/domain renewal', value: 15000, status: 'Draft — Client Approval Required', source: 'Suggested Draft', badgeColor: '#F59E0B' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${C.border}15` }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: C.text }}>{row.name}</div>
                      <div style={{ fontSize: '11px', color: C.textMuted }}>{row.org}</div>
                    </td>
                    <td style={{ padding: '12px', color: C.textSub }}>
                      {row.project}
                      {row.amc && <div style={{ fontSize: '10.5px', color: '#2563EB', fontWeight: 600, marginTop: 2 }}>{row.amc}</div>}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: C.text }}>
                      ₹{row.value.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#ECFDF5', color: '#059669' }}>
                        <CheckCircle size={12} /> Fully Paid (₹0 Due)
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: `${row.badgeColor}15`, color: row.badgeColor }}>
                        {row.status}
                      </div>
                      <div style={{ fontSize: '10px', color: C.textMuted, marginTop: 2 }}>{row.source}</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => window.location.href = '/admin/resources/ClientFeedback'}
                        style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#F1F5F9',
                          border: `1px solid ${C.border}`,
                          color: C.text,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── Post-Delivery Services, Renewals & Upsells Hub ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={T.h2}>Post-Delivery Services, Renewals & Upsells</h2>
            <p style={{ ...T.small, marginTop: '2px' }}>
              Track domain, hosting/VPS, AMC maintenance, and client enhancement requests
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleTriggerReminderCheck}
              disabled={isManualCheckingReminders}
              style={{
                border: `1px solid ${C.border}`,
                background: C.card,
                color: C.primary,
                fontSize: '12px',
                fontWeight: 600,
                cursor: isManualCheckingReminders ? 'not-allowed' : 'pointer',
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <Send size={13} />
              <span>{isManualCheckingReminders ? 'Checking Reminders...' : 'Run Reminder Checks'}</span>
            </button>

            <button
              onClick={() => window.location.href = '/admin/resources/ServiceRenewal'}
              style={{
                border: 'none',
                background: C.primary,
                color: C.card,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '6px',
              }}
            >
              Manage Services ↗
            </button>
          </div>
        </div>

        {reminderStatusMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: '#EFF6FF',
            color: '#1E40AF',
            border: '1px solid #BFDBFE',
            fontSize: '12.5px',
            fontWeight: 600,
            marginBottom: '14px'
          }}>
            {reminderStatusMsg}
          </div>
        )}

        {/* 4 Compact Dashboard KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {renewalCards.map((s, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '8px', 
                  background: s.bg, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: s.color,
                }}>
                  {React.cloneElement(s.icon, { size: 18, color: 'currentColor' })}
                </div>
                <Badge label={s.badge} type={s.badgeType} />
              </div>
              
              <p style={{ ...T.label, marginBottom: '4px' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.5px' }}>
                {s.value}
              </p>
              <p style={{ ...T.small, marginTop: '4px' }}>{s.sub}</p>
            </Card>
          ))}
        </div>

        {/* 30 / 60 / 90-Day Revenue Forecast Panel */}
        <Card style={{ marginBottom: '20px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ ...T.h2, fontSize: '14px', color: C.text }}>Revenue Forecast Timeline</h3>
                <Badge label="Projected" type="success" />
              </div>
              <p style={{ ...T.small, marginTop: '2px' }}>
                Expected renewal cash flow across 30, 60, and 90-day intervals
              </p>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: C.emerald }}>
              Total 90-Day Forecast: ₹{(revenueForecast.total90Days || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Next 30 Days</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.amber }}>Immediate</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.text }}>₹{(revenueForecast.next30Days || 0).toLocaleString('en-IN')}</div>
              <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: revenueForecast.total90Days ? `${Math.min(100, (revenueForecast.next30Days / revenueForecast.total90Days) * 100)}%` : '0%', background: C.amber }} />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>31 – 60 Days</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.primary }}>Mid-Term</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.text }}>₹{(revenueForecast.next60Days || 0).toLocaleString('en-IN')}</div>
              <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: revenueForecast.total90Days ? `${Math.min(100, (revenueForecast.next60Days / revenueForecast.total90Days) * 100)}%` : '0%', background: C.primary }} />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>61 – 90 Days</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.indigo }}>Quarterly</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.text }}>₹{(revenueForecast.next90Days || 0).toLocaleString('en-IN')}</div>
              <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: revenueForecast.total90Days ? `${Math.min(100, (revenueForecast.next90Days / revenueForecast.total90Days) * 100)}%` : '0%', background: C.indigo }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Searchable Renewal List, Expiry-Date Filters & History Tabs */}
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setRenewalTab('active')}
                style={{
                  border: 'none',
                  background: renewalTab === 'active' ? C.primaryLight : 'transparent',
                  color: renewalTab === 'active' ? C.primary : C.textSub,
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Repeat size={14} />
                <span>Tracked Services ({filteredServices.length})</span>
              </button>

              <button
                onClick={() => setRenewalTab('history')}
                style={{
                  border: 'none',
                  background: renewalTab === 'history' ? C.primaryLight : 'transparent',
                  color: renewalTab === 'history' ? C.primary : C.textSub,
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <History size={14} />
                <span>Renewal History ({renewalHistory.length})</span>
              </button>

              <button
                onClick={() => setRenewalTab('upsells')}
                style={{
                  border: 'none',
                  background: renewalTab === 'upsells' ? C.primaryLight : 'transparent',
                  color: renewalTab === 'upsells' ? C.primary : C.textSub,
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <TrendingUp size={14} />
                <span>Upsell Pipeline ({upsellOpportunities.length})</span>
              </button>
            </div>

            {/* Search and Filters */}
            {renewalTab === 'active' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: '#F8FAFC', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '4px 8px' }}>
                  <Search size={12} color={C.textMuted} style={{ marginRight: 6 }} />
                  <input
                    placeholder="Search renewal..."
                    value={renewalSearch}
                    onChange={e => setRenewalSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', fontSize: '12px', color: C.textSub, background: 'transparent', width: '130px' }}
                  />
                </div>

                <select
                  value={renewalStatusFilter}
                  onChange={e => setRenewalStatusFilter(e.target.value)}
                  style={{ border: `1px solid ${C.border}`, borderRadius: '6px', padding: '5px 8px', fontSize: '11.5px', color: C.textSub, background: '#F8FAFC' }}
                >
                  <option value="All">All Deadlines</option>
                  <option value="7days">Expiring ≤ 7 Days</option>
                  <option value="30days">Expiring ≤ 30 Days</option>
                  <option value="overdue">Overdue</option>
                  <option value="active">Active Status</option>
                </select>

                <select
                  value={renewalTypeFilter}
                  onChange={e => setRenewalTypeFilter(e.target.value)}
                  style={{ border: `1px solid ${C.border}`, borderRadius: '6px', padding: '5px 8px', fontSize: '11.5px', color: C.textSub, background: '#F8FAFC' }}
                >
                  <option value="All">All Types</option>
                  <option value="Domain renewal">Domain</option>
                  <option value="Hosting / VPS renewal">Hosting / VPS</option>
                  <option value="AMC / Maintenance renewal">AMC Maintenance</option>
                  <option value="Extra development and additional feature requests">Extra Features</option>
                </select>
              </div>
            )}
          </div>

          {/* Tab 1: Active Services Table */}
          {renewalTab === 'active' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${C.border}` }}>
                    {['Service & Type', 'Client / Project', 'Expiry Date', 'Amount & Cycle', 'Status', 'Follow-Up', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: '10.5px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '24px 16px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
                        No matching services found
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((s, i) => {
                      const exp = s.expiryDate ? new Date(s.expiryDate) : null;
                      const isExpired = exp && exp < today;
                      const daysLeft = exp ? Math.ceil((exp - today) / 86400000) : 0;
                      const bType = s.status === 'Active' ? 'success' : s.status === 'Overdue' ? 'danger' : 'warning';

                      return (
                        <tr key={s._id || i} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: C.text }}>{s.serviceName}</div>
                            <div style={{ fontSize: '11px', color: C.textMuted }}>{s.serviceType}</div>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '12px', color: C.textSub }}>
                            <div style={{ fontWeight: 600, color: C.primary }}>{s.clientName}</div>
                            {s.projectName && <div style={{ fontSize: '11px', color: C.textMuted }}>{s.projectName}</div>}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                            <div style={{ fontWeight: 600, color: isExpired ? C.rose : C.text }}>
                              {exp ? exp.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </div>
                            <div style={{ fontSize: '10.5px', color: isExpired ? C.rose : daysLeft <= 15 ? C.amber : C.textMuted }}>
                              {isExpired ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d remaining`}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                            <div style={{ fontWeight: 700, color: C.emerald }}>₹{(s.renewalAmount || 0).toLocaleString('en-IN')}</div>
                            <div style={{ fontSize: '10.5px', color: C.textMuted }}>{s.billingFrequency}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Badge label={s.status} type={bType} />
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '11.5px', color: C.textMuted }}>
                            {s.nextFollowupDate ? new Date(s.nextFollowupDate).toLocaleDateString('en-IN') : 'None'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <a
                              href={`/admin/resources/ServiceRenewal/records/${s._id}/show`}
                              style={{ color: C.primary, fontSize: '11.5px', fontWeight: 600, textDecoration: 'none' }}
                            >
                              Manage ↗
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Renewal History */}
          {renewalTab === 'history' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${C.border}` }}>
                    {['Service', 'Client', 'Previous Expiry', 'New Expiry', 'Price', 'Invoice Ref', 'Payment Status', 'Renewed Date'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: '10.5px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {renewalHistory.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '24px 16px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
                        No renewal history recorded yet
                      </td>
                    </tr>
                  ) : (
                    renewalHistory.map((h, i) => (
                      <tr key={h._id || i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600, fontSize: '12.5px', color: C.text }}>{h.serviceName}</td>
                        <td style={{ padding: '10px 16px', fontSize: '12px', color: C.textSub }}>{h.clientName}</td>
                        <td style={{ padding: '10px 16px', fontSize: '11.5px', color: C.textMuted }}>{h.previousExpiryDate ? new Date(h.previousExpiryDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600, fontSize: '12px', color: C.text }}>{h.newExpiryDate ? new Date(h.newExpiryDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 700, fontSize: '12px', color: C.emerald }}>₹{(h.renewalPrice || 0).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 16px', fontSize: '11.5px', color: C.primary }}>{h.invoiceReference || 'None'}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <Badge label={h.paymentStatus} type={h.paymentStatus === 'Paid' ? 'success' : 'warning'} />
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: '11px', color: C.textMuted }}>{new Date(h.renewedAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Upsell Opportunities */}
          {renewalTab === 'upsells' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${C.border}` }}>
                    {['Opportunity & Description', 'Client', 'Estimated Value', 'Status', 'Next Follow-Up', 'Quotation', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: '10.5px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upsellOpportunities.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '24px 16px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
                        No open upsell opportunities found
                      </td>
                    </tr>
                  ) : (
                    upsellOpportunities.map((u, i) => (
                      <tr key={u._id || i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: C.text }}>{u.title}</div>
                          {u.description && <div style={{ fontSize: '11.5px', color: C.textMuted, marginTop: '2px' }}>{u.description}</div>}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: C.primary }}>{u.clientName}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: C.emerald }}>₹{(u.estimatedValue || 0).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <Badge label={u.status} type={u.status === 'Won' ? 'success' : u.status === 'Lost' ? 'danger' : 'primary'} />
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '11.5px', color: C.textMuted }}>
                          {u.nextFollowupDate ? new Date(u.nextFollowupDate).toLocaleDateString('en-IN') : 'None'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {u.quotationLink ? (
                            <a href={u.quotationLink} target="_blank" rel="noopener noreferrer" style={{ color: C.primary, fontSize: '11.5px', textDecoration: 'none' }}>Quote ↗</a>
                          ) : (
                            <span style={{ color: C.textMuted, fontSize: '11px' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {u.convertedToProject ? (
                            <span style={{ fontSize: '11px', color: C.emerald, fontWeight: 700 }}>✓ Converted</span>
                          ) : (
                            <button
                              onClick={() => handleConvertUpsellOnDashboard(u)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                background: C.primaryLight,
                                color: C.primary,
                                border: `1px solid ${C.border}`,
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Convert to Project
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* ── Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={T.h2}>Revenue performance</h3>
              <p style={{ ...T.small, marginTop: '2px' }}>Audited monthly earnings (2026)</p>
            </div>
            <Badge label="Audited" type="success" />
          </div>
          <LineChart data={revenueData} color={C.emerald} height={120} />
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={T.h2}>Daily Attendance rate</h3>
              <p style={{ ...T.small, marginTop: '2px' }}>Weekly clock-in presence ratios</p>
            </div>
            <Badge label="Weekly" type="primary" />
          </div>
          <BarChart data={attendData} labels={attendLabels} color={C.primary} height={120} />
        </Card>
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* Left Side: Projects and Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Projects */}
          <Card style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => setProjectTab('portfolio')}
                  style={{ 
                    border: 'none',
                    background: projectTab === 'portfolio' ? C.primaryLight : 'transparent',
                    color: projectTab === 'portfolio' ? C.primary : C.textSub,
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Globe size={15} />
                  <span>Website Showcase ({portfolioProjects.length})</span>
                </button>
                <button 
                  onClick={() => setProjectTab('operations')}
                  style={{ 
                    border: 'none',
                    background: projectTab === 'operations' ? C.primaryLight : 'transparent',
                    color: projectTab === 'operations' ? C.primary : C.textSub,
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Briefcase size={15} />
                  <span>Operations Projects ({projects.length})</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => window.location.href = projectTab === 'portfolio' ? '/admin/resources/PortfolioProject' : '/admin/resources/Project'}
                  style={{ border: 'none', background: 'transparent', color: C.primary, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {projectTab === 'portfolio' ? 'Manage Showcase' : 'Manage Operations'}
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {projectTab === 'portfolio' ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 480 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${C.border}` }}>
                      {['Project Title', 'Category', 'Client', 'Technologies', 'Status'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', fontSize: '10.5px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioProjects.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '24px 16px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
                          No showcase projects found
                        </td>
                      </tr>
                    ) : (
                      portfolioProjects.map((p, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: C.indigoLight, color: C.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                                {p.title ? p.title[0].toUpperCase() : 'P'}
                              </div>
                              <div>
                                <span style={{ display: 'block' }}>{p.title}</span>
                                {p.subtitle && <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 400 }}>{p.subtitle}</span>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '12px', color: C.textSub }}>{p.category || 'Web App'}</td>
                          <td style={{ padding: '12px 16px', fontSize: '12px', color: C.textSub }}>{p.clientName || 'Internal'}</td>
                          <td style={{ padding: '12px 16px', fontSize: '11.5px', color: C.textMuted }}>
                            {Array.isArray(p.technologies) && p.technologies.length > 0 
                              ? p.technologies.slice(0, 3).join(', ') 
                              : 'Custom Stack'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Badge label={p.isActive ? 'Active' : 'Hidden'} type={p.isActive ? 'success' : 'default'} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 450 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${C.border}` }}>
                      {['Project Name', 'Client', 'Deadline', 'Progress', 'Status'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', fontSize: '10.5px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '24px 16px', textAlign: 'center', color: C.textMuted, fontSize: '13px' }}>
                          No operations projects found
                        </td>
                      </tr>
                    ) : (
                      projects.map((p, i) => {
                        const bType = p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'primary' : 'warning';
                        const deadlineText = p.deadline 
                          ? new Date(p.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Ongoing';
                        return (
                          <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                            <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: C.primaryLight, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                                  {p.name ? p.name[0].toUpperCase() : 'P'}
                                </div>
                                <span>{p.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '12.5px', color: C.textSub }}>{p.client || 'Internal'}</td>
                            <td style={{ padding: '12px 16px', fontSize: '12px', color: C.textMuted }}>
                              {deadlineText}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ flex: 1, height: '4px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden', minWidth: '50px' }}>
                                  <div style={{ height: '100%', width: `${p.progress || 0}%`, background: p.status === 'Completed' ? C.emerald : C.primary, borderRadius: '10px' }} />
                                </div>
                                <span style={{ fontSize: '10.5px', fontWeight: 700, color: C.textMuted }}>{p.progress || 0}%</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Badge label={p.status || 'Pending'} type={bType} />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <SectionHeader title="Tasks Operations Checklist" action="New Task" actionUrl="/admin/resources/Task" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.length === 0 && <p style={{ ...T.small, textAlign: 'center', padding: '12px 0' }}>No pending tasks assigned</p>}
              {tasks.map((t, i) => {
                const pType = t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warning' : 'default';
                const sType = t.status === 'In Progress' ? 'primary' : 'default';
                return (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      background: '#F8FAFC', 
                      border: `1px solid ${C.border}` 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.priority === 'Urgent' ? C.rose : (t.priority === 'High' ? C.amber : C.primary), flexShrink: 0 }} />
                      <span style={{ fontSize: '12.5px', fontWeight: 500, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <Badge label={t.priority} type={pType} />
                      <Badge label={t.status} type={sType} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Finances, Meetings, Activities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Finance */}
          <Card>
            <SectionHeader title="Expense analytics" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <DoughnutChart
                data={[totalRev || 1, totalExp || 1]}
                colors={[C.emerald, C.rose]}
                size={70}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {[
                  { label: 'Revenues', value: `₹${totalRev.toLocaleString('en-IN')}`, color: C.emerald },
                  { label: 'Expenses', value: `₹${totalExp.toLocaleString('en-IN')}`, color: C.rose },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '1.5px', background: item.color }} />
                      <span style={{ fontSize: '11px', color: C.textSub, fontWeight: 500 }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: C.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* mini list */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {finance.slice(0, 3).map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: f.type === 'Revenue' ? C.emerald : C.rose, fontWeight: 700 }}>
                      {f.type === 'Revenue' ? '▲' : '▼'}
                    </span>
                    <span style={{ color: C.textSub }}>{f.category}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: f.type === 'Revenue' ? C.emerald : C.rose }}>
                    {f.type === 'Revenue' ? '+' : '-'}₹{f.amount?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Meetings */}
          <Card>
            <SectionHeader title="Meetings agenda" action="Schedule" actionUrl="/admin/resources/Meeting" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meetings.length === 0 && (
                <p style={{ ...T.small, textAlign: 'center', padding: '12px 0' }}>No active meetings</p>
              )}
              {meetings.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: C.primaryLight, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Video size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</p>
                    <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: C.textMuted }}>{m.time} · {m.participants?.length || 0} crew</p>
                  </div>
                  <Badge label="Scheduled" type="primary" />
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Events */}
          <Card>
            <SectionHeader title="Platform Logs" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activities.length === 0 && <p style={{ ...T.small, textAlign: 'center', padding: '12px 0' }}>No recent events</p>}
              {activities.slice(0, 4).map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: C.primaryLight, 
                    color: C.primary, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    flexShrink: 0 
                  }}>
                    {act.user ? act.user[0].toUpperCase() : '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '12px', color: C.textSub, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <strong style={{ color: C.text, fontWeight: 600 }}>{act.user}</strong> {act.action} <span style={{ color: C.primary, fontWeight: 500 }}>{act.target}</span>
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '10px', color: C.textMuted }}>
                      {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
