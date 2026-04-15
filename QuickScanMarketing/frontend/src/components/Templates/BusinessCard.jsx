import React from 'react';
import { Phone, Mail, Globe, Briefcase } from 'lucide-react';

export default function BusinessCard({ config }) {
  const { company, role, phone, email, accentColor } = config;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
        <div className="h-32 bg-slate-900 flex items-center justify-center relative shadow-inner" style={{ backgroundColor: accentColor || '#1e293b' }}>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white rotate-3 group-hover:rotate-0 transition-transform">
            <Briefcase size={32} className="text-slate-800" />
          </div>
        </div>
        
        <div className="pt-16 pb-10 px-8 text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">{company || "TechNova Inc."}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{role || "Solutions Architect"}</p>
          </div>

          <div className="h-[1px] w-12 bg-slate-100 mx-auto"></div>

          <div className="grid gap-4 text-left">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Phone size={18} className="text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</span>
                <a href={`tel:${phone}`} className="text-sm font-bold">{phone || "+1 234 567 890"}</a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Mail size={18} className="text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                <a href={`mailto:${email}`} className="text-sm font-bold truncate">{email || "contact@example.com"}</a>
              </div>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95" style={{ backgroundColor: accentColor || '#1e293b' }}>
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
