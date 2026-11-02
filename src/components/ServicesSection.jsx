import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Smartphone, 
  Palette, 
  Brain, 
  Cloud, 
  ShoppingCart,
  Database, 
  Search,
  ArrowRight,
  TrendingUp,
  Factory
} from 'lucide-react';

const coreServices = [
  {
    id: 'website-development',
    title: 'Website Development',
    description: 'High-performance, responsive corporate websites and landing pages built with React and Next.js.',
    link: '/website-development',
    icon: Globe
  },
  {
    id: 'software-development',
    title: 'Custom Software Development',
    description: 'Bespoke software architecture, API microservices, and internal workflow automation.',
    link: '/software-development',
    icon: Database
  },
  {
    id: 'web-application-development',
    title: 'Web Application Development',
    description: 'Reactive single-page web applications, SaaS multi-tenant portals, and real-time dashboards.',
    link: '/web-application-development',
    icon: Globe
  },
  {
    id: 'ecommerce-development',
    title: 'E-commerce Development',
    description: 'High-converting online stores with Indian payment gateways (Razorpay, UPI) and GST invoicing.',
    link: '/ecommerce-development',
    icon: ShoppingCart
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Cross-platform iOS and Android mobile apps with offline synchronization and biometric auth.',
    link: '/mobile-app-development',
    icon: Smartphone
  },
  {
    id: 'ai-development',
    title: 'AI Development & Automation',
    description: 'Intelligent document parsing, private enterprise knowledge bases, and conversational AI.',
    link: '/ai-development',
    icon: Brain
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineering',
    description: 'Automated CI/CD pipelines, Docker containerization, AWS/GCP architecture, and 24/7 uptime.',
    link: '/cloud-devops',
    icon: Cloud
  },
  {
    id: 'custom-erp-development',
    title: 'Custom ERP Development',
    description: 'Tailored enterprise resource planning for manufacturing, multi-warehouse stock, and GST.',
    link: '/custom-erp-development',
    icon: Factory
  },
  {
    id: 'seo-services',
    title: 'SEO & Organic Growth',
    description: 'Technical SEO audits, Core Web Vitals, schema markup, and long-term search engine rankings.',
    link: '/seo-services',
    icon: Search
  },
  {
    id: 'digital-marketing',
    title: 'Performance Digital Marketing',
    description: 'Data-driven Google Ads and Meta advertising campaigns generating verified commercial enquiries.',
    link: '/digital-marketing',
    icon: TrendingUp
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Systems',
    description: 'Human-centred wireframes, interactive Figma prototypes, and developer-ready component design.',
    link: '/ui-ux-design',
    icon: Palette
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">What We Offer</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-poppins">
              Our <span className="text-secondary">Engineering Services</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tailored technology solutions designed to empower your business and drive innovation across every digital touchpoint.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {coreServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.08 }}
                className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-secondary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-2 flex flex-col items-start h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-300 shadow-sm border border-slate-100">
                  <IconComponent className="w-7 h-7 text-secondary group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold font-poppins text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  <Link to={service.link}>{service.title}</Link>
                </h3>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                <Link
                  to={service.link}
                  aria-label={`Learn more about ${service.title}`}
                  className="flex items-center gap-2 text-secondary font-bold group/btn mt-auto text-xs uppercase tracking-wider hover:text-primary transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
