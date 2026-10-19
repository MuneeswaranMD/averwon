import averlinkLogistics from '../assets/averlink_logistics.png';
import neoretailCore from '../assets/neoretail_core.png';
import pulseHealth from '../assets/pulse_health.png';
import sentientAnalytics from '../assets/sentient_analytics.png';

export const heroImages = {
  main: '/src/assets/hero.png',
};

export const aboutImages = {
  main: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', 
  office: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200',
  team: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200', 
};

export const services = [
  { 
    id: 1, 
    title: 'Enterprise Software', 
    description: 'Custom-built ERP and CRM systems designed to streamline complex business operations and data management.', 
    icon: 'Globe' 
  },
  { 
    id: 2, 
    title: 'Mobile Architecture', 
    description: 'High-performance cross-platform applications built with React Native and Flutter for global scalability.', 
    icon: 'Smartphone' 
  },
  { 
    id: 3, 
    title: 'Product Engineering', 
    description: 'Full-lifecycle product development focusing on rapid prototyping, MVP builds, and enterprise scaling.', 
    icon: 'Palette' 
  },
  { 
    id: 4, 
    title: 'AI & Data Science', 
    description: 'Implementing LLMs, predictive modeling, and automated decision-making systems for competitive advantage.', 
    icon: 'Brain' 
  },
  { 
    id: 5, 
    title: 'Cloud Infrastructure', 
    description: 'Optimized AWS/Azure cloud architecture featuring automated CI/CD pipelines and high-availability systems.', 
    icon: 'Cloud' 
  },
  { 
    id: 6, 
    title: 'Blockchain Solutions', 
    description: 'Private and public blockchain integration for secure smart contracts and supply chain transparency.', 
    icon: 'Link' 
  },
  { 
    id: 7, 
    title: 'Managed Security', 
    description: 'Comprehensive cybersecurity audits, threat detection, and 24/7 managed IT infrastructure support.', 
    icon: 'Database' 
  },
  { 
    id: 8, 
    title: 'Digital Consulting', 
    description: 'Strategic technology roadmapping to help businesses navigate digital transformation and market shifts.', 
    icon: 'Lightbulb' 
  },
];

export const stats = [
  { id: 1, label: 'Projects Delivered', value: 10, suffix: '+' },
  { id: 2, label: 'Clients Served', value: 5, suffix: '+' },
  { id: 3, label: 'Technologies & Solutions', value: 5, suffix: '+' },
  { id: 4, label: 'Client Satisfaction', value: 95, suffix: '%+' },
];

export const projects = [
  {
    id: 1,
    title: 'AverLink Logistics',
    description: 'A NEXT-GEN logistics platform optimizing fleet management with real-time tracking and predictive maintenance.',
    image: averlinkLogistics,
    technologies: ['React', 'Node.js', 'AWS IoT', 'Python']
  },
  {
    id: 2,
    title: 'NeoRetail Core',
    description: 'Multi-tenant e-commerce engine serving 1M+ monthly users with integrated AI-driven inventory forecasting.',
    image: neoretailCore,
    technologies: ['Next.js', 'PostgreSQL', 'Redis', 'TensorFlow']
  },
  {
    id: 3,
    title: 'Pulse Health App',
    description: 'HIPAA-compliant telemedicine suite featuring real-time video consultation and encrypted patient records.',
    image: pulseHealth,
    technologies: ['React Native', 'Firebase', 'WebRTC', 'Go']
  },
  {
    id: 4,
    title: 'Sentient Analytics',
    description: 'Real-time sentiment analysis platform for hedge funds, processing millions of financial news feeds hourly.',
    image: sentientAnalytics,
    technologies: ['PyTorch', 'Rust', 'Apache Kafka', 'Next.js']
  }
];


export const testimonials = [
  {
    id: 1,
    name: 'Psychologist',
    company: 'Psychology Website Client',
    feedback:
      "Honestly, most of my clients have told me that booking a session has become so much easier now, and everyone who has seen the website absolutely loves it. I’m genuinely so happy and satisfied with how everything has turned out. All the credit for the work and effort you put into building this website goes to you. Thank you so much for making this happen for me! It really means a lot. ✨",
    image: '',
    rating: null,
    status: 'pending-approval',
    source: 'client-provided',
    approvedForPublication: false,
  },
  {
    id: 2,
    name: 'MaxxJoy Tours',
    company: 'Travel Website Development',
    feedback:
      'The website gives our travel business a professional online presence and makes it easier to bring our booking process and other services together. We appreciate the effort put into developing the website and integrating the tools needed for our workflow.',
    image: '',
    rating: null,
    status: 'draft',
    source: 'suggested-draft',
    approvedForPublication: false,
  },
  {
    id: 3,
    name: 'RetroStylings',
    company: 'E-commerce Website Development',
    feedback:
      'We wanted a website that reflects our brand and showcases our products professionally. The new e-commerce website gives us a dedicated online platform for our business. We appreciate the time and effort put into bringing this project to life.',
    image: '',
    rating: null,
    status: 'draft',
    source: 'suggested-draft',
    approvedForPublication: false,
  },
  {
    id: 4,
    name: 'Peeyem Traders',
    company: 'Website, Domain & Hosting',
    feedback:
      'Having a dedicated website helps us present our business professionally online. We appreciate the work put into developing the website and arranging the domain, hosting, and maintenance services to support our online presence.',
    image: '',
    rating: null,
    status: 'draft',
    source: 'suggested-draft',
    approvedForPublication: false,
  },
  {
    id: 5,
    name: 'Dr. R. Murugadoss',
    company:
      'Professor & Head, Artificial Intelligence and Data Science — V.S.B. College of Engineering Technical Campus',
    feedback:
      'The website redesign has helped us work toward a more modern and professional online presence. I appreciate the dedication and effort put into the project, along with the attention given to our website and technical requirements.',
    image: '',
    rating: null,
    status: 'draft',
    source: 'suggested-draft',
    approvedForPublication: false,
  },
];


