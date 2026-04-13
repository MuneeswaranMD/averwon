import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github } from 'lucide-react';

const TeamSection = () => {
  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      desc: 'Visionary leader with 15+ years in technology innovation.',
      image: 'https://i.pravatar.cc/150?u=rajesh',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      desc: 'Tech enthusiast driving digital transformation initiatives.',
      image: 'https://i.pravatar.cc/150?u=priya',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Design',
      desc: 'Creative designer crafting beautiful and functional experiences.',
      image: 'https://i.pravatar.cc/150?u=sarahj',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Emily Chen',
      role: 'Lead Developer',
      desc: 'Full-stack expert passionate about clean code and innovation.',
      image: 'https://i.pravatar.cc/150?u=emily',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Maya Patel',
      role: 'Product Manager',
      desc: 'Strategic thinker focused on delivering exceptional products.',
      image: 'https://i.pravatar.cc/150?u=maya',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Lisa Anderson',
      role: 'Marketing Head',
      desc: 'Growth expert building powerful brand narratives.',
      image: 'https://i.pravatar.cc/150?u=lisa',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    }
  ];

  return (
    <section id="team" className="section-padding bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h4 className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">Our Talents</h4>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Meet the <span className="text-secondary">Innovators</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-6 inline-block">
                <div className="w-56 h-56 rounded-[3rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-xl group-hover:shadow-secondary/20">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                {/* Social Floating Icons */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <a href={member.socials.linkedin} className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all">
                    <Linkedin size={18} />
                  </a>
                  <a href={member.socials.twitter} className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all">
                    <Twitter size={18} />
                  </a>
                  <a href={member.socials.github} className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-primary hover:bg-black hover:text-white transition-all">
                    <Github size={18} />
                  </a>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{member.name}</h3>
              <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-3">{member.role}</p>
              <p className="text-grayText text-sm font-medium max-w-[250px] mx-auto leading-relaxed">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
