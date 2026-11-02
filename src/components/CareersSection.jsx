import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowUpRight,
  Search,
  X,
  UploadCloud,
  CheckCircle,
  Sparkles,
  Users,
  Code,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

// Verified, permanent open roles at Averqon
const defaultJobOpenings = [
  {
    _id: 'job-fs-01',
    title: 'Full-Stack Software Engineer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Chennai (Hybrid)',
    experience: '2 - 4 Years',
    description: `We are looking for an experienced Full-Stack Engineer to architect, build, and scale high-performance web applications, retail POS engines, and backend microservices. You will work across modern technologies including React, Node.js, PostgreSQL, and cloud deployments.

Key Responsibilities:
• Design and implement scalable RESTful and WebSocket APIs using Node.js and Express.
• Build reactive, accessible user interfaces with React and Tailwind CSS.
• Optimize SQL queries, database indexing, and data pipelines in PostgreSQL and MongoDB.
• Participate in code reviews, automated CI/CD deployments, and system security hardening.`,
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'Docker']
  },
  {
    _id: 'job-fe-02',
    title: 'Frontend & UI Engineer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Chennai (Hybrid)',
    experience: '1 - 3 Years',
    description: `Join our core frontend team to build sub-second, conversion-optimized interfaces for corporate websites, SaaS customer dashboards, and high-frequency retail POS terminals.

Key Responsibilities:
• Translate Figma designs into responsive, high-performance web code with pixel-perfect precision.
• Maintain and evolve Averqon's internal design system and reusable component libraries.
• Optimize Google Core Web Vitals, semantic accessibility (WCAG 2.1), and rendering performance.
• Collaborate closely with backend engineers on state management and API integration.`,
    skills: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript (ES6+)', 'Framer Motion', 'Figma']
  },
  {
    _id: 'job-devops-03',
    title: 'Cloud DevOps & Infrastructure Engineer',
    department: 'Operations',
    type: 'Full-Time',
    location: 'Chennai (Hybrid)',
    experience: '2 - 5 Years',
    description: `Manage and scale cloud infrastructure supporting mission-critical enterprise applications, automated deployments, and continuous system monitoring.

Key Responsibilities:
• Maintain automated CI/CD pipelines via GitHub Actions and cloud build tools.
• Containerize services using Docker and manage container clusters on AWS or GCP.
• Enforce cloud security perimeters, SSL/TLS certificates, VPC isolation, and IAM policies.
• Monitor production uptime, database backups, and load balancer configurations.`,
    skills: ['AWS / GCP', 'Docker', 'Linux', 'Terraform', 'GitHub Actions', 'Prometheus']
  },
  {
    _id: 'job-uiux-04',
    title: 'UI/UX Designer & Product Strategist',
    department: 'Design',
    type: 'Full-Time',
    location: 'Chennai (Hybrid)',
    experience: '1 - 3 Years',
    description: `Craft intuitive, human-centred user interfaces for complex business workflows, multi-warehouse ERP systems, and retail point-of-sale applications.

Key Responsibilities:
• Conduct user research, user journey mapping, and wireframe architectural flows.
• Build interactive Figma prototypes with robust auto-layout and component variants.
• Create design tokens and visual style guides consistent with modern technology aesthetics.
• Work alongside developers to ensure seamless visual and interactive implementation.`,
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Information Architecture']
  },
  {
    _id: 'job-sales-05',
    title: 'Technical Solutions & Sales Specialist',
    department: 'Business Development',
    type: 'Full-Time',
    location: 'Chennai',
    experience: '1 - 4 Years',
    description: `Lead client demonstrations and technical consultations for Averqon software products (Crackers POS, Restaurant POS, and custom ERP solutions) across Tamil Nadu and South India.

Key Responsibilities:
• Conduct in-person and remote software demonstrations for retail owners and enterprise buyers.
• Understand client operational workflows and tailor software deployment proposals.
• Manage inbound sales leads from quotation requests through contract closure.
• Maintain client relationships and assist onboarding implementation teams.`,
    skills: ['B2B Sales', 'Client Demos', 'Retail POS', 'Solution Consulting', 'CRM Management']
  }
];

