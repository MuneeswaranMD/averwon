import React, { useState } from 'react';
import { FileText, ClipboardList, CreditCard, Calendar, Monitor, Upload, Eye, Download } from 'lucide-react';

const Z = {
  accent:  '#2563EB', 
  success: '#10B981', 
  warning: '#F59E0B',
  text: '#1E293B', 
  muted: '#64748B', 
  border: '#E2E8F0',
  cardBg: '#FFFFFF', 
  pageBg: '#F8FAFC', 
  inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:Z.cardBg, borderRadius:12, border:`1px solid ${Z.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const PageBand = ({ icon: Icon, title, sub }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
    borderRadius: 16,
    padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }}>
    <img src="/logo.png" alt="Averqon" style={{ height:34, objectFit:'contain' }} />
    <div style={{ width:1, height:36, background:'rgba(255,255,255,0.2)' }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ color:'#fff', fontSize:17, fontWeight:700 }}>{title}</div>
      <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12 }}>{sub}</div>
    </div>
  </div>
);

const docs = [
  { id:1, name:'Offer Letter.pdf',          type:'PDF',  size:'245 KB', date:'2024-01-15', category:'Onboarding',  icon: FileText },
  { id:2, name:'Employment Contract.pdf',   type:'PDF',  size:'1.2 MB', date:'2024-01-15', category:'Onboarding',  icon: ClipboardList },
  { id:3, name:'Salary Slip - March 2024.pdf', type:'PDF', size:'180 KB', date:'2024-03-31', category:'Payroll',   icon: CreditCard },
  { id:4, name:'Salary Slip - April 2024.pdf', type:'PDF', size:'182 KB', date:'2024-04-30', category:'Payroll',   icon: CreditCard },
  { id:5, name:'Leave Policy 2024.pdf',     type:'PDF',  size:'320 KB', date:'2024-01-01', category:'Policies',   icon: Calendar },
  { id:6, name:'IT Asset Acknowledgment.docx', type:'DOCX', size:'95 KB', date:'2024-02-10', category:'Assets',   icon: Monitor },
];

const catColors = {
  Onboarding: ['#E0F2FE','#0EA5E9'],
  Payroll:    ['#F0FDF4','#10B981'],
  Policies:   ['#F5F3FF','#8B5CF6'],
  Assets:     ['#FFF7ED','#F59E0B'],
};

const Documents = () => {
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...new Set(docs.map(d => d.category))];
  const shown = filter === 'All' ? docs : docs.filter(d => d.category === filter);

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", color:Z.text }}>
      <PageBand icon={FileText} title="My Documents" sub="Access and download your company documents" />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        {/* Category filters */}
        <div style={{ display:'flex', gap:8 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding:'7px 14px', borderRadius:20,
              border:`1.5px solid ${filter===c ? Z.accent : Z.border}`,
              background:filter===c ? Z.accent : '#fff',
              color:filter===c ? '#fff' : Z.muted,
              fontSize:12, fontWeight:600, cursor:'pointer',
            }}>{c}</button>
          ))}
        </div>
        <button style={{
          padding:'9px 16px', border:`1px solid ${Z.border}`,
          borderRadius:8, background:'#fff', fontSize:12, cursor:'pointer', color:Z.muted,
          display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600,
        }}>
          <Upload size={14} /> Upload Document
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
        {shown.map(doc => {
          const [bg, fg] = catColors[doc.category] || ['#F1F5F9','#64748B'];
          return (
            <Card key={doc.id} style={{ padding:'20px 22px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{
                  width:48, height:48, borderRadius:12, flexShrink:0,
                  background:`${fg}12`, color: fg,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <doc.icon size={22} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{doc.name}</div>
                  <div style={{ fontSize:11, color:Z.muted, marginBottom:8 }}>{doc.type} · {doc.size} · {new Date(doc.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                  <span style={{ display:'inline-block', padding:'2px 8px', background:bg, color:fg, borderRadius:20, fontSize:10, fontWeight:700 }}>{doc.category}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:16 }}>
                <button style={{
                  flex:1, padding:'8px', borderRadius:8, border:`1px solid ${Z.border}`,
                  background:'#fff', fontSize:12, cursor:'pointer', color:Z.muted, fontWeight:600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Eye size={14} /> Preview
                </button>
                <button style={{
                  flex:1, padding:'8px', borderRadius:8, border:'none',
                  background:Z.accent, color:'#fff', fontSize:12, cursor:'pointer', fontWeight:700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Download size={14} /> Download
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:Z.muted, fontSize:14 }}>No documents in this category.</div>
      )}
    </div>
  );
};

export default Documents;
