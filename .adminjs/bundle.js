(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  // ── Color Tokens ──────────────────────────────────────────────────────────────
  const C$3 = {
    bg: '#F5F7FA',
    card: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    gray: '#6B7280',
    grayLight: '#9CA3AF',
    grayBg: '#F9FAFB',
    success: '#22C55E',
    successLight: '#F0FDF4',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    danger: '#EF4444',
    dangerLight: '#FEF2F2',
    text: '#111827',
    textSub: '#374151',
    textMuted: '#6B7280'
  };

  // ── Typography ────────────────────────────────────────────────────────────────
  const T = {
    h1: {
      fontSize: '24px',
      fontWeight: 600,
      color: C$3.text,
      margin: 0,
      letterSpacing: '-0.01em'
    },
    h2: {
      fontSize: '18px',
      fontWeight: 600,
      color: C$3.text,
      margin: 0
    },
    body: {
      fontSize: '14px',
      fontWeight: 400,
      color: C$3.textSub
    },
    small: {
      fontSize: '12px',
      fontWeight: 400,
      color: C$3.textMuted
    },
    label: {
      fontSize: '12px',
      fontWeight: 500,
      color: C$3.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    }
  };

  // ── Base Card ─────────────────────────────────────────────────────────────────
  const card = {
    background: C$3.card,
    borderRadius: '12px',
    border: `1px solid ${C$3.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    padding: '20px'
  };

  // ── SVG: Line Chart ───────────────────────────────────────────────────────────
  const LineChart = ({
    data,
    labels,
    color = C$3.primary,
    height = 120
  }) => {
    const W = 400,
      H = height,
      pad = 8;
    const max = Math.max(...data),
      min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
      const x = pad + i / (data.length - 1) * (W - pad * 2);
      const y = H - pad - (v - min) / range * (H - pad * 2);
      return [x, y];
    });
    const polyline = pts.map(p => p.join(',')).join(' ');
    const area = `M${pts[0][0]},${H} ` + pts.map(p => `L${p[0]},${p[1]}`).join(' ') + ` L${pts[pts.length - 1][0]},${H} Z`;
    return /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: {
        width: '100%',
        height: `${H}px`
      },
      preserveAspectRatio: "none"
    }, /*#__PURE__*/React__default.default.createElement("defs", null, /*#__PURE__*/React__default.default.createElement("linearGradient", {
      id: "lg",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React__default.default.createElement("stop", {
      offset: "0%",
      stopColor: color,
      stopOpacity: "0.12"
    }), /*#__PURE__*/React__default.default.createElement("stop", {
      offset: "100%",
      stopColor: color,
      stopOpacity: "0"
    }))), /*#__PURE__*/React__default.default.createElement("path", {
      d: area,
      fill: "url(#lg)"
    }), /*#__PURE__*/React__default.default.createElement("polyline", {
      points: polyline,
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), pts.map((p, i) => /*#__PURE__*/React__default.default.createElement("circle", {
      key: i,
      cx: p[0],
      cy: p[1],
      r: "3",
      fill: C$3.card,
      stroke: color,
      strokeWidth: "1.5"
    })), labels && labels.map((l, i) => /*#__PURE__*/React__default.default.createElement("text", {
      key: i,
      x: pts[i][0],
      y: H - 1,
      textAnchor: "middle",
      fontSize: "9",
      fill: C$3.grayLight
    }, l)));
  };

  // ── SVG: Bar Chart ────────────────────────────────────────────────────────────
  const BarChart = ({
    data,
    labels,
    color = C$3.primary,
    height = 120
  }) => {
    const W = 400,
      H = height,
      gap = 6,
      pad = 16;
    const max = Math.max(...data) || 1;
    const bw = (W - pad * 2 - gap * (data.length - 1)) / data.length;
    return /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: {
        width: '100%',
        height: `${H}px`
      },
      preserveAspectRatio: "none"
    }, data.map((v, i) => {
      const bh = v / max * (H - 24);
      const x = pad + i * (bw + gap);
      return /*#__PURE__*/React__default.default.createElement("g", {
        key: i
      }, /*#__PURE__*/React__default.default.createElement("rect", {
        x: x,
        y: H - bh - 14,
        width: bw,
        height: bh,
        rx: "4",
        fill: color,
        fillOpacity: "0.15"
      }), /*#__PURE__*/React__default.default.createElement("rect", {
        x: x,
        y: H - bh - 14,
        width: bw,
        height: 4,
        rx: "2",
        fill: color
      }), labels && /*#__PURE__*/React__default.default.createElement("text", {
        x: x + bw / 2,
        y: H - 2,
        textAnchor: "middle",
        fontSize: "9",
        fill: C$3.grayLight
      }, labels[i]));
    }));
  };

  // ── SVG: Doughnut Chart ───────────────────────────────────────────────────────
  const DoughnutChart = ({
    data,
    colors,
    size = 120
  }) => {
    const total = data.reduce((a, b) => a + b, 0) || 1;
    const cx = size / 2,
      cy = size / 2,
      r = size * 0.38,
      ir = size * 0.24;
    let angle = -Math.PI / 2;
    const slices = data.map((v, i) => {
      const sweep = v / total * 2 * Math.PI;
      const x1 = cx + r * Math.cos(angle),
        y1 = cy + r * Math.sin(angle);
      angle += sweep;
      const x2 = cx + r * Math.cos(angle),
        y2 = cy + r * Math.sin(angle);
      const large = sweep > Math.PI ? 1 : 0;
      const xi1 = cx + ir * Math.cos(angle - sweep),
        yi1 = cy + ir * Math.sin(angle - sweep);
      const xi2 = cx + ir * Math.cos(angle),
        yi2 = cy + ir * Math.sin(angle);
      return {
        d: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${ir},${ir} 0 ${large},0 ${xi1},${yi1} Z`,
        color: colors[i]
      };
    });
    return /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: `0 0 ${size} ${size}`,
      style: {
        width: `${size}px`,
        height: `${size}px`
      }
    }, slices.map((s, i) => /*#__PURE__*/React__default.default.createElement("path", {
      key: i,
      d: s.d,
      fill: s.color
    })), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: cx,
      cy: cy,
      r: ir - 2,
      fill: C$3.card
    }));
  };

  // ── Badge ─────────────────────────────────────────────────────────────────────
  const Badge = ({
    label,
    type = 'default'
  }) => {
    const map = {
      success: {
        bg: C$3.successLight,
        color: C$3.success
      },
      warning: {
        bg: C$3.warningLight,
        color: C$3.warning
      },
      danger: {
        bg: C$3.dangerLight,
        color: C$3.danger
      },
      primary: {
        bg: C$3.primaryLight,
        color: C$3.primary
      },
      default: {
        bg: C$3.grayBg,
        color: C$3.gray
      }
    };
    const {
      bg,
      color
    } = map[type] || map.default;
    return /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 500,
        background: bg,
        color,
        border: `1px solid ${color}22`
      }
    }, label);
  };

  // ── Button ────────────────────────────────────────────────────────────────────
  const Btn = ({
    children,
    variant = 'primary',
    onClick
  }) => {
    const styles = {
      primary: {
        background: C$3.primary,
        color: '#fff',
        border: `1px solid ${C$3.primary}`
      },
      secondary: {
        background: C$3.card,
        color: C$3.gray,
        border: `1px solid ${C$3.border}`
      },
      ghost: {
        background: 'transparent',
        color: C$3.primary,
        border: `1px solid ${C$3.primary}`
      }
    };
    return /*#__PURE__*/React__default.default.createElement("button", {
      onClick: onClick,
      style: {
        ...styles[variant],
        padding: '7px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'opacity 0.15s'
      }
    }, children);
  };

  // ── Section Divider ────────────────────────────────────────────────────────────
  const SectionHeader = ({
    title,
    action
  }) => /*#__PURE__*/React__default.default.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React__default.default.createElement("h2", {
    style: T.h2
  }, title), action && /*#__PURE__*/React__default.default.createElement(Btn, {
    variant: "ghost"
  }, action));

  // ── Main Dashboard ─────────────────────────────────────────────────────────────
  const Dashboard = () => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      fetch('/api/admin/dashboard-stats').then(r => r.json()).then(json => setData(json)).catch(err => console.error('Dashboard error:', err)).finally(() => setLoading(false));
    }, []);
    if (loading) return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '36px',
        height: '36px',
        border: `3px solid ${C$3.border}`,
        borderTop: `3px solid ${C$3.primary}`,
        borderRadius: '50%',
        margin: '0 auto 12px',
        animation: 'spin 0.8s linear infinite'
      }
    }), /*#__PURE__*/React__default.default.createElement("style", null, `@keyframes spin { to { transform: rotate(360deg); } }`), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.body,
        color: C$3.grayLight
      }
    }, "Loading dashboard...")));
    const stats = data?.stats || {};
    const projects = data?.projects || [];
    const tasks = data?.tasks || [];
    const finance = data?.finance || [];
    const activities = data?.activities || [];
    const meetings = data?.meetings || [];
    const revenue = stats.monthlyRevenue || 195000;
    const revenueData = [148000, 162000, 175000, 159000, 188000, revenue];
    const revLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const attendData = [92, 95, 88, 94, 91, 75, 40];
    const attendLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const totalExp = finance.filter(f => f.type === 'Expense').reduce((a, f) => a + f.amount, 0);
    const totalRev = finance.filter(f => f.type === 'Revenue').reduce((a, f) => a + f.amount, 0);
    const statCards = [{
      icon: '👥',
      label: 'Total Employees',
      value: stats.totalEmployees || 5,
      sub: 'Active staff',
      badge: 'Active',
      badgeType: 'success'
    }, {
      icon: '🎓',
      label: 'Total Interns',
      value: stats.totalInterns || 2,
      sub: 'Active interns',
      badge: 'Active',
      badgeType: 'success'
    }, {
      icon: '📁',
      label: 'Active Projects',
      value: stats.activeProjects || 2,
      sub: 'Ongoing work',
      badge: 'In Progress',
      badgeType: 'primary'
    }, {
      icon: '☑️',
      label: 'Pending Tasks',
      value: stats.pendingTasks || 4,
      sub: 'Awaiting action',
      badge: 'Pending',
      badgeType: 'warning'
    }, {
      icon: '₹',
      label: 'Monthly Revenue',
      value: "₹" + (stats.monthlyRevenue || 195000).toLocaleString('en-IN'),
      sub: 'vs last month',
      badge: '+18%',
      badgeType: 'success'
    }, {
      icon: '📄',
      label: 'Pending Invoices',
      value: "₹" + (stats.pendingPayments || 32000).toLocaleString('en-IN'),
      sub: 'Awaiting payment',
      badge: 'Unpaid',
      badgeType: 'danger'
    }, {
      icon: '📅',
      label: 'Attendance Rate',
      value: (stats.attendanceRate || 95) + "%",
      sub: "Today's presence",
      badge: 'Good',
      badgeType: 'success'
    }, {
      icon: '📩',
      label: 'New Leads',
      value: stats.newClientRequests || 0,
      sub: 'Client requests',
      badge: 'Today',
      badgeType: 'default'
    }];
    const tMetrics = stats.ticketMetrics || {
      total: 0,
      closed: 0,
      urgent: 0,
      pending: 0
    };
    const ticketCards = [{
      icon: '📨',
      label: 'Total Tickets',
      value: tMetrics.total,
      sub: 'All tickets'
    }, {
      icon: '⏳',
      label: 'In Progress',
      value: tMetrics.pending,
      sub: 'Pending resolution'
    }, {
      icon: '✅',
      label: 'Closed Tickets',
      value: tMetrics.closed,
      sub: 'Resolved'
    }, {
      icon: '🚨',
      label: 'Urgent Tickets',
      value: tMetrics.urgent,
      sub: 'Action needed'
    }];
    const layout = {
      page: {
        minHeight: '100vh',
        background: C$3.bg,
        padding: '24px 28px',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: C$3.text,
        boxSizing: 'border-box'
      },
      grid4: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      },
      grid2_1: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '20px'
      },
      grid2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      },
      col: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }};
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: layout.page
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        button:hover { opacity: 0.85; }
        tr:hover td { background: #F9FAFB; }
      `), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h1", {
      style: T.h1
    }, "Dashboard"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.body,
        color: C$3.textMuted,
        marginTop: '4px'
      }
    }, new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: C$3.card,
        border: `1px solid ${C$3.border}`,
        borderRadius: '8px',
        padding: '7px 12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px',
        color: C$3.gray
      }
    }, "\uD83D\uDD0D"), /*#__PURE__*/React__default.default.createElement("input", {
      placeholder: "Search...",
      style: {
        border: 'none',
        outline: 'none',
        fontSize: '13px',
        color: C$3.textSub,
        background: 'transparent',
        width: '160px'
      }
    })), /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        position: 'relative',
        background: C$3.card,
        border: `1px solid ${C$3.border}`,
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '15px'
      }
    }, "\uD83D\uDD14", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '7px',
        height: '7px',
        background: C$3.danger,
        borderRadius: '50%',
        border: `1.5px solid ${C$3.card}`
      }
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: C$3.card,
        border: `1px solid ${C$3.border}`,
        borderRadius: '8px',
        padding: '6px 12px 6px 8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: "https://ui-avatars.com/api/?name=Munees+Waran&background=2563EB&color=fff&size=32&font-size=0.4",
      style: {
        width: '32px',
        height: '32px',
        borderRadius: '6px'
      },
      alt: "avatar"
    }), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        fontSize: '13px',
        fontWeight: 600,
        color: C$3.text
      }
    }, "Munees Waran"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        fontSize: '11px',
        color: C$3.textMuted
      }
    }, "Super Admin")), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '10px',
        color: C$3.grayLight
      }
    }, "\u25BC")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: layout.grid4
    }, statCards.map((s, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: i,
      style: card
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: C$3.grayBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        border: `1px solid ${C$3.border}`
      }
    }, s.icon), /*#__PURE__*/React__default.default.createElement(Badge, {
      label: s.badge,
      type: s.badgeType
    })), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.label,
        marginBottom: '6px'
      }
    }, s.label), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        fontSize: '28px',
        fontWeight: 600,
        color: C$3.text,
        margin: '0 0 4px',
        letterSpacing: '-0.02em',
        lineHeight: 1
      }
    }, s.value), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.small,
        marginTop: '4px'
      }
    }, s.sub)))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: '28px'
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginBottom: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement(SectionHeader, {
      title: "Ticket Support Center",
      action: "View All Tickets"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }
    }, ticketCards.map((s, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: i,
      style: card
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: C$3.primaryLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: C$3.primary
      }
    }, s.icon), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.label,
        marginBottom: '2px',
        color: C$3.gray
      }
    }, s.label), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        fontSize: '24px',
        fontWeight: 600,
        color: C$3.text,
        margin: '0'
      }
    }, s.value))))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: '24px'
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: layout.grid2
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: card
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h2", {
      style: T.h2
    }, "Revenue Overview"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.small,
        marginTop: '3px'
      }
    }, "Monthly revenue trend \u2014 2026")), /*#__PURE__*/React__default.default.createElement(Badge, {
      label: "Year 2026",
      type: "primary"
    })), /*#__PURE__*/React__default.default.createElement(LineChart, {
      data: revenueData,
      labels: revLabels,
      color: C$3.primary,
      height: 130
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: card
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h2", {
      style: T.h2
    }, "Attendance Rate"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.small,
        marginTop: '3px'
      }
    }, "This week \u2014 % present")), /*#__PURE__*/React__default.default.createElement(Badge, {
      label: "This Week",
      type: "default"
    })), /*#__PURE__*/React__default.default.createElement(BarChart, {
      data: attendData,
      labels: attendLabels,
      color: C$3.primary,
      height: 130
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: '24px'
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: layout.grid2_1
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: layout.col
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: card
    }, /*#__PURE__*/React__default.default.createElement(SectionHeader, {
      title: "Projects",
      action: "View All"
    }), /*#__PURE__*/React__default.default.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
      }
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", {
      style: {
        background: C$3.grayBg,
        borderBottom: `1px solid ${C$3.border}`
      }
    }, ['Project Name', 'Client', 'Deadline', 'Progress', 'Status'].map(h => /*#__PURE__*/React__default.default.createElement("th", {
      key: h,
      style: {
        padding: '10px 12px',
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: 500,
        color: C$3.textMuted,
        fontFamily: 'inherit',
        borderBottom: `1px solid ${C$3.border}`
      }
    }, h)))), /*#__PURE__*/React__default.default.createElement("tbody", null, projects.map((p, i) => {
      const bType = p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'primary' : 'warning';
      return /*#__PURE__*/React__default.default.createElement("tr", {
        key: i
      }, /*#__PURE__*/React__default.default.createElement("td", {
        style: {
          padding: '12px',
          borderBottom: `1px solid ${C$3.borderLight}`
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: C$3.primaryLight,
          color: C$3.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '14px',
          flexShrink: 0
        }
      }, p.name?.[0]), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontWeight: 500,
          color: C$3.text
        }
      }, p.name))), /*#__PURE__*/React__default.default.createElement("td", {
        style: {
          padding: '12px',
          color: C$3.gray,
          borderBottom: `1px solid ${C$3.borderLight}`
        }
      }, p.client), /*#__PURE__*/React__default.default.createElement("td", {
        style: {
          padding: '12px',
          color: C$3.gray,
          borderBottom: `1px solid ${C$3.borderLight}`,
          fontSize: '13px'
        }
      }, new Date(p.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: '2-digit'
      })), /*#__PURE__*/React__default.default.createElement("td", {
        style: {
          padding: '12px',
          borderBottom: `1px solid ${C$3.borderLight}`
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          flex: 1,
          height: '6px',
          background: C$3.grayBg,
          borderRadius: '999px',
          border: `1px solid ${C$3.border}`,
          overflow: 'hidden',
          minWidth: '80px'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          height: '100%',
          width: `${p.progress}%`,
          background: p.status === 'Completed' ? C$3.success : C$3.primary,
          borderRadius: '999px',
          transition: 'width 0.6s ease'
        }
      })), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontSize: '12px',
          color: C$3.textMuted,
          minWidth: '32px'
        }
      }, p.progress, "%"))), /*#__PURE__*/React__default.default.createElement("td", {
        style: {
          padding: '12px',
          borderBottom: `1px solid ${C$3.borderLight}`
        }
      }, /*#__PURE__*/React__default.default.createElement(Badge, {
        label: p.status,
        type: bType
      })));
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      style: card
    }, /*#__PURE__*/React__default.default.createElement(SectionHeader, {
      title: "Pending Tasks",
      action: "Add Task"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }
    }, tasks.map((t, i) => {
      const pType = t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warning' : 'default';
      const sType = t.status === 'In Progress' ? 'primary' : 'default';
      return /*#__PURE__*/React__default.default.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px',
          border: `1px solid ${C$3.border}`,
          borderRadius: '8px',
          background: C$3.grayBg
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          border: `2px solid ${C$3.border}`,
          flexShrink: 0
        }
      }), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          ...T.body,
          color: C$3.text,
          fontWeight: 500
        }
      }, t.title)), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement(Badge, {
        label: t.priority,
        type: pType
      }), /*#__PURE__*/React__default.default.createElement(Badge, {
        label: t.status,
        type: sType
      })));
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      style: layout.col
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: card
    }, /*#__PURE__*/React__default.default.createElement(SectionHeader, {
      title: "Expenses Breakdown"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }
    }, /*#__PURE__*/React__default.default.createElement(DoughnutChart, {
      data: [totalRev || 195000, totalExp || 47000],
      colors: [C$3.primary, C$3.danger],
      size: 100
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1
      }
    }, [{
      label: 'Revenue',
      value: `₹${(totalRev || 195000).toLocaleString('en-IN')}`,
      color: C$3.primary
    }, {
      label: 'Expenses',
      value: `₹${(totalExp || 47000).toLocaleString('en-IN')}`,
      color: C$3.danger
    }].map((item, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '10px',
        height: '10px',
        borderRadius: '2px',
        background: item.color
      }
    }), /*#__PURE__*/React__default.default.createElement("span", {
      style: T.small
    }, item.label)), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px',
        fontWeight: 600,
        color: C$3.text
      }
    }, item.value))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginTop: '16px',
        borderTop: `1px solid ${C$3.border}`,
        paddingTop: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }
    }, finance.map((f, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px'
      }
    }, f.type === 'Revenue' ? '↑' : '↓'), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        ...T.small,
        color: C$3.textSub
      }
    }, f.category)), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px',
        fontWeight: 600,
        color: f.type === 'Revenue' ? C$3.success : C$3.danger
      }
    }, f.type === 'Revenue' ? '+' : '-', "\u20B9", f.amount?.toLocaleString('en-IN')))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: card
    }, /*#__PURE__*/React__default.default.createElement(SectionHeader, {
      title: "Upcoming Meetings",
      action: "Schedule"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }
    }, meetings.length === 0 && /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        ...T.small,
        textAlign: 'center',
        padding: '16px 0'
      }
    }, "No upcoming meetings"), meetings.map((m, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        border: `1px solid ${C$3.border}`,
        borderRadius: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: C$3.primaryLight,
        color: C$3.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0
      }
    }, "\uD83D\uDCF9"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        fontSize: '13px',
        fontWeight: 600,
        color: C$3.text
      }
    }, m.title), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: '12px',
        color: C$3.textMuted
      }
    }, m.time, " \xB7 ", m.participants?.length || 0, " participants")), /*#__PURE__*/React__default.default.createElement(Badge, {
      label: "Today",
      type: "primary"
    }))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: card
    }, /*#__PURE__*/React__default.default.createElement(SectionHeader, {
      title: "Recent Activity"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0'
      }
    }, activities.map((act, i) => /*#__PURE__*/React__default.default.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: '12px',
        padding: '12px 0',
        borderBottom: i < activities.length - 1 ? `1px solid ${C$3.borderLight}` : 'none'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: C$3.primaryLight,
        color: C$3.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: 700,
        flexShrink: 0
      }
    }, act.user?.[0] || '?'), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        fontSize: '13px',
        color: C$3.text,
        lineHeight: 1.5
      }
    }, /*#__PURE__*/React__default.default.createElement("strong", {
      style: {
        fontWeight: 600
      }
    }, act.user), " ", act.action, " ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: C$3.primary,
        fontWeight: 500
      }
    }, act.target)), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: '3px 0 0',
        fontSize: '11px',
        color: C$3.textMuted
      }
    }, new Date(act.time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }), " today")))))))));
  };

  // ── Icons (Pure SVG for 100% compatibility) ──────────────────────────────────
  const Icon = {
    HR: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "9",
      cy: "7",
      r: "4"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M22 21v-2a4 4 0 0 0-3-3.87"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16 3.13a4 4 0 0 1 0 7.75"
    })),
    Recruit: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "6"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "2"
    })),
    Ops: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("rect", {
      x: "2",
      y: "7",
      width: "20",
      height: "14",
      rx: "2",
      ry: "2"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
    })),
    Supp: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
    }), /*#__PURE__*/React__default.default.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    })),
    Fin: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("line", {
      x1: "12",
      y1: "1",
      x2: "12",
      y2: "23"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    })),
    Sales: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "m22 2-7 20-4-9-9-4Z"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M22 2 11 13"
    })),
    Sys: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
    })),
    Dash: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "7"
    }), /*#__PURE__*/React__default.default.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "7"
    }), /*#__PURE__*/React__default.default.createElement("rect", {
      x: "14",
      y: "14",
      width: "7",
      height: "7"
    }), /*#__PURE__*/React__default.default.createElement("rect", {
      x: "3",
      y: "14",
      width: "7",
      height: "7"
    })),
    Down: (s = 14) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "m6 9 6 6 6-6"
    })),
    Right: (s = 14) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "m9 18 6-6-6-6"
    })),
    Out: (s = 18) => /*#__PURE__*/React__default.default.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
    }), /*#__PURE__*/React__default.default.createElement("polyline", {
      points: "16 17 21 12 16 7"
    }), /*#__PURE__*/React__default.default.createElement("line", {
      x1: "21",
      y1: "12",
      x2: "9",
      y2: "12"
    }))
  };

  // ── Colors ────────────────────────────────────────────────────────────────────
  const C$2 = {
    bg: '#F8FAFC',
    white: '#FFFFFF',
    border: '#E5E7EB',
    primary: '#2563EB',
    primaryLight: '#EEF4FF',
    text: '#111827',
    textMuted: '#6B7280',
    textDim: '#9CA3AF'
  };
  const Sidebar = props => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [openSections, setOpenSections] = React.useState({
      'HR Management': true,
      'Operations': true
    });
    const toggleSection = name => {
      setOpenSections(prev => ({
        ...prev,
        [name]: !prev[name]
      }));
    };
    const nav = [{
      name: 'HR Management',
      icon: Icon.HR(),
      items: [{
        name: 'Employees',
        path: '/admin/resources/Employee'
      }, {
        name: 'Interns',
        path: '/admin/resources/Intern'
      }, {
        name: 'Attendance',
        path: '/admin/resources/Attendance'
      }, {
        name: 'Leave Requests',
        path: '/admin/resources/LeaveRequest'
      }, {
        name: 'Payroll',
        path: '/admin/resources/Payroll'
      }]
    }, {
      name: 'Recruitment',
      icon: Icon.Recruit(),
      items: [{
        name: 'Job Postings',
        path: '/admin/resources/JobPosting'
      }, {
        name: 'Applications',
        path: '/admin/resources/JobApplication'
      }]
    }, {
      name: 'Operations',
      icon: Icon.Ops(),
      items: [{
        name: 'Projects',
        path: '/admin/resources/Project'
      }, {
        name: 'Tasks',
        path: '/admin/resources/Task'
      }, {
        name: 'Meetings',
        path: '/admin/resources/Meeting'
      }, {
        name: 'Calendar',
        path: '#'
      }, {
        name: 'Team Activity',
        path: '#'
      }]
    }, {
      name: 'Support',
      icon: Icon.Supp(),
      items: [{
        name: 'Tickets',
        path: '/admin/resources/Ticket'
      }, {
        name: 'Live Chat',
        path: '#'
      }]
    }, {
      name: 'Finance',
      icon: Icon.Fin(),
      items: [{
        name: 'Revenue',
        path: '/admin/resources/Finance'
      }, {
        name: 'Invoices',
        path: '#'
      }, {
        name: 'Bills',
        path: '#'
      }]
    }, {
      name: 'Sales',
      icon: Icon.Sales(),
      items: [{
        name: 'Leads',
        path: '/admin/resources/ClientRequest'
      }, {
        name: 'Deals',
        path: '#'
      }]
    }, {
      name: 'System',
      icon: Icon.Sys(),
      items: [{
        name: 'Settings',
        path: '#'
      }, {
        name: 'Admin Account',
        path: '/admin/resources/Manager'
      }]
    }];
    const currentPath = window.location.pathname;
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: isCollapsed ? '72px' : '260px',
        height: '100vh',
        background: C$2.bg,
        borderRight: `1px solid ${C$2.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.3s ease',
        position: 'relative',
        fontFamily: "'Inter', sans-serif"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: isCollapsed ? '24px 0' : '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        borderBottom: `1px solid ${C$2.border}`,
        marginBottom: '12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("button", {
      onClick: () => setIsCollapsed(!isCollapsed),
      style: {
        position: 'absolute',
        right: '-12px',
        top: '24px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: C$2.white,
        border: `1px solid ${C$2.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        zIndex: 10
      }
    }, isCollapsed ? Icon.Right(12) : /*#__PURE__*/React__default.default.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "m15 18-6-6 6-6"
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: isCollapsed ? '40px' : '52px',
        height: isCollapsed ? '40px' : '52px',
        marginBottom: isCollapsed ? 0 : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: "/logo.png",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      },
      alt: "Logo"
    })), !isCollapsed && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("h1", {
      style: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 700,
        color: C$2.text
      }
    }, "averqon HRMS"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: '2px 0 0',
        fontSize: '11px',
        color: C$2.textMuted,
        fontWeight: 500
      }
    }, "Smart Business Management"))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }
    }, /*#__PURE__*/React__default.default.createElement("a", {
      href: "/admin",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '10px',
        textDecoration: 'none',
        color: currentPath === '/admin' ? C$2.primary : C$2.text,
        background: currentPath === '/admin' ? C$2.white : 'transparent',
        border: `1px solid ${currentPath === '/admin' ? C$2.border : 'transparent'}`,
        boxShadow: currentPath === '/admin' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
      }
    }, Icon.Dash(18), !isCollapsed && /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '14px',
        fontWeight: 600
      }
    }, "Dashboard")), nav.map((sec, idx) => /*#__PURE__*/React__default.default.createElement("div", {
      key: idx
    }, /*#__PURE__*/React__default.default.createElement("button", {
      onClick: () => toggleSection(sec.name),
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: C$2.text
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }
    }, sec.icon, !isCollapsed && /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '13px',
        fontWeight: 600
      }
    }, sec.name)), !isCollapsed && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        transform: openSections[sec.name] ? 'rotate(0deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s'
      }
    }, Icon.Down(12))), !isCollapsed && openSections[sec.name] && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        margin: '4px 0 8px',
        padding: '4px',
        background: C$2.white,
        borderRadius: '12px',
        border: `1px solid ${C$2.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }
    }, sec.items.map((item, i) => {
      const active = currentPath === item.path;
      return /*#__PURE__*/React__default.default.createElement("a", {
        key: i,
        href: item.path,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 12px',
          borderRadius: '8px',
          textDecoration: 'none',
          color: active ? C$2.primary : C$2.textMuted,
          background: active ? C$2.primaryLight : 'transparent',
          fontSize: '13px',
          fontWeight: active ? 600 : 400
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: active ? C$2.primary : C$2.textDim
        }
      }), item.name);
    }))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: '16px',
        borderTop: `1px solid ${C$2.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: "https://ui-avatars.com/api/?name=Admin&background=2563EB&color=fff&size=36",
      style: {
        width: '36px',
        height: '36px',
        borderRadius: '10px'
      }
    }), !isCollapsed && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 1,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        fontSize: '13px',
        fontWeight: 600,
        color: C$2.text,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    }, "Admin User"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        fontSize: '11px',
        color: C$2.textMuted
      }
    }, "Super Admin")), !isCollapsed && /*#__PURE__*/React__default.default.createElement("a", {
      href: "/admin/logout",
      style: {
        color: C$2.textDim
      }
    }, Icon.Out(16))));
  };

  // ── Colors ────────────────────────────────────────────────────────────────────
  const C$1 = {
    bg: '#F5F7FA',
    white: '#FFFFFF',
    border: '#E5E7EB',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    text: '#111827',
    textMuted: '#6B7280'
  };
  const Login = props => {
    const {
      action,
      message,
      branding
    } = props;
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C$1.bg,
        fontFamily: "'Inter', sans-serif",
        padding: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '100%',
        maxWidth: '420px',
        background: C$1.white,
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        padding: '40px',
        border: `1px solid ${C$1.border}`,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginBottom: '32px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: "/logo.png",
      style: {
        height: '100%',
        objectFit: 'contain'
      },
      alt: "Logo"
    })), /*#__PURE__*/React__default.default.createElement("h1", {
      style: {
        margin: 0,
        fontSize: '24px',
        fontWeight: 700,
        color: C$1.text
      }
    }, "Welcome Back"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: '8px 0 0',
        fontSize: '14px',
        color: C$1.textMuted
      }
    }, "Enter your credentials to access the admin portal.")), message && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: '12px',
        background: '#FEF2F2',
        border: '1px solid #FEE2E2',
        borderRadius: '8px',
        color: '#991B1B',
        fontSize: '13px',
        marginBottom: '24px'
      }
    }, message.message), /*#__PURE__*/React__default.default.createElement("form", {
      action: action,
      method: "POST",
      style: {
        textAlign: 'left'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '13px',
        fontWeight: 600,
        color: C$1.text
      }
    }, "Email Address"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "email",
      type: "email",
      placeholder: "admin@averon.ai",
      required: true,
      style: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: `1px solid ${C$1.border}`,
        boxSizing: 'border-box',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
      },
      onFocus: e => e.target.style.borderColor = C$1.primary,
      onBlur: e => e.target.style.borderColor = C$1.border
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginBottom: '28px'
      }
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '13px',
        fontWeight: 600,
        color: C$1.text
      }
    }, "Password"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "password",
      type: "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      required: true,
      style: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: `1px solid ${C$1.border}`,
        boxSizing: 'border-box',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
      },
      onFocus: e => e.target.style.borderColor = C$1.primary,
      onBlur: e => e.target.style.borderColor = C$1.border
    })), /*#__PURE__*/React__default.default.createElement("button", {
      type: "submit",
      style: {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        background: C$1.primary,
        border: 'none',
        color: 'white',
        fontSize: '15px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.2s',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
      },
      onMouseEnter: e => e.target.style.background = C$1.primaryHover,
      onMouseLeave: e => e.target.style.background = C$1.primary
    }, "Login to Workspace")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginTop: '32px',
        borderTop: `1px solid ${C$1.border}`,
        paddingTop: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        fontSize: '12px',
        color: C$1.textMuted,
        margin: 0
      }
    }, "Powered by ", /*#__PURE__*/React__default.default.createElement("strong", null, "Averon HRMS Engine")))));
  };

  const C = {
    white: '#FFFFFF',
    border: '#E5E7EB',
    primary: '#2563EB',
    textBase: '#111827',
    textMuted: '#6B7280',
    green: '#10B981',
    blue: '#3B82F6',
    orange: '#F59E0B',
    purple: '#8B5CF6',
    red: '#EF4444',
    cardShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)'
  };

  // --- SVG Icons ---
  const Icons = {
    Briefcase: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("rect", {
      x: "2",
      y: "7",
      width: "20",
      height: "14",
      rx: "2",
      ry: "2"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
    })),
    MapPin: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "3"
    })),
    Building: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("rect", {
      x: "4",
      y: "2",
      width: "16",
      height: "20",
      rx: "2",
      ry: "2"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M9 22v-4h6v4"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M8 6h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16 6h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 6h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 10h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 14h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16 10h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16 14h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M8 10h.01"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M8 14h.01"
    })),
    Calendar: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("rect", {
      x: "3",
      y: "4",
      width: "18",
      height: "18",
      rx: "2",
      ry: "2"
    }), /*#__PURE__*/React__default.default.createElement("line", {
      x1: "16",
      y1: "2",
      x2: "16",
      y2: "6"
    }), /*#__PURE__*/React__default.default.createElement("line", {
      x1: "8",
      y1: "2",
      x2: "8",
      y2: "6"
    }), /*#__PURE__*/React__default.default.createElement("line", {
      x1: "3",
      y1: "10",
      x2: "21",
      y2: "10"
    })),
    Activity: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("polyline", {
      points: "22 12 18 12 15 21 9 3 6 12 2 12"
    })),
    Copy: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("rect", {
      x: "9",
      y: "9",
      width: "13",
      height: "13",
      rx: "2",
      ry: "2"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    })),
    Printer: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("polyline", {
      points: "6 9 6 2 18 2 18 9"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
    }), /*#__PURE__*/React__default.default.createElement("rect", {
      x: "6",
      y: "14",
      width: "12",
      height: "8"
    })),
    Edit: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 20h9"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
    })),
    Trash: () => /*#__PURE__*/React__default.default.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M3 6h18"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    }), /*#__PURE__*/React__default.default.createElement("line", {
      x1: "10",
      y1: "11",
      x2: "10",
      y2: "17"
    }), /*#__PURE__*/React__default.default.createElement("line", {
      x1: "14",
      y1: "11",
      x2: "14",
      y2: "17"
    }))};
  const JobShow = props => {
    const {
      record
    } = props;
    const p = record.params;

    // Formatting helpers
    const postedDate = new Date(p.postedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const isActive = p.isActive === true || p.isActive === 'true';
    const jobType = p.type || 'N/A';
    const getJobTypeColor = () => {
      switch (jobType) {
        case 'Full-time':
          return {
            bg: '#EFF6FF',
            text: C.blue
          };
        case 'Part-time':
          return {
            bg: '#FFF7ED',
            text: C.orange
          };
        case 'Internship':
          return {
            bg: '#F5F3FF',
            text: C.purple
          };
        case 'Contract':
          return {
            bg: '#ECFDF5',
            text: C.green
          };
        default:
          return {
            bg: '#F3F4F6',
            text: C.textBase
          };
      }
    };
    const typeStyle = getJobTypeColor();
    const handleDuplicate = () => alert('Duplicate Job fired! Connecting to API hook...');
    const handlePrint = () => window.print();
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: '0',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '13px',
        color: C.textMuted,
        marginBottom: '8px'
      }
    }, "Dashboard / Job Posting / ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: C.textBase,
        fontWeight: 500
      }
    }, p.title)), /*#__PURE__*/React__default.default.createElement("h1", {
      style: {
        fontSize: '28px',
        fontWeight: 700,
        color: C.textBase,
        margin: '0 0 4px 0'
      }
    }, p.title), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        margin: 0,
        fontSize: '14px',
        color: C.textMuted
      }
    }, "View complete details of the job posting")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        gap: '12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("a", {
      href: `/admin/resources/JobPosting/records/${p._id}/edit`,
      style: {
        textDecoration: 'none'
      }
    }, /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        height: '36px',
        padding: '0 16px',
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 600,
        color: C.textBase,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Edit, null), " Edit")), /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        height: '36px',
        padding: '0 16px',
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 600,
        color: C.red,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Trash, null), " Delete"), /*#__PURE__*/React__default.default.createElement("button", {
      onClick: handleDuplicate,
      style: {
        height: '36px',
        padding: '0 16px',
        background: C.primary,
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 600,
        color: C.white,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Copy, null), " Duplicate Job"))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: C.textMuted,
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Briefcase, null), " ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase'
      }
    }, "Job Type")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '18px',
        fontWeight: 600,
        color: C.textBase
      }
    }, p.type || 'N/A')), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: C.textMuted,
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Building, null), " ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase'
      }
    }, "Department")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '18px',
        fontWeight: 600,
        color: C.textBase
      }
    }, p.department || 'N/A')), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: C.textMuted,
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.MapPin, null), " ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase'
      }
    }, "Location")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '18px',
        fontWeight: 600,
        color: C.textBase
      }
    }, p.location || 'N/A')), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: C.textMuted,
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Activity, null), " ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase'
      }
    }, "Status")), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 600,
        background: isActive ? '#ECFDF5' : '#FEF2F2',
        color: isActive ? C.green : C.red
      }
    }, isActive ? 'Active' : 'Closed'))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: C.textMuted,
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Calendar, null), " ", /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase'
      }
    }, "Posted Date")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '18px',
        fontWeight: 600,
        color: C.textBase
      }
    }, postedDate))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: '1',
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow,
        padding: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        fontSize: '15px',
        fontWeight: 600,
        color: C.textBase,
        margin: '0 0 20px 0',
        borderBottom: `1px solid ${C.border}`,
        paddingBottom: '12px'
      }
    }, "Job Overview"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'block',
        fontSize: '12px',
        color: C.textMuted,
        marginBottom: '4px'
      }
    }, "Job Title"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '14px',
        fontWeight: 500,
        color: C.textBase
      }
    }, p.title)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'block',
        fontSize: '12px',
        color: C.textMuted,
        marginBottom: '4px'
      }
    }, "Job ID"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '14px',
        fontWeight: 500,
        color: C.textBase
      }
    }, p._id)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'block',
        fontSize: '12px',
        color: C.textMuted,
        marginBottom: '4px'
      }
    }, "Department"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '14px',
        fontWeight: 500,
        color: C.textBase
      }
    }, p.department || 'General')), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'block',
        fontSize: '12px',
        color: C.textMuted,
        marginBottom: '4px'
      }
    }, "Employment Type"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        background: typeStyle.bg,
        color: typeStyle.text
      }
    }, jobType)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        display: 'block',
        fontSize: '12px',
        color: C.textMuted,
        marginBottom: '4px'
      }
    }, "Location"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: '14px',
        fontWeight: 500,
        color: C.textBase
      }
    }, p.location)))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow,
        padding: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        fontSize: '15px',
        fontWeight: 600,
        color: C.textBase,
        margin: '0 0 20px 0',
        borderBottom: `1px solid ${C.border}`,
        paddingBottom: '12px'
      }
    }, "Activity Timeline"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        position: 'absolute',
        left: '7px',
        top: '10px',
        bottom: '10px',
        width: '2px',
        background: C.border
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: C.blue,
        border: `3px solid ${C.white}`
      }
    }), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '13px',
        fontWeight: 600,
        color: C.textBase
      }
    }, "Job created"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '11px',
        color: C.textMuted
      }
    }, postedDate, " by Admin"))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: C.border,
        border: `3px solid ${C.white}`
      }
    }), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '13px',
        fontWeight: 500,
        color: C.textBase
      }
    }, "Published on Careers Portal"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '11px',
        color: C.textMuted
      }
    }, postedDate, " - System")))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: '2',
        minWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow,
        padding: '24px',
        flexGrow: 1
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        fontSize: '18px',
        fontWeight: 600,
        color: C.textBase,
        margin: '0 0 24px 0'
      }
    }, "Job Description"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '14.5px',
        color: '#4B5563',
        lineHeight: '1.7',
        whiteSpace: 'pre-wrap'
      }
    }, p.description || "No description provided for this job listing.")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: C.white,
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        boxShadow: C.cardShadow,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("button", {
      onClick: () => alert('Link Copied!'),
      style: {
        height: '36px',
        padding: '0 16px',
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 600,
        color: C.textBase,
        cursor: 'pointer'
      }
    }, "Copy Link"), /*#__PURE__*/React__default.default.createElement("button", {
      onClick: handlePrint,
      style: {
        height: '36px',
        padding: '0 16px',
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 600,
        color: C.textBase,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React__default.default.createElement(Icons.Printer, null), " Download PDF"), /*#__PURE__*/React__default.default.createElement("a", {
      href: `/admin/resources/JobPosting/records/${p._id}/edit`,
      style: {
        textDecoration: 'none'
      }
    }, /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        height: '36px',
        padding: '0 16px',
        background: C.primary,
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 600,
        color: C.white,
        cursor: 'pointer'
      }
    }, "Edit Configuration"))))));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.Sidebar = Sidebar;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.JobShow = JobShow;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9EYXNoYm9hcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvU2lkZWJhci5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Mb2dpbi5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Kb2JTaG93LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyDilIDilIAgQ29sb3IgVG9rZW5zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgQyA9IHtcbiAgYmc6ICcjRjVGN0ZBJyxcbiAgY2FyZDogJyNGRkZGRkYnLFxuICBib3JkZXI6ICcjRTVFN0VCJyxcbiAgYm9yZGVyTGlnaHQ6ICcjRjNGNEY2JyxcbiAgcHJpbWFyeTogJyMyNTYzRUInLFxuICBwcmltYXJ5SG92ZXI6ICcjMUQ0RUQ4JyxcbiAgcHJpbWFyeUxpZ2h0OiAnI0VGRjZGRicsXG4gIGdyYXk6ICcjNkI3MjgwJyxcbiAgZ3JheUxpZ2h0OiAnIzlDQTNBRicsXG4gIGdyYXlCZzogJyNGOUZBRkInLFxuICBzdWNjZXNzOiAnIzIyQzU1RScsXG4gIHN1Y2Nlc3NMaWdodDogJyNGMEZERjQnLFxuICB3YXJuaW5nOiAnI0Y1OUUwQicsXG4gIHdhcm5pbmdMaWdodDogJyNGRkZCRUInLFxuICBkYW5nZXI6ICcjRUY0NDQ0JyxcbiAgZGFuZ2VyTGlnaHQ6ICcjRkVGMkYyJyxcbiAgdGV4dDogJyMxMTE4MjcnLFxuICB0ZXh0U3ViOiAnIzM3NDE1MScsXG4gIHRleHRNdXRlZDogJyM2QjcyODAnLFxufTtcblxuLy8g4pSA4pSAIFR5cG9ncmFwaHkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBUID0ge1xuICBoMTogeyBmb250U2l6ZTogJzI0cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQsIG1hcmdpbjogMCwgbGV0dGVyU3BhY2luZzogJy0wLjAxZW0nIH0sXG4gIGgyOiB7IGZvbnRTaXplOiAnMThweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dCwgbWFyZ2luOiAwIH0sXG4gIGgzOiB7IGZvbnRTaXplOiAnMTZweCcsIGZvbnRXZWlnaHQ6IDUwMCwgY29sb3I6IEMudGV4dCwgbWFyZ2luOiAwIH0sXG4gIGJvZHk6IHsgZm9udFNpemU6ICcxNHB4JywgZm9udFdlaWdodDogNDAwLCBjb2xvcjogQy50ZXh0U3ViIH0sXG4gIHNtYWxsOiB7IGZvbnRTaXplOiAnMTJweCcsIGZvbnRXZWlnaHQ6IDQwMCwgY29sb3I6IEMudGV4dE11dGVkIH0sXG4gIGxhYmVsOiB7IGZvbnRTaXplOiAnMTJweCcsIGZvbnRXZWlnaHQ6IDUwMCwgY29sb3I6IEMudGV4dE11dGVkLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgbGV0dGVyU3BhY2luZzogJzAuMDZlbScgfSxcbn07XG5cbi8vIOKUgOKUgCBCYXNlIENhcmQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBjYXJkID0ge1xuICBiYWNrZ3JvdW5kOiBDLmNhcmQsXG4gIGJvcmRlclJhZGl1czogJzEycHgnLFxuICBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLFxuICBib3hTaGFkb3c6ICcwIDFweCAzcHggcmdiYSgwLDAsMCwwLjA0KScsXG4gIHBhZGRpbmc6ICcyMHB4Jyxcbn07XG5cbi8vIOKUgOKUgCBTVkc6IExpbmUgQ2hhcnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBMaW5lQ2hhcnQgPSAoeyBkYXRhLCBsYWJlbHMsIGNvbG9yID0gQy5wcmltYXJ5LCBoZWlnaHQgPSAxMjAgfSkgPT4ge1xuICBjb25zdCBXID0gNDAwLCBIID0gaGVpZ2h0LCBwYWQgPSA4O1xuICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kYXRhKSwgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XG4gIGNvbnN0IHJhbmdlID0gbWF4IC0gbWluIHx8IDE7XG4gIGNvbnN0IHB0cyA9IGRhdGEubWFwKCh2LCBpKSA9PiB7XG4gICAgY29uc3QgeCA9IHBhZCArIChpIC8gKGRhdGEubGVuZ3RoIC0gMSkpICogKFcgLSBwYWQgKiAyKTtcbiAgICBjb25zdCB5ID0gSCAtIHBhZCAtICgodiAtIG1pbikgLyByYW5nZSkgKiAoSCAtIHBhZCAqIDIpO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH0pO1xuICBjb25zdCBwb2x5bGluZSA9IHB0cy5tYXAocCA9PiBwLmpvaW4oJywnKSkuam9pbignICcpO1xuICBjb25zdCBhcmVhID0gYE0ke3B0c1swXVswXX0sJHtIfSBgICsgcHRzLm1hcChwID0+IGBMJHtwWzBdfSwke3BbMV19YCkuam9pbignICcpICsgYCBMJHtwdHNbcHRzLmxlbmd0aCAtIDFdWzBdfSwke0h9IFpgO1xuICByZXR1cm4gKFxuICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6IGAke0h9cHhgIH19IHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCI+XG4gICAgICA8ZGVmcz5cbiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPVwibGdcIiB4MT1cIjBcIiB5MT1cIjBcIiB4Mj1cIjBcIiB5Mj1cIjFcIj5cbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMC4xMlwiIC8+XG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMFwiIC8+XG4gICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gICAgICA8L2RlZnM+XG4gICAgICA8cGF0aCBkPXthcmVhfSBmaWxsPVwidXJsKCNsZylcIiAvPlxuICAgICAgPHBvbHlsaW5lIHBvaW50cz17cG9seWxpbmV9IGZpbGw9XCJub25lXCIgc3Ryb2tlPXtjb2xvcn0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgICB7cHRzLm1hcCgocCwgaSkgPT4gPGNpcmNsZSBrZXk9e2l9IGN4PXtwWzBdfSBjeT17cFsxXX0gcj1cIjNcIiBmaWxsPXtDLmNhcmR9IHN0cm9rZT17Y29sb3J9IHN0cm9rZVdpZHRoPVwiMS41XCIgLz4pfVxuICAgICAge2xhYmVscyAmJiBsYWJlbHMubWFwKChsLCBpKSA9PiAoXG4gICAgICAgIDx0ZXh0IGtleT17aX0geD17cHRzW2ldWzBdfSB5PXtIIC0gMX0gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRTaXplPVwiOVwiIGZpbGw9e0MuZ3JheUxpZ2h0fT57bH08L3RleHQ+XG4gICAgICApKX1cbiAgICA8L3N2Zz5cbiAgKTtcbn07XG5cbi8vIOKUgOKUgCBTVkc6IEJhciBDaGFydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IEJhckNoYXJ0ID0gKHsgZGF0YSwgbGFiZWxzLCBjb2xvciA9IEMucHJpbWFyeSwgaGVpZ2h0ID0gMTIwIH0pID0+IHtcbiAgY29uc3QgVyA9IDQwMCwgSCA9IGhlaWdodCwgZ2FwID0gNiwgcGFkID0gMTY7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRhdGEpIHx8IDE7XG4gIGNvbnN0IGJ3ID0gKFcgLSBwYWQgKiAyIC0gZ2FwICogKGRhdGEubGVuZ3RoIC0gMSkpIC8gZGF0YS5sZW5ndGg7XG4gIHJldHVybiAoXG4gICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogYCR7SH1weGAgfX0gcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIj5cbiAgICAgIHtkYXRhLm1hcCgodiwgaSkgPT4ge1xuICAgICAgICBjb25zdCBiaCA9ICgodiAvIG1heCkgKiAoSCAtIDI0KSk7XG4gICAgICAgIGNvbnN0IHggPSBwYWQgKyBpICogKGJ3ICsgZ2FwKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZyBrZXk9e2l9PlxuICAgICAgICAgICAgPHJlY3QgeD17eH0geT17SCAtIGJoIC0gMTR9IHdpZHRoPXtid30gaGVpZ2h0PXtiaH0gcng9XCI0XCIgZmlsbD17Y29sb3J9IGZpbGxPcGFjaXR5PVwiMC4xNVwiIC8+XG4gICAgICAgICAgICA8cmVjdCB4PXt4fSB5PXtIIC0gYmggLSAxNH0gd2lkdGg9e2J3fSBoZWlnaHQ9ezR9IHJ4PVwiMlwiIGZpbGw9e2NvbG9yfSAvPlxuICAgICAgICAgICAge2xhYmVscyAmJiA8dGV4dCB4PXt4ICsgYncgLyAyfSB5PXtIIC0gMn0gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRTaXplPVwiOVwiIGZpbGw9e0MuZ3JheUxpZ2h0fT57bGFiZWxzW2ldfTwvdGV4dD59XG4gICAgICAgICAgPC9nPlxuICAgICAgICApO1xuICAgICAgfSl9XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG4vLyDilIDilIAgU1ZHOiBEb3VnaG51dCBDaGFydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IERvdWdobnV0Q2hhcnQgPSAoeyBkYXRhLCBjb2xvcnMsIHNpemUgPSAxMjAgfSkgPT4ge1xuICBjb25zdCB0b3RhbCA9IGRhdGEucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgfHwgMTtcbiAgY29uc3QgY3ggPSBzaXplIC8gMiwgY3kgPSBzaXplIC8gMiwgciA9IHNpemUgKiAwLjM4LCBpciA9IHNpemUgKiAwLjI0O1xuICBsZXQgYW5nbGUgPSAtTWF0aC5QSSAvIDI7XG4gIGNvbnN0IHNsaWNlcyA9IGRhdGEubWFwKCh2LCBpKSA9PiB7XG4gICAgY29uc3Qgc3dlZXAgPSAodiAvIHRvdGFsKSAqIDIgKiBNYXRoLlBJO1xuICAgIGNvbnN0IHgxID0gY3ggKyByICogTWF0aC5jb3MoYW5nbGUpLCB5MSA9IGN5ICsgciAqIE1hdGguc2luKGFuZ2xlKTtcbiAgICBhbmdsZSArPSBzd2VlcDtcbiAgICBjb25zdCB4MiA9IGN4ICsgciAqIE1hdGguY29zKGFuZ2xlKSwgeTIgPSBjeSArIHIgKiBNYXRoLnNpbihhbmdsZSk7XG4gICAgY29uc3QgbGFyZ2UgPSBzd2VlcCA+IE1hdGguUEkgPyAxIDogMDtcbiAgICBjb25zdCB4aTEgPSBjeCArIGlyICogTWF0aC5jb3MoYW5nbGUgLSBzd2VlcCksIHlpMSA9IGN5ICsgaXIgKiBNYXRoLnNpbihhbmdsZSAtIHN3ZWVwKTtcbiAgICBjb25zdCB4aTIgPSBjeCArIGlyICogTWF0aC5jb3MoYW5nbGUpLCB5aTIgPSBjeSArIGlyICogTWF0aC5zaW4oYW5nbGUpO1xuICAgIHJldHVybiB7IGQ6IGBNJHt4MX0sJHt5MX0gQSR7cn0sJHtyfSAwICR7bGFyZ2V9LDEgJHt4Mn0sJHt5Mn0gTCR7eGkyfSwke3lpMn0gQSR7aXJ9LCR7aXJ9IDAgJHtsYXJnZX0sMCAke3hpMX0sJHt5aTF9IFpgLCBjb2xvcjogY29sb3JzW2ldIH07XG4gIH0pO1xuICByZXR1cm4gKFxuICAgIDxzdmcgdmlld0JveD17YDAgMCAke3NpemV9ICR7c2l6ZX1gfSBzdHlsZT17eyB3aWR0aDogYCR7c2l6ZX1weGAsIGhlaWdodDogYCR7c2l6ZX1weGAgfX0+XG4gICAgICB7c2xpY2VzLm1hcCgocywgaSkgPT4gPHBhdGgga2V5PXtpfSBkPXtzLmR9IGZpbGw9e3MuY29sb3J9IC8+KX1cbiAgICAgIDxjaXJjbGUgY3g9e2N4fSBjeT17Y3l9IHI9e2lyIC0gMn0gZmlsbD17Qy5jYXJkfSAvPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuLy8g4pSA4pSAIEJhZGdlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgQmFkZ2UgPSAoeyBsYWJlbCwgdHlwZSA9ICdkZWZhdWx0JyB9KSA9PiB7XG4gIGNvbnN0IG1hcCA9IHtcbiAgICBzdWNjZXNzOiB7IGJnOiBDLnN1Y2Nlc3NMaWdodCwgY29sb3I6IEMuc3VjY2VzcyB9LFxuICAgIHdhcm5pbmc6IHsgYmc6IEMud2FybmluZ0xpZ2h0LCBjb2xvcjogQy53YXJuaW5nIH0sXG4gICAgZGFuZ2VyOiB7IGJnOiBDLmRhbmdlckxpZ2h0LCBjb2xvcjogQy5kYW5nZXIgfSxcbiAgICBwcmltYXJ5OiB7IGJnOiBDLnByaW1hcnlMaWdodCwgY29sb3I6IEMucHJpbWFyeSB9LFxuICAgIGRlZmF1bHQ6IHsgYmc6IEMuZ3JheUJnLCBjb2xvcjogQy5ncmF5IH0sXG4gIH07XG4gIGNvbnN0IHsgYmcsIGNvbG9yIH0gPSBtYXBbdHlwZV0gfHwgbWFwLmRlZmF1bHQ7XG4gIHJldHVybiAoXG4gICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBhZGRpbmc6ICcycHggMTBweCcsIGJvcmRlclJhZGl1czogJzk5OXB4JywgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNTAwLCBiYWNrZ3JvdW5kOiBiZywgY29sb3IsIGJvcmRlcjogYDFweCBzb2xpZCAke2NvbG9yfTIyYCB9fT5cbiAgICAgIHtsYWJlbH1cbiAgICA8L3NwYW4+XG4gICk7XG59O1xuXG4vLyDilIDilIAgQnV0dG9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgQnRuID0gKHsgY2hpbGRyZW4sIHZhcmlhbnQgPSAncHJpbWFyeScsIG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBzdHlsZXMgPSB7XG4gICAgcHJpbWFyeTogeyBiYWNrZ3JvdW5kOiBDLnByaW1hcnksIGNvbG9yOiAnI2ZmZicsIGJvcmRlcjogYDFweCBzb2xpZCAke0MucHJpbWFyeX1gIH0sXG4gICAgc2Vjb25kYXJ5OiB7IGJhY2tncm91bmQ6IEMuY2FyZCwgY29sb3I6IEMuZ3JheSwgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCB9LFxuICAgIGdob3N0OiB7IGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsIGNvbG9yOiBDLnByaW1hcnksIGJvcmRlcjogYDFweCBzb2xpZCAke0MucHJpbWFyeX1gIH0sXG4gIH07XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfSBzdHlsZT17eyAuLi5zdHlsZXNbdmFyaWFudF0sIHBhZGRpbmc6ICc3cHggMTRweCcsIGJvcmRlclJhZGl1czogJzhweCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDUwMCwgY3Vyc29yOiAncG9pbnRlcicsIGZvbnRGYW1pbHk6ICdpbmhlcml0JywgdHJhbnNpdGlvbjogJ29wYWNpdHkgMC4xNXMnIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvYnV0dG9uPlxuICApO1xufTtcblxuLy8g4pSA4pSAIFNlY3Rpb24gRGl2aWRlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IFNlY3Rpb25IZWFkZXIgPSAoeyB0aXRsZSwgYWN0aW9uIH0pID0+IChcbiAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT5cbiAgICA8aDIgc3R5bGU9e1QuaDJ9Pnt0aXRsZX08L2gyPlxuICAgIHthY3Rpb24gJiYgPEJ0biB2YXJpYW50PVwiZ2hvc3RcIj57YWN0aW9ufTwvQnRuPn1cbiAgPC9kaXY+XG4pO1xuXG4vLyDilIDilIAgTWFpbiBEYXNoYm9hcmQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGZldGNoKCcvYXBpL2FkbWluL2Rhc2hib2FyZC1zdGF0cycpXG4gICAgICAudGhlbihyID0+IHIuanNvbigpKVxuICAgICAgLnRoZW4oanNvbiA9PiBzZXREYXRhKGpzb24pKVxuICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdEYXNoYm9hcmQgZXJyb3I6JywgZXJyKSlcbiAgICAgIC5maW5hbGx5KCgpID0+IHNldExvYWRpbmcoZmFsc2UpKTtcbiAgfSwgW10pO1xuXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBtaW5IZWlnaHQ6ICc2MHZoJywgZm9udEZhbWlseTogJ0ludGVyLCBzeXN0ZW0tdWksIHNhbnMtc2VyaWYnIH19PlxuICAgICAgPGRpdiBzdHlsZT17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMzZweCcsIGhlaWdodDogJzM2cHgnLCBib3JkZXI6IGAzcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3JkZXJUb3A6IGAzcHggc29saWQgJHtDLnByaW1hcnl9YCwgYm9yZGVyUmFkaXVzOiAnNTAlJywgbWFyZ2luOiAnMCBhdXRvIDEycHgnLCBhbmltYXRpb246ICdzcGluIDAuOHMgbGluZWFyIGluZmluaXRlJyB9fSAvPlxuICAgICAgICA8c3R5bGU+e2BAa2V5ZnJhbWVzIHNwaW4geyB0byB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH0gfWB9PC9zdHlsZT5cbiAgICAgICAgPHAgc3R5bGU9e3sgLi4uVC5ib2R5LCBjb2xvcjogQy5ncmF5TGlnaHQgfX0+TG9hZGluZyBkYXNoYm9hcmQuLi48L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICBjb25zdCBzdGF0cyA9IGRhdGE/LnN0YXRzIHx8IHt9O1xuICBjb25zdCBwcm9qZWN0cyA9IGRhdGE/LnByb2plY3RzIHx8IFtdO1xuICBjb25zdCB0YXNrcyA9IGRhdGE/LnRhc2tzIHx8IFtdO1xuICBjb25zdCBmaW5hbmNlID0gZGF0YT8uZmluYW5jZSB8fCBbXTtcbiAgY29uc3QgYWN0aXZpdGllcyA9IGRhdGE/LmFjdGl2aXRpZXMgfHwgW107XG4gIGNvbnN0IG1lZXRpbmdzID0gZGF0YT8ubWVldGluZ3MgfHwgW107XG5cbiAgY29uc3QgcmV2ZW51ZSA9IHN0YXRzLm1vbnRobHlSZXZlbnVlIHx8IDE5NTAwMDtcbiAgY29uc3QgcmV2ZW51ZURhdGEgPSBbMTQ4MDAwLCAxNjIwMDAsIDE3NTAwMCwgMTU5MDAwLCAxODgwMDAsIHJldmVudWVdO1xuICBjb25zdCByZXZMYWJlbHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJ107XG4gIGNvbnN0IGF0dGVuZERhdGEgPSBbOTIsIDk1LCA4OCwgOTQsIDkxLCA3NSwgNDBdO1xuICBjb25zdCBhdHRlbmRMYWJlbHMgPSBbJ01vJywgJ1R1JywgJ1dlJywgJ1RoJywgJ0ZyJywgJ1NhJywgJ1N1J107XG4gIGNvbnN0IHRvdGFsRXhwID0gZmluYW5jZS5maWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdFeHBlbnNlJykucmVkdWNlKChhLCBmKSA9PiBhICsgZi5hbW91bnQsIDApO1xuICBjb25zdCB0b3RhbFJldiA9IGZpbmFuY2UuZmlsdGVyKGYgPT4gZi50eXBlID09PSAnUmV2ZW51ZScpLnJlZHVjZSgoYSwgZikgPT4gYSArIGYuYW1vdW50LCAwKTtcblxuICBjb25zdCBzdGF0Q2FyZHMgPSBbXG4gICAgeyBpY29uOiAn8J+RpScsIGxhYmVsOiAnVG90YWwgRW1wbG95ZWVzJywgdmFsdWU6IHN0YXRzLnRvdGFsRW1wbG95ZWVzIHx8IDUsIHN1YjogJ0FjdGl2ZSBzdGFmZicsIGJhZGdlOiAnQWN0aXZlJywgYmFkZ2VUeXBlOiAnc3VjY2VzcycgfSxcbiAgICB7IGljb246ICfwn46TJywgbGFiZWw6ICdUb3RhbCBJbnRlcm5zJywgdmFsdWU6IHN0YXRzLnRvdGFsSW50ZXJucyB8fCAyLCBzdWI6ICdBY3RpdmUgaW50ZXJucycsIGJhZGdlOiAnQWN0aXZlJywgYmFkZ2VUeXBlOiAnc3VjY2VzcycgfSxcbiAgICB7IGljb246ICfwn5OBJywgbGFiZWw6ICdBY3RpdmUgUHJvamVjdHMnLCB2YWx1ZTogc3RhdHMuYWN0aXZlUHJvamVjdHMgfHwgMiwgc3ViOiAnT25nb2luZyB3b3JrJywgYmFkZ2U6ICdJbiBQcm9ncmVzcycsIGJhZGdlVHlwZTogJ3ByaW1hcnknIH0sXG4gICAgeyBpY29uOiAn4piR77iPJywgbGFiZWw6ICdQZW5kaW5nIFRhc2tzJywgdmFsdWU6IHN0YXRzLnBlbmRpbmdUYXNrcyB8fCA0LCBzdWI6ICdBd2FpdGluZyBhY3Rpb24nLCBiYWRnZTogJ1BlbmRpbmcnLCBiYWRnZVR5cGU6ICd3YXJuaW5nJyB9LFxuICAgIHsgaWNvbjogJ+KCuScsIGxhYmVsOiAnTW9udGhseSBSZXZlbnVlJywgdmFsdWU6IFwi4oK5XCIgKyAoc3RhdHMubW9udGhseVJldmVudWUgfHwgMTk1MDAwKS50b0xvY2FsZVN0cmluZygnZW4tSU4nKSwgc3ViOiAndnMgbGFzdCBtb250aCcsIGJhZGdlOiAnKzE4JScsIGJhZGdlVHlwZTogJ3N1Y2Nlc3MnIH0sXG4gICAgeyBpY29uOiAn8J+ThCcsIGxhYmVsOiAnUGVuZGluZyBJbnZvaWNlcycsIHZhbHVlOiBcIuKCuVwiICsgKHN0YXRzLnBlbmRpbmdQYXltZW50cyB8fCAzMjAwMCkudG9Mb2NhbGVTdHJpbmcoJ2VuLUlOJyksIHN1YjogJ0F3YWl0aW5nIHBheW1lbnQnLCBiYWRnZTogJ1VucGFpZCcsIGJhZGdlVHlwZTogJ2RhbmdlcicgfSxcbiAgICB7IGljb246ICfwn5OFJywgbGFiZWw6ICdBdHRlbmRhbmNlIFJhdGUnLCB2YWx1ZTogKHN0YXRzLmF0dGVuZGFuY2VSYXRlIHx8IDk1KSArIFwiJVwiLCBzdWI6IFwiVG9kYXkncyBwcmVzZW5jZVwiLCBiYWRnZTogJ0dvb2QnLCBiYWRnZVR5cGU6ICdzdWNjZXNzJyB9LFxuICAgIHsgaWNvbjogJ/Cfk6knLCBsYWJlbDogJ05ldyBMZWFkcycsIHZhbHVlOiBzdGF0cy5uZXdDbGllbnRSZXF1ZXN0cyB8fCAwLCBzdWI6ICdDbGllbnQgcmVxdWVzdHMnLCBiYWRnZTogJ1RvZGF5JywgYmFkZ2VUeXBlOiAnZGVmYXVsdCcgfSxcbiAgXTtcblxuICBjb25zdCB0TWV0cmljcyA9IHN0YXRzLnRpY2tldE1ldHJpY3MgfHwgeyB0b3RhbDogMCwgb3BlbjogMCwgY2xvc2VkOiAwLCB1cmdlbnQ6IDAsIHBlbmRpbmc6IDAgfTtcbiAgY29uc3QgdGlja2V0Q2FyZHMgPSBbXG4gICAgeyBpY29uOiAn8J+TqCcsIGxhYmVsOiAnVG90YWwgVGlja2V0cycsIHZhbHVlOiB0TWV0cmljcy50b3RhbCwgc3ViOiAnQWxsIHRpY2tldHMnIH0sXG4gICAgeyBpY29uOiAn4o+zJywgbGFiZWw6ICdJbiBQcm9ncmVzcycsIHZhbHVlOiB0TWV0cmljcy5wZW5kaW5nLCBzdWI6ICdQZW5kaW5nIHJlc29sdXRpb24nIH0sXG4gICAgeyBpY29uOiAn4pyFJywgbGFiZWw6ICdDbG9zZWQgVGlja2V0cycsIHZhbHVlOiB0TWV0cmljcy5jbG9zZWQsIHN1YjogJ1Jlc29sdmVkJyB9LFxuICAgIHsgaWNvbjogJ/CfmqgnLCBsYWJlbDogJ1VyZ2VudCBUaWNrZXRzJywgdmFsdWU6IHRNZXRyaWNzLnVyZ2VudCwgc3ViOiAnQWN0aW9uIG5lZWRlZCcgfSxcbiAgXTtcblxuICBjb25zdCBsYXlvdXQgPSB7XG4gICAgcGFnZTogeyBtaW5IZWlnaHQ6ICcxMDB2aCcsIGJhY2tncm91bmQ6IEMuYmcsIHBhZGRpbmc6ICcyNHB4IDI4cHgnLCBmb250RmFtaWx5OiBcIidJbnRlcicsICdTZWdvZSBVSScsIHN5c3RlbS11aSwgc2Fucy1zZXJpZlwiLCBjb2xvcjogQy50ZXh0LCBib3hTaXppbmc6ICdib3JkZXItYm94JyB9LFxuICAgIGdyaWQ0OiB7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdCg0LCAxZnIpJywgZ2FwOiAnMTZweCcgfSxcbiAgICBncmlkNjogeyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoNiwgMWZyKScsIGdhcDogJzE2cHgnLCBtYXJnaW5Cb3R0b206ICcyNHB4JyB9LFxuICAgIGdyaWQyXzE6IHsgZGlzcGxheTogJ2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOiAnMWZyIDM0MHB4JywgZ2FwOiAnMjBweCcgfSxcbiAgICBncmlkMjogeyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICcxZnIgMWZyJywgZ2FwOiAnMTZweCcgfSxcbiAgICBjb2w6IHsgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMjBweCcgfSxcbiAgICByb3c6IHsgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMTBweCcgfSxcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e2xheW91dC5wYWdlfT5cbiAgICAgIDxzdHlsZT57YFxuICAgICAgICAqIHsgYm94LXNpemluZzogYm9yZGVyLWJveDsgfVxuICAgICAgICBAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1JbnRlcjp3Z2h0QDQwMDs1MDA7NjAwJmRpc3BsYXk9c3dhcCcpO1xuICAgICAgICBidXR0b246aG92ZXIgeyBvcGFjaXR5OiAwLjg1OyB9XG4gICAgICAgIHRyOmhvdmVyIHRkIHsgYmFja2dyb3VuZDogI0Y5RkFGQjsgfVxuICAgICAgYH08L3N0eWxlPlxuXG4gICAgICB7Lyog4pSA4pSAIFBhZ2UgSGVhZGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMjRweCcgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGgxIHN0eWxlPXtULmgxfT5EYXNoYm9hcmQ8L2gxPlxuICAgICAgICAgIDxwIHN0eWxlPXt7IC4uLlQuYm9keSwgY29sb3I6IEMudGV4dE11dGVkLCBtYXJnaW5Ub3A6ICc0cHgnIH19PlxuICAgICAgICAgICAge25ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1JTicsIHsgd2Vla2RheTogJ2xvbmcnLCB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnbG9uZycsIGRheTogJ251bWVyaWMnIH0pfVxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMTBweCcgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBiYWNrZ3JvdW5kOiBDLmNhcmQsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzhweCcsIHBhZGRpbmc6ICc3cHggMTJweCcgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEzcHgnLCBjb2xvcjogQy5ncmF5IH19PvCflI08L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJTZWFyY2guLi5cIiBzdHlsZT17eyBib3JkZXI6ICdub25lJywgb3V0bGluZTogJ25vbmUnLCBmb250U2l6ZTogJzEzcHgnLCBjb2xvcjogQy50ZXh0U3ViLCBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLCB3aWR0aDogJzE2MHB4JyB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIGJhY2tncm91bmQ6IEMuY2FyZCwgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm9yZGVyUmFkaXVzOiAnOHB4JywgcGFkZGluZzogJzhweCAxMnB4JywgY3Vyc29yOiAncG9pbnRlcicsIGZvbnRTaXplOiAnMTVweCcgfX0+XG4gICAgICAgICAgICDwn5SUXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnNXB4JywgcmlnaHQ6ICc1cHgnLCB3aWR0aDogJzdweCcsIGhlaWdodDogJzdweCcsIGJhY2tncm91bmQ6IEMuZGFuZ2VyLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBib3JkZXI6IGAxLjVweCBzb2xpZCAke0MuY2FyZH1gIH19IC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JywgYmFja2dyb3VuZDogQy5jYXJkLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBwYWRkaW5nOiAnNnB4IDEycHggNnB4IDhweCcgfX0+XG4gICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPU11bmVlcytXYXJhbiZiYWNrZ3JvdW5kPTI1NjNFQiZjb2xvcj1mZmYmc2l6ZT0zMiZmb250LXNpemU9MC40XCIgc3R5bGU9e3sgd2lkdGg6ICczMnB4JywgaGVpZ2h0OiAnMzJweCcsIGJvcmRlclJhZGl1czogJzZweCcgfX0gYWx0PVwiYXZhdGFyXCIgLz5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0IH19Pk11bmVlcyBXYXJhbjwvcD5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzExcHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQgfX0+U3VwZXIgQWRtaW48L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTBweCcsIGNvbG9yOiBDLmdyYXlMaWdodCB9fT7ilrw8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiDilIDilIAgU3RhdCBDYXJkcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgKi99XG4gICAgICA8ZGl2IHN0eWxlPXtsYXlvdXQuZ3JpZDR9PlxuICAgICAgICB7c3RhdENhcmRzLm1hcCgocywgaSkgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtpfSBzdHlsZT17Y2FyZH0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLCBtYXJnaW5Cb3R0b206ICcxMnB4JyB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzM2cHgnLCBoZWlnaHQ6ICczNnB4JywgYm9yZGVyUmFkaXVzOiAnOHB4JywgYmFja2dyb3VuZDogQy5ncmF5QmcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZm9udFNpemU6ICcxOHB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCB9fT5cbiAgICAgICAgICAgICAgICB7cy5pY29ufVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPEJhZGdlIGxhYmVsPXtzLmJhZGdlfSB0eXBlPXtzLmJhZGdlVHlwZX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgLi4uVC5sYWJlbCwgbWFyZ2luQm90dG9tOiAnNnB4JyB9fT57cy5sYWJlbH08L3A+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogJzI4cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQsIG1hcmdpbjogJzAgMCA0cHgnLCBsZXR0ZXJTcGFjaW5nOiAnLTAuMDJlbScsIGxpbmVIZWlnaHQ6IDEgfX0+e3MudmFsdWV9PC9wPlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgLi4uVC5zbWFsbCwgbWFyZ2luVG9wOiAnNHB4JyB9fT57cy5zdWJ9PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzI4cHgnIH19IC8+XG5cbiAgICAgIHsvKiDilIDilIAgU3VwcG9ydCBUaWNrZXRzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMjRweCcgfX0+XG4gICAgICAgIDxTZWN0aW9uSGVhZGVyIHRpdGxlPVwiVGlja2V0IFN1cHBvcnQgQ2VudGVyXCIgYWN0aW9uPVwiVmlldyBBbGwgVGlja2V0c1wiIC8+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KDQsIDFmciknLCBnYXA6ICcxNnB4JyB9fT5cbiAgICAgICAgICB7dGlja2V0Q2FyZHMubWFwKChzLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gc3R5bGU9e2NhcmR9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLCBnYXA6ICcxNHB4JyB9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNDBweCcsIGhlaWdodDogJzQwcHgnLCBib3JkZXJSYWRpdXM6ICcxMHB4JywgYmFja2dyb3VuZDogQy5wcmltYXJ5TGlnaHQsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZm9udFNpemU6ICcyMHB4JywgY29sb3I6IEMucHJpbWFyeSB9fT5cbiAgICAgICAgICAgICAgICAgIHtzLmljb259XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IC4uLlQubGFiZWwsIG1hcmdpbkJvdHRvbTogJzJweCcsIGNvbG9yOiBDLmdyYXkgfX0+e3MubGFiZWx9PC9wPlxuICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6ICcyNHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0LCBtYXJnaW46ICcwJyB9fT57cy52YWx1ZX08L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMjRweCcgfX0gLz5cblxuICAgICAgey8qIOKUgOKUgCBDaGFydHMgUm93IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e2xheW91dC5ncmlkMn0+XG4gICAgICAgIHsvKiBSZXZlbnVlIExpbmUgQ2hhcnQgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmR9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e1QuaDJ9PlJldmVudWUgT3ZlcnZpZXc8L2gyPlxuICAgICAgICAgICAgICA8cCBzdHlsZT17eyAuLi5ULnNtYWxsLCBtYXJnaW5Ub3A6ICczcHgnIH19Pk1vbnRobHkgcmV2ZW51ZSB0cmVuZCDigJQgMjAyNjwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPEJhZGdlIGxhYmVsPVwiWWVhciAyMDI2XCIgdHlwZT1cInByaW1hcnlcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxMaW5lQ2hhcnQgZGF0YT17cmV2ZW51ZURhdGF9IGxhYmVscz17cmV2TGFiZWxzfSBjb2xvcj17Qy5wcmltYXJ5fSBoZWlnaHQ9ezEzMH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvKiBBdHRlbmRhbmNlIEJhciBDaGFydCAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17VC5oMn0+QXR0ZW5kYW5jZSBSYXRlPC9oMj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgLi4uVC5zbWFsbCwgbWFyZ2luVG9wOiAnM3B4JyB9fT5UaGlzIHdlZWsg4oCUICUgcHJlc2VudDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPEJhZGdlIGxhYmVsPVwiVGhpcyBXZWVrXCIgdHlwZT1cImRlZmF1bHRcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxCYXJDaGFydCBkYXRhPXthdHRlbmREYXRhfSBsYWJlbHM9e2F0dGVuZExhYmVsc30gY29sb3I9e0MucHJpbWFyeX0gaGVpZ2h0PXsxMzB9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMjRweCcgfX0gLz5cblxuICAgICAgey8qIOKUgOKUgCBNYWluIENvbnRlbnQgR3JpZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgKi99XG4gICAgICA8ZGl2IHN0eWxlPXtsYXlvdXQuZ3JpZDJfMX0+XG5cbiAgICAgICAgey8qIExlZnQ6IFByb2plY3RzIFRhYmxlICsgS2FuYmFuICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXtsYXlvdXQuY29sfT5cblxuICAgICAgICAgIHsvKiBQcm9qZWN0cyBUYWJsZSAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkfT5cbiAgICAgICAgICAgIDxTZWN0aW9uSGVhZGVyIHRpdGxlPVwiUHJvamVjdHNcIiBhY3Rpb249XCJWaWV3IEFsbFwiIC8+XG4gICAgICAgICAgICA8dGFibGUgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgYm9yZGVyQ29sbGFwc2U6ICdjb2xsYXBzZScsIGZvbnRTaXplOiAnMTRweCcgfX0+XG4gICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9e3sgYmFja2dyb3VuZDogQy5ncmF5QmcsIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAgfX0+XG4gICAgICAgICAgICAgICAgICB7WydQcm9qZWN0IE5hbWUnLCAnQ2xpZW50JywgJ0RlYWRsaW5lJywgJ1Byb2dyZXNzJywgJ1N0YXR1cyddLm1hcChoID0+IChcbiAgICAgICAgICAgICAgICAgICAgPHRoIGtleT17aH0gc3R5bGU9e3sgcGFkZGluZzogJzEwcHggMTJweCcsIHRleHRBbGlnbjogJ2xlZnQnLCBmb250U2l6ZTogJzEycHgnLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiBDLnRleHRNdXRlZCwgZm9udEZhbWlseTogJ2luaGVyaXQnLCBib3JkZXJCb3R0b206IGAxcHggc29saWQgJHtDLmJvcmRlcn1gIH19PntofTwvdGg+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAge3Byb2plY3RzLm1hcCgocCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgYlR5cGUgPSBwLnN0YXR1cyA9PT0gJ0NvbXBsZXRlZCcgPyAnc3VjY2VzcycgOiBwLnN0YXR1cyA9PT0gJ0luIFByb2dyZXNzJyA/ICdwcmltYXJ5JyA6ICd3YXJuaW5nJztcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCcsIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0MuYm9yZGVyTGlnaHR9YCB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMTBweCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICczMnB4JywgaGVpZ2h0OiAnMzJweCcsIGJvcmRlclJhZGl1czogJzhweCcsIGJhY2tncm91bmQ6IEMucHJpbWFyeUxpZ2h0LCBjb2xvcjogQy5wcmltYXJ5LCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGZvbnRXZWlnaHQ6IDYwMCwgZm9udFNpemU6ICcxNHB4JywgZmxleFNocmluazogMCB9fT57cC5uYW1lPy5bMF19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDUwMCwgY29sb3I6IEMudGV4dCB9fT57cC5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4JywgY29sb3I6IEMuZ3JheSwgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJMaWdodH1gIH19PntwLmNsaWVudH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCcsIGNvbG9yOiBDLmdyYXksIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0MuYm9yZGVyTGlnaHR9YCwgZm9udFNpemU6ICcxM3B4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShwLmRlYWRsaW5lKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywgeyBkYXk6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcsIHllYXI6ICcyLWRpZ2l0JyB9KX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCcsIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0MuYm9yZGVyTGlnaHR9YCB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBoZWlnaHQ6ICc2cHgnLCBiYWNrZ3JvdW5kOiBDLmdyYXlCZywgYm9yZGVyUmFkaXVzOiAnOTk5cHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBvdmVyZmxvdzogJ2hpZGRlbicsIG1pbldpZHRoOiAnODBweCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDAlJywgd2lkdGg6IGAke3AucHJvZ3Jlc3N9JWAsIGJhY2tncm91bmQ6IHAuc3RhdHVzID09PSAnQ29tcGxldGVkJyA/IEMuc3VjY2VzcyA6IEMucHJpbWFyeSwgYm9yZGVyUmFkaXVzOiAnOTk5cHgnLCB0cmFuc2l0aW9uOiAnd2lkdGggMC42cyBlYXNlJyB9fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMnB4JywgY29sb3I6IEMudGV4dE11dGVkLCBtaW5XaWR0aDogJzMycHgnIH19PntwLnByb2dyZXNzfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCcsIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0MuYm9yZGVyTGlnaHR9YCB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxCYWRnZSBsYWJlbD17cC5zdGF0dXN9IHR5cGU9e2JUeXBlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBUYXNrcyAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkfT5cbiAgICAgICAgICAgIDxTZWN0aW9uSGVhZGVyIHRpdGxlPVwiUGVuZGluZyBUYXNrc1wiIGFjdGlvbj1cIkFkZCBUYXNrXCIgLz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnOHB4JyB9fT5cbiAgICAgICAgICAgICAge3Rhc2tzLm1hcCgodCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBUeXBlID0gdC5wcmlvcml0eSA9PT0gJ1VyZ2VudCcgPyAnZGFuZ2VyJyA6IHQucHJpb3JpdHkgPT09ICdIaWdoJyA/ICd3YXJuaW5nJyA6ICdkZWZhdWx0JztcbiAgICAgICAgICAgICAgICBjb25zdCBzVHlwZSA9IHQuc3RhdHVzID09PSAnSW4gUHJvZ3Jlc3MnID8gJ3ByaW1hcnknIDogJ2RlZmF1bHQnO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aX0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgcGFkZGluZzogJzEycHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBiYWNrZ3JvdW5kOiBDLmdyYXlCZyB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTZweCcsIGhlaWdodDogJzE2cHgnLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBib3JkZXI6IGAycHggc29saWQgJHtDLmJvcmRlcn1gLCBmbGV4U2hyaW5rOiAwIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgLi4uVC5ib2R5LCBjb2xvcjogQy50ZXh0LCBmb250V2VpZ2h0OiA1MDAgfX0+e3QudGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzhweCcsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgICAgICAgICAgIDxCYWRnZSBsYWJlbD17dC5wcmlvcml0eX0gdHlwZT17cFR5cGV9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPEJhZGdlIGxhYmVsPXt0LnN0YXR1c30gdHlwZT17c1R5cGV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIFJpZ2h0IFNpZGViYXIgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e2xheW91dC5jb2x9PlxuXG4gICAgICAgICAgey8qIEZpbmFuY2UgU3VtbWFyeSB3aXRoIERvdWdobnV0ICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmR9PlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkZXIgdGl0bGU9XCJFeHBlbnNlcyBCcmVha2Rvd25cIiAvPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxNnB4JyB9fT5cbiAgICAgICAgICAgICAgPERvdWdobnV0Q2hhcnRcbiAgICAgICAgICAgICAgICBkYXRhPXtbdG90YWxSZXYgfHwgMTk1MDAwLCB0b3RhbEV4cCB8fCA0NzAwMF19XG4gICAgICAgICAgICAgICAgY29sb3JzPXtbQy5wcmltYXJ5LCBDLmRhbmdlcl19XG4gICAgICAgICAgICAgICAgc2l6ZT17MTAwfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzEwcHgnLCBmbGV4OiAxIH19PlxuICAgICAgICAgICAgICAgIHtbXG4gICAgICAgICAgICAgICAgICB7IGxhYmVsOiAnUmV2ZW51ZScsIHZhbHVlOiBg4oK5JHsodG90YWxSZXYgfHwgMTk1MDAwKS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1gLCBjb2xvcjogQy5wcmltYXJ5IH0sXG4gICAgICAgICAgICAgICAgICB7IGxhYmVsOiAnRXhwZW5zZXMnLCB2YWx1ZTogYOKCuSR7KHRvdGFsRXhwIHx8IDQ3MDAwKS50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1gLCBjb2xvcjogQy5kYW5nZXIgfSxcbiAgICAgICAgICAgICAgICBdLm1hcCgoaXRlbSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTBweCcsIGhlaWdodDogJzEwcHgnLCBib3JkZXJSYWRpdXM6ICcycHgnLCBiYWNrZ3JvdW5kOiBpdGVtLmNvbG9yIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1Quc21hbGx9PntpdGVtLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dCB9fT57aXRlbS52YWx1ZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAnMTZweCcsIGJvcmRlclRvcDogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIHBhZGRpbmdUb3A6ICcxNHB4JywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnOHB4JyB9fT5cbiAgICAgICAgICAgICAge2ZpbmFuY2UubWFwKChmLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTNweCcgfX0+e2YudHlwZSA9PT0gJ1JldmVudWUnID8gJ+KGkScgOiAn4oaTJ308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IC4uLlQuc21hbGwsIGNvbG9yOiBDLnRleHRTdWIgfX0+e2YuY2F0ZWdvcnl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBmLnR5cGUgPT09ICdSZXZlbnVlJyA/IEMuc3VjY2VzcyA6IEMuZGFuZ2VyIH19PlxuICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnUmV2ZW51ZScgPyAnKycgOiAnLSd94oK5e2YuYW1vdW50Py50b0xvY2FsZVN0cmluZygnZW4tSU4nKX1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBNZWV0aW5ncyAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkfT5cbiAgICAgICAgICAgIDxTZWN0aW9uSGVhZGVyIHRpdGxlPVwiVXBjb21pbmcgTWVldGluZ3NcIiBhY3Rpb249XCJTY2hlZHVsZVwiIC8+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzEwcHgnIH19PlxuICAgICAgICAgICAgICB7bWVldGluZ3MubGVuZ3RoID09PSAwICYmIDxwIHN0eWxlPXt7IC4uLlQuc21hbGwsIHRleHRBbGlnbjogJ2NlbnRlcicsIHBhZGRpbmc6ICcxNnB4IDAnIH19Pk5vIHVwY29taW5nIG1lZXRpbmdzPC9wPn1cbiAgICAgICAgICAgICAge21lZXRpbmdzLm1hcCgobSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMnB4JywgcGFkZGluZzogJzEycHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3JkZXJSYWRpdXM6ICc4cHgnIH19PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzM2cHgnLCBoZWlnaHQ6ICczNnB4JywgYm9yZGVyUmFkaXVzOiAnOHB4JywgYmFja2dyb3VuZDogQy5wcmltYXJ5TGlnaHQsIGNvbG9yOiBDLnByaW1hcnksIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZm9udFNpemU6ICcxNnB4JywgZmxleFNocmluazogMCB9fT7wn5O5PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0IH19PnttLnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAnMnB4IDAgMCcsIGZvbnRTaXplOiAnMTJweCcsIGNvbG9yOiBDLnRleHRNdXRlZCB9fT57bS50aW1lfSDCtyB7bS5wYXJ0aWNpcGFudHM/Lmxlbmd0aCB8fCAwfSBwYXJ0aWNpcGFudHM8L3A+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxCYWRnZSBsYWJlbD1cIlRvZGF5XCIgdHlwZT1cInByaW1hcnlcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIEFjdGl2aXR5IEZlZWQgKi99XG4gICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZH0+XG4gICAgICAgICAgICA8U2VjdGlvbkhlYWRlciB0aXRsZT1cIlJlY2VudCBBY3Rpdml0eVwiIC8+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzAnIH19PlxuICAgICAgICAgICAgICB7YWN0aXZpdGllcy5tYXAoKGFjdCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzEycHgnLCBwYWRkaW5nOiAnMTJweCAwJywgYm9yZGVyQm90dG9tOiBpIDwgYWN0aXZpdGllcy5sZW5ndGggLSAxID8gYDFweCBzb2xpZCAke0MuYm9yZGVyTGlnaHR9YCA6ICdub25lJyB9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICczMnB4JywgaGVpZ2h0OiAnMzJweCcsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmQ6IEMucHJpbWFyeUxpZ2h0LCBjb2xvcjogQy5wcmltYXJ5LCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDcwMCwgZmxleFNocmluazogMCB9fT5cbiAgICAgICAgICAgICAgICAgICAge2FjdC51c2VyPy5bMF0gfHwgJz8nfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46IDAsIGZvbnRTaXplOiAnMTNweCcsIGNvbG9yOiBDLnRleHQsIGxpbmVIZWlnaHQ6IDEuNSB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCB9fT57YWN0LnVzZXJ9PC9zdHJvbmc+IHthY3QuYWN0aW9ufSA8c3BhbiBzdHlsZT17eyBjb2xvcjogQy5wcmltYXJ5LCBmb250V2VpZ2h0OiA1MDAgfX0+e2FjdC50YXJnZXR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogJzNweCAwIDAnLCBmb250U2l6ZTogJzExcHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge25ldyBEYXRlKGFjdC50aW1lKS50b0xvY2FsZVRpbWVTdHJpbmcoW10sIHsgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyB9KX0gdG9kYXlcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbi8vIOKUgOKUgCBJY29ucyAoUHVyZSBTVkcgZm9yIDEwMCUgY29tcGF0aWJpbGl0eSkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBJY29uID0ge1xuICBIUjogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0xNiAyMXYtMmE0IDQgMCAwIDAtNC00SDZhNCA0IDAgMCAwLTQgNHYyXCIgLz48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiN1wiIHI9XCI0XCIgLz48cGF0aCBkPVwiTTIyIDIxdi0yYTQgNCAwIDAgMC0zLTMuODdcIiAvPjxwYXRoIGQ9XCJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1XCIgLz48L3N2Zz4sXG4gIFJlY3J1aXQ6IChzID0gMTgpID0+IDxzdmcgd2lkdGg9e3N9IGhlaWdodD17c30gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI2XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMlwiLz48L3N2Zz4sXG4gIE9wczogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHJlY3QgeD1cIjJcIiB5PVwiN1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIxNFwiIHJ4PVwiMlwiIHJ5PVwiMlwiIC8+PHBhdGggZD1cIk0xNiAyMVY1YTIgMiAwIDAgMC0yLTJoLTRhMiAyIDAgMCAwLTIgMnYxNlwiIC8+PC9zdmc+LFxuICBTdXBwOiAocyA9IDE4KSA9PiA8c3ZnIHdpZHRoPXtzfSBoZWlnaHQ9e3N9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIgLz48cGF0aCBkPVwiTTkuMDkgOWEzIDMgMCAwIDEgNS44MyAxYzAgMi0zIDMtMyAzXCIgLz48bGluZSB4MT1cIjEyXCIgeTE9XCIxN1wiIHgyPVwiMTIuMDFcIiB5Mj1cIjE3XCIgLz48L3N2Zz4sXG4gIEZpbjogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PGxpbmUgeDE9XCIxMlwiIHkxPVwiMVwiIHgyPVwiMTJcIiB5Mj1cIjIzXCIgLz48cGF0aCBkPVwiTTE3IDVIOS41YTMuNSAzLjUgMCAwIDAgMCA3aDVhMy41IDMuNSAwIDAgMSAwIDdINlwiIC8+PC9zdmc+LFxuICBTYWxlczogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIm0yMiAyLTcgMjAtNC05LTktNFpcIiAvPjxwYXRoIGQ9XCJNMjIgMiAxMSAxM1wiIC8+PC9zdmc+LFxuICBTeXM6IChzID0gMTgpID0+IDxzdmcgd2lkdGg9e3N9IGhlaWdodD17c30gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTIgMjJzOC00IDgtMTBWNWwtOC0zLTggM3Y3YzAgNiA4IDEwIDggMTBaXCIgLz48L3N2Zz4sXG4gIERhc2g6IChzID0gMTgpID0+IDxzdmcgd2lkdGg9e3N9IGhlaWdodD17c30gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxyZWN0IHg9XCIzXCIgeT1cIjNcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCI3XCIgLz48cmVjdCB4PVwiMTRcIiB5PVwiM1wiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIiAvPjxyZWN0IHg9XCIxNFwiIHk9XCIxNFwiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIiAvPjxyZWN0IHg9XCIzXCIgeT1cIjE0XCIgd2lkdGg9XCI3XCIgaGVpZ2h0PVwiN1wiIC8+PC9zdmc+LFxuICBEb3duOiAocyA9IDE0KSA9PiA8c3ZnIHdpZHRoPXtzfSBoZWlnaHQ9e3N9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwibTYgOSA2IDYgNi02XCIgLz48L3N2Zz4sXG4gIFJpZ2h0OiAocyA9IDE0KSA9PiA8c3ZnIHdpZHRoPXtzfSBoZWlnaHQ9e3N9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwibTkgMTggNi02LTYtNlwiIC8+PC9zdmc+LFxuICBPdXQ6IChzID0gMTgpID0+IDxzdmcgd2lkdGg9e3N9IGhlaWdodD17c30gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDRcIiAvPjxwb2x5bGluZSBwb2ludHM9XCIxNiAxNyAyMSAxMiAxNiA3XCIgLz48bGluZSB4MT1cIjIxXCIgeTE9XCIxMlwiIHgyPVwiOVwiIHkyPVwiMTJcIiAvPjwvc3ZnPixcbn07XG5cbi8vIOKUgOKUgCBDb2xvcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBDID0ge1xuICBiZzogJyNGOEZBRkMnLFxuICB3aGl0ZTogJyNGRkZGRkYnLFxuICBib3JkZXI6ICcjRTVFN0VCJyxcbiAgcHJpbWFyeTogJyMyNTYzRUInLFxuICBwcmltYXJ5TGlnaHQ6ICcjRUVGNEZGJyxcbiAgdGV4dDogJyMxMTE4MjcnLFxuICB0ZXh0TXV0ZWQ6ICcjNkI3MjgwJyxcbiAgdGV4dERpbTogJyM5Q0EzQUYnLFxufTtcblxuY29uc3QgU2lkZWJhciA9IChwcm9wcykgPT4ge1xuICBjb25zdCBbaXNDb2xsYXBzZWQsIHNldElzQ29sbGFwc2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW29wZW5TZWN0aW9ucywgc2V0T3BlblNlY3Rpb25zXSA9IHVzZVN0YXRlKHsgJ0hSIE1hbmFnZW1lbnQnOiB0cnVlLCAnT3BlcmF0aW9ucyc6IHRydWUgfSk7XG5cbiAgY29uc3QgdG9nZ2xlU2VjdGlvbiA9IChuYW1lKSA9PiB7XG4gICAgc2V0T3BlblNlY3Rpb25zKHByZXYgPT4gKHsgLi4ucHJldiwgW25hbWVdOiAhcHJldltuYW1lXSB9KSk7XG4gIH07XG5cbiAgY29uc3QgbmF2ID0gW1xuICAgIHtcbiAgICAgIG5hbWU6ICdIUiBNYW5hZ2VtZW50JywgaWNvbjogSWNvbi5IUigpLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBuYW1lOiAnRW1wbG95ZWVzJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvRW1wbG95ZWUnIH0sXG4gICAgICAgIHsgbmFtZTogJ0ludGVybnMnLCBwYXRoOiAnL2FkbWluL3Jlc291cmNlcy9JbnRlcm4nIH0sXG4gICAgICAgIHsgbmFtZTogJ0F0dGVuZGFuY2UnLCBwYXRoOiAnL2FkbWluL3Jlc291cmNlcy9BdHRlbmRhbmNlJyB9LFxuICAgICAgICB7IG5hbWU6ICdMZWF2ZSBSZXF1ZXN0cycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL0xlYXZlUmVxdWVzdCcgfSxcbiAgICAgICAgeyBuYW1lOiAnUGF5cm9sbCcsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL1BheXJvbGwnIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnUmVjcnVpdG1lbnQnLCBpY29uOiBJY29uLlJlY3J1aXQoKSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbmFtZTogJ0pvYiBQb3N0aW5ncycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL0pvYlBvc3RpbmcnIH0sXG4gICAgICAgIHsgbmFtZTogJ0FwcGxpY2F0aW9ucycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL0pvYkFwcGxpY2F0aW9uJyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ09wZXJhdGlvbnMnLCBpY29uOiBJY29uLk9wcygpLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBuYW1lOiAnUHJvamVjdHMnLCBwYXRoOiAnL2FkbWluL3Jlc291cmNlcy9Qcm9qZWN0JyB9LFxuICAgICAgICB7IG5hbWU6ICdUYXNrcycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL1Rhc2snIH0sXG4gICAgICAgIHsgbmFtZTogJ01lZXRpbmdzJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvTWVldGluZycgfSxcbiAgICAgICAgeyBuYW1lOiAnQ2FsZW5kYXInLCBwYXRoOiAnIycgfSxcbiAgICAgICAgeyBuYW1lOiAnVGVhbSBBY3Rpdml0eScsIHBhdGg6ICcjJyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ1N1cHBvcnQnLCBpY29uOiBJY29uLlN1cHAoKSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbmFtZTogJ1RpY2tldHMnLCBwYXRoOiAnL2FkbWluL3Jlc291cmNlcy9UaWNrZXQnIH0sXG4gICAgICAgIHsgbmFtZTogJ0xpdmUgQ2hhdCcsIHBhdGg6ICcjJyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0ZpbmFuY2UnLCBpY29uOiBJY29uLkZpbigpLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBuYW1lOiAnUmV2ZW51ZScsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL0ZpbmFuY2UnIH0sXG4gICAgICAgIHsgbmFtZTogJ0ludm9pY2VzJywgcGF0aDogJyMnIH0sXG4gICAgICAgIHsgbmFtZTogJ0JpbGxzJywgcGF0aDogJyMnIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnU2FsZXMnLCBpY29uOiBJY29uLlNhbGVzKCksXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IG5hbWU6ICdMZWFkcycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL0NsaWVudFJlcXVlc3QnIH0sXG4gICAgICAgIHsgbmFtZTogJ0RlYWxzJywgcGF0aDogJyMnIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnU3lzdGVtJywgaWNvbjogSWNvbi5TeXMoKSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbmFtZTogJ1NldHRpbmdzJywgcGF0aDogJyMnIH0sXG4gICAgICAgIHsgbmFtZTogJ0FkbWluIEFjY291bnQnLCBwYXRoOiAnL2FkbWluL3Jlc291cmNlcy9NYW5hZ2VyJyB9LFxuICAgICAgXVxuICAgIH1cbiAgXTtcblxuICBjb25zdCBjdXJyZW50UGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIHdpZHRoOiBpc0NvbGxhcHNlZCA/ICc3MnB4JyA6ICcyNjBweCcsXG4gICAgICBoZWlnaHQ6ICcxMDB2aCcsXG4gICAgICBiYWNrZ3JvdW5kOiBDLmJnLFxuICAgICAgYm9yZGVyUmlnaHQ6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLFxuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICBmbGV4U2hyaW5rOiAwLFxuICAgICAgdHJhbnNpdGlvbjogJ3dpZHRoIDAuM3MgZWFzZScsXG4gICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgIGZvbnRGYW1pbHk6IFwiJ0ludGVyJywgc2Fucy1zZXJpZlwiXG4gICAgfX0+XG4gICAgICB7Lyog4pSA4pSAIEJyYW5kIOKUgOKUgCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogaXNDb2xsYXBzZWQgPyAnMjRweCAwJyA6ICcyNHB4IDE2cHgnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgcG9zaXRpb246ICdyZWxhdGl2ZScsIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIG1hcmdpbkJvdHRvbTogJzEycHgnIH19PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldElzQ29sbGFwc2VkKCFpc0NvbGxhcHNlZCl9IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogJy0xMnB4JywgdG9wOiAnMjRweCcsIHdpZHRoOiAnMjRweCcsIGhlaWdodDogJzI0cHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kOiBDLndoaXRlLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGN1cnNvcjogJ3BvaW50ZXInLCBib3hTaGFkb3c6ICcwIDJweCA0cHggcmdiYSgwLDAsMCwwLjA4KScsIHpJbmRleDogMTAgfX0+XG4gICAgICAgICAge2lzQ29sbGFwc2VkID8gSWNvbi5SaWdodCgxMikgOiA8c3ZnIHdpZHRoPVwiMTJcIiBoZWlnaHQ9XCIxMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiPjxwYXRoIGQ9XCJtMTUgMTgtNi02IDYtNlwiIC8+PC9zdmc+fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogaXNDb2xsYXBzZWQgPyAnNDBweCcgOiAnNTJweCcsIGhlaWdodDogaXNDb2xsYXBzZWQgPyAnNDBweCcgOiAnNTJweCcsIG1hcmdpbkJvdHRvbTogaXNDb2xsYXBzZWQgPyAwIDogJzEycHgnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAgICA8aW1nIHNyYz1cIi9sb2dvLnBuZ1wiIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBvYmplY3RGaXQ6ICdjb250YWluJyB9fSBhbHQ9XCJMb2dvXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHshaXNDb2xsYXBzZWQgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxoMSBzdHlsZT17eyBtYXJnaW46IDAsIGZvbnRTaXplOiAnMThweCcsIGZvbnRXZWlnaHQ6IDcwMCwgY29sb3I6IEMudGV4dCB9fT5hdmVycW9uIEhSTVM8L2gxPlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAnMnB4IDAgMCcsIGZvbnRTaXplOiAnMTFweCcsIGNvbG9yOiBDLnRleHRNdXRlZCwgZm9udFdlaWdodDogNTAwIH19PlNtYXJ0IEJ1c2luZXNzIE1hbmFnZW1lbnQ8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIOKUgOKUgCBOYXYg4pSA4pSAICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBvdmVyZmxvd1k6ICdhdXRvJywgcGFkZGluZzogJzAgMTJweCcsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzZweCcgfX0+XG4gICAgICAgIDxhIGhyZWY9XCIvYWRtaW5cIiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMnB4JywgcGFkZGluZzogJzEwcHggMTJweCcsIGJvcmRlclJhZGl1czogJzEwcHgnLCB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBjb2xvcjogY3VycmVudFBhdGggPT09ICcvYWRtaW4nID8gQy5wcmltYXJ5IDogQy50ZXh0LCBiYWNrZ3JvdW5kOiBjdXJyZW50UGF0aCA9PT0gJy9hZG1pbicgPyBDLndoaXRlIDogJ3RyYW5zcGFyZW50JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Y3VycmVudFBhdGggPT09ICcvYWRtaW4nID8gQy5ib3JkZXIgOiAndHJhbnNwYXJlbnQnfWAsIGJveFNoYWRvdzogY3VycmVudFBhdGggPT09ICcvYWRtaW4nID8gJzAgMXB4IDJweCByZ2JhKDAsMCwwLDAuMDUpJyA6ICdub25lJyB9fT5cbiAgICAgICAgICB7SWNvbi5EYXNoKDE4KX1cbiAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTRweCcsIGZvbnRXZWlnaHQ6IDYwMCB9fT5EYXNoYm9hcmQ8L3NwYW4+fVxuICAgICAgICA8L2E+XG5cbiAgICAgICAge25hdi5tYXAoKHNlYywgaWR4KSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2lkeH0+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZVNlY3Rpb24oc2VjLm5hbWUpfSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBwYWRkaW5nOiAnMTBweCAxMnB4JywgYm9yZGVyUmFkaXVzOiAnMTBweCcsIGJvcmRlcjogJ25vbmUnLCBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLCBjdXJzb3I6ICdwb2ludGVyJywgY29sb3I6IEMudGV4dCB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMnB4JyB9fT5cbiAgICAgICAgICAgICAgICB7c2VjLmljb259XG4gICAgICAgICAgICAgICAgeyFpc0NvbGxhcHNlZCAmJiA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAgfX0+e3NlYy5uYW1lfTwvc3Bhbj59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIDxkaXYgc3R5bGU9e3sgdHJhbnNmb3JtOiBvcGVuU2VjdGlvbnNbc2VjLm5hbWVdID8gJ3JvdGF0ZSgwZGVnKScgOiAncm90YXRlKC05MGRlZyknLCB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDAuMnMnIH19PntJY29uLkRvd24oMTIpfTwvZGl2Pn1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgeyFpc0NvbGxhcHNlZCAmJiBvcGVuU2VjdGlvbnNbc2VjLm5hbWVdICYmIChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW46ICc0cHggMCA4cHgnLCBwYWRkaW5nOiAnNHB4JywgYmFja2dyb3VuZDogQy53aGl0ZSwgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzJweCcgfX0+XG4gICAgICAgICAgICAgICAge3NlYy5pdGVtcy5tYXAoKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IGN1cnJlbnRQYXRoID09PSBpdGVtLnBhdGg7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8YSBrZXk9e2l9IGhyZWY9e2l0ZW0ucGF0aH0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMTBweCcsIHBhZGRpbmc6ICc4cHggMTJweCcsIGJvcmRlclJhZGl1czogJzhweCcsIHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiBhY3RpdmUgPyBDLnByaW1hcnkgOiBDLnRleHRNdXRlZCwgYmFja2dyb3VuZDogYWN0aXZlID8gQy5wcmltYXJ5TGlnaHQgOiAndHJhbnNwYXJlbnQnLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiBhY3RpdmUgPyA2MDAgOiA0MDAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzRweCcsIGhlaWdodDogJzRweCcsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmQ6IGFjdGl2ZSA/IEMucHJpbWFyeSA6IEMudGV4dERpbSB9fSAvPlxuICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIOKUgOKUgCBQcm9maWxlIOKUgOKUgCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzE2cHgnLCBib3JkZXJUb3A6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JyB9fT5cbiAgICAgICAgPGltZyBzcmM9XCJodHRwczovL3VpLWF2YXRhcnMuY29tL2FwaS8/bmFtZT1BZG1pbiZiYWNrZ3JvdW5kPTI1NjNFQiZjb2xvcj1mZmYmc2l6ZT0zNlwiIHN0eWxlPXt7IHdpZHRoOiAnMzZweCcsIGhlaWdodDogJzM2cHgnLCBib3JkZXJSYWRpdXM6ICcxMHB4JyB9fSAvPlxuICAgICAgICB7IWlzQ29sbGFwc2VkICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0LCB3aGl0ZVNwYWNlOiAnbm93cmFwJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+QWRtaW4gVXNlcjwvcD5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcxMXB4JywgY29sb3I6IEMudGV4dE11dGVkIH19PlN1cGVyIEFkbWluPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICB7IWlzQ29sbGFwc2VkICYmIDxhIGhyZWY9XCIvYWRtaW4vbG9nb3V0XCIgc3R5bGU9e3sgY29sb3I6IEMudGV4dERpbSB9fT57SWNvbi5PdXQoMTYpfTwvYT59XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNpZGViYXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG4vLyDilIDilIAgQ29sb3JzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgQyA9IHtcbiAgYmc6ICcjRjVGN0ZBJyxcbiAgd2hpdGU6ICcjRkZGRkZGJyxcbiAgYm9yZGVyOiAnI0U1RTdFQicsXG4gIHByaW1hcnk6ICcjMjU2M0VCJyxcbiAgcHJpbWFyeUhvdmVyOiAnIzFENEVEOCcsXG4gIHRleHQ6ICcjMTExODI3JyxcbiAgdGV4dE11dGVkOiAnIzZCNzI4MCcsXG59O1xuXG5jb25zdCBMb2dpbiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IGFjdGlvbiwgbWVzc2FnZSwgYnJhbmRpbmcgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e1xuICAgICAgbWluSGVpZ2h0OiAnMTAwdmgnLFxuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICBiYWNrZ3JvdW5kOiBDLmJnLFxuICAgICAgZm9udEZhbWlseTogXCInSW50ZXInLCBzYW5zLXNlcmlmXCIsXG4gICAgICBwYWRkaW5nOiAnMjBweCdcbiAgICB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgbWF4V2lkdGg6ICc0MjBweCcsXG4gICAgICAgIGJhY2tncm91bmQ6IEMud2hpdGUsXG4gICAgICAgIGJvcmRlclJhZGl1czogJzE2cHgnLFxuICAgICAgICBib3hTaGFkb3c6ICcwIDEwcHggMjVweCAtNXB4IHJnYmEoMCwgMCwgMCwgMC4wNSksIDAgOHB4IDEwcHggLTZweCByZ2JhKDAsIDAsIDAsIDAuMDUpJyxcbiAgICAgICAgcGFkZGluZzogJzQwcHgnLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLFxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gICAgICB9fT5cbiAgICAgICAgey8qIExvZ28gU2VjdGlvbiAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICczMnB4JyB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IFxuICAgICAgICAgICAgaGVpZ2h0OiAnNjRweCcsIFxuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLCBcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzE2cHgnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIi9sb2dvLnBuZ1wiIHN0eWxlPXt7IFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJywgXG4gICAgICAgICAgICAgIG9iamVjdEZpdDogJ2NvbnRhaW4nIFxuICAgICAgICAgICAgfX0gYWx0PVwiTG9nb1wiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGgxIHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcyNHB4JywgZm9udFdlaWdodDogNzAwLCBjb2xvcjogQy50ZXh0IH19PldlbGNvbWUgQmFjazwvaDE+XG4gICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAnOHB4IDAgMCcsIGZvbnRTaXplOiAnMTRweCcsIGNvbG9yOiBDLnRleHRNdXRlZCB9fT5cbiAgICAgICAgICAgIEVudGVyIHlvdXIgY3JlZGVudGlhbHMgdG8gYWNjZXNzIHRoZSBhZG1pbiBwb3J0YWwuXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogRXJyb3IgTWVzc2FnZSAqL31cbiAgICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6ICcxMnB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkVGMkYyJyxcbiAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjRkVFMkUyJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgICAgICBjb2xvcjogJyM5OTFCMUInLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzI0cHgnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7bWVzc2FnZS5tZXNzYWdlfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBGb3JtICovfVxuICAgICAgICA8Zm9ybSBhY3Rpb249e2FjdGlvbn0gbWV0aG9kPVwiUE9TVFwiIHN0eWxlPXt7IHRleHRBbGlnbjogJ2xlZnQnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMjBweCcgfX0+XG4gICAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgbWFyZ2luQm90dG9tOiAnOHB4JywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0IH19PlxuICAgICAgICAgICAgICBFbWFpbCBBZGRyZXNzXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIG5hbWU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiYWRtaW5AYXZlcm9uLmFpXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxMnB4IDE2cHgnLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCxcbiAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYm9yZGVyLWNvbG9yIDAuMnMnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkZvY3VzPXsoZSkgPT4gZS50YXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBDLnByaW1hcnl9XG4gICAgICAgICAgICAgIG9uQmx1cj17KGUpID0+IGUudGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gQy5ib3JkZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcyOHB4JyB9fT5cbiAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Cb3R0b206ICc4cHgnLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQgfX0+XG4gICAgICAgICAgICAgIFBhc3N3b3JkXG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi4oCi4oCi4oCi4oCi4oCi4oCi4oCi4oCiXCJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxMnB4IDE2cHgnLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCxcbiAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYm9yZGVyLWNvbG9yIDAuMnMnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkZvY3VzPXsoZSkgPT4gZS50YXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBDLnByaW1hcnl9XG4gICAgICAgICAgICAgIG9uQmx1cj17KGUpID0+IGUudGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gQy5ib3JkZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAnMTRweCcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IEMucHJpbWFyeSxcbiAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogJzE1cHgnLFxuICAgICAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYmFja2dyb3VuZCAwLjJzJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggNnB4IC0xcHggcmdiYSgzNywgOTksIDIzNSwgMC4yKSdcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiBlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gQy5wcmltYXJ5SG92ZXJ9XG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiBlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gQy5wcmltYXJ5fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIExvZ2luIHRvIFdvcmtzcGFjZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICczMnB4JywgYm9yZGVyVG9wOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgcGFkZGluZ1RvcDogJzIwcHgnIH19PlxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMTJweCcsIGNvbG9yOiBDLnRleHRNdXRlZCwgbWFyZ2luOiAwIH19PlxuICAgICAgICAgICAgUG93ZXJlZCBieSA8c3Ryb25nPkF2ZXJvbiBIUk1TIEVuZ2luZTwvc3Ryb25nPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2luO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQyA9IHtcbiAgYmc6ICcjRjVGN0ZBJyxcbiAgd2hpdGU6ICcjRkZGRkZGJyxcbiAgYm9yZGVyOiAnI0U1RTdFQicsXG4gIHByaW1hcnk6ICcjMjU2M0VCJyxcbiAgdGV4dEJhc2U6ICcjMTExODI3JyxcbiAgdGV4dE11dGVkOiAnIzZCNzI4MCcsXG4gIHRleHRMaWdodDogJyM5Q0EzQUYnLFxuICBncmVlbjogJyMxMEI5ODEnLFxuICBibHVlOiAnIzNCODJGNicsXG4gIG9yYW5nZTogJyNGNTlFMEInLFxuICBwdXJwbGU6ICcjOEI1Q0Y2JyxcbiAgcmVkOiAnI0VGNDQ0NCcsXG4gIGNhcmRTaGFkb3c6ICcwIDFweCAzcHggcmdiYSgwLDAsMCwwLjA1KSwgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4wMyknLFxufTtcblxuLy8gLS0tIFNWRyBJY29ucyAtLS1cbmNvbnN0IEljb25zID0ge1xuICBCcmllZmNhc2U6ICgpID0+IDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxyZWN0IHg9XCIyXCIgeT1cIjdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMTRcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk0xNiAyMVY1YTIgMiAwIDAgMC0yLTJoLTRhMiAyIDAgMCAwLTIgMnYxNlwiLz48L3N2Zz4sXG4gIE1hcFBpbjogKCkgPT4gPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMCAxMGMwIDQuOTkzLTUuNTM5IDEwLjE5My03LjM5OSAxMS43OTlhMSAxIDAgMCAxLTEuMjAyIDBDOS41MzkgMjAuMTkzIDQgMTQuOTkzIDQgMTBhOCA4IDAgMCAxIDE2IDBaXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTBcIiByPVwiM1wiLz48L3N2Zz4sXG4gIEJ1aWxkaW5nOiAoKSA9PiA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cmVjdCB4PVwiNFwiIHk9XCIyXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjIwXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxwYXRoIGQ9XCJNOSAyMnYtNGg2djRcIi8+PHBhdGggZD1cIk04IDZoLjAxXCIvPjxwYXRoIGQ9XCJNMTYgNmguMDFcIi8+PHBhdGggZD1cIk0xMiA2aC4wMVwiLz48cGF0aCBkPVwiTTEyIDEwaC4wMVwiLz48cGF0aCBkPVwiTTEyIDE0aC4wMVwiLz48cGF0aCBkPVwiTTE2IDEwaC4wMVwiLz48cGF0aCBkPVwiTTE2IDE0aC4wMVwiLz48cGF0aCBkPVwiTTggMTBoLjAxXCIvPjxwYXRoIGQ9XCJNOCAxNGguMDFcIi8+PC9zdmc+LFxuICBDYWxlbmRhcjogKCkgPT4gPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHJlY3QgeD1cIjNcIiB5PVwiNFwiIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48bGluZSB4MT1cIjE2XCIgeTE9XCIyXCIgeDI9XCIxNlwiIHkyPVwiNlwiLz48bGluZSB4MT1cIjhcIiB5MT1cIjJcIiB4Mj1cIjhcIiB5Mj1cIjZcIi8+PGxpbmUgeDE9XCIzXCIgeTE9XCIxMFwiIHgyPVwiMjFcIiB5Mj1cIjEwXCIvPjwvc3ZnPixcbiAgQWN0aXZpdHk6ICgpID0+IDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwb2x5bGluZSBwb2ludHM9XCIyMiAxMiAxOCAxMiAxNSAyMSA5IDMgNiAxMiAyIDEyXCIvPjwvc3ZnPixcbiAgQ29weTogKCkgPT4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHJlY3QgeD1cIjlcIiB5PVwiOVwiIHdpZHRoPVwiMTNcIiBoZWlnaHQ9XCIxM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTUgMTVINGEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg5YTIgMiAwIDAgMSAyIDJ2MVwiLz48L3N2Zz4sXG4gIFByaW50ZXI6ICgpID0+IDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwb2x5bGluZSBwb2ludHM9XCI2IDkgNiAyIDE4IDIgMTggOVwiLz48cGF0aCBkPVwiTTYgMThINGEyIDIgMCAwIDEtMi0ydi01YTIgMiAwIDAgMSAyLTJoMTZhMiAyIDAgMCAxIDIgMnY1YTIgMiAwIDAgMS0yIDJoLTJcIi8+PHJlY3QgeD1cIjZcIiB5PVwiMTRcIiB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiOFwiLz48L3N2Zz4sXG4gIEVkaXQ6ICgpID0+IDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTIgMjBoOVwiLz48cGF0aCBkPVwiTTE2LjUgMy41YTIuMTIgMi4xMiAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNFpcIi8+PC9zdmc+LFxuICBUcmFzaDogKCkgPT4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0yVjZtMyAwVjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeTE9XCIxMVwiIHgyPVwiMTBcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB5MT1cIjExXCIgeDI9XCIxNFwiIHkyPVwiMTdcIi8+PC9zdmc+LFxuICBDaGVjazogKCkgPT4gPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMCA2IDkgMTdsLTUtNVwiLz48L3N2Zz5cbn07XG5cbmNvbnN0IEpvYlNob3cgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQgfSA9IHByb3BzO1xuICBjb25zdCBwID0gcmVjb3JkLnBhcmFtcztcblxuICAvLyBGb3JtYXR0aW5nIGhlbHBlcnNcbiAgY29uc3QgcG9zdGVkRGF0ZSA9IG5ldyBEYXRlKHAucG9zdGVkRGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1VUycsIHsgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnLCB5ZWFyOiAnbnVtZXJpYycgfSk7XG4gIGNvbnN0IGlzQWN0aXZlID0gcC5pc0FjdGl2ZSA9PT0gdHJ1ZSB8fCBwLmlzQWN0aXZlID09PSAndHJ1ZSc7XG4gIGNvbnN0IGpvYlR5cGUgPSBwLnR5cGUgfHwgJ04vQSc7XG5cbiAgY29uc3QgZ2V0Sm9iVHlwZUNvbG9yID0gKCkgPT4ge1xuICAgIHN3aXRjaCAoam9iVHlwZSkge1xuICAgICAgY2FzZSAnRnVsbC10aW1lJzogcmV0dXJuIHsgYmc6ICcjRUZGNkZGJywgdGV4dDogQy5ibHVlIH07XG4gICAgICBjYXNlICdQYXJ0LXRpbWUnOiByZXR1cm4geyBiZzogJyNGRkY3RUQnLCB0ZXh0OiBDLm9yYW5nZSB9O1xuICAgICAgY2FzZSAnSW50ZXJuc2hpcCc6IHJldHVybiB7IGJnOiAnI0Y1RjNGRicsIHRleHQ6IEMucHVycGxlIH07XG4gICAgICBjYXNlICdDb250cmFjdCc6IHJldHVybiB7IGJnOiAnI0VDRkRGNScsIHRleHQ6IEMuZ3JlZW4gfTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiB7IGJnOiAnI0YzRjRGNicsIHRleHQ6IEMudGV4dEJhc2UgfTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHR5cGVTdHlsZSA9IGdldEpvYlR5cGVDb2xvcigpO1xuXG4gIGNvbnN0IGhhbmRsZUR1cGxpY2F0ZSA9ICgpID0+IGFsZXJ0KCdEdXBsaWNhdGUgSm9iIGZpcmVkISBDb25uZWN0aW5nIHRvIEFQSSBob29rLi4uJyk7XG4gIGNvbnN0IGhhbmRsZVByaW50ID0gKCkgPT4gd2luZG93LnByaW50KCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6ICcwJywgbWF4V2lkdGg6ICcxMjAwcHgnLCBtYXJnaW46ICcwIGF1dG8nLCBmb250RmFtaWx5OiBcIidJbnRlcicsIHNhbnMtc2VyaWZcIiB9fT5cbiAgICAgIFxuICAgICAgey8qIEhFQURFUiBTRUNUSU9OICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JywgbWFyZ2luQm90dG9tOiAnMjRweCcgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEzcHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICBEYXNoYm9hcmQgLyBKb2IgUG9zdGluZyAvIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBDLnRleHRCYXNlLCBmb250V2VpZ2h0OiA1MDAgfX0+e3AudGl0bGV9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxoMSBzdHlsZT17eyBmb250U2l6ZTogJzI4cHgnLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiBDLnRleHRCYXNlLCBtYXJnaW46ICcwIDAgNHB4IDAnIH19PntwLnRpdGxlfTwvaDE+XG4gICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzE0cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQgfX0+VmlldyBjb21wbGV0ZSBkZXRhaWxzIG9mIHRoZSBqb2IgcG9zdGluZzwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMTJweCcgfX0+XG4gICAgICAgICAgPGEgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvSm9iUG9zdGluZy9yZWNvcmRzLyR7cC5faWR9L2VkaXRgfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnIH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT17eyBoZWlnaHQ6ICczNnB4JywgcGFkZGluZzogJzAgMTZweCcsIGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzZweCcsIGZvbnRTaXplOiAnMTRweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcsIGN1cnNvcjogJ3BvaW50ZXInIH19PlxuICAgICAgICAgICAgICA8SWNvbnMuRWRpdCAvPiBFZGl0XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17eyBoZWlnaHQ6ICczNnB4JywgcGFkZGluZzogJzAgMTZweCcsIGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzZweCcsIGZvbnRTaXplOiAnMTRweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMucmVkLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjdXJzb3I6ICdwb2ludGVyJyB9fT5cbiAgICAgICAgICAgIDxJY29ucy5UcmFzaCAvPiBEZWxldGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZUR1cGxpY2F0ZX0gc3R5bGU9e3sgaGVpZ2h0OiAnMzZweCcsIHBhZGRpbmc6ICcwIDE2cHgnLCBiYWNrZ3JvdW5kOiBDLnByaW1hcnksIGJvcmRlcjogJ25vbmUnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLndoaXRlLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjdXJzb3I6ICdwb2ludGVyJywgYm94U2hhZG93OiAnMCAycHggNHB4IHJnYmEoMzcsOTksMjM1LDAuMiknIH19PlxuICAgICAgICAgICAgPEljb25zLkNvcHkgLz4gRHVwbGljYXRlIEpvYlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogVE9QIFNVTU1BUlkgQ0FSRFMgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDE4MHB4LCAxZnIpKScsIGdhcDogJzE2cHgnLCBtYXJnaW5Cb3R0b206ICcyNHB4JyB9fT5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgcGFkZGluZzogJzIwcHgnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3cgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICA8SWNvbnMuQnJpZWZjYXNlIC8+IDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTJweCcsIGZvbnRXZWlnaHQ6IDYwMCwgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScgfX0+Sm9iIFR5cGU8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzE4cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLnR5cGUgfHwgJ04vQSd9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgcGFkZGluZzogJzIwcHgnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3cgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICA8SWNvbnMuQnVpbGRpbmcgLz4gPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNjAwLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyB9fT5EZXBhcnRtZW50PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxOHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0QmFzZSB9fT57cC5kZXBhcnRtZW50IHx8ICdOL0EnfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6IEMud2hpdGUsIHBhZGRpbmc6ICcyMHB4JywgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJveFNoYWRvdzogQy5jYXJkU2hhZG93IH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JywgY29sb3I6IEMudGV4dE11dGVkLCBtYXJnaW5Cb3R0b206ICc4cHgnIH19PlxuICAgICAgICAgICAgPEljb25zLk1hcFBpbiAvPiA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBmb250V2VpZ2h0OiA2MDAsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnIH19PkxvY2F0aW9uPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxOHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0QmFzZSB9fT57cC5sb2NhdGlvbiB8fCAnTi9BJ308L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBDLndoaXRlLCBwYWRkaW5nOiAnMjBweCcsIGJvcmRlclJhZGl1czogJzEycHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3hTaGFkb3c6IEMuY2FyZFNoYWRvdyB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcsIGNvbG9yOiBDLnRleHRNdXRlZCwgbWFyZ2luQm90dG9tOiAnOHB4JyB9fT5cbiAgICAgICAgICAgIDxJY29ucy5BY3Rpdml0eSAvPiA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBmb250V2VpZ2h0OiA2MDAsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnIH19PlN0YXR1czwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBhZGRpbmc6ICc0cHggMTBweCcsIGJvcmRlclJhZGl1czogJzIwcHgnLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGJhY2tncm91bmQ6IGlzQWN0aXZlID8gJyNFQ0ZERjUnIDogJyNGRUYyRjInLCBjb2xvcjogaXNBY3RpdmUgPyBDLmdyZWVuIDogQy5yZWQgfX0+XG4gICAgICAgICAgICAgIHtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0Nsb3NlZCd9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgcGFkZGluZzogJzIwcHgnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3cgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICA8SWNvbnMuQ2FsZW5kYXIgLz4gPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNjAwLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyB9fT5Qb3N0ZWQgRGF0ZTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMThweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UgfX0+e3Bvc3RlZERhdGV9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBNQUlOIERFVEFJTFMgR1JJRCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcyNHB4JywgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnIH19PlxuICAgICAgICBcbiAgICAgICAgey8qIExFRlQgQ09MVU1OOiBDb3JlIERldGFpbHMgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogJzEnLCBtaW5XaWR0aDogJzMwMHB4JywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMjRweCcgfX0+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBDLndoaXRlLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3csIHBhZGRpbmc6ICcyNHB4JyB9fT5cbiAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogJzE1cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlLCBtYXJnaW46ICcwIDAgMjBweCAwJywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgcGFkZGluZ0JvdHRvbTogJzEycHgnIH19PkpvYiBPdmVydmlldzwvaDM+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMjBweCcgfX0+XG4gICAgICAgICAgICAgIDxkaXY+PHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgZm9udFNpemU6ICcxMnB4JywgY29sb3I6IEMudGV4dE11dGVkLCBtYXJnaW5Cb3R0b206ICc0cHgnIH19PkpvYiBUaXRsZTwvc3Bhbj48c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLnRpdGxlfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj48c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzRweCcgfX0+Sm9iIElEPC9zcGFuPjxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTRweCcsIGZvbnRXZWlnaHQ6IDUwMCwgY29sb3I6IEMudGV4dEJhc2UgfX0+e3AuX2lkfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj48c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzRweCcgfX0+RGVwYXJ0bWVudDwvc3Bhbj48c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLmRlcGFydG1lbnQgfHwgJ0dlbmVyYWwnfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzRweCcgfX0+RW1wbG95bWVudCBUeXBlPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwYWRkaW5nOiAnMnB4IDEwcHgnLCBib3JkZXJSYWRpdXM6ICcyMHB4JywgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNjAwLCBiYWNrZ3JvdW5kOiB0eXBlU3R5bGUuYmcsIGNvbG9yOiB0eXBlU3R5bGUudGV4dCB9fT57am9iVHlwZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PjxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMTJweCcsIGNvbG9yOiBDLnRleHRNdXRlZCwgbWFyZ2luQm90dG9tOiAnNHB4JyB9fT5Mb2NhdGlvbjwvc3Bhbj48c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLmxvY2F0aW9ufTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBDLndoaXRlLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3csIHBhZGRpbmc6ICcyNHB4JyB9fT5cbiAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogJzE1cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlLCBtYXJnaW46ICcwIDAgMjBweCAwJywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgcGFkZGluZ0JvdHRvbTogJzEycHgnIH19PkFjdGl2aXR5IFRpbWVsaW5lPC9oMz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMTZweCcsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiAnN3B4JywgdG9wOiAnMTBweCcsIGJvdHRvbTogJzEwcHgnLCB3aWR0aDogJzJweCcsIGJhY2tncm91bmQ6IEMuYm9yZGVyIH19IC8+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMTJweCcsIHBvc2l0aW9uOiAncmVsYXRpdmUnLCB6SW5kZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzE2cHgnLCBoZWlnaHQ6ICcxNnB4JywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZDogQy5ibHVlLCBib3JkZXI6IGAzcHggc29saWQgJHtDLndoaXRlfWAgfX0gLz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PkpvYiBjcmVhdGVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMTFweCcsIGNvbG9yOiBDLnRleHRNdXRlZCB9fT57cG9zdGVkRGF0ZX0gYnkgQWRtaW48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcxMnB4JywgcG9zaXRpb246ICdyZWxhdGl2ZScsIHpJbmRleDogMSB9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTZweCcsIGhlaWdodDogJzE2cHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kOiBDLmJvcmRlciwgYm9yZGVyOiBgM3B4IHNvbGlkICR7Qy53aGl0ZX1gIH19IC8+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNTAwLCBjb2xvcjogQy50ZXh0QmFzZSB9fT5QdWJsaXNoZWQgb24gQ2FyZWVycyBQb3J0YWw8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxMXB4JywgY29sb3I6IEMudGV4dE11dGVkIH19Pntwb3N0ZWREYXRlfSAtIFN5c3RlbTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogUklHSFQgQ09MVU1OOiBEZXNjcmlwdGlvbiBBcmVhICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6ICcyJywgbWluV2lkdGg6ICc0MDBweCcsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzI0cHgnIH19PlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJveFNoYWRvdzogQy5jYXJkU2hhZG93LCBwYWRkaW5nOiAnMjRweCcsIGZsZXhHcm93OiAxIH19PlxuICAgICAgICAgICAgPGgzIHN0eWxlPXt7IGZvbnRTaXplOiAnMThweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UsIG1hcmdpbjogJzAgMCAyNHB4IDAnIH19PkpvYiBEZXNjcmlwdGlvbjwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMTQuNXB4JywgY29sb3I6ICcjNEI1NTYzJywgbGluZUhlaWdodDogJzEuNycsIHdoaXRlU3BhY2U6ICdwcmUtd3JhcCcgfX0+XG4gICAgICAgICAgICAgIHtwLmRlc2NyaXB0aW9uIHx8IFwiTm8gZGVzY3JpcHRpb24gcHJvdmlkZWQgZm9yIHRoaXMgam9iIGxpc3RpbmcuXCJ9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBCT1RUT00gQUNUSU9OIEJBUiAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlclJhZGl1czogJzEycHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3hTaGFkb3c6IEMuY2FyZFNoYWRvdywgcGFkZGluZzogJzE2cHggMjRweCcsIGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsIGdhcDogJzEycHgnIH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBhbGVydCgnTGluayBDb3BpZWQhJyl9IHN0eWxlPXt7IGhlaWdodDogJzM2cHgnLCBwYWRkaW5nOiAnMCAxNnB4JywgYmFja2dyb3VuZDogQy53aGl0ZSwgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm9yZGVyUmFkaXVzOiAnNnB4JywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0QmFzZSwgY3Vyc29yOiAncG9pbnRlcicgfX0+Q29weSBMaW5rPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZVByaW50fSBzdHlsZT17eyBoZWlnaHQ6ICczNnB4JywgcGFkZGluZzogJzAgMTZweCcsIGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzZweCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcsIGN1cnNvcjogJ3BvaW50ZXInIH19PlxuICAgICAgICAgICAgICA8SWNvbnMuUHJpbnRlciAvPiBEb3dubG9hZCBQREZcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGEgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvSm9iUG9zdGluZy9yZWNvcmRzLyR7cC5faWR9L2VkaXRgfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnIH19PlxuICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPXt7IGhlaWdodDogJzM2cHgnLCBwYWRkaW5nOiAnMCAxNnB4JywgYmFja2dyb3VuZDogQy5wcmltYXJ5LCBib3JkZXI6ICdub25lJywgYm9yZGVyUmFkaXVzOiAnNnB4JywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy53aGl0ZSwgY3Vyc29yOiAncG9pbnRlcicgfX0+RWRpdCBDb25maWd1cmF0aW9uPC9idXR0b24+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBKb2JTaG93O1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgU2lkZWJhciBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9TaWRlYmFyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TaWRlYmFyID0gU2lkZWJhclxuaW1wb3J0IExvZ2luIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0xvZ2luJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dpbiA9IExvZ2luXG5pbXBvcnQgSm9iU2hvdyBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Kb2JTaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Kb2JTaG93ID0gSm9iU2hvdyJdLCJuYW1lcyI6WyJDIiwiYmciLCJjYXJkIiwiYm9yZGVyIiwiYm9yZGVyTGlnaHQiLCJwcmltYXJ5IiwicHJpbWFyeUhvdmVyIiwicHJpbWFyeUxpZ2h0IiwiZ3JheSIsImdyYXlMaWdodCIsImdyYXlCZyIsInN1Y2Nlc3MiLCJzdWNjZXNzTGlnaHQiLCJ3YXJuaW5nIiwid2FybmluZ0xpZ2h0IiwiZGFuZ2VyIiwiZGFuZ2VyTGlnaHQiLCJ0ZXh0IiwidGV4dFN1YiIsInRleHRNdXRlZCIsIlQiLCJoMSIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImNvbG9yIiwibWFyZ2luIiwibGV0dGVyU3BhY2luZyIsImgyIiwiaDMiLCJib2R5Iiwic21hbGwiLCJsYWJlbCIsInRleHRUcmFuc2Zvcm0iLCJiYWNrZ3JvdW5kIiwiYm9yZGVyUmFkaXVzIiwiYm94U2hhZG93IiwicGFkZGluZyIsIkxpbmVDaGFydCIsImRhdGEiLCJsYWJlbHMiLCJoZWlnaHQiLCJXIiwiSCIsInBhZCIsIm1heCIsIk1hdGgiLCJtaW4iLCJyYW5nZSIsInB0cyIsIm1hcCIsInYiLCJpIiwieCIsImxlbmd0aCIsInkiLCJwb2x5bGluZSIsInAiLCJqb2luIiwiYXJlYSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsInZpZXdCb3giLCJzdHlsZSIsIndpZHRoIiwicHJlc2VydmVBc3BlY3RSYXRpbyIsImlkIiwieDEiLCJ5MSIsIngyIiwieTIiLCJvZmZzZXQiLCJzdG9wQ29sb3IiLCJzdG9wT3BhY2l0eSIsImQiLCJmaWxsIiwicG9pbnRzIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lam9pbiIsInN0cm9rZUxpbmVjYXAiLCJrZXkiLCJjeCIsImN5IiwiciIsImwiLCJ0ZXh0QW5jaG9yIiwiQmFyQ2hhcnQiLCJnYXAiLCJidyIsImJoIiwicngiLCJmaWxsT3BhY2l0eSIsIkRvdWdobnV0Q2hhcnQiLCJjb2xvcnMiLCJzaXplIiwidG90YWwiLCJyZWR1Y2UiLCJhIiwiYiIsImlyIiwiYW5nbGUiLCJQSSIsInNsaWNlcyIsInN3ZWVwIiwiY29zIiwic2luIiwibGFyZ2UiLCJ4aTEiLCJ5aTEiLCJ4aTIiLCJ5aTIiLCJzIiwiQmFkZ2UiLCJ0eXBlIiwiZGVmYXVsdCIsImRpc3BsYXkiLCJCdG4iLCJjaGlsZHJlbiIsInZhcmlhbnQiLCJvbkNsaWNrIiwic3R5bGVzIiwic2Vjb25kYXJ5IiwiZ2hvc3QiLCJjdXJzb3IiLCJmb250RmFtaWx5IiwidHJhbnNpdGlvbiIsIlNlY3Rpb25IZWFkZXIiLCJ0aXRsZSIsImFjdGlvbiIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsIm1hcmdpbkJvdHRvbSIsIkRhc2hib2FyZCIsInNldERhdGEiLCJ1c2VTdGF0ZSIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwidXNlRWZmZWN0IiwiZmV0Y2giLCJ0aGVuIiwianNvbiIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwiZmluYWxseSIsIm1pbkhlaWdodCIsInRleHRBbGlnbiIsImJvcmRlclRvcCIsImFuaW1hdGlvbiIsInN0YXRzIiwicHJvamVjdHMiLCJ0YXNrcyIsImZpbmFuY2UiLCJhY3Rpdml0aWVzIiwibWVldGluZ3MiLCJyZXZlbnVlIiwibW9udGhseVJldmVudWUiLCJyZXZlbnVlRGF0YSIsInJldkxhYmVscyIsImF0dGVuZERhdGEiLCJhdHRlbmRMYWJlbHMiLCJ0b3RhbEV4cCIsImZpbHRlciIsImYiLCJhbW91bnQiLCJ0b3RhbFJldiIsInN0YXRDYXJkcyIsImljb24iLCJ2YWx1ZSIsInRvdGFsRW1wbG95ZWVzIiwic3ViIiwiYmFkZ2UiLCJiYWRnZVR5cGUiLCJ0b3RhbEludGVybnMiLCJhY3RpdmVQcm9qZWN0cyIsInBlbmRpbmdUYXNrcyIsInRvTG9jYWxlU3RyaW5nIiwicGVuZGluZ1BheW1lbnRzIiwiYXR0ZW5kYW5jZVJhdGUiLCJuZXdDbGllbnRSZXF1ZXN0cyIsInRNZXRyaWNzIiwidGlja2V0TWV0cmljcyIsIm9wZW4iLCJjbG9zZWQiLCJ1cmdlbnQiLCJwZW5kaW5nIiwidGlja2V0Q2FyZHMiLCJsYXlvdXQiLCJwYWdlIiwiYm94U2l6aW5nIiwiZ3JpZDQiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ3JpZDYiLCJncmlkMl8xIiwiZ3JpZDIiLCJjb2wiLCJmbGV4RGlyZWN0aW9uIiwibWFyZ2luVG9wIiwiRGF0ZSIsInRvTG9jYWxlRGF0ZVN0cmluZyIsIndlZWtkYXkiLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJwbGFjZWhvbGRlciIsIm91dGxpbmUiLCJwb3NpdGlvbiIsInRvcCIsInJpZ2h0Iiwic3JjIiwiYWx0IiwibGluZUhlaWdodCIsImJvcmRlckNvbGxhcHNlIiwiYm9yZGVyQm90dG9tIiwiaCIsImJUeXBlIiwic3RhdHVzIiwiZmxleFNocmluayIsIm5hbWUiLCJjbGllbnQiLCJkZWFkbGluZSIsImZsZXgiLCJvdmVyZmxvdyIsIm1pbldpZHRoIiwicHJvZ3Jlc3MiLCJ0IiwicFR5cGUiLCJwcmlvcml0eSIsInNUeXBlIiwiaXRlbSIsInBhZGRpbmdUb3AiLCJjYXRlZ29yeSIsIm0iLCJ0aW1lIiwicGFydGljaXBhbnRzIiwiYWN0IiwidXNlciIsInRhcmdldCIsInRvTG9jYWxlVGltZVN0cmluZyIsImhvdXIiLCJtaW51dGUiLCJJY29uIiwiSFIiLCJSZWNydWl0IiwiT3BzIiwicnkiLCJTdXBwIiwiRmluIiwiU2FsZXMiLCJTeXMiLCJEYXNoIiwiRG93biIsIlJpZ2h0IiwiT3V0Iiwid2hpdGUiLCJ0ZXh0RGltIiwiU2lkZWJhciIsInByb3BzIiwiaXNDb2xsYXBzZWQiLCJzZXRJc0NvbGxhcHNlZCIsIm9wZW5TZWN0aW9ucyIsInNldE9wZW5TZWN0aW9ucyIsInRvZ2dsZVNlY3Rpb24iLCJwcmV2IiwibmF2IiwiaXRlbXMiLCJwYXRoIiwiY3VycmVudFBhdGgiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiYm9yZGVyUmlnaHQiLCJ6SW5kZXgiLCJvYmplY3RGaXQiLCJvdmVyZmxvd1kiLCJocmVmIiwidGV4dERlY29yYXRpb24iLCJzZWMiLCJpZHgiLCJ0cmFuc2Zvcm0iLCJhY3RpdmUiLCJ3aGl0ZVNwYWNlIiwidGV4dE92ZXJmbG93IiwiTG9naW4iLCJtZXNzYWdlIiwiYnJhbmRpbmciLCJtYXhXaWR0aCIsIm1ldGhvZCIsInJlcXVpcmVkIiwib25Gb2N1cyIsImUiLCJib3JkZXJDb2xvciIsIm9uQmx1ciIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VMZWF2ZSIsInRleHRCYXNlIiwidGV4dExpZ2h0IiwiZ3JlZW4iLCJibHVlIiwib3JhbmdlIiwicHVycGxlIiwicmVkIiwiY2FyZFNoYWRvdyIsIkljb25zIiwiQnJpZWZjYXNlIiwiTWFwUGluIiwiQnVpbGRpbmciLCJDYWxlbmRhciIsIkFjdGl2aXR5IiwiQ29weSIsIlByaW50ZXIiLCJFZGl0IiwiVHJhc2giLCJKb2JTaG93IiwicmVjb3JkIiwicGFyYW1zIiwicG9zdGVkRGF0ZSIsImlzQWN0aXZlIiwiam9iVHlwZSIsImdldEpvYlR5cGVDb2xvciIsInR5cGVTdHlsZSIsImhhbmRsZUR1cGxpY2F0ZSIsImFsZXJ0IiwiaGFuZGxlUHJpbnQiLCJwcmludCIsIl9pZCIsImRlcGFydG1lbnQiLCJwYWRkaW5nQm90dG9tIiwibGVmdCIsImJvdHRvbSIsImZsZXhHcm93IiwiZGVzY3JpcHRpb24iLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFFQTtFQUNBLE1BQU1BLEdBQUMsR0FBRztFQUNSQyxFQUFBQSxFQUFFLEVBQUUsU0FBUztFQUNiQyxFQUFBQSxJQUFJLEVBQUUsU0FBUztFQUNmQyxFQUFBQSxNQUFNLEVBQUUsU0FBUztFQUNqQkMsRUFBQUEsV0FBVyxFQUFFLFNBQVM7RUFDdEJDLEVBQUFBLE9BQU8sRUFBRSxTQUFTO0VBQ2xCQyxFQUNBQyxZQUFZLEVBQUUsU0FBUztFQUN2QkMsRUFBQUEsSUFBSSxFQUFFLFNBQVM7RUFDZkMsRUFBQUEsU0FBUyxFQUFFLFNBQVM7RUFDcEJDLEVBQUFBLE1BQU0sRUFBRSxTQUFTO0VBQ2pCQyxFQUFBQSxPQUFPLEVBQUUsU0FBUztFQUNsQkMsRUFBQUEsWUFBWSxFQUFFLFNBQVM7RUFDdkJDLEVBQUFBLE9BQU8sRUFBRSxTQUFTO0VBQ2xCQyxFQUFBQSxZQUFZLEVBQUUsU0FBUztFQUN2QkMsRUFBQUEsTUFBTSxFQUFFLFNBQVM7RUFDakJDLEVBQUFBLFdBQVcsRUFBRSxTQUFTO0VBQ3RCQyxFQUFBQSxJQUFJLEVBQUUsU0FBUztFQUNmQyxFQUFBQSxPQUFPLEVBQUUsU0FBUztFQUNsQkMsRUFBQUEsU0FBUyxFQUFFO0VBQ2IsQ0FBQzs7RUFFRDtFQUNBLE1BQU1DLENBQUMsR0FBRztFQUNSQyxFQUFBQSxFQUFFLEVBQUU7RUFBRUMsSUFBQUEsUUFBUSxFQUFFLE1BQU07RUFBRUMsSUFBQUEsVUFBVSxFQUFFLEdBQUc7TUFBRUMsS0FBSyxFQUFFeEIsR0FBQyxDQUFDaUIsSUFBSTtFQUFFUSxJQUFBQSxNQUFNLEVBQUUsQ0FB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
