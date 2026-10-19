import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Printer,
  FileText,
  Boxes,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Monitor,
  PhoneCall,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Layers,
  BarChart3,
  RefreshCw,
  QrCode,
  HardDrive,
  MessageSquare,
  Building,
  Mail,
  Send,
  X
} from 'lucide-react';
import crackersScreenshot from '../assets/crackers-pos-screenshot.png';

export default function CrackersPos() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    customerName: '',
    shopName: '',
    email: '',
    phone: '',
    city: '',
    operationType: 'Seasonal Retail Counter',
    countersCount: '1 Counter',
    gstin: '',
    address: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/products/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Crackers POS',
          ...quoteForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit quote request. Please call us directly.');
      }
    } catch (err) {
      // Fallback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How fast can our fireworks shop get set up with Crackers POS?',
      a: 'Setup takes under 20 minutes. Crackers POS comes pre-loaded with over 200+ standard Sivakasi fireworks items (Standard, Sony, Ayyan, Sri Krishna, Coronation) with pre-configured HSN 3604 codes and GST tax rates, so your shop can start billing immediately.'
    },
    {
      q: 'Can we import our existing product prices and inventory from Excel?',
      a: 'Yes. Crackers POS includes a 1-click Excel/CSV import utility. You can upload your existing wholesale or retail price lists, opening stock counts, and barcode numbers directly into the system.'
    },
    {
      q: 'What printers and hardware devices are supported?',
      a: 'Crackers POS supports all standard hardware. It prints high-speed 2-inch (58mm) and 3-inch (80mm) thermal receipts via USB, Bluetooth, or LAN, as well as formal A4 GST tax invoices on any laser or inkjet printer. It also works with standard 1D/2D USB barcode scanners and electronic cash drawers.'
    },
    {
      q: 'How does the system handle fireworks GST compliance (HSN 3604)?',
      a: 'Crackers POS is built strictly according to Indian GST fireworks standards. It automatically applies HSN Code 3604, computes 18% or 28% GST slabs, splits CGST + SGST for local Tamil Nadu sales, applies IGST for inter-state dispatches, and generates GST-compliant B2B & B2C tax invoices.'
    },
    {
      q: 'Does Crackers POS work offline if the internet slows down during festival crowds?',
      a: 'Yes. Crackers POS is engineered with an offline-first desktop architecture. During festival rush hours when mobile networks and broadband connections fluctuate, your counter staff can continue high-speed billing and printing receipts without interruption. Data syncs automatically once connectivity resumes.'
    },
    {
      q: 'What support and training does Averqon provide during peak Diwali rush?',
      a: 'We provide dedicated remote installation, staff training, and direct phone/WhatsApp priority tech support. During the critical Diwali festive week, our technical operations team provides extended-hours emergency support to ensure zero downtime at your retail counters.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] text-slate-800 selection:bg-primary/20">

      {/* ── 1. Hero Section ── */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC]">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
            >
              <Flame size={14} className="text-amber-600" />
              <span>Built for Fireworks Retailers & Showrooms</span>
            </motion.div>

            {/* Product Title & Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]"
            >
              The smarter way to run your <span className="bg-gradient-to-r from-primary via-blue-600 to-amber-600 bg-clip-text text-transparent">crackers shop.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium"
            >
              Fast billing. Accurate stock. GST invoices. One simple system built for crackers and fireworks retailers.
            </motion.p>

            {/* Key Value Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-700"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                ⚡ 3-Second Counter Billing
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                🧾 HSN 3604 & 18%/28% GST
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                🖨️ Thermal 2"/3" & A4 Prints
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                📴 100% Offline-Resilient
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => setShowQuoteModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-sm shadow-xl shadow-primary/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <FileText size={17} />
                <span>Request Price Quotation</span>
              </button>

              <a
                href="#features-section"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
              >
                <span>Explore Features</span>
                <ArrowRight size={16} />
              </a>
            </motion.div>

          </div>

          {/* ── Hero Software Screenshot ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-14 max-w-6xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary via-blue-500 to-amber-500 opacity-25 blur-lg group-hover:opacity-40 transition duration-700" />
              
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-300/80 bg-slate-950 shadow-2xl">
                {/* Browser/Window Header */}
                <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-white/10 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 font-mono font-medium text-slate-300 hidden sm:inline">
                      Crackers POS — Billing Counter & Fireworks Catalog Terminal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                      Scanner Ready (F2)
                    </span>
                    <span className="text-slate-400 text-xs font-mono">v2.1 PRO</span>
                  </div>
                </div>

                {/* Actual Application Screenshot */}
                <div className="relative">
                  <img
                    src={crackersScreenshot}
                    alt="Crackers POS Billing Counter Software Screenshot"
                    className="w-full h-auto object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 px-2 gap-2">
              <span>Actual sales counter interface showing 200+ preloaded crackers, dual Tamil/English names, and 18% GST cart</span>
              <span className="font-semibold text-primary">Pre-loaded with Sivakasi fireworks manufacturers</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 2. Why Retailers Choose Crackers POS ── */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3">
              Built for Rush-Hour Performance
            </h2>
            <h3 className="font-poppins text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Every feature solves a real fireworks shop headache.
            </h3>
            <p className="mt-4 text-base text-slate-600">
              During Diwali and festival seasons, every second saved at the checkout counter directly multiplies your shop's revenue and prevents customer walkouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Fast Billing */}
            <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Lightning-Fast Counter Billing
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Search crackers by brand, SKU, English name, or Tamil name (e.g. கம்பி மத்தாப்பு, லட்சுமி வெடி). Instant barcode scanning and one-click quick quantity multipliers.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Hold & resume bill when customer steps aside</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Flat or % festival discount automation</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Cash, UPI QR, and Card split payments</li>
              </ul>
            </div>

            {/* Feature 2: Product & Stock */}
            <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Boxes size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Multi-Unit Inventory Management
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Sell crackers by Case, Bundle, or individual Box. The system automatically handles unit conversions and prevents overselling during high-volume wholesale rush.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Low stock alert threshold warnings</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Real-time batch & opening stock adjustment</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Excel price list bulk upload in seconds</li>
              </ul>
            </div>

            {/* Feature 3: GST Compliance */}
            <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                HSN 3604 & Automated GST Invoices
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Pre-configured with Sivakasi fireworks HSN 3604. Accurately calculates 18% & 28% GST slabs with clean CGST, SGST, and IGST breakdowns.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> B2B wholesale GST tax invoices with buyer GSTIN</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> High-speed B2C thermal slips with QR verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> e-Way bill export format readiness</li>
              </ul>
            </div>

            {/* Feature 4: Day-End Reports */}
            <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Cash vs UPI Sales Reconciliation
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                At closing time, balance your physical cash drawer against UPI settlement and card totals in seconds without tedious manual notebook calculations.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Top-selling crackers revenue breakdown</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Hourly peak rush transaction tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Profit margin & discount audit reports</li>
              </ul>
            </div>

            {/* Feature 5: Customer Khata */}
            <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Customer & Party Khata Ledger
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Maintain credit balances for repeat wholesale customers and institutional festival bulk buyers with instant balance statements.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Direct WhatsApp bill and receipt dispatch</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Party-wise outstanding ledger tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Custom wholesale volume discount profiles</li>
              </ul>
            </div>

            {/* Feature 6: Hardware Freedom */}
            <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Printer size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Universal Hardware Compatibility
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Runs on existing desktop PCs, laptops, and Windows POS terminals. No proprietary locked-in hardware required.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Thermal 2-inch (58mm) & 3-inch (80mm) ESC/POS</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Standard laser/inkjet A4 printers</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> USB & wireless barcode scanners</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. Product Workflow Section ── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3">
              Operational Workflow
            </h2>
            <h3 className="font-poppins text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How a fireworks shop runs with Crackers POS.
            </h3>
            <p className="mt-4 text-base text-slate-600">
              A streamlined 4-step workflow that transforms chaotic seasonal festival counters into orderly, high-speed retail operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-9 h-9 rounded-full bg-primary text-white font-black text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Stock Inward & Barcoding</h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Import Sivakasi cracker stock via CSV or select from 200+ pre-configured items. Print barcode stickers for non-barcoded items.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-9 h-9 rounded-full bg-primary text-white font-black text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Rapid Counter Billing</h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Scan barcode or type Tamil/English item names. Apply festival discount, hold cart for indecisive buyers, and queue next sale.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-9 h-9 rounded-full bg-primary text-white font-black text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Multi-Format Print</h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Instant thermal receipt for walk-in cash customers, or detailed A4 GST invoice for bulk buyers. Send digital copy via WhatsApp.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-9 h-9 rounded-full bg-primary text-white font-black text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Day-End Audit & Close</h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Reconcile physical cash with UPI QR totals. Review remaining stock counts and plan next morning's re-stocking effortlessly.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setShowQuoteModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-primary transition-colors cursor-pointer"
            >
              <FileText size={16} />
              <span>Request Workflow Consultation & Pricing</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* ── 4. Supported Integrations & Add-ons ── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/90">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">System Connectivity</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-4">
                Seamless Hardware & Add-on Integrations
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Engineered to plug directly into your store's peripherals without driver incompatibilities or vendor lock-in.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
              {[
                { title: 'Thermal Printers', sub: '2" & 3" ESC/POS', icon: '🖨️' },
                { title: 'Laser Printers', sub: 'A4 GST Invoices', icon: '📄' },
                { title: 'Barcode Guns', sub: '1D / 2D QR Scanners', icon: '🔍' },
                { title: 'WhatsApp API', sub: 'Digital PDF Receipts', icon: '💬' },
                { title: 'UPI QR Codes', sub: 'Dynamic QR Payment', icon: '📱' },
                { title: 'WooCommerce', sub: 'Optional Cloud Sync', icon: '🌐' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-xs">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-slate-400 mt-4 italic">
              * Note: Online WooCommerce inventory catalog sync is available as an optional cloud add-on for multi-channel retailers.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Frequently Asked Questions (FAQ) ── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={14} />
              <span>Questions & Answers</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Everything you need to know about implementing Crackers POS in your fireworks shop.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 6. Final CTA Section ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0A1A36] text-white text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 border border-white/15">
            <Flame size={14} />
            <span>Ready for the Upcoming Festival Rush</span>
          </div>

          <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Stop losing sales to slow billing queues.
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Equip your counters with Crackers POS. Request a tailored quotation, schedule a private walk-through, and get your hardware recommendations today.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setShowQuoteModal(true)}
              className="px-8 py-4 rounded-full bg-primary text-white font-bold text-sm shadow-xl shadow-primary/30 hover:bg-blue-600 transition-all cursor-pointer"
            >
              Request a Custom Quote
            </button>
            <a
              href="https://wa.me/918300864083"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Quick WhatsApp Enquiry</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. Purchase & Quote Modal ── */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200">
            
            <button
              onClick={() => { setShowQuoteModal(false); setSubmitted(false); }}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Request Quotation & Onboarding</h3>
                    <p className="text-xs text-slate-500">Crackers POS Software • Customized Setup</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Provide your shop requirements below. Our software specialist will contact you with deployment details, hardware recommendations, and setup timelines.
                </p>

                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Senthil Kumar"
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
                        placeholder="e.g. Sri Murugan Crackers"
                        value={quoteForm.shopName}
                        onChange={e => setQuoteForm({ ...quoteForm, shopName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / WhatsApp Number *</label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                      <input
                        required
                        type="email"
                        placeholder="senthil@srimurugan.com"
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Billing Counters</label>
                      <select
                        value={quoteForm.countersCount}
                        onChange={e => setQuoteForm({ ...quoteForm, countersCount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                      >
                        <option value="1 Counter">1 Counter (Single PC / Laptop)</option>
                        <option value="2-3 Counters">2-3 Counters (Festival Showroom)</option>
                        <option value="4+ Counters">4+ Counters (Large Multi-counter Depot)</option>
                        <option value="Wholesale Distributor">Wholesale Distributor & Depot</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Type of Operation</label>
                      <select
                        value={quoteForm.operationType}
                        onChange={e => setQuoteForm({ ...quoteForm, operationType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                      >
                        <option value="Seasonal Festival Counter">Seasonal Festival Counter</option>
                        <option value="Year-Round Retail Showroom">Year-Round Retail Showroom</option>
                        <option value="Wholesale Agency">Wholesale Agency / Direct Factory</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">GST Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 33AAAAA0000A1Z5"
                        value={quoteForm.gstin}
                        onChange={e => setQuoteForm({ ...quoteForm, gstin: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Specific Hardware or Custom Requirements</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need thermal printer recommendation, existing Excel product list to import..."
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
                      className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quotation Request'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Quotation Request Received!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{quoteForm.customerName}</strong>. Our POS implementation specialist will contact you on <strong>{quoteForm.phone}</strong> shortly with your custom quotation, setup timeline, and hardware recommendations.
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

          </div>
        </div>
      )}

    </div>
  );
}
