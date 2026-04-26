import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowUpRight, Search, X, UploadCloud, CheckCircle } from 'lucide-react';

const CareersSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Application Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ candidateName: '', email: '', phone: '' });
  const [file, setFile] = useState(null);
  const [submitState, setSubmitState] = useState({ loading: false, success: false });

  // Fetch Live Jobs from backend
  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load jobs:", err);
        setLoading(false);
      });
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false });
    
    const payload = new FormData();
    payload.append('jobId', selectedJob._id);
    payload.append('candidateName', formData.candidateName);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    if (file) payload.append('resume', file);

    try {
      const res = await fetch('/api/applications', { method: 'POST', body: payload });
      const json = await res.json();
      if (json.success) {
        setSubmitState({ loading: false, success: true });
        setTimeout(() => {
          setSelectedJob(null);
          setSubmitState({ loading: false, success: false });
          setFormData({ candidateName: '', email: '', phone: '' });
          setFile(null);
        }, 3000);
      }
    } catch {
      setSubmitState({ loading: false, success: false });
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <section id="careers" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Join the Future</h4>
              <h2 className="text-4xl lg:text-6xl font-bold text-primary mb-8 leading-tight">
                Work at the Edge of <span className="text-secondary">Innovation</span>
              </h2>
              <p className="text-grayText text-lg leading-relaxed">
                We're a team of thinkers, makers, and innovators. Join us in building technology that defines the next decade.
              </p>
            </motion.div>
          </div>
          <button className="inline-flex items-center gap-3 px-8 h-14 rounded-full bg-secondary text-white font-bold text-sm tracking-wide hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,123,255,0.35)] transition-all duration-300">
            Search Openings <Search size={18} />
          </button>
        </div>

        <div className="grid gap-6 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 font-semibold animate-pulse">Loading live positions...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 rounded-3xl border border-slate-100">
              <h3 className="text-xl font-bold text-primary mb-2">No Open Roles</h3>
              <p className="text-slate-500">We aren't actively hiring right now, but feel free to drop your resume.</p>
            </div>
          ) : (
            jobs.map((job, i) => (
              <JobCard key={job._id || i} job={job} i={i} onApply={() => setSelectedJob(job)} />
            ))
          )}
        </div>
      </div>

      {/* ── ATS Application Modal ── */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submitState.loading && !submitState.success && setSelectedJob(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100 flex justify-between items-start sticky top-0 z-10">
                <div>
                  <span className="text-secondary font-black text-xs uppercase tracking-widest mb-1 block">Application Form</span>
                  <h3 className="text-2xl font-bold text-primary">{selectedJob.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedJob.location} • {selectedJob.type}</p>
                </div>
                {!submitState.loading && !submitState.success && (
                  <button onClick={() => setSelectedJob(null)} className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors shadow-sm"><X size={20} /></button>
                )}
              </div>

              <div className="p-6 md:p-8 overflow-y-auto">
                {submitState.success ? (
                  <div className="text-center py-16">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-bold text-primary mb-2">Application Received!</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">We've securely delivered your resume to our recruitment team. Keep an eye on your inbox!</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-secondary focus:bg-white transition-all text-sm" placeholder="Alex Morgan" value={formData.candidateName} onChange={e => setFormData({...formData, candidateName: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                        <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-secondary focus:bg-white transition-all text-sm" placeholder="alex.morgan@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-secondary focus:bg-white transition-all text-sm" placeholder="+1 234 567 8900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume</label>
                      <div className="w-full border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-secondary/50 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative group" onClick={() => document.getElementById('resumeUpload').click()}>
                        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-secondary mb-3 transition-colors" />
                        <p className="text-sm font-semibold text-primary">{file ? file.name : "Click to select file"}</p>
                        <p className="text-xs text-slate-500 mt-1">PDF or DOCX up to 5MB</p>
                        <input id="resumeUpload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                      <button type="button" onClick={() => setSelectedJob(null)} className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 transition-colors text-sm">Cancel</button>
                      <button type="submit" disabled={submitState.loading} className="px-8 py-3 bg-secondary hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 text-sm flex items-center gap-2">
                        {submitState.loading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const JobCard = ({ job, i, onApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 160;
  const isLong = job.description && job.description.length > maxLength;
  
  const displayDescription = isLong && !isExpanded 
    ? `${job.description.substring(0, maxLength)}...` 
    : job.description;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="group p-8 md:p-10 rounded-[3rem] bg-slate-50 border border-gray-100 flex flex-col md:flex-row md:items-start justify-between gap-8 hover:bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500"
    >
      <div className="flex items-start gap-8 flex-1">
        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex-shrink-0 mt-1">
          {job.department === 'Design' ? <Clock size={28} /> : <Briefcase size={28} />}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-6 text-xs text-grayText font-bold uppercase tracking-widest mb-4">
            <span className="flex items-center gap-2"><Clock size={16} className="text-secondary" /> {job.type}</span>
            <span className="flex items-center gap-2"><MapPin size={16} className="text-accent" /> {job.location}</span>
            {job.department && <span className="px-3 py-1 bg-slate-200/50 rounded-lg">{job.department}</span>}
          </div>
          
          <div className="relative">
            <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-line">
              {displayDescription || "Join our team to work on exciting projects."}
            </p>
            {isLong && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-secondary font-bold text-sm hover:underline flex items-center gap-1 transition-all"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={onApply}
        className="inline-flex items-center gap-2 px-7 h-12 rounded-full border-2 border-secondary/30 text-secondary font-bold text-sm hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,123,255,0.25)] transition-all duration-300 flex-shrink-0 self-center md:self-start"
      >
        Apply Now <ArrowUpRight size={16} />
      </button>
    </motion.div>
  );
};

export default CareersSection;

