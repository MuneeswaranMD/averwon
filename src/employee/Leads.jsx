import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
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
  <div style={{ background: Z.cardBg, borderRadius: 16, border: `1px solid ${Z.border}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '24px', ...style }}>
    {children}
  </div>
);

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [expandedLead, setExpandedLead] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) { navigate('/employee/login'); return; }

    fetch(API_ENDPOINTS.EMPLOYEE_SALES_LEADS, {
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
          throw new Error('Access denied: You do not have permission to view the Leads page.');
        }
        return res.json();
      })
      .then(d => {
        if (d.error) throw new Error(d.error);
        setLeads(d);
        setFilteredLeads(d);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  // Apply filters on search or category changes
  useEffect(() => {
    let result = [...leads];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name?.toLowerCase().includes(q) || 
        l.company?.toLowerCase().includes(q) || 
        l.email?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(l => l.status === statusFilter);
    }

    if (sourceFilter !== 'All') {
      result = result.filter(l => l.source === sourceFilter);
    }

    setFilteredLeads(result);
  }, [searchQuery, statusFilter, sourceFilter, leads]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: Z.muted, fontSize: 15, fontWeight: 500 }}>Loading client leads...</div>
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

  // Dynamic extract unique sources
  const uniqueSources = ['All', ...new Set(leads.map(l => l.source).filter(Boolean))];
  const uniqueStatuses = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { bg: 'rgba(59, 130, 246, 0.1)', color: Z.accent };
      case 'Contacted': return { bg: 'rgba(6, 182, 212, 0.1)', color: Z.teal };
      case 'Qualified': return { bg: 'rgba(139, 92, 246, 0.1)', color: Z.purple };
      case 'Proposal Sent': return { bg: 'rgba(245, 158, 11, 0.1)', color: Z.warning };
      case 'Converted': return { bg: 'rgba(16, 185, 129, 0.1)', color: Z.success };
      case 'Closed': return { bg: 'rgba(100, 116, 139, 0.1)', color: Z.muted };
      default: return { bg: '#F1F5F9', color: Z.text };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={{ color: Z.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284C7 0%, #0F172A 100%)', 
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
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Client Leads Manager</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '6px 0 0 0', fontWeight: 500 }}>
            Qualify potential accounts, record lead interactions, and assign sales follow-ups.
          </p>
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ClipboardList size={28} color="#BAE6FD" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card style={{ marginBottom: 24, padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} color={Z.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search leads by name, company, or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 42px',
                borderRadius: 10,
                border: `1.5px solid ${Z.border}`,
                fontSize: 13.5,
                background: '#F8FAFC',
                color: Z.text,
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = Z.accent}
              onBlur={e => e.target.style.borderColor = Z.border}
            />
          </div>

          {/* Selector dropdowns */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: Z.muted }}><Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> Status</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: `1px solid ${Z.border}`,
                  background: '#FFF',
                  fontSize: 13,
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {uniqueStatuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: Z.muted }}><Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> Source</span>
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: `1px solid ${Z.border}`,
                  background: '#FFF',
                  fontSize: 13,
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {uniqueSources.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Table Panel */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {filteredLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: Z.muted }}>
            <ClipboardList size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>No matching leads found</div>
            <div style={{ fontSize: 12.5, marginTop: 4 }}>Try clearing or adjusting your search filters.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${Z.border}` }}>
                  <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Name</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Company</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact Details</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Source</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Created At</th>
                  <th style={{ padding: '16px 20px', width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const isExpanded = expandedLead === lead._id;
                  const stat = getStatusStyle(lead.status);
                  return (
                    <React.Fragment key={lead._id}>
                      <tr 
                        style={{ 
                          borderBottom: `1px solid ${Z.border}`, 
                          cursor: 'pointer',
                          background: isExpanded ? '#F8FAFC' : 'transparent',
                          transition: 'background 0.2s',
                        }}
                        onClick={() => setExpandedLead(isExpanded ? null : lead._id)}
                        onMouseEnter={e => { if(!isExpanded) e.currentTarget.style.background = '#F8FAFC'; }}
                        onMouseLeave={e => { if(!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 14 }}>{lead.name}</td>
                        <td style={{ padding: '16px 20px', fontSize: 13.5 }}>{lead.company || lead.companyName || 'Private Account'}</td>
                        <td style={{ padding: '16px 20px', fontSize: 13 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {lead.email && <div style={{ color: Z.muted, display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} /> {lead.email}</div>}
                            {lead.phone && <div style={{ color: Z.muted, display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} /> {lead.phone}</div>}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 500, color: Z.muted }}>{lead.source || 'Website'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '5px 10px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            background: stat.bg,
                            color: stat.color,
                            display: 'inline-block'
                          }}>{lead.status}</span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: 13, color: Z.muted }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={13} /> {formatDate(lead.createdAt || lead.date)}</div>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          {isExpanded ? <ChevronUp size={16} color={Z.muted} /> : <ChevronDown size={16} color={Z.muted} />}
                        </td>
                      </tr>

                      {/* Expandable detailed drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" style={{ padding: '20px 24px', background: '#F8FAFC', borderBottom: `1px solid ${Z.border}` }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                              <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Lead Details & Demographics</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                                  {lead.email && <div><strong>Email:</strong> <a href={`mailto:${lead.email}`} style={{ color: Z.accent, textDecoration: 'none' }}>{lead.email}</a></div>}
                                  {lead.phone && <div><strong>Phone Number:</strong> {lead.phone}</div>}
                                  {lead.address && <div><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} /> {lead.address}</div>}
                                  <div><strong>Source:</strong> {lead.source || 'Organic Web Inquiry'}</div>
                                </div>
                              </div>

                              <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Interaction Logs & Requirements</h4>
                                <div style={{ fontSize: 13, lineHeight: 1.5, color: '#334155', background: '#FFFFFF', padding: '12px 14px', borderRadius: 8, border: `1px solid ${Z.border}` }}>
                                  {lead.notes || lead.requirements || lead.message || 'No specific requirements or logs filed. System scheduled for automated sales follow-up call.'}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leads;
