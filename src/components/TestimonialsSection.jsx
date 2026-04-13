import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/mock';

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [auto]);

  const prev = () => { setAuto(false); setCurrent(p => (p - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setAuto(false); setCurrent(p => (p + 1) % testimonials.length); };

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      style={{
        padding: '100px 0',
        background: 'linear-gradient(160deg,#f8faff 0%,#ffffff 50%,#f0f5ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative shapes */}
      <div style={{ position:'absolute', top:'10%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,#00336610 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'-5%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,#00336610 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', border:'1px dashed #00336610', pointerEvents:'none' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:72 }}
        >
          <p style={{ fontSize:12, fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:'#003366', opacity:0.6, marginBottom:14 }}>
            Success Stories
          </p>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontSize:'clamp(2.2rem,4vw,3.4rem)', fontWeight:900, color:'#003366', lineHeight:1.15, letterSpacing:'-0.02em', marginBottom:16 }}>
            Trusted by <span style={{ background:'linear-gradient(135deg,#003366,#4a7fbf)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Ambitious</span> Teams
          </h2>
          <p style={{ fontSize:17, color:'#64748b', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
            Real results from companies that chose Averqon to power their digital transformation.
          </p>
        </motion.div>

        {/* ── Main testimonial card ── */}
        <div style={{ position:'relative', maxWidth:900, margin:'0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity:0, y:24, scale:0.97 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-24, scale:0.97 }}
              transition={{ duration:0.45, ease:[0.23,1,0.32,1] }}
              style={{
                background:'#fff',
                borderRadius:32,
                padding:'48px 52px',
                boxShadow:'0 40px 80px #00336614,0 12px 32px #00336608,0 2px 8px #0000000a',
                border:'1px solid #00336610',
                position:'relative',
                overflow:'hidden',
              }}
            >
              {/* Top color bar */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#003366,#4a7fbf)', borderRadius:'32px 32px 0 0' }} />

              {/* Giant quote icon */}
              <div style={{ position:'absolute', top:24, right:36, opacity:0.05 }}>
                <Quote size={120} color="#003366" />
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:36 }}>
                {/* Stars */}
                <div style={{ display:'flex', gap:5 }}>
                  {[...Array(t.rating)].map((_,i) => (
                    <Star key={i} size={20} fill="#003366" color="#003366" style={{ opacity:0.85 }} />
                  ))}
                </div>

                {/* Quote text */}
                <p style={{
                  fontSize:'clamp(1.1rem,2vw,1.35rem)',
                  lineHeight:1.75,
                  color:'#1e293b',
                  fontStyle:'italic',
                  fontWeight:500,
                  maxWidth:720,
                }}>
                  "{t.feedback}"
                </p>

                {/* Author row */}
                <div style={{ display:'flex', alignItems:'center', gap:20, paddingTop:24, borderTop:'1px solid #00336608' }}>
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ position:'absolute', inset:-3, borderRadius:'50%', background:'linear-gradient(135deg,#003366,#4a7fbf)', zIndex:0 }} />
                    <img
                      src={t.image}
                      alt={t.name}
                      style={{ width:60, height:60, borderRadius:'50%', objectFit:'cover', position:'relative', zIndex:1, border:'3px solid #fff' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17, color:'#003366' }}>{t.name}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#4a7fbf', letterSpacing:'0.05em', marginTop:2 }}>{t.company}</div>
                  </div>

                  {/* Nav arrows — right side on desktop */}
                  <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
                    <button onClick={prev} style={{
                      width:44, height:44, borderRadius:14,
                      background:'#f8faff', border:'1px solid #00336615',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor:'pointer', transition:'all 0.25s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background='#003366'; e.currentTarget.style.color='#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='#f8faff'; e.currentTarget.style.color=''; }}
                    >
                      <ChevronLeft size={18} color="#003366" />
                    </button>
                    <button onClick={next} style={{
                      width:44, height:44, borderRadius:14,
                      background:'#003366', border:'1px solid #003366',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor:'pointer', transition:'all 0.25s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background='#4a7fbf'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='#003366'; }}
                    >
                      <ChevronRight size={18} color="#fff" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Pagination dots ── */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
            {testimonials.map((_,i) => (
              <button
                key={i}
                onClick={() => { setAuto(false); setCurrent(i); }}
                style={{
                  height:8, width: i===current ? 36 : 8,
                  borderRadius:999,
                  background: i===current ? '#003366' : '#00336625',
                  border:'none', cursor:'pointer',
                  transition:'all 0.4s cubic-bezier(0.23,1,0.32,1)',
                  padding:0,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Side mini cards (other testimonials) ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20, marginTop:56, maxWidth:900, margin:'56px auto 0' }}>
          {testimonials.map((item, i) => i !== current && (
            <motion.button
              key={i}
              onClick={() => { setAuto(false); setCurrent(i); }}
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:i*0.08 }}
              style={{
                background:'#fff', borderRadius:20, padding:'20px 24px',
                boxShadow:'0 8px 24px #00336608',
                border:'1px solid #00336610',
                textAlign:'left', cursor:'pointer',
                transition:'all 0.3s cubic-bezier(0.23,1,0.32,1)',
                outline:'none',
              }}
              whileHover={{ y:-4, boxShadow:'0 20px 48px #00336616' }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <img src={item.image} alt={item.name} style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', border:'2px solid #00336615' }} />
                <div>
                  <div style={{ fontWeight:800, fontSize:13, color:'#003366' }}>{item.name}</div>
                  <div style={{ fontSize:11, color:'#4a7fbf', fontWeight:700 }}>{item.company}</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, fontStyle:'italic', margin:0 }}>
                "{item.feedback.slice(0,90)}..."
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
