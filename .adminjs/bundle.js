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

  const GlobalShow = props => {
    const {
      record,
      resource
    } = props;
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: '24px',
        background: '#FFFFFF',
        borderRadius: '16px'
      }
    }, /*#__PURE__*/React__default.default.createElement("h1", null, resource.name, " Details"), /*#__PURE__*/React__default.default.createElement("pre", null, JSON.stringify(record.params, null, 2)));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.Sidebar = Sidebar;
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.JobShow = JobShow;
  AdminJS.UserComponents.GlobalShow = GlobalShow;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9EYXNoYm9hcmQuanN4IiwiLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvU2lkZWJhci5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Mb2dpbi5qc3giLCIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Kb2JTaG93LmpzeCIsIi4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0dsb2JhbFNob3cuanN4IiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbi8vIOKUgOKUgCBDb2xvciBUb2tlbnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBDID0ge1xuICBiZzogJyNGNUY3RkEnLFxuICBjYXJkOiAnI0ZGRkZGRicsXG4gIGJvcmRlcjogJyNFNUU3RUInLFxuICBib3JkZXJMaWdodDogJyNGM0Y0RjYnLFxuICBwcmltYXJ5OiAnIzI1NjNFQicsXG4gIHByaW1hcnlIb3ZlcjogJyMxRDRFRDgnLFxuICBwcmltYXJ5TGlnaHQ6ICcjRUZGNkZGJyxcbiAgZ3JheTogJyM2QjcyODAnLFxuICBncmF5TGlnaHQ6ICcjOUNBM0FGJyxcbiAgZ3JheUJnOiAnI0Y5RkFGQicsXG4gIHN1Y2Nlc3M6ICcjMjJDNTVFJyxcbiAgc3VjY2Vzc0xpZ2h0OiAnI0YwRkRGNCcsXG4gIHdhcm5pbmc6ICcjRjU5RTBCJyxcbiAgd2FybmluZ0xpZ2h0OiAnI0ZGRkJFQicsXG4gIGRhbmdlcjogJyNFRjQ0NDQnLFxuICBkYW5nZXJMaWdodDogJyNGRUYyRjInLFxuICB0ZXh0OiAnIzExMTgyNycsXG4gIHRleHRTdWI6ICcjMzc0MTUxJyxcbiAgdGV4dE11dGVkOiAnIzZCNzI4MCcsXG59O1xuXG4vLyDilIDilIAgVHlwb2dyYXBoeSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IFQgPSB7XG4gIGgxOiB7IGZvbnRTaXplOiAnMjRweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dCwgbWFyZ2luOiAwLCBsZXR0ZXJTcGFjaW5nOiAnLTAuMDFlbScgfSxcbiAgaDI6IHsgZm9udFNpemU6ICcxOHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0LCBtYXJnaW46IDAgfSxcbiAgaDM6IHsgZm9udFNpemU6ICcxNnB4JywgZm9udFdlaWdodDogNTAwLCBjb2xvcjogQy50ZXh0LCBtYXJnaW46IDAgfSxcbiAgYm9keTogeyBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA0MDAsIGNvbG9yOiBDLnRleHRTdWIgfSxcbiAgc21hbGw6IHsgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNDAwLCBjb2xvcjogQy50ZXh0TXV0ZWQgfSxcbiAgbGFiZWw6IHsgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNTAwLCBjb2xvcjogQy50ZXh0TXV0ZWQsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBsZXR0ZXJTcGFjaW5nOiAnMC4wNmVtJyB9LFxufTtcblxuLy8g4pSA4pSAIEJhc2UgQ2FyZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IGNhcmQgPSB7XG4gIGJhY2tncm91bmQ6IEMuY2FyZCxcbiAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXG4gIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsXG4gIGJveFNoYWRvdzogJzAgMXB4IDNweCByZ2JhKDAsMCwwLDAuMDQpJyxcbiAgcGFkZGluZzogJzIwcHgnLFxufTtcblxuLy8g4pSA4pSAIFNWRzogTGluZSBDaGFydCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IExpbmVDaGFydCA9ICh7IGRhdGEsIGxhYmVscywgY29sb3IgPSBDLnByaW1hcnksIGhlaWdodCA9IDEyMCB9KSA9PiB7XG4gIGNvbnN0IFcgPSA0MDAsIEggPSBoZWlnaHQsIHBhZCA9IDg7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRhdGEpLCBtaW4gPSBNYXRoLm1pbiguLi5kYXRhKTtcbiAgY29uc3QgcmFuZ2UgPSBtYXggLSBtaW4gfHwgMTtcbiAgY29uc3QgcHRzID0gZGF0YS5tYXAoKHYsIGkpID0+IHtcbiAgICBjb25zdCB4ID0gcGFkICsgKGkgLyAoZGF0YS5sZW5ndGggLSAxKSkgKiAoVyAtIHBhZCAqIDIpO1xuICAgIGNvbnN0IHkgPSBIIC0gcGFkIC0gKCh2IC0gbWluKSAvIHJhbmdlKSAqIChIIC0gcGFkICogMik7XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfSk7XG4gIGNvbnN0IHBvbHlsaW5lID0gcHRzLm1hcChwID0+IHAuam9pbignLCcpKS5qb2luKCcgJyk7XG4gIGNvbnN0IGFyZWEgPSBgTSR7cHRzWzBdWzBdfSwke0h9IGAgKyBwdHMubWFwKHAgPT4gYEwke3BbMF19LCR7cFsxXX1gKS5qb2luKCcgJykgKyBgIEwke3B0c1twdHMubGVuZ3RoIC0gMV1bMF19LCR7SH0gWmA7XG4gIHJldHVybiAoXG4gICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogYCR7SH1weGAgfX0gcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIj5cbiAgICAgIDxkZWZzPlxuICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9XCJsZ1wiIHgxPVwiMFwiIHkxPVwiMFwiIHgyPVwiMFwiIHkyPVwiMVwiPlxuICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwLjEyXCIgLz5cbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwXCIgLz5cbiAgICAgICAgPC9saW5lYXJHcmFkaWVudD5cbiAgICAgIDwvZGVmcz5cbiAgICAgIDxwYXRoIGQ9e2FyZWF9IGZpbGw9XCJ1cmwoI2xnKVwiIC8+XG4gICAgICA8cG9seWxpbmUgcG9pbnRzPXtwb2x5bGluZX0gZmlsbD1cIm5vbmVcIiBzdHJva2U9e2NvbG9yfSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgLz5cbiAgICAgIHtwdHMubWFwKChwLCBpKSA9PiA8Y2lyY2xlIGtleT17aX0gY3g9e3BbMF19IGN5PXtwWzFdfSByPVwiM1wiIGZpbGw9e0MuY2FyZH0gc3Ryb2tlPXtjb2xvcn0gc3Ryb2tlV2lkdGg9XCIxLjVcIiAvPil9XG4gICAgICB7bGFiZWxzICYmIGxhYmVscy5tYXAoKGwsIGkpID0+IChcbiAgICAgICAgPHRleHQga2V5PXtpfSB4PXtwdHNbaV1bMF19IHk9e0ggLSAxfSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFNpemU9XCI5XCIgZmlsbD17Qy5ncmF5TGlnaHR9PntsfTwvdGV4dD5cbiAgICAgICkpfVxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuLy8g4pSA4pSAIFNWRzogQmFyIENoYXJ0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgQmFyQ2hhcnQgPSAoeyBkYXRhLCBsYWJlbHMsIGNvbG9yID0gQy5wcmltYXJ5LCBoZWlnaHQgPSAxMjAgfSkgPT4ge1xuICBjb25zdCBXID0gNDAwLCBIID0gaGVpZ2h0LCBnYXAgPSA2LCBwYWQgPSAxNjtcbiAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YSkgfHwgMTtcbiAgY29uc3QgYncgPSAoVyAtIHBhZCAqIDIgLSBnYXAgKiAoZGF0YS5sZW5ndGggLSAxKSkgLyBkYXRhLmxlbmd0aDtcbiAgcmV0dXJuIChcbiAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHtXfSAke0h9YH0gc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiBgJHtIfXB4YCB9fSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiPlxuICAgICAge2RhdGEubWFwKCh2LCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGJoID0gKCh2IC8gbWF4KSAqIChIIC0gMjQpKTtcbiAgICAgICAgY29uc3QgeCA9IHBhZCArIGkgKiAoYncgKyBnYXApO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxnIGtleT17aX0+XG4gICAgICAgICAgICA8cmVjdCB4PXt4fSB5PXtIIC0gYmggLSAxNH0gd2lkdGg9e2J3fSBoZWlnaHQ9e2JofSByeD1cIjRcIiBmaWxsPXtjb2xvcn0gZmlsbE9wYWNpdHk9XCIwLjE1XCIgLz5cbiAgICAgICAgICAgIDxyZWN0IHg9e3h9IHk9e0ggLSBiaCAtIDE0fSB3aWR0aD17Ynd9IGhlaWdodD17NH0gcng9XCIyXCIgZmlsbD17Y29sb3J9IC8+XG4gICAgICAgICAgICB7bGFiZWxzICYmIDx0ZXh0IHg9e3ggKyBidyAvIDJ9IHk9e0ggLSAyfSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFNpemU9XCI5XCIgZmlsbD17Qy5ncmF5TGlnaHR9PntsYWJlbHNbaV19PC90ZXh0Pn1cbiAgICAgICAgICA8L2c+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8L3N2Zz5cbiAgKTtcbn07XG5cbi8vIOKUgOKUgCBTVkc6IERvdWdobnV0IENoYXJ0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgRG91Z2hudXRDaGFydCA9ICh7IGRhdGEsIGNvbG9ycywgc2l6ZSA9IDEyMCB9KSA9PiB7XG4gIGNvbnN0IHRvdGFsID0gZGF0YS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKSB8fCAxO1xuICBjb25zdCBjeCA9IHNpemUgLyAyLCBjeSA9IHNpemUgLyAyLCByID0gc2l6ZSAqIDAuMzgsIGlyID0gc2l6ZSAqIDAuMjQ7XG4gIGxldCBhbmdsZSA9IC1NYXRoLlBJIC8gMjtcbiAgY29uc3Qgc2xpY2VzID0gZGF0YS5tYXAoKHYsIGkpID0+IHtcbiAgICBjb25zdCBzd2VlcCA9ICh2IC8gdG90YWwpICogMiAqIE1hdGguUEk7XG4gICAgY29uc3QgeDEgPSBjeCArIHIgKiBNYXRoLmNvcyhhbmdsZSksIHkxID0gY3kgKyByICogTWF0aC5zaW4oYW5nbGUpO1xuICAgIGFuZ2xlICs9IHN3ZWVwO1xuICAgIGNvbnN0IHgyID0gY3ggKyByICogTWF0aC5jb3MoYW5nbGUpLCB5MiA9IGN5ICsgciAqIE1hdGguc2luKGFuZ2xlKTtcbiAgICBjb25zdCBsYXJnZSA9IHN3ZWVwID4gTWF0aC5QSSA/IDEgOiAwO1xuICAgIGNvbnN0IHhpMSA9IGN4ICsgaXIgKiBNYXRoLmNvcyhhbmdsZSAtIHN3ZWVwKSwgeWkxID0gY3kgKyBpciAqIE1hdGguc2luKGFuZ2xlIC0gc3dlZXApO1xuICAgIGNvbnN0IHhpMiA9IGN4ICsgaXIgKiBNYXRoLmNvcyhhbmdsZSksIHlpMiA9IGN5ICsgaXIgKiBNYXRoLnNpbihhbmdsZSk7XG4gICAgcmV0dXJuIHsgZDogYE0ke3gxfSwke3kxfSBBJHtyfSwke3J9IDAgJHtsYXJnZX0sMSAke3gyfSwke3kyfSBMJHt4aTJ9LCR7eWkyfSBBJHtpcn0sJHtpcn0gMCAke2xhcmdlfSwwICR7eGkxfSwke3lpMX0gWmAsIGNvbG9yOiBjb2xvcnNbaV0gfTtcbiAgfSk7XG4gIHJldHVybiAoXG4gICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7c2l6ZX0gJHtzaXplfWB9IHN0eWxlPXt7IHdpZHRoOiBgJHtzaXplfXB4YCwgaGVpZ2h0OiBgJHtzaXplfXB4YCB9fT5cbiAgICAgIHtzbGljZXMubWFwKChzLCBpKSA9PiA8cGF0aCBrZXk9e2l9IGQ9e3MuZH0gZmlsbD17cy5jb2xvcn0gLz4pfVxuICAgICAgPGNpcmNsZSBjeD17Y3h9IGN5PXtjeX0gcj17aXIgLSAyfSBmaWxsPXtDLmNhcmR9IC8+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG4vLyDilIDilIAgQmFkZ2Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBCYWRnZSA9ICh7IGxhYmVsLCB0eXBlID0gJ2RlZmF1bHQnIH0pID0+IHtcbiAgY29uc3QgbWFwID0ge1xuICAgIHN1Y2Nlc3M6IHsgYmc6IEMuc3VjY2Vzc0xpZ2h0LCBjb2xvcjogQy5zdWNjZXNzIH0sXG4gICAgd2FybmluZzogeyBiZzogQy53YXJuaW5nTGlnaHQsIGNvbG9yOiBDLndhcm5pbmcgfSxcbiAgICBkYW5nZXI6IHsgYmc6IEMuZGFuZ2VyTGlnaHQsIGNvbG9yOiBDLmRhbmdlciB9LFxuICAgIHByaW1hcnk6IHsgYmc6IEMucHJpbWFyeUxpZ2h0LCBjb2xvcjogQy5wcmltYXJ5IH0sXG4gICAgZGVmYXVsdDogeyBiZzogQy5ncmF5QmcsIGNvbG9yOiBDLmdyYXkgfSxcbiAgfTtcbiAgY29uc3QgeyBiZywgY29sb3IgfSA9IG1hcFt0eXBlXSB8fCBtYXAuZGVmYXVsdDtcbiAgcmV0dXJuIChcbiAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcGFkZGluZzogJzJweCAxMHB4JywgYm9yZGVyUmFkaXVzOiAnOTk5cHgnLCBmb250U2l6ZTogJzEycHgnLCBmb250V2VpZ2h0OiA1MDAsIGJhY2tncm91bmQ6IGJnLCBjb2xvciwgYm9yZGVyOiBgMXB4IHNvbGlkICR7Y29sb3J9MjJgIH19PlxuICAgICAge2xhYmVsfVxuICAgIDwvc3Bhbj5cbiAgKTtcbn07XG5cbi8vIOKUgOKUgCBCdXR0b24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBCdG4gPSAoeyBjaGlsZHJlbiwgdmFyaWFudCA9ICdwcmltYXJ5Jywgb25DbGljayB9KSA9PiB7XG4gIGNvbnN0IHN0eWxlcyA9IHtcbiAgICBwcmltYXJ5OiB7IGJhY2tncm91bmQ6IEMucHJpbWFyeSwgY29sb3I6ICcjZmZmJywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5wcmltYXJ5fWAgfSxcbiAgICBzZWNvbmRhcnk6IHsgYmFja2dyb3VuZDogQy5jYXJkLCBjb2xvcjogQy5ncmF5LCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gIH0sXG4gICAgZ2hvc3Q6IHsgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JywgY29sb3I6IEMucHJpbWFyeSwgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5wcmltYXJ5fWAgfSxcbiAgfTtcbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9IHN0eWxlPXt7IC4uLnN0eWxlc1t2YXJpYW50XSwgcGFkZGluZzogJzdweCAxNHB4JywgYm9yZGVyUmFkaXVzOiAnOHB4JywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNTAwLCBjdXJzb3I6ICdwb2ludGVyJywgZm9udEZhbWlseTogJ2luaGVyaXQnLCB0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjE1cycgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9idXR0b24+XG4gICk7XG59O1xuXG4vLyDilIDilIAgU2VjdGlvbiBEaXZpZGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuY29uc3QgU2VjdGlvbkhlYWRlciA9ICh7IHRpdGxlLCBhY3Rpb24gfSkgPT4gKFxuICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzE2cHgnIH19PlxuICAgIDxoMiBzdHlsZT17VC5oMn0+e3RpdGxlfTwvaDI+XG4gICAge2FjdGlvbiAmJiA8QnRuIHZhcmlhbnQ9XCJnaG9zdFwiPnthY3Rpb259PC9CdG4+fVxuICA8L2Rpdj5cbik7XG5cbi8vIOKUgOKUgCBNYWluIERhc2hib2FyZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZmV0Y2goJy9hcGkvYWRtaW4vZGFzaGJvYXJkLXN0YXRzJylcbiAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXG4gICAgICAudGhlbihqc29uID0+IHNldERhdGEoanNvbikpXG4gICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Rhc2hib2FyZCBlcnJvcjonLCBlcnIpKVxuICAgICAgLmZpbmFsbHkoKCkgPT4gc2V0TG9hZGluZyhmYWxzZSkpO1xuICB9LCBbXSk7XG5cbiAgaWYgKGxvYWRpbmcpIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIG1pbkhlaWdodDogJzYwdmgnLCBmb250RmFtaWx5OiAnSW50ZXIsIHN5c3RlbS11aSwgc2Fucy1zZXJpZicgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICczNnB4JywgaGVpZ2h0OiAnMzZweCcsIGJvcmRlcjogYDNweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclRvcDogYDNweCBzb2xpZCAke0MucHJpbWFyeX1gLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBtYXJnaW46ICcwIGF1dG8gMTJweCcsIGFuaW1hdGlvbjogJ3NwaW4gMC44cyBsaW5lYXIgaW5maW5pdGUnIH19IC8+XG4gICAgICAgIDxzdHlsZT57YEBrZXlmcmFtZXMgc3BpbiB7IHRvIHsgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfSB9YH08L3N0eWxlPlxuICAgICAgICA8cCBzdHlsZT17eyAuLi5ULmJvZHksIGNvbG9yOiBDLmdyYXlMaWdodCB9fT5Mb2FkaW5nIGRhc2hib2FyZC4uLjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xuXG4gIGNvbnN0IHN0YXRzID0gZGF0YT8uc3RhdHMgfHwge307XG4gIGNvbnN0IHByb2plY3RzID0gZGF0YT8ucHJvamVjdHMgfHwgW107XG4gIGNvbnN0IHRhc2tzID0gZGF0YT8udGFza3MgfHwgW107XG4gIGNvbnN0IGZpbmFuY2UgPSBkYXRhPy5maW5hbmNlIHx8IFtdO1xuICBjb25zdCBhY3Rpdml0aWVzID0gZGF0YT8uYWN0aXZpdGllcyB8fCBbXTtcbiAgY29uc3QgbWVldGluZ3MgPSBkYXRhPy5tZWV0aW5ncyB8fCBbXTtcblxuICBjb25zdCByZXZlbnVlID0gc3RhdHMubW9udGhseVJldmVudWUgfHwgMTk1MDAwO1xuICBjb25zdCByZXZlbnVlRGF0YSA9IFsxNDgwMDAsIDE2MjAwMCwgMTc1MDAwLCAxNTkwMDAsIDE4ODAwMCwgcmV2ZW51ZV07XG4gIGNvbnN0IHJldkxhYmVscyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nXTtcbiAgY29uc3QgYXR0ZW5kRGF0YSA9IFs5MiwgOTUsIDg4LCA5NCwgOTEsIDc1LCA0MF07XG4gIGNvbnN0IGF0dGVuZExhYmVscyA9IFsnTW8nLCAnVHUnLCAnV2UnLCAnVGgnLCAnRnInLCAnU2EnLCAnU3UnXTtcbiAgY29uc3QgdG90YWxFeHAgPSBmaW5hbmNlLmZpbHRlcihmID0+IGYudHlwZSA9PT0gJ0V4cGVuc2UnKS5yZWR1Y2UoKGEsIGYpID0+IGEgKyBmLmFtb3VudCwgMCk7XG4gIGNvbnN0IHRvdGFsUmV2ID0gZmluYW5jZS5maWx0ZXIoZiA9PiBmLnR5cGUgPT09ICdSZXZlbnVlJykucmVkdWNlKChhLCBmKSA9PiBhICsgZi5hbW91bnQsIDApO1xuXG4gIGNvbnN0IHN0YXRDYXJkcyA9IFtcbiAgICB7IGljb246ICfwn5GlJywgbGFiZWw6ICdUb3RhbCBFbXBsb3llZXMnLCB2YWx1ZTogc3RhdHMudG90YWxFbXBsb3llZXMgfHwgNSwgc3ViOiAnQWN0aXZlIHN0YWZmJywgYmFkZ2U6ICdBY3RpdmUnLCBiYWRnZVR5cGU6ICdzdWNjZXNzJyB9LFxuICAgIHsgaWNvbjogJ/CfjpMnLCBsYWJlbDogJ1RvdGFsIEludGVybnMnLCB2YWx1ZTogc3RhdHMudG90YWxJbnRlcm5zIHx8IDIsIHN1YjogJ0FjdGl2ZSBpbnRlcm5zJywgYmFkZ2U6ICdBY3RpdmUnLCBiYWRnZVR5cGU6ICdzdWNjZXNzJyB9LFxuICAgIHsgaWNvbjogJ/Cfk4EnLCBsYWJlbDogJ0FjdGl2ZSBQcm9qZWN0cycsIHZhbHVlOiBzdGF0cy5hY3RpdmVQcm9qZWN0cyB8fCAyLCBzdWI6ICdPbmdvaW5nIHdvcmsnLCBiYWRnZTogJ0luIFByb2dyZXNzJywgYmFkZ2VUeXBlOiAncHJpbWFyeScgfSxcbiAgICB7IGljb246ICfimJHvuI8nLCBsYWJlbDogJ1BlbmRpbmcgVGFza3MnLCB2YWx1ZTogc3RhdHMucGVuZGluZ1Rhc2tzIHx8IDQsIHN1YjogJ0F3YWl0aW5nIGFjdGlvbicsIGJhZGdlOiAnUGVuZGluZycsIGJhZGdlVHlwZTogJ3dhcm5pbmcnIH0sXG4gICAgeyBpY29uOiAn4oK5JywgbGFiZWw6ICdNb250aGx5IFJldmVudWUnLCB2YWx1ZTogXCLigrlcIiArIChzdGF0cy5tb250aGx5UmV2ZW51ZSB8fCAxOTUwMDApLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpLCBzdWI6ICd2cyBsYXN0IG1vbnRoJywgYmFkZ2U6ICcrMTglJywgYmFkZ2VUeXBlOiAnc3VjY2VzcycgfSxcbiAgICB7IGljb246ICfwn5OEJywgbGFiZWw6ICdQZW5kaW5nIEludm9pY2VzJywgdmFsdWU6IFwi4oK5XCIgKyAoc3RhdHMucGVuZGluZ1BheW1lbnRzIHx8IDMyMDAwKS50b0xvY2FsZVN0cmluZygnZW4tSU4nKSwgc3ViOiAnQXdhaXRpbmcgcGF5bWVudCcsIGJhZGdlOiAnVW5wYWlkJywgYmFkZ2VUeXBlOiAnZGFuZ2VyJyB9LFxuICAgIHsgaWNvbjogJ/Cfk4UnLCBsYWJlbDogJ0F0dGVuZGFuY2UgUmF0ZScsIHZhbHVlOiAoc3RhdHMuYXR0ZW5kYW5jZVJhdGUgfHwgOTUpICsgXCIlXCIsIHN1YjogXCJUb2RheSdzIHByZXNlbmNlXCIsIGJhZGdlOiAnR29vZCcsIGJhZGdlVHlwZTogJ3N1Y2Nlc3MnIH0sXG4gICAgeyBpY29uOiAn8J+TqScsIGxhYmVsOiAnTmV3IExlYWRzJywgdmFsdWU6IHN0YXRzLm5ld0NsaWVudFJlcXVlc3RzIHx8IDAsIHN1YjogJ0NsaWVudCByZXF1ZXN0cycsIGJhZGdlOiAnVG9kYXknLCBiYWRnZVR5cGU6ICdkZWZhdWx0JyB9LFxuICBdO1xuXG4gIGNvbnN0IHRNZXRyaWNzID0gc3RhdHMudGlja2V0TWV0cmljcyB8fCB7IHRvdGFsOiAwLCBvcGVuOiAwLCBjbG9zZWQ6IDAsIHVyZ2VudDogMCwgcGVuZGluZzogMCB9O1xuICBjb25zdCB0aWNrZXRDYXJkcyA9IFtcbiAgICB7IGljb246ICfwn5OoJywgbGFiZWw6ICdUb3RhbCBUaWNrZXRzJywgdmFsdWU6IHRNZXRyaWNzLnRvdGFsLCBzdWI6ICdBbGwgdGlja2V0cycgfSxcbiAgICB7IGljb246ICfij7MnLCBsYWJlbDogJ0luIFByb2dyZXNzJywgdmFsdWU6IHRNZXRyaWNzLnBlbmRpbmcsIHN1YjogJ1BlbmRpbmcgcmVzb2x1dGlvbicgfSxcbiAgICB7IGljb246ICfinIUnLCBsYWJlbDogJ0Nsb3NlZCBUaWNrZXRzJywgdmFsdWU6IHRNZXRyaWNzLmNsb3NlZCwgc3ViOiAnUmVzb2x2ZWQnIH0sXG4gICAgeyBpY29uOiAn8J+aqCcsIGxhYmVsOiAnVXJnZW50IFRpY2tldHMnLCB2YWx1ZTogdE1ldHJpY3MudXJnZW50LCBzdWI6ICdBY3Rpb24gbmVlZGVkJyB9LFxuICBdO1xuXG4gIGNvbnN0IGxheW91dCA9IHtcbiAgICBwYWdlOiB7IG1pbkhlaWdodDogJzEwMHZoJywgYmFja2dyb3VuZDogQy5iZywgcGFkZGluZzogJzI0cHggMjhweCcsIGZvbnRGYW1pbHk6IFwiJ0ludGVyJywgJ1NlZ29lIFVJJywgc3lzdGVtLXVpLCBzYW5zLXNlcmlmXCIsIGNvbG9yOiBDLnRleHQsIGJveFNpemluZzogJ2JvcmRlci1ib3gnIH0sXG4gICAgZ3JpZDQ6IHsgZGlzcGxheTogJ2dyaWQnLCBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KDQsIDFmciknLCBnYXA6ICcxNnB4JyB9LFxuICAgIGdyaWQ2OiB7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdCg2LCAxZnIpJywgZ2FwOiAnMTZweCcsIG1hcmdpbkJvdHRvbTogJzI0cHgnIH0sXG4gICAgZ3JpZDJfMTogeyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICcxZnIgMzQwcHgnLCBnYXA6ICcyMHB4JyB9LFxuICAgIGdyaWQyOiB7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJzFmciAxZnInLCBnYXA6ICcxNnB4JyB9LFxuICAgIGNvbDogeyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcyMHB4JyB9LFxuICAgIHJvdzogeyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JyB9LFxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17bGF5b3V0LnBhZ2V9PlxuICAgICAgPHN0eWxlPntgXG4gICAgICAgICogeyBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XG4gICAgICAgIEBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUludGVyOndnaHRANDAwOzUwMDs2MDAmZGlzcGxheT1zd2FwJyk7XG4gICAgICAgIGJ1dHRvbjpob3ZlciB7IG9wYWNpdHk6IDAuODU7IH1cbiAgICAgICAgdHI6aG92ZXIgdGQgeyBiYWNrZ3JvdW5kOiAjRjlGQUZCOyB9XG4gICAgICBgfTwvc3R5bGU+XG5cbiAgICAgIHsvKiDilIDilIAgUGFnZSBIZWFkZXIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcyNHB4JyB9fT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aDEgc3R5bGU9e1QuaDF9PkRhc2hib2FyZDwvaDE+XG4gICAgICAgICAgPHAgc3R5bGU9e3sgLi4uVC5ib2R5LCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpblRvcDogJzRweCcgfX0+XG4gICAgICAgICAgICB7bmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUlOJywgeyB3ZWVrZGF5OiAnbG9uZycsIHllYXI6ICdudW1lcmljJywgbW9udGg6ICdsb25nJywgZGF5OiAnbnVtZXJpYycgfSl9XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JyB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcsIGJhY2tncm91bmQ6IEMuY2FyZCwgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm9yZGVyUmFkaXVzOiAnOHB4JywgcGFkZGluZzogJzdweCAxMnB4JyB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTNweCcsIGNvbG9yOiBDLmdyYXkgfX0+8J+UjTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cIlNlYXJjaC4uLlwiIHN0eWxlPXt7IGJvcmRlcjogJ25vbmUnLCBvdXRsaW5lOiAnbm9uZScsIGZvbnRTaXplOiAnMTNweCcsIGNvbG9yOiBDLnRleHRTdWIsIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsIHdpZHRoOiAnMTYwcHgnIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgYmFja2dyb3VuZDogQy5jYXJkLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBwYWRkaW5nOiAnOHB4IDEycHgnLCBjdXJzb3I6ICdwb2ludGVyJywgZm9udFNpemU6ICcxNXB4JyB9fT5cbiAgICAgICAgICAgIPCflJRcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICc1cHgnLCByaWdodDogJzVweCcsIHdpZHRoOiAnN3B4JywgaGVpZ2h0OiAnN3B4JywgYmFja2dyb3VuZDogQy5kYW5nZXIsIGJvcmRlclJhZGl1czogJzUwJScsIGJvcmRlcjogYDEuNXB4IHNvbGlkICR7Qy5jYXJkfWAgfX0gLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzEwcHgnLCBiYWNrZ3JvdW5kOiBDLmNhcmQsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzhweCcsIHBhZGRpbmc6ICc2cHggMTJweCA2cHggOHB4JyB9fT5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly91aS1hdmF0YXJzLmNvbS9hcGkvP25hbWU9TXVuZWVzK1dhcmFuJmJhY2tncm91bmQ9MjU2M0VCJmNvbG9yPWZmZiZzaXplPTMyJmZvbnQtc2l6ZT0wLjRcIiBzdHlsZT17eyB3aWR0aDogJzMycHgnLCBoZWlnaHQ6ICczMnB4JywgYm9yZGVyUmFkaXVzOiAnNnB4JyB9fSBhbHQ9XCJhdmF0YXJcIiAvPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQgfX0+TXVuZWVzIFdhcmFuPC9wPlxuICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46IDAsIGZvbnRTaXplOiAnMTFweCcsIGNvbG9yOiBDLnRleHRNdXRlZCB9fT5TdXBlciBBZG1pbjwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMHB4JywgY29sb3I6IEMuZ3JheUxpZ2h0IH19PuKWvDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIOKUgOKUgCBTdGF0IENhcmRzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e2xheW91dC5ncmlkNH0+XG4gICAgICAgIHtzdGF0Q2FyZHMubWFwKChzLCBpKSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2l9IHN0eWxlPXtjYXJkfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsIG1hcmdpbkJvdHRvbTogJzEycHgnIH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMzZweCcsIGhlaWdodDogJzM2cHgnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBiYWNrZ3JvdW5kOiBDLmdyYXlCZywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBmb250U2l6ZTogJzE4cHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gIH19PlxuICAgICAgICAgICAgICAgIHtzLmljb259XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8QmFkZ2UgbGFiZWw9e3MuYmFkZ2V9IHR5cGU9e3MuYmFkZ2VUeXBlfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyAuLi5ULmxhYmVsLCBtYXJnaW5Cb3R0b206ICc2cHgnIH19PntzLmxhYmVsfTwvcD5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMjhweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dCwgbWFyZ2luOiAnMCAwIDRweCcsIGxldHRlclNwYWNpbmc6ICctMC4wMmVtJywgbGluZUhlaWdodDogMSB9fT57cy52YWx1ZX08L3A+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyAuLi5ULnNtYWxsLCBtYXJnaW5Ub3A6ICc0cHgnIH19PntzLnN1Yn08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMjhweCcgfX0gLz5cblxuICAgICAgey8qIOKUgOKUgCBTdXBwb3J0IFRpY2tldHMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcyNHB4JyB9fT5cbiAgICAgICAgPFNlY3Rpb25IZWFkZXIgdGl0bGU9XCJUaWNrZXQgU3VwcG9ydCBDZW50ZXJcIiBhY3Rpb249XCJWaWV3IEFsbCBUaWNrZXRzXCIgLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZ3JpZCcsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoNCwgMWZyKScsIGdhcDogJzE2cHgnIH19PlxuICAgICAgICAgIHt0aWNrZXRDYXJkcy5tYXAoKHMsIGkpID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtpfSBzdHlsZT17Y2FyZH0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsIGdhcDogJzE0cHgnIH19PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc0MHB4JywgaGVpZ2h0OiAnNDBweCcsIGJvcmRlclJhZGl1czogJzEwcHgnLCBiYWNrZ3JvdW5kOiBDLnByaW1hcnlMaWdodCwgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBmb250U2l6ZTogJzIwcHgnLCBjb2xvcjogQy5wcmltYXJ5IH19PlxuICAgICAgICAgICAgICAgICAge3MuaWNvbn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgLi4uVC5sYWJlbCwgbWFyZ2luQm90dG9tOiAnMnB4JywgY29sb3I6IEMuZ3JheSB9fT57cy5sYWJlbH08L3A+XG4gICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogJzI0cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQsIG1hcmdpbjogJzAnIH19PntzLnZhbHVlfTwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcyNHB4JyB9fSAvPlxuXG4gICAgICB7Lyog4pSA4pSAIENoYXJ0cyBSb3cg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovfVxuICAgICAgPGRpdiBzdHlsZT17bGF5b3V0LmdyaWQyfT5cbiAgICAgICAgey8qIFJldmVudWUgTGluZSBDaGFydCAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17VC5oMn0+UmV2ZW51ZSBPdmVydmlldzwvaDI+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IC4uLlQuc21hbGwsIG1hcmdpblRvcDogJzNweCcgfX0+TW9udGhseSByZXZlbnVlIHRyZW5kIOKAlCAyMDI2PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8QmFkZ2UgbGFiZWw9XCJZZWFyIDIwMjZcIiB0eXBlPVwicHJpbWFyeVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPExpbmVDaGFydCBkYXRhPXtyZXZlbnVlRGF0YX0gbGFiZWxzPXtyZXZMYWJlbHN9IGNvbG9yPXtDLnByaW1hcnl9IGhlaWdodD17MTMwfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey8qIEF0dGVuZGFuY2UgQmFyIENoYXJ0ICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzE2cHgnIH19PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtULmgyfT5BdHRlbmRhbmNlIFJhdGU8L2gyPlxuICAgICAgICAgICAgICA8cCBzdHlsZT17eyAuLi5ULnNtYWxsLCBtYXJnaW5Ub3A6ICczcHgnIH19PlRoaXMgd2VlayDigJQgJSBwcmVzZW50PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8QmFkZ2UgbGFiZWw9XCJUaGlzIFdlZWtcIiB0eXBlPVwiZGVmYXVsdFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEJhckNoYXJ0IGRhdGE9e2F0dGVuZERhdGF9IGxhYmVscz17YXR0ZW5kTGFiZWxzfSBjb2xvcj17Qy5wcmltYXJ5fSBoZWlnaHQ9ezEzMH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcyNHB4JyB9fSAvPlxuXG4gICAgICB7Lyog4pSA4pSAIE1haW4gQ29udGVudCBHcmlkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e2xheW91dC5ncmlkMl8xfT5cblxuICAgICAgICB7LyogTGVmdDogUHJvamVjdHMgVGFibGUgKyBLYW5iYW4gKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e2xheW91dC5jb2x9PlxuXG4gICAgICAgICAgey8qIFByb2plY3RzIFRhYmxlICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmR9PlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkZXIgdGl0bGU9XCJQcm9qZWN0c1wiIGFjdGlvbj1cIlZpZXcgQWxsXCIgLz5cbiAgICAgICAgICAgIDx0YWJsZSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBib3JkZXJDb2xsYXBzZTogJ2NvbGxhcHNlJywgZm9udFNpemU6ICcxNHB4JyB9fT5cbiAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgIDx0ciBzdHlsZT17eyBiYWNrZ3JvdW5kOiBDLmdyYXlCZywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCB9fT5cbiAgICAgICAgICAgICAgICAgIHtbJ1Byb2plY3QgTmFtZScsICdDbGllbnQnLCAnRGVhZGxpbmUnLCAnUHJvZ3Jlc3MnLCAnU3RhdHVzJ10ubWFwKGggPT4gKFxuICAgICAgICAgICAgICAgICAgICA8dGgga2V5PXtofSBzdHlsZT17eyBwYWRkaW5nOiAnMTBweCAxMnB4JywgdGV4dEFsaWduOiAnbGVmdCcsIGZvbnRTaXplOiAnMTJweCcsIGZvbnRXZWlnaHQ6IDUwMCwgY29sb3I6IEMudGV4dE11dGVkLCBmb250RmFtaWx5OiAnaW5oZXJpdCcsIGJvcmRlckJvdHRvbTogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAgfX0+e2h9PC90aD5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICB7cHJvamVjdHMubWFwKChwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBiVHlwZSA9IHAuc3RhdHVzID09PSAnQ29tcGxldGVkJyA/ICdzdWNjZXNzJyA6IHAuc3RhdHVzID09PSAnSW4gUHJvZ3Jlc3MnID8gJ3ByaW1hcnknIDogJ3dhcm5pbmcnO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17aX0+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4JywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJMaWdodH1gIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzMycHgnLCBoZWlnaHQ6ICczMnB4JywgYm9yZGVyUmFkaXVzOiAnOHB4JywgYmFja2dyb3VuZDogQy5wcmltYXJ5TGlnaHQsIGNvbG9yOiBDLnByaW1hcnksIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZm9udFdlaWdodDogNjAwLCBmb250U2l6ZTogJzE0cHgnLCBmbGV4U2hyaW5rOiAwIH19PntwLm5hbWU/LlswXX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNTAwLCBjb2xvcjogQy50ZXh0IH19PntwLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgcGFkZGluZzogJzEycHgnLCBjb2xvcjogQy5ncmF5LCBib3JkZXJCb3R0b206IGAxcHggc29saWQgJHtDLmJvcmRlckxpZ2h0fWAgfX0+e3AuY2xpZW50fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4JywgY29sb3I6IEMuZ3JheSwgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJMaWdodH1gLCBmb250U2l6ZTogJzEzcHgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge25ldyBEYXRlKHAuZGVhZGxpbmUpLnRvTG9jYWxlRGF0ZVN0cmluZygnZW4tSU4nLCB7IGRheTogJ251bWVyaWMnLCBtb250aDogJ3Nob3J0JywgeWVhcjogJzItZGlnaXQnIH0pfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4JywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJMaWdodH1gIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIGhlaWdodDogJzZweCcsIGJhY2tncm91bmQ6IEMuZ3JheUJnLCBib3JkZXJSYWRpdXM6ICc5OTlweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIG92ZXJmbG93OiAnaGlkZGVuJywgbWluV2lkdGg6ICc4MHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzEwMCUnLCB3aWR0aDogYCR7cC5wcm9ncmVzc30lYCwgYmFja2dyb3VuZDogcC5zdGF0dXMgPT09ICdDb21wbGV0ZWQnID8gQy5zdWNjZXNzIDogQy5wcmltYXJ5LCBib3JkZXJSYWRpdXM6ICc5OTlweCcsIHRyYW5zaXRpb246ICd3aWR0aCAwLjZzIGVhc2UnIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1pbldpZHRoOiAnMzJweCcgfX0+e3AucHJvZ3Jlc3N9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4JywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJMaWdodH1gIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJhZGdlIGxhYmVsPXtwLnN0YXR1c30gdHlwZT17YlR5cGV9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFRhc2tzICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmR9PlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkZXIgdGl0bGU9XCJQZW5kaW5nIFRhc2tzXCIgYWN0aW9uPVwiQWRkIFRhc2tcIiAvPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICc4cHgnIH19PlxuICAgICAgICAgICAgICB7dGFza3MubWFwKCh0LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcFR5cGUgPSB0LnByaW9yaXR5ID09PSAnVXJnZW50JyA/ICdkYW5nZXInIDogdC5wcmlvcml0eSA9PT0gJ0hpZ2gnID8gJ3dhcm5pbmcnIDogJ2RlZmF1bHQnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNUeXBlID0gdC5zdGF0dXMgPT09ICdJbiBQcm9ncmVzcycgPyAncHJpbWFyeScgOiAnZGVmYXVsdCc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBwYWRkaW5nOiAnMTJweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzhweCcsIGJhY2tncm91bmQ6IEMuZ3JheUJnIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzEwcHgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxNnB4JywgaGVpZ2h0OiAnMTZweCcsIGJvcmRlclJhZGl1czogJzRweCcsIGJvcmRlcjogYDJweCBzb2xpZCAke0MuYm9yZGVyfWAsIGZsZXhTaHJpbms6IDAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyAuLi5ULmJvZHksIGNvbG9yOiBDLnRleHQsIGZvbnRXZWlnaHQ6IDUwMCB9fT57dC50aXRsZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnOHB4JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgPEJhZGdlIGxhYmVsPXt0LnByaW9yaXR5fSB0eXBlPXtwVHlwZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA8QmFkZ2UgbGFiZWw9e3Quc3RhdHVzfSB0eXBlPXtzVHlwZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogUmlnaHQgU2lkZWJhciAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17bGF5b3V0LmNvbH0+XG5cbiAgICAgICAgICB7LyogRmluYW5jZSBTdW1tYXJ5IHdpdGggRG91Z2hudXQgKi99XG4gICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZH0+XG4gICAgICAgICAgICA8U2VjdGlvbkhlYWRlciB0aXRsZT1cIkV4cGVuc2VzIEJyZWFrZG93blwiIC8+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzE2cHgnIH19PlxuICAgICAgICAgICAgICA8RG91Z2hudXRDaGFydFxuICAgICAgICAgICAgICAgIGRhdGE9e1t0b3RhbFJldiB8fCAxOTUwMDAsIHRvdGFsRXhwIHx8IDQ3MDAwXX1cbiAgICAgICAgICAgICAgICBjb2xvcnM9e1tDLnByaW1hcnksIEMuZGFuZ2VyXX1cbiAgICAgICAgICAgICAgICBzaXplPXsxMDB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMTBweCcsIGZsZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdSZXZlbnVlJywgdmFsdWU6IGDigrkkeyh0b3RhbFJldiB8fCAxOTUwMDApLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfWAsIGNvbG9yOiBDLnByaW1hcnkgfSxcbiAgICAgICAgICAgICAgICAgIHsgbGFiZWw6ICdFeHBlbnNlcycsIHZhbHVlOiBg4oK5JHsodG90YWxFeHAgfHwgNDcwMDApLnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfWAsIGNvbG9yOiBDLmRhbmdlciB9LFxuICAgICAgICAgICAgICAgIF0ubWFwKChpdGVtLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aX0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMHB4JywgaGVpZ2h0OiAnMTBweCcsIGJvcmRlclJhZGl1czogJzJweCcsIGJhY2tncm91bmQ6IGl0ZW0uY29sb3IgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17VC5zbWFsbH0+e2l0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0IH19PntpdGVtLnZhbHVlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcxNnB4JywgYm9yZGVyVG9wOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgcGFkZGluZ1RvcDogJzE0cHgnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICc4cHgnIH19PlxuICAgICAgICAgICAgICB7ZmluYW5jZS5tYXAoKGYsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17aX0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxM3B4JyB9fT57Zi50eXBlID09PSAnUmV2ZW51ZScgPyAn4oaRJyA6ICfihpMnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgLi4uVC5zbWFsbCwgY29sb3I6IEMudGV4dFN1YiB9fT57Zi5jYXRlZ29yeX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IGYudHlwZSA9PT0gJ1JldmVudWUnID8gQy5zdWNjZXNzIDogQy5kYW5nZXIgfX0+XG4gICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdSZXZlbnVlJyA/ICcrJyA6ICctJ33igrl7Zi5hbW91bnQ/LnRvTG9jYWxlU3RyaW5nKCdlbi1JTicpfVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIE1lZXRpbmdzICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmR9PlxuICAgICAgICAgICAgPFNlY3Rpb25IZWFkZXIgdGl0bGU9XCJVcGNvbWluZyBNZWV0aW5nc1wiIGFjdGlvbj1cIlNjaGVkdWxlXCIgLz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMTBweCcgfX0+XG4gICAgICAgICAgICAgIHttZWV0aW5ncy5sZW5ndGggPT09IDAgJiYgPHAgc3R5bGU9e3sgLi4uVC5zbWFsbCwgdGV4dEFsaWduOiAnY2VudGVyJywgcGFkZGluZzogJzE2cHggMCcgfX0+Tm8gdXBjb21pbmcgbWVldGluZ3M8L3A+fVxuICAgICAgICAgICAgICB7bWVldGluZ3MubWFwKChtLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzEycHgnLCBwYWRkaW5nOiAnMTJweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzhweCcgfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMzZweCcsIGhlaWdodDogJzM2cHgnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBiYWNrZ3JvdW5kOiBDLnByaW1hcnlMaWdodCwgY29sb3I6IEMucHJpbWFyeSwgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBmb250U2l6ZTogJzE2cHgnLCBmbGV4U2hyaW5rOiAwIH19PvCfk7k8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cbiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQgfX0+e20udGl0bGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46ICcycHggMCAwJywgZm9udFNpemU6ICcxMnB4JywgY29sb3I6IEMudGV4dE11dGVkIH19PnttLnRpbWV9IMK3IHttLnBhcnRpY2lwYW50cz8ubGVuZ3RoIHx8IDB9IHBhcnRpY2lwYW50czwvcD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPEJhZGdlIGxhYmVsPVwiVG9kYXlcIiB0eXBlPVwicHJpbWFyeVwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogQWN0aXZpdHkgRmVlZCAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkfT5cbiAgICAgICAgICAgIDxTZWN0aW9uSGVhZGVyIHRpdGxlPVwiUmVjZW50IEFjdGl2aXR5XCIgLz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMCcgfX0+XG4gICAgICAgICAgICAgIHthY3Rpdml0aWVzLm1hcCgoYWN0LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMTJweCcsIHBhZGRpbmc6ICcxMnB4IDAnLCBib3JkZXJCb3R0b206IGkgPCBhY3Rpdml0aWVzLmxlbmd0aCAtIDEgPyBgMXB4IHNvbGlkICR7Qy5ib3JkZXJMaWdodH1gIDogJ25vbmUnIH19PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzMycHgnLCBoZWlnaHQ6ICczMnB4JywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZDogQy5wcmltYXJ5TGlnaHQsIGNvbG9yOiBDLnByaW1hcnksIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNzAwLCBmbGV4U2hyaW5rOiAwIH19PlxuICAgICAgICAgICAgICAgICAgICB7YWN0LnVzZXI/LlswXSB8fCAnPyd9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcxM3B4JywgY29sb3I6IEMudGV4dCwgbGluZUhlaWdodDogMS41IH19PlxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgZm9udFdlaWdodDogNjAwIH19PnthY3QudXNlcn08L3N0cm9uZz4ge2FjdC5hY3Rpb259IDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBDLnByaW1hcnksIGZvbnRXZWlnaHQ6IDUwMCB9fT57YWN0LnRhcmdldH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAnM3B4IDAgMCcsIGZvbnRTaXplOiAnMTFweCcsIGNvbG9yOiBDLnRleHRNdXRlZCB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7bmV3IERhdGUoYWN0LnRpbWUpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pfSB0b2RheVxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuLy8g4pSA4pSAIEljb25zIChQdXJlIFNWRyBmb3IgMTAwJSBjb21wYXRpYmlsaXR5KSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IEljb24gPSB7XG4gIEhSOiAocyA9IDE4KSA9PiA8c3ZnIHdpZHRoPXtzfSBoZWlnaHQ9e3N9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTE2IDIxdi0yYTQgNCAwIDAgMC00LTRINmE0IDQgMCAwIDAtNCA0djJcIiAvPjxjaXJjbGUgY3g9XCI5XCIgY3k9XCI3XCIgcj1cIjRcIiAvPjxwYXRoIGQ9XCJNMjIgMjF2LTJhNCA0IDAgMCAwLTMtMy44N1wiIC8+PHBhdGggZD1cIk0xNiAzLjEzYTQgNCAwIDAgMSAwIDcuNzVcIiAvPjwvc3ZnPixcbiAgUmVjcnVpdDogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjZcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIyXCIvPjwvc3ZnPixcbiAgT3BzOiAocyA9IDE4KSA9PiA8c3ZnIHdpZHRoPXtzfSBoZWlnaHQ9e3N9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cmVjdCB4PVwiMlwiIHk9XCI3XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjE0XCIgcng9XCIyXCIgcnk9XCIyXCIgLz48cGF0aCBkPVwiTTE2IDIxVjVhMiAyIDAgMCAwLTItMmgtNGEyIDIgMCAwIDAtMiAydjE2XCIgLz48L3N2Zz4sXG4gIFN1cHA6IChzID0gMTgpID0+IDxzdmcgd2lkdGg9e3N9IGhlaWdodD17c30gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIiAvPjxwYXRoIGQ9XCJNOS4wOSA5YTMgMyAwIDAgMSA1LjgzIDFjMCAyLTMgMy0zIDNcIiAvPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjE3XCIgeDI9XCIxMi4wMVwiIHkyPVwiMTdcIiAvPjwvc3ZnPixcbiAgRmluOiAocyA9IDE4KSA9PiA8c3ZnIHdpZHRoPXtzfSBoZWlnaHQ9e3N9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48bGluZSB4MT1cIjEyXCIgeTE9XCIxXCIgeDI9XCIxMlwiIHkyPVwiMjNcIiAvPjxwYXRoIGQ9XCJNMTcgNUg5LjVhMy41IDMuNSAwIDAgMCAwIDdoNWEzLjUgMy41IDAgMCAxIDAgN0g2XCIgLz48L3N2Zz4sXG4gIFNhbGVzOiAocyA9IDE4KSA9PiA8c3ZnIHdpZHRoPXtzfSBoZWlnaHQ9e3N9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwibTIyIDItNyAyMC00LTktOS00WlwiIC8+PHBhdGggZD1cIk0yMiAyIDExIDEzXCIgLz48L3N2Zz4sXG4gIFN5czogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0xMiAyMnM4LTQgOC0xMFY1bC04LTMtOCAzdjdjMCA2IDggMTAgOCAxMFpcIiAvPjwvc3ZnPixcbiAgRGFzaDogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHJlY3QgeD1cIjNcIiB5PVwiM1wiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIiAvPjxyZWN0IHg9XCIxNFwiIHk9XCIzXCIgd2lkdGg9XCI3XCIgaGVpZ2h0PVwiN1wiIC8+PHJlY3QgeD1cIjE0XCIgeT1cIjE0XCIgd2lkdGg9XCI3XCIgaGVpZ2h0PVwiN1wiIC8+PHJlY3QgeD1cIjNcIiB5PVwiMTRcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCI3XCIgLz48L3N2Zz4sXG4gIERvd246IChzID0gMTQpID0+IDxzdmcgd2lkdGg9e3N9IGhlaWdodD17c30gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJtNiA5IDYgNiA2LTZcIiAvPjwvc3ZnPixcbiAgUmlnaHQ6IChzID0gMTQpID0+IDxzdmcgd2lkdGg9e3N9IGhlaWdodD17c30gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJtOSAxOCA2LTYtNi02XCIgLz48L3N2Zz4sXG4gIE91dDogKHMgPSAxOCkgPT4gPHN2ZyB3aWR0aD17c30gaGVpZ2h0PXtzfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk05IDIxSDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJoNFwiIC8+PHBvbHlsaW5lIHBvaW50cz1cIjE2IDE3IDIxIDEyIDE2IDdcIiAvPjxsaW5lIHgxPVwiMjFcIiB5MT1cIjEyXCIgeDI9XCI5XCIgeTI9XCIxMlwiIC8+PC9zdmc+LFxufTtcblxuLy8g4pSA4pSAIENvbG9ycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmNvbnN0IEMgPSB7XG4gIGJnOiAnI0Y4RkFGQycsXG4gIHdoaXRlOiAnI0ZGRkZGRicsXG4gIGJvcmRlcjogJyNFNUU3RUInLFxuICBwcmltYXJ5OiAnIzI1NjNFQicsXG4gIHByaW1hcnlMaWdodDogJyNFRUY0RkYnLFxuICB0ZXh0OiAnIzExMTgyNycsXG4gIHRleHRNdXRlZDogJyM2QjcyODAnLFxuICB0ZXh0RGltOiAnIzlDQTNBRicsXG59O1xuXG5jb25zdCBTaWRlYmFyID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IFtpc0NvbGxhcHNlZCwgc2V0SXNDb2xsYXBzZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbb3BlblNlY3Rpb25zLCBzZXRPcGVuU2VjdGlvbnNdID0gdXNlU3RhdGUoeyAnSFIgTWFuYWdlbWVudCc6IHRydWUsICdPcGVyYXRpb25zJzogdHJ1ZSB9KTtcblxuICBjb25zdCB0b2dnbGVTZWN0aW9uID0gKG5hbWUpID0+IHtcbiAgICBzZXRPcGVuU2VjdGlvbnMocHJldiA9PiAoeyAuLi5wcmV2LCBbbmFtZV06ICFwcmV2W25hbWVdIH0pKTtcbiAgfTtcblxuICBjb25zdCBuYXYgPSBbXG4gICAge1xuICAgICAgbmFtZTogJ0hSIE1hbmFnZW1lbnQnLCBpY29uOiBJY29uLkhSKCksXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IG5hbWU6ICdFbXBsb3llZXMnLCBwYXRoOiAnL2FkbWluL3Jlc291cmNlcy9FbXBsb3llZScgfSxcbiAgICAgICAgeyBuYW1lOiAnSW50ZXJucycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL0ludGVybicgfSxcbiAgICAgICAgeyBuYW1lOiAnQXR0ZW5kYW5jZScsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL0F0dGVuZGFuY2UnIH0sXG4gICAgICAgIHsgbmFtZTogJ0xlYXZlIFJlcXVlc3RzJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvTGVhdmVSZXF1ZXN0JyB9LFxuICAgICAgICB7IG5hbWU6ICdQYXlyb2xsJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvUGF5cm9sbCcgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdSZWNydWl0bWVudCcsIGljb246IEljb24uUmVjcnVpdCgpLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBuYW1lOiAnSm9iIFBvc3RpbmdzJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvSm9iUG9zdGluZycgfSxcbiAgICAgICAgeyBuYW1lOiAnQXBwbGljYXRpb25zJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvSm9iQXBwbGljYXRpb24nIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnT3BlcmF0aW9ucycsIGljb246IEljb24uT3BzKCksXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IG5hbWU6ICdQcm9qZWN0cycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL1Byb2plY3QnIH0sXG4gICAgICAgIHsgbmFtZTogJ1Rhc2tzJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvVGFzaycgfSxcbiAgICAgICAgeyBuYW1lOiAnTWVldGluZ3MnLCBwYXRoOiAnL2FkbWluL3Jlc291cmNlcy9NZWV0aW5nJyB9LFxuICAgICAgICB7IG5hbWU6ICdDYWxlbmRhcicsIHBhdGg6ICcjJyB9LFxuICAgICAgICB7IG5hbWU6ICdUZWFtIEFjdGl2aXR5JywgcGF0aDogJyMnIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnU3VwcG9ydCcsIGljb246IEljb24uU3VwcCgpLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBuYW1lOiAnVGlja2V0cycsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL1RpY2tldCcgfSxcbiAgICAgICAgeyBuYW1lOiAnTGl2ZSBDaGF0JywgcGF0aDogJyMnIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnRmluYW5jZScsIGljb246IEljb24uRmluKCksXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IG5hbWU6ICdSZXZlbnVlJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvRmluYW5jZScgfSxcbiAgICAgICAgeyBuYW1lOiAnSW52b2ljZXMnLCBwYXRoOiAnIycgfSxcbiAgICAgICAgeyBuYW1lOiAnQmlsbHMnLCBwYXRoOiAnIycgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdTYWxlcycsIGljb246IEljb24uU2FsZXMoKSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgbmFtZTogJ0xlYWRzJywgcGF0aDogJy9hZG1pbi9yZXNvdXJjZXMvQ2xpZW50UmVxdWVzdCcgfSxcbiAgICAgICAgeyBuYW1lOiAnRGVhbHMnLCBwYXRoOiAnIycgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdTeXN0ZW0nLCBpY29uOiBJY29uLlN5cygpLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyBuYW1lOiAnU2V0dGluZ3MnLCBwYXRoOiAnIycgfSxcbiAgICAgICAgeyBuYW1lOiAnQWRtaW4gQWNjb3VudCcsIHBhdGg6ICcvYWRtaW4vcmVzb3VyY2VzL01hbmFnZXInIH0sXG4gICAgICBdXG4gICAgfVxuICBdO1xuXG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e1xuICAgICAgd2lkdGg6IGlzQ29sbGFwc2VkID8gJzcycHgnIDogJzI2MHB4JyxcbiAgICAgIGhlaWdodDogJzEwMHZoJyxcbiAgICAgIGJhY2tncm91bmQ6IEMuYmcsXG4gICAgICBib3JkZXJSaWdodDogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsXG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgIGZsZXhTaHJpbms6IDAsXG4gICAgICB0cmFuc2l0aW9uOiAnd2lkdGggMC4zcyBlYXNlJyxcbiAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgZm9udEZhbWlseTogXCInSW50ZXInLCBzYW5zLXNlcmlmXCJcbiAgICB9fT5cbiAgICAgIHsvKiDilIDilIAgQnJhbmQg4pSA4pSAICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBpc0NvbGxhcHNlZCA/ICcyNHB4IDAnIDogJzI0cHggMTZweCcsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBwb3NpdGlvbjogJ3JlbGF0aXZlJywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgbWFyZ2luQm90dG9tOiAnMTJweCcgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0SXNDb2xsYXBzZWQoIWlzQ29sbGFwc2VkKX0gc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAnLTEycHgnLCB0b3A6ICcyNHB4Jywgd2lkdGg6ICcyNHB4JywgaGVpZ2h0OiAnMjRweCcsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgY3Vyc29yOiAncG9pbnRlcicsIGJveFNoYWRvdzogJzAgMnB4IDRweCByZ2JhKDAsMCwwLDAuMDgpJywgekluZGV4OiAxMCB9fT5cbiAgICAgICAgICB7aXNDb2xsYXBzZWQgPyBJY29uLlJpZ2h0KDEyKSA6IDxzdmcgd2lkdGg9XCIxMlwiIGhlaWdodD1cIjEyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCI+PHBhdGggZD1cIm0xNSAxOC02LTYgNi02XCIgLz48L3N2Zz59XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiBpc0NvbGxhcHNlZCA/ICc0MHB4JyA6ICc1MnB4JywgaGVpZ2h0OiBpc0NvbGxhcHNlZCA/ICc0MHB4JyA6ICc1MnB4JywgbWFyZ2luQm90dG9tOiBpc0NvbGxhcHNlZCA/IDAgOiAnMTJweCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICAgIDxpbWcgc3JjPVwiL2xvZ28ucG5nXCIgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIG9iamVjdEZpdDogJ2NvbnRhaW4nIH19IGFsdD1cIkxvZ29cIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgeyFpc0NvbGxhcHNlZCAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgPGgxIHN0eWxlPXt7IG1hcmdpbjogMCwgZm9udFNpemU6ICcxOHB4JywgZm9udFdlaWdodDogNzAwLCBjb2xvcjogQy50ZXh0IH19PmF2ZXJxb24gSFJNUzwvaDE+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46ICcycHggMCAwJywgZm9udFNpemU6ICcxMXB4JywgY29sb3I6IEMudGV4dE11dGVkLCBmb250V2VpZ2h0OiA1MDAgfX0+U21hcnQgQnVzaW5lc3MgTWFuYWdlbWVudDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7Lyog4pSA4pSAIE5hdiDilIDilIAgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG92ZXJmbG93WTogJ2F1dG8nLCBwYWRkaW5nOiAnMCAxMnB4JywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnNnB4JyB9fT5cbiAgICAgICAgPGEgaHJlZj1cIi9hZG1pblwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzEycHgnLCBwYWRkaW5nOiAnMTBweCAxMnB4JywgYm9yZGVyUmFkaXVzOiAnMTBweCcsIHRleHREZWNvcmF0aW9uOiAnbm9uZScsIGNvbG9yOiBjdXJyZW50UGF0aCA9PT0gJy9hZG1pbicgPyBDLnByaW1hcnkgOiBDLnRleHQsIGJhY2tncm91bmQ6IGN1cnJlbnRQYXRoID09PSAnL2FkbWluJyA/IEMud2hpdGUgOiAndHJhbnNwYXJlbnQnLCBib3JkZXI6IGAxcHggc29saWQgJHtjdXJyZW50UGF0aCA9PT0gJy9hZG1pbicgPyBDLmJvcmRlciA6ICd0cmFuc3BhcmVudCd9YCwgYm94U2hhZG93OiBjdXJyZW50UGF0aCA9PT0gJy9hZG1pbicgPyAnMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4wNSknIDogJ25vbmUnIH19PlxuICAgICAgICAgIHtJY29uLkRhc2goMTgpfVxuICAgICAgICAgIHshaXNDb2xsYXBzZWQgJiYgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxNHB4JywgZm9udFdlaWdodDogNjAwIH19PkRhc2hib2FyZDwvc3Bhbj59XG4gICAgICAgIDwvYT5cblxuICAgICAgICB7bmF2Lm1hcCgoc2VjLCBpZHgpID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17aWR4fT5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlU2VjdGlvbihzZWMubmFtZSl9IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIHBhZGRpbmc6ICcxMHB4IDEycHgnLCBib3JkZXJSYWRpdXM6ICcxMHB4JywgYm9yZGVyOiAnbm9uZScsIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsIGN1cnNvcjogJ3BvaW50ZXInLCBjb2xvcjogQy50ZXh0IH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzEycHgnIH19PlxuICAgICAgICAgICAgICAgIHtzZWMuaWNvbn1cbiAgICAgICAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDYwMCB9fT57c2VjLm5hbWV9PC9zcGFuPn1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIHshaXNDb2xsYXBzZWQgJiYgPGRpdiBzdHlsZT17eyB0cmFuc2Zvcm06IG9wZW5TZWN0aW9uc1tzZWMubmFtZV0gPyAncm90YXRlKDBkZWcpJyA6ICdyb3RhdGUoLTkwZGVnKScsIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC4ycycgfX0+e0ljb24uRG93bigxMil9PC9kaXY+fVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICB7IWlzQ29sbGFwc2VkICYmIG9wZW5TZWN0aW9uc1tzZWMubmFtZV0gJiYgKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbjogJzRweCAwIDhweCcsIHBhZGRpbmc6ICc0cHgnLCBiYWNrZ3JvdW5kOiBDLndoaXRlLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMnB4JyB9fT5cbiAgICAgICAgICAgICAgICB7c2VjLml0ZW1zLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gY3VycmVudFBhdGggPT09IGl0ZW0ucGF0aDtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxhIGtleT17aX0gaHJlZj17aXRlbS5wYXRofSBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxMHB4JywgcGFkZGluZzogJzhweCAxMnB4JywgYm9yZGVyUmFkaXVzOiAnOHB4JywgdGV4dERlY29yYXRpb246ICdub25lJywgY29sb3I6IGFjdGl2ZSA/IEMucHJpbWFyeSA6IEMudGV4dE11dGVkLCBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBDLnByaW1hcnlMaWdodCA6ICd0cmFuc3BhcmVudCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IGFjdGl2ZSA/IDYwMCA6IDQwMCB9fT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNHB4JywgaGVpZ2h0OiAnNHB4JywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZDogYWN0aXZlID8gQy5wcmltYXJ5IDogQy50ZXh0RGltIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAge2l0ZW0ubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7Lyog4pSA4pSAIFByb2ZpbGUg4pSA4pSAICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTZweCcsIGJvcmRlclRvcDogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzEwcHgnIH19PlxuICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPUFkbWluJmJhY2tncm91bmQ9MjU2M0VCJmNvbG9yPWZmZiZzaXplPTM2XCIgc3R5bGU9e3sgd2lkdGg6ICczNnB4JywgaGVpZ2h0OiAnMzZweCcsIGJvcmRlclJhZGl1czogJzEwcHgnIH19IC8+XG4gICAgICAgIHshaXNDb2xsYXBzZWQgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQsIHdoaXRlU3BhY2U6ICdub3dyYXAnLCB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5BZG1pbiBVc2VyPC9wPlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzExcHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQgfX0+U3VwZXIgQWRtaW48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIHshaXNDb2xsYXBzZWQgJiYgPGEgaHJlZj1cIi9hZG1pbi9sb2dvdXRcIiBzdHlsZT17eyBjb2xvcjogQy50ZXh0RGltIH19PntJY29uLk91dCgxNil9PC9hPn1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2lkZWJhcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbi8vIOKUgOKUgCBDb2xvcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5jb25zdCBDID0ge1xuICBiZzogJyNGNUY3RkEnLFxuICB3aGl0ZTogJyNGRkZGRkYnLFxuICBib3JkZXI6ICcjRTVFN0VCJyxcbiAgcHJpbWFyeTogJyMyNTYzRUInLFxuICBwcmltYXJ5SG92ZXI6ICcjMUQ0RUQ4JyxcbiAgdGV4dDogJyMxMTE4MjcnLFxuICB0ZXh0TXV0ZWQ6ICcjNkI3MjgwJyxcbn07XG5cbmNvbnN0IExvZ2luID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgYWN0aW9uLCBtZXNzYWdlLCBicmFuZGluZyB9ID0gcHJvcHM7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBtaW5IZWlnaHQ6ICcxMDB2aCcsXG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgIGJhY2tncm91bmQ6IEMuYmcsXG4gICAgICBmb250RmFtaWx5OiBcIidJbnRlcicsIHNhbnMtc2VyaWZcIixcbiAgICAgIHBhZGRpbmc6ICcyMHB4J1xuICAgIH19PlxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBtYXhXaWR0aDogJzQyMHB4JyxcbiAgICAgICAgYmFja2dyb3VuZDogQy53aGl0ZSxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTZweCcsXG4gICAgICAgIGJveFNoYWRvdzogJzAgMTBweCAyNXB4IC01cHggcmdiYSgwLCAwLCAwLCAwLjA1KSwgMCA4cHggMTBweCAtNnB4IHJnYmEoMCwgMCwgMCwgMC4wNSknLFxuICAgICAgICBwYWRkaW5nOiAnNDBweCcsXG4gICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgICAgIH19PlxuICAgICAgICB7LyogTG9nbyBTZWN0aW9uICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzMycHgnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgXG4gICAgICAgICAgICBoZWlnaHQ6ICc2NHB4JywgXG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsIFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsIFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMTZweCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiL2xvZ28ucG5nXCIgc3R5bGU9e3sgXG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLCBcbiAgICAgICAgICAgICAgb2JqZWN0Rml0OiAnY29udGFpbicgXG4gICAgICAgICAgICB9fSBhbHQ9XCJMb2dvXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aDEgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzI0cHgnLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiBDLnRleHQgfX0+V2VsY29tZSBCYWNrPC9oMT5cbiAgICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW46ICc4cHggMCAwJywgZm9udFNpemU6ICcxNHB4JywgY29sb3I6IEMudGV4dE11dGVkIH19PlxuICAgICAgICAgICAgRW50ZXIgeW91ciBjcmVkZW50aWFscyB0byBhY2Nlc3MgdGhlIGFkbWluIHBvcnRhbC5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBFcnJvciBNZXNzYWdlICovfVxuICAgICAgICB7bWVzc2FnZSAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzogJzEycHgnLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGRUYyRjInLFxuICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNGRUUyRTInLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzk5MUIxQicsXG4gICAgICAgICAgICBmb250U2l6ZTogJzEzcHgnLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMjRweCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHttZXNzYWdlLm1lc3NhZ2V9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEZvcm0gKi99XG4gICAgICAgIDxmb3JtIGFjdGlvbj17YWN0aW9ufSBtZXRob2Q9XCJQT1NUXCIgc3R5bGU9e3sgdGV4dEFsaWduOiAnbGVmdCcgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcyMHB4JyB9fT5cbiAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBtYXJnaW5Cb3R0b206ICc4cHgnLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHQgfX0+XG4gICAgICAgICAgICAgIEVtYWlsIEFkZHJlc3NcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJhZG1pbkBhdmVyb24uYWlcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzEycHggMTZweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLFxuICAgICAgICAgICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdib3JkZXItY29sb3IgMC4ycycsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uRm9jdXM9eyhlKSA9PiBlLnRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IEMucHJpbWFyeX1cbiAgICAgICAgICAgICAgb25CbHVyPXsoZSkgPT4gZS50YXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBDLmJvcmRlcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzI4cHgnIH19PlxuICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIG1hcmdpbkJvdHRvbTogJzhweCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dCB9fT5cbiAgICAgICAgICAgICAgUGFzc3dvcmRcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLigKLigKLigKLigKLigKLigKLigKLigKJcIlxuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzEycHggMTZweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLFxuICAgICAgICAgICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdib3JkZXItY29sb3IgMC4ycycsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uRm9jdXM9eyhlKSA9PiBlLnRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IEMucHJpbWFyeX1cbiAgICAgICAgICAgICAgb25CbHVyPXsoZSkgPT4gZS50YXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBDLmJvcmRlcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICcxNHB4JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogQy5wcmltYXJ5LFxuICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAnMTVweCcsXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246ICdiYWNrZ3JvdW5kIDAuMnMnLFxuICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCA2cHggLTFweCByZ2JhKDM3LCA5OSwgMjM1LCAwLjIpJ1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KGUpID0+IGUudGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBDLnByaW1hcnlIb3Zlcn1cbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IGUudGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBDLnByaW1hcnl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgTG9naW4gdG8gV29ya3NwYWNlXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogJzMycHgnLCBib3JkZXJUb3A6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBwYWRkaW5nVG9wOiAnMjBweCcgfX0+XG4gICAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6ICcxMnB4JywgY29sb3I6IEMudGV4dE11dGVkLCBtYXJnaW46IDAgfX0+XG4gICAgICAgICAgICBQb3dlcmVkIGJ5IDxzdHJvbmc+QXZlcm9uIEhSTVMgRW5naW5lPC9zdHJvbmc+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTG9naW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuY29uc3QgQyA9IHtcbiAgYmc6ICcjRjVGN0ZBJyxcbiAgd2hpdGU6ICcjRkZGRkZGJyxcbiAgYm9yZGVyOiAnI0U1RTdFQicsXG4gIHByaW1hcnk6ICcjMjU2M0VCJyxcbiAgdGV4dEJhc2U6ICcjMTExODI3JyxcbiAgdGV4dE11dGVkOiAnIzZCNzI4MCcsXG4gIHRleHRMaWdodDogJyM5Q0EzQUYnLFxuICBncmVlbjogJyMxMEI5ODEnLFxuICBibHVlOiAnIzNCODJGNicsXG4gIG9yYW5nZTogJyNGNTlFMEInLFxuICBwdXJwbGU6ICcjOEI1Q0Y2JyxcbiAgcmVkOiAnI0VGNDQ0NCcsXG4gIGNhcmRTaGFkb3c6ICcwIDFweCAzcHggcmdiYSgwLDAsMCwwLjA1KSwgMCAxcHggMnB4IHJnYmEoMCwwLDAsMC4wMyknLFxufTtcblxuLy8gLS0tIFNWRyBJY29ucyAtLS1cbmNvbnN0IEljb25zID0ge1xuICBCcmllZmNhc2U6ICgpID0+IDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxyZWN0IHg9XCIyXCIgeT1cIjdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMTRcIiByeD1cIjJcIiByeT1cIjJcIi8+PHBhdGggZD1cIk0xNiAyMVY1YTIgMiAwIDAgMC0yLTJoLTRhMiAyIDAgMCAwLTIgMnYxNlwiLz48L3N2Zz4sXG4gIE1hcFBpbjogKCkgPT4gPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMCAxMGMwIDQuOTkzLTUuNTM5IDEwLjE5My03LjM5OSAxMS43OTlhMSAxIDAgMCAxLTEuMjAyIDBDOS41MzkgMjAuMTkzIDQgMTQuOTkzIDQgMTBhOCA4IDAgMCAxIDE2IDBaXCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTBcIiByPVwiM1wiLz48L3N2Zz4sXG4gIEJ1aWxkaW5nOiAoKSA9PiA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj48cmVjdCB4PVwiNFwiIHk9XCIyXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjIwXCIgcng9XCIyXCIgcnk9XCIyXCIvPjxwYXRoIGQ9XCJNOSAyMnYtNGg2djRcIi8+PHBhdGggZD1cIk04IDZoLjAxXCIvPjxwYXRoIGQ9XCJNMTYgNmguMDFcIi8+PHBhdGggZD1cIk0xMiA2aC4wMVwiLz48cGF0aCBkPVwiTTEyIDEwaC4wMVwiLz48cGF0aCBkPVwiTTEyIDE0aC4wMVwiLz48cGF0aCBkPVwiTTE2IDEwaC4wMVwiLz48cGF0aCBkPVwiTTE2IDE0aC4wMVwiLz48cGF0aCBkPVwiTTggMTBoLjAxXCIvPjxwYXRoIGQ9XCJNOCAxNGguMDFcIi8+PC9zdmc+LFxuICBDYWxlbmRhcjogKCkgPT4gPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHJlY3QgeD1cIjNcIiB5PVwiNFwiIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48bGluZSB4MT1cIjE2XCIgeTE9XCIyXCIgeDI9XCIxNlwiIHkyPVwiNlwiLz48bGluZSB4MT1cIjhcIiB5MT1cIjJcIiB4Mj1cIjhcIiB5Mj1cIjZcIi8+PGxpbmUgeDE9XCIzXCIgeTE9XCIxMFwiIHgyPVwiMjFcIiB5Mj1cIjEwXCIvPjwvc3ZnPixcbiAgQWN0aXZpdHk6ICgpID0+IDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwb2x5bGluZSBwb2ludHM9XCIyMiAxMiAxOCAxMiAxNSAyMSA5IDMgNiAxMiAyIDEyXCIvPjwvc3ZnPixcbiAgQ29weTogKCkgPT4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHJlY3QgeD1cIjlcIiB5PVwiOVwiIHdpZHRoPVwiMTNcIiBoZWlnaHQ9XCIxM1wiIHJ4PVwiMlwiIHJ5PVwiMlwiLz48cGF0aCBkPVwiTTUgMTVINGEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg5YTIgMiAwIDAgMSAyIDJ2MVwiLz48L3N2Zz4sXG4gIFByaW50ZXI6ICgpID0+IDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwb2x5bGluZSBwb2ludHM9XCI2IDkgNiAyIDE4IDIgMTggOVwiLz48cGF0aCBkPVwiTTYgMThINGEyIDIgMCAwIDEtMi0ydi01YTIgMiAwIDAgMSAyLTJoMTZhMiAyIDAgMCAxIDIgMnY1YTIgMiAwIDAgMS0yIDJoLTJcIi8+PHJlY3QgeD1cIjZcIiB5PVwiMTRcIiB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiOFwiLz48L3N2Zz4sXG4gIEVkaXQ6ICgpID0+IDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTIgMjBoOVwiLz48cGF0aCBkPVwiTTE2LjUgMy41YTIuMTIgMi4xMiAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNFpcIi8+PC9zdmc+LFxuICBUcmFzaDogKCkgPT4gPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0zIDZoMThcIi8+PHBhdGggZD1cIk0xOSA2djE0YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0yVjZtMyAwVjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlwiLz48bGluZSB4MT1cIjEwXCIgeTE9XCIxMVwiIHgyPVwiMTBcIiB5Mj1cIjE3XCIvPjxsaW5lIHgxPVwiMTRcIiB5MT1cIjExXCIgeDI9XCIxNFwiIHkyPVwiMTdcIi8+PC9zdmc+LFxuICBDaGVjazogKCkgPT4gPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMCA2IDkgMTdsLTUtNVwiLz48L3N2Zz5cbn07XG5cbmNvbnN0IEpvYlNob3cgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQgfSA9IHByb3BzO1xuICBjb25zdCBwID0gcmVjb3JkLnBhcmFtcztcblxuICAvLyBGb3JtYXR0aW5nIGhlbHBlcnNcbiAgY29uc3QgcG9zdGVkRGF0ZSA9IG5ldyBEYXRlKHAucG9zdGVkRGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1VUycsIHsgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnLCB5ZWFyOiAnbnVtZXJpYycgfSk7XG4gIGNvbnN0IGlzQWN0aXZlID0gcC5pc0FjdGl2ZSA9PT0gdHJ1ZSB8fCBwLmlzQWN0aXZlID09PSAndHJ1ZSc7XG4gIGNvbnN0IGpvYlR5cGUgPSBwLnR5cGUgfHwgJ04vQSc7XG5cbiAgY29uc3QgZ2V0Sm9iVHlwZUNvbG9yID0gKCkgPT4ge1xuICAgIHN3aXRjaCAoam9iVHlwZSkge1xuICAgICAgY2FzZSAnRnVsbC10aW1lJzogcmV0dXJuIHsgYmc6ICcjRUZGNkZGJywgdGV4dDogQy5ibHVlIH07XG4gICAgICBjYXNlICdQYXJ0LXRpbWUnOiByZXR1cm4geyBiZzogJyNGRkY3RUQnLCB0ZXh0OiBDLm9yYW5nZSB9O1xuICAgICAgY2FzZSAnSW50ZXJuc2hpcCc6IHJldHVybiB7IGJnOiAnI0Y1RjNGRicsIHRleHQ6IEMucHVycGxlIH07XG4gICAgICBjYXNlICdDb250cmFjdCc6IHJldHVybiB7IGJnOiAnI0VDRkRGNScsIHRleHQ6IEMuZ3JlZW4gfTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiB7IGJnOiAnI0YzRjRGNicsIHRleHQ6IEMudGV4dEJhc2UgfTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHR5cGVTdHlsZSA9IGdldEpvYlR5cGVDb2xvcigpO1xuXG4gIGNvbnN0IGhhbmRsZUR1cGxpY2F0ZSA9ICgpID0+IGFsZXJ0KCdEdXBsaWNhdGUgSm9iIGZpcmVkISBDb25uZWN0aW5nIHRvIEFQSSBob29rLi4uJyk7XG4gIGNvbnN0IGhhbmRsZVByaW50ID0gKCkgPT4gd2luZG93LnByaW50KCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6ICcwJywgbWF4V2lkdGg6ICcxMjAwcHgnLCBtYXJnaW46ICcwIGF1dG8nLCBmb250RmFtaWx5OiBcIidJbnRlcicsIHNhbnMtc2VyaWZcIiB9fT5cbiAgICAgIFxuICAgICAgey8qIEhFQURFUiBTRUNUSU9OICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JywgbWFyZ2luQm90dG9tOiAnMjRweCcgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEzcHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICBEYXNoYm9hcmQgLyBKb2IgUG9zdGluZyAvIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBDLnRleHRCYXNlLCBmb250V2VpZ2h0OiA1MDAgfX0+e3AudGl0bGV9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxoMSBzdHlsZT17eyBmb250U2l6ZTogJzI4cHgnLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiBDLnRleHRCYXNlLCBtYXJnaW46ICcwIDAgNHB4IDAnIH19PntwLnRpdGxlfTwvaDE+XG4gICAgICAgICAgPHAgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogJzE0cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQgfX0+VmlldyBjb21wbGV0ZSBkZXRhaWxzIG9mIHRoZSBqb2IgcG9zdGluZzwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMTJweCcgfX0+XG4gICAgICAgICAgPGEgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvSm9iUG9zdGluZy9yZWNvcmRzLyR7cC5faWR9L2VkaXRgfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnIH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT17eyBoZWlnaHQ6ICczNnB4JywgcGFkZGluZzogJzAgMTZweCcsIGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzZweCcsIGZvbnRTaXplOiAnMTRweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcsIGN1cnNvcjogJ3BvaW50ZXInIH19PlxuICAgICAgICAgICAgICA8SWNvbnMuRWRpdCAvPiBFZGl0XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17eyBoZWlnaHQ6ICczNnB4JywgcGFkZGluZzogJzAgMTZweCcsIGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzZweCcsIGZvbnRTaXplOiAnMTRweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMucmVkLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjdXJzb3I6ICdwb2ludGVyJyB9fT5cbiAgICAgICAgICAgIDxJY29ucy5UcmFzaCAvPiBEZWxldGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZUR1cGxpY2F0ZX0gc3R5bGU9e3sgaGVpZ2h0OiAnMzZweCcsIHBhZGRpbmc6ICcwIDE2cHgnLCBiYWNrZ3JvdW5kOiBDLnByaW1hcnksIGJvcmRlcjogJ25vbmUnLCBib3JkZXJSYWRpdXM6ICc2cHgnLCBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLndoaXRlLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjdXJzb3I6ICdwb2ludGVyJywgYm94U2hhZG93OiAnMCAycHggNHB4IHJnYmEoMzcsOTksMjM1LDAuMiknIH19PlxuICAgICAgICAgICAgPEljb25zLkNvcHkgLz4gRHVwbGljYXRlIEpvYlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogVE9QIFNVTU1BUlkgQ0FSRFMgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDE4MHB4LCAxZnIpKScsIGdhcDogJzE2cHgnLCBtYXJnaW5Cb3R0b206ICcyNHB4JyB9fT5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgcGFkZGluZzogJzIwcHgnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3cgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICA8SWNvbnMuQnJpZWZjYXNlIC8+IDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTJweCcsIGZvbnRXZWlnaHQ6IDYwMCwgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScgfX0+Sm9iIFR5cGU8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzE4cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLnR5cGUgfHwgJ04vQSd9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgcGFkZGluZzogJzIwcHgnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3cgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICA8SWNvbnMuQnVpbGRpbmcgLz4gPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNjAwLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyB9fT5EZXBhcnRtZW50PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxOHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0QmFzZSB9fT57cC5kZXBhcnRtZW50IHx8ICdOL0EnfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6IEMud2hpdGUsIHBhZGRpbmc6ICcyMHB4JywgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJveFNoYWRvdzogQy5jYXJkU2hhZG93IH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JywgY29sb3I6IEMudGV4dE11dGVkLCBtYXJnaW5Cb3R0b206ICc4cHgnIH19PlxuICAgICAgICAgICAgPEljb25zLk1hcFBpbiAvPiA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBmb250V2VpZ2h0OiA2MDAsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnIH19PkxvY2F0aW9uPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxOHB4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0QmFzZSB9fT57cC5sb2NhdGlvbiB8fCAnTi9BJ308L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBDLndoaXRlLCBwYWRkaW5nOiAnMjBweCcsIGJvcmRlclJhZGl1czogJzEycHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3hTaGFkb3c6IEMuY2FyZFNoYWRvdyB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcsIGNvbG9yOiBDLnRleHRNdXRlZCwgbWFyZ2luQm90dG9tOiAnOHB4JyB9fT5cbiAgICAgICAgICAgIDxJY29ucy5BY3Rpdml0eSAvPiA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBmb250V2VpZ2h0OiA2MDAsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnIH19PlN0YXR1czwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBhZGRpbmc6ICc0cHggMTBweCcsIGJvcmRlclJhZGl1czogJzIwcHgnLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGJhY2tncm91bmQ6IGlzQWN0aXZlID8gJyNFQ0ZERjUnIDogJyNGRUYyRjInLCBjb2xvcjogaXNBY3RpdmUgPyBDLmdyZWVuIDogQy5yZWQgfX0+XG4gICAgICAgICAgICAgIHtpc0FjdGl2ZSA/ICdBY3RpdmUnIDogJ0Nsb3NlZCd9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgcGFkZGluZzogJzIwcHgnLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3cgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+XG4gICAgICAgICAgICA8SWNvbnMuQ2FsZW5kYXIgLz4gPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNjAwLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyB9fT5Qb3N0ZWQgRGF0ZTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMThweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UgfX0+e3Bvc3RlZERhdGV9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBNQUlOIERFVEFJTFMgR1JJRCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcyNHB4JywgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnIH19PlxuICAgICAgICBcbiAgICAgICAgey8qIExFRlQgQ09MVU1OOiBDb3JlIERldGFpbHMgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogJzEnLCBtaW5XaWR0aDogJzMwMHB4JywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMjRweCcgfX0+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBDLndoaXRlLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3csIHBhZGRpbmc6ICcyNHB4JyB9fT5cbiAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogJzE1cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlLCBtYXJnaW46ICcwIDAgMjBweCAwJywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgcGFkZGluZ0JvdHRvbTogJzEycHgnIH19PkpvYiBPdmVydmlldzwvaDM+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMjBweCcgfX0+XG4gICAgICAgICAgICAgIDxkaXY+PHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2Jsb2NrJywgZm9udFNpemU6ICcxMnB4JywgY29sb3I6IEMudGV4dE11dGVkLCBtYXJnaW5Cb3R0b206ICc0cHgnIH19PkpvYiBUaXRsZTwvc3Bhbj48c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLnRpdGxlfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj48c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzRweCcgfX0+Sm9iIElEPC9zcGFuPjxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTRweCcsIGZvbnRXZWlnaHQ6IDUwMCwgY29sb3I6IEMudGV4dEJhc2UgfX0+e3AuX2lkfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj48c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzRweCcgfX0+RGVwYXJ0bWVudDwvc3Bhbj48c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLmRlcGFydG1lbnQgfHwgJ0dlbmVyYWwnfTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnYmxvY2snLCBmb250U2l6ZTogJzEycHgnLCBjb2xvcjogQy50ZXh0TXV0ZWQsIG1hcmdpbkJvdHRvbTogJzRweCcgfX0+RW1wbG95bWVudCBUeXBlPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwYWRkaW5nOiAnMnB4IDEwcHgnLCBib3JkZXJSYWRpdXM6ICcyMHB4JywgZm9udFNpemU6ICcxMnB4JywgZm9udFdlaWdodDogNjAwLCBiYWNrZ3JvdW5kOiB0eXBlU3R5bGUuYmcsIGNvbG9yOiB0eXBlU3R5bGUudGV4dCB9fT57am9iVHlwZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PjxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdibG9jaycsIGZvbnRTaXplOiAnMTJweCcsIGNvbG9yOiBDLnRleHRNdXRlZCwgbWFyZ2luQm90dG9tOiAnNHB4JyB9fT5Mb2NhdGlvbjwvc3Bhbj48c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PntwLmxvY2F0aW9ufTwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBDLndoaXRlLCBib3JkZXJSYWRpdXM6ICcxMnB4JywgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm94U2hhZG93OiBDLmNhcmRTaGFkb3csIHBhZGRpbmc6ICcyNHB4JyB9fT5cbiAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogJzE1cHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlLCBtYXJnaW46ICcwIDAgMjBweCAwJywgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgcGFkZGluZ0JvdHRvbTogJzEycHgnIH19PkFjdGl2aXR5IFRpbWVsaW5lPC9oMz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMTZweCcsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiAnN3B4JywgdG9wOiAnMTBweCcsIGJvdHRvbTogJzEwcHgnLCB3aWR0aDogJzJweCcsIGJhY2tncm91bmQ6IEMuYm9yZGVyIH19IC8+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMTJweCcsIHBvc2l0aW9uOiAncmVsYXRpdmUnLCB6SW5kZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzE2cHgnLCBoZWlnaHQ6ICcxNnB4JywgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZDogQy5ibHVlLCBib3JkZXI6IGAzcHggc29saWQgJHtDLndoaXRlfWAgfX0gLz5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBDLnRleHRCYXNlIH19PkpvYiBjcmVhdGVkPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMTFweCcsIGNvbG9yOiBDLnRleHRNdXRlZCB9fT57cG9zdGVkRGF0ZX0gYnkgQWRtaW48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcxMnB4JywgcG9zaXRpb246ICdyZWxhdGl2ZScsIHpJbmRleDogMSB9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTZweCcsIGhlaWdodDogJzE2cHgnLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kOiBDLmJvcmRlciwgYm9yZGVyOiBgM3B4IHNvbGlkICR7Qy53aGl0ZX1gIH19IC8+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNTAwLCBjb2xvcjogQy50ZXh0QmFzZSB9fT5QdWJsaXNoZWQgb24gQ2FyZWVycyBQb3J0YWw8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxMXB4JywgY29sb3I6IEMudGV4dE11dGVkIH19Pntwb3N0ZWREYXRlfSAtIFN5c3RlbTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogUklHSFQgQ09MVU1OOiBEZXNjcmlwdGlvbiBBcmVhICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6ICcyJywgbWluV2lkdGg6ICc0MDBweCcsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzI0cHgnIH19PlxuICAgICAgICAgIFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZDogQy53aGl0ZSwgYm9yZGVyUmFkaXVzOiAnMTJweCcsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJveFNoYWRvdzogQy5jYXJkU2hhZG93LCBwYWRkaW5nOiAnMjRweCcsIGZsZXhHcm93OiAxIH19PlxuICAgICAgICAgICAgPGgzIHN0eWxlPXt7IGZvbnRTaXplOiAnMThweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UsIG1hcmdpbjogJzAgMCAyNHB4IDAnIH19PkpvYiBEZXNjcmlwdGlvbjwvaDM+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMTQuNXB4JywgY29sb3I6ICcjNEI1NTYzJywgbGluZUhlaWdodDogJzEuNycsIHdoaXRlU3BhY2U6ICdwcmUtd3JhcCcgfX0+XG4gICAgICAgICAgICAgIHtwLmRlc2NyaXB0aW9uIHx8IFwiTm8gZGVzY3JpcHRpb24gcHJvdmlkZWQgZm9yIHRoaXMgam9iIGxpc3RpbmcuXCJ9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBCT1RUT00gQUNUSU9OIEJBUiAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlclJhZGl1czogJzEycHgnLCBib3JkZXI6IGAxcHggc29saWQgJHtDLmJvcmRlcn1gLCBib3hTaGFkb3c6IEMuY2FyZFNoYWRvdywgcGFkZGluZzogJzE2cHggMjRweCcsIGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsIGdhcDogJzEycHgnIH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBhbGVydCgnTGluayBDb3BpZWQhJyl9IHN0eWxlPXt7IGhlaWdodDogJzM2cHgnLCBwYWRkaW5nOiAnMCAxNnB4JywgYmFja2dyb3VuZDogQy53aGl0ZSwgYm9yZGVyOiBgMXB4IHNvbGlkICR7Qy5ib3JkZXJ9YCwgYm9yZGVyUmFkaXVzOiAnNnB4JywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy50ZXh0QmFzZSwgY3Vyc29yOiAncG9pbnRlcicgfX0+Q29weSBMaW5rPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZVByaW50fSBzdHlsZT17eyBoZWlnaHQ6ICczNnB4JywgcGFkZGluZzogJzAgMTZweCcsIGJhY2tncm91bmQ6IEMud2hpdGUsIGJvcmRlcjogYDFweCBzb2xpZCAke0MuYm9yZGVyfWAsIGJvcmRlclJhZGl1czogJzZweCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IEMudGV4dEJhc2UsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcsIGN1cnNvcjogJ3BvaW50ZXInIH19PlxuICAgICAgICAgICAgICA8SWNvbnMuUHJpbnRlciAvPiBEb3dubG9hZCBQREZcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGEgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvSm9iUG9zdGluZy9yZWNvcmRzLyR7cC5faWR9L2VkaXRgfSBzdHlsZT17eyB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnIH19PlxuICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPXt7IGhlaWdodDogJzM2cHgnLCBwYWRkaW5nOiAnMCAxNnB4JywgYmFja2dyb3VuZDogQy5wcmltYXJ5LCBib3JkZXI6ICdub25lJywgYm9yZGVyUmFkaXVzOiAnNnB4JywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogNjAwLCBjb2xvcjogQy53aGl0ZSwgY3Vyc29yOiAncG9pbnRlcicgfX0+RWRpdCBDb25maWd1cmF0aW9uPC9idXR0b24+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBKb2JTaG93O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgR2xvYmFsU2hvdyA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzI0cHgnLCBiYWNrZ3JvdW5kOiAnI0ZGRkZGRicsIGJvcmRlclJhZGl1czogJzE2cHgnIH19PlxuICAgICAgPGgxPntyZXNvdXJjZS5uYW1lfSBEZXRhaWxzPC9oMT5cbiAgICAgIDxwcmU+e0pTT04uc3RyaW5naWZ5KHJlY29yZC5wYXJhbXMsIG51bGwsIDIpfTwvcHJlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2xvYmFsU2hvdztcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9EYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFNpZGViYXIgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvU2lkZWJhcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2lkZWJhciA9IFNpZGViYXJcbmltcG9ydCBMb2dpbiBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Mb2dpbidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTG9naW4gPSBMb2dpblxuaW1wb3J0IEpvYlNob3cgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvSm9iU2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuSm9iU2hvdyA9IEpvYlNob3dcbmltcG9ydCBHbG9iYWxTaG93IGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL0dsb2JhbFNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkdsb2JhbFNob3cgPSBHbG9iYWxTaG93Il0sIm5hbWVzIjpbIkMiLCJiZyIsImNhcmQiLCJib3JkZXIiLCJib3JkZXJMaWdodCIsInByaW1hcnkiLCJwcmltYXJ5SG92ZXIiLCJwcmltYXJ5TGlnaHQiLCJncmF5IiwiZ3JheUxpZ2h0IiwiZ3JheUJnIiwic3VjY2VzcyIsInN1Y2Nlc3NMaWdodCIsIndhcm5pbmciLCJ3YXJuaW5nTGlnaHQiLCJkYW5nZXIiLCJkYW5nZXJMaWdodCIsInRleHQiLCJ0ZXh0U3ViIiwidGV4dE11dGVkIiwiVCIsImgxIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiY29sb3IiLCJtYXJnaW4iLCJsZXR0ZXJTcGFjaW5nIiwiaDIiLCJoMyIsImJvZHkiLCJzbWFsbCIsImxhYmVsIiwidGV4dFRyYW5zZm9ybSIsImJhY2tncm91bmQiLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJwYWRkaW5nIiwiTGluZUNoYXJ0IiwiZGF0YSIsImxhYmVscyIsImhlaWdodCIsIlciLCJIIiwicGFkIiwibWF4IiwiTWF0aCIsIm1pbiIsInJhbmdlIiwicHRzIiwibWFwIiwidiIsImkiLCJ4IiwibGVuZ3RoIiwieSIsInBvbHlsaW5lIiwicCIsImpvaW4iLCJhcmVhIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwidmlld0JveCIsInN0eWxlIiwid2lkdGgiLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwiaWQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsIm9mZnNldCIsInN0b3BDb2xvciIsInN0b3BPcGFjaXR5IiwiZCIsImZpbGwiLCJwb2ludHMiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVqb2luIiwic3Ryb2tlTGluZWNhcCIsImtleSIsImN4IiwiY3kiLCJyIiwibCIsInRleHRBbmNob3IiLCJCYXJDaGFydCIsImdhcCIsImJ3IiwiYmgiLCJyeCIsImZpbGxPcGFjaXR5IiwiRG91Z2hudXRDaGFydCIsImNvbG9ycyIsInNpemUiLCJ0b3RhbCIsInJlZHVjZSIsImEiLCJiIiwiaXIiLCJhbmdsZSIsIlBJIiwic2xpY2VzIiwic3dlZXAiLCJjb3MiLCJzaW4iLCJsYXJnZSIsInhpMSIsInlpMSIsInhpMiIsInlpMiIsInMiLCJCYWRnZSIsInR5cGUiLCJkZWZhdWx0IiwiZGlzcGxheSIsIkJ0biIsImNoaWxkcmVuIiwidmFyaWFudCIsIm9uQ2xpY2siLCJzdHlsZXMiLCJzZWNvbmRhcnkiLCJnaG9zdCIsImN1cnNvciIsImZvbnRGYW1pbHkiLCJ0cmFuc2l0aW9uIiwiU2VjdGlvbkhlYWRlciIsInRpdGxlIiwiYWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwibWFyZ2luQm90dG9tIiwiRGFzaGJvYXJkIiwic2V0RGF0YSIsInVzZVN0YXRlIiwibG9hZGluZyIsInNldExvYWRpbmciLCJ1c2VFZmZlY3QiLCJmZXRjaCIsInRoZW4iLCJqc29uIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJmaW5hbGx5IiwibWluSGVpZ2h0IiwidGV4dEFsaWduIiwiYm9yZGVyVG9wIiwiYW5pbWF0aW9uIiwic3RhdHMiLCJwcm9qZWN0cyIsInRhc2tzIiwiZmluYW5jZSIsImFjdGl2aXRpZXMiLCJtZWV0aW5ncyIsInJldmVudWUiLCJtb250aGx5UmV2ZW51ZSIsInJldmVudWVEYXRhIiwicmV2TGFiZWxzIiwiYXR0ZW5kRGF0YSIsImF0dGVuZExhYmVscyIsInRvdGFsRXhwIiwiZmlsdGVyIiwiZiIsImFtb3VudCIsInRvdGFsUmV2Iiwic3RhdENhcmRzIiwiaWNvbiIsInZhbHVlIiwidG90YWxFbXBsb3llZXMiLCJzdWIiLCJiYWRnZSIsImJhZGdlVHlwZSIsInRvdGFsSW50ZXJucyIsImFjdGl2ZVByb2plY3RzIiwicGVuZGluZ1Rhc2tzIiwidG9Mb2NhbGVTdHJpbmciLCJwZW5kaW5nUGF5bWVudHMiLCJhdHRlbmRhbmNlUmF0ZSIsIm5ld0NsaWVudFJlcXVlc3RzIiwidE1ldHJpY3MiLCJ0aWNrZXRNZXRyaWNzIiwib3BlbiIsImNsb3NlZCIsInVyZ2VudCIsInBlbmRpbmciLCJ0aWNrZXRDYXJkcyIsImxheW91dCIsInBhZ2UiLCJib3hTaXppbmciLCJncmlkNCIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJncmlkNiIsImdyaWQyXzEiLCJncmlkMiIsImNvbCIsImZsZXhEaXJlY3Rpb24iLCJtYXJnaW5Ub3AiLCJEYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwid2Vla2RheSIsInllYXIiLCJtb250aCIsImRheSIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsInBvc2l0aW9uIiwidG9wIiwicmlnaHQiLCJzcmMiLCJhbHQiLCJsaW5lSGVpZ2h0IiwiYm9yZGVyQ29sbGFwc2UiLCJib3JkZXJCb3R0b20iLCJoIiwiYlR5cGUiLCJzdGF0dXMiLCJmbGV4U2hyaW5rIiwibmFtZSIsImNsaWVudCIsImRlYWRsaW5lIiwiZmxleCIsIm92ZXJmbG93IiwibWluV2lkdGgiLCJwcm9ncmVzcyIsInQiLCJwVHlwZSIsInByaW9yaXR5Iiwic1R5cGUiLCJpdGVtIiwicGFkZGluZ1RvcCIsImNhdGVnb3J5IiwibSIsInRpbWUiLCJwYXJ0aWNpcGFudHMiLCJhY3QiLCJ1c2VyIiwidGFyZ2V0IiwidG9Mb2NhbGVUaW1lU3RyaW5nIiwiaG91ciIsIm1pbnV0ZSIsIkljb24iLCJIUiIsIlJlY3J1aXQiLCJPcHMiLCJyeSIsIlN1cHAiLCJGaW4iLCJTYWxlcyIsIlN5cyIsIkRhc2giLCJEb3duIiwiUmlnaHQiLCJPdXQiLCJ3aGl0ZSIsInRleHREaW0iLCJTaWRlYmFyIiwicHJvcHMiLCJpc0NvbGxhcHNlZCIsInNldElzQ29sbGFwc2VkIiwib3BlblNlY3Rpb25zIiwic2V0T3BlblNlY3Rpb25zIiwidG9nZ2xlU2VjdGlvbiIsInByZXYiLCJuYXYiLCJpdGVtcyIsInBhdGgiLCJjdXJyZW50UGF0aCIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJib3JkZXJSaWdodCIsInpJbmRleCIsIm9iamVjdEZpdCIsIm92ZXJmbG93WSIsImhyZWYiLCJ0ZXh0RGVjb3JhdGlvbiIsInNlYyIsImlkeCIsInRyYW5zZm9ybSIsImFjdGl2ZSIsIndoaXRlU3BhY2UiLCJ0ZXh0T3ZlcmZsb3ciLCJMb2dpbiIsIm1lc3NhZ2UiLCJicmFuZGluZyIsIm1heFdpZHRoIiwibWV0aG9kIiwicmVxdWlyZWQiLCJvbkZvY3VzIiwiZSIsImJvcmRlckNvbG9yIiwib25CbHVyIiwib25Nb3VzZUVudGVyIiwib25Nb3VzZUxlYXZlIiwidGV4dEJhc2UiLCJ0ZXh0TGlnaHQiLCJncmVlbiIsImJsdWUiLCJvcmFuZ2UiLCJwdXJwbGUiLCJyZWQiLCJjYXJkU2hhZG93IiwiSWNvbnMiLCJCcmllZmNhc2UiLCJNYXBQaW4iLCJCdWlsZGluZyIsIkNhbGVuZGFyIiwiQWN0aXZpdHkiLCJDb3B5IiwiUHJpbnRlciIsIkVkaXQiLCJUcmFzaCIsIkpvYlNob3ciLCJyZWNvcmQiLCJwYXJhbXMiLCJwb3N0ZWREYXRlIiwiaXNBY3RpdmUiLCJqb2JUeXBlIiwiZ2V0Sm9iVHlwZUNvbG9yIiwidHlwZVN0eWxlIiwiaGFuZGxlRHVwbGljYXRlIiwiYWxlcnQiLCJoYW5kbGVQcmludCIsInByaW50IiwiX2lkIiwiZGVwYXJ0bWVudCIsInBhZGRpbmdCb3R0b20iLCJsZWZ0IiwiYm90dG9tIiwiZmxleEdyb3ciLCJkZXNjcmlwdGlvbiIsIkdsb2JhbFNob3ciLCJyZXNvdXJjZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFFQTtFQUNBLE1BQU1BLEdBQUMsR0FBRztFQUNSQyxFQUFBQSxFQUFFLEVBQUUsU0FBUztFQUNiQyxFQUFBQSxJQUFJLEVBQUUsU0FBUztFQUNmQyxFQUFBQSxNQUFNLEVBQUUsU0FBUztFQUNqQkMsRUFBQUEsV0FBVyxFQUFFLFNBQVM7RUFDdEJDLEVBQUFBLE9B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
