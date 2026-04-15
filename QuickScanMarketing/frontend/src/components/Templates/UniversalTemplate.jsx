import React from 'react';
import QRCode from 'react-qr-code';

export default function UniversalTemplate({ config }) {
  if (!config) return null;

  const {
    background = { color: "#ffffff", gradient: "none" },
    logo = { url: "", visible: true, text: "LOGO" },
    banner = { url: "", visible: true },
    title = { text: "Heading Title", color: "#000000" },
    description = { text: "Enter your description and call to action here.", color: "#444444" },
    cta = { text: "Click Here", url: "#", bgColor: "#000000", textColor: "#ffffff" },
    qrCode = { visible: true, size: 120, position: "bottom", fgColor: "#000000", bgColor: "#ffffff" }
  } = config;

  const bgStyle = background.gradient !== 'none' 
    ? { background: background.gradient } 
    : { backgroundColor: background.color };

  const qrBlock = qrCode.visible ? (
    <div className="flex justify-center my-4 md:my-8 px-4 transition-transform hover:scale-105 duration-700">
      <div
        className="p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative group border border-white/10"
        style={{ backgroundColor: qrCode.bgColor || "#ffffff" }}
      >
        {/* Scan corner accents */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg opacity-40 group-hover:opacity-100 transition-opacity" style={{ borderColor: qrCode.fgColor || "#000000" }}></div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 rounded-br-lg opacity-40 group-hover:opacity-100 transition-opacity" style={{ borderColor: qrCode.fgColor || "#000000" }}></div>

        <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px]">
          <QRCode
            value={typeof window !== 'undefined' ? window.location.href : "#"}
            size={256}
            fgColor={qrCode.fgColor || "#000000"}
            bgColor="transparent"
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox="0 0 256 256"
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen font-sans flex flex-col overflow-x-hidden" style={bgStyle}>
      {/* Banner Area */}
      {banner.visible && banner.url && (
        <div className="h-40 md:h-48 w-full relative overflow-hidden shrink-0">
          <img src={banner.url} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
        </div>
      )}

      <div className={`px-5 py-8 flex-1 flex flex-col ${banner.visible && banner.url ? '-mt-10 md:-mt-12' : 'pt-12 md:pt-16'} relative z-10`}>
        <div className="max-w-xl mx-auto w-full space-y-6 md:space-y-8 flex-1 flex flex-col">
          
          {/* Logo Placeholder */}
          {logo.visible && (
            <div className="flex justify-center transition-transform hover:scale-105 duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-[1.5rem] md:rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                {logo.url ? (
                  <img src={logo.url} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-xl md:text-2xl font-black italic tracking-tighter" style={{ color: title.color }}>{logo.text || 'QSM'}</span>
                )}
              </div>
            </div>
          )}

          {qrCode.position === 'top' && qrBlock}

          {/* Text Content */}
          <div className="text-center space-y-4 md:space-y-6 px-4">
            <h1 
              className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tighter uppercase leading-[1.05] text-balance" 
              style={{ color: title.color }}
            >
              {title.text}
            </h1>
            <p 
              className="text-[14px] md:text-base font-medium leading-relaxed opacity-80 text-balance max-w-[260px] sm:max-w-sm mx-auto" 
              style={{ color: description.color || title.color }}
            >
              {description.text}
            </p>
          </div>

          {qrCode.position === 'center' && qrBlock}

          {/* CTA Action */}
          <div className="pt-2 md:pt-4">
            <a 
              href={cta.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-4 md:py-5 px-6 rounded-xl md:rounded-2xl text-center font-black italic uppercase tracking-widest text-[10px] md:text-[11px] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 break-words"
              style={{ backgroundColor: cta.bgColor, color: cta.textColor }}
            >
              {cta.text}
            </a>
          </div>

          {qrCode.position === 'bottom' && qrBlock}
          
          <div className="flex-1 min-h-[20px]"></div>
          
          <div className="py-6 md:py-8 text-center mt-auto">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-40" style={{ color: title.color }}>
              Powered by Quick Scan Marketing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
