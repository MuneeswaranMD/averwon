import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Share2,
  BookOpen,
  CheckCircle2,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/SEO/Breadcrumbs';
import QuoteModal from '../components/SEO/QuoteModal';
import { blogArticlesData, companyInfo, productsData, servicesData } from '../data/seoData';
import { trackWhatsAppClick } from '../utils/analytics';

export default function BlogPost() {
  const { slug } = useParams();
  const article = blogArticlesData[slug];
  const [openFaq, setOpenFaq] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!article) {
    return (
      <div className="pt-32 pb-24 text-center container mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-800">Article Not Found</h1>
        <p className="mt-3 text-slate-500">The guide you are looking for may have been moved or updated.</p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back to All Guides</span>
        </Link>
      </div>
    );
  }

  // Article & FAQ Schemas
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${companyInfo.siteUrl}/blog/${slug}#article`,
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${companyInfo.siteUrl}/blog/${slug}`
    },
    author: {
      '@type': 'Organization',
      name: article.author || 'Averqon Engineering Team',
      url: companyInfo.siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: companyInfo.name,
      url: companyInfo.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: companyInfo.logo
      }
    }
  };

  const faqSchema = article.faqs && article.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  } : null;

  useSEO({
    title: `${article.title} | Averqon`,
    description: article.metaDescription,
    keywords: article.keywords || [article.primaryKeyword, ...(article.secondaryKeywords || [])],
    canonical: `${companyInfo.siteUrl}/blog/${slug}`,
    schema: faqSchema ? [articleSchema, faqSchema] : articleSchema,
    breadcrumbs: [
      { name: 'Blog', path: '/blog' },
      { name: article.title, path: `/blog/${slug}` }
    ]
  });

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Convert custom markdown in content to structured sections
  const renderFormattedContent = (contentString) => {
    const sections = contentString.split('\n---\n');

    return sections.map((section, secIdx) => {
      const lines = section.trim().split('\n');

      return (
        <div key={secIdx} className="mb-10 space-y-4">
          {lines.map((line, lineIdx) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('### ')) {
              const headingText = trimmed.replace('### ', '');
              const anchorId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <h2
                  key={lineIdx}
                  id={anchorId}
                  className="text-2xl sm:text-3xl font-bold font-poppins text-slate-900 pt-6 scroll-mt-28"
                >
                  {headingText}
                </h2>
              );
            }

            if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ') || trimmed.startsWith('5. ')) {
              return (
                <div key={lineIdx} className="flex items-start gap-3 my-2 text-slate-700 text-sm sm:text-base leading-relaxed pl-2">
                  <div className="w-6 h-6 rounded-full bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {trimmed.slice(0, 1)}
                  </div>
                  <div>
                    {renderInlineFormatting(trimmed.slice(3))}
                  </div>
                </div>
              );
            }

            if (trimmed.startsWith('- ')) {
              return (
                <div key={lineIdx} className="flex items-start gap-3 my-2 text-slate-700 text-sm sm:text-base leading-relaxed pl-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-2.5" />
                  <div>
                    {renderInlineFormatting(trimmed.replace('- ', ''))}
                  </div>
                </div>
              );
            }

            if (trimmed.startsWith('|')) {
              // Basic table parser
              if (trimmed.includes('---')) return null; // separator row
              const cells = trimmed.split('|').filter(c => c.trim().length > 0).map(c => c.trim());
              return (
                <div key={lineIdx} className="overflow-x-auto my-4">
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium">
                    {cells.map((cell, cIdx) => (
                      <div key={cIdx} className={cIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-700'}>
                        {renderInlineFormatting(cell)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (trimmed.length === 0) return null;

            return (
              <p key={lineIdx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {renderInlineFormatting(trimmed)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Helper to parse markdown links [text](/url) and bold **text**
  const renderInlineFormatting = (text) => {
    // Regex matches [link text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseBold(text.substring(lastIndex, match.index)));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <Link
          key={match.index}
          to={linkUrl}
          className="text-primary hover:text-secondary font-semibold underline underline-offset-4 decoration-secondary/50 transition-colors"
        >
          {linkText}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(parseBold(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : parseBold(text);
  };

  const parseBold = (str) => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  const breadcrumbItems = [
    { name: 'Blog', path: '/blog' },
    { name: article.title, path: `/blog/${slug}` }
  ];

  return (
    <div className="overflow-x-hidden pt-20 bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50/80 border-b border-slate-100">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Article Header */}
      <article className="py-12 lg:py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-primary text-xs font-bold uppercase tracking-wider">
              <Tag size={13} className="text-secondary" />
              <span>{article.category}</span>
            </span>

            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar size={13} className="text-slate-400" />
              <span>{article.publishDate}</span>
            </span>

            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock size={13} className="text-slate-400" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium mb-8 pb-8 border-b border-slate-200">
            {article.excerpt}
          </p>

          {/* Author & Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                AQ
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{article.author || 'Averqon Engineering Team'}</div>
                <div className="text-xs text-slate-400">Technical Insights & Engineering</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Share article link"
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-secondary transition-colors"
              >
                <span>Consult Engineering Lead</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Table of Contents */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200/80 mb-12">
              <div className="flex items-center gap-2 text-sm font-bold font-poppins text-slate-900 mb-4">
                <BookOpen size={16} className="text-secondary" />
                <span>Table of Contents</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {article.tableOfContents.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    <a
                      href={`#${item.id}`}
                      className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Article Content */}
          <div className="prose prose-slate max-w-none">
            {renderFormattedContent(article.content)}
          </div>

          {/* FAQs Section */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200">
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-slate-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {article.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-primary transition-colors text-sm sm:text-base"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={18}
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
          )}

          {/* Connected Solutions / Internal Links */}
          <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Related Products */}
            {article.relatedProducts && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Featured Software Solutions
                </h3>
                {article.relatedProducts.slice(0, 2).map((pKey) => {
                  const prod = productsData[pKey];
                  if (!prod) return null;
                  return (
                    <Link
                      key={pKey}
                      to={prod.path}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-secondary transition-all block group"
                    >
                      <div className="text-sm font-bold text-slate-900 group-hover:text-primary flex items-center justify-between">
                        <span>{prod.h1}</span>
                        <ArrowUpRight size={14} className="text-slate-400 group-hover:text-secondary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{prod.tagline}</p>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Related Services */}
            {article.relatedServices && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Custom Engineering Services
                </h3>
                {article.relatedServices.slice(0, 2).map((sKey) => {
                  const serv = servicesData[sKey];
                  if (!serv) return null;
                  return (
                    <Link
                      key={sKey}
                      to={serv.path}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-secondary transition-all block group"
                    >
                      <div className="text-sm font-bold text-slate-900 group-hover:text-primary flex items-center justify-between">
                        <span>{serv.heroBadge || serv.h1}</span>
                        <ArrowUpRight size={14} className="text-slate-400 group-hover:text-secondary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{serv.tagline}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action CTA Banner */}
          <div className="mt-14 rounded-3xl bg-gradient-to-r from-primary to-[#003d7a] p-8 sm:p-10 text-white text-center shadow-xl space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold font-poppins">
              Have questions about your software architecture?
            </h3>
            <p className="text-slate-200 text-sm max-w-xl mx-auto leading-relaxed">
              Schedule a 30-minute technical consultation with our senior engineers. We will analyze your workflows and outline practical solutions.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="h-12 px-6 bg-secondary hover:bg-white hover:text-primary text-white font-bold text-xs sm:text-sm rounded-full transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Request Free Consultation</span>
                <ArrowRight size={15} />
              </button>
              <a
                href="https://wa.me/919176477943?text=Hi%20Averqon,%20I%20read%20your%20article%20and%20want%20to%20consult%20on%20software%20solutions."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(`blog_${slug}`)}
                className="h-12 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-full border border-white/20 transition-all flex items-center gap-2"
              >
                <PhoneCall size={14} className="text-emerald-400" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        defaultItemName={`Consultation: ${article.title}`}
        isProduct={false}
      />
    </div>
  );
}
