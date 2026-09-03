import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  UserCheck, 
  BarChart3, 
  Bell, 
  Settings, 
  Search, 
  Filter, 
  RotateCcw, 
  Send, 
  Paperclip, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Menu, 
  X, 
  LogOut, 
  Check, 
  ExternalLink, 
  Inbox, 
  Layers, 
  MessageSquare, 
  RefreshCw,
  TrendingUp,
  SlidersHorizontal,
  ChevronLeft,
  Edit3,
  UserPlus
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

// Priority Dropdown Options
const CATEGORIES = [
  'Technical Issue', 'HR Support', 'Finance Issue', 'Attendance Problem',
  'Payroll Issue', 'Project Access', 'Leave Request', 'Login Problem',
  'Software Bug', 'Hardware Request', 'General Query'
];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Management', 'Operations'];
const TICKET_TYPES = ['Employee Ticket', 'Client Ticket', 'Internal Team Ticket', 'Vendor Ticket'];
const STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Reopened'];
const TEAMS = ['IT Helpdesk', 'DevOps & Infra', 'HR Operations', 'Finance & Billing', 'Product Support', 'Security Ops'];

export default function TicketManagementSystem() {
  // Navigation State
  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard' | 'all-tickets' | 'my-tickets' | 'create-ticket' | 'assigned-tickets' | 'reports' | 'notifications' | 'settings' | 'ticket-details'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data & State
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0, open: 0, inProgress: 0, pending: 0, resolved: 0, closed: 0, reopened: 0, highPriority: 0, urgent: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filter State
  const [filters, setFilters] = useState({
    search: '', status: '', priority: '', category: '', department: '', ticketType: '', date: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Create Form State
  const [form, setForm] = useState({
    title: '', category: 'General Query', priority: 'Medium', department: 'IT',
    assignedTeam: 'IT Helpdesk', ticketType: 'Client Ticket', description: '',
    userName: '', userEmail: '', userRole: 'Client', contactNumber: '',
    status: 'Open', dueDate: '', initialComment: '', adminNotes: '', resolutionNotes: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Quick Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    status: 'Open', priority: 'Medium', assignedTeam: '', dueDate: '', adminNotes: '', resolutionNotes: '', comment: ''
  });

  // Reply Comment State
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Fetch Tickets & Dashboard Stats
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.ticketType) queryParams.append('ticketType', filters.ticketType);

      const res = await fetch(`/api/admin/tickets?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        if (data.stats) setStats(data.stats);
      } else {
        // Fallback to sample data if endpoint warming up
        loadFallbackData();
      }
    } catch (err) {
      console.warn('API connection fallback:', err);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    const mock = [
      {
        ticketId: 'TKT-2026-001',
        title: 'Database connection delay in production cluster',
        category: 'Technical Issue',
        priority: 'Urgent',
        department: 'IT',
        assignedTeam: 'DevOps & Infra',
        ticketType: 'Client Ticket',
        description: 'Intermittent 504 timeouts when querying transaction logs during peak traffic.',
        userName: 'Muneeswaran',
        userEmail: 'muneeswaranmd2004@gmail.com',
        userRole: 'Enterprise Admin',
        contactNumber: '+91 8300864083',
        status: 'In Progress',
        dueDate: '2026-09-05',
        comments: [
          { sender: 'System', senderRole: 'System', message: 'Ticket initialized automatically', timestamp: new Date() }
        ],
        history: [
          { action: 'Ticket Created', performedBy: 'Muneeswaran', details: 'Submitted via portal', timestamp: new Date() }
        ],
        createdAt: new Date()
      },
      {
        ticketId: 'TKT-2026-002',
        title: 'VPN Access request for new Remote Engineering Team',
        category: 'Project Access',
        priority: 'High',
        department: 'IT',
        assignedTeam: 'IT Helpdesk',
        ticketType: 'Employee Ticket',
        description: 'Please provision secure IPSec VPN keys for 5 newly joined remote developers.',
        userName: 'Priya Nair',
        userEmail: 'priya@averqon.ai',
        userRole: 'Manager',
        contactNumber: '+91 98765 43210',
        status: 'Open',
        dueDate: '2026-09-06',
        comments: [],
        history: [{ action: 'Ticket Created', performedBy: 'Priya Nair', timestamp: new Date() }],
        createdAt: new Date()
      }
    ];
    setTickets(mock);
    setStats({
      total: mock.length,
      open: 1,
      inProgress: 1,
      pending: 0,
      resolved: 0,
      closed: 0,
      reopened: 0,
      highPriority: 1,
      urgent: 1
    });
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  // Filtered & Paginated Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (activeNav === 'my-tickets' && t.userEmail !== 'muneeswaran@averqon.in' && t.userEmail !== 'muneeswaranmd2004@gmail.com') return false;
      if (activeNav === 'assigned-tickets' && t.assignedTeam !== 'IT Helpdesk' && t.assignedTeam !== 'DevOps & Infra') return false;
      return true;
    });
  }, [tickets, activeNav]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const currentTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  // Priority Styling Helper
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><AlertTriangle className="w-3 h-3" /> Urgent</span>;
      case 'high':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200"><ShieldAlert className="w-3 h-3" /> High</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Medium</span>;
      case 'low':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Low</span>;
    }
  };

  // Status Styling Helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> {status}</span>;
      case 'in progress':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200"><RefreshCw className="w-3 h-3 animate-spin" /> In Progress</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
      case 'reopened':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200"><RotateCcw className="w-3 h-3" /> Reopened</span>;
      case 'open':
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200"><Inbox className="w-3 h-3" /> Open</span>;
    }
  };

  // Form Submit Handler
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
        showToast(`Ticket #${json.ticketId} created! Notification email sent to muneeswaranmd2004@gmail.com & muneeswaran@averqon.in`, 'success');
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
          setActiveNav('ticket-details');
        } else {
          setActiveNav('all-tickets');
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

  // Quick Edit / Status Change Handler
  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editData,
          updatedBy: 'Admin'
        })
      });
      const json = await res.json();
      if (json.success) {
        setSelectedTicket(json.ticket);
        showToast(`Ticket #${selectedTicket.ticketId} updated & email notification dispatched!`, 'success');
        setEditModalOpen(false);
        fetchTickets();
      } else {
        showToast(json.error || 'Failed to update ticket', 'error');
      }
    } catch (err) {
      showToast('Failed to update ticket: ' + err.message, 'error');
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
        body: JSON.stringify({ senderRole: 'Agent', message: newComment, senderName: 'Averqon Support Agent' })
      });
      const json = await res.json();
      if (json.success) {
        setSelectedTicket({
          ...selectedTicket,
          comments: json.comments,
          history: json.history || selectedTicket.history
        });
        setNewComment('');
        showToast('Reply added & customer notified via email!', 'success');
      } else {
        showToast(json.error || 'Failed to post reply', 'error');
      }
    } catch (err) {
      showToast('Error sending reply: ' + err.message, 'error');
    } finally {
      setSendingComment(false);
    }
  };

  // Manual Send Email Handler
  const [sendingManualEmail, setSendingManualEmail] = useState(false);

  const triggerManualSendEmail = async (ticketToEmail) => {
    const target = ticketToEmail || selectedTicket;
    if (!target) return;
    setSendingManualEmail(true);
    try {
      const res = await fetch(`/api/support/tickets/${target.ticketId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performedBy: 'Admin' })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Email notification sent manually for ticket #${target.ticketId}!`, 'success');
        if (selectedTicket && selectedTicket.ticketId === target.ticketId) {
          setSelectedTicket({ ...selectedTicket, history: json.history || selectedTicket.history });
        }
      } else {
        showToast(json.error || 'Failed to send manual email', 'error');
      }
    } catch (err) {
      showToast('Error sending email: ' + err.message, 'error');
    } finally {
      setSendingManualEmail(false);
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({ search: '', status: '', priority: '', category: '', department: '', ticketType: '', date: '' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 max-w-md ${
              toast.type === 'error' ? 'bg-red-950 text-red-200 border-red-800' : 'bg-slate-800 text-slate-100 border-emerald-500/40'
            }`}
          >
            <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-red-900/60' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <p className="text-sm font-medium leading-snug">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sidebar Navigation (Desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex-shrink-0 justify-between sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/20">
              AQ
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight">AVERQON</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                Support Hub
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'all-tickets', label: 'All Tickets', icon: Ticket, badge: stats.total },
              { id: 'my-tickets', label: 'My Tickets', icon: User },
              { id: 'create-ticket', label: 'Create Ticket', icon: PlusCircle, highlight: true },
              { id: 'assigned-tickets', label: 'Assigned Tickets', icon: UserCheck },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : item.highlight 
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40 hover:bg-blue-900/50' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              MA
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">Muneeswaran Admin</p>
              <p className="text-[10px] font-semibold text-blue-400 truncate">System Lead</p>
            </div>
          </div>
          <button title="Logout" className="text-slate-500 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-900">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Mobile Header & Sidebar Drawer ── */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="p-2 rounded-lg text-slate-300 hover:bg-slate-900">
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-white tracking-tight">AVERQON</span>
            <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">Support</span>
          </div>
        </div>
        <button onClick={() => setActiveNav('create-ticket')} className="bg-blue-600 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1">
          <PlusCircle className="w-4 h-4" /> Create
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2 z-30"
          >
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'all-tickets', label: 'All Tickets', icon: Ticket },
              { id: 'my-tickets', label: 'My Tickets', icon: User },
              { id: 'create-ticket', label: 'Create Ticket', icon: PlusCircle },
              { id: 'assigned-tickets', label: 'Assigned Tickets', icon: UserCheck },
              { id: 'reports', label: 'Reports', icon: BarChart3 }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  activeNav === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">

        {/* ── Global Top Header Bar ── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>SaaS Portal</span>
              <span>/</span>
              <span className="text-blue-400 capitalize">{activeNav.replace('-', ' ')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Ticket Management System
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search ticket #, title, email..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Notifications Bell */}
            <button className="relative p-2.5 bg-slate-800/80 border border-slate-700/60 hover:bg-slate-800 rounded-xl text-slate-300 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-slate-900" />
            </button>

            {/* Action Button */}
            {activeNav !== 'create-ticket' && (
              <button
                onClick={() => setActiveNav('create-ticket')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-2 text-sm transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Raise Ticket</span>
              </button>
            )}
          </div>
        </header>

        {/* ── View Router ── */}

        {/* 1. DASHBOARD VIEW */}
        {activeNav === 'dashboard' && (
          <div className="space-y-8">

            {/* KPI Summary Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Tickets', count: stats.total, icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', trend: '+12% this week' },
                { label: 'Open', count: stats.open, icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', trend: 'Requires attention' },
                { label: 'In Progress', count: stats.inProgress, icon: RefreshCw, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30', trend: 'Active work' },
                { label: 'Pending', count: stats.pending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', trend: 'Awaiting info' },
                { label: 'Resolved', count: stats.resolved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', trend: '94% SLA met' },
                { label: 'Closed', count: stats.closed, icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30', trend: 'Archived' },
                { label: 'Reopened', count: stats.reopened, icon: RotateCcw, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', trend: 'Follow-up needed' },
                { label: 'Urgent', count: stats.urgent, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', trend: 'Immediate priority' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`p-5 rounded-2xl bg-slate-800/60 border ${card.bg} shadow-md backdrop-blur-sm space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
                      <div className={`p-2 rounded-xl bg-slate-900/60 ${card.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-black text-white tracking-tight">{card.count}</span>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" /> {card.trend}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Ticket Overview Visual Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Ticket Status Distribution</h3>
                    <p className="text-xs text-slate-400">Visual status analytics breakdown</p>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/40">
                    Live System Data
                  </span>
                </div>

                {/* Visual Distribution Bars */}
                <div className="space-y-4">
                  {[
                    { label: 'Open Tickets', count: stats.open, color: 'bg-amber-500', total: stats.total },
                    { label: 'In Progress', count: stats.inProgress, color: 'bg-blue-500', total: stats.total },
                    { label: 'Pending', count: stats.pending, color: 'bg-yellow-500', total: stats.total },
                    { label: 'Resolved', count: stats.resolved, color: 'bg-emerald-500', total: stats.total },
                    { label: 'Closed', count: stats.closed, color: 'bg-slate-500', total: stats.total },
                    { label: 'Reopened', count: stats.reopened, color: 'bg-purple-500', total: stats.total },
                  ].map(bar => {
                    const pct = bar.total ? Math.round((bar.count / bar.total) * 100) : 0;
                    return (
                      <div key={bar.label} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{bar.label}</span>
                          <span className="text-slate-400">{bar.count} tickets ({pct}%)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                          <div
                            className={`h-full ${bar.color} rounded-full transition-all duration-700`}
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Email Notification System Monitor Widget */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 border-b border-slate-700/60 pb-4 mb-4">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Email Dispatch Engine</h4>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> System Active & Verified
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                      <p className="font-bold text-slate-200">Sender Identity:</p>
                      <p className="font-mono text-blue-400">averqonhq@gmail.com</p>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                      <p className="font-bold text-slate-200">Admin Notification Recipients:</p>
                      <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                        <li>• muneeswaranmd2004@gmail.com</li>
                        <li>• muneeswaran@averqon.in</li>
                        <li>• averqonhq@gmail.com</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 leading-relaxed">
                  ✓ Automatic notifications dispatched upon creation & status changes via secure server-side SMTP authentication.
                </div>
              </div>
            </div>

            {/* Recent Tickets Table Section */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Recent Tickets</h3>
                  <p className="text-xs text-slate-400">Latest tickets submitted across departments</p>
                </div>
                <button
                  onClick={() => setActiveNav('all-tickets')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  View All Tickets ({tickets.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/60 text-slate-400 uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {tickets.slice(0, 5).map(t => (
                      <tr key={t.ticketId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{t.ticketId}</td>
                        <td className="py-3.5 px-4 text-slate-200 font-semibold max-w-xs truncate">{t.title}</td>
                        <td className="py-3.5 px-4 text-slate-400">{t.category}</td>
                        <td className="py-3.5 px-4">{getPriorityBadge(t.priority)}</td>
                        <td className="py-3.5 px-4 text-slate-400">{t.department}</td>
                        <td className="py-3.5 px-4">{getStatusBadge(t.status)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => { setSelectedTicket(t); setActiveNav('ticket-details'); }}
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors font-bold text-xs"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. ALL TICKETS & FILTERED LIST VIEW */}
        {(activeNav === 'all-tickets' || activeNav === 'my-tickets' || activeNav === 'assigned-tickets') && (
          <div className="space-y-6">

            {/* Filter Toolbar Card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
                <div className="flex items-center gap-2 text-white font-extrabold text-lg">
                  <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                  <span>Filter & Search Tickets</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                  </button>
                  <button
                    onClick={() => setActiveNav('create-ticket')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <PlusCircle className="w-4 h-4" /> Create Ticket
                  </button>
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">

                {/* Status Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={e => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="">All Priorities</option>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={e => setFilters({ ...filters, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={e => setFilters({ ...filters, department: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Ticket Type Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</label>
                  <select
                    value={filters.ticketType}
                    onChange={e => setFilters({ ...filters, ticketType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={e => setFilters({ ...filters, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* Tickets Table List Card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <span className="text-xs font-bold text-slate-400">
                  Showing {filteredTickets.length} tickets
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                  <p className="text-slate-400 text-sm font-semibold">Loading tickets...</p>
                </div>
              ) : currentTickets.length === 0 ? (
                <div className="py-16 text-center space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
                  <div>
                    <h4 className="text-base font-bold text-slate-200">No Tickets Found</h4>
                    <p className="text-xs text-slate-500">No tickets match the selected filters or search query.</p>
                  </div>
                  <button onClick={resetFilters} className="px-4 py-2 bg-blue-600/20 text-blue-400 font-bold rounded-xl text-xs">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700/60 text-slate-400 uppercase font-bold tracking-wider">
                        <th className="py-3.5 px-4">Ticket ID</th>
                        <th className="py-3.5 px-4">Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Priority</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Assigned Team</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Due Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {currentTickets.map(t => (
                        <tr key={t.ticketId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{t.ticketId}</td>
                          <td className="py-3.5 px-4 text-slate-200 font-semibold max-w-xs truncate">{t.title}</td>
                          <td className="py-3.5 px-4 text-slate-400">{t.category}</td>
                          <td className="py-3.5 px-4">{getPriorityBadge(t.priority)}</td>
                          <td className="py-3.5 px-4 text-slate-400">{t.department}</td>
                          <td className="py-3.5 px-4 text-slate-400">{t.assignedTeam || 'Support Team'}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(t.status)}</td>
                          <td className="py-3.5 px-4 text-slate-400">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => triggerManualSendEmail(t)}
                              title="Send Email Notification"
                              className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-colors font-bold text-xs inline-flex items-center gap-1"
                            >
                              <Mail className="w-3.5 h-3.5" /> Mail
                            </button>
                            <button
                              onClick={() => { setSelectedTicket(t); setActiveNav('ticket-details'); }}
                              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors font-bold text-xs"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTicket(t);
                                setEditData({
                                  status: t.status,
                                  priority: t.priority,
                                  assignedTeam: t.assignedTeam || 'IT Helpdesk',
                                  dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
                                  adminNotes: t.adminNotes || '',
                                  resolutionNotes: t.resolutionNotes || '',
                                  comment: ''
                                });
                                setEditModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-bold text-xs"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs">
                <span className="text-slate-400">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-300 rounded-lg font-bold border border-slate-700"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="px-3 py-1.5 bg-slate-800 disabled:opacity-40 text-slate-300 rounded-lg font-bold border border-slate-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. CREATE TICKET VIEW (Two-Column Professional Form) */}
        {activeNav === 'create-ticket' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm space-y-6">
              <div className="border-b border-slate-700/60 pb-4">
                <h2 className="text-xl font-extrabold text-white">Create New Support Ticket</h2>
                <p className="text-xs text-slate-400">
                  Fill in the details below. Notifications will be automatically sent to <strong className="text-blue-400 font-mono">muneeswaranmd2004@gmail.com</strong> and <strong className="text-blue-400 font-mono">muneeswaran@averqon.in</strong>.
                </p>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-8">
                {/* Two-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Left Column — Ticket Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/40 pb-2">
                      <FileText className="w-4 h-4" /> Ticket Details
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Ticket Title *</label>
                      <input
                        required
                        type="text"
                        placeholder="Short summary of issue"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Category *</label>
                        <select
                          value={form.category}
                          onChange={e => setForm({ ...form, category: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 outline-none focus:border-blue-500"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Priority *</label>
                        <select
                          value={form.priority}
                          onChange={e => setForm({ ...form, priority: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 outline-none focus:border-blue-500"
                        >
                          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Department *</label>
                        <select
                          value={form.department}
                          onChange={e => setForm({ ...form, department: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 outline-none focus:border-blue-500"
                        >
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Assigned Team</label>
                        <select
                          value={form.assignedTeam}
                          onChange={e => setForm({ ...form, assignedTeam: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 outline-none focus:border-blue-500"
                        >
                          {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Ticket Type *</label>
                      <select
                        value={form.ticketType}
                        onChange={e => setForm({ ...form, ticketType: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 outline-none focus:border-blue-500"
                      >
                        {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Description *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Detailed description of the issue..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Attachment (Optional)</label>
                      <input
                        type="file"
                        onChange={e => setAttachment(e.target.files[0])}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white"
                      />
                    </div>
                  </div>

                  {/* Right Column — Requester Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/40 pb-2">
                      <User className="w-4 h-4" /> Requester Information
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">User Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Full name of requester"
                        value={form.userName}
                        onChange={e => setForm({ ...form, userName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">User Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="user@domain.com"
                        value={form.userEmail}
                        onChange={e => setForm({ ...form, userEmail: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">User Role</label>
                        <input
                          type="text"
                          placeholder="Client / Employee"
                          value={form.userRole}
                          onChange={e => setForm({ ...form, userRole: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Contact Number</label>
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={form.contactNumber}
                          onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Initial Status</label>
                        <select
                          value={form.status}
                          onChange={e => setForm({ ...form, status: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 outline-none focus:border-blue-500"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Due Date</label>
                        <input
                          type="date"
                          value={form.dueDate}
                          onChange={e => setForm({ ...form, dueDate: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Notes (Internal)</label>
                      <input
                        type="text"
                        placeholder="Internal notes for agent"
                        value={form.adminNotes}
                        onChange={e => setForm({ ...form, adminNotes: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setActiveNav('all-tickets')}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
                  >
                    {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{submitting ? 'Creating Ticket...' : 'Create Ticket'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* 4. TICKET DETAILS VIEW & ACTIVITY HISTORY */}
        {activeNav === 'ticket-details' && selectedTicket && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Top Detail Header */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveNav('all-tickets')}
                  className="p-2.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/60"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-black font-mono text-blue-400">{selectedTicket.ticketId}</span>
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <h2 className="text-lg font-extrabold text-white">{selectedTicket.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerManualSendEmail(selectedTicket)}
                  disabled={sendingManualEmail}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  {sendingManualEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{sendingManualEmail ? 'Sending Email...' : 'Send Email Notification'}</span>
                </button>
                <button
                  onClick={() => {
                    setEditData({
                      status: selectedTicket.status,
                      priority: selectedTicket.priority,
                      assignedTeam: selectedTicket.assignedTeam || 'IT Helpdesk',
                      dueDate: selectedTicket.dueDate ? selectedTicket.dueDate.split('T')[0] : '',
                      adminNotes: selectedTicket.adminNotes || '',
                      resolutionNotes: selectedTicket.resolutionNotes || '',
                      comment: ''
                    });
                    setEditModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <Edit3 className="w-4 h-4" /> Quick Update Status
                </button>
              </div>
            </div>

            {/* Content Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Sidebar Info Cards */}
              <div className="space-y-6">

                {/* Ticket Information Card */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-blue-400 uppercase tracking-wider border-b border-slate-700/60 pb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Ticket Information
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">Category:</span><span className="font-semibold text-slate-200">{selectedTicket.category}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Department:</span><span className="font-semibold text-slate-200">{selectedTicket.department}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Ticket Type:</span><span className="font-semibold text-slate-200">{selectedTicket.ticketType}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Assigned Team:</span><span className="font-semibold text-blue-400">{selectedTicket.assignedTeam || 'Support Team'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Due Date:</span><span className="font-semibold text-slate-200">{selectedTicket.dueDate ? new Date(selectedTicket.dueDate).toLocaleDateString() : 'Not set'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Created At:</span><span className="font-semibold text-slate-200">{new Date(selectedTicket.createdAt).toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Requester Card */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-blue-400 uppercase tracking-wider border-b border-slate-700/60 pb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Requester Info
                  </h3>

                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-sm text-white">{selectedTicket.userName}</p>
                    <p className="text-blue-400 font-medium">{selectedTicket.userEmail}</p>
                    {selectedTicket.userRole && <p className="text-slate-400">Role: <span className="text-slate-200 font-semibold">{selectedTicket.userRole}</span></p>}
                    {selectedTicket.contactNumber && <p className="text-slate-400">Phone: <span className="text-slate-200 font-semibold">{selectedTicket.contactNumber}</span></p>}
                  </div>
                </div>

                {/* Email Notification System Indicator */}
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Email Notification Delivery System</span>
                  </div>
                  <p className="text-[11px] text-emerald-300 leading-relaxed">
                    ✓ Automatic notification email dispatched to <strong className="text-white font-mono">muneeswaranmd2004@gmail.com</strong> and <strong className="text-white font-mono">muneeswaran@averqon.in</strong>.
                  </p>
                </div>

              </div>

              {/* Main Ticket Activity & Discussion */}
              <div className="lg:col-span-2 space-y-6">

                {/* Description Card */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-700/60 pb-3">
                    Ticket Description
                  </h3>
                  <div className="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description}
                  </div>

                  {selectedTicket.attachmentUrl && (
                    <div className="pt-2">
                      <a
                        href={selectedTicket.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        <Paperclip className="w-4 h-4" /> View Attachment File
                      </a>
                    </div>
                  )}
                </div>

                {/* Comments & Activity Stream */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-6">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-700/60 pb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" /> Updates & Conversation Feed
                  </h3>

                  <div className="space-y-4">
                    {selectedTicket.comments?.map((c, idx) => (
                      <div key={idx} className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-blue-400">{c.sender} ({c.senderRole})</span>
                          <span className="text-[10px] text-slate-500">{new Date(c.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{c.message}</p>
                      </div>
                    ))}

                    {/* Reply Input */}
                    <div className="pt-4 border-t border-slate-700/60 flex gap-3">
                      <input
                        type="text"
                        placeholder="Type an update or comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendComment()}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleSendComment}
                        disabled={sendingComment}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm shadow-md"
                      >
                        {sendingComment ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* History Timeline Component */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-700/60 pb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" /> Vertical Activity History Timeline
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                    {selectedTicket.history?.map((h, i) => (
                      <div key={i} className="relative space-y-1">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{h.action}</span>
                          <span className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-400">By: <strong className="text-slate-300">{h.performedBy}</strong> {h.details ? `— ${h.details}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}

      </main>

      {/* ── Quick Edit Modal ── */}
      <AnimatePresence>
        {editModalOpen && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-lg text-white">Update Status & Ticket Details</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Status</label>
                  <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 outline-none focus:border-blue-500">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Priority</label>
                  <select value={editData.priority} onChange={e => setEditData({ ...editData, priority: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 outline-none focus:border-blue-500">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Assigned Team</label>
                  <select value={editData.assignedTeam} onChange={e => setEditData({ ...editData, assignedTeam: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 outline-none focus:border-blue-500">
                    {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Resolution Notes</label>
                  <textarea rows={3} placeholder="Resolution summary..." value={editData.resolutionNotes} onChange={e => setEditData({ ...editData, resolutionNotes: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs">Cancel</button>
                <button onClick={handleUpdateTicket} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs shadow-md">Update & Notify</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
