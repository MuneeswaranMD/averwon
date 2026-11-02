import React from 'react';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/SEO/Breadcrumbs';
import CareersSection from '../components/CareersSection';
import CTASection from '../components/CTASection';
import { companyInfo } from '../data/seoData';

export default function Careers() {
  useSEO({
    title: 'Careers at Averqon | Software Engineering & Tech Jobs Chennai',
    description:
      'Join Averqon and build innovative custom software, POS engines, and enterprise ERP solutions. Explore open positions for developers and designers in Chennai, India.',
    canonical: `${companyInfo.siteUrl}/careers`,
    breadcrumbs: [{ name: 'Careers', path: '/careers' }],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${companyInfo.siteUrl}/careers#webpage`,
      url: `${companyInfo.siteUrl}/careers`,
      name: 'Careers at Averqon | Software Engineering & Tech Jobs Chennai',
      description:
        'Open technology roles at Averqon — Full-Stack Engineers, Frontend Developers, DevOps Specialists, and UI/UX Designers in Chennai, India.',
      isPartOf: { '@id': `${companyInfo.siteUrl}/#organization` },
    },
  });

  return (
    <div className="overflow-x-hidden pt-20 bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50/80 border-b border-slate-100">
        <Breadcrumbs items={[{ name: 'Careers', path: '/careers' }]} />
      </div>

      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-blue-50/80 via-white to-white py-20 text-center px-6">
        <span className="text-secondary font-bold uppercase tracking-widest text-xs sm:text-sm block mb-3">
          Join the Engineering Team
        </span>
        <h1
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-primary mb-6"
        >
          Build Software That Moves <span className="text-secondary">Businesses Forward</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          We are engineering the future of retail billing, supply chain automation, and enterprise software. Join a team focused on craftsmanship, high agency, and tangible business impact.
        </p>
      </div>

      <CareersSection />
      <CTASection />
    </div>
  );
}
