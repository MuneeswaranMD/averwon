import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, ShieldCheck, Clock, Search, Send, Paperclip, ChevronRight, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Support = () => {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'track'
  
  // Submit Form State
  const [formData, setFormData] = useState({
    title: '', category: 'General Query', priority: 'Medium', description: '',
    department: 'IT', ticketType: 'Client Ticket', userName: '', userEmail: '', contactNumber: ''
  });
  const [file, setFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, ticketId: '' });

  // Track Ticket State
  const [trackQuery, setTrackQuery] = useState({ ticketId: '', email: '' });
  const [ticketDetails, setTicketDetails] = useState(null);
  const [trackStatus, setTrackStatus] = useState({ loading: false, error: '' });
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, ticketId: '' });
    
    const data = new FormData();
    Object.keys(formData).forEach(k => data.append(k, formData[k]));
    if (file) data.append('attachment', file);

    try {
      const res = await fetch(API_ENDPOINTS.TICKETS, { method: 'POST', body: data });
      const json = await res.json();
      if (json.success) {
        setSubmitStatus({ loading: false, success: true, ticketId: json.ticketId });
        setFormData({ title: '', category: 'General Query', priority: 'Medium', description: '', department: 'IT', ticketType: 'Client Ticket', userName: '', userEmail: '', contactNumber: '' });
        setFile(null);
      } else throw new Error(json.error);
    } catch (err) {
      alert('Error submitting ticket: ' + err.message);
      setSubmitStatus({ loading: false, success: false, ticketId: '' });
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackStatus({ loading: true, error: '' });
    try {
      const res = await fetch(`${API_ENDPOINTS.TICKET_TRACK(trackQuery.ticketId)}?email=${trackQuery.email}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch ticket');
      setTicketDetails(json);
      setTrackStatus({ loading: false, error: '' });
    } catch (err) {
      setTrackStatus({ loading: false, error: err.message });
      setTicketDetails(null);
    }
  };

  const sendComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(API_ENDPOINTS.TICKET_COMMENTS(ticketDetails.ticketId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderRole: 'Client', message: newComment })
      });
      const json = await res.json();
      if (json.success) {
        setTicketDetails({ ...ticketDetails, comments: json.comments });
        setNewComment('');
      } else alert(json.error);
    } catch (err) {
      alert('Failed to send comment');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      {/* ── Hero Section ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#003366]/5 -skew-y-3 origin-top-left -z-10"></div>
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-6">Help Center</span>
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight">Support <span className="text-secondary">&</span> Ticketing</h1>
            <p className="text-lg text-slate-600 leading-relaxed">Facing an issue or need technical assistance? Submit a request or track an existing ticket.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-slate-200">
                <button 
                  onClick={() => setActiveTab('submit')} 
                  className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${activeTab === 'submit' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:text-primary'} flex items-center gap-2`}
                >
                  <LifeBuoy className="w-4 h-4" /> Submit Request
                </button>
                <button 
                  onClick={() => setActiveTab('track')} 
                  className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${activeTab === 'track' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:text-primary'} flex items-center gap-2`}
                >
                  <Search className="w-4 h-4" /> Track Ticket
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'submit' ? (
                <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-primary mb-2">Create New Ticket</h2>
                  <p className="text-slate-500 mb-8">Fill the required fields clearly so our agents can resolve it effectively.</p>
                  
                  {submitStatus.success ? (
                    <div className="text-center py-10 bg-green-50 border border-green-200 rounded-2xl">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-800 mb-2">Ticket Submitted Successfully!</h3>
                      <p className="text-green-600 mb-6 font-mono font-bold bg-white inline-block px-4 py-2 rounded-lg border border-green-200 shadow-sm">{submitStatus.ticketId}</p>
                      <br/>
                      <button onClick={() => setSubmitStatus({ loading: false, success: false, ticketId: '' })} className="text-sm font-semibold text-primary underline">Submit another ticket</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-slate-700 mb-2">Ticket Title *</label><input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Short summary" /></div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option>Technical Issue</option><option>HR Support</option><option>Finance Issue</option><option>Login Problem</option><option>Software Bug</option><option>Hardware Request</option><option>General Query</option>
                          </select>
                        </div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-2">Your Name *</label><input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.userName} onChange={e => setFormData({...formData, userName: e.target.value})} placeholder="Alex Morgan" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-2">Your Email *</label><input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.userEmail} onChange={e => setFormData({...formData, userEmail: e.target.value})} placeholder="alex@company.com" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label><input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} placeholder="+91 98765 43210" /></div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                              <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target Dept</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                              <option>IT</option><option>HR</option><option>Finance</option><option>Operations</option><option>Management</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Ticket Type</label>
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={formData.ticketType} onChange={e => setFormData({...formData, ticketType: e.target.value})}>
                            <option>Client Ticket</option><option>Internal Team Ticket</option><option>Employee Ticket</option><option>Vendor Ticket</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Attachment (Opitonal)</label>
                          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 hover:border-secondary cursor-pointer relative overflow-hidden" onClick={() => document.getElementById('fileUpload').click()}>
                            <Paperclip className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-600 text-sm">{file ? file.name : "Upload a screenshot or document"}</span>
                            <input id="fileUpload" type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                        <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary min-h-[120px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your issue in detail..." />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button type="submit" disabled={submitStatus.loading} className="bg-primary hover:bg-secondary transition-colors text-white font-semibold py-3 px-8 rounded-lg shadow-md flex items-center gap-2">
                          {submitStatus.loading ? 'Submitting...' : 'Submit Ticket'} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div key="track" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {!ticketDetails ? (
                    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex flex-col items-center justify-center text-primary mb-6 shadow-sm border border-slate-100 mx-auto">
                        <Search className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-primary mb-2 text-center">Track Status</h2>
                      <p className="text-slate-500 mb-8 text-center text-sm">Enter your credentials below to access ticket details.</p>
                      
                      {trackStatus.error && <p className="text-red-500 text-sm mb-4 text-center font-medium bg-red-50 py-2 rounded">{trackStatus.error}</p>}
                      
                      <form onSubmit={handleTrack} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ticket ID</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary font-mono" value={trackQuery.ticketId} onChange={e => setTrackQuery({...trackQuery, ticketId: e.target.value})} placeholder="TKT-2026-001" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Registered Email</label>
                          <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-secondary" value={trackQuery.email} onChange={e => setTrackQuery({...trackQuery, email: e.target.value})} placeholder="alex@company.com" />
                        </div>
                        <button type="submit" disabled={trackStatus.loading} className="w-full bg-primary hover:bg-secondary transition-colors text-white font-semibold py-3 rounded-lg shadow-md mt-4">
                          {trackStatus.loading ? 'Decrypting...' : 'View Ticket Status'}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Ticket Sidebar */}
                      <div className="md:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm self-start sticky top-6">
                        <button onClick={() => setTicketDetails(null)} className="text-xs text-slate-400 hover:text-primary mb-4 font-semibold uppercase tracking-wider">← Back to Search</button>
                        <h3 className="text-2xl font-bold text-primary font-mono mb-6">{ticketDetails.ticketId}</h3>
                        
                        <div className="space-y-4">
                          <div><p className="text-xs text-slate-500">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${ticketDetails.status === 'Closed' || ticketDetails.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{ticketDetails.status}</span>
                          </div>
                          <div><p className="text-xs text-slate-500">Department</p><p className="font-semibold text-sm">{ticketDetails.department}</p></div>
                          <div><p className="text-xs text-slate-500">Priority</p><p className="font-semibold text-sm">{ticketDetails.priority}</p></div>
                          <div><p className="text-xs text-slate-500">Type</p><p className="font-semibold text-sm">{ticketDetails.ticketType}</p></div>
                          <div><p className="text-xs text-slate-500">Created At</p><p className="text-sm">{new Date(ticketDetails.createdAt).toLocaleString()}</p></div>
                          {ticketDetails.adminNotes && (
                            <div className="mt-6 pt-4 border-t border-slate-100">
                              <p className="text-xs text-slate-500 mb-1">Agent Notes (Internal)</p>
                              <p className="text-sm bg-blue-50 text-blue-800 p-3 rounded-lg italic">{ticketDetails.adminNotes}</p>
                            </div>
                          )}
                          {ticketDetails.resolutionNotes && (
                            <div className="mt-2 text-sm bg-green-50 text-green-800 p-3 rounded-lg italic border border-green-100">
                              <strong>Resolution:</strong> {ticketDetails.resolutionNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Main Ticket Chat */}
                      <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[600px]">
                        <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b border-slate-100">{ticketDetails.title}</h2>
                        
                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="text-xs text-slate-400 font-semibold">{ticketDetails.userName} (Original Request)</span>
                            <div className="bg-slate-100 text-slate-800 px-5 py-3 rounded-2xl rounded-tl-sm max-w-[85%] whitespace-pre-wrap text-sm">
                              {ticketDetails.description}
                            </div>
                            {ticketDetails.attachmentUrl && (
                              <a href={ticketDetails.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 mt-2 text-xs text-secondary hover:underline">
                                <Paperclip className="w-3 h-3"/> View Attachment
                              </a>
                            )}
                          </div>

                          {ticketDetails.comments?.map((c, i) => {
                            const isClient = c.senderRole === 'Client';
                            return (
                              <div key={i} className={`flex flex-col gap-1 ${isClient ? 'items-start' : 'items-end'}`}>
                                <span className="text-[10px] text-slate-400 font-semibold">{c.sender} • {new Date(c.timestamp).toLocaleString()}</span>
                                <div className={`px-5 py-3 rounded-2xl text-sm max-w-[85%] whitespace-pre-wrap shadow-sm ${isClient ? 'bg-slate-100 text-slate-800 rounded-tl-sm' : 'bg-primary text-white rounded-tr-sm'}`}>
                                  {c.message}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Comment Input */}
                        {ticketDetails.status !== 'Closed' && ticketDetails.status !== 'Resolved' ? (
                          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                            <input 
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 outline-none focus:border-secondary text-sm" 
                              placeholder="Write a reply..." 
                              value={newComment} 
                              onChange={e => setNewComment(e.target.value)} 
                              onKeyPress={e => e.key === 'Enter' && sendComment()}
                            />
                            <button onClick={sendComment} className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center transition-colors shadow-md flex-shrink-0">
                              <Send className="w-5 h-5 ml-1" />
                            </button>
                          </div>
                        ) : (
                          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm">This ticket is closed. No further comments can be added.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
