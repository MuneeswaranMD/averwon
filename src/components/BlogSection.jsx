import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, ArrowUpRight, Clock } from 'lucide-react';

const featuredPosts = [
  {
    slug: 'how-to-choose-best-pos-software',
    title: 'How to Choose the Best POS Software for Your Business in India',
    category: 'Retail & POS',
    date: 'Feb 15, 2026',
    readTime: '7 min read',
    desc: 'A complete practical guide on selecting the right Point of Sale software for retail and wholesale. Speed, GST compliance, and offline mode.',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'custom-software-development-small-business',
    title: 'Custom Software Development for Small Businesses: When & Why',
    category: 'Software Engineering',
    date: 'Feb 25, 2026',
    readTime: '8 min read',
    desc: 'When should a growing business invest in custom software instead of buying off-the-shelf SaaS? Cost analysis, IP ownership, and scalability.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'ai-automation-improve-business-operations',
    title: 'How AI Automation Can Improve Business Operations in 2026',
    category: 'Artificial Intelligence',
    date: 'Mar 12, 2026',
    readTime: '7 min read',
    desc: 'Beyond the marketing hype: practical AI implementations for automated invoice parsing, customer support, and inventory forecasting.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  }
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-24 md:py-32 bg-white relative">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Latest Insights</h4>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8 leading-tight font-poppins">
                Stay Ahead of <span className="text-secondary">Technology</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Objective technical analysis, software buying guides, and operational strategies from the Averqon engineering team.
              </p>
            </motion.div>
          </div>
          <Link
            to="/blog"
            aria-label="View all blog articles"
            className="inline-flex items-center gap-3 px-8 h-14 rounded-full border-2 border-secondary text-secondary font-bold text-sm tracking-wide hover:bg-secondary hover:text-white hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,123,255,0.25)] transition-all duration-300 flex-shrink-0"
          >
            <span>View All Guides</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group flex flex-col h-full rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-secondary/30 hover:bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-[2rem]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl text-xs font-bold text-primary shadow-sm flex items-center gap-1.5">
                  <Tag size={12} className="text-secondary" aria-hidden="true" /> {post.category}
                </div>
              </div>
              
              <div className="p-8 pt-2 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-secondary" aria-hidden="true" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold font-poppins text-primary mb-4 group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 text-sm">
                  {post.desc}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <Link
                    to={`/blog/${post.slug}`}
                    aria-label={`Read guide: ${post.title}`}
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm group/btn hover:text-secondary transition-colors"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
