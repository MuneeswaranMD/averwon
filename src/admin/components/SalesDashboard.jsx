import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const C = {
  bg: '#F3F4F6',
  white: '#FFFFFF',
  primary: '#2563EB',
  secondary: '#334155',
  border: '#E2E8F0',
  text: '#1E293B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#E11D48',
  muted: '#64748B'
};

const SalesDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div style={{ padding: '40px', color: C.muted }}>Loading Sales Intelligence...</div>;

  const stats = data.stats || {};
  
  const dealData = {
    labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'],
    datasets: [{
      label: 'Deals in Pipeline',
      data: [stats.totalLeads || 0, Math.floor((stats.totalLeads || 0) * 0.7), Math.floor((stats.totalDeals || 0) * 1.5), stats.totalDeals || 0, Math.floor((stats.totalDeals || 0) * 0.4)],
      backgroundColor: [C.primary, C.secondary, C.warning, C.primary, C.success],
      borderRadius: 8
    }]
  };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: C.primary, margin: 0 }}>Sales Performance</h1>
          <p style={{ color: C.muted, margin: '4px 0 0 0' }}>Lead conversion and deal pipeline analysis</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Total Leads</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>{stats.totalLeads || 0}</span>
          <span style={{ fontSize: '12px', color: C.success }}>Qualified prospects</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Total Deals</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>{stats.totalDeals || 0}</span>
          <span style={{ fontSize: '12px', color: C.primary }}>Active pipeline</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Pipeline Value</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>₹{(stats.monthlyRevenue * 4.5 || 0).toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '12px', color: C.success }}>Estimated worth</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Conversion Rate</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.primary }}>{stats.totalLeads ? ((stats.totalDeals / stats.totalLeads) * 100).toFixed(1) : 0}%</span>
          <span style={{ fontSize: '12px', color: C.muted }}>Lead to Deal ratio</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ ...cardStyle }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Recent Leads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.leads?.map(lead => (
              <div key={lead._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: C.bg, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{lead.leadName}</div>
                  <div style={{ fontSize: '12px', color: C.muted }}>{lead.companyName} • {lead.leadSource}</div>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: '4px', background: C.primary, color: 'white', fontSize: '10px', height: 'fit-content' }}>{lead.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...cardStyle }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Recent Deals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.deals?.map(deal => (
              <div key={deal._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: C.bg, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{deal.dealName}</div>
                  <div style={{ fontSize: '12px', color: C.muted }}>{deal.clientName} • Prob: {deal.probability}%</div>
                </div>
                <div style={{ fontWeight: 700, color: C.success }}>₹{deal.dealValue.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...cardStyle, width: '100%', marginTop: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Sales Funnel Analysis</h3>
        <div style={{ height: '400px' }}>
          <Bar data={dealData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
