import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/button';

const BlogSection = () => {
  const posts = [
    {
      title: "The Future of AI in Business Automation",
      category: "AI & Technology",
      date: "Dec 10, 2025",
      desc: "Discover how artificial intelligence is revolutionizing business processes and driving efficiency across industries.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Building Scalable Cloud Infrastructure",
      category: "Cloud Computing",
      date: "Dec 5, 2025",
      desc: "Learn best practices for designing and implementing cloud solutions that grow with your business needs.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Blockchain Beyond Cryptocurrency",
      category: "Blockchain",
      date: "Nov 28, 2025",
      desc: "Explore real-world applications of blockchain technology in supply chain, healthcare, and governance.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="blog" className="py-24 md:py-32 bg-white relative">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Latest Insights</h4>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8 leading-tight">
                Stay Ahead of <span className="text-secondary">Technology</span>
              </h2>
              <p className="text-lg text-grayText leading-relaxed">
                Expert analysis, technical deep-dives, and industry perspectives from the Averqon team.
              </p>
            </motion.div>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 h-14 rounded-full border-2 border-secondary text-secondary font-bold text-sm tracking-wide hover:bg-secondary hover:text-white hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,123,255,0.25)] transition-all duration-300 flex-shrink-0"
          >
            View All Articles <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group flex flex-col h-full rounded-[3rem] bg-slate-50 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-[2rem]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl text-xs font-bold text-primary shadow-sm flex items-center gap-2">
                  <Tag size={12} className="text-secondary" /> {post.category}
                </div>
              </div>
              
              <div className="p-10 pt-4 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-sm text-grayText font-bold uppercase tracking-wider mb-5">
                  <span className="flex items-center gap-2"><Calendar size={16} className="text-accent" /> {post.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-5 group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-grayText leading-relaxed mb-8 line-clamp-3 text-lg">
                  {post.desc}
                </p>
                <div className="mt-auto">
                  <button className="flex items-center gap-3 text-primary font-bold group/btn">
                    <span className="relative">
                      Read Article
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300"></span>
                    </span>
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary group-hover/btn:text-white transition-all duration-300">
                       <ArrowUpRight size={18} />
                    </div>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
