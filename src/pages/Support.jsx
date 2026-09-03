import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Search, 
  Send, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  User, 
  Mail, 
  Inbox, 
  RefreshCw,
  RotateCcw,
  Building2,
  Phone,
  UserCheck,
  Layers,
  Sparkles,
  ChevronRight,
  Upload,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

// Form & Ticket Field Constants
const CATEGORIES = [
  'Technical Issue', 'HR Support', 'Finance Issue', 'Attendance Problem',
  'Payroll Issue', 'Project Access', 'Leave Request', 'Login Problem',
  'Software Bug', 'Hardware Request', 'General Query'
];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Management', 'Operations'];
const TICKET_TYPES = ['Employee Ticket', 'Client Ticket', 'Internal Team Ticket', 'Vendor Ticket'];

export default function SupportPage() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'track'

  // Data & Track State
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [trackQuery, setTrackQuery] = useState({ ticketId: '', email: '' });
  const [trackStatus, setTrackStatus] = useState({ loading: false, error: '' });

  // Form State
  const [form, setForm] = useState({
    title: '', category: 'General Query', priority: 'Medium', department: 'IT',
    assignedTeam: 'IT Helpdesk', ticketType: 'Client Ticket', description: '',
    userName: '', userEmail: '', userRole: 'Client', contactNumber: '',
    status: 'Open', dueDate: '', initialComment: '', adminNotes: '', resolutionNotes: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reply Comments State
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Fetch Tickets
  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.warn('API connection fallback:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Track Ticket Handler
  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    setTrackStatus({ loading: true, error: '' });
    try {
      const res = await fetch(`${API_ENDPOINTS.TICKET_TRACK(trackQuery.ticketId)}?email=${encodeURIComponent(trackQuery.email)}`);
      const data = await res.json();
      if (data.success && data.ticket) {
        setSelectedTicket(data.ticket);
        setTrackStatus({ loading: false, error: '' });
      } else {
        setTrackStatus({ loading: false, error: data.error || 'Ticket not found with provided ID and Email.' });
      }
    } catch (err) {
      setTrackStatus({ loading: false, error: 'Failed to connect to support server.' });
    }
  };

  // Create Ticket Handler
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.userName.trim() || !form.userEmail.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));
      if (attachment) data.append('attachment', attachment);

      const res = await fetch(API_ENDPOINTS.TICKETS, { method: 'POST', body: data });
      const json = await res.json();

      if (json.success) {
        showToast(`✓ Ticket #${json.ticketId} created successfully!`, 'success');
        setForm({
          title: '', category: 'General Query', priority: 'Medium', department: 'IT',
          assignedTeam: 'IT Helpdesk', ticketType: 'Client Ticket', description: '',
          userName: '', userEmail: '', userRole: 'Client', contactNumber: '',
          status: 'Open', dueDate: '', initialComment: '', adminNotes: '', resolutionNotes: ''
        });
        setAttachment(null);
        await fetchTickets();
        if (json.ticket) {
          setSelectedTicket(json.ticket);
          setActiveTab('track');
        }
      } else {
        throw new Error(json.error || 'Failed to create ticket');
      }
    } catch (err) {
      showToast('Error creating ticket: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Reply Comment Handler
  const handleSendComment = async () => {
    if (!newComment.trim() || !selectedTicket) return;
    setSendingComment(true);
    try {
      const res = await fetch(API_ENDPOINTS.TICKET_COMMENTS(selectedTicket.ticketId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderRole: 'Client', message: newComment, senderName: selectedTicket.userName })
      });
      const json = await res.json();
      if (json.success) {
        setSelectedTicket({
          ...selectedTicket,
          comments: json.comments,
          history: json.history || selectedTicket.history
        });
        setNewComment('');
        showToast('✓ Reply posted successfully!', 'success');
      } else {
        showToast(json.error || 'Failed to post reply', 'error');
      }
    } catch (err) {
      showToast('Error sending reply: ' + err.message, 'error');
    } finally {
      setSendingComment(false);
    }
  };

  // Badges Helpers
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200"><AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Urgent</span>;
      case 'high':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200"><ShieldAlert className="w-3.5 h-3.5 text-orange-600" /> High</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="w-3.5 h-3.5 text-amber-600" /> Medium</span>;
      case 'low':
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> {status}</span>;
      case 'in progress':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> In Progress</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'reopened':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200"><RotateCcw className="w-3.5 h-3.5" /> Reopened</span>;
      case 'open':
      default:
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200"><Inbox className="w-3.5 h-3.5" /> Open</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* ── Toast Notification Banner ── */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 max-w-md ${
              toast.type === 'error' ? 'bg-red-950 text-red-200 border-red-800' : 'bg-slate-900 text-white border-emerald-500/40'
            }`}
          >
            <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-red-900/60' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <p className="text-sm font-medium leading-snug">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Header Section ── */}
      <section className="bg-slate-900 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Enterprise Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            How Can We Help You Today?
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Submit a new support ticket or track your existing request in real time with our support engineering team.
          </p>

          {/* Tab Selector Buttons */}
          <div className="pt-6 flex justify-center">
            <div className="bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/60 inline-flex gap-2 shadow-xl">
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 ${
                  activeTab === 'submit' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Raise a Ticket
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={`px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 ${
                  activeTab === 'track' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Search className="w-4 h-4" /> Track Status
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Body (White Theme) ── */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">

          {/* 1. SUBMIT TICKET FORM */}
          {activeTab === 'submit' && (
            <motion.div key="submit" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-xl shadow-slate-200/60 space-y-8">
                
                {/* Form Header */}
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    <FileText className="w-6 h-6 text-blue-600" /> Submit Support Request
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Please fill out the form below with your details and issue description.
                  </p>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column — Ticket Details */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Layers className="w-4 h-4" /></span>
                        <h3 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Ticket Information</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Title *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Summary of issue" 
                          value={form.title} 
                          onChange={e => setForm({ ...form, title: e.target.value })} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-sm" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                          <select 
                            value={form.category} 
                            onChange={e => setForm({ ...form, category: e.target.value })} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all cursor-pointer shadow-sm"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority *</label>
                          <select 
                            value={form.priority} 
                            onChange={e => setForm({ ...form, priority: e.target.value })} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all cursor-pointer shadow-sm"
                          >
                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Department *</label>
                          <select 
                            value={form.department} 
                            onChange={e => setForm({ ...form, department: e.target.value })} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all cursor-pointer shadow-sm"
                          >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Ticket Type *</label>
                          <select 
                            value={form.ticketType} 
                            onChange={e => setForm({ ...form, ticketType: e.target.value })} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all cursor-pointer shadow-sm"
                          >
                            {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Description *</label>
                        <textarea 
                          required 
                          rows={4} 
                          placeholder="Describe your issue in detail..." 
                          value={form.description} 
                          onChange={e => setForm({ ...form, description: e.target.value })} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all leading-relaxed shadow-sm" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Attachment (Optional)</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm hover:bg-slate-100/60 transition-all">
                          <input 
                            type="file" 
                            onChange={e => setAttachment(e.target.files[0])} 
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column — Requester Details */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600"><UserCheck className="w-4 h-4" /></span>
                        <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Requester Information</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="John Doe" 
                          value={form.userName} 
                          onChange={e => setForm({ ...form, userName: e.target.value })} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-sm" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                        <input 
                          required 
                          type="email" 
                          placeholder="john@company.com" 
                          value={form.userEmail} 
                          onChange={e => setForm({ ...form, userEmail: e.target.value })} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-sm" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">User Role</label>
                          <input 
                            type="text" 
                            placeholder="Client" 
                            value={form.userRole} 
                            onChange={e => setForm({ ...form, userRole: e.target.value })} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone</label>
                          <input 
                            type="text" 
                            placeholder="+91 98765 43210" 
                            value={form.contactNumber} 
                            onChange={e => setForm({ ...form, contactNumber: e.target.value })} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-sm" 
                          />
                        </div>
                      </div>

                      {/* Clean info note */}
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1 text-xs text-slate-600">
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Tracking & Notifications
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          A unique Ticket ID will be generated upon submission for real-time tracking and communication.
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Form Action */}
                  <div className="flex justify-end pt-5 border-t border-slate-100">
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-9 py-4 rounded-2xl shadow-lg shadow-blue-600/25 flex items-center gap-2.5 text-sm transition-all disabled:opacity-50"
                    >
                      {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                      <span>{submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* 2. TRACK TICKET STATUS */}
          {activeTab === 'track' && (
            <motion.div key="track" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>
              {!selectedTicket ? (
                <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-200/60 text-center space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Track Ticket Status</h2>
                    <p className="text-xs text-slate-500 mt-1">Enter your Ticket ID & email address to view updates.</p>
                  </div>

                  {trackStatus.error && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3.5 rounded-2xl">{trackStatus.error}</p>}

                  <form onSubmit={handleTrackSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Ticket ID</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. TKT-2026-001" 
                        value={trackQuery.ticketId} 
                        onChange={e => setTrackQuery({ ...trackQuery, ticketId: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-mono text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Email</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="user@company.com" 
                        value={trackQuery.email} 
                        onChange={e => setTrackQuery({ ...trackQuery, email: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-sm" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={trackStatus.loading} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-600/25 mt-2 text-sm transition-all"
                    >
                      {trackStatus.loading ? 'Searching Server...' : 'Track Ticket Status'}
                    </button>
                  </form>
                </div>
              ) : (
                /* Ticket Details View */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Sidebar Info */}
                  <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm self-start space-y-6">
                    <button onClick={() => setSelectedTicket(null)} className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-wider block transition-colors">← Search Another Ticket</button>
                    <div>
                      <h3 className="text-2xl font-black font-mono text-blue-600">{selectedTicket.ticketId}</h3>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{selectedTicket.title}</h4>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center"><span className="text-slate-500">Status:</span>{getStatusBadge(selectedTicket.status)}</div>
                      <div className="flex justify-between items-center"><span className="text-slate-500">Priority:</span>{getPriorityBadge(selectedTicket.priority)}</div>
                      <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="font-semibold text-slate-800">{selectedTicket.category}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Department:</span><span className="font-semibold text-slate-800">{selectedTicket.department}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Assigned Team:</span><span className="font-semibold text-slate-800">{selectedTicket.assignedTeam || 'Support Team'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Due Date:</span><span className="font-semibold text-slate-800">{selectedTicket.dueDate ? new Date(selectedTicket.dueDate).toLocaleDateString() : 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* Main Feed */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Description</h4>
                      <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-100">{selectedTicket.description}</div>
                    </div>

                    {/* Agent / Admin Notes */}
                    {selectedTicket.adminNotes && (
                      <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-6 shadow-sm space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Agent Notes</h4>
                        <div className="text-sm text-blue-900 italic">{selectedTicket.adminNotes}</div>
                      </div>
                    )}

                    {/* Resolution Notes */}
                    {selectedTicket.resolutionNotes && (
                      <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Resolution Summary</h4>
                        <div className="text-sm text-emerald-900 font-medium">{selectedTicket.resolutionNotes}</div>
                      </div>
                    )}

                    {/* Comments Discussion */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Updates & Discussion</h4>
                      <div className="space-y-3">
                        {selectedTicket.comments?.map((c, i) => (
                          <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-bold text-blue-600">{c.sender} ({c.senderRole})</span>
                              <span className="text-[10px] text-slate-400">{new Date(c.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-800">{c.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input */}
                      <div className="pt-4 border-t border-slate-100 flex gap-3">
                        <input 
                          type="text" 
                          placeholder="Write a reply..." 
                          value={newComment} 
                          onChange={e => setNewComment(e.target.value)} 
                          onKeyPress={e => e.key === 'Enter' && handleSendComment()} 
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600" 
                        />
                        <button onClick={handleSendComment} disabled={sendingComment} className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all">
                          {sendingComment ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Activity History Timeline */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Activity History Timeline</h4>
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {selectedTicket.history?.map((h, idx) => (
                          <div key={idx} className="relative space-y-0.5 text-xs">
                            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-800">{h.action}</span>
                              <span className="text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-500">By: <strong className="text-slate-700">{h.performedBy}</strong> {h.details ? `— ${h.details}` : ''}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
