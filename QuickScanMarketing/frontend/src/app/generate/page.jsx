"use client";

import { useState, useEffect, useCallback } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Menu, X, Home, Zap, Layers, Activity, Check, Download, Palette, Link as LinkIcon, Type, QrCode, Layout, Settings2
} from "lucide-react";
import TemplateRenderer from "@/components/Templates/TemplateRenderer";

export default function Generate() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [qrType, setQrType] = useState("dynamic"); // 'static' or 'dynamic'
  
  // Form State
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  
  const proPalettes = [
    { name: 'Dark Stealth', bg: '#0F172A', text: '#F8FAFC', accent: '#38BDF8', qr: '#FFFFFF' },
    { name: 'Pure Minimal', bg: '#FFFFFF', text: '#000000', accent: '#000000', qr: '#000000' },
    { name: 'Rose Gold', bg: '#FFF1F2', text: '#881337', accent: '#E11D48', qr: '#4C0519' },
    { name: 'Emerald Night', bg: '#064E3B', text: '#D1FAE5', accent: '#10B981', qr: '#FFFFFF' },
    { name: 'Oceanic', bg: '#0C4A6E', text: '#E0F2FE', accent: '#0EA5E9', qr: '#FFFFFF' },
    { name: 'Sunset Burn', bg: '#7C2D12', text: '#FFEDD5', accent: '#F97316', qr: '#FFFFFF' },
  ];

  const gradients = [
    { name: 'None', value: 'none' },
    { name: 'Midnight', value: 'linear-gradient(to bottom, #0f172a, #1e293b)' },
    { name: 'Abyss', value: 'linear-gradient(135deg, #000428, #004e92)' },
    { name: 'Fire', value: 'linear-gradient(to right, #f83600, #fe8c00)' },
    { name: 'Forest', value: 'linear-gradient(to right, #11998e, #38ef7d)' },
    { name: 'Purple Rain', value: 'linear-gradient(to right, #4e54c8, #8f94fb)' },
    { name: 'Sublime', value: 'linear-gradient(to right, #fc5c7d, #6a82fb)' },
    { name: 'Cyberpunk', value: 'linear-gradient(45deg, #ff00cc, #3333ff)' },
    { name: 'Golden Sun', value: 'linear-gradient(to right, #F2994A, #F2C94C)' },
  ];
  
  const [qrValue, setQrValue] = useState("");
  const [generatedId, setGeneratedId] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  // Customization State
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Template State
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [useTemplate, setUseTemplate] = useState(false);
  const [customConfig, setCustomConfig] = useState({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/template/all`)
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error("Error fetching templates:", err));
  }, []);

  const handleSelectTemplate = (temp) => {
    setSelectedTemplate(temp);
    setCustomConfig(temp.config);
    setUseTemplate(true);
    setInputValue(`TEMPLATE:${temp.name}`); // Placeholder for internal use
  };

  const handleGenerate = async () => {
    if (!useTemplate && !inputValue.trim()) return;
    
    setIsGenerating(true);
    try {
      if (qrType === "dynamic") {
        // Create an active tracked node in DB
        const payload = {
          type: 'dynamic',
          link: useTemplate ? '#' : inputValue,
          templateId: selectedTemplate?._id,
          customConfig: customConfig
        };

        const res = await fetch(`${apiUrl}/qr/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        const qrLink = `${apiUrl}/qr/scan/${data.data._id}`;
        setQrValue(qrLink);
        setGeneratedId(data.data._id);
      } else {
        setQrValue(inputValue);
        setGeneratedId(null);
      }
    } catch (error) {
      console.error("Error generating QR:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${qrType}-${Date.now()}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B132B] text-white selection:bg-orange-500/30">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[50] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-[260px] bg-[#14213D] border-r border-white/5 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black italic tracking-widest text-white">Q</span>
            <span className="text-sm font-black italic tracking-[0.2em] text-white">QUICK SCAN MARKETING</span>
          </div>
          <button className="lg:hidden p-1 text-slate-500 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 px-3 space-y-2">
          {/* Dashboard */}
          <Link href="/dashboard" className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-blue-500/20 transition-colors border border-white/5 shadow-sm">
               <Home size={18} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Dashboard</span>
          </Link>

          {/* Create QR (Active) */}
          <a href="#" className="flex items-center gap-4 px-3 py-3.5 bg-[#1C2541] rounded-xl border border-white/5 shadow-lg group relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-orange-400 to-amber-600 rounded-r-md"></div>
            <div className="p-1 shrink-0">
               <Zap size={22} className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)] fill-orange-400/30" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-white">Create QR</span>
          </a>

          {/* Create Standee */}
          <Link href="/standee" className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-cyan-500/20 transition-colors border border-white/5 shadow-sm">
               <Layers size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Create Standee</span>
          </Link>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative custom-scrollbar">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B132B]/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} className="text-slate-400" />
            </button>
            <span className="text-[10px] tracking-[0.3em] font-bold text-slate-500 uppercase">QR Matrix Generator</span>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full flex-1 flex flex-col xl:flex-row gap-10">
          
          {/* Settings Column */}
          <div className="w-full xl:w-[450px] flex flex-col gap-6 shrink-0">
            <div className="mb-2">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Create Node</h2>
              <p className="text-[10px] font-bold text-orange-400 tracking-[0.2em] mt-1">GENERATE SCANNABLE ASSETS</p>
            </div>

            <div className="bg-[#1F2B4B] border border-white/5 rounded-xl p-6 space-y-8 shadow-xl">
              
              {/* Type Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} /> Asset Type
                </label>
                
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#14213D] rounded-xl border border-white/5">
                  <button 
                    onClick={() => { setQrType('dynamic'); setQrValue(''); }}
                    className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-lg transition-all ${qrType === 'dynamic' ? 'bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 border border-orange-400/50' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                  >
                     <Zap size={18} className={qrType === 'dynamic' ? 'fill-white/20' : ''} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Dynamic</span>
                     <span className={`text-[8px] tracking-wider font-bold ${qrType === 'dynamic' ? 'text-orange-100' : 'text-slate-600'}`}>With Analytics</span>
                  </button>

                  <button 
                    onClick={() => { setQrType('static'); setQrValue(''); setUseTemplate(false); }}
                    className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-lg transition-all ${qrType === 'static' ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/50' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                  >
                     <LinkIcon size={18} className={qrType === 'static' ? 'fill-white/20' : ''} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Static</span>
                     <span className={`text-[8px] tracking-wider font-bold ${qrType === 'static' ? 'text-blue-100' : 'text-slate-600'}`}>Direct Link</span>
                  </button>
                </div>
              </div>

              {qrType === 'dynamic' && (
                <div className="flex p-1 bg-[#14213D] rounded-xl border border-white/5">
                  <button 
                    onClick={() => setUseTemplate(false)}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!useTemplate ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
                  >URL Redirect</button>
                  <button 
                    onClick={() => { setUseTemplate(true); if(!selectedTemplate && templates.length > 0) handleSelectTemplate(templates[0]); }}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${useTemplate ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
                  >Landing Template</button>
                </div>
              )}

              {qrType === 'dynamic' && useTemplate && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layout size={12} /> Design Browser
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {templates.map((temp) => (
                      <button
                        key={temp._id}
                        onClick={() => handleSelectTemplate(temp)}
                        className={`p-3 rounded-xl border text-left transition-all ${selectedTemplate?._id === temp._id ? 'bg-orange-600/10 border-orange-500/50' : 'bg-[#14213D] border-white/5 hover:border-white/20'}`}
                      >
                        <p className="text-[10px] font-black text-white truncate">{temp.name}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{temp.category}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  {useTemplate ? <Settings2 size={12} /> : (qrType === 'dynamic' ? <LinkIcon size={12} /> : <Type size={12} />)} 
                  {useTemplate ? 'Customize Content' : (qrType === 'dynamic' ? 'Redirect Target URL' : 'Content (URL, Text, etc.)')}
                </label>
                
                {!useTemplate ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={qrType === 'dynamic' ? "https://example.com/campaign" : "Enter unchangeable text or link..."}
                      className="w-full bg-[#14213D] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                    />
                  </div>
                ) : (
                  <div className="bg-[#14213D] border border-white/5 rounded-2xl p-4 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar scroll-smooth">
                    {selectedTemplate && (
                      <>
                        {/* Background Design */}
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-1">Background Design</p>
                           {/* Pro Palettes */}
                           <div className="space-y-2">
                             <p className="text-[8px] font-bold text-slate-500 uppercase">Pro Color Presets</p>
                             <div className="grid grid-cols-3 gap-2">
                               {proPalettes.map(p => (
                                 <button 
                                   key={p.name}
                                   onClick={() => setCustomConfig({
                                     ...customConfig,
                                     background: { ...customConfig.background, color: p.bg, gradient: 'none' },
                                     title: { ...customConfig.title, color: p.text },
                                     cta: { ...customConfig.cta, bgColor: p.accent },
                                     qrCode: { ...customConfig.qrCode, fgColor: p.qr }
                                   })}
                                   className="group flex flex-col items-center gap-1.5 p-2 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-all"
                                 >
                                   <div className="flex -space-x-1">
                                      <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: p.bg }}></div>
                                      <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: p.accent }}></div>
                                      <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: p.qr }}></div>
                                   </div>
                                   <span className="text-[7px] font-bold text-slate-500 group-hover:text-white truncate w-full text-center">{p.name}</span>
                                 </button>
                               ))}
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                               <span className="text-[8px] font-bold text-slate-500 uppercase">Base Color</span>
                              <input 
                                type="color" 
                                value={customConfig.background?.color}
                                onChange={(e) => setCustomConfig({...customConfig, background: {...customConfig.background, color: e.target.value}})}
                                className="w-full h-8 rounded border-0 bg-transparent p-0 cursor-pointer"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">Gradient</span>
                              <select 
                                value={customConfig.background?.gradient === 'none' ? 'none' : 'active'}
                                onChange={(e) => setCustomConfig({...customConfig, background: {...customConfig.background, gradient: e.target.value === 'none' ? 'none' : 'linear-gradient(135deg, #14213D 0%, #0B132B 100%)'}})}
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] text-white"
                              >
                                <option value="none">None</option>
                                <option value="active">Active</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Visual Assets */}
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-1">Visual Assets</p>
                          <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Logo URL</span>
                                <input 
                                  type="checkbox" 
                                  checked={customConfig.logo?.visible}
                                  onChange={(e) => setCustomConfig({...customConfig, logo: {...customConfig.logo, visible: e.target.checked}})}
                                />
                             </div>
                             <input 
                                type="text" 
                                value={customConfig.logo?.url}
                                onChange={(e) => setCustomConfig({...customConfig, logo: {...customConfig.logo, url: e.target.value}})}
                                placeholder="Logo image link..."
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white"
                             />
                          </div>
                          <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Banner Image</span>
                                <input 
                                  type="checkbox" 
                                  checked={customConfig.banner?.visible}
                                  onChange={(e) => setCustomConfig({...customConfig, banner: {...customConfig.banner, visible: e.target.checked}})}
                                />
                             </div>
                             <input 
                                type="text" 
                                value={customConfig.banner?.url}
                                onChange={(e) => setCustomConfig({...customConfig, banner: {...customConfig.banner, url: e.target.value}})}
                                placeholder="Banner image link..."
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white"
                             />
                          </div>
                        </div>

                        {/* Content & Typography */}
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-1">Content & Typography</p>
                          <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Heading Text</span>
                                <input 
                                   type="text" 
                                   value={customConfig.title?.text}
                                   onChange={(e) => setCustomConfig({...customConfig, title: {...customConfig.title, text: e.target.value}})}
                                   className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Base Color (Text)</span>
                                <input 
                                   type="color" 
                                   value={customConfig.title?.color || "#000000"}
                                   onChange={(e) => setCustomConfig({...customConfig, title: {...customConfig.title, color: e.target.value}})}
                                   className="w-full h-10 rounded border-0 bg-transparent p-0 cursor-pointer"
                                />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <span className="text-[8px] font-bold text-slate-500 uppercase">Description / CTA Text</span>
                             <textarea 
                                value={customConfig.description?.text}
                                onChange={(e) => setCustomConfig({...customConfig, description: {...customConfig.description, text: e.target.value}})}
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white h-16 resize-none"
                             />
                          </div>
                        </div>

                        {/* Matrix Positioning */}
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-1">QR Matrix Position</p>
                          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/5">
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">Visible</span>
                              <select 
                                value={customConfig.qrCode?.visible ? 'yes' : 'no'}
                                onChange={(e) => setCustomConfig({...customConfig, qrCode: {...customConfig.qrCode, visible: e.target.value === 'yes'}})}
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] text-white"
                              >
                                <option value="yes">Visible</option>
                                <option value="no">Hidden</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">Position</span>
                              <select 
                                value={customConfig.qrCode?.position}
                                onChange={(e) => setCustomConfig({...customConfig, qrCode: {...customConfig.qrCode, position: e.target.value}})}
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] text-white"
                              >
                                <option value="top">Top</option>
                                <option value="center">Center</option>
                                <option value="bottom">Bottom</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                             <div className="space-y-1">
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Pattern Color</span>
                                <input 
                                  type="color" 
                                  value={customConfig.qrCode?.fgColor || "#000000"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomConfig({...customConfig, qrCode: {...customConfig.qrCode, fgColor: val}});
                                    setFgColor(val);
                                  }}
                                  className="w-full h-8 rounded border-0 bg-transparent p-0 cursor-pointer"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Box Background</span>
                                <input 
                                  type="color" 
                                  value={customConfig.qrCode?.bgColor || "#ffffff"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomConfig({...customConfig, qrCode: {...customConfig.qrCode, bgColor: val}});
                                    setBgColor(val);
                                  }}
                                  className="w-full h-8 rounded border-0 bg-transparent p-0 cursor-pointer"
                                />
                             </div>
                          </div>
                        </div>

                         {/* Action Button */}
                         <div className="space-y-3">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-1">Call To Action Button</p>
                          <div className="space-y-2">
                             <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                  <span className="text-[8px] font-bold text-slate-500 uppercase">Label</span>
                                  <input 
                                     type="text" 
                                     value={customConfig.cta?.text}
                                     onChange={(e) => setCustomConfig({...customConfig, cta: {...customConfig.cta, text: e.target.value}})}
                                     className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-white"
                                  />
                               </div>
                               <div className="space-y-1">
                                  <span className="text-[8px] font-bold text-slate-500 uppercase">Target URL</span>
                                  <input 
                                     type="text" 
                                     value={customConfig.cta?.url}
                                     onChange={(e) => setCustomConfig({...customConfig, cta: {...customConfig.cta, url: e.target.value}})}
                                     className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-white"
                                  />
                               </div>
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                  <span className="text-[8px] font-bold text-slate-500 uppercase">Button Color</span>
                                  <input 
                                     type="color" 
                                     value={customConfig.cta?.bgColor || "#000000"}
                                     onChange={(e) => setCustomConfig({...customConfig, cta: {...customConfig.cta, bgColor: e.target.value}})}
                                     className="w-full h-8 rounded border-0 bg-transparent p-0 cursor-pointer"
                                  />
                               </div>
                               <div className="space-y-1">
                                  <span className="text-[8px] font-bold text-slate-500 uppercase">Button Text</span>
                                  <input 
                                      type="color" 
                                      value={customConfig.cta?.textColor || "#ffffff"}
                                      onChange={(e) => setCustomConfig({...customConfig, cta: {...customConfig.cta, textColor: e.target.value}})}
                                      className="w-full h-8 rounded border-0 bg-transparent p-0 cursor-pointer"
                                  />
                               </div>
                             </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) }
              </div>

              {/* Aesthetics */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={12} /> Visual Appearance
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">Pattern Color</span>
                    <div className="flex bg-[#14213D] border border-white/10 rounded-lg p-1.5 focus-within:border-orange-500/30 transition-colors">
                      <input 
                        type="color" 
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input 
                        type="text" 
                        value={fgColor.toUpperCase()}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-full bg-transparent border-none text-[11px] font-mono text-slate-300 focus:outline-none px-2 uppercase"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">Background</span>
                    <div className="flex bg-[#14213D] border border-white/10 rounded-lg p-1.5 focus-within:border-orange-500/30 transition-colors">
                      <input 
                        type="color" 
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input 
                        type="text" 
                        value={bgColor.toUpperCase()}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full bg-transparent border-none text-[11px] font-mono text-slate-300 focus:outline-none px-2 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Action */}
              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={handleGenerate}
                  disabled={!inputValue.trim() || isGenerating}
                  className={`w-full py-4 rounded-xl flex justify-center items-center gap-2 font-black italic tracking-widest uppercase text-xs transition-all ${
                    !inputValue.trim() 
                      ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                      : qrType === 'dynamic'
                        ? 'bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transform hover:-translate-y-0.5'
                      : 'bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5'
                  }`}
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Zap size={16} /> 
                      {qrType === 'dynamic' 
                        ? (useTemplate ? 'Deploy Smart Template' : 'Initialize Smart Node') 
                        : 'Generate Static Matrix'}
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Preview Column */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#050914]/50 rounded-2xl border border-white/5 relative min-h-[600px] overflow-hidden">
             
             {/* Background Effects */}
             {qrType === 'dynamic' && !useTemplate && (
                <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 to-transparent pointer-events-none rounded-2xl"></div>
             )}
             {(qrType === 'static' || (qrType === 'dynamic' && useTemplate)) && (
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none rounded-2xl"></div>
             )}

             {/* Template Preview Mockup */}
             {useTemplate && selectedTemplate && !qrValue && (
                <div className="w-full max-w-[300px] animate-in zoom-in-95 duration-500">
                   <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[550px] w-[280px] shadow-xl overflow-hidden">
                      <div className="w-[148px] h-[18px] bg-gray-800 top-0 left-1/2 -translate-x-1/2 absolute rounded-b-[1rem] z-20"></div>
                      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                      <div className="rounded-[2rem] overflow-y-auto h-full bg-white custom-scrollbar-blue scroll-smooth">
                         <TemplateRenderer templateName={selectedTemplate.name} config={customConfig} />
                      </div>
                   </div>
                   <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 mt-6">Live Asset Preview</p>
                </div>
             )}

             {qrValue ? (
               <div className="relative animate-in zoom-in-95 duration-500 flex flex-col items-center">
                 {/* QR Canvas */}
                 <div 
                   className="p-6 md:p-8 bg-white rounded-3xl shadow-2xl relative group"
                   style={{ backgroundColor: bgColor }}
                 >
                   {/* Scanning decoration lines */}
                   <div className="absolute -inset-1 border border-white/10 rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                   
                   <QRCode
                     id="qr-code-svg"
                     value={qrValue}
                     size={240}
                     bgColor={bgColor}
                     fgColor={fgColor}
                     style={{ height: "auto", maxWidth: "100%", width: "100%", display: "block" }}
                     viewBox="0 0 256 256"
                   />
                 </div>

                 {/* Success Badge */}
                 <div className="mt-8 mb-4 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                   <Check size={14} className="stroke-[3]" />
                   <span className="text-[10px] font-black tracking-widest uppercase">Generation Successful</span>
                 </div>

                 <p className="text-slate-400 text-xs mt-2 mb-8 max-w-[300px] text-center font-medium truncate" title={qrValue}>
                   {qrType === 'dynamic' ? 'Live Telemetry Active' : 'Static Raw Output'}
                 </p>

                 {/* Action Panel */}
                 <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg">
                   <button 
                     onClick={handleDownload}
                     className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-black tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-lg"
                   >
                     <Download size={16} className="text-blue-400" /> Export PNG
                   </button>
                   
                   {qrType === 'dynamic' && generatedId && (
                     <button 
                       onClick={() => router.push('/standee')}
                       className="flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-white text-[11px] font-black tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/10"
                     >
                       <Layers size={16} className="text-cyan-400" /> Print Standee
                     </button>
                   )}
                 </div>
               </div>
             ) : (
               <div className="text-center flex flex-col items-center gap-4 text-slate-500 opacity-50">
                 <div className="w-24 h-24 border-2 border-dashed border-slate-600 rounded-2xl flex items-center justify-center">
                   <QrCode size={40} className="text-slate-600" />
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-widest max-w-[200px]">Awaiting telemetry parameters to initialize nexus</p>
               </div>
             )}
          </div>

        </main>
      </div>

    </div>
  );
}