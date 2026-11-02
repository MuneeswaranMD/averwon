import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Layers, ShoppingBag, BookOpen, PhoneCall } from 'lucide-react';
import useSEO from '../hooks/useSEO';

export default function NotFound() {
  useSEO({
    title: '404 - Page Not Found | Averqon',
    description: 'The page you are looking for does not exist or has been moved.',
    robots: 'noindex, nofollow',
  });

  return (
    <div className="min-h-[75vh] flex items-center justify-center pt-24 pb-16 px-6 bg-slate-50">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 text-primary font-black text-4xl font-poppins shadow-sm">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-poppins text-slate-900 leading-tight">
          Page Not Found
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The link you followed may be broken or the page may have been relocated. Use the links below to find what you are looking for:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
          <Link
            to="/"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-primary hover:shadow-md transition-all group"
          >
            <Home size={18} className="text-secondary mb-2" />
            <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-primary transition-colors">Home</div>
            <div className="text-[11px] text-slate-400">Main Portal</div>
          </Link>

          <Link
            to="/services"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-primary hover:shadow-md transition-all group"
          >
            <Layers size={18} className="text-secondary mb-2" />
            <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-primary transition-colors">Services</div>
            <div className="text-[11px] text-slate-400">11 Offerings</div>
          </Link>

          <Link
            to="/products"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-primary hover:shadow-md transition-all group"
          >
            <ShoppingBag size={18} className="text-secondary mb-2" />
            <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-primary transition-colors">Products</div>
            <div className="text-[11px] text-slate-400">7 Solutions</div>
          </Link>

          <Link
            to="/blog"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-primary hover:shadow-md transition-all group"
          >
            <BookOpen size={18} className="text-secondary mb-2" />
            <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-primary transition-colors">Blog</div>
            <div className="text-[11px] text-slate-400">Guides &amp; Tech</div>
          </Link>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full text-xs sm:text-sm hover:bg-secondary transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full text-xs sm:text-sm hover:bg-slate-100 transition-all"
          >
            <PhoneCall size={15} />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

