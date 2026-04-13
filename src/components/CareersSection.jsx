import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowUpRight, Search } from 'lucide-react';
import { Button } from './ui/button';

const CareersSection = () => {
  const jobs = [
    {
      title: 'Senior Full Stack Developer',
      type: 'Full-time',
      location: 'Remote / Bangalore',
      icon: <Briefcase />
    },
    {
      title: 'UI/UX Designer',
      type: 'Full-time',
      location: 'Hybrid / Mumbai',
      icon: <Clock />
    },
    {
      title: 'AI/ML Engineer',
      type: 'Full-time',
      location: 'Remote',
      icon: <Briefcase />
    },
    {
      title: 'DevOps Engineer',
      type: 'Contract',
      location: 'Remote / Hyderabad',
      icon: <Clock />
    }
  ];

  return (
    <section id="careers" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Join the Future</h4>
              <h2 className="text-4xl lg:text-6xl font-bold text-primary mb-8 leading-tight">
                Work at the Edge of <span className="text-secondary">Innovation</span>
              </h2>
              <p className="text-grayText text-lg leading-relaxed">
                We're a team of thinkers, makers, and innovators. Join us in building technology that defines the next decade of digital experiences.
              </p>
            </motion.div>
          </div>
          
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 h-14 rounded-full bg-secondary text-white font-bold text-sm tracking-wide hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,123,255,0.35)] transition-all duration-300 flex-shrink-0"
          >
            Search Openings
            <Search size={18} />
          </a>
        </div>

        <div className="grid gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group p-8 md:p-12 rounded-[3.5rem] bg-slate-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  {React.cloneElement(job.icon, { size: 28, className: "group-hover:scale-110 transition-transform" })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-6 text-sm text-grayText font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Clock size={16} className="text-secondary" /> {job.type}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-accent" /> {job.location}</span>
                  </div>
                </div>
              </div>
              
              <a
                href="#"
                className="inline-flex items-center gap-2 px-7 h-12 rounded-full border-2 border-secondary/30 text-secondary font-bold text-sm hover:bg-secondary hover:text-white hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,123,255,0.25)] transition-all duration-300 flex-shrink-0"
              >
                Apply Now <ArrowUpRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA for Careers */}
        <div className="mt-16 text-center">
           <p className="text-grayText font-medium">
             Don't see the right role? <span className="text-secondary font-bold cursor-pointer hover:underline">Contact our recruitment team</span>
           </p>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
