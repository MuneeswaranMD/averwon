import React from 'react';
import useSEO from '../hooks/useSEO';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

const Projects = () => {
  useSEO({
    title: 'Our Work | Software & AI Projects — Averqon',
    description:
      'Explore Averqon\'s portfolio of custom software, web applications, SaaS platforms, and AI solutions built for businesses across India.',
    canonical: 'https://averqon.in/projects',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': 'https://averqon.in/projects#webpage',
      url: 'https://averqon.in/projects',
      name: 'Our Work | Software & AI Projects — Averqon',
      description:
        'Portfolio of custom software, web applications, SaaS platforms, and AI solutions built by Averqon.',
      isPartOf: { '@id': 'https://averqon.in/#organization' },
    },
  });

  return (
    <div className="overflow-x-hidden pt-20">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20 text-center px-6">
        <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Our Work</p>
        <h1
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="text-5xl md:text-6xl font-black text-primary mb-6"
        >
          Featured <span className="text-secondary">Projects</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          Explore how we've helped businesses across industries build transformative digital products.
        </p>
      </div>

      <PortfolioSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Projects;
