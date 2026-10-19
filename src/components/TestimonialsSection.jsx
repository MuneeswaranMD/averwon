import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/mock';

const TestimonialsSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch('/api/testimonials')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load testimonials');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          } else {
            setItems([]);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        console.warn('Testimonial API fallback:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!auto || items.length <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [auto, items.length]);

  const prev = () => { setAuto(false); setCurrent(p => (p - 1 + items.length) % items.length); };
  const next = () => { setAuto(false); setCurrent(p => (p + 1) % items.length); };

  const t = items[current] || items[0];

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
            Real results from companies and institutions that chose Averqon to power their digital transformation.
          </p>
        </motion.div>

        {/* ── Loading State ── */}
        {loading && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#003366' }}>
            <div style={{ width:40, height:40, border:'3px solid #E2E8F0', borderTopColor:'#003366', borderRadius:'50%', margin:'0 auto 16px', animation:'spin 1s linear infinite' }} />
            <p style={{ fontSize:15, fontWeight:600 }}>Loading client testimonials...</p>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && items.length === 0 && (
          <div style={{ textAlign:'center', padding:'50px 20px', background:'#fff', borderRadius:24, maxWidth:600, margin:'0 auto', border:'1px solid #E2E8F0' }}>
            <p style={{ fontSize:15, color:'#EF4444', fontWeight:600, margin:0 }}>Unable to load verified testimonials</p>
            <p style={{ fontSize:13, color:'#64748B', marginTop:6 }}>Please refresh or check back shortly.</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && items.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 30px', background:'#fff', borderRadius:28, maxWidth:680, margin:'0 auto', border:'1px solid #00336615', boxShadow:'0 20px 40px #00336608' }}>
            <Quote size={48} color="#003366" style={{ opacity:0.25, margin:'0 auto 16px' }} />
            <h3 style={{ fontSize:18, fontWeight:800, color:'#003366', margin:0 }}>Client Testimonial Verification in Progress</h3>
            <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, margin:'10px 0 0' }}>
              We adhere to strict client consent policies. Testimonials and verified project outcomes will appear here once formal client publication approval has been confirmed.
            </p>
          </div>
        )}

        {/* ── Main testimonial card ── */}
        {!loading && items.length > 0 && t && (
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

                <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
                  {/* Stars (if provided by client) */}
                  {t.rating ? (
                    <div style={{ display:'flex', gap:5 }}>
                      {[...Array(Math.min(5, Math.max(1, t.rating)))].map((_,i) => (
                        <Star key={i} size={20} fill="#003366" color="#003366" style={{ opacity:0.85 }} />
                      ))}
                    </div>
                  ) : null}

                  {/* Quote text */}
                  <p style={{
                    fontSize:'clamp(1.05rem,2vw,1.3rem)',
                    lineHeight:1.75,
                    color:'#1e293b',
                    fontStyle:'italic',
                    fontWeight:500,
                    maxWidth:720,
                    whiteSpace:'pre-line',
                    margin:0
                  }}>
                    "{t.feedback}"
                  </p>

                  {/* Author row */}
                  <div style={{ display:'flex', alignItems:'center', gap:20, paddingTop:24, borderTop:'1px solid #00336608' }}>
                    <div style={{ position:'relative', flexShrink:0 }}>
                      <div style={{ position:'absolute', inset:-3, borderRadius:'50%', background:'linear-gradient(135deg,#003366,#4a7fbf)', zIndex:0 }} />
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          width="60"
                          height="60"
                          loading="lazy"
                          decoding="async"
                          style={{ width:60, height:60, borderRadius:'50%', objectFit:'cover', position:'relative', zIndex:1, border:'3px solid #fff' }}
                        />
                      ) : (
                        <div style={{
                          width:60, height:60, borderRadius:'50%',
                          background:'linear-gradient(135deg,#003366,#4a7fbf)',
                          color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                          fontWeight:800, fontSize:22, position:'relative', zIndex:1, border:'3px solid #fff'
                        }}>
                          {t.name ? t.name.charAt(0) : 'A'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17, color:'#003366' }}>{t.name}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#4a7fbf', letterSpacing:'0.03em', marginTop:2 }}>
                        {t.designation ? `${t.designation} · ` : ''}{t.company}
                      </div>
                      {t.project && <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Project: {t.project}</div>}
                    </div>

                    {/* Nav arrows */}
                    {items.length > 1 && (
                      <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
                        <button type="button" onClick={prev} aria-label="Previous testimonial" style={{
                          width:44, height:44, borderRadius:14,
                          background:'#f8faff', border:'1px solid #00336615',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          cursor:'pointer', transition:'all 0.25s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background='#003366'; e.currentTarget.style.color='#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='#f8faff'; e.currentTarget.style.color=''; }}
                        >
                          <ChevronLeft size={18} color="#003366" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={next} aria-label="Next testimonial" style={{
                          width:44, height:44, borderRadius:14,
                          background:'#003366', border:'1px solid #003366',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          cursor:'pointer', transition:'all 0.25s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background='#4a7fbf'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='#003366'; }}
                        >
                          <ChevronRight size={18} color="#fff" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── Pagination dots ── */}
            {items.length > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
                {items.map((_,i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to testimonial ${i + 1}`}
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
            )}
          </div>
        )}

        {/* ── Side mini cards (other testimonials) ── */}
        {!loading && items.length > 1 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20, marginTop:56, maxWidth:900, margin:'56px auto 0' }}>
            {items.map((item, i) => i !== current && (
              <motion.button
                key={i}
                type="button"
                aria-label={`View testimonial by ${item.name}`}
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
                  {item.image ? (
                    <img src={item.image} alt={item.name} width="38" height="38" loading="lazy" decoding="async" style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', border:'2px solid #00336615' }} />
                  ) : (
                    <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#003366,#4a7fbf)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 }}>
                      {item.name ? item.name.charAt(0) : 'A'}
                    </div>
                  )}
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:13, color:'#003366', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize:11, color:'#4a7fbf', fontWeight:700, lineHeight:1.35, display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:2, overflow:'hidden' }}>
                      {item.designation ? `${item.designation} · ` : ''}{item.company}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, fontStyle:'italic', margin:0, display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:3, overflow:'hidden' }}>
                  "{item.feedback}"
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
