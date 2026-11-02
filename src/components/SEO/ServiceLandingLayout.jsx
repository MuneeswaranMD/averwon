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
  Palette,
  Search,
  Send,
  Layers,
  Cpu,
  Database,
  RefreshCw,
  BarChart3,
  MessageSquare,
  Smartphone,
  Cloud,
  ShoppingCart,
  CreditCard,
  Boxes,
  FileText,
  Truck,
  Target,
  TrendingUp,
  Users,
  Code,
  MapPin,
  Bell,
  QrCode,
  Bot,
  GitBranch,
  TrendingDown,
  Activity,
  Compass,
  Eye,
  Factory,
  FileCheck,
  BookOpen,
  Calendar
} from 'lucide-react';
import useSEO from '../../hooks/useSEO';
import Breadcrumbs from './Breadcrumbs';
import QuoteModal from './QuoteModal';
import { companyInfo, servicesData, productsData } from '../../data/seoData';
import { trackWhatsAppClick, trackPhoneCall } from '../../utils/analytics';

// Map string icon names to Lucide icons
const iconMap = {
  Palette, Zap, Search, Send, Layers, ShieldCheck, Cpu, Database, RefreshCw,
  BarChart3, MessageSquare, Smartphone, Cloud, ShoppingCart, CreditCard,
  Boxes, FileText, Truck, Sparkles, Target, TrendingUp, Users, Code, MapPin,
  Bell, QrCode, Bot, GitBranch, TrendingDown, Activity, Compass, Eye,
  Factory, FileCheck, BookOpen, CheckCircle2
};

