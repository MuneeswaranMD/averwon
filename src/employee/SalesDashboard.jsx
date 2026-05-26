import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  ClipboardList, 
  Briefcase, 
  Users, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { API_ENDPOINTS } from '../api-config';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Z = {
  accent: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  teal: '#06B6D4',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  cardBg: '#FFFFFF',
  pageBg: '#F8FAFC',
};

const Card = ({ children, style = {} }) => (
  <div 
    style={{ 
      background: Z.cardBg, 
      borderRadius: 16, 
      border: `1px solid ${Z.border}`, 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', 
      padding: '24px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      ...style 
    }}
  >
    {children}
  </div>
);

const SalesDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) { navigate('/employee/login'); return; }

    fetch(API_ENDPOINTS.EMPLOYEE_SALES_OVERVIEW, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('employeeData');
          navigate('/employee/login');
          throw new Error('Session expired. Please log in again.');
        }
        if (res.status === 403) {
          throw new Error('Access denied: You do not have permission to view the Sales Dashboard.');
        }
        return res.json();
      })
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: Z.muted, fontSize: 15, fontWeight: 500 }}>Loading sales & pipeline metrics...</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 24, background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA', color: Z.danger }}>
      <AlertCircle size={24} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Unauthorized / Access Restricted</div>
        <div style={{ fontSize: 14, marginTop: 4 }}>{error}</div>
      </div>
    </div>
  );

  const stats = data?.stats || { totalLeads: 0, totalDeals: 0, pipelineValue: 0, wonValue: 0 };
  const charts = data?.charts || { leadStatuses: [], leadCounts: [], dealStatuses: [], dealCounts: [] };
  const recentLeads = data?.recentLeads || [];
  const recentDeals = data?.recentDeals || [];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Chart configs
  const leadsChartData = {
    labels: charts.leadStatuses,
    datasets: [{
      label: 'Leads by Status',
      data: charts.leadCounts,
      backgroundColor: [
        '#3B82F6', // Blue
        '#06B6D4', // Teal
        '#8B5CF6', // Purple
        '#F59E0B', // Amber
        '#10B981', // Emerald
        '#64748B', // Slate
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  };

  const dealsChartData = {
    labels: charts.dealStatuses,
    datasets: [{
      label: 'Deals by Stage',
      data: charts.dealCounts,
      backgroundColor: 'rgba(37, 99, 235, 0.8)',
      borderColor: '#2563EB',
      borderWidth: 1.5,
      borderRadius: 6,
    }]
  };

  return (
    <div style={{ color: Z.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', 
        borderRadius: 16,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        boxShadow: '0 10px 25px -5px rgba(15,23,42,0.15)',
        color: '#FFFFFF'
      }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Sales & CRM Suite</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '6px 0 0 0', fontWeight: 500 }}>
            Real-time pipeline monitoring, lead tracking, and deal conversion rates.
          </p>
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <TrendingUp size={28} color="#93C5FD" />
        </div>
      </div>

      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 28 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: Z.muted, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Leads</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: Z.text, marginTop: 8 }}>{stats.totalLeads}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(59, 130, 246, 0.1)', color: Z.accent }}>
              <ClipboardList size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 16, fontSize: 12, color: Z.success, fontWeight: 600 }}>
            <ArrowUpRight size={14} /> <span>12.5% this month</span>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: Z.muted, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Deals</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: Z.text, marginTop: 8 }}>{stats.totalDeals}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(139, 92, 246, 0.1)', color: Z.purple }}>
              <Briefcase size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 16, fontSize: 12, color: Z.success, fontWeight: 600 }}>
            <ArrowUpRight size={14} /> <span>8.2% conversion rate</span>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: Z.muted, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pipeline Value</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: Z.text, marginTop: 12, letterSpacing: -0.5 }}>
                {formatCurrency(stats.pipelineValue)}
              </div>
            </div>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(245, 158, 11, 0.1)', color: Z.warning }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 16, fontSize: 12, color: Z.muted }}>
            <span>Active negotiations & proposals</span>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: Z.muted, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Closed Won</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: Z.success, marginTop: 12, letterSpacing: -0.5 }}>
                {formatCurrency(stats.wonValue)}
              </div>
            </div>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', color: Z.success }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 16, fontSize: 12, color: Z.success, fontWeight: 600 }}>
            <ArrowUpRight size={14} /> <span>18.9% target growth</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <Card style={{ minHeight: 340 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardList size={18} color={Z.accent} /> Leads by Current Status
          </h3>
          <div style={{ position: 'relative', height: 240, display: 'flex', justifyContent: 'center' }}>
            <Doughnut 
              data={leadsChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } }
                }
              }} 
            />
          </div>
        </Card>

        <Card style={{ minHeight: 340 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={18} color={Z.purple} /> Deal Pipeline Stages
          </h3>
          <div style={{ position: 'relative', height: 240 }}>
            <Bar 
              data={dealsChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { grid: { color: 'rgba(0, 0, 0, 0.04)' }, ticks: { font: { family: 'Inter', size: 10 } } },
                  x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 10 } } }
                }
              }} 
            />
          </div>
        </Card>
      </div>

      {/* Split Row for Recent Leads & Deals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color={Z.accent} /> Recent Leads
            </h3>
            <button 
              onClick={() => navigate('/employee/sales/leads')}
              style={{ border: 'none', background: 'transparent', color: Z.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: Z.muted, fontSize: 13.5 }}>No recent leads registered.</div>
            ) : (
              recentLeads.map(lead => (
                <div 
                  key={lead._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: '#F8FAFC',
                    border: '1px solid #EEF2F6',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/employee/sales/leads')}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{lead.name}</div>
                    <div style={{ color: Z.muted, fontSize: 11.5, marginTop: 2 }}>{lead.company || lead.email}</div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: lead.status === 'Converted' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                    color: lead.status === 'Converted' ? Z.success : Z.accent,
                  }}>{lead.status}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={18} color={Z.purple} /> Active Deals
            </h3>
            <button 
              onClick={() => navigate('/employee/sales/deals')}
              style={{ border: 'none', background: 'transparent', color: Z.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentDeals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: Z.muted, fontSize: 13.5 }}>No active deals found.</div>
            ) : (
              recentDeals.map(deal => (
                <div 
                  key={deal._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: '#F8FAFC',
                    border: '1px solid #EEF2F6',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/employee/sales/deals')}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{deal.title || deal.dealName || 'CRM Deal'}</div>
                    <div style={{ color: Z.success, fontSize: 12, fontWeight: 700, marginTop: 2 }}>{formatCurrency(deal.dealValue)}</div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: deal.status === 'Won' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    color: deal.status === 'Won' ? Z.success : Z.warning,
                  }}>{deal.status}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;
