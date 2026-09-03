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
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-950/80 text-red-400 border border-red-800/60 shadow-sm"><AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Urgent</span>;
      case 'high':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-orange-950/80 text-orange-400 border border-orange-800/60 shadow-sm"><ShieldAlert className="w-3.5 h-3.5 text-orange-400" /> High</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-950/80 text-amber-400 border border-amber-800/60 shadow-sm"><Clock className="w-3.5 h-3.5 text-amber-400" /> Medium</span>;
      case 'low':
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-700/60"><CheckCircle2 className="w-3.5 h-3.5" /> {status}</span>;
      case 'in progress':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-blue-950 text-blue-300 border border-blue-700/60"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> In Progress</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-950 text-amber-300 border border-amber-700/60"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'reopened':
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-700/60"><RotateCcw className="w-3.5 h-3.5" /> Reopened</span>;
      case 'open':
      default:
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-orange-950 text-orange-300 border border-orange-700/60"><Inbox className="w-3.5 h-3.5" /> Open</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">

      {/* Ambient Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

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
      <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 relative z-10 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Enterprise Support Portal
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
            How Can We Help You Today?
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Submit a new support request or track your existing ticket status in real-time with our engineering team.
          </p>

          {/* Tab Selector Buttons */}
          <div className="pt-6 flex justify-center">
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 inline-flex gap-2 shadow-2xl backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 ${
                  activeTab === 'submit' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Raise a Ticket
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={`px-7 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 ${
                  activeTab === 'track' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Search className="w-4 h-4" /> Track Status
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Body ── */}
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">

          {/* 1. SUBMIT TICKET FORM */}
          {activeTab === 'submit' && (
            <motion.div key="submit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>
              <div className="bg-slate-900/80 rounded-3xl border border-slate-800/90 p-6 md:p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5 space-y-8">
                
                {/* Form Header */}
                <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                      <FileText className="w-6 h-6 text-blue-400" /> Submit Support Request
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      Fill in the details below. Our technical team will investigate and respond promptly.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column — Ticket Details */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                        <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><Layers className="w-4 h-4" /></span>
                        <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">Ticket Information</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Issue Title *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Brief summary of your issue or request" 
                          value={form.title} 
                          onChange={e => setForm({ ...form, title: e.target.value })} 
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Category *</label>
                          <select 
                            value={form.category} 
                            onChange={e => setForm({ ...form, category: e.target.value })} 
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-3.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900 text-slate-100">{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Priority *</label>
                          <select 
                            value={form.priority} 
                            onChange={e => setForm({ ...form, priority: e.target.value })} 
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-3.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                          >
                            {PRIORITIES.map(p => <option key={p} value={p} className="bg-slate-900 text-slate-100">{p}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Department *</label>
                          <select 
                            value={form.department} 
                            onChange={e => setForm({ ...form, department: e.target.value })} 
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-3.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                          >
                            {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-slate-900 text-slate-100">{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Ticket Type *</label>
                          <select 
                            value={form.ticketType} 
                            onChange={e => setForm({ ...form, ticketType: e.target.value })} 
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-3.5 text-xs text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                          >
                            {TICKET_TYPES.map(t => <option key={t} value={t} className="bg-slate-900 text-slate-100">{t}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Description *</label>
                        <textarea 
                          required 
                          rows={4} 
                          placeholder="Describe the issue in detail, steps to reproduce, or requested assistance..." 
                          value={form.description} 
                          onChange={e => setForm({ ...form, description: e.target.value })} 
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed shadow-inner" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Attachment (Optional)</label>
                        <div className="relative bg-slate-950/50 border border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 transition-all">
                          <input 
                            type="file" 
                            onChange={e => setAttachment(e.target.files[0])} 
                            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600 hover:file:text-white transition-all cursor-pointer" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column — Requester Information */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><UserCheck className="w-4 h-4" /></span>
                        <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">Requester Information</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Your full name" 
                          value={form.userName} 
                          onChange={e => setForm({ ...form, userName: e.target.value })} 
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                        <input 
                          required 
                          type="email" 
                          placeholder="your.name@company.com" 
                          value={form.userEmail} 
                          onChange={e => setForm({ ...form, userEmail: e.target.value })} 
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">User Role</label>
                          <input 
                            type="text" 
                            placeholder="Client / Manager" 
                            value={form.userRole} 
                            onChange={e => setForm({ ...form, userRole: e.target.value })} 
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Contact Phone</label>
                          <input 
                            type="text" 
                            placeholder="+91 98765 43210" 
                            value={form.contactNumber} 
                            onChange={e => setForm({ ...form, contactNumber: e.target.value })} 
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner" 
                          />
                        </div>
                      </div>

                      {/* Info Badge */}
                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1.5 text-xs text-slate-400">
                        <p className="font-bold text-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Ticket Status Tracking
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          You will receive a unique Ticket ID upon submission to track progress and discuss updates with our team.
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Form Action */}
                  <div className="flex justify-end pt-5 border-t border-slate-800">
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-9 py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-2.5 text-sm tracking-wide transition-all disabled:opacity-50"
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
            <motion.div key="track" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>
              {!selectedTicket ? (
                <div className="max-w-md mx-auto bg-slate-900/80 rounded-3xl border border-slate-800 p-8 md:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto ring-1 ring-blue-500/20">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Track Ticket Status</h2>
                    <p className="text-xs text-slate-400 mt-1">Enter your Ticket ID & email address to view progress.</p>
                  </div>

                  {trackStatus.error && <p className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-800 p-3.5 rounded-2xl">{trackStatus.error}</p>}

                  <form onSubmit={handleTrackSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Ticket ID</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. TKT-2026-001" 
                        value={trackQuery.ticketId} 
                        onChange={e => setTrackQuery({ ...trackQuery, ticketId: e.target.value })} 
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 font-mono text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Registered Email</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="your.email@company.com" 
                        value={trackQuery.email} 
                        onChange={e => setTrackQuery({ ...trackQuery, email: e.target.value })} 
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={trackStatus.loading} 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-blue-500/20 mt-2 text-sm transition-all"
                    >
                      {trackStatus.loading ? 'Searching Server...' : 'Track Ticket Status'}
                    </button>
                  </form>
                </div>
              ) : (
                /* Ticket Details View */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Sidebar Info */}
                  <div className="lg:col-span-1 bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-xl self-start space-y-6">
                    <button onClick={() => setSelectedTicket(null)} className="text-xs font-bold text-slate-400 hover:text-blue-400 uppercase tracking-wider block transition-colors">← Search Another Ticket</button>
                    <div>
                      <h3 className="text-2xl font-black font-mono text-blue-400">{selectedTicket.ticketId}</h3>
                      <h4 className="text-base font-bold text-white mt-1">{selectedTicket.title}</h4>
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center"><span className="text-slate-400">Status:</span>{getStatusBadge(selectedTicket.status)}</div>
                      <div className="flex justify-between items-center"><span className="text-slate-400">Priority:</span>{getPriorityBadge(selectedTicket.priority)}</div>
                      <div className="flex justify-between"><span className="text-slate-400">Category:</span><span className="font-semibold text-slate-200">{selectedTicket.category}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Department:</span><span className="font-semibold text-slate-200">{selectedTicket.department}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Assigned Team:</span><span className="font-semibold text-slate-200">{selectedTicket.assignedTeam || 'Support Team'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Due Date:</span><span className="font-semibold text-slate-200">{selectedTicket.dueDate ? new Date(selectedTicket.dueDate).toLocaleDateString() : 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* Main Feed */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Description</h4>
                      <div className="p-4 bg-slate-950/80 rounded-2xl text-sm text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800">{selectedTicket.description}</div>
                    </div>

                    {/* Agent / Admin Notes */}
                    {selectedTicket.adminNotes && (
                      <div className="bg-blue-950/40 border border-blue-800/60 rounded-3xl p-6 shadow-xl space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Agent Notes</h4>
                        <div className="text-sm text-blue-200 italic">{selectedTicket.adminNotes}</div>
                      </div>
                    )}

                    {/* Resolution Notes */}
                    {selectedTicket.resolutionNotes && (
                      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-3xl p-6 shadow-xl space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Resolution Summary</h4>
                        <div className="text-sm text-emerald-200 font-medium">{selectedTicket.resolutionNotes}</div>
                      </div>
                    )}

                    {/* Comments Discussion */}
                    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Updates & Discussion</h4>
                      <div className="space-y-3">
                        {selectedTicket.comments?.map((c, i) => (
                          <div key={i} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-bold text-blue-400">{c.sender} ({c.senderRole})</span>
                              <span className="text-[10px] text-slate-500">{new Date(c.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-300">{c.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input */}
                      <div className="pt-4 border-t border-slate-800 flex gap-3">
                        <input 
                          type="text" 
                          placeholder="Write a reply..." 
                          value={newComment} 
                          onChange={e => setNewComment(e.target.value)} 
                          onKeyPress={e => e.key === 'Enter' && handleSendComment()} 
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-5 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500" 
                        />
                        <button onClick={handleSendComment} disabled={sendingComment} className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                          {sendingComment ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Activity History Timeline */}
                    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Activity History Timeline</h4>
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                        {selectedTicket.history?.map((h, idx) => (
                          <div key={idx} className="relative space-y-0.5 text-xs">
                            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-200">{h.action}</span>
                              <span className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-400">By: <strong className="text-slate-300">{h.performedBy}</strong> {h.details ? `— ${h.details}` : ''}</p>
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
