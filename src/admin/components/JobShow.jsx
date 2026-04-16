import React from 'react';

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
  Briefcase: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  MapPin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Building: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Printer: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
};

const JobShow = (props) => {
  const { record } = props;
  const p = record.params;

  // Formatting helpers
  const postedDate = new Date(p.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isActive = p.isActive === true || p.isActive === 'true';
  const jobType = p.type || 'N/A';

  const getJobTypeColor = () => {
    switch (jobType) {
      case 'Full-time': return { bg: '#EFF6FF', text: C.blue };
      case 'Part-time': return { bg: '#FFF7ED', text: C.orange };
      case 'Internship': return { bg: '#F5F3FF', text: C.purple };
      case 'Contract': return { bg: '#ECFDF5', text: C.green };
      default: return { bg: '#F3F4F6', text: C.textBase };
    }
  };
  const typeStyle = getJobTypeColor();

  const handleDuplicate = () => alert('Duplicate Job fired! Connecting to API hook...');
  const handlePrint = () => window.print();

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '13px', color: C.textMuted, marginBottom: '8px' }}>
            Dashboard / Job Posting / <span style={{ color: C.textBase, fontWeight: 500 }}>{p.title}</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: C.textBase, margin: '0 0 4px 0' }}>{p.title}</h1>
          <p style={{ margin: 0, fontSize: '14px', color: C.textMuted }}>View complete details of the job posting</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href={`/admin/resources/JobPosting/records/${p._id}/edit`} style={{ textDecoration: 'none' }}>
            <button style={{ height: '36px', padding: '0 16px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: C.textBase, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Icons.Edit /> Edit
            </button>
          </a>
          <button style={{ height: '36px', padding: '0 16px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: C.red, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Icons.Trash /> Delete
          </button>
          <button onClick={handleDuplicate} style={{ height: '36px', padding: '0 16px', background: C.primary, border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: C.white, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
            <Icons.Copy /> Duplicate Job
          </button>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        <div style={{ background: C.white, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, marginBottom: '8px' }}>
            <Icons.Briefcase /> <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Job Type</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: C.textBase }}>{p.type || 'N/A'}</div>
        </div>

        <div style={{ background: C.white, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, marginBottom: '8px' }}>
            <Icons.Building /> <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Department</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: C.textBase }}>{p.department || 'N/A'}</div>
        </div>

        <div style={{ background: C.white, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, marginBottom: '8px' }}>
            <Icons.MapPin /> <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Location</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: C.textBase }}>{p.location || 'N/A'}</div>
        </div>

        <div style={{ background: C.white, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, marginBottom: '8px' }}>
            <Icons.Activity /> <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Status</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: isActive ? '#ECFDF5' : '#FEF2F2', color: isActive ? C.green : C.red }}>
              {isActive ? 'Active' : 'Closed'}
            </span>
          </div>
        </div>

        <div style={{ background: C.white, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, marginBottom: '8px' }}>
            <Icons.Calendar /> <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Posted Date</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: C.textBase }}>{postedDate}</div>
        </div>
      </div>

      {/* MAIN DETAILS GRID */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: Core Details */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: C.textBase, margin: '0 0 20px 0', borderBottom: `1px solid ${C.border}`, paddingBottom: '12px' }}>Job Overview</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div><span style={{ display: 'block', fontSize: '12px', color: C.textMuted, marginBottom: '4px' }}>Job Title</span><span style={{ fontSize: '14px', fontWeight: 500, color: C.textBase }}>{p.title}</span></div>
              <div><span style={{ display: 'block', fontSize: '12px', color: C.textMuted, marginBottom: '4px' }}>Job ID</span><span style={{ fontSize: '14px', fontWeight: 500, color: C.textBase }}>{p._id}</span></div>
              <div><span style={{ display: 'block', fontSize: '12px', color: C.textMuted, marginBottom: '4px' }}>Department</span><span style={{ fontSize: '14px', fontWeight: 500, color: C.textBase }}>{p.department || 'General'}</span></div>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: C.textMuted, marginBottom: '4px' }}>Employment Type</span>
                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: typeStyle.bg, color: typeStyle.text }}>{jobType}</span>
              </div>
              <div><span style={{ display: 'block', fontSize: '12px', color: C.textMuted, marginBottom: '4px' }}>Location</span><span style={{ fontSize: '14px', fontWeight: 500, color: C.textBase }}>{p.location}</span></div>
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: C.textBase, margin: '0 0 20px 0', borderBottom: `1px solid ${C.border}`, paddingBottom: '12px' }}>Activity Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: C.border }} />
              
              <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: C.blue, border: `3px solid ${C.white}` }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: C.textBase }}>Job created</div>
                  <div style={{ fontSize: '11px', color: C.textMuted }}>{postedDate} by Admin</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: C.border, border: `3px solid ${C.white}` }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: C.textBase }}>Published on Careers Portal</div>
                  <div style={{ fontSize: '11px', color: C.textMuted }}>{postedDate} - System</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Description Area */}
        <div style={{ flex: '2', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '24px', flexGrow: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: C.textBase, margin: '0 0 24px 0' }}>Job Description</h3>
            <div style={{ fontSize: '14.5px', color: '#4B5563', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {p.description || "No description provided for this job listing."}
            </div>
          </div>

          {/* BOTTOM ACTION BAR */}
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, boxShadow: C.cardShadow, padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => alert('Link Copied!')} style={{ height: '36px', padding: '0 16px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: C.textBase, cursor: 'pointer' }}>Copy Link</button>
            <button onClick={handlePrint} style={{ height: '36px', padding: '0 16px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: C.textBase, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Icons.Printer /> Download PDF
            </button>
            <a href={`/admin/resources/JobPosting/records/${p._id}/edit`} style={{ textDecoration: 'none' }}>
              <button style={{ height: '36px', padding: '0 16px', background: C.primary, border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: C.white, cursor: 'pointer' }}>Edit Configuration</button>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};

export default JobShow;
