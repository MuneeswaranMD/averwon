import React, { useState, useEffect, useCallback } from 'react';
import { 
  Star, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Share2, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Trash2, 
  Edit3, 
  History, 
  RefreshCw, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Shield,
  Layers,
  Send
} from 'lucide-react';

const C = {
  bg: '#F8FAFC',
  white: '#FFFFFF',
  primary: '#101A32',
  accent: '#2160FF',
  border: '#E2E8F0',
  text: '#101A32',
  muted: '#64748B',
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  purple: '#8B5CF6',
  purpleLight: '#F5F3FF',
  blueLight: '#EFF6FF',
};

const card = {
  background: C.white,
  borderRadius: '16px',
  border: `1px solid ${C.border}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  padding: '24px'
};

const inp = {
  border: `1px solid ${C.border}`,
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  color: C.text,
  width: '100%',
  boxSizing: 'border-box',
  background: '#F8FAFC'
};

const btnPrimary = {
  padding: '10px 18px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: C.accent,
  color: '#FFFFFF',
  border: 'none',
  boxShadow: '0 2px 8px rgba(33,96,255,0.2)'
};

const btnSecondary = {
  padding: '10px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: C.white,
  color: C.text,
  border: `1px solid ${C.border}`
};

export default function FeedbackManagement() {
  const [activeTab, setActiveTab] = useState('testimonials'); // 'testimonials' | 'requests'
  const [feedbacks, setFeedbacks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [requestStats, setRequestStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [consentFilter, setConsentFilter] = useState('All');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateDraftModal, setShowCreateDraftModal] = useState(false);
  const [generatedLinkData, setGeneratedLinkData] = useState(null);
  const [previewFeedback, setPreviewFeedback] = useState(null);
  const [editFeedback, setEditFeedback] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Create Form State (Request link)
  const [createForm, setCreateForm] = useState({
    clientName: '',
    companyName: '',
    email: '',
    project: '',
    expiryDays: 30,
    sendEmail: false,
    customMessage: ''
  });
  const [creating, setCreating] = useState(false);

  // Create Form State (Testimonial Draft)
  const [draftForm, setDraftForm] = useState({
    clientName: '',
    companyName: '',
    organization: '',
    designation: '',
    project: '',
    feedbackText: '',
    source: 'Suggested Draft',
    status: 'Draft',
    clientApproved: false,
    publicationConsent: false,
    adminNotes: ''
  });

  const handleCreateDraft = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateDraftModal(false);
        setDraftForm({
          clientName: '',
          companyName: '',
          organization: '',
          designation: '',
          project: '',
          feedbackText: '',
          source: 'Suggested Draft',
          status: 'Draft',
          clientApproved: false,
          publicationConsent: false,
          adminNotes: ''
        });
        loadData();
      } else {
        alert(data.error || 'Failed to create testimonial draft');
      }
    } catch (err) {
      alert('Error creating testimonial draft');
    }
  };

  const handleRecordConsentApproval = async (id, payload) => {
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}/consent-approval`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        loadData();
        if (previewFeedback && previewFeedback._id === id) {
          setPreviewFeedback(data.feedback);
        }
      } else {
        alert(data.error || 'Failed to update consent or approval');
      }
    } catch (err) {
      alert('Error updating consent or approval');
    }
  };

  const handleDirectPublish = async (f) => {
    if (!confirm(`Are you sure you want to approve and publish the testimonial for "${f.clientName}" to the public website?`)) return;
    try {
      const res = await fetch(`/api/admin/feedbacks/${f._id}/consent-approval`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientApproved: true,
          publicationConsent: true,
          identityDisplayConsent: true,
          status: 'Published'
        })
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.error || 'Failed to publish testimonial');
      }
    } catch (err) {
      alert('Error publishing testimonial');
    }
  };

  // Fetch Feedbacks & Requests
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fbRes, reqRes] = await Promise.all([
        fetch(`/api/admin/feedbacks?status=${encodeURIComponent(statusFilter)}&consent=${encodeURIComponent(consentFilter)}&search=${encodeURIComponent(search)}`),
        fetch(`/api/admin/feedback-requests?search=${encodeURIComponent(search)}`)
      ]);

      const fbJson = await fbRes.json();
      const reqJson = await reqRes.json();

      setFeedbacks(fbJson.feedbacks || []);
      setStats(fbJson.stats || {});
      setRequests(reqJson.requests || []);
      setRequestStats(reqJson.stats || {});
    } catch (err) {
      console.error('Failed to load feedback data:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, consentFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Copy Link Helper
  const handleCopyLink = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Create Feedback Request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/feedback-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedLinkData(data);
        setCreateForm({
          clientName: '',
          companyName: '',
          email: '',
          project: '',
          expiryDays: 30,
          sendEmail: false,
          customMessage: ''
        });
        loadData();
      } else {
        alert(data.error || 'Failed to generate feedback link');
      }
    } catch (err) {
      alert('Network error while generating feedback link');
    } finally {
      setCreating(false);
    }
  };

  // Moderate Status (Approve, Reject, Publish, Unpublish)
  const handleUpdateStatus = async (id, newStatus, adminNotes = '') => {
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes })
      });
      const data = await res.json();
      if (data.success) {
        loadData();
        if (previewFeedback && previewFeedback._id === id) {
          setPreviewFeedback(data.feedback);
        }
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating feedback status');
    }
  };

  // Revoke Request Link
  const handleRevokeRequest = async (id) => {
    if (!confirm('Are you sure you want to revoke this feedback link? The client will no longer be able to submit feedback.')) return;
    try {
      const res = await fetch(`/api/admin/feedback-requests/${id}/revoke`, { method: 'POST' });
      const data = await res.json();
      if (data.success) loadData();
    } catch (err) {
      alert('Error revoking link');
    }
  };

  // Resend / Extend Request Link
  const handleResendRequest = async (id) => {
    try {
      const res = await fetch(`/api/admin/feedback-requests/${id}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendEmail: true })
      });
      const data = await res.json();
      if (data.success) {
        alert('Feedback link extended and invitation email queued!');
        loadData();
      }
    } catch (err) {
      alert('Error extending link');
    }
  };

  // Reopen Request
  const handleReopenRequest = async (id) => {
    try {
      const res = await fetch(`/api/admin/feedback-requests/${id}/reopen`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Request reopened! Client may submit feedback again.');
        loadData();
      }
    } catch (err) {
      alert('Error reopening request');
    }
  };

  // View Audit Logs
  const handleViewAuditLogs = async (feedbackId) => {
    try {
      const res = await fetch(`/api/admin/feedbacks/audit-logs?feedbackId=${feedbackId}`);
      const logs = await res.json();
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    }
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFeedback) return;
    try {
      const res = await fetch(`/api/admin/feedbacks/${editFeedback._id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFeedback)
      });
      const data = await res.json();
      if (data.success) {
        setEditFeedback(null);
        loadData();
      } else {
        alert(data.error || 'Failed to save changes');
      }
    } catch (err) {
      alert('Error editing feedback');
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent }}>
                <Star size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: C.primary, margin: 0, letterSpacing: '-0.02em' }}>
                  Client Feedback & Testimonials
                </h1>
                <p style={{ fontSize: 13, color: C.muted, margin: '3px 0 0' }}>
                  Generate secure feedback links, moderate client reviews, and manage automated website publication.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={loadData} style={btnSecondary}>
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => setShowCreateDraftModal(true)} style={{ ...btnSecondary, color: C.accent, borderColor: C.accent }}>
              <Edit3 size={15} /> New Testimonial Draft
            </button>
            <button onClick={() => { setGeneratedLinkData(null); setShowCreateModal(true); }} style={btnPrimary}>
              <Plus size={16} /> Create Feedback Request
            </button>
          </div>
        </div>

        {/* ── KPI Stats Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Testimonials</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.primary, marginTop: 8 }}>{feedbacks.length}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>5 confirmed clients tracked</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Approval/Consent</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.warning, marginTop: 8 }}>
              {feedbacks.filter(f => ['Draft', 'Awaiting Client Approval', 'Awaiting Publication Consent', 'Pending Review'].includes(f.status)).length}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Pending client approval/consent</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published Live</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.success, marginTop: 8 }}>
              {feedbacks.filter(f => f.status === 'Published').length}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Consent verified only</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feedback Request Links</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.accent, marginTop: 8 }}>{requests.length}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{requestStats.pending || 0} active links</div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Rating</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#D97706', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              {stats.avgRating || '5.0'} <Star size={20} fill="#D97706" color="#D97706" />
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Across reviewed feedback</div>
          </div>
        </div>

        {/* ── Main View Container ── */}
        <div style={{ ...card, padding: '20px 24px' }}>

          {/* Navigation Tabs & Search Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingBottom: '18px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('testimonials')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: activeTab === 'testimonials' ? C.primary : 'transparent',
                  color: activeTab === 'testimonials' ? '#fff' : C.muted,
                  transition: 'all 0.15s'
                }}
              >
                Submissions & Testimonials ({feedbacks.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: activeTab === 'requests' ? C.primary : 'transparent',
                  color: activeTab === 'requests' ? '#fff' : C.muted,
                  transition: 'all 0.15s'
                }}
              >
                Feedback Request Links ({requests.length})
              </button>
            </div>

            {/* Search & Filter Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 220 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: 13, color: C.muted }} />
                <input
                  type="text"
                  placeholder="Search client, project..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...inp, paddingLeft: '34px', height: '38px' }}
                />
              </div>

              {activeTab === 'testimonials' && (
                <>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ ...inp, width: 'auto', height: '38px', padding: '0 12px' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Awaiting Client Approval">Awaiting Client Approval</option>
                    <option value="Awaiting Publication Consent">Awaiting Publication Consent</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Archived">Archived</option>
                  </select>

                  <select
                    value={consentFilter}
                    onChange={e => setConsentFilter(e.target.value)}
                    style={{ ...inp, width: 'auto', height: '38px', padding: '0 12px' }}
                  >
                    <option value="All">All Consents</option>
                    <option value="granted">Consent Granted</option>
                    <option value="denied">Private (No Consent)</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* ── Submissions Table ── */}
          {activeTab === 'testimonials' && (
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              {feedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: C.muted }}>
                  <MessageSquare size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: C.text }}>No feedbacks found matching your filters</p>
                  <p style={{ fontSize: 13, margin: '4px 0 0' }}>Create a feedback request above and share the secure link with a client.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: C.muted, borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '12px 14px' }}>Client & Organization</th>
                      <th style={{ padding: '12px 14px' }}>Project</th>
                      <th style={{ padding: '12px 14px' }}>Source / Rating</th>
                      <th style={{ padding: '12px 14px' }}>Testimonial Snippet</th>
                      <th style={{ padding: '12px 14px' }}>Approval & Consent</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((f) => (
                      <tr key={f._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.15s' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 700, color: C.primary }}>{f.clientName}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>
                            {f.designation ? `${f.designation} · ` : ''}
                            {f.organization || f.companyName || '—'}
                          </div>
                          {f.email && <div style={{ fontSize: 10, color: C.muted }}>{f.email}</div>}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 600, color: C.text }}>
                          {f.project}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: '11px',
                            fontWeight: 700,
                            marginBottom: 4,
                            background: f.source === 'Suggested Draft' ? '#FEF3C7' : '#EFF6FF',
                            color: f.source === 'Suggested Draft' ? '#92400E' : C.accent
                          }}>
                            {f.source || 'Client-Provided'}
                          </span>
                          {f.rating ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D97706', fontWeight: 700, fontSize: '12px' }}>
                              {f.rating} <Star size={12} fill="#D97706" color="#D97706" />
                            </div>
                          ) : (
                            <div style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>No rating provided</div>
                          )}
                        </td>
                        <td style={{ padding: '14px', maxWidth: 260, color: '#334155' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                            "{f.feedbackText || f.draftText}"
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span style={{
                              padding: '2px 7px', borderRadius: 5, fontSize: '10px', fontWeight: 700,
                              background: f.clientApproved ? C.successLight : '#FEE2E2',
                              color: f.clientApproved ? '#065F46' : '#991B1B',
                              width: 'fit-content'
                            }}>
                              {f.clientApproved ? '✓ Client Approved' : '⏳ Awaiting Client Approval'}
                            </span>
                            <span style={{
                              padding: '2px 7px', borderRadius: 5, fontSize: '10px', fontWeight: 700,
                              background: f.publicationConsent ? C.blueLight : '#F1F5F9',
                              color: f.publicationConsent ? C.accent : C.muted,
                              width: 'fit-content'
                            }}>
                              {f.publicationConsent ? '✓ Publication Consented' : '🔒 No Publication Consent'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 8, fontSize: '11px', fontWeight: 700,
                            background: f.status === 'Published' ? C.successLight : (['Approved'].includes(f.status) ? C.blueLight : (['Awaiting Client Approval', 'Awaiting Publication Consent', 'Pending Review', 'Draft'].includes(f.status) ? C.warningLight : C.errorLight)),
                            color: f.status === 'Published' ? '#065F46' : (['Approved'].includes(f.status) ? C.accent : (['Awaiting Client Approval', 'Awaiting Publication Consent', 'Pending Review', 'Draft'].includes(f.status) ? '#92400E' : C.error))
                          }}>
                            {f.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => { setPreviewFeedback(f); handleViewAuditLogs(f.feedbackId); }}
                              style={{ ...btnSecondary, padding: '6px 10px', fontSize: '12px' }}
                              title="Review & Manage Testimonial"
                            >
                              <Eye size={14} /> Review
                            </button>

                            {f.status !== 'Published' ? (
                              <button
                                onClick={() => handleDirectPublish(f)}
                                style={{ ...btnPrimary, padding: '6px 12px', fontSize: '12px', background: C.success }}
                                title="Approve & Publish to Averqon Website"
                              >
                                <Check size={14} /> Publish
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(f._id, 'Approved', 'Unpublished from public website')}
                                style={{ ...btnSecondary, padding: '6px 10px', fontSize: '12px', color: C.warning }}
                                title="Unpublish from Website"
                              >
                                Unpublish
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── Feedback Request Links Table ── */}
          {activeTab === 'requests' && (
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              {requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: C.muted }}>
                  <p style={{ fontSize: 14, margin: 0 }}>No feedback request links generated yet.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: C.muted, borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '12px 14px' }}>Request ID</th>
                      <th style={{ padding: '12px 14px' }}>Client</th>
                      <th style={{ padding: '12px 14px' }}>Project</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Expires At</th>
                      <th style={{ padding: '12px 14px' }}>Feedback Link</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => {
                      const linkUrl = `${window.location.origin}/feedback/${r.rawToken || r.tokenHash}`;
                      const isExpired = new Date(r.expiresAt) < new Date();
                      return (
                        <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 700, color: C.accent }}>
                            {r.requestId}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: C.primary }}>{r.clientName}</div>
                            <div style={{ fontSize: 11, color: C.muted }}>{r.companyName ? `${r.companyName} · ` : ''}{r.email}</div>
                          </td>
                          <td style={{ padding: '14px', fontWeight: 600 }}>{r.project}</td>
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: 8, fontSize: '11px', fontWeight: 700,
                              background: r.status === 'Submitted' ? C.successLight : (r.status === 'Pending' ? C.blueLight : (r.status === 'Revoked' ? C.errorLight : '#F1F5F9')),
                              color: r.status === 'Submitted' ? '#065F46' : (r.status === 'Pending' ? C.accent : (r.status === 'Revoked' ? C.error : C.muted))
                            }}>
                              {r.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px', color: isExpired ? C.error : C.text, fontSize: '12px' }}>
                            {new Date(r.expiresAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <button
                                onClick={() => handleCopyLink(linkUrl, r._id)}
                                style={{ ...btnSecondary, padding: '5px 10px', fontSize: '11px', gap: 4 }}
                                title="Copy Secure Feedback URL"
                              >
                                {copiedId === r._id ? <Check size={12} color={C.success} /> : <Copy size={12} />}
                                <span>{copiedId === r._id ? 'Copied!' : 'Copy Link'}</span>
                              </button>

                              <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${r.clientName}, please take 2 minutes to share your feedback with Averqon for ${r.project}: ${linkUrl}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ ...btnSecondary, padding: '5px 10px', fontSize: '11px', color: '#166534', background: '#DCFCE7', border: '1px solid #BBF7D0', textDecoration: 'none' }}
                                title="Share via WhatsApp"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              {r.status === 'Pending' && (
                                <button
                                  onClick={() => handleRevokeRequest(r._id)}
                                  style={{ ...btnSecondary, padding: '5px 10px', fontSize: '11px', color: C.error }}
                                  title="Revoke link"
                                >
                                  Revoke
                                </button>
                              )}

                              {(r.status === 'Expired' || r.status === 'Revoked') && (
                                <button
                                  onClick={() => handleResendRequest(r._id)}
                                  style={{ ...btnSecondary, padding: '5px 10px', fontSize: '11px', color: C.accent }}
                                  title="Extend expiration by 30 days"
                                >
                                  Extend
                                </button>
                              )}

                              {r.status === 'Submitted' && (
                                <button
                                  onClick={() => handleReopenRequest(r._id)}
                                  style={{ ...btnSecondary, padding: '5px 10px', fontSize: '11px', color: C.purple }}
                                  title="Allow client to re-submit"
                                >
                                  Reopen
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>

        {/* ── MODAL: Create Feedback Request ── */}
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,26,50,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
            <div style={{ background: C.white, borderRadius: 20, maxWidth: 540, width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.primary, margin: 0 }}>Create Feedback Request</h3>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>✕</button>
              </div>

              {!generatedLinkData ? (
                <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Client Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={createForm.clientName}
                      onChange={e => setCreateForm({ ...createForm, clientName: e.target.value })}
                      style={inp}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Company Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Cloud Solutions"
                      value={createForm.companyName}
                      onChange={e => setCreateForm({ ...createForm, companyName: e.target.value })}
                      style={inp}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Email Address *</label>
                      <input
                        required
                        type="email"
                        placeholder="sarah@apexcloud.io"
                        value={createForm.email}
                        onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                        style={inp}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Project or Service *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Enterprise SaaS Portal"
                        value={createForm.project}
                        onChange={e => setCreateForm({ ...createForm, project: e.target.value })}
                        style={inp}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Link Expiration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={createForm.expiryDays}
                      onChange={e => setCreateForm({ ...createForm, expiryDays: e.target.value })}
                      style={inp}
                    />
                  </div>

                  <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.primary }}>
                      <input
                        type="checkbox"
                        checked={createForm.sendEmail}
                        onChange={e => setCreateForm({ ...createForm, sendEmail: e.target.checked })}
                      />
                      <span>Send personalized invitation email automatically</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                    <button type="button" onClick={() => setShowCreateModal(false)} style={btnSecondary}>Cancel</button>
                    <button type="submit" disabled={creating} style={btnPrimary}>
                      {creating ? 'Generating Link...' : 'Generate Secure Link'}
                    </button>
                  </div>
                </form>
              ) : (
                /* ── Display Created Link ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'center' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: C.successLight, color: C.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <CheckCircle size={28} />
                  </div>

                  <div>
                    <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.primary }}>Feedback Link Ready!</h4>
                    <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>Share this private link with <strong>{generatedLinkData.request.clientName}</strong>.</p>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: `1px solid ${C.border}`, textAlign: 'left', wordBreak: 'break-all', fontSize: 12, color: C.primary }}>
                    {generatedLinkData.feedbackUrl}
                  </div>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button
                      onClick={() => handleCopyLink(generatedLinkData.feedbackUrl, 'modal')}
                      style={{ ...btnPrimary, padding: '10px 20px' }}
                    >
                      <Copy size={15} />
                      {copiedId === 'modal' ? 'Copied to Clipboard!' : 'Copy Link'}
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${generatedLinkData.request.clientName}, please take 2 minutes to share your feedback with Averqon for ${generatedLinkData.request.project}: ${generatedLinkData.feedbackUrl}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ ...btnSecondary, textDecoration: 'none', background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' }}
                    >
                      Share via WhatsApp
                    </a>
                  </div>

                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 6 }}>
                    <button onClick={() => { setShowCreateModal(false); setGeneratedLinkData(null); }} style={btnSecondary}>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODAL: Review & Moderation Preview ── */}
        {previewFeedback && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,26,50,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
            <div style={{ background: C.white, borderRadius: 20, maxWidth: 640, width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.primary, margin: 0 }}>Review Client Testimonial</h3>
                  <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Ticket / Request ID: {previewFeedback.requestId}</p>
                </div>
                <button onClick={() => setPreviewFeedback(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Author Info Banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F8FAFC', padding: 16, borderRadius: 14, border: `1px solid ${C.border}` }}>
                  {previewFeedback.photoUrl && previewFeedback.imageDisplayConsent ? (
                    <img src={previewFeedback.photoUrl} alt="Author" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: C.blueLight, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                      {previewFeedback.clientName?.charAt(0) || 'C'}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{previewFeedback.clientName}</div>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: '11px', fontWeight: 700,
                        background: previewFeedback.source === 'Suggested Draft' ? '#FEF3C7' : '#EFF6FF',
                        color: previewFeedback.source === 'Suggested Draft' ? '#92400E' : C.accent
                      }}>
                        {previewFeedback.source || 'Client-Provided'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {previewFeedback.designation ? `${previewFeedback.designation} · ` : ''}
                      {previewFeedback.organization || previewFeedback.companyName || '—'}
                      {previewFeedback.email ? ` · ${previewFeedback.email}` : ''}
                    </div>
                    <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginTop: 2 }}>Project: {previewFeedback.project}</div>
                  </div>
                </div>

                {/* Ratings Breakdown (if available) */}
                {previewFeedback.rating ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center' }}>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>Overall</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#D97706', marginTop: 4 }}>{previewFeedback.rating} ★</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>Quality</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginTop: 4 }}>{previewFeedback.qualityRating || 5} ★</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>Comms</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginTop: 4 }}>{previewFeedback.communicationRating || 5} ★</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>Delivery</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginTop: 4 }}>{previewFeedback.deliveryRating || 5} ★</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, fontStyle: 'italic' }}>
                    No numerical rating provided by client (rating omitted).
                  </div>
                )}

                {/* Written Testimonial Text */}
                <div style={{ background: '#F8FAFC', borderLeft: `4px solid ${C.accent}`, padding: '16px 20px', borderRadius: '0 12px 12px 0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                    {previewFeedback.source === 'Suggested Draft' ? 'Suggested Testimonial Draft' : 'Client-Provided Feedback'}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.primary, fontStyle: 'italic' }}>
                    "{previewFeedback.feedbackText || previewFeedback.draftText}"
                  </p>
                </div>

                {/* Verification & Consent Controls */}
                <div style={{ padding: 16, borderRadius: 14, border: `1px solid ${C.border}`, background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Client Approval & Publication Consent Controls
                  </div>

                  {/* Client Approval Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>
                        Client Approval Status: <span style={{ color: previewFeedback.clientApproved ? C.success : '#DC2626' }}>
                          {previewFeedback.clientApproved ? '✓ Approved by Client' : '⏳ Pending Client Review'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {previewFeedback.clientApproved 
                          ? `Recorded on ${previewFeedback.clientApprovalDate ? new Date(previewFeedback.clientApprovalDate).toLocaleDateString() : 'Confirmed'}` 
                          : 'Suggested drafts must not be published without client agreement.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRecordConsentApproval(previewFeedback._id, { clientApproved: !previewFeedback.clientApproved })}
                      style={{
                        ...btnSecondary,
                        fontSize: '11px',
                        padding: '6px 12px',
                        background: previewFeedback.clientApproved ? '#FEF2F2' : '#ECFDF5',
                        color: previewFeedback.clientApproved ? '#DC2626' : '#059669',
                        borderColor: previewFeedback.clientApproved ? '#FECACA' : '#A7F3D0'
                      }}
                    >
                      {previewFeedback.clientApproved ? 'Revoke Approval' : 'Record Client Approval'}
                    </button>
                  </div>

                  {/* Publication Consent Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>
                        Website Publication Consent: <span style={{ color: previewFeedback.publicationConsent ? C.success : '#DC2626' }}>
                          {previewFeedback.publicationConsent ? '✓ Explicit Consent Confirmed' : '🔒 No Public Consent (Private Only)'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {previewFeedback.publicationConsent 
                          ? `Consented on ${previewFeedback.publicationConsentDate ? new Date(previewFeedback.publicationConsentDate).toLocaleDateString() : 'Recorded'}` 
                          : 'Explicit client permission is strictly required before displaying publicly.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRecordConsentApproval(previewFeedback._id, { publicationConsent: !previewFeedback.publicationConsent })}
                      style={{
                        ...btnSecondary,
                        fontSize: '11px',
                        padding: '6px 12px',
                        background: previewFeedback.publicationConsent ? '#FEF2F2' : '#EFF6FF',
                        color: previewFeedback.publicationConsent ? '#DC2626' : C.accent,
                        borderColor: previewFeedback.publicationConsent ? '#FECACA' : '#BFDBFE'
                      }}
                    >
                      {previewFeedback.publicationConsent ? 'Revoke Consent' : 'Grant Publication Consent'}
                    </button>
                  </div>

                  {/* Workflow Status Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>Workflow Lifecycle Status:</span>
                    <select
                      value={previewFeedback.status}
                      onChange={e => handleUpdateStatus(previewFeedback._id, e.target.value)}
                      style={{ ...inp, width: 'auto', height: '34px', padding: '0 10px', fontWeight: 600 }}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Awaiting Client Approval">Awaiting Client Approval</option>
                      <option value="Awaiting Publication Consent">Awaiting Publication Consent</option>
                      <option value="Approved">Approved (Internal)</option>
                      <option value="Published">Published (Live Website)</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Moderation Actions Bar */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setEditFeedback(previewFeedback)}
                      style={{ ...btnSecondary, fontSize: '12px' }}
                    >
                      <Edit3 size={14} /> Edit Content
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(previewFeedback._id, 'Archived', 'Archived by moderator')}
                      style={{ ...btnSecondary, fontSize: '12px', color: C.muted }}
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(previewFeedback._id, 'Rejected', 'Rejected by moderator')}
                      style={{ ...btnSecondary, fontSize: '12px', color: C.error }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {previewFeedback.publicationConsent && (previewFeedback.source !== 'Suggested Draft' || previewFeedback.clientApproved) ? (
                      previewFeedback.status === 'Published' ? (
                        <button
                          onClick={() => handleUpdateStatus(previewFeedback._id, 'Approved', 'Unpublished from public website')}
                          style={{ ...btnSecondary, color: C.warning }}
                        >
                          Unpublish from Website
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(previewFeedback._id, 'Published')}
                          style={{ ...btnPrimary, background: C.success }}
                        >
                          <Check size={16} /> Publish to Website
                        </button>
                      )
                    ) : (
                      <span style={{ fontSize: 12, color: C.muted, fontStyle: 'italic', padding: '6px 10px', background: '#F8FAFC', borderRadius: 8 }}>
                        🔒 Requires both Client Approval & Publication Consent to Publish
                      </span>
                    )}
                  </div>
                </div>

                {/* Audit Logs Accordion */}
                {auditLogs.length > 0 && (
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <History size={14} /> Audit Trail ({auditLogs.length} events)
                    </div>
                    <div style={{ maxHeight: 120, overflowY: 'auto', fontSize: 11, color: C.muted, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {auditLogs.map((log) => (
                        <div key={log._id} style={{ padding: '4px 0', borderBottom: '1px dashed #E2E8F0' }}>
                          <span style={{ fontWeight: 600, color: C.primary }}>{log.action}</span> by {log.actorId} at {new Date(log.createdAt).toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: Edit Feedback Text (Audit logged) ── */}
        {editFeedback && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,26,50,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ background: C.white, borderRadius: 20, maxWidth: 520, width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.primary, margin: 0 }}>Edit Testimonial Content</h3>
                <button onClick={() => setEditFeedback(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>✕</button>
              </div>

              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Testimonial Text</label>
                  <textarea
                    rows={4}
                    value={editFeedback.feedbackText}
                    onChange={e => setEditFeedback({ ...editFeedback, feedbackText: e.target.value })}
                    style={{ ...inp, minHeight: 90 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Project Category</label>
                  <input
                    type="text"
                    value={editFeedback.project}
                    onChange={e => setEditFeedback({ ...editFeedback, project: e.target.value })}
                    style={inp}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Edit Reason / Audit Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Fixed typographical error"
                    value={editFeedback.adminNotes || ''}
                    onChange={e => setEditFeedback({ ...editFeedback, adminNotes: e.target.value })}
                    style={inp}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button type="button" onClick={() => setEditFeedback(null)} style={btnSecondary}>Cancel</button>
                  <button type="submit" style={btnPrimary}>Save & Log Audit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: Create Testimonial Draft ── */}
        {showCreateDraftModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,26,50,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
            <div style={{ background: C.white, borderRadius: 20, maxWidth: 560, width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.primary, margin: 0 }}>Create Testimonial Draft</h3>
                  <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Draft or record client feedback for review and approval workflow.</p>
                </div>
                <button onClick={() => setShowCreateDraftModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>✕</button>
              </div>

              <form onSubmit={handleCreateDraft} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Client Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. MaxxJoy Tours"
                      value={draftForm.clientName}
                      onChange={e => setDraftForm({ ...draftForm, clientName: e.target.value })}
                      style={inp}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Project Scope *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Travel Website Development"
                      value={draftForm.project}
                      onChange={e => setDraftForm({ ...draftForm, project: e.target.value })}
                      style={inp}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. V.S.B. College of Engineering"
                      value={draftForm.organization || draftForm.companyName}
                      onChange={e => setDraftForm({ ...draftForm, organization: e.target.value, companyName: e.target.value })}
                      style={inp}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Designation / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Professor & Head"
                      value={draftForm.designation}
                      onChange={e => setDraftForm({ ...draftForm, designation: e.target.value })}
                      style={inp}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Source</label>
                    <select
                      value={draftForm.source}
                      onChange={e => setDraftForm({ ...draftForm, source: e.target.value })}
                      style={inp}
                    >
                      <option value="Suggested Draft">Suggested Draft</option>
                      <option value="Client-Provided">Client-Provided</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Initial Status</label>
                    <select
                      value={draftForm.status}
                      onChange={e => setDraftForm({ ...draftForm, status: e.target.value })}
                      style={inp}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Awaiting Client Approval">Awaiting Client Approval</option>
                      <option value="Awaiting Publication Consent">Awaiting Publication Consent</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Testimonial Text *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the client testimonial or proposed draft text..."
                    value={draftForm.feedbackText}
                    onChange={e => setDraftForm({ ...draftForm, feedbackText: e.target.value })}
                    style={{ ...inp, minHeight: 90 }}
                  />
                </div>

                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.primary }}>
                    <input
                      type="checkbox"
                      checked={draftForm.clientApproved}
                      onChange={e => setDraftForm({ ...draftForm, clientApproved: e.target.checked })}
                    />
                    <span>Client has already reviewed and approved this wording</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.primary }}>
                    <input
                      type="checkbox"
                      checked={draftForm.publicationConsent}
                      onChange={e => setDraftForm({ ...draftForm, publicationConsent: e.target.checked })}
                    />
                    <span>Client has provided explicit consent to publish on Averqon website</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>Admin Audit Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Created initial draft based on client delivery sign-off"
                    value={draftForm.adminNotes}
                    onChange={e => setDraftForm({ ...draftForm, adminNotes: e.target.value })}
                    style={inp}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                  <button type="button" onClick={() => setShowCreateDraftModal(false)} style={btnSecondary}>Cancel</button>
                  <button type="submit" style={btnPrimary}>Save Testimonial</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
