import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Zap,
  Printer,
  FileText,
  Boxes,
  Users,
  Monitor,
  Laptop,
  Layers,
  Database,
  QrCode,
  HardDrive,
  BarChart3,
  RefreshCw,
  Cpu,
  Clock,
  Send,
  Building,
  Check,
  ExternalLink
} from 'lucide-react';
import useSEO from '../../hooks/useSEO';
import Breadcrumbs from './Breadcrumbs';
import QuoteModal from './QuoteModal';
import { companyInfo, productsData, servicesData } from '../../data/seoData';
import { trackWhatsAppClick } from '../../utils/analytics';

// Screenshots/visuals from existing assets
import crackersScreenshot from '../../assets/crackers-pos-screenshot.png';
import neoretailCore from '../../assets/neoretail_core.png';
import sentientAnalytics from '../../assets/sentient_analytics.png';
import averlinkLogistics from '../../assets/averlink_logistics.png';

const productVisuals = {
  'crackers-pos': crackersScreenshot,
  'restaurant-pos': neoretailCore,
  'averqon-erp': sentientAnalytics,
  'billing-software': neoretailCore,
  'business-management-software': sentientAnalytics,
  'inventory-management': averlinkLogistics,
  'pos-software': neoretailCore
};

export default function ProductLandingLayout({ productKey }) {
  const product = productsData[productKey];
  const [openFaq, setOpenFaq] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center container mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-800">Product Not Found</h1>
        <p className="mt-4 text-slate-500">The requested software solution could not be located.</p>
        <Link to="/products" className="mt-6 inline-block px-6 py-2.5 bg-primary text-white rounded-full">
          Browse Software Products
        </Link>
      </div>
    );
  }

  const productImage = productVisuals[productKey] || crackersScreenshot;

  // SoftwareApplication JSON-LD Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${companyInfo.siteUrl}${product.path}#software`,
    name: product.h1,
    operatingSystem: 'Windows, Web, Android',
    applicationCategory: 'BusinessApplication',
    description: product.metaDescription,
    url: `${companyInfo.siteUrl}${product.path}`,
    author: {
      '@type': 'Organization',
      name: companyInfo.name,
      url: companyInfo.siteUrl,
      logo: companyInfo.logo
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Contact Averqon for quotation based on deployment scale'
    }
  };

  const faqSchema = product.faqs && product.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  } : null;

  useSEO({
    title: product.title,
    description: product.metaDescription,
    keywords: product.keywords || [product.primaryKeyword, ...(product.secondaryKeywords || [])],
    canonical: `${companyInfo.siteUrl}${product.path}`,
    schema: faqSchema ? [softwareSchema, faqSchema] : softwareSchema,
    breadcrumbs: [
      { name: 'Products', path: '/products' },
      { name: product.h1, path: product.path }
    ]
  });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const breadcrumbItems = [
    { name: 'Products', path: '/products' },
    { name: product.h1, path: product.path }
  ];

  return (
    <div className="overflow-x-hidden pt-20 bg-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-50/80 border-b border-slate-100">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071827] via-[#0A2033] to-[#071827] text-white py-20 lg:py-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,123,255,0.2),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs sm:text-sm font-bold tracking-wide uppercase mb-6">
                <Sparkles size={14} className="text-secondary" />
                <span>{product.heroBadge || product.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins text-white leading-tight tracking-tight mb-6">
                {product.h1}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                {product.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="h-13 px-8 bg-secondary hover:bg-white hover:text-primary text-white font-bold rounded-full transition-all duration-300 shadow-[0_16px_36px_rgba(0,123,255,0.35)] flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <span>Request Live Demo & Pricing</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href={`https://wa.me/919176477943?text=Hi%20Averqon,%20I'd%20like%20a%20demo%20of%20${encodeURIComponent(product.h1)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick(`product_${product.slug}`)}
                  className="h-13 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/15 transition-all duration-300 flex items-center gap-2"
                >
                  <PhoneCall size={16} className="text-emerald-400" />
                  <span>WhatsApp Enquiries</span>
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" /> GST Compliant Invoicing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" /> Offline Resilient Engine
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" /> No Hidden Setup Fees
                </span>
              </div>
            </div>

            {/* Product Screenshot / Interface Visual */}
            <div className="relative">
              <div className="rounded-3xl border border-white/15 bg-white/5 p-3 shadow-2xl backdrop-blur-sm overflow-hidden">
                <img
                  src={productImage}
                  alt={`${product.h1} Interface Screenshot`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto rounded-2xl object-cover shadow-inner hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary/90 border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-xl flex items-center gap-2">
                <Zap size={14} className="text-secondary" />
                <span>Verified Deployment Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/60 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
            <div className="space-y-6">
              <div className="inline-block text-secondary font-bold text-xs uppercase tracking-widest">
                Software Solution Overview
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins text-primary leading-tight">
                Engineered for High-Pressure Commercial Environments
              </h2>
              {product.overview.map((para, idx) => (
                <p key={idx} className="text-slate-600 text-base leading-relaxed">
                  {para}
                </p>
              ))}

              {/* Target Customers */}
              {product.targetCustomers && (
                <div className="pt-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Who Is This Built For?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.targetCustomers.map((cust, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                      >
                        <Check size={16} className="text-secondary flex-shrink-0" />
                        <span>{cust}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Specifications Table */}
            {product.techSpecs && (
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-2.5 text-primary font-bold text-lg mb-4">
                  <Cpu className="text-secondary" size={22} />
                  <span>Hardware & System Compatibility</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {product.techSpecs.map((spec, idx) => (
                    <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between gap-1">
                      <span className="text-slate-500 font-medium">{spec.label}</span>
                      <span className="font-semibold text-slate-800 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full py-3.5 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Custom Quote</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <section className="py-24 bg-white px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">
              Core Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">
              Feature Highlights & Business Benefits
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              Explore the exact technical capabilities designed to save operational hours, eliminate cashier errors, and speed up business cash flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.highlights.map((feat, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-slate-50 border border-slate-100 hover:border-secondary/30 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-primary text-secondary group-hover:text-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 transition-colors">
                  <Zap size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-3">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {product.faqs && (
        <section className="py-24 bg-slate-50 px-6 border-t border-slate-100">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">
                Clear Answers
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">
                Product Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {product.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-primary transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base sm:text-lg">{faq.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-secondary' : ''
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
                          className="p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100"
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
        </section>
      )}

      {/* Internal Linking: Related Products & Related Services */}
      <section className="py-20 bg-white border-t border-slate-100 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Connected Platform</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-poppins">Related Software & Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Related Products */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Other Averqon Software</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.relatedProducts && product.relatedProducts.map((relKey) => {
                  const relProd = productsData[relKey];
                  if (!relProd) return null;
                  return (
                    <Link
                      key={relKey}
                      to={relProd.path}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-secondary hover:bg-white hover:shadow-md transition-all group block"
                    >
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{relProd.h1}</span>
                        <ArrowUpRight size={14} className="text-slate-400 group-hover:text-secondary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{relProd.tagline}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Related Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Custom Engineering Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.relatedServices && product.relatedServices.map((servKey) => {
                  const serv = servicesData[servKey];
                  if (!serv) return null;
                  return (
                    <Link
                      key={servKey}
                      to={serv.path}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-secondary hover:bg-white hover:shadow-md transition-all group block"
                    >
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{serv.heroBadge || serv.h1}</span>
                        <ArrowUpRight size={14} className="text-slate-400 group-hover:text-secondary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{serv.tagline}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-[#003d7a] to-primary text-white text-center px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
          <p className="text-secondary font-bold text-xs uppercase tracking-widest">Schedule a Live Walkthrough</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins leading-tight">
            See {product.h1} in Action
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Book an interactive live demonstration with our product specialists or request a formal quotation tailored to your store or enterprise counters.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="h-13 px-8 bg-secondary hover:bg-white hover:text-primary text-white font-bold rounded-full transition-all duration-300 shadow-xl flex items-center gap-2"
            >
              <span>Book Free Demo & Quote</span>
              <ArrowRight size={16} />
            </button>

            <Link
              to="/contact"
              className="h-13 px-8 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Speak to Sales Team</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote/Demo Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        defaultItemName={product.h1}
        isProduct={true}
      />
    </div>
  );
}
