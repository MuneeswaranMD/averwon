import React, { useState, useEffect } from 'react';

// Design System for Averqon Admin
const S = {
  bg: '#F8FAFC',
  white: '#FFFFFF',
  primary: '#1A73E8',
  primaryLight: '#E8F0FE',
  primaryText: '#174EA6',
  border: '#E0E5E9',
  textMain: '#202124',
  textSecondary: '#5F6368',
  textMuted: '#70757A',
  green: '#1E8E3E',
  greenLight: '#E6F4EA',
  red: '#D93025',
  redLight: '#FCE8E6',
  yellow: '#F9AB00',
  yellowLight: '#FEF7E0',
  blue: '#1967D2',
  cardShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
};

const GlobalShow = (props) => {
  const { record, resource } = props;
  const p = record.params;
  const reconstructedParams = {};
  
  Object.keys(p).forEach(key => {
    if (key.includes('.')) {
      const [baseKey, index] = key.split('.');
      if (!isNaN(index)) {
        if (!reconstructedParams[baseKey]) {
          reconstructedParams[baseKey] = [];
        }
        reconstructedParams[baseKey][parseInt(index, 10)] = p[key];
        return;
      }
    }
    reconstructedParams[key] = p[key];
  });

  // Filter out any undefined or null slots in reconstructed arrays
  Object.keys(reconstructedParams).forEach(k => {
    if (Array.isArray(reconstructedParams[k])) {
      reconstructedParams[k] = reconstructedParams[k].filter(item => item !== undefined && item !== null);
    }
  });

  // Helper to get formatted value
  const val = (k) => reconstructedParams[k] || '---';
  const label = (k) => resource.properties[k]?.label || k;

  // Auto-detect status color
  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('active') || s.includes('solved') || s.includes('resolved') || s.includes('done') || s.includes('completed') || s.includes('won') || s.includes('renewed')) return S.green;
    if (s.includes('pending') || s.includes('progress') || s.includes('medium') || s.includes('negotiation') || s.includes('contacted')) return S.yellow;
    if (s.includes('urgent') || s.includes('high') || s.includes('error') || s.includes('rejected') || s.includes('lost') || s.includes('overdue') || s.includes('expired')) return S.red;
    return S.blue;
  };

  // Group fields
  const allKeys = Object.keys(reconstructedParams).filter(k => !k.startsWith('_') && !['id', 'createdAt', 'updatedAt', '__v'].includes(k));
  const contactKeys = allKeys.filter(k => k.toLowerCase().includes('email') || k.toLowerCase().includes('phone') || k.toLowerCase().includes('name'));
  const categoryKeys = allKeys.filter(k => k.toLowerCase().includes('category') || k.toLowerCase().includes('type') || k.toLowerCase().includes('priority') || k.toLowerCase().includes('status'));
  const dataKeys = allKeys.filter(k => !contactKeys.includes(k) && !categoryKeys.includes(k));

  // Determine if this is a Client or Project detail page
  const isClient = resource.id === 'Client' || resource.name === 'Client';
  const isProject = resource.id === 'Project' || resource.name === 'Project';
  const clientName = isClient ? (p.clientName || p.name) : (p.client || '');
  const projectName = isProject ? (p.name || p.title) : '';

  // Renewal & Service State
  const [services, setServices] = useState([]);
  const [renewalHistory, setRenewalHistory] = useState([]);
  const [upsells, setUpsells] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingUpsells, setLoadingUpsells] = useState(false);

  // Modal / Form States
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedServiceForRenew, setSelectedServiceForRenew] = useState(null);
  const [showAddUpsellModal, setShowAddUpsellModal] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // New Service Form
  const [newService, setNewService] = useState({
    serviceName: '',
    serviceType: 'Domain renewal',
    projectName: projectName || '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    renewalAmount: '',
    billingFrequency: 'Annual',
    status: 'Active',
    nextFollowupDate: '',
    clientEmail: p.email || '',
    clientNotificationEnabled: false,
    autoReminderEnabled: true,
    notes: ''
  });

  // Renewal Form
  const [renewalForm, setRenewalForm] = useState({
    newExpiryDate: '',
    renewalPrice: '',
    generateInvoice: true,
    invoiceReference: '',
    notes: ''
  });

  // New Upsell Form
  const [newUpsell, setNewUpsell] = useState({
    title: '',
    description: '',
    estimatedValue: '',
    status: 'Identified',
    nextFollowupDate: '',
    quotationLink: '',
    notes: ''
  });

  const fetchClientServices = async () => {
    if (!clientName) return;
    setLoadingServices(true);
    try {
      const url = isProject && projectName 
        ? `/api/admin/projects/${encodeURIComponent(projectName)}/services` 
        : `/api/admin/clients/${encodeURIComponent(clientName)}/services`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.services) setServices(data.services);
      if (data.history) setRenewalHistory(data.history);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchClientUpsells = async () => {
    if (!isClient || !clientName) return;
    setLoadingUpsells(true);
    try {
      const res = await fetch(`/api/admin/clients/${encodeURIComponent(clientName)}/upsells`);
      const data = await res.json();
      if (Array.isArray(data)) setUpsells(data);
    } catch (err) {
      console.error('Error fetching upsells:', err);
    } finally {
      setLoadingUpsells(false);
    }
  };

  useEffect(() => {
    if (isClient || isProject) {
      fetchClientServices();
    }
    if (isClient) {
      fetchClientUpsells();
    }
  }, [clientName, projectName]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.serviceName || !newService.renewalAmount) {
      alert('Please provide Service Name and Renewal Amount');
      return;
    }
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newService,
          clientName,
          projectName: newService.projectName || projectName,
          renewalAmount: Number(newService.renewalAmount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice({ type: 'success', text: `✓ Service "${newService.serviceName}" added successfully!` });
        setShowAddServiceModal(false);
        setNewService({
          serviceName: '',
          serviceType: 'Domain renewal',
          projectName: projectName || '',
          startDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          renewalAmount: '',
          billingFrequency: 'Annual',
          status: 'Active',
          nextFollowupDate: '',
          clientEmail: p.email || '',
          clientNotificationEnabled: false,
          autoReminderEnabled: true,
          notes: ''
        });
        fetchClientServices();
      } else {
        alert(data.error || 'Failed to create service');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating service');
    }
  };

  const openRenewModal = (service) => {
    setSelectedServiceForRenew(service);
    const currExp = service.expiryDate ? new Date(service.expiryDate) : new Date();
    const nextExp = new Date(currExp.getTime() + 365 * 86400000).toISOString().split('T')[0];
    setRenewalForm({
      newExpiryDate: nextExp,
      renewalPrice: service.renewalAmount || '',
      generateInvoice: true,
      invoiceReference: '',
      notes: `Renewed for next cycle ending ${nextExp}`
    });
    setShowRenewModal(true);
  };

  const handleExecuteRenewal = async (e) => {
    e.preventDefault();
    if (!selectedServiceForRenew) return;
    try {
      const res = await fetch(`/api/admin/services/${selectedServiceForRenew._id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renewalForm)
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice({
          type: 'success',
          text: `✓ Service "${selectedServiceForRenew.serviceName}" renewed! New period ending ${new Date(data.service.expiryDate).toLocaleDateString()}`
        });
        setShowRenewModal(false);
        setSelectedServiceForRenew(null);
        fetchClientServices();
      } else {
        alert(data.error || 'Failed to renew service');
      }
    } catch (err) {
      console.error(err);
      alert('Error renewing service');
    }
  };

  const handleCreateUpsell = async (e) => {
    e.preventDefault();
    if (!newUpsell.title || !newUpsell.estimatedValue) {
      alert('Please provide Opportunity Title and Estimated Value');
      return;
    }
    try {
      const res = await fetch(`/api/admin/clients/${encodeURIComponent(clientName)}/upsells`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUpsell,
          estimatedValue: Number(newUpsell.estimatedValue)
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice({ type: 'success', text: `✓ Upsell opportunity "${newUpsell.title}" registered!` });
        setShowAddUpsellModal(false);
        setNewUpsell({
          title: '',
          description: '',
          estimatedValue: '',
          status: 'Identified',
          nextFollowupDate: '',
          quotationLink: '',
          notes: ''
        });
        fetchClientUpsells();
      } else {
        alert(data.error || 'Failed to create upsell');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating upsell');
    }
  };

  const handleConvertToProject = async (upsell) => {
    if (!confirm(`Convert opportunity "${upsell.title}" into an active Project for ${clientName}?`)) return;
    try {
      const res = await fetch(`/api/admin/upsells/${upsell._id}/convert-to-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: upsell.title })
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice({
          type: 'success',
          text: `✓ Opportunity converted to Project "${data.project.name}"! Status updated to Won.`
        });
        fetchClientUpsells();
      } else {
        alert(data.error || 'Failed to convert opportunity');
      }
    } catch (err) {
      console.error(err);
      alert('Error converting opportunity');
    }
  };

  const handleUpdateUpsellStatus = async (upsellId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/upsells/${upsellId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchClientUpsells();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '24px', background: S.bg, minHeight: 'calc(100vh - 64px)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Toast Notice */}
      {actionNotice && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 20px',
          borderRadius: '8px',
          background: actionNotice.type === 'success' ? '#DCFCE7' : '#FEE2E2',
          color: actionNotice.type === 'success' ? '#166534' : '#991B1B',
          border: `1px solid ${actionNotice.type === 'success' ? '#BBF7D0' : '#FCA5A5'}`,
          fontSize: '13.5px',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{actionNotice.text}</span>
          <button onClick={() => setActionNotice(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, color: 'inherit' }}>✕</button>
        </div>
      )}

      {/* HEADER SECTION (Top Bar) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: S.white, padding: '16px 24px', borderRadius: '12px', border: `1px solid ${S.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <a href={`/admin/resources/${resource.id}/records`} style={{ color: S.textSecondary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
             Back
           </a>
           <div style={{ height: '24px', width: '1px', background: S.border }} />
           <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: S.textMain }}>
             Detail view for <span style={{ color: S.primary }}>{val('clientName') !== '---' ? val('clientName') : (val('name') !== '---' ? val('name') : (val('title') !== '---' ? val('title') : resource.name))}</span>
           </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href={`/admin/resources/${resource.id}/records/${record.id}/edit`} style={{ textDecoration: 'none' }}>
            <button style={{ height: '36px', padding: '0 16px', background: S.primary, color: S.white, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Record
            </button>
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 320px) 1fr', gap: '24px' }}>
        
        {/* LEFT PROFILE PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: S.white, borderRadius: '12px', border: `1px solid ${S.border}`, padding: '32px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
             <div style={{ 
               width: '100px', 
               height: '100px', 
               borderRadius: '50%', 
               background: S.primaryLight, 
               color: S.primary, 
               margin: '0 auto 20px', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               fontSize: '32px', 
               fontWeight: 700,
               border: `4px solid ${S.bg}`
             }}>
               {(p.clientName || p.name || p.title || p.employeeId || 'A')[0].toUpperCase()}
             </div>
             <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: S.textMain }}>{p.clientName || p.name || p.title || 'Record Details'}</h2>
             <p style={{ margin: 0, fontSize: '14px', color: S.textSecondary }}>{p.company || p.designation || p.role || resource.name}</p>
             
             <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${S.border}`, textAlign: 'left' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 800, color: S.textMuted, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Contact Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {contactKeys.map(k => (
                    <div key={k}>
                      <div style={{ fontSize: '11px', color: S.textMuted, marginBottom: '2px' }}>{label(k)}</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: S.textMain, wordBreak: 'break-all' }}>{val(k)}</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div style={{ background: S.white, borderRadius: '12px', border: `1px solid ${S.border}`, padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, color: S.textMuted, textTransform: 'uppercase', marginBottom: '16px' }}>Status Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {categoryKeys.map(k => {
                 const color = getStatusColor(p[k]);
                 return (
                   <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '13px', color: S.textSecondary }}>{label(k)}</span>
                     <span style={{ 
                       padding: '4px 10px', 
                       borderRadius: '20px', 
                       fontSize: '11px', 
                       fontWeight: 700, 
                       background: `${color}15`, 
                       color: color,
                       border: `1px solid ${color}30`
                     }}>
                       {val(k)}
                     </span>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>

        {/* RIGHT INFO PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {['Progress', 'Priority', 'Department', 'Join Date', 'Status'].map(stat => {
              const k = allKeys.find(key => key.toLowerCase().includes(stat.toLowerCase().replace(' ', '')));
              if (!k) return null;
              return (
                <div key={stat} style={{ background: S.white, borderRadius: '12px', padding: '20px', border: `1px solid ${S.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '11px', color: S.textMuted, fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>{stat}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: S.textMain }}>{val(k)}</div>
                </div>
              );
            })}
          </div>

          {/* Detailed Data */}
          <div style={{ background: S.white, borderRadius: '12px', border: `1px solid ${S.border}`, boxShadow: S.cardShadow }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${S.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Information Overview</h3>
               <span style={{ fontSize: '12px', color: S.textMuted }}>ID: {record.id}</span>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {dataKeys.map(k => (
                  <div key={k} style={{ gridColumn: (typeof reconstructedParams[k] === 'string' && reconstructedParams[k].length > 100) ? 'span 2' : 'span 1' }}>
                    <div style={{ fontSize: '12px', color: S.textMuted, fontWeight: 600, marginBottom: '6px' }}>{label(k)}</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: S.textMain, 
                      lineHeight: '1.6', 
                      padding: (typeof reconstructedParams[k] === 'string' && reconstructedParams[k].length > 100) ? '12px' : '0',
                      background: (typeof reconstructedParams[k] === 'string' && reconstructedParams[k].length > 100) ? S.bg : 'transparent',
                      borderRadius: '8px'
                    }}>
                      {Array.isArray(reconstructedParams[k]) ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                          {reconstructedParams[k].map((item, idx) => (
                            <span key={idx} style={{
                              padding: '4px 10px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: S.primaryLight,
                              color: S.primaryText,
                              border: `1px solid ${S.border}`
                            }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        val(k)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* POST-DELIVERY SERVICES & RENEWALS SECTION                     */}
          {/* ============================================================ */}
          {(isClient || isProject) && (
            <div style={{ background: S.white, borderRadius: '12px', border: `1px solid ${S.border}`, boxShadow: S.cardShadow, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${S.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFC', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: S.textMain }}>
                      Services & Renewals
                    </h3>
                    <span style={{ background: S.primaryLight, color: S.primaryText, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                      {services.length} Tracked
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: S.textMuted }}>
                    Domain, Hosting/VPS, AMC Maintenance, and Extra Feature Request lifecycle
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: S.primary,
                      color: S.white,
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    + Add New Service
                  </button>
                </div>
              </div>

              {/* Services Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${S.border}`, color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '12px 18px' }}>Service Name & Type</th>
                      <th style={{ padding: '12px 18px' }}>Linked Project</th>
                      <th style={{ padding: '12px 18px' }}>Expiry Date</th>
                      <th style={{ padding: '12px 18px' }}>Renewal Amount</th>
                      <th style={{ padding: '12px 18px' }}>Status</th>
                      <th style={{ padding: '12px 18px' }}>Next Follow-Up</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '32px 20px', textAlign: 'center', color: S.textMuted }}>
                          {loadingServices ? 'Loading services...' : 'No post-delivery services tracked yet for this record.'}
                        </td>
                      </tr>
                    ) : (
                      services.map((srv) => {
                        const exp = srv.expiryDate ? new Date(srv.expiryDate) : null;
                        const isExpired = exp && exp < new Date();
                        const color = getStatusColor(srv.status);
                        return (
                          <tr key={srv._id} style={{ borderBottom: `1px solid ${S.border}` }}>
                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ fontWeight: 600, color: S.textMain }}>{srv.serviceName}</div>
                              <div style={{ fontSize: '11.5px', color: S.textMuted, marginTop: '2px' }}>{srv.serviceType}</div>
                            </td>
                            <td style={{ padding: '14px 18px', color: S.textSecondary }}>
                              {srv.projectName || '—'}
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ fontWeight: 600, color: isExpired ? S.red : S.textMain }}>
                                {exp ? exp.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                              </div>
                              <div style={{ fontSize: '11px', color: isExpired ? S.red : S.textMuted }}>
                                {exp ? `${Math.ceil((exp - new Date()) / (1000 * 60 * 60 * 24))} days left` : ''}
                              </div>
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ fontWeight: 700, color: S.green }}>
                                ₹{(srv.renewalAmount || 0).toLocaleString('en-IN')}
                              </div>
                              <div style={{ fontSize: '11px', color: S.textMuted }}>
                                {srv.billingFrequency}
                              </div>
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: `${color}15`,
                                color: color,
                                border: `1px solid ${color}30`
                              }}>
                                {srv.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 18px', color: S.textSecondary, fontSize: '12px' }}>
                              {srv.nextFollowupDate ? new Date(srv.nextFollowupDate).toLocaleDateString('en-IN') : 'None'}
                            </td>
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              <button
                                onClick={() => openRenewModal(srv)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: S.greenLight,
                                  color: S.green,
                                  border: `1px solid ${S.green}30`,
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                Renew Now
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Renewal History Accordion / Block */}
              {renewalHistory.length > 0 && (
                <div style={{ borderTop: `1px solid ${S.border}`, background: '#FCFDFE', padding: '20px 24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: S.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Historical Renewal Periods ({renewalHistory.length})
                  </h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ color: S.textMuted, borderBottom: `1px solid ${S.border}` }}>
                          <th style={{ padding: '8px 12px' }}>Service</th>
                          <th style={{ padding: '8px 12px' }}>Previous Expiry</th>
                          <th style={{ padding: '8px 12px' }}>New Expiry</th>
                          <th style={{ padding: '8px 12px' }}>Price</th>
                          <th style={{ padding: '8px 12px' }}>Invoice Ref</th>
                          <th style={{ padding: '8px 12px' }}>Payment Status</th>
                          <th style={{ padding: '8px 12px' }}>Renewed Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renewalHistory.map(h => (
                          <tr key={h._id} style={{ borderBottom: `1px solid #F1F5F9` }}>
                            <td style={{ padding: '8px 12px', fontWeight: 600, color: S.textMain }}>{h.serviceName}</td>
                            <td style={{ padding: '8px 12px', color: S.textMuted }}>{h.previousExpiryDate ? new Date(h.previousExpiryDate).toLocaleDateString() : 'N/A'}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 600, color: S.textMain }}>{h.newExpiryDate ? new Date(h.newExpiryDate).toLocaleDateString() : 'N/A'}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 700, color: S.green }}>₹{h.renewalPrice?.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '8px 12px', color: S.primaryText, fontWeight: 500 }}>{h.invoiceReference || 'Unlinked'}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                background: h.paymentStatus === 'Paid' ? S.greenLight : S.yellowLight,
                                color: h.paymentStatus === 'Paid' ? S.green : S.yellow
                              }}>
                                {h.paymentStatus}
                              </span>
                            </td>
                            <td style={{ padding: '8px 12px', color: S.textMuted }}>{new Date(h.renewedAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* UPSELL OPPORTUNITIES SECTION (For Client Records)             */}
          {/* ============================================================ */}
          {isClient && (
            <div style={{ background: S.white, borderRadius: '12px', border: `1px solid ${S.border}`, boxShadow: S.cardShadow, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${S.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFC', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: S.textMain }}>
                      Upsell Opportunities
                    </h3>
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                      {upsells.length} Opportunities
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: S.textMuted }}>
                    Targeted enhancements, quotations, and pipeline conversion into active client projects
                  </p>
                </div>

                <button
                  onClick={() => setShowAddUpsellModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#4F46E5',
                    color: S.white,
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  + Add Opportunity
                </button>
              </div>

              {/* Upsell Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${S.border}`, color: S.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '12px 18px' }}>Opportunity Title & Notes</th>
                      <th style={{ padding: '12px 18px' }}>Estimated Value</th>
                      <th style={{ padding: '12px 18px' }}>Next Follow-Up</th>
                      <th style={{ padding: '12px 18px' }}>Status</th>
                      <th style={{ padding: '12px 18px' }}>Quotation</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upsells.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '32px 20px', textAlign: 'center', color: S.textMuted }}>
                          {loadingUpsells ? 'Loading opportunities...' : 'No upsell opportunities identified for this client yet.'}
                        </td>
                      </tr>
                    ) : (
                      upsells.map((up) => {
                        const color = getStatusColor(up.status);
                        return (
                          <tr key={up._id} style={{ borderBottom: `1px solid ${S.border}` }}>
                            <td style={{ padding: '14px 18px', maxWidth: '300px' }}>
                              <div style={{ fontWeight: 600, color: S.textMain }}>{up.title}</div>
                              {up.description && (
                                <div style={{ fontSize: '12px', color: S.textMuted, marginTop: '2px', lineHeight: 1.4 }}>
                                  {up.description}
                                </div>
                              )}
                              {up.notes && (
                                <div style={{ fontSize: '11.5px', color: '#6366F1', marginTop: '4px', fontStyle: 'italic' }}>
                                  📝 {up.notes}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '14px 18px', fontWeight: 700, color: '#059669', fontSize: '14px' }}>
                              ₹{(up.estimatedValue || 0).toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '14px 18px', color: S.textSecondary, fontSize: '12px' }}>
                              {up.nextFollowupDate ? new Date(up.nextFollowupDate).toLocaleDateString('en-IN') : 'None'}
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <select
                                value={up.status}
                                onChange={(e) => handleUpdateUpsellStatus(up._id, e.target.value)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  background: `${color}15`,
                                  color: color,
                                  border: `1px solid ${color}30`,
                                  cursor: 'pointer'
                                }}
                              >
                                {['Identified', 'Contacted', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'].map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              {up.quotationLink ? (
                                <a href={up.quotationLink} target="_blank" rel="noopener noreferrer" style={{ color: S.primary, fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                                  View Quote ↗
                                </a>
                              ) : (
                                <span style={{ color: S.textMuted, fontSize: '12px' }}>No link</span>
                              )}
                            </td>
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              {up.convertedToProject ? (
                                <span style={{ fontSize: '11px', color: S.green, fontWeight: 700, background: S.greenLight, padding: '4px 8px', borderRadius: '4px' }}>
                                  ✓ Project Created
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleConvertToProject(up)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    background: '#EEF2FF',
                                    color: '#4F46E5',
                                    border: '1px solid #C7D2FE',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  Convert to Project
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Info */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'flex-end', padding: '0 12px' }}>
             <div style={{ textAlign: 'right' }}>
               <span style={{ display: 'block', fontSize: '10px', color: S.textMuted, textTransform: 'uppercase' }}>Created At</span>
               <span style={{ fontSize: '12px', color: S.textSecondary }}>{new Date(record.params.createdAt || Date.now()).toLocaleString()}</span>
             </div>
             <div style={{ textAlign: 'right' }}>
               <span style={{ display: 'block', fontSize: '10px', color: S.textMuted, textTransform: 'uppercase' }}>Last Updated</span>
               <span style={{ fontSize: '12px', color: S.textSecondary }}>{new Date(record.params.updatedAt || Date.now()).toLocaleString()}</span>
             </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD NEW SERVICE                                       */}
      {/* ============================================================ */}
      {showAddServiceModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{ background: S.white, borderRadius: '12px', width: '100%', maxWidth: '540px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: S.textMain }}>Track New Post-Delivery Service</h3>
              <button onClick={() => setShowAddServiceModal(false)} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', color: S.textMuted }}>✕</button>
            </div>

            <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Service Name *</label>
                <input
                  required
                  placeholder="e.g. AWS Production VPS Server"
                  value={newService.serviceName}
                  onChange={e => setNewService({ ...newService, serviceName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Service Type</label>
                  <select
                    value={newService.serviceType}
                    onChange={e => setNewService({ ...newService, serviceType: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px' }}
                  >
                    <option value="Domain renewal">Domain renewal</option>
                    <option value="Hosting / VPS renewal">Hosting / VPS renewal</option>
                    <option value="AMC / Maintenance renewal">AMC / Maintenance renewal</option>
                    <option value="Extra development and additional feature requests">Extra development / Features</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Linked Project</label>
                  <input
                    placeholder="Project Name (optional)"
                    value={newService.projectName}
                    onChange={e => setNewService({ ...newService, projectName: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newService.startDate}
                    onChange={e => setNewService({ ...newService, startDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={newService.expiryDate}
                    onChange={e => setNewService({ ...newService, expiryDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Renewal Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={newService.renewalAmount}
                    onChange={e => setNewService({ ...newService, renewalAmount: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Billing Frequency</label>
                  <select
                    value={newService.billingFrequency}
                    onChange={e => setNewService({ ...newService, billingFrequency: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px' }}
                  >
                    <option value="Annual">Annual</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="One-Time">One-Time</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Status</label>
                  <select
                    value={newService.status}
                    onChange={e => setNewService({ ...newService, status: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Renewal">Pending Renewal</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Renewed">Renewed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Next Follow-Up</label>
                  <input
                    type="date"
                    value={newService.nextFollowupDate}
                    onChange={e => setNewService({ ...newService, nextFollowupDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Client Contact Email</label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={newService.clientEmail}
                  onChange={e => setNewService({ ...newService, clientEmail: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: S.textSecondary, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newService.clientNotificationEnabled}
                    onChange={e => setNewService({ ...newService, clientNotificationEnabled: e.target.checked })}
                  />
                  Send client-facing email reminders
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: S.textSecondary, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newService.autoReminderEnabled}
                    onChange={e => setNewService({ ...newService, autoReminderEnabled: e.target.checked })}
                  />
                  Auto-reminder enabled
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Notes / Technical Details</label>
                <textarea
                  rows="2"
                  placeholder="Port numbers, server IDs, renewal SLA..."
                  value={newService.notes}
                  onChange={e => setNewService({ ...newService, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', background: '#F1F5F9', color: S.textSecondary, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '8px', background: S.primary, color: S.white, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: RENEW SERVICE (PRESERVES RENEWAL HISTORY)              */}
      {/* ============================================================ */}
      {showRenewModal && selectedServiceForRenew && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{ background: S.white, borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: S.textMain }}>Execute Service Renewal</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: S.textMuted }}>{selectedServiceForRenew.serviceName}</p>
              </div>
              <button onClick={() => setShowRenewModal(false)} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', color: S.textMuted }}>✕</button>
            </div>

            <div style={{ background: '#F8FAFC', border: `1px solid ${S.border}`, padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '12.5px' }}>
              <div style={{ color: S.textMuted }}>Current Period Ending:</div>
              <div style={{ fontWeight: 700, color: S.textMain }}>{new Date(selectedServiceForRenew.expiryDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div style={{ marginTop: '6px', color: S.textSecondary, fontSize: '11.5px' }}>
                ℹ️ The current period will be permanently preserved in Renewal History.
              </div>
            </div>

            <form onSubmit={handleExecuteRenewal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>New Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={renewalForm.newExpiryDate}
                  onChange={e => setRenewalForm({ ...renewalForm, newExpiryDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Renewal Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={renewalForm.renewalPrice}
                  onChange={e => setRenewalForm({ ...renewalForm, renewalPrice: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '12px', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#166534', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={renewalForm.generateInvoice}
                    onChange={e => setRenewalForm({ ...renewalForm, generateInvoice: e.target.checked })}
                  />
                  Generate pending Invoice in Invoices table
                </label>
                <p style={{ margin: '4px 0 0 24px', fontSize: '11px', color: '#15803D' }}>
                  Status will remain "Pending" until a verified payment record is posted.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Renewal Notes</label>
                <textarea
                  rows="2"
                  value={renewalForm.notes}
                  onChange={e => setRenewalForm({ ...renewalForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', background: '#F1F5F9', color: S.textSecondary, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '8px', background: S.green, color: S.white, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirm & Renew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD UPSELL OPPORTUNITY                                 */}
      {/* ============================================================ */}
      {showAddUpsellModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{ background: S.white, borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: S.textMain }}>Add Upsell Opportunity</h3>
              <button onClick={() => setShowAddUpsellModal(false)} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', color: S.textMuted }}>✕</button>
            </div>

            <form onSubmit={handleCreateUpsell} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Opportunity Title *</label>
                <input
                  required
                  placeholder="e.g. AI Invoicing & Automatic Payment Gateway"
                  value={newUpsell.title}
                  onChange={e => setNewUpsell({ ...newUpsell, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Description</label>
                <textarea
                  rows="2"
                  placeholder="Details of client need or enhancement request..."
                  value={newUpsell.description}
                  onChange={e => setNewUpsell({ ...newUpsell, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Estimated Value (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={newUpsell.estimatedValue}
                    onChange={e => setNewUpsell({ ...newUpsell, estimatedValue: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Status</label>
                  <select
                    value={newUpsell.status}
                    onChange={e => setNewUpsell({ ...newUpsell, status: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px' }}
                  >
                    <option value="Identified">Identified</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={newUpsell.nextFollowupDate}
                    onChange={e => setNewUpsell({ ...newUpsell, nextFollowupDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Quotation Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newUpsell.quotationLink}
                    onChange={e => setNewUpsell({ ...newUpsell, quotationLink: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: S.textSecondary, marginBottom: '4px' }}>Notes</label>
                <textarea
                  rows="2"
                  placeholder="Client feedback, scope clarifications..."
                  value={newUpsell.notes}
                  onChange={e => setNewUpsell({ ...newUpsell, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${S.border}`, fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUpsellModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', background: '#F1F5F9', color: S.textSecondary, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '8px', background: '#4F46E5', color: S.white, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GlobalShow;
