import React from 'react';
import useSEO from '../hooks/useSEO';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BlogSection from '../components/BlogSection';
import CTASection from '../components/CTASection';
import ContactSection from '../components/ContactSection';

const Home = () => {
  useSEO({
    title: 'Averqon | Digital Agency & Software Development Company India',
    description:
      'Averqon is a digital agency and software development company building custom software, retail POS systems, enterprise ERP, web apps, and AI solutions in India.',
    canonical: 'https://www.averqon.in/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://www.averqon.in/#webpage',
      url: 'https://www.averqon.in/',
      name: 'Averqon | Digital Agency & Software Development Company India',
      description:
        'Averqon is a digital agency and software development company building custom software, retail POS systems, enterprise ERP, web apps, and AI solutions in India.',
      isPartOf: { '@id': 'https://www.averqon.in/#organization' },
    },
  });

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <PortfolioSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
      <ContactSection />
    </div>
  );
};

export default Home;
