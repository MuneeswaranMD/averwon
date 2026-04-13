import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  MapPin, Mail, Clock, Send, CheckCircle2,
  AlertCircle, Instagram, Twitter, Linkedin, Loader2
} from 'lucide-react';

// ─────────────────────────────────────────────
//  🔑  YOUR EMAILJS CREDENTIALS — fill these in
//      Service ID  → EmailJS dashboard › Email Services
//      Template ID → EmailJS dashboard › Email Templates
//      Public Key  → EmailJS dashboard › Account › Public Key
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_tmxyhwq';
const EMAILJS_TEMPLATE_ID = 'template_5h03bsa';
const EMAILJS_PUBLIC_KEY = 'YPXfTNPHw5HOuoUY0';

const services = [
  'Web Design & Development',
  'Mobile App Development',
  'UI/UX Design',
  'AI Solutions',
  'Cloud Services',
  'Digital Marketing',
  'Graphic Design',
  'Other',
];

const ContactPage = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({ user_name: '', user_email: '', user_phone: '', company: '', budget: '', timeline: '', service: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ user_name: '', user_email: '', user_phone: '', company: '', budget: '', timeline: '', service: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  /* ─── info cards ─── */
  const info = [
    {
      icon: MapPin,
      title: 'Our Base',
      lines: ['Coimbatore, Tamil Nadu'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['averqon.hr@averqon.in'],
      href: 'mailto:averqon.hr@averqon.in',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      lines: ['Mon – Sat, 9am – 7pm'],
    },
  ];

  const socials = [
    { icon: Instagram, href: 'https://instagram.com/averqon_hq', label: '@averqon_hq' },
    { icon: Twitter, href: '#', label: '@averqon_hq' },
    { icon: Linkedin, href: '#', label: 'Averqon' },
  ];

  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#003366', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' };
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 15, outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div className="overflow-x-hidden" style={{ paddingTop: 80 }}>

      {/* ══════════════════ HERO BANNER ══════════════════ */}
      <div style={{
        background: 'linear-gradient(150deg,#f0f5ff 0%,#ffffff 55%,#eef4ff 100%)',
        padding: '72px 24px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle,#003366 1px,transparent 1px)',
          backgroundSize: '40px 40px', opacity: 0.05, pointerEvents: 'none',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 style={{
            fontFamily: 'Poppins,sans-serif',
            fontSize: 'clamp(2.8rem,5vw,4.4rem)',
            fontWeight: 900, color: '#003366',
            lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 20,
          }}>
            Say{' '}
            <span style={{
              background: 'linear-gradient(135deg,#003366,#4a7fbf)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Hello.</span>
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Have a project in mind? We'd love to hear about it. Drop us a message or visit our office in the heart of Coimbatore.
          </p>
        </motion.div>
      </div>

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <section style={{ padding: '72px 24px 100px', background: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 64 }}
          >
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#003366', opacity: 0.5, marginBottom: 10 }}>
              Get In Touch
            </p>
            <h2 style={{
              fontFamily: 'Poppins,sans-serif',
              fontSize: 'clamp(2rem,3.5vw,2.8rem)',
              fontWeight: 900, color: '#003366',
              letterSpacing: '-0.02em', marginBottom: 14,
            }}>
              Let's Create <span style={{ background: 'linear-gradient(135deg,#003366,#4a7fbf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Together</span>
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, lineHeight: 1.75 }}>
              We would love to hear from you! Whether you have a question, need assistance, or want to start a project, our team is here to help.
            </p>
          </motion.div>

          {/* 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start' }}
            className="contact-grid"
          >

            {/* ── LEFT: Info + Socials ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {info.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: '#f8faff',
                      borderRadius: 20,
                      padding: '24px 28px',
                      display: 'flex', alignItems: 'flex-start', gap: 18,
                      border: '1px solid #00336610',
                    }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                      background: 'linear-gradient(135deg,#003366,#4a7fbf)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={20} color="#fff" />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#003366', opacity: 0.5, marginBottom: 4 }}>
                        {card.title}
                      </p>
                      {card.lines.map((line, j) =>
                        card.href ? (
                          <a key={j} href={card.href} style={{ fontSize: 16, fontWeight: 700, color: '#003366', textDecoration: 'none', display: 'block' }}>
                            {line}
                          </a>
                        ) : (
                          <p key={j} style={{ fontSize: 16, fontWeight: 700, color: '#003366', margin: 0 }}>{line}</p>
                        )
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                style={{ background: '#f8faff', borderRadius: 20, padding: '24px 28px', border: '1px solid #00336610' }}
              >
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#003366', opacity: 0.5, marginBottom: 16 }}>
                  Follow Us
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {socials.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          background: '#fff', borderRadius: 12, padding: '10px 16px',
                          border: '1px solid #00336615',
                          color: '#003366', textDecoration: 'none',
                          fontWeight: 700, fontSize: 13,
                          boxShadow: '0 2px 8px #00336608',
                          transition: 'all 0.25s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#003366'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#003366'; }}
                      >
                        <Icon size={15} /> {s.label}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                background: '#fff',
                borderRadius: 28,
                padding: '48px 44px',
                boxShadow: '0 32px 80px #00336612,0 8px 24px #00336608',
                border: '1px solid #00336610',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* top accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#003366,#4a7fbf)', borderRadius: '28px 28px 0 0' }} />

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#22c55e15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <CheckCircle2 size={36} color="#22c55e" />
                  </div>
                  <h3 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 26, fontWeight: 800, color: '#003366', marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ color: '#64748b', fontSize: 16 }}>Thanks for reaching out — we'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    style={{ marginTop: 28, padding: '12px 32px', borderRadius: 999, background: '#003366', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                  {/* Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                    <div>
                      <label style={labelStyle}>Name</label>
                      <input
                        name="user_name" type="text" required
                        value={form.user_name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        name="user_email" type="email" required
                        value={form.user_email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Phone + Company */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input
                        name="user_phone" type="tel"
                        value={form.user_phone}
                        onChange={handleChange}
                        placeholder="+91 ..."
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Company</label>
                      <input
                        name="company" type="text"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Organization Name"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Budget + Timeline */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                    <div>
                      <label style={labelStyle}>Budget (Estimated)</label>
                      <input
                        name="budget" type="text"
                        value={form.budget}
                        onChange={handleChange}
                        placeholder="e.g. 5k - 10k"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Timeline</label>
                      <input
                        name="timeline" type="text"
                        value={form.timeline}
                        onChange={handleChange}
                        placeholder="e.g. 3 Months"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label style={labelStyle}>Service Interest</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select a service</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Project Details</label>
                    <textarea
                      name="message" required rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                    />
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca' }}>
                      <AlertCircle size={18} color="#ef4444" />
                      <span style={{ fontSize: 14, color: '#ef4444', fontWeight: 600 }}>Something went wrong. Please try again.</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      background: status === 'sending' ? '#4a7fbf' : '#003366',
                      color: '#fff', padding: '16px 36px', borderRadius: 999,
                      fontWeight: 800, fontSize: 15, border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      boxShadow: '0 8px 32px #00336630',
                      transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
                      width: '100%',
                    }}
                  >
                    {status === 'sending' ? (
                      <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                    ) : (
                      <><Send size={17} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ── shared styles ── */
const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 800,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: '#003366', opacity: 0.55, marginBottom: 8,
};
const inputStyle = {
  width: '100%', padding: '13px 16px',
  borderRadius: 14, border: '2px solid #e2e8f0',
  fontSize: 15, fontWeight: 500, color: '#003366',
  background: '#f8faff', outline: 'none',
  transition: 'border-color 0.25s',
  boxSizing: 'border-box',
  fontFamily: 'Inter,sans-serif',
};

export default ContactPage;
