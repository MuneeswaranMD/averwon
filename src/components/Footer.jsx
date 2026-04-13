import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home',             path: '/' },
    { label: 'About Us',         path: '/about' },
    { label: 'Services',         path: '/services' },
    { label: 'Portfolio',        path: '/projects' },
    { label: 'Billing Software', path: '/billing' },
    { label: 'Careers',          path: '/careers' },
    { label: 'Get In Touch',      path: '/contact' },
    { label: 'Support',          path: '/support' },
  ];

  const services = [
    'Web Design',
    'Web Development',
    'Digital Marketing',
    'Graphic Design',
  ];

  return (
    <footer className="bg-slate-50 text-primary pt-20 pb-10 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">

          {/* ── Brand ── */}
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Averqon Logo" className="h-12 w-auto object-contain" />
              <span className="text-2xl font-bold text-primary tracking-tight">Averqon</span>
            </Link>
            <p className="text-grayText leading-relaxed text-base">
              We build visual experiences and robust digital solutions for brands that want to grow in the digital age.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i} href="#"
                  className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-primary/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-primary/50">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-primary/80 font-semibold hover:text-primary group flex items-center gap-1.5 transition-all text-sm"
                  >
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-primary/50">Services</h4>
            <ul className="space-y-3">
              {services.map((s, i) => (
                <li key={i}>
                  <Link
                    to="/services"
                    className="text-primary/80 font-semibold hover:text-primary group flex items-center gap-1.5 transition-all text-sm"
                  >
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info ── */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-primary/50">Contact Info</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-primary/60" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-1">Location</p>
                  <p className="text-primary/80 font-semibold text-sm">Chennai, India</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={16} className="text-primary/60" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-1">Email</p>
                  <a
                    href="mailto:averqon.hr@averqon.in"
                    className="text-primary/80 font-semibold text-sm hover:text-primary transition-colors"
                  >
                    averqon.hr@averqon.in
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-primary/40 font-semibold text-sm">
            © {currentYear} Averqon Technologies. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Security'].map((item, i) => (
              <a
                key={i} href="#"
                className="text-primary/40 text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
