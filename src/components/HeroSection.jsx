import React from 'react';
import { ArrowRight, CheckCircle2, Cloud, Code2, Database, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroDashboard from '../assets/sentient_analytics.png';

const capabilities = [
  { icon: Code2, label: 'Product Engineering' },
  { icon: Cloud, label: 'Cloud Platforms' },
  { icon: Database, label: 'Data Systems' },
  { icon: ShieldCheck, label: 'Secure Delivery' },
];

const proofPoints = [
  { value: '50+', label: 'Projects shipped' },
  { value: '20+', label: 'Client teams' },
  { value: '5+', label: 'Years building' },
];

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden bg-[#f7fbff] pt-28 sm:pt-32 lg:pt-36"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#ffffff_0%,#eef7ff_44%,#ffffff_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(#003366_1px,transparent_1px),linear-gradient(90deg,#003366_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="mx-auto grid min-h-[calc(100vh-9rem)] w-full max-w-7xl items-center gap-12 px-5 pb-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-bold text-primary shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
            <Sparkles size={16} aria-hidden="true" />
            Software, automation, and AI for growing teams
          </div>

          <h1 className="font-poppins text-5xl font-extrabold leading-[1.05] text-[#07182e] sm:text-6xl lg:text-7xl">
            Build the digital backbone your business deserves.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Averqon designs and ships reliable web platforms, mobile apps, dashboards, and
            automation systems that help teams move faster without losing control.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/contact"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-base font-bold text-white shadow-[0_18px_42px_rgba(0,51,102,0.28)] transition-transform hover:-translate-y-0.5"
            >
              Start Your Project
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/services"
              className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-base font-bold text-primary shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-colors hover:bg-slate-50"
            >
              View Services
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-5">
            {proofPoints.map((item) => (
              <div key={item.label} className="px-3 first:pl-0 last:pr-0 sm:px-6">
                <div className="font-poppins text-2xl font-extrabold text-primary sm:text-3xl">
                  {item.value}
                </div>
                <div className="mt-1 text-xs font-bold uppercase text-slate-500 sm:text-sm">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[470px] lg:min-h-[600px]">
          <div className="absolute inset-x-4 top-0 rounded-[36px] border border-white bg-white/70 p-4 shadow-[0_26px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:inset-x-8 lg:inset-x-0">
            <div className="rounded-[28px] bg-[#07182e] p-5 text-white shadow-inner sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-cyan-200">Averqon delivery console</p>
                  <h2 className="mt-1 font-poppins text-2xl font-bold">Launch readiness</h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                  LIVE
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {capabilities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                      <Icon size={20} className="text-cyan-200" aria-hidden="true" />
                      <p className="mt-3 text-sm font-bold">{item.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
                <img
                  src={heroDashboard}
                  alt="Averqon analytics dashboard preview"
                  className="h-52 w-full object-cover object-center sm:h-64 lg:h-72"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white p-4 text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={21} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-950">Sprint milestone approved</p>
                    <p className="text-xs font-semibold text-slate-500">Design, API, and QA tracks aligned</p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[86%] rounded-full bg-[linear-gradient(90deg,#003366,#00c2ff)]" />
                </div>
              </div>
            </div>
          </div>

       
          <div className="absolute bottom-10 left-0 hidden max-w-[230px] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_54px_rgba(15,23,42,0.14)] sm:block">
            <p className="text-xs font-bold uppercase text-slate-500">Typical stack</p>
            <p className="mt-2 text-sm font-extrabold text-slate-950">React, Node, Firebase, MongoDB, AWS</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
