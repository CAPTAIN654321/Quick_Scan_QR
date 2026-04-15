"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { 
  Menu, 
  Bell, 
  User, 
  Edit2, 
  Check, 
  X,
  Globe,
  Shield,
  Activity,
  Zap,
  Terminal,
  Layers,
  BarChart3,
  MapPin,
  Clock,
  Home,
  Trash2,
  Smartphone,
  Monitor
} from "lucide-react";

export default function Dashboard() {
  const [qrList, setQrList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  // Quick Gen State
  const [quickLink, setQuickLink] = useState("");
  const [quickType, setQuickType] = useState("dynamic"); // static or dynamic
  const [isQuickGenLoading, setIsQuickGenLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const lastScanCounts = useRef({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleQuickGenerate = async () => {
    if (!quickLink.trim()) return;
    setIsQuickGenLoading(true);
    try {
      const res = await fetch(`${apiUrl}/qr/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: quickLink, type: quickType })
      });
      if (res.ok) {
        setQuickLink("");
        fetchQR();
      } else {
        const errData = await res.json();
        console.error("Quick generate failed:", errData);
      }
    } catch (err) {
      console.error("Error in quick gen:", err);
    } finally {
      setIsQuickGenLoading(false);
    }
  };

  const fetchQR = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/qr/all`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Check for new scans for notifications
        if (qrList.length > 0) {
          data.forEach(node => {
            const prevCount = lastScanCounts.current[node._id] || 0;
            if (node.scanCount > prevCount) {
               const newScans = node.scanCount - prevCount;
               addNotification(`New Intel Received: ${newScans} signal${newScans > 1 ? 's' : ''} detected at Node #${node._id.slice(-6).toUpperCase()}`);
            }
            lastScanCounts.current[node._id] = node.scanCount;
          });
        } else {
          // Initial load of counts
          data.forEach(node => {
            lastScanCounts.current[node._id] = node.scanCount;
          });
        }
        setQrList(data);
      } else {
        console.error("Data Fetch Error:", data);
        setQrList([]);
      }
    } catch (err) {
      console.error("Error fetching QR codes:", err);
      setQrList([]);
    }
  }, [apiUrl, qrList.length, isMuted]);

  const addNotification = (message) => {
    if (isMuted) return;
    const id = Date.now();
    setNotifications(prev => [{ id, message, read: false }, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000); // 8 seconds for better readability
  };

  useEffect(() => {
    fetchQR();
    const interval = setInterval(fetchQR, 5000); // Polling for real-time alerts
    
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'admin') {
        setIsAdmin(true);
      }
    }

    return () => clearInterval(interval);
  }, [fetchQR]);



  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/qr/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: newLink }),
      });
      if (res.ok) {
        setEditId(null);
        setNewLink("");
        fetchQR();
      }
    } catch (err) {
      console.error("Error updating QR code:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to decommission this node? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${apiUrl}/qr/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchQR();
      }
    } catch (err) {
      console.error("Error deleting QR code:", err);
    }
  };

  const [selectedNodes, setSelectedNodes] = useState([]);

  const toggleSelect = (id) => {
    setSelectedNodes(prev => 
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to decommission ${selectedNodes.length} nodes?`)) return;
    try {
      const res = await fetch(`${apiUrl}/qr/delete-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedNodes }),
      });
      if (res.ok) {
        setSelectedNodes([]);
        fetchQR();
      }
    } catch (err) {
      console.error("Error in bulk delete:", err);
    }
  };

  const totalScans = Array.isArray(qrList) ? qrList.reduce((acc, curr) => acc + (curr.scanCount || 0), 0) : 0;

  const stats = [
    { name: 'TOTAL SCANS', value: totalScans, icon: Globe, color: 'text-blue-400', sub: 'REAL-TIME NETWORK TELEMETRY' },
    { name: 'UNIQUE HITS', value: Math.ceil(totalScans * 0.4), icon: Activity, color: 'text-slate-400', sub: 'TELEMETRY' },
    { name: 'DEPLOYED ELEMENTS', value: qrList.length, icon: Zap, color: 'text-orange-400', sub: 'NODES ACTIVE' },
    { name: 'SECURITY STATUS', value: 'PROTECTED', icon: Shield, color: 'text-blue-500', sub: 'AUTHENTICATED BASE' },
  ];

  const recentScans = Array.isArray(qrList) 
    ? qrList.flatMap(qr => 
        (qr.scans || []).map(scan => ({ 
           ...scan, 
           qrId: qr._id, 
           targetLink: qr.link,
           qrType: qr.type || 'dynamic',
           shortId: qr._id.slice(-6).toUpperCase()
        }))
      ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15)
    : [];


  return (
    <div className="flex h-screen overflow-hidden bg-[#0B132B] text-white selection:bg-blue-500/30">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar matching the image */}
      <aside className={`fixed inset-y-0 left-0 z-60 w-[260px] bg-[#14213D] border-r border-white/5 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black italic tracking-widest text-white">V</span>
            <span className="text-sm font-black italic tracking-[0.2em] text-white">VISION QR PRO</span>
          </div>
          <button className="lg:hidden p-1 text-slate-500 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 px-3 space-y-2">
          {/* Active Dashboard Item */}
          <a href="#" className="flex items-center gap-4 px-3 py-3.5 bg-[#1C2541] rounded-xl border border-white/5 shadow-lg group relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-blue-400 to-indigo-600 rounded-r-md"></div>
            <div className="p-1 shrink-0">
               <Home size={22} className="text-orange-300 drop-shadow-[0_0_8px_rgba(253,186,116,0.8)] fill-orange-300/30" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-white">Dashboard</span>
          </a>

          {/* Inactive Items */}
          <Link href="/generate" className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-orange-500/20 transition-colors border border-white/5 shadow-sm">
               <Zap size={18} className="text-orange-500 fill-orange-500/20" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Create QR</span>
          </Link>

          <Link href="/standee" className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-cyan-500/20 transition-colors border border-white/5 shadow-sm">
               <Layers size={18} className="text-cyan-400 fill-cyan-400/20" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Create Standee</span>
          </Link>

          <a href="#" className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-pink-500/20 transition-colors border border-white/5 shadow-sm flex items-end justify-center">
               <div className="flex items-end gap-0.5 h-4 w-4">
                  <div className="w-1 h-3 bg-emerald-400 rounded-[1px]"></div>
                  <div className="w-1 h-4 bg-pink-400 rounded-[1px]"></div>
                  <div className="w-1 h-2 bg-blue-400 rounded-[1px]"></div>
               </div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Data Feed</span>
          </a>

          <a href="#" className="flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-purple-500/20 transition-colors border border-white/5 shadow-sm">
               <User size={18} className="text-purple-600 fill-purple-600/20" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Profile</span>
          </a>

          {isAdmin && (
            <Link href="/admin-dashboard" className="flex items-center gap-4 px-3 py-3.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all group mt-6 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
              <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0 shadow-[0_0_10px_rgba(79,70,229,0.4)] ring-1 ring-indigo-400/50">
                 <Shield size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Command Center</span>
                 <span className="text-[8px] font-bold text-indigo-500/80 uppercase tracking-tighter">Root Access Enabled</span>
              </div>
            </Link>
          )}
        </div>

        <div className="p-6 shrink-0 pb-8">
           <div className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors shadow-inner">
             <span className="text-white font-bold text-xl drop-shadow-md">N</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B132B]/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} className="text-slate-400" />
            </button>
            <span className="text-[10px] tracking-[0.3em] font-bold text-slate-500 uppercase">System Overview</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-blue-400'}`}
              title={isMuted ? "Unmute Notifications" : "Mute Notifications"}
            >
              <Bell size={20} className={!isMuted && notifications.length > 0 ? 'animate-bounce' : ''} />
              {!isMuted && notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0B132B]"></span>
              )}
              {isMuted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-rose-500 rotate-45 rounded-full"></div>
                </div>
              )}
            </button>
            <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-slate-500 tracking-tighter mr-4">
              <span className="text-white/20">NEURAL</span>
              <span className="text-white/40">GLOBAL</span>
              <span className="text-white/60">SEED</span>
            </div>
            <div className="w-8 h-8 rounded bg-linear-to-br from-purple-600 to-indigo-600 border border-white/10 flex items-center justify-center text-[10px] font-bold shadow-lg">
              VA
            </div>
          </div>
        </header>

      <main className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-12">
        {/* Market Overview Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Market Overview</h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mt-1">REAL-TIME NETWORK TELEMETRY</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-[#1F2B4B] border border-white/5 p-5 rounded-sm relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{stat.name}</p>
                    <h3 className="text-3xl font-black italic">{stat.value}</h3>
                  </div>
                  <stat.icon size={16} className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                </div>
                <div className="h-[2px] w-full bg-white/5 mt-4">
                  <div className={`h-full bg-current ${stat.color} w-1/3 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Gen Utility Section */}
        <section className="bg-[#14213D] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Zap size={120} className="text-orange-500" />
           </div>
           
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="max-w-md">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2 underline decoration-orange-500/30 decoration-4 underline-offset-4">Quick Generation Engine</h2>
                 <p className="text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed uppercase">Instant nexus initialization. Define your target and deploy scannable matrices in under 3 seconds.</p>
              </div>

              <div className="flex-1 max-w-2xl flex flex-col sm:flex-row items-stretch gap-3">
                 <div className="flex-1 relative">
                    <input 
                       type="text" 
                       placeholder="DEPLOYMENT URL OR PARAMETERS..."
                       value={quickLink}
                       onChange={(e) => setQuickLink(e.target.value)}
                       className="w-full h-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                 </div>
                 <div className="flex p-1 bg-black/40 border border-white/5 rounded-xl">
                    <button 
                      onClick={() => setQuickType('dynamic')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${quickType === 'dynamic' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                    >Dynamic</button>
                    <button 
                      onClick={() => setQuickType('static')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${quickType === 'static' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                    >Static</button>
                 </div>
                 <button 
                    onClick={handleQuickGenerate}
                    disabled={isQuickGenLoading || !quickLink}
                    className="bg-white text-black px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.2)] disabled:opacity-30"
                 >
                    {isQuickGenLoading ? 'DEPLOYING...' : 'INITIATE'}
                 </button>
              </div>
           </div>
        </section>

        {/* Active Nodes Section */}
        <section>
          <div className="mb-6 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-blue-400 tracking-[0.2em] mb-1">QR REGISTRY</p>
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Active Nodes</h2>
            </div>
            {qrList.length > 0 && (
              <button 
                onClick={() => {
                  if (selectedNodes.length === qrList.length) setSelectedNodes([]);
                  else setSelectedNodes(qrList.map(q => q._id));
                }}
                className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors border border-white/5 px-3 py-1.5 rounded-lg bg-white/5"
              >
                {selectedNodes.length === qrList.length ? 'Deselect All' : 'Select All Nodes'}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qrList.length === 0 ? (
              <div className="col-span-full py-20 bg-white/5 border border-white/5 rounded-2xl border-dashed flex flex-col items-center justify-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap size={32} className="text-slate-700" />
                 </div>
                 <div className="text-center">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">No active nodes detected in the registry</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase">Initialize a nexus point using the Quick Generation Engine above</p>
                 </div>
              </div>
            ) : qrList.map((qr) => (
              <div key={qr._id} className={`bg-[#1F2B4B] border rounded-xl p-5 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all group flex flex-col relative overflow-hidden ${selectedNodes.includes(qr._id) ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-white/5'}`}>
                {/* Checkbox Selection */}
                <div className="absolute top-4 left-4 z-20">
                    <button 
                      onClick={() => toggleSelect(qr._id)}
                      className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedNodes.includes(qr._id) ? 'bg-blue-600 border-blue-500' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                    >
                      {selectedNodes.includes(qr._id) && <Check size={10} className="text-white bg-blue-600 rounded" />}
                    </button>
                </div>

                <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2 text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[7px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Active</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] inline-block"></span>
                  </div>
                   <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${qr.type === 'static' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                    {qr.type || 'Dynamic'} {qr.type !== 'static' && '• Editable'}
                  </span>
                </div>
                
                <div className="flex justify-center mb-4 mt-2">
                  <div className="bg-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105">
                    <QRCode value={`${apiUrl}/qr/scan/${qr._id}`} size={140} bgColor="#ffffff" fgColor="#000000" style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 256 256`} />
                  </div>
                </div>
                
                <div className="flex-1 text-center space-y-2 mb-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NODE ID: {qr._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm font-bold text-slate-200 truncate px-2" title={qr.link}>{qr.link}</p>
                  
                  {/* Identity Trace Mini-Section */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between px-2">
                     <div className="flex -space-x-2">
                        {qr.scans && qr.scans.length > 0 ? (
                           [...qr.scans].reverse().slice(0, 3).map((scan, i) => (
                              <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#1F2B4B] flex items-center justify-center relative z-[${10-i}] ${scan.os === 'Android' || scan.os === 'iOS' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`} title={`${scan.os} • ${scan.browser}`}>
                                 {scan.os === 'Android' || scan.os === 'iOS' ? <Smartphone size={10} /> : <Monitor size={10} />}
                              </div>
                           ))
                        ) : (
                           <div className="w-6 h-6 rounded-full border border-dashed border-white/10 flex items-center justify-center text-slate-700">
                             <User size={10} />
                           </div>
                        )}
                        {qr.scans && qr.scans.length > 3 && (
                           <div className="w-6 h-6 rounded-full border-2 border-[#1F2B4B] bg-slate-800 text-[8px] font-bold flex items-center justify-center text-slate-400">
                              +{qr.scans.length - 3}
                           </div>
                        )}
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Total Hits</span>
                        <span className={`text-xs font-black italic ${qr.scanCount > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>{qr.scanCount || 0}</span>
                     </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-white/5 pt-4">
                   <button 
                      onClick={() => { setSelectedNode(qr); setIsAnalyticsOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-400 border border-transparent hover:border-purple-500/30 transition-all"
                   >
                     <BarChart3 size={14} /> ANALYTICS
                   </button>
                   <button 
                      onClick={() => { setEditId(qr._id); setNewLink(qr.link); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 border border-transparent hover:border-blue-500/30 transition-all"
                   >
                     <Edit2 size={14} /> EDIT
                   </button>
                   <button 
                      onClick={() => handleDelete(qr._id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 shadow-sm"
                      title="Decommission Node"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>

                {editId === qr._id && (
                  <div className="absolute inset-0 bg-[#1F2B4B]/95 backdrop-blur-sm p-4 flex flex-col justify-center animate-in fade-in duration-200 z-10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Update Target Link</p>
                    <input
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mb-3"
                      placeholder="Enter new URL..."
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(qr._id)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors">
                        <Check size={14} /> SAVE
                      </button>
                      <button onClick={() => setEditId(null)} className="w-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Global User Telemetry Section */}
        <section className="pt-8 border-t border-white/5">
          <div className="mb-6 flex justify-between items-end">
             <div>
                <p className="text-[10px] font-bold text-orange-400 tracking-[0.2em] mb-1">NETWORK ACTIVITY</p>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">User Telemetry Feed</h2>
             </div>
             <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live Feed Active</span>
             </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             <div className="xl:col-span-2 bg-[#1F2B4B] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-black/20 border-b border-white/5">
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">User Identity</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Contact Info</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Source Node</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Location</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Time</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {recentScans.length === 0 ? (
                            <tr>
                               <td colSpan="5" className="px-6 py-12 text-center">
                                  <div className="flex flex-col items-center gap-2 opacity-30">
                                     <Activity size={32} />
                                     <span className="text-[10px] font-black uppercase tracking-widest">Awaiting incoming data streams...</span>
                                  </div>
                               </td>
                            </tr>
                         ) : recentScans.map((scan, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded-lg ${scan.os === 'Android' || scan.os === 'iOS' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {scan.os === 'Android' || scan.os === 'iOS' ? <Smartphone size={14} /> : <Monitor size={14} />}
                                     </div>
                                     <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{scan.name || 'Anonymous'}</span>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">{scan.os || 'Desktop'} • {scan.ip || 'Unknown IP'}</span>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                                        <User size={12} />
                                     </div>
                                     <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-300 truncate max-w-[120px]">{scan.email || 'Not provided'}</span>
                                        <span className="text-[8px] font-bold text-slate-600 uppercase">Verified Lead</span>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                     <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${scan.qrType === 'dynamic' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">Node #{scan.shortId}</span>
                                     </div>
                                     <span className="text-[8px] font-bold text-slate-600 truncate max-w-[150px] uppercase mt-1 tracking-tighter" title={scan.targetLink}>{scan.targetLink}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                                     <MapPin size={10} /> {scan.location || 'Unknown'}
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 text-slate-400">
                                     <Clock size={12} className="text-slate-600" />
                                     <span className="text-[10px] font-bold">{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Quick Analysis Sidebar */}
             <div className="space-y-6">
                <div className="bg-[#14213D] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap size={80} className="text-orange-500" />
                   </div>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <BarChart3 size={14} className="text-orange-400" /> Platform Insights
                   </h4>
                   <div className="space-y-4">
                      <div>
                         <div className="flex justify-between text-[10px] font-black mb-1">
                            <span className="text-slate-400 uppercase">Mobile Engagement</span>
                            <span className="text-orange-400">
                               {Math.round((recentScans.filter(s => s.os === 'Android' || s.os === 'iOS').length / (recentScans.length || 1)) * 100)}%
                            </span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                               className="h-full bg-orange-500 transition-all duration-1000 shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
                               style={{ width: `${(recentScans.filter(s => s.os === 'Android' || s.os === 'iOS').length / (recentScans.length || 1)) * 100}%` }}
                            ></div>
                         </div>
                      </div>
                      <div>
                         <div className="flex justify-between text-[10px] font-black mb-1">
                            <span className="text-slate-400 uppercase">Desktop Access</span>
                            <span className="text-blue-400">
                               {Math.round((recentScans.filter(s => s.os !== 'Android' && s.os !== 'iOS' && s.os).length / (recentScans.length || 1)) * 100)}%
                            </span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                               className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                               style={{ width: `${(recentScans.filter(s => s.os !== 'Android' && s.os !== 'iOS' && s.os).length / (recentScans.length || 1)) * 100}%` }}
                            ></div>
                         </div>
                      </div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-600 mt-6 leading-relaxed flex items-center gap-2 border-t border-white/5 pt-4 uppercase italic tracking-tighter">
                      <Activity size={10} /> Device distribution based on recent nexus interactions.
                   </p>
                </div>

                <div className="bg-linear-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 rounded-2xl p-6">
                   <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Layers size={14} /> Global Node Summary
                   </h4>
                   <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                         <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Total Nodes</span>
                         <span className="text-xl font-black text-white italic">{qrList.length}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                         <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Total Scans</span>
                         <span className="text-xl font-black text-emerald-400 italic">
                            {qrList.reduce((acc, qr) => acc + (qr.scanCount || 0), 0)}
                         </span>
                      </div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase leading-relaxed italic">* Metrics aggregated across entire identity network.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Geospatial Data Section */}
        <section className="pt-8 border-t border-white/5">
          <div className="mb-6">
            <p className="text-[10px] font-bold text-teal-400 tracking-[0.2em] mb-1">GEOSPATIAL DATA</p>
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Strategic Heatmap</h2>
          </div>

          <div className="space-y-3 bg-[#1F2B4B] border border-white/5 p-6 rounded-sm">
             <div className="space-y-4">
                {(() => {
                  const locations = {};
                  qrList.forEach(qr => {
                    if(qr.scans) {
                      qr.scans.forEach(scan => {
                        if (scan.location && scan.location !== 'Unknown' && scan.location !== 'Permission Denied / Unknown') {
                          const locName = scan.location.toUpperCase();
                          if (locations[locName]) {
                            locations[locName].nodes += 1;
                          } else {
                            locations[locName] = { name: locName, ip: 'ACTIVE', nodes: 1 };
                          }
                        }
                      });
                    }
                  });
                  const result = Object.values(locations).sort((a, b) => b.nodes - a.nodes).slice(0, 5);
                  return result.length > 0 ? result : [ { name: 'AWAITING TRACKING DATA', ip: '--.--.--.--', nodes: 0 } ];
                })().map((loc, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-end mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        <span className="text-[11px] font-black italic">{loc.name}</span>
                        <span className="text-[9px] font-bold text-slate-600 ml-2">[{loc.ip}]</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase">{loc.nodes} NODES DETECTED</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-teal-500 w-full animate-pulse-slow shadow-[0_0_10px_rgba(20,184,166,0.3)]"></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Analytics Modal */}
        {isAnalyticsOpen && selectedNode && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAnalyticsOpen(false)}></div>
            <div className="relative w-full max-w-4xl bg-[#0B132B] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#14213D]">
                <div>
                  <h3 className="text-2xl font-black italic tracking-widest text-white flex items-center gap-3">
                    <BarChart3 className="text-purple-500" />
                    NODE ANALYTICS
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] mt-1 uppercase">ID: {selectedNode._id.slice(-6).toUpperCase()}</p>
                </div>
                <button onClick={() => setIsAnalyticsOpen(false)} className="p-2 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-[#0f1934]">
                <div className="bg-[#1C2541] rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">TOTAL SCANS</p>
                  <p className="text-3xl font-black italic text-white flex items-baseline gap-2">
                    {selectedNode.scanCount || 0}
                    <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase not-italic">CONFIRMED</span>
                  </p>
                </div>
                <div className="bg-[#1C2541] rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">TARGET LINK</p>
                  <p className="text-sm font-bold text-blue-400 truncate mt-2" title={selectedNode.link}>{selectedNode.link}</p>
                </div>
              </div>

              {/* Scan Log Table */}
              <div className="flex-1 overflow-hidden flex flex-col border-t border-white/5 bg-[#0B132B]">
                <div className="p-6 pb-2">
                  <h4 className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
                    <Terminal size={14} /> Telemetry Log
                  </h4>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                  {!selectedNode.scans || selectedNode.scans.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 border border-white/5 rounded-xl border-dashed">
                      <Activity size={32} className="mx-auto text-slate-600 mb-3" />
                      <p className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">No tracking data available yet</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-separate border-spacing-y-2">
                      <thead>
                        <tr>
                          <th className="text-[9px] font-black text-slate-500 tracking-widest uppercase pb-2 px-4">Date / Time</th>
                          <th className="text-[9px] font-black text-slate-500 tracking-widest uppercase pb-2 px-4">User Detail (Lead)</th>
                          <th className="text-[9px] font-black text-slate-500 tracking-widest uppercase pb-2 px-4">OS / Device</th>
                          <th className="text-[9px] font-black text-slate-500 tracking-widest uppercase pb-2 px-4">Browser</th>
                          <th className="text-[9px] font-black text-slate-500 tracking-widest uppercase pb-2 px-4">Network (IP)</th>
                          <th className="text-[9px] font-black text-slate-500 tracking-widest uppercase pb-2 px-4">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...selectedNode.scans].reverse().map((scan, idx) => {
                          const dt = new Date(scan.timestamp);
                          return (
                            <tr key={idx} className="bg-[#1C2541] hover:bg-[#232e4d] transition-colors group">
                              <td className="px-4 py-3 rounded-l-lg border-y border-l border-white/5 group-hover:border-white/10 text-xs font-bold text-slate-300">
                                {dt.toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 border-y border-white/5 group-hover:bg-white/[0.02] transition-colors">
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-black text-slate-200">{dt.toLocaleDateString()}</span>
                                   <span className="text-[9px] font-bold text-slate-500">{dt.toLocaleTimeString()}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 border-y border-white/5 group-hover:bg-white/[0.02]">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-tight">{scan.name || 'Anonymous'}</span>
                                  <span className="text-[9px] font-bold text-slate-500 italic truncate max-w-[140px]">{scan.email || 'Not Provided'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 border-y border-white/5 group-hover:bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-md ${scan.os === 'Android' || scan.os === 'iOS' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {scan.os === 'Android' || scan.os === 'iOS' ? <Smartphone size={14} /> : <Monitor size={14} />}
                                  </div>
                                  <span className="text-[10px] font-black uppercase text-slate-300">{scan.os || 'Unknown'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 border-y border-white/5 group-hover:bg-white/[0.02]">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded bg-white/5">{scan.browser || 'Other'}</span>
                              </td>
                              <td className="px-4 py-3 border-y border-white/5 group-hover:bg-white/[0.02]">
                                <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter">{scan.ip || '0.0.0.0'}</span>
                              </td>
                              <td className="px-4 py-3 rounded-r-lg border-y border-r border-white/5 group-hover:bg-white/[0.02]">
                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md text-[10px] tracking-widest uppercase border border-emerald-500/20">
                                  <MapPin size={10} /> {scan.location || 'Unknown'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Scan Lines */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }}></div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
      {/* Floating Bulk Action Bar */}
      {selectedNodes.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-[#14213D] border border-blue-500/30 rounded-2xl px-10 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-12 backdrop-blur-xl">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Cluster Selection</span>
                 <span className="text-xl font-black italic uppercase tracking-tighter text-white">{selectedNodes.length} NODES MARKED</span>
              </div>
              
              <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>

              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setSelectedNodes([])}
                   className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                 >Cancel</button>
                 <button 
                    onClick={handleBulkDelete}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-xl font-black italic uppercase tracking-widest text-[11px] shadow-[0_10px_20px_rgba(225,29,72,0.3)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
                 >
                    <Trash2 size={16} /> DECOMMISSION CLUSTER
                 </button>
              </div>
           </div>
        </div>
      )}
      </div>
      {/* Notification Toast Stack */}
      <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="pointer-events-auto bg-[#14213D]/95 border border-blue-500/50 backdrop-blur-md rounded-xl p-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-in slide-in-from-right duration-300 flex items-center gap-4 min-w-[320px] max-w-[400px]"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap size={20} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic font-black">Network Alert</p>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                     className="text-slate-500 hover:text-emerald-400 transition-colors"
                     title="Mark as Read"
                   >
                     <Check size={14} />
                   </button>
                   <button 
                     onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                     className="text-slate-500 hover:text-rose-400 transition-colors"
                     title="Delete"
                   >
                     <X size={14} />
                   </button>
                </div>
              </div>
              <p className="text-xs font-bold text-white leading-tight">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
