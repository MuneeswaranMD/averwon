import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Github } from 'lucide-react';
import { projects as mockProjects } from '../data/mock';
import { Button } from './ui/button';
import { API_ENDPOINTS } from '../api-config';

const PortfolioSection = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.PORTFOLIO_PROJECTS)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        } else {
          setProjectsList(mockProjects);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to fetch live projects, using fallback:", err);
        setProjectsList(mockProjects);
        setLoading(false);
      });
  }, []);

  const displayProjects = projectsList.length > 0 ? projectsList : mockProjects;

  return (
    <section id="projects" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Our Work</h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Engineering <span className="text-secondary">Excellence</span>
            </h2>
            <p className="text-lg text-grayText leading-relaxed">
              Explore our portfolio of cutting-edge digital products, from AI-driven analytics to secure blockchain solutions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <a
              href="/projects"
              className="inline-flex items-center gap-3 px-8 h-14 rounded-full border-2 border-secondary text-secondary font-bold text-sm tracking-wide hover:bg-secondary hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,123,255,0.25)]"
            >
              View All Projects
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {displayProjects.map((project, index) => {
            const techs = Array.isArray(project.technologies) 
              ? project.technologies 
              : (typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()) : []);

            return (
              <motion.div
                key={project._id || project.id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer flex flex-col justify-between"
              >
                {/* Project Image Container */}
                <div className="relative rounded-[3.5rem] overflow-hidden mb-10 aspect-[16/10] shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-700 bg-slate-100 flex items-center justify-center">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = mockProjects[index % mockProjects.length]?.image || '/src/assets/hero.png';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-bold text-3xl">
                      {project.title}
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                    <div className="flex gap-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all shadow-lg"
                        >
                          <ExternalLink size={24} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all shadow-lg"
                        >
                          <Github size={24} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    {techs.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {techs.map((tech, i) => (
                          <span
                            key={i}
                            className="px-5 py-2 rounded-xl bg-slate-50 text-secondary text-xs font-bold uppercase tracking-widest border border-gray-100"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <h3 className="text-3xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 tracking-tight mb-3">
                      {project.title}
                    </h3>
                    
                    <p className="text-grayText leading-relaxed text-xl pb-6 border-b border-gray-100">
                      {project.description}
                    </p>
                  </div>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-secondary font-bold hover:text-blue-700 group/btn text-lg pt-2"
                    >
                      Explore Project
                      <ArrowRight className="w-6 h-6 transform group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </a>
                  ) : (
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-secondary font-bold hover:bg-transparent group/btn flex items-center gap-3 text-lg justify-start"
                    >
                      Explore Project
                      <ArrowRight className="w-6 h-6 transform group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

