import React from 'react';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/SEO/Breadcrumbs';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';
import { companyInfo } from '../data/seoData';

const Services = () => {
  useSEO({
    title: 'Software Development & IT Services Company India | Averqon',
    description:
      'Averqon offers custom software development, web applications, e-commerce, mobile apps, AI automation, cloud devops, and custom ERP systems for businesses across India.',
    canonical: `${companyInfo.siteUrl}/services`,
    breadcrumbs: [{ name: 'Services', path: '/services' }],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${companyInfo.siteUrl}/services#service`,
      name: 'Software & AI Engineering Services',
      url: `${companyInfo.siteUrl}/services`,
      provider: {
        '@type': 'Organization',
        '@id': `${companyInfo.siteUrl}/#organization`,
        name: companyInfo.name,
        url: companyInfo.siteUrl,
        logo: companyInfo.logo,
        telephone: companyInfo.phone,
        email: companyInfo.email
      },
      description:
        'Custom software development, web applications, e-commerce, mobile apps, AI automation, cloud devops, and custom ERP systems.',
      areaServed: { '@type': 'Country', name: 'India' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Averqon Core Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Development', url: `${companyInfo.siteUrl}/website-development` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Software Development', url: `${companyInfo.siteUrl}/software-development` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Application Development', url: `${companyInfo.siteUrl}/web-application-development` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-commerce Development', url: `${companyInfo.siteUrl}/ecommerce-development` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development', url: `${companyInfo.siteUrl}/mobile-app-development` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Development & Automation', url: `${companyInfo.siteUrl}/ai-development` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud & DevOps Engineering', url: `${companyInfo.siteUrl}/cloud-devops` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom ERP Development', url: `${companyInfo.siteUrl}/custom-erp-development` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO Services', url: `${companyInfo.siteUrl}/seo-services` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing', url: `${companyInfo.siteUrl}/digital-marketing` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design', url: `${companyInfo.siteUrl}/ui-ux-design` } }
        ]
      }
    }
  });

  return (
    <div className="overflow-x-hidden pt-20 bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50/80 border-b border-slate-100">
        <Breadcrumbs items={[{ name: 'Services', path: '/services' }]} />
      </div>

      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20 text-center px-6">
        <p className="text-secondary font-bold uppercase tracking-widest text-xs sm:text-sm mb-4">
          End-to-End Technical Capabilities
        </p>
        <h1
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-primary mb-6"
        >
          Our <span className="text-secondary">Services</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Full-lifecycle digital product development, enterprise automation, and cloud architecture engineered for scale.
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
