import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const faqs = [
    {
      question: "What services does Averqon offer?",
      answer: "Averqon offers a comprehensive suite of technology solutions including Web & Mobile Development, AI & Machine Learning, Cloud Services, Blockchain, ERP/CRM implementations, and Strategic Software Consulting."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on complexity. A standard web application typically takes 8-12 weeks, while larger enterprise systems might take 4-6 months. We follow agile methodologies to deliver value incrementally."
    },
    {
      question: "Do you provide post-launch support?",
      answer: "Yes, we provide 24/7 premium support and dedicated maintenance plans for all our projects to ensure your systems remain secure, updated, and performant."
    },
    {
      question: "What technologies do you work with?",
      answer: "We specialize in modern stacks including React, Node.js, Python/Django, Spring Boot, AWS/Azure, Solidity for Blockchain, and TensorFlow for AI solutions."
    },
    {
      question: "Can you handle enterprise-level projects?",
      answer: "Absolutely. We have extensive experience building scalable, high-availability systems for both fast-growing startups and established global enterprises."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Support & Help</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8">
              Got <span className="text-secondary">Questions?</span> We have Answers.
            </h2>
            <p className="text-lg text-grayText leading-relaxed">
              Find quick answers to common questions about our services, process, and partnership model.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${
                activeIndex === index 
                ? 'bg-white border-secondary shadow-[0_20px_50px_rgba(0,0,0,0.04)]' 
                : 'bg-white border-transparent hover:border-gray-200'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-8 md:p-10 text-left outline-none group"
              >
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-secondary text-white' : 'bg-slate-50 text-secondary group-hover:bg-slate-100'}`}>
                      <HelpCircle size={24} />
                   </div>
                   <span className={`text-xl md:text-2xl font-bold transition-colors ${activeIndex === index ? 'text-primary' : 'text-primary'}`}>
                      {faq.question}
                   </span>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${activeIndex === index ? 'bg-primary border-primary text-white rotate-180' : 'bg-transparent border-gray-200 text-gray-400'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 md:px-10 pb-10 ml-18">
                      <div className="w-full h-px bg-gray-100 mb-8"></div>
                      <p className="text-xl text-grayText leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
