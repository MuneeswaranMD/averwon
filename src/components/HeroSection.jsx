import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code2, Layers, Zap, Globe, ChevronDown, MousePointer2 } from 'lucide-react';

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const chips = [
    { icon: Code2,   label: 'Clean Code',   x: -45, y: -38 },
    { icon: Layers,  label: 'UI/UX',        x:  42, y: -42 },
    { icon: Globe,   label: 'Web & Mobile', x: -48, y:  38 },
    { icon: Zap,     label: 'Fast Delivery', x:  44, y:  40 },
  ];

  return (
    <section
      ref={heroRef}
      id="home"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, #f0f5ff 0%, #ffffff 50%, #eef4ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        marginTop: '64px',
      }}
    >
      {/* ── Dot grid ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, #003366 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        opacity: 0.07,
        transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
        transition: 'transform 0.7s cubic-bezier(0.23,1,0.32,1)',
      }} />

      {/* ── Blurred orbs ── */}
      <div style={{ position:'absolute', top:'-15%', right:'-8%', width:640, height:640, borderRadius:'50%', background:'radial-gradient(circle, #00336618 0%, transparent 70%)', transform:`translate(${mousePos.x*20}px,${mousePos.y*20}px)`, transition:'transform 0.9s cubic-bezier(0.23,1,0.32,1)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle, #00336612 0%, transparent 70%)', transform:`translate(${mousePos.x*-12}px,${mousePos.y*-12}px)`, transition:'transform 1s cubic-bezier(0.23,1,0.32,1)', pointerEvents:'none' }} />

      {/* ── Grid layout ── */}
      <div style={{
        maxWidth:1280, margin:'0 auto', padding:'60px 40px',
        width:'100%', position:'relative', zIndex:10,
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:80, alignItems:'center',
      }} className="hero-main-grid">

        {/* ═══ LEFT ═══ */}
        <div style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(48px)',
          transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1)',
        }}>
          {/* Headline */}
          <h1 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(3rem,5.5vw,5.2rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#003366',
            marginBottom: 28,
          }}>
            We Engineer{' '}
            <span style={{
              position: 'relative',
              display: 'inline-block',
            }}>
              <span style={{
                background: 'linear-gradient(135deg,#003366,#4a7fbf)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Digital
              </span>
              {/* underline accent */}
              <span style={{
                position:'absolute', bottom:-6, left:0, right:0, height:4,
                background:'linear-gradient(90deg,#003366,#4a7fbf,transparent)',
                borderRadius:4,
              }} />
            </span>
            {' '}Futures.
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: '#4a5568',
            maxWidth: 500, marginBottom: 48,
          }}>
            Averqon builds transformative software products — from AI-driven systems and cloud platforms to mobile apps that millions love.
          </p>

          {/* Buttons */}
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:56, alignItems:'center' }}>
            <a href="#services" style={{
              display:'inline-flex', alignItems:'center', gap:12,
              background:'#003366', color:'#fff',
              padding:'15px 34px', borderRadius:999,
              fontWeight:700, fontSize:15, textDecoration:'none',
              letterSpacing:'0.02em',
              boxShadow:'0 8px 32px #00336640,0 2px 8px #00336620',
              transition:'all 0.35s cubic-bezier(0.23,1,0.32,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow='0 20px 50px #00336650,0 4px 16px #00336630'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.boxShadow='0 8px 32px #00336640,0 2px 8px #00336620'; }}
            >
              Explore Services
              <span style={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, background:'rgba(255,255,255,0.2)', borderRadius:'50%' }}>
                <ArrowRight size={15} />
              </span>
            </a>
            <a href="https://calendly.com/muneeswaranmd2004/30min" target="_blank" rel="noopener noreferrer" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              background:'#fff', color:'#003366',
              padding:'15px 34px', borderRadius:999,
              fontWeight:700, fontSize:15, textDecoration:'none',
              border:'1.5px solid #00336625',
              boxShadow:'0 4px 20px #00336610',
              transition:'all 0.35s cubic-bezier(0.23,1,0.32,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#003366'; e.currentTarget.style.boxShadow='0 12px 32px #00336620'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#00336625'; e.currentTarget.style.boxShadow='0 4px 20px #00336610'; }}
            >
              Book a Call
            </a>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:40, paddingTop:28, borderTop:'1px solid #00336612' }}>
            {[
              { val:'50+', lbl:'Projects Delivered' },
              { val:'20+', lbl:'Happy Clients' },
              { val:'5+',  lbl:'Years of Excellence' },
            ].map((s,i) => (
              <div key={i} style={{
                opacity: isLoaded?1:0,
                transform: isLoaded?'translateY(0)':'translateY(20px)',
                transition:`all 0.7s cubic-bezier(0.23,1,0.32,1) ${0.4+i*0.12}s`,
              }}>
                <div style={{ fontFamily:'Poppins,sans-serif', fontSize:32, fontWeight:900, color:'#003366', lineHeight:1, marginBottom:4 }}>{s.val}</div>
                <div style={{ fontSize:12, color:'#94a3b8', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ RIGHT — 3D card scene ═══ */}
        <div className="hero-scene-container" style={{
          position:'relative', height:560,
          opacity: isLoaded?1:0,
          transform: isLoaded?'translateX(0)':'translateX(60px)',
          transition:'all 1.1s cubic-bezier(0.23,1,0.32,1) 0.2s',
        }}>

          {/* Outer ring */}
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:`translate(-50%,-50%) translate(${mousePos.x*12}px,${mousePos.y*12}px)`,
            width:380, height:380, borderRadius:'50%',
            border:'1px dashed #00336622',
            animation:'spin-ring 20s linear infinite',
            transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
          }} />
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:`translate(-50%,-50%) translate(${mousePos.x*-8}px,${mousePos.y*-8}px)`,
            width:270, height:270, borderRadius:'50%',
            background:'conic-gradient(from 180deg,#00336610,#4a7fbf20,#00336610,transparent,#00336610)',
            animation:'spin-ring 14s linear infinite reverse',
            transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          }} />

          {/* Central card */}
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            width:300,
            transform:`translate(-50%,-50%) rotateY(${mousePos.x*10}deg) rotateX(${-mousePos.y*10}deg) translate(${mousePos.x*6}px,${mousePos.y*6}px)`,
            transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
            background:'#fff',
            borderRadius:28,
            padding:'30px',
            boxShadow:'0 40px 80px #00336618,0 16px 40px #00336610,0 2px 8px #0000000a',
            border:'1px solid #00336615',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#003366,#4a7fbf)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Zap size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight:800, color:'#003366', fontSize:14 }}>Live Dashboard</div>
                <div style={{ fontSize:12, color:'#94a3b8' }}>Real-time metrics</div>
              </div>
              <div style={{ marginLeft:'auto', fontSize:11, fontWeight:700, color:'#22c55e', background:'#22c55e12', padding:'4px 10px', borderRadius:999 }}>● LIVE</div>
            </div>
            {[
              { label:'Performance', val:96, color:'#003366' },
              { label:'Reliability',  val:99, color:'#4a7fbf' },
              { label:'Security',     val:92, color:'#003366' },
            ].map((bar,i) => (
              <div key={i} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:'#64748b' }}>{bar.label}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:bar.color }}>{bar.val}%</span>
                </div>
                <div style={{ height:6, background:'#f1f5f9', borderRadius:999 }}>
                  <div style={{
                    height:'100%',
                    width: isLoaded ? `${bar.val}%` : '0%',
                    background:`linear-gradient(90deg,${bar.color},${bar.color}99)`,
                    borderRadius:999,
                    transition:`width 1.5s cubic-bezier(0.23,1,0.32,1) ${0.8+i*0.2}s`,
                    boxShadow:`0 0 10px ${bar.color}40`,
                  }} />
                </div>
              </div>
            ))}
            {/* Mini notification */}
            <div style={{ marginTop:18, padding:'10px 14px', background:'#f8faff', borderRadius:14, border:'1px solid #00336610', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:'#00336610', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <MousePointer2 size={14} color="#003366" />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'#003366' }}>New deployment ready</div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>2 mins ago</div>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          {chips.map((chip, i) => {
            const Icon = chip.icon;
            return (
              <div key={i} className="floating-chip" style={{
                position:'absolute', top:'50%', left:'50%',
                transform:`translate(calc(-50% + ${chip.x}% * 2.5px * 10), calc(-50% + ${chip.y}% * 2.5px * 10)) translate(${chip.x < 0 ? '-190px' : '190px'}, ${chip.y < 0 ? '-140px' : '140px'}) translate(${mousePos.x*(4+i*2)}px,${mousePos.y*(4+i*2)}px)`,
                animation:`float-chip 5s ease-in-out infinite`,
                animationDelay:`${i*0.5}s`,
                zIndex:20,
                transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
              }}>
                <div style={{
                  background:'#fff', borderRadius:16, padding:'12px 16px',
                  display:'flex', alignItems:'center', gap:8,
                  boxShadow:'0 12px 32px #00336618,0 4px 10px #0000000a',
                  border:'1px solid #00336615',
                  whiteSpace:'nowrap',
                }}>
                  <div style={{ width:30, height:30, borderRadius:9, background:'#00336610', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={15} color="#003366" />
                  </div>
                  <span style={{ fontWeight:700, fontSize:13, color:'#003366' }}>{chip.label}</span>
                </div>
              </div>
            );
          })}

          {/* Tech badge */}
          <div style={{
            position:'absolute', bottom:24, right:0,
            background:'#fff', borderRadius:16, padding:'10px 18px',
            boxShadow:'0 8px 28px #00336614,0 2px 8px #00000008',
            border:'1px solid #00336614',
            display:'flex', alignItems:'center', gap:10,
            transform:`translate(${mousePos.x*-10}px,${mousePos.y*-10}px)`,
            transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          }}>
            <div style={{ display:'flex', gap:5 }}>
              {['#3b82f6','#06b6d4','#8b5cf6','#f59e0b'].map((c,i)=>(
                <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:c }} />
              ))}
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:'#64748b' }}>React · Node · Python · AWS</span>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div style={{
        position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:6,
        opacity: isLoaded?1:0, transition:'opacity 1s 1.8s',
        cursor:'pointer', zIndex:20,
      }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior:'smooth' })}>
        <span style={{ fontSize:10, fontWeight:800, color:'#94a3b8', letterSpacing:'0.18em', textTransform:'uppercase' }}>Scroll Down</span>
        <ChevronDown size={18} color="#003366" style={{ animation:'bounce-y 1.5s ease-in-out infinite' }} />
      </div>

      {/* ── Wave ── */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, lineHeight:0, zIndex:10, pointerEvents:'none' }}>
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', width:'100%' }}>
          <path d="M0,35 C400,80 1040,-10 1440,35 L1440,70 L0,70 Z" fill="#ffffff" />
        </svg>
      </div>

      <style>{`
        @keyframes spin-ring {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes float-chip {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes bounce-y {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }
        @media (max-width: 900px) {
          .hero-main-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 40px 20px !important;
          }
          .hero-scene-container {
            height: 400px !important;
            margin-top: 20px;
          }
          .floating-chip {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
