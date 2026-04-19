import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const C = {
  bg: '#F4F7FA',
  white: '#FFFFFF',
  primary: '#1A73E8',
  secondary: '#64748B',
  border: '#E2E8F0',
  text: '#1E293B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  muted: '#94A3B8'
};

const FinanceDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div style={{ padding: '40px', color: C.muted }}>Loading Financial Intelligence...</div>;

  const cardStyle = {
    background: C.white,
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${C.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue',
      data: [12000, 19000, 15000, 22000, 28000, 31000],
      borderColor: C.primary,
      backgroundColor: 'rgba(26, 115, 232, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const pieData = {
    labels: ['Salary', 'Software', 'Marketing', 'Office'],
    datasets: [{
      data: [60, 15, 10, 15],
      backgroundColor: [C.primary, C.success, C.warning, C.secondary],
      borderWidth: 0
    }]
  };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: C.text, margin: 0 }}>Finance Overview</h1>
          <p style={{ color: C.muted, margin: '4px 0 0 0' }}>Real-time revenue and expenditure tracking</p>
        </div>
        <button style={{ 
          padding: '10px 20px', 
          background: C.primary, 
          color: C.white, 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: 600,
          cursor: 'pointer'
        }}>Export Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Total Revenue</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>${(stats.monthlyRevenue || 0).toLocaleString()}</span>
          <span style={{ fontSize: '12px', color: C.success }}>+12.5% from last month</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Revenue This Year</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>$452,000</span>
          <span style={{ fontSize: '12px', color: C.primary }}>Target: $500k</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Pending Payments</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.warning }}>${(stats.pendingPayments || 0).toLocaleString()}</span>
          <span style={{ fontSize: '12px', color: C.secondary }}>8 Pending Invoices</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Profit Margin</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.success }}>32.4%</span>
          <span style={{ fontSize: '12px', color: C.success }}>Above Industry Avg</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ ...cardStyle }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Revenue Trends</h3>
          <div style={{ height: '300px' }}>
            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div style={{ ...cardStyle }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Expenses by Category</h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
