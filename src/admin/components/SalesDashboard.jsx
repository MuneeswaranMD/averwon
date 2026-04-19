import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

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

const SalesDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div style={{ padding: '40px', color: C.muted }}>Loading Sales Intelligence...</div>;

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

  const dealData = {
    labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'],
    datasets: [{
      label: 'Deals in Pipeline',
      data: [45, 32, 18, 12, 8],
      backgroundColor: [C.primary, C.secondary, C.warning, C.primary, C.success],
      borderRadius: 8
    }]
  };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: C.text, margin: 0 }}>Sales Performance</h1>
          <p style={{ color: C.muted, margin: '4px 0 0 0' }}>Lead conversion and deal pipeline analysis</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Total Leads</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>{stats.totalLeads || 0}</span>
          <span style={{ fontSize: '12px', color: C.success }}>+24 new this week</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Total Deals</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>{stats.totalDeals || 0}</span>
          <span style={{ fontSize: '12px', color: C.primary }}>Active: 15</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Pipeline Value</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>$1.2M</span>
          <span style={{ fontSize: '12px', color: C.success }}>85% on track</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Conversion Rate</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.primary }}>18.5%</span>
          <span style={{ fontSize: '12px', color: C.muted }}>Industry Avg: 15%</span>
        </div>
      </div>

      <div style={{ ...cardStyle, width: '100%' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Sales Funnel Analysis</h3>
        <div style={{ height: '400px' }}>
          <Bar data={dealData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
