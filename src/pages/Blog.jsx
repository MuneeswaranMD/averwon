import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  Sparkles,
  User,
  ArrowUpRight
} from 'lucide-react';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/SEO/Breadcrumbs';
import { blogArticlesData, companyInfo } from '../data/seoData';

const categories = [
  'All Guides',
  'Retail & POS',
  'Hospitality',
  'Education & ERP',
  'Software Engineering',
  'Digital Marketing & SEO',
  'E-commerce & Web',
  'Inventory & Retail',
  'Artificial Intelligence'
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All Guides');
  const [searchQuery, setSearchQuery] = useState('');

  const articles = useMemo(() => Object.values(blogArticlesData), []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All Guides' || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  useSEO({
    title: 'Technology & Software Engineering Blog | Averqon',
    description:
      'In-depth engineering guides, retail POS comparisons, ERP architectures, and practical digital growth strategies by the Averqon technical team.',
    canonical: `${companyInfo.siteUrl}/blog`,
    breadcrumbs: [{ name: 'Blog', path: '/blog' }],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Averqon Technology & Engineering Blog',
      description:
        'In-depth engineering guides, retail POS comparisons, ERP architectures, and practical digital growth strategies.',
      url: `${companyInfo.siteUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: companyInfo.name,
        url: companyInfo.siteUrl,
        logo: companyInfo.logo
      }
    }
  });

  return (
    <div className="overflow-x-hidden pt-20 bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50/80 border-b border-slate-100">
        <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }]} />
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071827] via-[#0B2035] to-[#071827] text-white py-20 lg:py-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,123,255,0.18),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs sm:text-sm font-bold tracking-wide uppercase mb-6">
              <Sparkles size={14} className="text-secondary" />
              <span>Averqon Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-poppins text-white leading-tight tracking-tight mb-6">
              Engineering Insights &amp; <span className="text-secondary">Business Technology Guides</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Objective technical analyses, software buyer guides, and operational strategies to help Indian businesses automate workflows and scale sustainably.
            </p>

            {/* Search Input */}
            <div className="max-w-xl mx-auto relative">
              <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles on POS, ERP, Custom Software, SEO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-full text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white/15 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="py-6 bg-slate-50 border-b border-slate-200/80 px-6 sticky top-20 z-20 backdrop-blur-md bg-slate-50/90">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none whitespace-nowrap">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 lg:py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No articles match your search</h3>
              <p className="text-sm text-slate-500 mt-2">Try clearing your search query or selecting a different category.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All Guides');
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2 bg-primary text-white text-xs font-semibold rounded-full"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.slug}
                  className="rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-secondary/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="p-7 sm:p-8 flex flex-col flex-1">
                    {/* Meta Header */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-primary text-[11px] font-bold">
                        <Tag size={12} className="text-secondary" />
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock size={13} />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold font-poppins text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-3">
                      <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6 flex-1">
                      {article.excerpt}
                    </p>

                    {/* Footer Info */}
                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{article.publishDate}</span>
                      </div>

                      <Link
                        to={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary transition-colors group/link"
                        aria-label={`Read guide: ${article.title}`}
                      >
                        <span>Read Guide</span>
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Internal Linking: Featured Services Banner */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Need Expert Implementation?</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-poppins text-primary">From Strategy to Production Code</h3>
            <p className="text-slate-500 text-sm mt-2">
              Our engineering team turns these insights into reliable, customized business software.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/software-development"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-secondary hover:shadow-md transition-all text-center block group"
            >
              <span className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors block">
                Custom Software
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Bespoke Engineering</span>
            </Link>

            <Link
              to="/products/crackers-pos"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-secondary hover:shadow-md transition-all text-center block group"
            >
              <span className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors block">
                Crackers POS
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Diwali Billing Software</span>
            </Link>

            <Link
              to="/custom-erp-development"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-secondary hover:shadow-md transition-all text-center block group"
            >
              <span className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors block">
                Custom ERP
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Enterprise Management</span>
            </Link>

            <Link
              to="/seo-services"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-secondary hover:shadow-md transition-all text-center block group"
            >
              <span className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors block">
                SEO Services
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Organic Search Growth</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