export default function ServiceLandingLayout({ serviceKey }) {
  const service = servicesData[serviceKey];
  const [openFaq, setOpenFaq] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  if (!service) {
    return (
      <div className="pt-32 pb-20 text-center container mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-800">Service Not Found</h1>
        <p className="mt-4 text-slate-500">The requested service page does not exist.</p>
        <Link to="/services" className="mt-6 inline-block px-6 py-2.5 bg-primary text-white rounded-full">
          View All Services
        </Link>
      </div>
    );
  }

  // Structured schemas: Service + FAQPage (if faqs exist) + BreadcrumbList
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${companyInfo.siteUrl}${service.path}#service`,
    name: service.h1,
    serviceType: service.title,
    description: service.metaDescription,
    url: `${companyInfo.siteUrl}${service.path}`,
    provider: {
      '@type': 'Organization',
      '@id': `${companyInfo.siteUrl}/#organization`,
      name: companyInfo.name,
      url: companyInfo.siteUrl,
      logo: companyInfo.logo,
      telephone: companyInfo.phone,
      email: companyInfo.email
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    }
  };

  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  } : null;

  useSEO({
    title: service.title,
    description: service.metaDescription,
    keywords: service.keywords || [service.primaryKeyword, ...(service.secondaryKeywords || [])],
    canonical: `${companyInfo.siteUrl}${service.path}`,
    schema: faqSchema ? [serviceSchema, faqSchema] : serviceSchema,
    breadcrumbs: [
      { name: 'Services', path: '/services' },
      { name: service.heroBadge || service.h1, path: service.path }
    ]
  });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const breadcrumbItems = [
    { name: 'Services', path: '/services' },
    { name: service.heroBadge, path: service.path }
  ];

  return (
    <div className="overflow-x-hidden pt-20 bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50/80 border-b border-slate-100">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071827] via-[#0B2238] to-[#071827] text-white py-20 lg:py-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,123,255,0.18),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs sm:text-sm font-bold tracking-wide uppercase mb-6">
              <Sparkles size={14} className="text-secondary" />
              <span>{service.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-white leading-tight tracking-tight mb-6">
              {service.h1}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              {service.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="h-13 px-8 bg-secondary hover:bg-white hover:text-primary text-white font-bold rounded-full transition-all duration-300 shadow-[0_16px_36px_rgba(0,123,255,0.35)] flex items-center gap-2 hover:-translate-y-0.5"
              >
                <span>Request Free Consultation</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/919176477943?text=Hi%20Averqon,%20I'm%20interested%20in%20your%20${encodeURIComponent(service.h1)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(`service_${service.slug}`)}
                className="h-13 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/15 transition-all duration-300 flex items-center gap-2"
              >
                <PhoneCall size={16} className="text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Key Metrics Strip */}
          {service.businessBenefits && (
            <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {service.businessBenefits.map((b, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-secondary font-poppins">{b.metric}</div>
                  <div className="text-sm font-semibold text-white">{b.label}</div>
                  <div className="text-xs text-slate-400">{b.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Overview Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/60 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
            <div className="space-y-6">
              <div className="inline-block text-secondary font-bold text-xs uppercase tracking-widest">
                Comprehensive Engineering Overview
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins text-primary leading-tight">
                Architected for Business Scalability & Performance
              </h2>
              {service.overview.map((para, i) => (
                <p key={i} className="text-slate-600 text-base leading-relaxed">
                  {para}
                </p>
              ))}

              {service.techStack && (
                <div className="pt-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Technologies & Frameworks We Leverage
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Quotation Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 text-primary font-bold text-lg mb-2">
                <ShieldCheck className="text-secondary" size={24} />
                <span>The Averqon Promise</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Enterprise delivery standards backed by transparent project milestones and direct senior engineering access.
              </p>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>100% bespoke source code ownership</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Zero hidden vendor lock-in or recurring per-user fees</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Strict NDA and data confidentiality</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Dedicated technical project manager</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full py-3.5 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Discuss Your Project</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features & Business Benefits */}
      <section className="py-24 bg-white px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">
              Capabilities & Architectural Value
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">
              Engineered with Enterprise Precision
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              Every system we deliver is engineered to solve core business bottlenecks, accelerate workflows, and maintain operational integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.keyFeatures.map((feat, i) => {
              const IconComp = iconMap[feat.icon] || Cpu;
              return (
                <div
                  key={i}
                  className="rounded-3xl p-8 bg-slate-50 border border-slate-100 hover:border-secondary/30 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-13 h-13 rounded-2xl bg-white group-hover:bg-primary text-secondary group-hover:text-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 transition-colors">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Development Process */}
      {service.process && (
        <section className="py-24 bg-slate-900 text-white px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-2xl mb-16">
              <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">
                Proven Delivery Methodology
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-white">
                How We Execute Your Project
              </h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base">
                From initial technical discovery to production deployment and long-term SLA support, our structured milestones ensure timely and transparent execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {service.process.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-secondary/40 transition-colors"
                >
                  <div className="text-3xl font-extrabold text-secondary font-poppins mb-4 opacity-80">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Target Industries & Real Use Cases */}
      {service.useCases && (
        <section className="py-24 bg-slate-50 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">
                Target Industries & Applied Scenarios
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">
                Where Our Engineering Delivers Impact
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.useCases.map((useCase, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-3">
                    {useCase.industry}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{useCase.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{useCase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {service.faqs && (
        <section className="py-24 bg-white px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">
                Got Questions?
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-primary bg-slate-50/50 hover:bg-slate-50 transition-colors"
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
                          className="p-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white"
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

      {/* Internal Linking: Related Services and Relevant Products */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Connected Ecosystem</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-poppins">Related Services & Products</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Related Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Related Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.relatedServices && service.relatedServices.map((relKey) => {
                  const relServ = servicesData[relKey];
                  if (!relServ) return null;
                  return (
                    <Link
                      key={relKey}
                      to={relServ.path}
                      className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-secondary hover:shadow-md transition-all group block"
                    >
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{relServ.heroBadge || relServ.h1}</span>
                        <ArrowUpRight size={14} className="text-slate-400 group-hover:text-secondary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{relServ.tagline}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Relevant Products */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Relevant Software Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.relatedProducts && service.relatedProducts.map((prodKey) => {
                  const prod = productsData[prodKey];
                  if (!prod) return null;
                  return (
                    <Link
                      key={prodKey}
                      to={prod.path}
                      className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-secondary hover:shadow-md transition-all group block"
                    >
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{prod.h1}</span>
                        <ArrowUpRight size={14} className="text-slate-400 group-hover:text-secondary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{prod.tagline}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strong Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary via-[#003d7a] to-primary text-white text-center px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
          <p className="text-secondary font-bold text-xs uppercase tracking-widest">Start Your Technical Journey</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins leading-tight">
            Ready to Build or Scale Your Software Infrastructure?
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tell us about your technical goals, timeline, and architectural requirements. Our engineering leads will provide a clear technical roadmap and fixed-cost quotation.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="h-13 px-8 bg-secondary hover:bg-white hover:text-primary text-white font-bold rounded-full transition-all duration-300 shadow-xl flex items-center gap-2"
            >
              <span>Get Free Quotation</span>
              <ArrowRight size={16} />
            </button>

            <Link
              to="/contact"
              className="h-13 px-8 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Contact Direct Office</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reusable Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        defaultItemName={service.h1}
        isProduct={false}
      />
    </div>
  );
}
