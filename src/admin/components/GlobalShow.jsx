import React from 'react';
import { useRecord, useResource } from 'adminjs';

const C = {
  bg: '#F5F7FA',
  white: '#FFFFFF',
  border: '#E5E7EB',
  primary: '#2563EB',
  textBase: '#111827',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  green: '#10B981',
  blue: '#3B82F6',
  orange: '#F59E0B',
  purple: '#8B5CF6',
  red: '#EF4444',
  cardShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
};

// --- SVG Icons ---
const Icons = {
  Info: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Printer: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  Link: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
};

const GlobalShow = (props) => {
  const { resource, record } = props;
  const p = record.params;

  // Dynamically identify fields
  const allProperties = resource.showProperties || [];
  const titleField = resource.titleProperty.name || 'name';
  const displayTitle = p[titleField] || record.id;

  const textAreas = allProperties.filter(prop => prop.type === 'textarea' || prop.propertyType === 'richtext' || p[prop.name]?.length > 100);
  const infoFields = allProperties.filter(prop => !textAreas.includes(prop) && prop.name !== '_id' && prop.name !== titleField);

  // Pick top 4 fields for summary
  const summaryFields = infoFields.slice(0, 4);

  const handlePrint = () => window.print();
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '13px', color: C.textMuted, marginBottom: '8px' }}>
            Dashboard / {resource.name} / <span style={{ color: C.textBase, fontWeight: 500 }}>Details</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: C.textBase, margin: '0 0 4px 0' }}>{displayTitle}</h1>
          <p style={{ margin: 0, fontSize: '14px', color: C.textMuted }}>View and manage complete information about this {resource.name.toLowerCase()}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href={`/admin/resources/${resource.id}/records/${record.id}/edit`} style={{ textDecoration: 'none' }}>
            <button style={{ height: '36px', padding: '0 16px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: C.textBase, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Icons.Edit /> Edit
            </button>
          </a>
          <button style={{ height: '36px', padding: '0 16px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: C.red, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Icons.Trash /> Delete
          </button>
          <button onClick={handlePrint} style={{ height: '36px', padding: '0 16px', background: C.primary, border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: C.white, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
            <Icons.Printer /> Download PDF
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {summaryFields.map((field, idx) => (
          <div key={idx} style={{ background: C.white, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, marginBottom: '8px' }}>
              <Icons.Info /> <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: C.textBase }}>{p[field.name]?.toString() || 'N/A'}</div>
          </div>
        ))}
      </div>

      {/* CONTENT GRID */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: C.textBase, margin: '0 0 20px 0', borderBottom: `1px solid ${C.border}`, paddingBottom: '12px' }}>General Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {infoFields.map((field, idx) => (
                <div key={idx}>
                  <label style={{ display: 'block', fontSize: '12px', color: C.textMuted, marginBottom: '4px' }}>{field.label}</label>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: C.textBase }}>{p[field.name]?.toString() || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: C.textBase, margin: '0 0 20px 0', borderBottom: `1px solid ${C.border}`, paddingBottom: '12px' }}>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={handleCopyLink} style={{ width: '100%', height: '40px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: C.textBase, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <Icons.Link /> Copy Record Link
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {textAreas.length > 0 ? textAreas.map((field, idx) => (
            <div key={idx} style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: C.textBase, margin: '0 0 16px 0' }}>{field.label}</h3>
              <div style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {p[field.name] || 'N/A'}
              </div>
            </div>
          )) : (
            <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '48px', textAlign: 'center' }}>
              <Icons.Info />
              <p style={{ marginTop: '16px', color: C.textMuted }}>No additional detailed content found for this record.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GlobalShow;
