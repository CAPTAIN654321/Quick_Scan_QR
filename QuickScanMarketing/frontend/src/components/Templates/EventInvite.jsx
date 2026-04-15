import React from 'react';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';

export default function EventInvite({ config }) {
  const { eventName, date, location, description, primaryColor } = config;

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: primaryColor || '#7c3aed' }}></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: primaryColor || '#7c3aed' }}></div>

      <div className="max-w-md w-full relative z-10 space-y-12 animate-in zoom-in-90 duration-1000">
        <header className="text-center space-y-4">
           <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[0.4em]">Exclusive Event</div>
           <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
             {eventName || "Summer Tech Meetup"}
           </h1>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
           <p className="text-slate-400 text-sm leading-relaxed font-medium">
             {description || "Join us for an evening of networking and tech talks with industry leaders."}
           </p>

           <div className="grid gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${primaryColor}20` }}>
                    <Calendar size={20} style={{ color: primaryColor || '#7c3aed' }} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</span>
                    <span className="text-sm font-bold">{new Date(date).toLocaleDateString() || "July 20, 2026"}</span>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${primaryColor}20` }}>
                    <MapPin size={20} style={{ color: primaryColor || '#7c3aed' }} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</span>
                    <span className="text-sm font-bold">{location || "Silicon Valley, CA"}</span>
                 </div>
              </div>
           </div>

           <button className="w-full py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] text-xs text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3" style={{ backgroundColor: '#ffffff' }}>
              <Ticket size={18} /> Get Tickets
           </button>
        </div>
      </div>
    </div>
  );
}
