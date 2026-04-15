"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { 
  Menu, X, Home, Zap, Layers, Download, Link as LinkIcon, Plus, Trash2, Move, ShoppingCart, Type
} from "lucide-react";

export default function CreateStandee() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [qrList, setQrList] = useState([]);
  
  // Standee State
  const [addedQrs, setAddedQrs] = useState([
    { id: 1, qrId: null, x: 50, y: 65, size: 45 } // Percentage size
  ]);
  const [activeQrId, setActiveQrId] = useState(null);
  
  const [title, setTitle] = useState("SCAN & CONNECT");
  const [subtitle, setSubtitle] = useState("SECURE DIGITAL NETWORK ACCESS");
  const [footer, setFooter] = useState("Quick Scan Marketing Ecosystem");
  const [textColors, setTextColors] = useState({ title: '#ffffff', subtitle: '#64748b' });
  const [theme, setTheme] = useState({ name: 'Neon Blue', from: 'from-blue-600', to: 'to-cyan-400', shadow: 'shadow-blue-500/50' });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Text Nodes State
  const [addedTexts, setAddedTexts] = useState([]);
  const [activeTextId, setActiveTextId] = useState(null);

  const formats = [
    { id: 'standee', name: 'Vertical Standee', prevClass: 'w-[280px] sm:w-[320px] h-[550px] flex-col rounded-3xl', printClass: 'print:w-[100mm] print:h-[200mm]' },
    { id: 'a4', name: 'A4 Document', prevClass: 'w-[320px] sm:w-[380px] h-[537px] flex-col rounded-none', printClass: 'print:w-[210mm] print:h-[297mm]' },
    { id: 'poster', name: 'Large Poster', prevClass: 'w-[360px] sm:w-[420px] h-[520px] flex-col rounded-lg', printClass: 'print:w-[240mm] print:h-[300mm]' },
    { id: 'banner', name: 'Horizontal Banner', prevClass: 'w-[100%] max-w-[600px] h-[300px] flex-row rounded-xl', printClass: 'print:w-[297mm] print:h-[100mm]' }
  ];
  const [format, setFormat] = useState(formats[0]);

  const themes = [
    { name: 'Neon Blue', from: 'from-blue-600', to: 'to-cyan-400', shadow: 'shadow-blue-500/50' },
    { name: 'Cyber Pink', from: 'from-pink-600', to: 'to-purple-500', shadow: 'shadow-pink-500/50' },
    { name: 'Emerald', from: 'from-emerald-500', to: 'to-teal-400', shadow: 'shadow-emerald-500/50' },
    { name: 'Amber Glow', from: 'from-orange-500', to: 'to-amber-300', shadow: 'shadow-orange-500/50' },
    { name: 'Hyper Violet', from: 'from-indigo-600', to: 'to-purple-500', shadow: 'shadow-indigo-500/50' },
    { name: 'Crimson Red', from: 'from-red-600', to: 'to-rose-400', shadow: 'shadow-red-500/50' },
    { name: 'Golden Luxury', from: 'from-yellow-600', to: 'to-yellow-300', shadow: 'shadow-yellow-500/50' },
    { name: 'Deep Ocean', from: 'from-blue-800', to: 'to-indigo-400', shadow: 'shadow-blue-700/50' },
    { name: 'Arctic Frost', from: 'from-slate-100', to: 'to-blue-200', shadow: 'shadow-blue-100/50' },
    { name: 'Midnight', from: 'from-gray-900', to: 'to-slate-700', shadow: 'shadow-black/50' },
    { name: 'Sunset Silk', from: 'from-orange-600', to: 'to-rose-500', shadow: 'shadow-orange-500/50' },
    { name: 'Forest Moss', from: 'from-green-700', to: 'to-emerald-400', shadow: 'shadow-green-700/50' },
    { name: 'Electric', from: 'from-yellow-400', to: 'to-orange-500', shadow: 'shadow-yellow-400/50' },
    { name: 'Berry Blast', from: 'from-fuchsia-600', to: 'to-pink-400', shadow: 'shadow-fuchsia-500/50' },
    { name: 'Royal Velvet', from: 'from-purple-800', to: 'to-indigo-900', shadow: 'shadow-purple-900/50' },
    { name: 'Misty Rose', from: 'from-rose-100', to: 'to-teal-50', shadow: 'shadow-rose-100/50' }
  ];

  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragTarget = useRef(null);

  const fetchQR = useCallback(() => {
    fetch(`${apiUrl}/qr/all`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQrList(data);
          if (data.length > 0 && addedQrs.length > 0 && !addedQrs[0].qrId) {
              const updated = [...addedQrs];
              updated[0].qrId = data[0]._id;
              setAddedQrs(updated);
          }
        }
      })
      .catch((err) => console.error("Error fetching QR codes:", err));
  }, [apiUrl, addedQrs]);

  useEffect(() => {
    fetchQR();
  }, [fetchQR]);

  const addQr = () => {
    setAddedQrs([...addedQrs, { 
      id: Date.now(), 
      qrId: qrList[0]?._id || null, 
      x: 50, 
      y: 50, 
      size: 35 // Percentage of width
    }]);
  };

  const removeQr = (id) => {
    setAddedQrs(addedQrs.filter(q => q.id !== id));
  };

  const updateQr = (id, updates) => {
    setAddedQrs(addedQrs.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleMouseDown = (e, target) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    dragTarget.current = target;
    if (target.type === 'qr') {
      setActiveQrId(target.id);
      setActiveTextId(null);
    } else {
      setActiveTextId(target.id);
      setActiveQrId(null);
    }
  };

  const addText = () => {
    setAddedTexts([...addedTexts, {
      id: Date.now(),
      content: "NEW LAYER",
      x: 50,
      y: 40,
      size: 14,
      color: "#ffffff",
      bold: true
    }]);
  };

  const removeText = (id) => {
    setAddedTexts(addedTexts.filter(t => t.id !== id));
  };

  const updateText = (id, updates) => {
    setAddedTexts(addedTexts.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragTarget.current || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const updates = { 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    };

    if (dragTarget.current.type === 'qr') {
      updateQr(dragTarget.current.id, updates);
    } else {
      updateText(dragTarget.current.id, updates);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragTarget.current = null;
  };

  const [previewScale, setPreviewScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth < 1024 ? window.innerWidth - 40 : window.innerWidth - 400;
      const targetWidth = format.id === 'banner' ? 600 : 350;
      if (containerWidth < targetWidth) {
        setPreviewScale(containerWidth / targetWidth);
      } else {
        setPreviewScale(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [format]);

  const handleOrder = () => {
    const orderData = {
      title, 
      subtitle, 
      footer, 
      textColors, 
      theme, 
      format, 
      addedQrs,
      addedTexts
    };
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    router.push('/order');
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div 
      className="flex h-screen overflow-hidden bg-[#0B132B] text-white selection:bg-cyan-500/30 font-sans"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Toaster position="top-right" />
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-60 w-75 bg-[#14213D] border-r border-white/5 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static print:hidden`}>
        <div className="h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black italic tracking-widest text-white">Q</span>
            <span className="text-sm font-black italic tracking-[0.2em] text-white">QUICK SCAN MARKETING</span>
          </div>
          <button className="lg:hidden p-1 text-slate-500 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 px-4 space-y-6 custom-scrollbar">
          {/* Navigation Links */}
          <div className="flex gap-2">
            <Link href="/dashboard" className="flex-1 flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                <Home size={16} className="text-slate-500" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Home</span>
            </Link>
            <Link href="/generate" className="flex-1 flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                <Zap size={16} className="text-orange-400" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Gen</span>
            </Link>
            <div className="flex-1 flex flex-col items-center gap-1 p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                <Layers size={16} className="text-cyan-400" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Standee</span>
            </div>
          </div>

          <div>
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Canvas Configuration</h3>
             
             <div className="space-y-4">
                {/* Headline */}
                <div className="grid grid-cols-5 gap-2 items-end">
                   <div className="col-span-4 space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                         <Type size={10} className="text-cyan-400" /> Headline
                      </label>
                      <input 
                         type="text" 
                         value={title}
                         onChange={(e) => setTitle(e.target.value)}
                         className="w-full bg-[#0B132B] border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                      />
                   </div>
                   <input 
                      type="color" 
                      value={textColors.title}
                      onChange={(e) => setTextColors({...textColors, title: e.target.value})}
                      className="w-full h-8 bg-transparent border-0 cursor-pointer p-0"
                   />
                </div>

                {/* Subtitle */}
                <div className="grid grid-cols-5 gap-2 items-end">
                   <div className="col-span-4 space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                         <Type size={10} className="text-slate-400" /> Subtitle
                      </label>
                      <input 
                         type="text" 
                         value={subtitle}
                         onChange={(e) => setSubtitle(e.target.value)}
                         className="w-full bg-[#0B132B] border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                      />
                   </div>
                   <input 
                      type="color" 
                      value={textColors.subtitle}
                      onChange={(e) => setTextColors({...textColors, subtitle: e.target.value})}
                      className="w-full h-8 bg-transparent border-0 cursor-pointer p-0"
                   />
                </div>

                {/* Footer Text */}
                <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap size={10} className="text-slate-400" /> Footer Branding
                   </label>
                   <input 
                      type="text" 
                      value={footer}
                      onChange={(e) => setFooter(e.target.value)}
                      className="w-full bg-[#0B132B] border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                   />
                </div>
                {/* Format */}
                <div className="grid grid-cols-2 gap-2">
                   {formats.map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setFormat(f)}
                        className={`py-2 px-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter transition-all ${format.id === f.id ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/20' : 'bg-white/5 border-white/5 text-slate-500'}`}
                      >
                        {f.name}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Matrix Clusters</h3>
                <button 
                  onClick={addQr}
                  className="p-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all text-[8px] font-black flex items-center gap-1"
                >
                  <Plus size={10} /> ADD QR
                </button>
             </div>

             <div className="space-y-3">
                {addedQrs.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-xl border transition-all ${activeQrId === item.id ? 'bg-white/10 border-cyan-500/30' : 'bg-white/5 border-white/5'}`}
                    onClick={() => setActiveQrId(item.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] font-black text-white italic">NODE #{index + 1}</span>
                       <button onClick={(e) => { e.stopPropagation(); removeQr(item.id); }} className="text-slate-600 hover:text-rose-500 transition-colors">
                          <Trash2 size={12} />
                       </button>
                    </div>

                    <div className="space-y-3" onClick={e => e.stopPropagation()}>
                       <select 
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] outline-none"
                          value={item.qrId || ''}
                          onChange={(e) => updateQr(item.id, { qrId: e.target.value })}
                       >
                          {qrList.map(qr => (
                            <option key={qr._id} value={qr._id}>{qr.link ? qr.link.substring(0, 20) : "No Link"}... ({qr._id.slice(-4)})</option>
                          ))}
                       </select>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                             <span>X Position</span>
                             <span>{Math.round(item.x)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" 
                            value={item.x} 
                            onChange={(e) => updateQr(item.id, { x: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                             <span>Y Position</span>
                             <span>{Math.round(item.y)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" 
                            value={item.y} 
                            onChange={(e) => updateQr(item.id, { y: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                             <span>Rel Size</span>
                             <span>{item.size}%</span>
                          </div>
                          <input 
                            type="range" min="10" max="90" 
                            value={item.size} 
                            onChange={(e) => updateQr(item.id, { size: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="pt-4 pb-10 space-y-3">
            <button 
              onClick={handleDownload}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-black italic tracking-widest uppercase py-4 rounded-xl flex justify-center items-center gap-2 border border-white/5 transition-all"
            >
              <Download size={18} /> EXPORT PDF
            </button>
            <button 
              onClick={handleOrder}
              className="w-full bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black italic tracking-widest uppercase py-4 rounded-xl flex justify-center items-center gap-2 shadow-[0_10px_30px_rgba(234,88,12,0.3)] transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <ShoppingCart size={18} /> ORDER STANDEE
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#060B1A] relative">
         <header className="h-16 flex items-center justify-between px-6 bg-[#0B132B]/50 backdrop-blur-xl shrink-0 print:hidden border-b border-white/5">
            <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(true)}><Menu size={20}/></button>
            <div className="flex items-center gap-4 flex-1 overflow-hidden ml-4">
               <span className="hidden md:block text-[8px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Themes</span>
               <div className="flex-1 flex overflow-x-auto gap-3 py-2 px-1 custom-scrollbar">
                  {themes.map(t => (
                     <button 
                       key={t.name} 
                       onClick={() => setTheme(t)} 
                       title={t.name}
                       className={`w-8 h-8 rounded-full border-2 shrink-0 transition-all ${theme.name === t.name ? 'border-white scale-110 shadow-lg' : 'border-white/5 opacity-60 hover:opacity-100 hover:scale-105 active:scale-95'} bg-linear-to-br ${t.from} ${t.to}`}
                     ></button>
                  ))}
               </div>
            </div>
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-white/5">
               <div className="text-right hidden sm:block">
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Active Style</p>
                  <p className="text-[10px] font-black italic text-cyan-400 uppercase tracking-tighter">{theme.name}</p>
               </div>
               <div className={`w-4 h-4 rounded-full bg-linear-to-br ${theme.from} ${theme.to} shadow-lg shadow-cyan-500/20`}></div>
            </div>
         </header>

         <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar flex items-center justify-center p-4 sm:p-10 print:p-0 bg-[#060B1A]">
            
            {/* The Physical Standee Canvas Container (Responsive Scale) */}
            <div 
              style={{ 
                transform: `scale(${previewScale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease'
              }}
              className="flex items-center justify-center"
            >
                <div 
                  ref={canvasRef}
                  className={`relative bg-[#0A1020] border-2 border-white/5 overflow-hidden shadow-2xl flex flex-col transition-all duration-500 ${format.prevClass} ${format.printClass} print:border-black print:bg-white ${theme.shadow} print:shadow-none print:transform-none`}
                >
                   {/* Accent Header */}
                       <div className={`w-full ${format.id === 'banner' ? 'h-full w-24' : 'h-32'} bg-linear-to-br ${theme.from} ${theme.to} relative overflow-hidden shrink-0 print:border-r print:border-black`}>
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                <span className="text-3xl font-black italic">Q</span>
                             </div>
                          </div>
                       </div>

                   {/* Central Content */}
                   <div className={`flex-1 flex flex-col relative ${format.id === 'banner' ? 'items-start justify-center p-12 lg:p-16' : 'items-center justify-start p-10 pt-16'}`}>
                      {/* Decorative elements for banner */}
                      {format.id === 'banner' && (
                        <div className="absolute top-0 right-0 w-64 h-full bg-white/5 -skew-x-12 translate-x-32 print:hidden pointer-events-none"></div>
                      )}

                      <div className="max-w-[70%] z-10">
                        <h1 
                          style={{ color: textColors.title }}
                          className={`${format.id === 'banner' ? 'text-4xl sm:text-6xl text-left drop-shadow-2xl' : 'text-4xl text-center'} font-black italic tracking-tighter uppercase leading-[0.85] print:text-black mb-6 transition-all`}
                        >
                          {title}
                        </h1>
                        <div className={`h-1 bg-linear-to-r ${theme.from} ${theme.to} mb-6 ${format.id === 'banner' ? 'w-32' : 'w-16 mx-auto'} rounded-full`}></div>
                        <p 
                          style={{ color: textColors.subtitle }}
                          className={`${format.id === 'banner' ? 'text-lg text-left max-w-xl' : 'text-[10px] text-center'} font-bold tracking-[0.2em] uppercase leading-relaxed mb-8 opacity-90`}
                        >
                          {subtitle}
                        </p>

                        <div className={`${format.id === 'banner' ? 'mt-8 flex items-center gap-4' : 'mt-auto pb-4 text-center'}`}>
                           <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${theme.from} ${theme.to} flex items-center justify-center`}>
                              <span className="text-white font-black text-xs italic">Q</span>
                           </div>
                           <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 whitespace-nowrap" style={{ color: textColors.subtitle }}>{footer}</p>
                        </div>
                      </div>
                   </div>

                   {/* Draggable QR Codes */}
                   {addedQrs.map((qr) => (
                      <div 
                        key={qr.id}
                        onMouseDown={(e) => handleMouseDown(e, { type: 'qr', id: qr.id })}
                        className={`absolute cursor-move transition-shadow hover:ring-2 hover:ring-cyan-500 ring-offset-2 ring-offset-[#0A1020] print:ring-0 ${activeQrId === qr.id ? 'ring-2 ring-cyan-500 shadow-2xl z-50' : 'z-40'}`}
                        style={{ 
                          left: `${qr.x}%`, 
                          top: `${qr.y}%`, 
                          transform: 'translate(-50%, -50%)',
                          width: `${qr.size}%`,
                          maxWidth: '90%',
                          aspectRatio: '1/1'
                        }}
                      >
                         <div className="p-3 bg-white rounded-2xl shadow-2xl w-full h-full relative group">
                            {/* Drag Handle Icon for Desktop */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                               <Move size={12} className="text-white" />
                            </div>

                            {qr.qrId ? (
                                <QRCode 
                                    value={`${apiUrl}/qr/scan/${qr.qrId}`} 
                                    size={256} 
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                                    viewBox="0 0 256 256"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <LinkIcon size={40} />
                                </div>
                            )}
                         </div>
                      </div>
                   ))}

                   {/* Add Draggable Texts */}
                   {addedTexts.map((txt) => (
                      <div 
                        key={txt.id}
                        onMouseDown={(e) => handleMouseDown(e, { type: 'text', id: txt.id })}
                        className={`absolute cursor-move transition-all select-none whitespace-nowrap group ${activeTextId === txt.id ? 'ring-1 ring-orange-500 rounded px-2 py-1 z-50' : 'z-40'}`}
                        style={{ 
                          left: `${txt.x}%`, 
                          top: `${txt.y}%`, 
                          transform: 'translate(-50%, -50%)',
                          fontSize: `${txt.size}px`,
                          color: txt.color,
                          fontWeight: '900',
                          fontStyle: 'italic',
                          textTransform: 'uppercase'
                        }}
                      >
                         {txt.content}
                         {/* Move Handle Icon for Desktop */}
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                            <Move size={8} className="text-white" />
                         </div>
                      </div>
                   ))}
                </div>
            </div>
         </main>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:text-black { color: black !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:border-black { border-color: black !important; }
          @page { margin: 0; size: auto; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