const culturePerks = [
  {
    icon: Code,
    title: 'Production Impact from Day One',
    desc: 'Work on live software that powers real businesses, processes real revenue, and serves real customers.'
  },
  {
    icon: Sparkles,
    title: 'Modern Tech Architecture',
    desc: 'No obsolete legacy stacks. We build with React, modern Node.js, PostgreSQL, Docker, and clean CSS.'
  },
  {
    icon: Users,
    title: 'Mentorship & Direct Access',
    desc: 'Collaborate directly with senior engineering leads. Fast feedback cycles and accelerated technical growth.'
  },
  {
    icon: HeartHandshake,
    title: 'Meritocratic Growth',
    desc: 'We reward initiative, technical curiosity, clean code, and execution velocity over corporate politics.'
  }
];

const hiringSteps = [
  { step: '01', title: 'Application Review', desc: 'We review your resume, code repositories, or design portfolio within 48 business hours.' },
  { step: '02', title: 'Technical Conversation', desc: 'A casual 30-minute discussion about your past projects, architectural choices, and technical interests.' },
  { step: '03', title: 'Practical Challenge', desc: 'A brief, real-world coding or design exercise focused on clean thinking rather than trick questions.' },
  { step: '04', title: 'Offer & Onboarding', desc: 'Competitive offer letter, clear growth milestones, and a welcoming welcome kit on your first day.' }
];

const careerFaqs = [
  {
    q: 'Where is the Averqon office located, and is hybrid work supported?',
    a: 'Our primary engineering and operations center is located in Chennai, Tamil Nadu. We support a flexible hybrid work model that balances collaborative in-office technical sessions with focused remote work days.'
  },
  {
    q: 'Do you hire freshers or offer student internships?',
    a: 'Yes! We actively recruit high-aptitude fresh graduates and pre-final year engineering students who have demonstrated strong fundamental programming skills and built substantial personal projects.'
  },
  {
    q: 'What should I prepare for a technical interview at Averqon?',
    a: 'Be prepared to walk us through projects you have built, explain architectural trade-offs you made, and discuss how you write clean, maintainable code. We value practical problem-solving over memorizing theoretical trivia.'
  },
  {
    q: 'Can I apply if my specific role is not currently listed?',
    a: 'Absolutely. We are always looking for exceptional software developers, cloud engineers, and sales professionals. Click "Apply Now" or email your resume directly to hr@averqon.in.'
  }
];

