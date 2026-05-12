import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Careers', path: '/careers' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <div
          className={`flex w-full items-center justify-between border px-4 transition-all duration-300 lg:px-5 ${
            isScrolled
              ? 'border-slate-200 bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl'
              : 'border-white/70 bg-white/78 shadow-[0_14px_42px_rgba(15,23,42,0.07)] backdrop-blur-lg'
          } rounded-[26px] py-3`}
        >
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Averqon home">
            <img
              src="/logo.png"
              alt="Averqon Logo"
              className="h-10 w-10 flex-shrink-0 object-contain"
            />
            <span className="font-poppins text-xl font-extrabold text-primary sm:text-2xl">
              Averqon
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/support"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary"
            >
              Support
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-[0_16px_34px_rgba(0,51,102,0.25)] transition-transform hover:-translate-y-0.5"
            >
              Start a Project
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="absolute left-0 right-0 top-full px-5 sm:px-6 lg:hidden"
          >
            <div className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
              <nav className="grid gap-1 p-3" aria-label="Mobile navigation">
                {[...navLinks, { name: 'Support', path: '/support' }].map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`rounded-2xl px-4 py-3 text-base font-bold transition-colors ${
                        isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <Link
                  to="/contact"
                  className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-bold text-white"
                >
                  Start a Project
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
