import React from 'react';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/SEO/Breadcrumbs';
import AboutSection from '../components/AboutSection';
import WhyChooseUs from '../components/WhyChooseUs';
import CTASection from '../components/CTASection';

const About = () => {
  useSEO({
    title: 'About Averqon | Digital Agency & Software Company India',
    description:
      'Learn about Averqon — our mission, engineering philosophy, and how we help businesses across India scale with custom software, POS systems, and ERP solutions.',
    canonical: 'https://www.averqon.in/about',
    breadcrumbs: [{ name: 'About Us', path: '/about' }],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': 'https://www.averqon.in/about#webpage',
      url: 'https://www.averqon.in/about',
      name: 'About Averqon | Digital Agency & Software Company India',
      description:
        'Learn about Averqon — our mission, engineering philosophy, and how we help businesses across India scale with custom software, POS systems, and ERP solutions.',
      isPartOf: { '@id': 'https://www.averqon.in/#organization' },
    },
  });

  return (
    <div className="overflow-x-hidden pt-20">
      <div className="bg-slate-50/80 border-b border-slate-100">
        <Breadcrumbs items={[{ name: 'About Us', path: '/about' }]} />
      </div>
      <AboutSection />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
};

export default About;
