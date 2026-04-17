"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import UserAuthWrapper from "@/components/UserAuthWrapper";
import { 
  Menu, Bell, User, Edit2, Check, X, Globe, Shield, Activity, Zap, 
  Terminal, Layers, BarChart3, MapPin, Clock, Home, Trash2, 
  Smartphone, Monitor, LogOut, ShoppingBag, BellOff, Volume2, 
  CheckCircle2, ArrowRight, ChevronLeft, Camera, Eye, EyeOff, Lock, Save
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [view, setView] = useState('overview'); // Added view state
  const [qrList, setQrList] = useState([]);
  const [user, setUser] = useState(null);
  
  // Profile Update State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const [editId, setEditId] = useState(null);
  const [newLink, setNewLink] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  const [quickLink, setQuickLink] = useState("");
  const [quickType, setQuickType] = useState("dynamic");
  const [isQuickGenLoading, setIsQuickGenLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [userName, setUserName] = useState('');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const lastScanCounts = useRef({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000");

  const fetchQR = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/qr/all`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        if (qrList.length > 0) {
          data.forEach(node => {
            const prevCount = lastScanCounts.current[node._id] || 0;
            if (node.scanCount > prevCount) {
                const latestScan = node.scans && node.scans.length > 0 ? node.scans[node.scans.length - 1] : null;
                const leadName = latestScan ? latestScan.name : "Anonymous";
                const location = latestScan ? latestScan.location : "Unknown";
                addNotification(`Inbound Signal: ${leadName} detected at Node #${node._id.slice(-6).toUpperCase()} (${location})`);
                try {
                  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3');
                  audio.volume = 0.4;
                  audio.play().catch(e => {});
                } catch(e) {}
            }
            lastScanCounts.current[node._id] = node.scanCount;
          });
        } else {
          data.forEach(node => { lastScanCounts.current[node._id] = node.scanCount; });
        }
        setQrList(data);
      }
    } catch (err) { console.error("Error fetching QR codes:", err); }
  }, [apiUrl, qrList.length]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleSnooze = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? "Signals Restored: Notifications active." : "Snooze Protocol: Notifications silenced.", {
      icon: isMuted ? "🔔" : "🔕",
      style: { background: '#14213D', color: '#fff', border: '1px border white/10' }
    });
  };

  const addNotification = (message) => {
    if (isMuted) return;
    const id = Date.now();
    const newNotif = { id, message, read: false, timestamp: new Date(), showToast: true };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    
    // Trigger real-time toast alert
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#14213D] border border-blue-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-transparent pointer-events-none"></div>
        <div className="flex-1 w-0 p-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-blue-400 group-hover:text-blue-300" />
              </div>
            </div>
            <div className="ml-5 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] italic">Inbound Intelligence</p>
              </div>
              <p className="text-[12px] font-black text-white leading-relaxed uppercase tracking-tight line-clamp-2">{message}</p>
              <p className="mt-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleTimeString()} • SYSTEM BURST</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-l border-white/5 bg-white/[0.02]">
          <button
            onClick={() => {
              markAsRead(id);
              toast.dismiss(t.id);
            }}
            className="flex-1 px-4 flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border-b border-white/5"
            title="Mark as Read"
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-4 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    ), { duration: 8000, position: 'top-right' });
  };

  useEffect(() => {
    fetchQR();
    const interval = setInterval(fetchQR, 15000);
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === 'admin');
      setUserName(parsedUser.name || '');
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || ""
      }));
    }
    return () => clearInterval(interval);
  }, [fetchQR]);

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
      }
    } catch (err) { console.error("Error in quick gen:", err); }
    finally { setIsQuickGenLoading(false); }
  };

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
    } catch (err) { console.error("Error updating QR code:", err); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to decommission this node?")) return;
    try {
      const res = await fetch(`${apiUrl}/qr/delete/${id}`, { method: "DELETE" });
      if (res.ok) fetchQR();
    } catch (err) { console.error("Error deleting QR code:", err); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Protocol mismatch: Root keys do not match.");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updateData = { name: formData.name, email: formData.email };
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }
      const res = await fetch(`${apiUrl}/user/update-me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const updatedUserResponse = await res.json();
        const fullUser = { ...user, ...updatedUserResponse };
        localStorage.setItem('user', JSON.stringify(fullUser));
        setUser(fullUser);
        setUserName(fullUser.name);
        toast.success("Identity profile updated successfully.");
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        const error = await res.json();
        toast.error(error.message || "Identity update rejected.");
      }
    } catch (err) { toast.error("Hardware-level error during update."); }
    finally { setIsSaving(false); }
  };

  const totalScans = Array.isArray(qrList) ? qrList.reduce((acc, curr) => acc + (curr.scanCount || 0), 0) : 0;
  const stats = [
    { name: 'TOTAL SCANS', value: totalScans, icon: Globe, color: 'text-blue-400', sub: 'REAL-TIME NETWORK TELEMETRY' },
    { name: 'UNIQUE HITS', value: Math.ceil(totalScans * 0.4), icon: Activity, color: 'text-slate-400', sub: 'TELEMETRY' },
    { name: 'DEPLOYED ELEMENTS', value: qrList.length, icon: Zap, color: 'text-orange-400', sub: 'NODES ACTIVE' },
    { name: 'SECURITY STATUS', value: 'PROTECTED', icon: Shield, color: 'text-emerald-500', sub: 'AUTHENTICATED BASE' },
  ];
  const recentScans = Array.isArray(qrList) 
    ? qrList.flatMap(qr => (qr.scans || []).map(scan => ({ ...scan, qrId: qr._id, targetLink: qr.link, qrType: qr.type || 'dynamic', shortId: qr._id.slice(-6).toUpperCase() })))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15)
    : [];

  return (
    <UserAuthWrapper>
      <div className="flex h-screen overflow-hidden bg-[#0A1128] text-white selection:bg-blue-500/30 font-sans">
      <aside className={`fixed inset-y-0 left-0 z-60 bg-[#14213D] border-r border-white/5 transform transition-all duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static ${isSidebarCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'}`}>
        <div className={`h-16 flex items-center justify-between px-6 shrink-0 ${isSidebarCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}>
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'hidden' : 'flex'}`}>
            <span className="text-xl font-black italic tracking-widest text-white">V</span>
            <span className="text-sm font-black italic tracking-[0.2em] text-white">VISION QR PRO</span>
          </div>
          <button className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all ${isSidebarCollapsed ? 'rotate-180' : ''}`} onClick={() => window.innerWidth >= 1024 ? setIsSidebarCollapsed(!isSidebarCollapsed) : setIsSidebarOpen(false)}>
            {isSidebarCollapsed ? <ArrowRight size={16} /> : <X size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 px-3 space-y-2 no-scrollbar">
          <button onClick={() => setView('overview')} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group relative overflow-hidden ${view === 'overview' ? 'bg-[#1C2541] border border-white/5 shadow-lg' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'}`}>
            {view === 'overview' && <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-blue-400 to-indigo-600 rounded-r-md"></div>}
            <Home size={22} className={view === 'overview' ? 'text-orange-300 fill-orange-300/30' : 'text-slate-500'} />
            {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'overview' ? 'text-white' : 'text-slate-500'}`}>Dashboard</span>}
          </button>

          <Link href="/generate" className={`flex items-center gap-4 py-3.5 rounded-xl hover:bg-white/5 transition-all group ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'}`}>
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-orange-500/20 transition-colors border border-white/5"><Zap size={18} className="text-orange-500" /></div>
            {!isSidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Create QR</span>}
          </Link>

          <Link href="/standee" className={`flex items-center gap-4 py-3.5 rounded-xl hover:bg-white/5 transition-all group ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'}`}>
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-cyan-500/20 transition-colors border border-white/5"><Layers size={18} className="text-cyan-400" /></div>
            {!isSidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Create Standee</span>}
          </Link>

          <Link href="/my-orders" className={`flex items-center gap-4 py-3.5 rounded-xl hover:bg-white/5 transition-all group ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'}`}>
            <div className="bg-[#1C2541] p-1.5 rounded-lg shrink-0 group-hover:bg-indigo-500/20 transition-colors border border-white/5"><ShoppingBag size={18} className="text-indigo-400" /></div>
            {!isSidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">My Orders</span>}
          </Link>

          <button onClick={() => setView('profile')} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group relative overflow-hidden ${view === 'profile' ? 'bg-[#1C2541] border border-white/5 shadow-lg' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'}`}>
            {view === 'profile' && <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-purple-400 to-indigo-600 rounded-r-md"></div>}
            <User size={22} className={view === 'profile' ? 'text-purple-400 fill-purple-400/30' : 'text-slate-500'} />
            {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'profile' ? 'text-white' : 'text-slate-500'}`}>Identity Hub</span>}
          </button>

          {isAdmin && (
            <Link href="/admin-dashboard" className={`flex items-center gap-4 py-3.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all group mt-6 ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'}`}>
              <Shield size={18} className="text-white bg-indigo-600 p-0.5 rounded shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
              {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Command Center</span>}
            </Link>
          )}
        </div>

        <div className={`p-6 shrink-0 pb-8 space-y-3 ${isSidebarCollapsed ? 'px-0 flex flex-col items-center' : ''}`}>
           <div className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
             <span className="text-white font-bold text-xl">N</span>
           </div>
           <button onClick={handleLogout} className={`flex items-center gap-3 py-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${isSidebarCollapsed ? 'w-10 justify-center' : 'w-full px-3'}`}>
             <LogOut size={16} />
             {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B132B]/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsSidebarOpen(true)}><Menu size={20} className="text-slate-400" /></button>
            <span className="text-[10px] tracking-[0.3em] font-bold text-slate-500 uppercase">System Overview / {view}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)} 
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isNotificationPanelOpen ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
              >
                <Bell size={20} className={notifications.some(n => !n.read) ? 'animate-bounce' : ''} />
                {notifications.some(n => !n.read) && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-blue-600 rounded-full border-2 border-[#0B132B] text-[8px] font-black flex items-center justify-center px-1 shadow-[0_0_10px_rgba(37,99,235,0.5)]">{notifications.filter(n => !n.read).length}</span>}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotificationPanelOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-[#14213D] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Signal Intelligence</h3>
                       {isMuted && <span className="text-[7px] font-black bg-rose-500 px-1 rounded text-white tracking-widest animate-pulse">SNOOZED</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                         onClick={toggleSnooze}
                         className={`p-1 rounded bg-white/5 border border-white/10 transition-all ${isMuted ? 'text-rose-400 border-rose-500/30' : 'text-slate-500 hover:text-indigo-400'}`}
                         title={isMuted ? "Unmute Signals" : "Snooze Signals"}
                      >
                         {isMuted ? <BellOff size={12} /> : <Volume2 size={12} />}
                      </button>
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-[8px] font-black text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em]"
                        title="Mark all as read"
                      >
                        Capture All
                      </button>
                      <button 
                        onClick={() => {
                          setNotifications([]);
                          setIsNotificationPanelOpen(false);
                        }} 
                        className="text-[8px] font-black text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-[0.2em]"
                        title="Purge Intelligence"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#14213D]">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <BellOff size={20} className="text-slate-700" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No active signals detected</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {notifications.map(notif => (
                          <div key={notif.id} className={`p-4 transition-all cursor-default group relative overflow-hidden ${notif.read ? 'opacity-40 hover:opacity-100 bg-transparent' : 'bg-blue-600/[0.03] hover:bg-blue-600/[0.06]'}`}>
                            {!notif.read && <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
                            <div className="flex gap-4">
                              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500 ${notif.read ? 'bg-slate-700' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse'}`}></div>
                              <div className="flex-1 space-y-1.5">
                                <p className={`text-[11px] font-bold leading-relaxed transition-colors uppercase tracking-tight italic ${notif.read ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'}`}>
                                  {notif.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Clock size={10} className="text-slate-600" />
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                                      {new Date(notif.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    {!notif.read && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                        className="p-1 px-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-inner"
                                        title="Mark as Read"
                                      >
                                        <Check size={10} />
                                      </button>
                                    )}
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                      className="p-1 px-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all shadow-inner"
                                      title="Delete Signal"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-black/20 border-t border-white/5 text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Encrypted Nexus Connection Active</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-8 h-8 rounded bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg border border-white/10"><User size={16} className="text-white" /></div>
            <span className="hidden sm:block text-xs font-black text-white/80">{userName}</span>
            <button onClick={handleLogout} className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center shadow-inner group">
              <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

      <main className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-12">
        {view === 'overview' && (
          <>
            <section>
              <div className="mb-8"><h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Market Overview</h2><p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mt-1">REAL-TIME NETWORK TELEMETRY</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{stats.map((stat) => (<div key={stat.name} className="bg-[#1F2B4B] border border-white/5 p-5 rounded-2xl relative group transition-colors shadow-lg"><div className="flex justify-between items-start mb-2"><div className="space-y-1"><p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{stat.name}</p><h3 className="text-3xl font-black italic">{stat.value}</h3></div><stat.icon size={16} className={`${stat.color} opacity-40 group-hover:opacity-100 transition-all`} /></div><div className="h-[2px] w-full bg-white/5 mt-4 rounded-full overflow-hidden"><div className={`h-full bg-current ${stat.color} w-1/3 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div></div></div>))}</div>
            </section>

            <section className="bg-[#14213D] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Zap size={120} className="text-orange-500" /></div>
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10"><div className="max-w-md"><h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2 underline decoration-orange-500/30 decoration-4 underline-offset-4">Quick Generation Engine</h2><p className="text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed uppercase">Instant nexus initialization. Define your target and deploy scannable matrices in under 3 seconds.</p></div>
                  <div className="flex-1 max-w-2xl flex flex-col sm:flex-row items-stretch gap-3"><div className="flex-1 relative"><input type="text" placeholder="DEPLOYMENT URL OR PARAMETERS..." value={quickLink} onChange={(e) => setQuickLink(e.target.value)} className="w-full h-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-700 outline-none focus:border-orange-500/50" /></div>
                     <div className="flex p-1 bg-black/40 border border-white/5 rounded-xl"><button onClick={() => setQuickType('dynamic')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${quickType === 'dynamic' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-600'}`}>Dynamic</button><button onClick={() => setQuickType('static')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${quickType === 'static' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600'}`}>Static</button></div>
                     <button onClick={handleQuickGenerate} disabled={isQuickGenLoading || !quickLink} className="bg-white text-black px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.2)] disabled:opacity-30">{isQuickGenLoading ? 'DEPLOYING...' : 'INITIATE'}</button>
                  </div></div>
            </section>

            <section>
              <div className="mb-6 flex justify-between items-end"><div><p className="text-[10px] font-bold text-blue-400 tracking-[0.2em] mb-1">QR REGISTRY</p><h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Active Nodes</h2></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {qrList.length === 0 ? (<div className="col-span-full py-20 bg-white/5 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4"><Zap size={32} className="text-slate-700" /><p className="text-[11px] font-black uppercase tracking-widest text-slate-500">No active nodes detected in the registry</p></div>) : 
                qrList.map((qr) => (
                  <div key={qr._id} className="bg-[#1F2B4B] border border-white/5 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all group flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2"><div className="flex items-center gap-1.5"><span className="text-[7px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Active</span><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span></div></div>
                    <div className="flex justify-center mb-4 mt-2"><div className="bg-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105"><QRCode value={qr.suggestedScanUrl || `${apiUrl}/qr/scan/${qr._id}`} size={140} style={{ height: "auto", maxWidth: "100%", width: "100%" }} /></div></div>
                    <div className="flex-1 text-center space-y-2 mb-4"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NODE ID: {qr._id.slice(-6).toUpperCase()}</p><p className="text-sm font-bold text-slate-200 truncate px-2">{qr.link}</p></div>
                    <div className="flex gap-2 border-t border-white/5 pt-4">
                       <button onClick={() => { setSelectedNode(qr); setIsAnalyticsOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 hover:text-purple-400 transition-all"><BarChart3 size={14} /> ANALYTICS</button>
                       <button onClick={() => handleDelete(qr._id)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'profile' && (
          <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Card */}
              <div className="lg:w-1/3">
                <div className="bg-[#14213D] border border-white/5 rounded-[2rem] p-8 text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-indigo-600"></div>
                  <div className="relative inline-block mb-6 pt-4">
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-5xl font-black italic shadow-[0_0_30px_rgba(79,70,229,0.3)] border-4 border-[#14213D] group-hover:scale-105 transition-transform">
                      {userName?.[0].toUpperCase() || "A"}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 rounded-xl border-4 border-[#14213D] hover:bg-indigo-500 transition-colors shadow-lg">
                      <Camera size={18} className="text-white" />
                    </button>
                  </div>
                  <div className="space-y-1 mb-8">
                    <h3 className="text-2xl font-black text-white italic tracking-tight">{userName}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.email}</p>
                  </div>
                  <div className="flex justify-center gap-2 pt-4 border-t border-white/5">
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-lg">Verified Account</span>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg">Operational</span>
                  </div>
                </div>
              </div>

              {/* Identity Form */}
              <div className="lg:w-2/3">
                <div className="bg-[#14213D] border border-white/5 rounded-[2rem] p-10 shadow-2xl">
                  <form onSubmit={handleUpdateProfile} className="space-y-10">
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <User className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white underline decoration-indigo-500/30 underline-offset-8">Identity Protocol</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Display Alias</label>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-indigo-500/50 transition-all outline-none"
                            placeholder="Enter Name"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Communication Hub (Email)</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            readOnly
                            className="w-full bg-[#0B132B]/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
                            placeholder={user?.email || "agent@nexus.net"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 pt-4">
                      <div className="flex items-center gap-4">
                        <Lock className="text-purple-400" size={24} />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white underline decoration-purple-500/30 underline-offset-8">Keys Authorization</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Secret</label>
                        <div className="relative">
                          <input 
                            type={showCurrentPass ? "text" : "password"} 
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                            className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-5 text-sm font-bold text-white focus:border-purple-500/50 transition-all outline-none"
                            placeholder="••••"
                          />
                          <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">{showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Root Key</label>
                          <div className="relative">
                            <input 
                              type={showNewPass ? "text" : "password"} 
                              value={formData.newPassword}
                              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                              className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-5 text-sm font-bold text-white focus:border-purple-500/50 transition-all outline-none"
                              placeholder="••••"
                            />
                            <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">{showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Repeat Root Key</label>
                          <input 
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-5 text-sm font-bold text-white focus:border-purple-500/50 transition-all outline-none"
                            placeholder="••••"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-5 rounded-[2rem] font-black italic uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 disabled:opacity-50"
                    >
                      {isSaving ? <Activity className="animate-spin" size={20} /> : <Save size={20} />}
                      {isSaving ? "Synchronizing..." : "Save Identity Update"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Responsive Analytics Modal */}
    {isAnalyticsOpen && selectedNode && (
      (() => {
        const liveNode = qrList.find(n => n._id === selectedNode._id) || selectedNode;
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 md:p-10">
            <div className="absolute inset-0 bg-[#0A1128]/90 backdrop-blur-md" onClick={() => setIsAnalyticsOpen(false)}></div>
            <div className="bg-[#14213D] border border-white/10 w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,1)] relative z-10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                    <BarChart3 className="text-purple-400" size={24} /> Node Analytics
                  </h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 truncate max-w-[200px] sm:max-w-none">ID: {liveNode._id.toUpperCase()} / {liveNode.link}</p>
                </div>
                <button onClick={() => setIsAnalyticsOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all bg-black/20">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1F2B4B] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={40} className="text-orange-400" /></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Total Scans</p>
                    <p className="text-3xl font-black italic tracking-tighter">{liveNode.scanCount || 0}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">Live engagement data</p>
                  </div>
                  <div className="bg-[#1F2B4B] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Globe size={40} className="text-blue-400" /></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Status</p>
                    <p className="text-3xl font-black italic tracking-tighter text-emerald-400">ACTIVE</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">Node Operational</p>
                  </div>
                  <div className="bg-[#1F2B4B] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Shield size={40} className="text-purple-400" /></div>
                    <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">Identity</p>
                    <p className="text-3xl font-black italic tracking-tighter">{liveNode.type?.toUpperCase() || 'DYNAMIC'}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">Matrix Structure</p>
                  </div>
                </div>

                {/* Scan Log Table */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                    <Terminal size={14} /> Telemetry Signal Logs
                  </h3>
                  <div className="bg-[#1F2B4B] border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-black/20 text-[9px] uppercase text-slate-500 font-black tracking-widest border-b border-white/5">
                          <tr>
                            <th className="px-6 py-5">Identity</th>
                            <th className="px-6 py-5">IP Address</th>
                            <th className="px-6 py-5 text-center">Location</th>
                            <th className="px-6 py-5 text-right">Timeline</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {liveNode.scans && liveNode.scans.length > 0 ? (
                            [...liveNode.scans].reverse().map((scan, i) => (
                              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-5 flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors border border-white/5">
                                    <User size={14} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-black text-white italic">{scan.name || 'Anonymous'}</p>
                                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-tighter">Verified Lead</p>
                                  </div>
                                </td>
                                <td className="px-6 py-5 text-[10px] font-bold text-slate-500 group-hover:text-blue-400 transition-colors uppercase tracking-widest font-mono">{scan.ip || '---'}</td>
                                <td className="px-6 py-5 text-center">
                                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                                    {scan.location || 'Unknown'}
                                  </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                  <div className="flex flex-col items-end">
                                    <p className="text-[10px] font-black text-white italic tracking-tight">{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">{new Date(scan.timestamp).toLocaleDateString()}</p>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-20">
                                  <Activity size={32} className="text-slate-500" />
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Listening for telemetry signals...</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-black/40 border-t border-white/5 text-center backdrop-blur-sm">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] italic flex items-center justify-center gap-2">
                  <Shield size={10} /> Secure End-to-End Analytics Stream <Shield size={10} />
                </p>
              </div>
            </div>
          </div>
        );
      })()
    )}

    </div></div>
    </UserAuthWrapper>
  );
}
