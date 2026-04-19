import React from 'react';

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
  red: '#D93025',
  yellow: '#F9AB00',
  blue: '#1967D2',
  cardShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
};

const GlobalShow = (props) => {
  console.log('GlobalShow rendering with props:', props);
  const { record, resource } = props;
  const p = record.params;

  // Helper to get formatted value
  const val = (k) => p[k] || '---';
  const label = (k) => resource.properties[k]?.label || k;

  // Auto-detect status color
  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('active') || s.includes('solved') || s.includes('resolved') || s.includes('done') || s.includes('completed')) return S.green;
    if (s.includes('pending') || s.includes('progress') || s.includes('medium')) return S.yellow;
    if (s.includes('urgent') || s.includes('high') || s.includes('error') || s.includes('rejected')) return S.red;
    return S.blue;
  };

  // Group fields
  const allKeys = Object.keys(p).filter(k => !k.startsWith('_') && !['id', 'createdAt', 'updatedAt', '__v'].includes(k));
  const contactKeys = allKeys.filter(k => k.toLowerCase().includes('email') || k.toLowerCase().includes('phone') || k.toLowerCase().includes('name'));
  const categoryKeys = allKeys.filter(k => k.toLowerCase().includes('category') || k.toLowerCase().includes('type') || k.toLowerCase().includes('priority') || k.toLowerCase().includes('status'));
  const dataKeys = allKeys.filter(k => !contactKeys.includes(k) && !categoryKeys.includes(k));

  return (
    <div style={{ padding: '24px', background: S.bg, minHeight: 'calc(100vh - 64px)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* HEADER SECTION (Top Bar) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: S.white, padding: '16px 24px', borderRadius: '12px', border: `1px solid ${S.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <a href={`/admin/resources/${resource.id}/records`} style={{ color: S.textSecondary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
             Back
           </a>
           <div style={{ height: '24px', width: '1px', background: S.border }} />
           <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: S.textMain }}>
             Detail view for <span style={{ color: S.primary }}>{val('name') !== '---' ? val('name') : (val('title') !== '---' ? val('title') : resource.name)}</span>
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
               {(p.name || p.title || p.employeeId || 'A')[0].toUpperCase()}
             </div>
             <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: S.textMain }}>{p.name || p.title || 'Record Details'}</h2>
             <p style={{ margin: 0, fontSize: '14px', color: S.textSecondary }}>{p.designation || p.role || resource.name}</p>
             
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
            {['Progress', 'Priority', 'Department', 'Join Date'].map(stat => {
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
                  <div key={k} style={{ gridColumn: (typeof p[k] === 'string' && p[k].length > 100) ? 'span 2' : 'span 1' }}>
                    <div style={{ fontSize: '12px', color: S.textMuted, fontWeight: 600, marginBottom: '6px' }}>{label(k)}</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: S.textMain, 
                      lineHeight: '1.6', 
                      padding: (typeof p[k] === 'string' && p[k].length > 100) ? '12px' : '0',
                      background: (typeof p[k] === 'string' && p[k].length > 100) ? S.bg : 'transparent',
                      borderRadius: '8px'
                    }}>
                      {val(k)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
    </div>
  );
};

export default GlobalShow;
