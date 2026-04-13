import React from 'react';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';

const Services = () => {
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
