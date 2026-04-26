import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Building, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  Lock,
  Smartphone,
  Eye,
  LogOut,
  ChevronRight,
  Upload,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { SectionHeader, Card, Button, Input, Select } from '../components/ui';

export default function Settings() {
  const [tab, setTab] = useState(0);
  const [company, setCompany] = useState({ name: 'averqon CRM', email: 'admin@averqon.ai', phone: '+91 98765 43210', address: 'Bangalore, India', timezone: 'Asia/Kolkata', language: 'English' });
  const [notifs, setNotifs] = useState({ newLead: true, dealUpdate: true, ticketOpen: true, teamReport: false });
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: '30', ipWhitelist: false });

  const tabs = [
    { label: 'Company Profile', icon: Building },
    { label: 'Notifications', icon: Bell },
    { label: 'Security & Access', icon: Shield },
    { label: 'Appearance', icon: Palette },
  ];

  const Switch = ({ checked, onChange }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" subtitle="Manage your CRM preferences and configurations" />

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-100">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${tab === i ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {tab === 0 && (
          <Card className="!p-8">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8">Company Profile</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-50">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-100">
                  A
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-black text-slate-800 tracking-tight">{company.name}</h3>
                  <p className="text-[12px] font-bold text-slate-400">{company.email}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" className="!px-4 !py-1.5 !text-[10px]" icon={Upload}>Change Logo</Button>
                    <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline px-2">Remove</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Company Name" value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} icon={Building} />
                <Input label="Business Email" value={company.email} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} icon={Mail} />
                <Input label="Phone Number" value={company.phone} onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} icon={Phone} />
                <Input label="Headquarters" value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} icon={MapPin} />
                <Select 
                  label="Default Timezone" 
                  value={company.timezone} 
                  onChange={e => setCompany(c => ({ ...c, timezone: e.target.value }))}
                  icon={Clock}
                  options={['Asia/Kolkata', 'UTC', 'America/New_York'].map(o => ({ label: o, value: o }))}
                />
                <Select 
                  label="Preferred Language" 
                  value={company.language} 
                  onChange={e => setCompany(c => ({ ...c, language: e.target.value }))}
                  icon={Globe}
                  options={['English', 'Hindi', 'Tamil', 'French'].map(o => ({ label: o, value: o }))}
                />
              </div>

              <div className="pt-8 border-t border-slate-50">
                <Button size="lg" className="!px-8">Save Company Info</Button>
              </div>
            </div>
          </Card>
        )}

        {tab === 1 && (
          <Card className="!p-8">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { title: 'New Lead Alerts', key: 'newLead', desc: 'Instant push notify when a lead is assigned', icon: Users },
                { title: 'Deal Milestones', key: 'dealUpdate', desc: 'Alerts when deal stage progresses', icon: TrendingUp },
                { title: 'Support Updates', key: 'ticketOpen', desc: 'Notify team when new tickets are raised', icon: Activity },
                { title: 'Weekly Reports', key: 'teamReport', desc: 'Monday morning performance summary email', icon: Mail },
              ].map(item => (
                <div key={item.key} className="flex justify-between items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm group-hover:scale-110 transition-all">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black text-slate-800 tracking-tight">{item.title}</h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifs[item.key]} 
                    onChange={v => setNotifs(n => ({ ...n, [item.key]: v }))} 
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 2 && (
          <Card className="!p-8">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8">Security Configuration</h2>
            <div className="space-y-6">
              <div className="p-8 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-1000">
                  <Shield size={160} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em]">System Protected</div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Account Shield Enabled</h3>
                      <p className="text-white/70 text-[12px] font-medium max-w-sm leading-relaxed">
                        Your account is currently protected by 256-bit encryption and multi-factor authentication protocol.
                      </p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                      <Lock className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4">
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-indigo-900/20">
                      Change Master Password
                    </button>
                    <button className="text-white/80 hover:text-white px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all">
                      Review Login Audit
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Two-Factor Auth</h4>
                      <p className="text-[11px] font-bold text-slate-400 italic">Secondary identity verification</p>
                    </div>
                    <Switch checked={security.twoFactor} onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))} />
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Smartphone className="text-indigo-600" size={16} />
                    <span className="text-[12px] font-black text-slate-700">+91 ••••• ••210</span>
                    <button className="ml-auto text-[10px] font-black text-indigo-600 hover:underline px-2">Rotate</button>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Auto Session Lock</h4>
                      <p className="text-[11px] font-bold text-slate-400 italic">Security inactivity timeout</p>
                    </div>
                    <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Clock size={16} />
                    </div>
                  </div>
                  <Select 
                    value={security.sessionTimeout} 
                    onChange={v => setSecurity(s => ({ ...s, sessionTimeout: v }))}
                    className="bg-white"
                    options={[
                      { label: '15 Minutes', value: '15' },
                      { label: '30 Minutes', value: '30' },
                      { label: '1 Hour', value: '60' },
                      { label: 'Custom...', value: 'custom' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {tab === 3 && (
          <Card className="!p-8">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Workspace Appearance</h2>
            <p className="text-xs font-medium text-slate-400 mb-8">Customize how you see your CRM dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'light', label: 'Daylight', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
                { id: 'dark', label: 'Midnight', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { id: 'system', label: 'Auto Sync', icon: Monitor, color: 'text-slate-400', bg: 'bg-slate-50' },
              ].map(t => (
                <button 
                  key={t.id}
                  className={`relative p-8 rounded-[2.5rem] border-2 transition-all group text-center ${t.id === 'light' ? 'border-indigo-600 bg-white ring-8 ring-indigo-50 shadow-xl' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <div className={`w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-transform group-hover:scale-110 ${t.bg}`}>
                    <t.icon size={32} className={t.color} />
                  </div>
                  <h4 className="text-[13px] font-black text-slate-800 tracking-tight">{t.label}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Workspace Theme</p>
                  
                  {t.id === 'light' && (
                    <div className="absolute top-4 right-4">
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping absolute" />
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full relative" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
