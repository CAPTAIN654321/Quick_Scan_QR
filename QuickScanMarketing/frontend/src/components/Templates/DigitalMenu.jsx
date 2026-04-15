import React from 'react';
import { UtensilsCrossed, Star } from 'lucide-react';

export default function DigitalMenu({ config }) {
  const { restaurantName, tagline, menuItems, themeColor } = config;

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex flex-col p-6 font-serif">
      <div className="max-w-md w-full mx-auto space-y-10 animate-in fade-in duration-1000">
        
        <header className="text-center space-y-4 pt-10">
          <div className="inline-flex p-3 rounded-full bg-white shadow-xl mb-4">
            <UtensilsCrossed size={32} style={{ color: themeColor || '#ea580c' }} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter" style={{ color: themeColor || '#ea580c' }}>
            {restaurantName || "The Spice Hub"}
          </h1>
          <p className="text-slate-600 text-sm font-medium italic tracking-wide">
            {tagline || "Experience the Authentic Taste"}
          </p>
        </header>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] flex-1" style={{ backgroundColor: `${themeColor}20` || '#ea580c20' }}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Featured Dishes</span>
            <div className="h-[2px] flex-1" style={{ backgroundColor: `${themeColor}20` || '#ea580c20' }}></div>
          </div>

          <div className="grid gap-6">
            {menuItems?.map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    {item.name}
                    {i === 0 && <Star size={12} className="fill-amber-400 text-amber-400" />}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Chef&apos;s Special Recommendation</p>
                </div>
                <div className="text-xl font-black italic" style={{ color: themeColor || '#ea580c' }}>
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="pt-20 text-center">
            <button className="px-10 py-4 rounded-full text-white font-black italic tracking-widest text-[11px] shadow-2xl transition-all transform hover:scale-105 active:scale-95" style={{ backgroundColor: themeColor || '#ea580c' }}>
                Order Now
            </button>
        </footer>
      </div>
    </div>
  );
}
