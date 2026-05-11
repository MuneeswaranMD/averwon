import React from 'react';
import AboutSection from '../components/AboutSection';
import WhyChooseUs from '../components/WhyChooseUs';
import CTASection from '../components/CTASection';

const About = () => {
  return (
    <div className="overflow-x-hidden pt-20">
      <AboutSection />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
};

export default About;
