import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const linkGroups = [
    {
      title: 'Company',
      links: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Services', path: '/services' },
        { label: 'Projects', path: '/projects' },
        { label: 'Billing Software', path: '/billing' },
        { label: 'Support', path: '/support' },
      ],
    },
  ];

  const capabilities = [
    'Enterprise Software',
    'AI Automation',
    'Cloud Platforms',
    'Secure Operations',
  ];

  const socials = [
    { label: 'LinkedIn', Icon: Linkedin },
    { label: 'Twitter', Icon: Twitter },
    { label: 'Facebook', Icon: Facebook },
    { label: 'Instagram', Icon: Instagram },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#071827] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent" />

      <div className="container mx-auto px-6 py-16 lg:px-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="space-y-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                <img src="/logo.png" alt="Averqon Logo" className="h-10 w-auto object-contain" />
              </span>
              <span className="text-3xl font-bold tracking-tight">Averqon</span>
            </Link>

            <div className="max-w-2xl space-y-5">
              <p className="text-3xl font-bold leading-tight text-white md:text-5xl">
                Digital products built with clarity, speed, and real business intent.
              </p>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                We design and engineer software, automation, cloud platforms, and support systems for teams that need technology to move work forward.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-200"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">Start something useful</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight">Have a project that needs momentum?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Tell us what you are building. We will help shape the right technical path and a practical next step.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-secondary px-6 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-primary"
            >
              Talk to Averqon
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-y border-white/10 py-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.35fr]">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{group.title}</h3>
              <ul className="mt-5 grid gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Reach us</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href="mailto:averqonhq@gmail.com"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-200 transition-colors hover:border-secondary/60 hover:text-white"
              >
                <Mail size={18} className="text-secondary flex-shrink-0" />
                averqonhq@gmail.com
              </a>
              <a
                href="mailto:hr@averqon.in"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-200 transition-colors hover:border-secondary/60 hover:text-white"
              >
                <Mail size={18} className="text-secondary flex-shrink-0" />
                hr@averqon.in
              </a>
              <a
                href="tel:+918300864083"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-200 transition-colors hover:border-secondary/60 hover:text-white"
              >
                <Phone size={18} className="text-secondary flex-shrink-0" />
                +91 8300864083
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-200">
                <MapPin size={18} className="text-secondary flex-shrink-0" />
                Coimbatore, Tamil Nadu
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold text-slate-500">
            &copy; {currentYear} Averqon Technologies. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {socials.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-white"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
