import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useSEO from '../hooks/useSEO';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Printer,
  BarChart3,
  Layers,
  Database,
  CheckCircle2,
  Cpu,
  Flame,
  FileSpreadsheet,
  Globe2,
  Clock,
  FileText,
  X,
  PhoneCall,
  Building,
  Mail,
  Send
} from 'lucide-react';
import crackersScreenshot from '../assets/crackers-pos-screenshot.png';
import API_BASE_URL from '../api-config';

const products = [
  {
    id: 'crackers-pos',
    name: 'Crackers POS',
    category: 'Retail & Distribution POS',
    status: 'Ready for Deployment',
    isFeatured: true,
    tagline: 'The smarter way to run your crackers shop.',
    description: 'Fast billing. Accurate stock. GST invoices. One simple system built specifically for crackers and fireworks retailers during festival rushes.',
    image: crackersScreenshot,
    link: '/products/crackers-pos',
    highlights: [
      'Sub-second barcode & quick-touch billing',
      'Dual-unit inventory (Case, Box, Packet)',
      'HSN 3604 compliance & automated 18% / 28% GST',
      'Thermal receipt (2"/3") & formal A4 GST prints',
      'Offline-first engine resilient to festive internet cuts'
    ]
  }
];

export default function Products() {
  useSEO({
    title: 'Software Products & Retail Solutions | Averqon',
    description: 'Explore Averqon software products including Crackers POS, billing software, and custom business management systems built for performance.',
    canonical: 'https://averqon.in/products',
  });

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('Crackers POS');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    customerName: '',
    shopName: '',
    email: '',
    phone: '',
    city: '',
    operationType: 'Seasonal Festival Counter',
    countersCount: '1 Counter',
    gstin: '',
    address: '',
    notes: ''
  });

  const handleOpenModal = (productName = 'Crackers POS') => {
    setSelectedProduct(productName);
    setShowQuoteModal(true);
    setSubmitted(false);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const endpoint = `${API_BASE_URL || ''}/api/products/enquiry`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct,
          ...quoteForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      // Try relative fetch fallback
      try {
        const fallbackRes = await fetch('/api/products/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: selectedProduct,
            ...quoteForm
          })
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success) {
          setSubmitted(true);
          return;
        }
      } catch (fErr) {
        console.error('Fallback error:', fErr);
      }
      alert('Unable to reach server. Please call us directly at +91 8300864083 or email averqonhq@gmail.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 selection:bg-primary/20">
      
      {/* ── 1. Hero Section ── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            
            {/* Category Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-primary text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles size={14} className="text-secondary" />
              <span>Averqon Business Software Solutions</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
            >
              Software built to <span className="bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent">simplify your business.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              From lightning-fast festival retail POS counters to full-stack supply chain platforms, Averqon engineers purpose-built business software that eliminates operational friction and accelerates growth.
            </motion.p>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#featured-product"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 hover:-translate-y-0.5 transition-all"
              >
                Explore Featured Products
                <ArrowRight size={16} />
              </a>
              <button
                type="button"
                onClick={() => handleOpenModal('General Product Consultation')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-800 border border-slate-200 font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
              >
                <FileText size={16} className="text-primary" />
                <span>Request Product Consultation</span>
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. Featured Product Banner: Crackers POS ── */}
      <section id="featured-product" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Flame size={14} className="text-amber-600" />
                <span>Featured Software Launch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Crackers POS — Modern Fireworks Billing Software
              </h2>
            </div>
            <Link
              to="/products/crackers-pos"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-700 group"
            >
              <span>View complete product details</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Featured Product Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#0A1A36] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
            
            {/* Background ambient lighting */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Column: Information */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold">
                  <span>Version 2.1 • Sivakasi Compliant</span>
                </div>

                <h3 className="font-poppins text-3xl sm:text-4xl font-black text-white leading-tight">
                  The smarter way to run your crackers shop.
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Fast counter billing, accurate multi-unit stock, automated HSN 3604 GST invoices, and customer Khata balances — engineered specifically to handle high-volume crowds during Diwali and festive peaks.
                </p>

                {/* Highlights */}
                <div className="space-y-2.5 pt-2">
                  {[
                    'Sub-second barcode & dual Tamil/English product billing',
                    'HSN Code 3604 auto-tax computation (18% & 28% GST)',
                    'Multi-counter sync & hold/resume bill capability',
                    '2"/3" thermal printer compatibility & formal A4 invoices'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to="/products/crackers-pos"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    <span>View Product Details</span>
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleOpenModal('Crackers POS')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white/20 transition-all backdrop-blur-sm cursor-pointer"
                  >
                    <FileText size={16} className="text-amber-400" />
                    <span>Request Official Quotation</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Real Software Screenshot Preview */}
              <div className="lg:col-span-7">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-amber-500 opacity-20 blur group-hover:opacity-35 transition duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl">
                    {/* Simulated window top bar */}
                    <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-white/10 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="ml-2 font-medium text-slate-300">Crackers POS v2.1 — Sales Terminal</span>
                      </div>
                      <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                        Scanner Ready
                      </span>
                    </div>

                    {/* Actual Screenshot */}
                    <Link to="/products/crackers-pos" className="block overflow-hidden cursor-pointer">
                      <img
                        src={crackersScreenshot}
                        alt="Crackers POS Billing Interface Screenshot"
                        className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Actual sales counter interface showing 200+ preloaded crackers & Tamil aliases</span>
                  <span className="text-amber-400 font-semibold">Sivakasi Fireworks Standard</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Software Products Grid ── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="max-w-2xl mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3">
              Averqon Software Portfolio
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Purpose-built platforms for modern commerce.
            </h3>
            <p className="mt-4 text-base text-slate-600">
              Each software system is engineered with robust data architecture, high security standards, and clean, intuitive interfaces that your staff can master in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Product Card Image Banner */}
                <div className="relative h-60 sm:h-72 bg-slate-950 overflow-hidden border-b border-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-bold tracking-wide backdrop-blur-md border border-white/10">
                      {p.category}
                    </span>
                    {p.isFeatured && (
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold tracking-wide shadow-md">
                        ★ Featured Product
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Content Details */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="font-poppins text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {p.status}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-primary mb-3">
                      {p.tagline}
                    </p>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {p.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 mb-8 border-t border-slate-100 pt-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Key Capabilities:
                      </div>
                      {p.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={p.link}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-primary transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight size={15} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenModal(p.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 text-primary border border-blue-200/80 font-bold text-xs hover:bg-primary hover:text-white transition-all cursor-pointer"
                    >
                      <FileText size={14} />
                      <span>Request Product Quote</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. Enterprise Standards & Guarantees ── */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-base mb-1">Local Data Security</h5>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Your business sales numbers and customer databases stay in your control with encrypted backups.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Printer size={24} />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-base mb-1">Hardware Freedom</h5>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Connect any standard USB, Bluetooth, or LAN thermal printer, barcode gun, or laser printer.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-base mb-1">Zero Training Needed</h5>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Clean visual POS layouts ensure cashiers and counter staff can start billing accurately in 5 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-base mb-1">Dedicated Support</h5>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Direct phone and WhatsApp technical assistance, with emergency coverage during festival sales peaks.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. Final Consultation CTA ── */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-slate-900 to-primary text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Need a tailored software solution for your enterprise?
          </h2>
          <p className="mt-6 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Whether you operate a single fireworks retail showroom or require multi-warehouse ERP customization, our engineering team provides end-to-end implementation and data migration.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleOpenModal('Custom Enterprise Architecture')}
              className="px-7 py-4 rounded-full bg-white text-primary font-bold text-sm shadow-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              Request Custom Enterprise Quote
            </button>
            <a
              href="https://wa.me/918300864083"
              target="_blank"
              rel="noreferrer"
              className="px-7 py-4 rounded-full bg-white/10 text-white border border-white/25 font-bold text-sm hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              <span>Speak to an Averqon Specialist</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. Purchase & Quote Modal ── */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200"
            >
              
              <button
                onClick={() => { setShowQuoteModal(false); setSubmitted(false); }}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-poppins font-extrabold text-slate-900 text-xl">
                        Request Product Quotation
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Product: <strong className="text-primary">{selectedProduct}</strong>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    Fill in your details below. Our team will review your requirements and get in touch with personalized pricing, setup timelines, and hardware guidance.
                  </p>

                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Senthil Nathan"
                          value={quoteForm.customerName}
                          onChange={e => setQuoteForm({ ...quoteForm, customerName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Shop / Business Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Sri Murugan Agencies"
                          value={quoteForm.shopName}
                          onChange={e => setQuoteForm({ ...quoteForm, shopName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          placeholder="+91 98421 XXXXX"
                          value={quoteForm.phone}
                          onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          placeholder="contact@business.com"
                          value={quoteForm.email}
                          onChange={e => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">City / Location *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Sivakasi, Madurai, Chennai"
                          value={quoteForm.city}
                          onChange={e => setQuoteForm({ ...quoteForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Counters / Branches</label>
                        <select
                          value={quoteForm.countersCount}
                          onChange={e => setQuoteForm({ ...quoteForm, countersCount: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                        >
                          <option value="1 Counter">1 Counter (Single PC / Counter)</option>
                          <option value="2-3 Counters">2-3 Counters (Festival Showroom)</option>
                          <option value="4+ Counters">4+ Counters (Large Depot)</option>
                          <option value="Multi-Branch">Multi-Branch Chain</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Requirements / Remarks</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Need thermal printer, existing catalog import, multiple billing staff..."
                        value={quoteForm.notes}
                        onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowQuoteModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Send size={15} />
                        <span>{submitting ? 'Submitting...' : 'Submit Quotation Request'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Enquiry Received!</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{quoteForm.customerName}</strong>. Your enquiry for <strong>{selectedProduct}</strong> has been received and routed to our sales engineering team at <strong>averqonhq@gmail.com</strong>. We will reach out to you directly on <strong>{quoteForm.phone}</strong> shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => { setShowQuoteModal(false); setSubmitted(false); }}
                      className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
