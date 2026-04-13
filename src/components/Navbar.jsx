import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home',     path: '/' },
    { name: 'About',    path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Careers',  path: '/careers' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <img
            src="/logo.png"
            alt="Averqon Logo"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
           <h1 className="text-2xl font-bold text-primary tracking-tight">Averqon</h1>
        </Link>
       

        {/* ── Desktop Nav ── */}
        <div className="hidden lg:flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-[0_4px_16px_rgba(0,51,102,0.3)]'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── CTA Button ── */}
        <Link
          to="/contact"
          className="hidden lg:inline-flex items-center gap-2 px-6 h-11 rounded-full bg-secondary text-white font-bold text-sm tracking-wide hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,123,255,0.35)] transition-all duration-300 flex-shrink-0"
        >
          Get In Touch
          <span className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
            <ArrowUpRight size={13} />
          </span>
        </Link>

        {/* ── Mobile Hamburger ── */}
        <button
          className="lg:hidden w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-primary hover:bg-slate-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-5 py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-primary hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-100 mt-2">
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-secondary text-white font-bold text-base hover:bg-primary transition-colors"
                >
                  Get In Touch <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
