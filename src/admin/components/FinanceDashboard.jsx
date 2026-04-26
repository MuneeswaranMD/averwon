import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

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

const FinanceDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div style={{ padding: '40px', color: C.muted }}>Loading Financial Intelligence...</div>;

  const stats = data.stats || {};
  const monthlyRev = data.monthlyRevenue || { data: [0], labels: [''] };

  const lineData = {
    labels: monthlyRev.labels,
    datasets: [{
      label: 'Monthly Revenue',
      data: monthlyRev.data,
      borderColor: C.primary,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fill: true,
      tension: 0.4
    }]
  };

  const pieData = {
    labels: ['Salary', 'Software', 'Marketing', 'Office'],
    datasets: [{
      data: [65, 12, 8, 15],
      backgroundColor: [C.primary, C.success, C.warning, C.secondary],
      borderWidth: 0
    }]
  };

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: C.primary, margin: 0 }}>Finance Overview</h1>
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
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>₹{(stats.monthlyRevenue || 0).toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '12px', color: C.success }}>Real-time stats</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Revenue This Year</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.text }}>₹{(stats.monthlyRevenue * 8 || 0).toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '12px', color: C.primary }}>Target: ₹10L+</span>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '14px', color: C.muted, fontWeight: 600 }}>Pending Payments</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.warning }}>₹{(stats.pendingPayments || 0).toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '12px', color: C.secondary }}>Unpaid invoices</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div style={{ ...cardStyle }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Recent Invoices</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.invoices?.map(inv => (
              <div key={inv._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: C.bg, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{inv.clientName}</div>
                  <div style={{ fontSize: '12px', color: C.muted }}>{inv.projectName} • Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: C.primary }}>₹{inv.invoiceAmount.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '10px', color: inv.status === 'Paid' ? C.success : '#F59E0B' }}>{inv.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...cardStyle }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Recent Bills (Outflow)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.bills?.map(bill => (
              <div key={bill._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: C.bg, borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{bill.vendorName}</div>
                  <div style={{ fontSize: '12px', color: C.muted }}>{bill.category} • Due: {new Date(bill.dueDate).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#EF4444' }}>-₹{bill.amount.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '10px', color: bill.status === 'Paid' ? C.success : '#F59E0B' }}>{bill.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: C.white,
  padding: '24px',
  borderRadius: '16px',
  border: `1px solid ${C.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

export default FinanceDashboard;
