import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Award, HeadphonesIcon, TrendingUp } from 'lucide-react';
import { stats } from '../data/mock';

const iconMap = {
  0: TrendingUp,
  1: Users,
  2: Award,
  3: HeadphonesIcon
};

const Counter = ({ target, suffix, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="py-24 md:py-32 bg-slate-50 relative overflow-hidden"
    >
      {/* Soft Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-24 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Our Track Record</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Why Choose <span className="text-secondary">Averqon</span>
            </h2>
            <p className="text-lg text-grayText max-w-2xl mx-auto leading-relaxed">
              Trusted by startups and enterprises worldwide for exceptional engineering and innovative digital solutions.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[index] || CheckCircle2;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-secondary/30 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <Counter target={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                  </div>
                  <div className="text-grayText font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Expert Team',
              description: 'Our engineers bring decades of collective experience in building high-stakes digital products.',
              icon: Users
            },
            {
              title: 'Proven Success',
              description: 'We have successfully delivered complex projects spanning multiple tech stacks and industries.',
              icon: Award
            },
            {
              title: 'Client Centric',
              description: 'Your growth is our priority. We provide dedicated support and transparent communication at every step.',
              icon: HeadphonesIcon
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-secondary/20 shadow-sm hover:shadow-md transition-all duration-500 group"
            >
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-grayText leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
