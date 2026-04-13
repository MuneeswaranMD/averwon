import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const Support = () => {
  useEffect(() => {
    // Inject HubSpot Forms script if it doesn't exist
    if (!document.getElementById('hs-forms-script')) {
      const script = document.createElement('script');
      script.id = 'hs-forms-script';
      script.src = 'https://js-na2.hsforms.net/forms/embed/245445169.js';
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            region: "na2",
            portalId: "245445169",
            formId: "c8a9e4bc-b295-4b8f-870c-61a9daddf7be",
            target: "#hs-form-container"
          });
        }
      };
    } else if (window.hbspt) {
      window.hbspt.forms.create({
        region: "na2",
        portalId: "245445169",
        formId: "c8a9e4bc-b295-4b8f-870c-61a9daddf7be",
        target: "#hs-form-container"
      });
    }
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      {/* ── Hero Section ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#003366]/5 -skew-y-3 origin-top-left -z-10"></div>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-6">
              Help Center
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-primary mb-6 leading-tight">
              Support <span className="text-secondary">&</span> Ticketing
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Facing an issue or need technical assistance? Raise a support ticket below, and our engineering team will get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: <ShieldCheck className="w-8 h-8"/>, title: 'Priority Support', desc: 'Enterprise-grade response times for all tickets.' },
              { icon: <Clock className="w-8 h-8"/>, title: '24/7 Monitoring', desc: 'Our systems are monitored around the clock.' },
              { icon: <LifeBuoy className="w-8 h-8"/>, title: 'Live Assistance', desc: 'Direct access to Averqon engineers.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-secondary mb-6 italic">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="p-10 md:p-16">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-primary mb-4">Raise a Ticket</h2>
                <p className="text-slate-500">Provide the details of your issue below. Please include screenshots or console logs if possible.</p>
              </div>
              
              {/* HubSpot Form Container */}
              <div id="hs-form-container" className="min-h-[400px]">
                {/* Fallback loading state */}
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                  <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-bold text-primary">Loading Secure Form...</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Support;
