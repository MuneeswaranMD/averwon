import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award } from 'lucide-react';
import { aboutImages } from '../data/mock';

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To empower businesses through innovative technology solutions that drive digital transformation and sustainable growth.'
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'To be the leading technology partner for enterprises seeking cutting-edge solutions in AI, cloud, and digital innovation.'
    },
    {
      icon: Award,
      title: 'Core Values',
      description: 'Innovation, integrity, excellence, and customer-centricity form the foundation of everything we do.'
    }
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">About Averqon</h4>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Building the Future of <span className="text-secondary">Technology</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We are passionate about leveraging cutting-edge technology to solve complex business challenges with excellence and innovation.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={aboutImages.team}
                alt="Team Collaboration"
                className="w-full h-auto transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            {/* Decorative glass elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -z-10"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Innovating Technology Solutions for Tomorrow's Challenges
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              At Averqon, we deliver scalable solutions that drive measurable results. Our team of expert developers, designers, and consultants is dedicated to bridging the gap between business goals and technical excellence.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              From AI-powered automation to blockchain innovation, our comprehensive suite of services helps businesses stay ahead in the rapidly evolving digital landscape. We don't just build software—we build partnerships.
            </p>
            
            <div className="flex items-center space-x-6 pt-6 border-t border-gray-100 dark:border-white/5">
              <div className="flex -space-x-4">
                {[aboutImages.main, aboutImages.office, aboutImages.team].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Expert ${idx + 1}`}
                    className="w-14 h-14 rounded-full border-4 border-white dark:border-dark object-cover shadow-lg"
                  />
                ))}
              </div>
              <div>
                 <p className="font-bold text-slate-900 text-xl">50+ Experts</p>
                <p className="text-slate-600">Dedicated to your success</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group p-10 rounded-3xl bg-white border border-gray-100 hover:border-secondary/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                 <h4 className="text-2xl font-bold text-slate-900 mb-4">
                  {value.title}
                </h4>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
