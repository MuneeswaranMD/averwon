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
    title: 'Averqon | Software Development & AI Solutions in Coimbatore',
    description:
      'Averqon builds custom software, web applications, SaaS platforms and AI solutions for growing businesses and startups in India.',
    canonical: 'https://averqon.in/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://averqon.in/#webpage',
      url: 'https://averqon.in/',
      name: 'Averqon | Software Development & AI Solutions in Coimbatore',
      description:
        'Averqon builds custom software, web applications, SaaS platforms and AI solutions for growing businesses and startups in India.',
      isPartOf: { '@id': 'https://averqon.in/#organization' },
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
