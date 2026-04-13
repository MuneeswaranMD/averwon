import React from 'react';
import AboutSection from '../components/AboutSection';
import WhyChooseUs from '../components/WhyChooseUs';
import TeamSection from '../components/TeamSection';
import CTASection from '../components/CTASection';

const About = () => {
  return (
    <div className="overflow-x-hidden pt-20">
      <AboutSection />
      <WhyChooseUs />
      <TeamSection />
      <CTASection />
    </div>
  );
};

export default About;