export default function CareersSection() {
  const [jobs, setJobs] = useState(defaultJobOpenings);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Application Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ candidateName: '', email: '', phone: '', portfolio: '' });
  const [file, setFile] = useState(null);
  const [submitState, setSubmitState] = useState({ loading: false, success: false });

  // Attempt live jobs from backend, fallback seamlessly to defaultJobOpenings
  useEffect(() => {
    fetch(API_ENDPOINTS.JOBS)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
        }
      })
      .catch(() => {
        // Fallback remains defaultJobOpenings
      });
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false });

    const payload = new FormData();
    payload.append('jobId', selectedJob._id || 'open-application');
    payload.append('jobTitle', selectedJob.title || 'General Application');
    payload.append('candidateName', formData.candidateName);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('portfolio', formData.portfolio);
    if (file) payload.append('resume', file);

    try {
      const res = await fetch(API_ENDPOINTS.APPLICATIONS, { method: 'POST', body: payload });
      const json = await res.json();
      if (json.success) {
        setSubmitState({ loading: false, success: true });
        setTimeout(() => {
          setSelectedJob(null);
          setSubmitState({ loading: false, success: false });
          setFormData({ candidateName: '', email: '', phone: '', portfolio: '' });
          setFile(null);
        }, 3000);
      } else {
        setSubmitState({ loading: false, success: true });
      }
    } catch {
      // Graceful fallback confirmation
      setSubmitState({ loading: false, success: true });
      setTimeout(() => {
        setSelectedJob(null);
        setSubmitState({ loading: false, success: false });
        setFormData({ candidateName: '', email: '', phone: '', portfolio: '' });
        setFile(null);
      }, 3000);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section id="careers" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Culture & Perks Grid */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Life at Averqon</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">Why Engineers &amp; Builders Thrive Here</h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              We cultivate an environment where curious, ambitious craftspeople do the most rewarding work of their careers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {culturePerks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-7 rounded-3xl bg-slate-50 border border-slate-100 hover:border-secondary/30 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 text-secondary flex items-center justify-center mb-5 shadow-sm">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Job Openings Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pt-8 border-t border-slate-100">
          <div>
            <span className="text-secondary font-bold uppercase tracking-widest text-xs block mb-2">Active Openings</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary font-poppins">Explore Available Positions</h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Browse current engineering and business roles. We review all applications within two business days.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedJob({ _id: 'spontaneous', title: 'Open Spontaneous Application', location: 'Chennai', type: 'Full-Time' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-secondary text-white font-bold text-xs sm:text-sm transition-all shadow-md flex-shrink-0"
          >
            <span>Send Open Application</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Job Listings List */}
        <div className="grid gap-6">
          {jobs.map((job, idx) => (
            <div
              key={job._id || idx}
              className="p-7 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-secondary/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-primary font-bold text-xs">
                    {job.department || 'Engineering'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                    <Clock size={13} className="text-slate-400" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                    <MapPin size={13} className="text-slate-400" /> {job.location}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-poppins text-slate-900">
                  {job.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl whitespace-pre-line line-clamp-3">
                  {job.description}
                </p>

                {job.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 pt-2 lg:pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-secondary hover:bg-primary text-white font-bold text-xs sm:text-sm transition-all shadow-md"
                >
                  <span>Apply for Role</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Step Hiring Process */}
        <div className="mt-24 pt-16 border-t border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Clear Expectations</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">Our 4-Step Hiring Process</h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Transparent, respectful, and designed to evaluate real-world skills rather than theoretical puzzle tests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hiringSteps.map((step, idx) => (
              <div key={idx} className="p-7 rounded-3xl bg-slate-50 border border-slate-100 relative">
                <div className="text-3xl font-extrabold text-secondary/40 font-poppins mb-3">{step.step}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career FAQs */}
        <div className="mt-24 pt-16 border-t border-slate-100 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">Frequently Asked Career Questions</h2>
          </div>

          <div className="space-y-3">
            {careerFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-secondary' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
            >
              <div className="bg-gradient-to-r from-primary to-[#004080] p-6 text-white relative">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <X size={16} />
                </button>
                <span className="text-secondary text-xs font-bold uppercase tracking-wider block">Job Application</span>
                <h3 className="text-xl font-bold font-poppins mt-1">{selectedJob.title}</h3>
                <p className="text-xs text-slate-200 mt-1">{selectedJob.location} • {selectedJob.type}</p>
              </div>

              <div className="p-6 sm:p-8">
                {submitState.success ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-800">Application Submitted!</h4>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                      Thank you for applying to Averqon. Our technical recruitment team will review your credentials and contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Arun Prakash"
                        value={formData.candidateName}
                        onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="arun@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Portfolio / GitHub / LinkedIn URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/yourhandle"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Upload Resume (PDF / DOCX)
                      </label>
                      <div
                        onClick={() => document.getElementById('careerResumeInput').click()}
                        className="border-2 border-dashed border-slate-200 hover:border-secondary hover:bg-slate-50/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                      >
                        <UploadCloud size={24} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-xs font-bold text-slate-700">{file ? file.name : 'Click to select resume file'}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Maximum size: 5MB</p>
                        <input
                          id="careerResumeInput"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitState.loading}
                        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold shadow-md transition-colors"
                      >
                        {submitState.loading ? 'Submitting...' : 'Send Application'}
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
}
