import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-slate-50">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto rounded-[4rem] bg-white border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-10 md:p-20 text-center relative overflow-hidden">
          {/* Internal Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-accent"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary leading-tight">
              Ready to <span className="text-secondary">Transform</span> <br />
              Your Digital Future?
            </h2>
            
            <p className="text-xl text-grayText max-w-3xl mx-auto leading-relaxed">
              Partner with Averqon to build scalable, AI-driven solutions that position your business at the forefront of innovation. Let's create something extraordinary together.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-10 h-16 rounded-full bg-secondary text-white font-bold text-base tracking-wide hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,123,255,0.4)] transition-all duration-300"
              >
                Start a Conversation
                <span className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                  <ArrowRight size={16} />
                </span>
              </a>
              <a
                href="https://calendly.com/muneeswaranmd2004/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 h-16 rounded-full bg-white border-2 border-secondary/20 text-primary font-bold text-base tracking-wide hover:border-secondary hover:text-secondary hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,123,255,0.15)] transition-all duration-300"
              >
                <Calendar className="w-5 h-5 text-secondary" />
                Book a Strategy Call
              </a>
            </div>

            {/* Trust Badges or Micro-copy */}
            <div className="pt-10 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="text-primary font-bold tracking-widest text-xs uppercase italic select-none line-through decoration-secondary underline-offset-4 decoration-2">Innovation</span>
               <span className="text-primary font-bold tracking-widest text-xs uppercase italic select-none">Excellence</span>
               <span className="text-primary font-bold tracking-widest text-xs uppercase italic select-none">Integrity</span>
               <span className="text-primary font-bold tracking-widest text-xs uppercase italic select-none">Solutions</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
