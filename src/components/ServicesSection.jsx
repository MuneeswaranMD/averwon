import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Smartphone, 
  Palette, 
  Brain, 
  Cloud, 
  Link, 
  Database, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { services } from '../data/mock';

const iconMap = {
  Globe,
  Smartphone,
  Palette,
  Brain,
  Cloud,
  Link,
  Database,
  Lightbulb
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">What We Offer</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Our <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Digital Expertise</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tailored technology solutions designed to empower your business and drive innovation across every digital touchpoint.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-secondary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 flex flex-col items-start h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-accent transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                  <IconComponent className="w-8 h-8 text-secondary group-hover:text-white transition-colors duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-secondary transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-secondary font-bold group/btn cursor-pointer mt-auto">
                  <span className="text-sm uppercase tracking-wider">Learn More</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
