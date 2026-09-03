import React from 'react';
import useSEO from '../hooks/useSEO';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';

const Services = () => {
  useSEO({
    title: 'Our Services | Custom Software, SaaS & AI Development — Averqon',
    description:
      'Averqon offers custom software development, SaaS products, web applications, AI solutions, cloud services, and UI/UX design for businesses across India.',
    canonical: 'https://averqon.in/services',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://averqon.in/services#service',
      name: 'Software & AI Development Services',
      url: 'https://averqon.in/services',
      provider: { '@id': 'https://averqon.in/#organization' },
      description:
        'Custom software development, SaaS products, web applications, AI solutions, cloud services and UI/UX design.',
      areaServed: { '@type': 'Country', name: 'India' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Averqon Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Software Development',
              url: 'https://averqon.in/services/software-development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'SaaS Development',
              url: 'https://averqon.in/services/saas-development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Web Application Development',
              url: 'https://averqon.in/services/web-application-development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Development & Integration',
              url: 'https://averqon.in/services/ai-development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Cloud Services',
              url: 'https://averqon.in/services/cloud-services',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'UI/UX Design',
              url: 'https://averqon.in/services/ui-ux-design',
            },
          },
        ],
      },
    },
  });

  return (
    <div className="overflow-x-hidden pt-20">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20 text-center px-6">
        <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">What We Offer</p>
        <h1
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="text-5xl md:text-6xl font-black text-primary mb-6"
        >
          Our <span className="text-secondary">Services</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          End-to-end technology solutions engineered to accelerate your business and fuel sustainable growth.
        </p>
      </div>

      <ServicesSection />
      <WhyChooseUs />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Services;
