import React from 'react';

export default function LinkTree({ config }) {
  const { avatar, message, links, gradient } = config;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: gradient || 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)' }}>
      <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.1)] text-white text-center space-y-8 animate-in slide-in-from-top-10 duration-1000">
        
        <div className="space-y-4">
          <div className="w-24 h-24 rounded-full border-4 border-white/30 mx-auto overflow-hidden shadow-2xl">
            <img src={avatar || "https://via.placeholder.com/150"} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm font-bold tracking-widest uppercase opacity-90">{message || "Check out my latest projects!"}</p>
        </div>

        <div className="grid gap-4">
          {links?.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              className="group relative w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all overflow-hidden"
            >
              <span className="relative z-10">{link.label || link.icon}</span>
            </a>
          ))}
        </div>

        <div className="pt-4">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Powered by Quick Scan Marketing</p>
        </div>
      </div>
    </div>
  );
}
