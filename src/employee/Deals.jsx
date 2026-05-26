import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  User, 
  Building,
  Loader2, 
  AlertCircle,
  Percent,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

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
  <div style={{ background: Z.cardBg, borderRadius: 16, border: `1px solid ${Z.border}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '20px', ...style }}>
    {children}
  </div>
);

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) { navigate('/employee/login'); return; }

    fetch(API_ENDPOINTS.EMPLOYEE_SALES_DEALS, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('employeeData');
          navigate('/employee/login');
          throw new Error('Session expired. Please log in.');
        }
        if (res.status === 403) {
          throw new Error('Access denied: You do not have permission to view the Deals page.');
        }
        return res.json();
      })
      .then(d => {
        if (d.error) throw new Error(d.error);
        setDeals(d);
        setFilteredDeals(d);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    let result = [...deals];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        (d.title || d.dealName || '').toLowerCase().includes(q) ||
        (d.company || '').toLowerCase().includes(q) ||
        (d.customerName || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(d => d.status === statusFilter);
    }

    setFilteredDeals(result);
  }, [searchQuery, statusFilter, deals]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: Z.muted, fontSize: 15, fontWeight: 500 }}>Loading sales pipeline deals...</div>
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

  const getConfidenceLevel = (status) => {
    switch (status) {
      case 'Open': return { pct: 25, color: Z.accent, label: 'Low confidence' };
      case 'Negotiation': return { pct: 60, color: Z.warning, label: 'Mid confidence' };
      case 'Proposal Sent': return { pct: 80, color: Z.purple, label: 'High confidence' };
      case 'Won': return { pct: 100, color: Z.success, label: 'Closed Won' };
      case 'Lost': return { pct: 0, color: Z.danger, label: 'Closed Lost' };
      default: return { pct: 10, color: Z.muted, label: 'Prospecting' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Won': return <CheckCircle size={15} />;
      case 'Lost': return <XCircle size={15} />;
      default: return <Clock size={15} />;
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalValue = filteredDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);

  return (
    <div style={{ color: Z.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #0F172A 100%)', 
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
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Pipeline Deals Portfolio</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '6px 0 0 0', fontWeight: 500 }}>
            Track sales values, forecast win-rates, and close customer contracts.
          </p>
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Briefcase size={28} color="#C7D2FE" />
        </div>
      </div>

      {/* Grid Stats Bar & Filters Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 28, alignItems: 'center' }}>
        {/* Left search/filter bar */}
        <Card style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} color={Z.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search deals by title or client..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 8,
                  border: `1.5px solid ${Z.border}`,
                  fontSize: 13,
                  background: '#F8FAFC',
                  color: Z.text,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: Z.muted }}><Filter size={13} style={{ display: 'inline', marginRight: 2 }} /> Stage</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: `1px solid ${Z.border}`,
                  background: '#FFF',
                  fontSize: 12.5,
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="All">All Stages</option>
                <option value="Open">Open</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Right aggregate statistics summary card */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: 16,
          padding: '16px 20px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pipeline Focus</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: Z.success, marginTop: 4 }}>{formatCurrency(totalValue)}</div>
          </div>
          <div style={{ color: '#E2E8F0', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>
            <div>{filteredDeals.length} Active Deals</div>
          </div>
        </div>
      </div>

      {/* Grid of Deal Cards */}
      {filteredDeals.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '60px 0', color: Z.muted }}>
          <Briefcase size={44} style={{ opacity: 0.3, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600 }}>No deals matching selection</div>
          <div style={{ fontSize: 12.5, marginTop: 4 }}>Refine your search keywords or selection status.</div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 24 }}>
          {filteredDeals.map(deal => {
            const confidence = getConfidenceLevel(deal.status);
            return (
              <Card 
                key={deal._id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  borderColor: deal.status === 'Won' ? Z.success : (deal.status === 'Lost' ? Z.danger : Z.border),
                  background: Z.cardBg,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: Z.text }}>
                      {deal.title || deal.dealName || 'CRM Account Deal'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: Z.muted, fontSize: 12, marginTop: 4 }}>
                      <Building size={12} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.company || 'Private Client'}</span>
                    </div>
                  </div>
                  
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: deal.status === 'Won' ? 'rgba(16, 185, 129, 0.12)' : (deal.status === 'Lost' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.12)'),
                    color: deal.status === 'Won' ? Z.success : (deal.status === 'Lost' ? Z.danger : Z.accent),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    {getStatusIcon(deal.status)}
                    {deal.status}
                  </span>
                </div>

                {/* Amount / Value */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estimated Value</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: deal.status === 'Won' ? Z.success : Z.text, marginTop: 4 }}>
                    {formatCurrency(deal.dealValue || 0)}
                  </div>
                </div>

                {/* Closing Date & Manager */}
                <div style={{ borderTop: `1px solid ${Z.border}`, borderBottom: `1px solid ${Z.border}`, padding: '12px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ color: Z.muted, fontSize: 11, fontWeight: 600 }}>Expected Close</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: Z.text, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Calendar size={12} color={Z.muted} /> {formatDate(deal.closingDate || deal.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: Z.muted, fontSize: 11, fontWeight: 600 }}>Account Manager</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: Z.text, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <User size={12} color={Z.muted} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.assignedTo || 'Sales Admin'}</span>
                    </div>
                  </div>
                </div>

                {/* Probability Meter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Conversion Likelihood</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: confidence.color }}>{confidence.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: '#EEF2F6', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${confidence.pct}%`, height: '100%', background: confidence.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ color: Z.muted, fontSize: 10.5, marginTop: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Percent size={10} /> {confidence.label}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Deals;
