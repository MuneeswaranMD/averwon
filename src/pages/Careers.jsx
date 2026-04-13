import React from 'react';
import CareersSection from '../components/CareersSection';
import CTASection from '../components/CTASection';

const Careers = () => {
  return (
    <div className="overflow-x-hidden pt-20">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20 text-center px-6">
        <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Join the Team</p>
        <h1
          style={{ fontFamily: 'Poppins, sans-serif' }}
          className="text-5xl md:text-6xl font-black text-primary mb-6"
        >
          Work at the Edge of <span className="text-secondary">Innovation</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          Join a team of passionate builders, designers, and strategists creating the future of technology.
        </p>
      </div>

      <CareersSection />
      <CTASection />
    </div>
  );
};

export default Careers;
