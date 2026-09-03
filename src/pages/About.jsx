import React from 'react';
import useSEO from '../hooks/useSEO';
import AboutSection from '../components/AboutSection';
import WhyChooseUs from '../components/WhyChooseUs';
import CTASection from '../components/CTASection';

const About = () => {
  useSEO({
    title: 'About Averqon | Software & AI Company in Coimbatore, India',
    description:
      'Learn about Averqon — our mission, team, and how we help businesses across India grow with custom software, AI solutions, and SaaS products.',
    canonical: 'https://averqon.in/about',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': 'https://averqon.in/about#webpage',
      url: 'https://averqon.in/about',
      name: 'About Averqon | Software & AI Company in Coimbatore, India',
      description:
        'Learn about Averqon — our mission, team, and how we help businesses across India grow with custom software, AI solutions, and SaaS products.',
      isPartOf: { '@id': 'https://averqon.in/#organization' },
    },
  });

  return (
    <div className="overflow-x-hidden pt-20">
      <AboutSection />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
};

export default About;
