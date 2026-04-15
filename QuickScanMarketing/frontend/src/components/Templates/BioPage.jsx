import React from 'react';

export default function BioPage({ config }) {
  const { title, bio, bgColor, textColor, links } = config;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: bgColor || '#0f172a', color: textColor || '#ffffff' }}>
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-white/10 rounded-full mx-auto flex items-center justify-center border border-white/20 shadow-2xl">
          <span className="text-4xl font-black italic">{title?.[0] || 'V'}</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">{title || "Your Name"}</h1>
          <p className="text-sm opacity-70 font-medium tracking-wide">{bio || "Your short bio goes here."}</p>
        </div>

        <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>

        <div className="grid gap-3 pt-4">
          {links?.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold tracking-widest uppercase text-[11px] transition-all transform hover:-translate-y-1 active:scale-95"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
