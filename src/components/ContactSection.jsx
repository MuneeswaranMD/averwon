import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Mail />,
      label: 'Email Us',
      values: ['averqon.hr@averqon.in'],
      color: 'bg-secondary/10 text-secondary'
    },
    {
      icon: <MapPin />,
      label: 'Our Base',
      values: ['Coimbatore, Tamil Nadu'],
      color: 'bg-primary/10 text-primary'
    }
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Side: Info */}
          <div className="flex-1 space-y-12">
            <div>
              <motion.h4 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-secondary font-bold uppercase tracking-widest text-sm mb-4"
              >
                Get In Touch
              </motion.h4>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight"
              >
                Let's Create <span className="text-secondary">Together</span>
              </motion.h2>
              <p className="text-grayText text-lg max-w-lg leading-relaxed">
                Have a vision or a challenge? We're here to help you navigate the digital landscape with custom engineering and AI solutions.
              </p>
            </div>

            <div className="grid sm:grid-cols-1 gap-8">
              {contactInfo.map((info, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start group"
                >
                  <div className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {React.cloneElement(info.icon, { size: 28 })}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{info.label}</h4>
                    {info.values.map((val, idx) => (
                      <p key={idx} className="text-xl font-bold text-primary hover:text-secondary transition-colors cursor-pointer">{val}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Business Hours Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-10 bg-primary rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h4 className="text-2xl font-bold">Global Presence</h4>
              </div>
              <div className="space-y-4 opacity-90 font-medium text-lg">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="opacity-60 italic text-sm">Mon - Fri</span>
                  <span className="font-bold">9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="opacity-60 italic text-sm">Saturday</span>
                  <span className="font-bold">10:00 AM - 4:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60 italic text-sm">Sunday</span>
                  <span className="text-accent font-bold uppercase tracking-widest text-sm">Limited Support</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 lg:max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-slate-50 p-8 md:p-14 rounded-[4rem] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-primary mb-2">Send us a Message</h3>
                <p className="text-grayText">We usually respond within 2-4 business hours.</p>
              </div>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider px-2">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all font-medium text-primary shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider px-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john@company.com" 
                      className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all font-medium text-primary shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider px-2">I'm Interested In</label>
                  <select className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all font-medium text-primary shadow-sm appearance-none cursor-pointer">
                    <option>Web Development</option>
                    <option>Mobile Application</option>
                    <option>AI & Automation</option>
                    <option>Software Consulting</option>
                    <option>Other Services</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider px-2">Project Details</label>
                  <textarea 
                    rows="4" 
                    placeholder="Tell us about what you're looking to build..." 
                    className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all font-medium text-primary shadow-sm resize-none"
                  ></textarea>
                </div>
                <Button className="w-full h-18 py-6 rounded-3xl bg-secondary hover:bg-primary text-white text-lg font-bold shadow-2xl shadow-secondary/20 transition-all flex items-center justify-center gap-3 group">
                  Send Your Inquiry
                  <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
