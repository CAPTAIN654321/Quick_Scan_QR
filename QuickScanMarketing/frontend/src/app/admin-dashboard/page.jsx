"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, QrCode, Globe, Shield, Activity, Zap, BarChart3, 
  Menu, X, Search, Trash2, ShieldCheck, Home, Terminal, LogOut,
  ShoppingBag, MapPin, CreditCard, CheckCircle2, Clock, XCircle,
  Smartphone, Mail, Map as MapIcon, Database, ArrowRight, ChevronLeft,
  User, Inbox, Check, X as XIcon
} from "lucide-react";
import toast from "react-hot-toast";
import UserAuthWrapper from "@/components/UserAuthWrapper";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [qrList, setQrList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [metrics, setMetrics] = useState({ userCount: 0, qrCount: 0, scanCount: 0, orderCount: 0, pendingRequests: 0 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("overview"); 

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const [usersRes, pendingRes, qrRes, orderRes, metricsRes, telemetryRes] = await Promise.all([
        fetch(`${apiUrl}/admin/users`, { headers }),
        fetch(`${apiUrl}/admin/pending-users`, { headers }),
        fetch(`${apiUrl}/admin/qrs`, { headers }),
        fetch(`${apiUrl}/admin/orders`, { headers }),
        fetch(`${apiUrl}/admin/metrics`, { headers }),
        fetch(`${apiUrl}/admin/telemetry`, { headers })
      ]);

      const [uData, pData, qData, oData, mData, tData] = await Promise.all([
        usersRes.json(),
        pendingRes.json(),
        qrRes.json(),
        orderRes.json(),
        metricsRes.json(),
        telemetryRes.json()
      ]);

      setUsers(uData || []);
      setPendingUsers(pData || []);
      setQrList(qData || []);
      setOrders(oData || []);
      setTelemetry(tData || []);
      setMetrics(mData || { userCount: 0, qrCount: 0, scanCount: 0, orderCount: 0, pendingRequests: 0 });
    } catch (err) {
      console.error("Error fetching admin data:", err);
      toast.error("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      toast.error("Access denied. Admin only.");
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, [router, fetchData]);

  const updateUserStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/admin/update-user-status/${id}`, {
        method: "PUT",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Agent status updated to ${status}`);
        fetchData();
      } else {
        toast.error("Status update rejected by core");
      }
    } catch (err) {
      toast.error("Update cycle failed");
    }
  };

  const deleteUser = async (id, role, email) => {
    if (email === 'rahulvarma100000@gmail.com') {
      toast.error("Root Admin account is protected from decommissioning.");
      return;
    }
    if (!confirm("Are you sure you want to permanently remove this agent?")) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/admin/delete-user/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Agent removed from matrix");
        fetchData();
      } else {
        toast.error("Server rejected the deletion request");
      }
    } catch (err) {
      toast.error("Deletion cycle failed");
    }
  };

  const cancelOrder = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    updateOrderStatus(id, "Cancelled");
  };

  const updateOrderStatus = async (id, newStatus, agentNum = '') => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const body = { status: newStatus };
      if (agentNum) body.deliveryAgentNumber = agentNum;
      
      const res = await fetch(`${apiUrl}/order/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        toast.success(`Order status updated: ${newStatus}`);
        fetchData();
      } else {
        toast.error("Status update rejected");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const stats = [
    { name: 'TOTAL NODES', value: metrics.qrCount, icon: QrCode, color: 'text-orange-400', sub: 'CLUSTERS ACTIVE' },
    { name: 'ACTIVE USERS', value: metrics.userCount, icon: Users, color: 'text-blue-400', sub: 'AUTHORIZED AGENTS' },
    { name: 'PENDING ORDERS', value: metrics.orderCount, icon: ShoppingBag, color: 'text-emerald-400', sub: 'PHYSICAL DEPLOYMENTS' },
    { name: 'SYSTEM SCANS', value: metrics.scanCount, icon: Globe, color: 'text-indigo-400', sub: 'GLOBAL TELEMETRY' },
  ];

  if (loading) return (
    <div className="h-screen w-full bg-[#0B132B] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-400 font-mono text-xs animate-pulse">INITIALIZING ADMIN NEURAL INTERFACE...</p>
    </div>
  );

  return (
    <UserAuthWrapper>
      <div className="flex h-screen overflow-hidden bg-[#0B132B] text-white selection:bg-indigo-500/30 font-sans">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-[60] bg-[#14213D] border-r border-white/5 transform transition-all duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static ${isSidebarCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'}`}>
          <div className={`h-16 flex items-center justify-between px-6 shrink-0 ${isSidebarCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}>
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'hidden' : 'flex'}`}>
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                  <Shield size={18} className="text-white" />
               </div>
               <span className="text-sm font-black italic tracking-[0.2em] text-white uppercase">Command Center</span>
            </div>
            <button 
              className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all ${isSidebarCollapsed ? 'rotate-180' : ''}`}
              onClick={() => {
                  if (window.innerWidth >= 1024) {
                      setIsSidebarCollapsed(!isSidebarCollapsed);
                  } else {
                      setIsSidebarOpen(false);
                  }
              }}
            >
              {isSidebarCollapsed ? <ArrowRight size={16} /> : <X size={16} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-4 px-3 space-y-2 custom-scrollbar">
             <button onClick={() => setView("overview")} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group ${view === 'overview' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <BarChart3 size={18} className={view === 'overview' ? 'text-indigo-400' : 'text-slate-500'} />
               {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'overview' ? 'text-indigo-300' : 'text-slate-500'}`}>Overview</span>}
             </button>

             <button onClick={() => setView("requests")} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group relative ${view === 'requests' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <Inbox size={18} className={view === 'requests' ? 'text-indigo-400' : 'text-slate-500'} />
               {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'requests' ? 'text-orange-300' : 'text-slate-500'}`}>Approval Queue</span>}
               {metrics.pendingRequests > 0 && (
                 <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-500 text-[8px] flex items-center justify-center font-black animate-pulse">{metrics.pendingRequests}</span>
               )}
             </button>

             <button onClick={() => setView("users")} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group ${view === 'users' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <Users size={18} className={view === 'users' ? 'text-indigo-400' : 'text-slate-500'} />
               {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'users' ? 'text-indigo-300' : 'text-slate-500'}`}>User Registry</span>}
             </button>

             <button onClick={() => setView("qrs")} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group ${view === 'qrs' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <QrCode size={18} className={view === 'qrs' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
               {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'qrs' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>Matrix Nodes</span>}
             </button>

             <button onClick={() => setView("telemetry")} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group ${view === 'telemetry' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <Database size={18} className={view === 'telemetry' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
               {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'telemetry' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>User Telemetry</span>}
             </button>

             <button onClick={() => setView("orders")} className={`w-full flex items-center gap-4 py-3.5 rounded-xl transition-all group ${view === 'orders' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'} ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <ShoppingBag size={18} className={view === 'orders' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
               {!isSidebarCollapsed && <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'orders' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>Fulfillment Registry</span>}
             </button>

             <Link href="/profile" className={`flex items-center gap-4 py-3.5 rounded-xl hover:bg-white/5 transition-all group ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <User size={18} className="text-purple-500 group-hover:text-purple-400" />
               {!isSidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap text-slate-500 group-hover:text-slate-300">Identity Profile</span>}
             </Link>

             <div className={`pt-8 pb-2 ${isSidebarCollapsed ? 'hidden' : 'px-4'}`}>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Authorized Access</p>
             </div>
             
             <Link href="/dashboard" className={`flex items-center gap-4 py-3.5 rounded-xl hover:bg-white/5 transition-all text-slate-500 hover:text-white ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4'}`}>
               <Home size={18} />
               {!isSidebarCollapsed && <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">Back to Hub</span>}
             </Link>
          </div>
          
          <div className={`p-6 shrink-0 pb-8 space-y-3 ${isSidebarCollapsed ? 'px-0 flex flex-col items-center' : ''}`}>
             <button
               onClick={handleLogout}
               className={`flex items-center gap-3 py-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 group ${isSidebarCollapsed ? 'w-10 justify-center' : 'w-full px-3'}`}
             >
               <LogOut size={16} className="group-hover:text-rose-400" />
               {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Logout</span>}
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative bg-[#0B132B]">
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B132B]/90 backdrop-blur-xl sticky top-0 z-40">
             <div className="flex items-center gap-4">
               <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                 <Menu size={20} className="text-slate-400" />
               </button>
               <div className="flex items-center gap-2 text-slate-400">
                  <Terminal size={14} />
                  <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-indigo-400/80">Command_Center / {view}</span>
               </div>
             </div>

             <div className="flex items-center gap-4">
                {metrics.pendingRequests > 0 && (
                  <button onClick={() => setView('requests')} className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                    <Inbox size={14} /> {metrics.pendingRequests} PENDING SIGNUPS
                  </button>
                )}
                <button onClick={handleLogout} className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 flex items-center justify-center transition-all">
                  <LogOut size={16} />
                </button>
             </div>
          </header>

          <main className="p-8 max-w-[1400px] mx-auto w-full space-y-10 pb-20">
             {/* Section Header */}
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] mb-1">CENTRAL NETWORK INTELLIGENCE</p>
                   <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                     {view === 'overview' ? 'System Overview' : 
                      view === 'requests' ? 'Approval Protocol' : 
                      view.toUpperCase() + ' REGISTRY'}
                   </h1>
                </div>
                <div className="hidden md:block text-right">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nexus System Core</p>
                   <p className="text-xs font-bold text-emerald-400">ENCRYPTED // ACTIVE</p>
                </div>
             </div>

             {/* Metrics Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-[#14213D] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                       <stat.icon size={64} className={stat.color} />
                    </div>
                    <div className="relative z-10">
                       <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">{stat.name}</p>
                       <p className="text-3xl font-black italic tracking-tighter text-white">{stat.value}</p>
                       <p className="text-[9px] font-bold text-slate-600 tracking-tighter uppercase mt-1">{stat.sub}</p>
                    </div>
                  </div>
                ))}
             </div>

             {/* Content Views */}
             {view === "overview" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                   <div className="bg-[#14213D] border border-white/5 rounded-[2rem] p-8">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                         <Users size={20} className="text-blue-400" /> Authorized Agents
                      </h3>
                      <div className="space-y-4">
                         {users.slice(-5).reverse().map((user, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-black">{user.name?.[0].toUpperCase()}</div>
                                  <div>
                                     <p className="text-sm font-bold text-white">{user.name}</p>
                                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{user.email}</p>
                                  </div>
                               </div>
                               <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{user.role}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#14213D] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group transition-all hover:border-orange-500/30">
                      {metrics.pendingRequests > 0 ? (
                        <>
                          <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)] animate-pulse">
                             <Inbox size={40} />
                          </div>
                          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Join Request Detected</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed mb-6">There are {metrics.pendingRequests} agents awaiting clearance in the intake manifold.</p>
                          <button onClick={() => setView('requests')} className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-400 transition-all shadow-lg shadow-orange-900/40">
                             Intercept Signals
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                             <ShieldCheck size={40} />
                          </div>
                          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Matrix Secure</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">System backbone integrity verified. No breaches detected in current cycle.</p>
                        </>
                      )}
                   </div>
                </div>
             )}

             {view === "requests" && (
                <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5">
                   <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter">Pending Approval Protocol</h2>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                         <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Awaiting Verification</span>
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-black/20 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-white/5">
                               <th className="px-8 py-5">Registrant Details</th>
                               <th className="px-8 py-5">Request Time</th>
                               <th className="px-8 py-5 text-right">Verification Action</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {pendingUsers.map((user) => (
                               <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                  <td className="px-8 py-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-lg">{user.name?.[0].toUpperCase()}</div>
                                        <div>
                                           <p className="text-sm font-black text-white">{user.name}</p>
                                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{user.email}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="flex flex-col gap-1">
                                        <p className="text-xs font-bold text-white uppercase tracking-tight">{new Date(user.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(user.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      <div className="flex items-center justify-end gap-3">
                                         <button 
                                            onClick={() => updateUserStatus(user._id, 'approved')}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/10"
                                         >
                                            <Check size={14} /> Approve Agent
                                         </button>
                                         <button 
                                            onClick={() => updateUserStatus(user._id, 'rejected')}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/10"
                                         >
                                            <XIcon size={14} /> Reject Access
                                         </button>
                                      </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                      {pendingUsers.length === 0 && (
                        <div className="py-24 text-center flex flex-col items-center justify-center gap-6">
                           <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-700 border border-white/5">
                              <Inbox size={40} />
                           </div>
                           <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">No incoming agent requests detected</p>
                        </div>
                      )}
                   </div>
                </div>
             )}

             {view === "users" && (
                <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                   <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter">Authorized Agent Database</h2>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-black/20 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-white/5">
                               <th className="px-8 py-5">Profile</th>
                               <th className="px-8 py-5">Security Level</th>
                               <th className="px-8 py-5 text-right">Operation</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                               <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                  <td className="px-8 py-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 font-black text-sm border border-white/10">{user.name?.[0].toUpperCase()}</div>
                                        <div>
                                           <p className="text-sm font-black text-white">{user.name}</p>
                                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{user.email}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <span className={`text-[9px] font-black px-3 py-1 rounded-md border uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(79,70,229,0.1)]' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                        {user.role}
                                     </span>
                                     {user.status && (
                                       <span className={`ml-2 text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${user.status === 'approved' ? 'text-emerald-400 border-emerald-500/20' : 'text-rose-400 border-rose-500/20'}`}>
                                          {user.status}
                                       </span>
                                     )}
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      {user.email !== 'rahulvarma100000@gmail.com' ? (
                                        <button onClick={() => deleteUser(user._id, user.role, user.email)} className="bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                          Decommission
                                        </button>
                                      ) : (
                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic border border-white/5 px-4 py-2 rounded-xl">Protected</span>
                                      )}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

              {view === "qrs" && (
                 <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                       <h2 className="text-2xl font-black italic uppercase tracking-tighter">Matrix Node Registry</h2>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="bg-black/20 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-white/5">
                                <th className="px-8 py-5">Node Identity</th>
                                <th className="px-8 py-5 text-center">Engagement (Scans)</th>
                                <th className="px-8 py-5 text-center">Signal Status</th>
                                <th className="px-8 py-5 text-right">Registry Operations</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                             {qrList.map((qr) => (
                                <tr key={qr._id} className="hover:bg-white/[0.02] transition-colors group">
                                   <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <QrCode size={18} />
                                         </div>
                                         <div>
                                            <p className="text-sm font-black text-white italic uppercase">{qr.customConfig?.title?.text || qr.customConfig?.title || 'Dynamic Node'}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[150px]">{qr.link}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-8 py-6 text-center">
                                      <div className="inline-flex flex-col">
                                         <span className="text-lg font-black italic text-white leading-none">{qr.scanCount || 0}</span>
                                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Bursts</span>
                                      </div>
                                   </td>
                                   <td className="px-8 py-6 text-center">
                                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">Active Signal</span>
                                   </td>
                                   <td className="px-8 py-6 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                         <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/10 transition-all">
                                            <Search size={14} />
                                         </button>
                                         <button className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                                            <Trash2 size={14} />
                                         </button>
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                       {qrList.length === 0 && (
                          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                              <QrCode size={40} className="text-slate-800" />
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No nodes registered in the matrix</p>
                          </div>
                       )}
                    </div>
                 </div>
              )}

              {view === "orders" && (
                <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                   <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter">Order Fulfillment Registry</h2>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-black/20 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-white/5">
                               <th className="px-8 py-5">Product / Standee</th>
                               <th className="px-8 py-5">Shipping Intel (Address)</th>
                               <th className="px-8 py-5">Internal Metrics</th>
                               <th className="px-8 py-5">Payment / Status</th>
                               <th className="px-8 py-5 text-right">Operation Registry</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                               <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                  <td className="px-8 py-6">
                                     <div className="space-y-1">
                                        <p className="text-xs font-black text-white uppercase tracking-tight">{order.format?.name || 'Standard Standee'}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{order.title || 'Untitled Project'}</p>
                                        <div className="flex gap-1 pt-1">
                                           <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-sm uppercase tracking-tighter border border-blue-500/10">{order.quantity} Units</span>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="space-y-1.5 p-3 bg-white/[0.03] border border-white/5 rounded-2xl">
                                        <p className="text-xs font-bold text-white uppercase">{order.address?.fullName}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                                           <MapPin size={10} className="text-indigo-400" />
                                           <span className="truncate max-w-[150px]">{order.address?.street}, {order.address?.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                                           <Smartphone size={10} className="text-indigo-400" />
                                           <span>{order.address?.phone}</span>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                           <p className="text-sm font-black italic text-white">${order.totalPrice?.toFixed(2)}</p>
                                           <span className="text-[8px] font-bold text-slate-600">USD</span>
                                        </div>
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                           <CreditCard size={10} /> {order.paymentMethod}
                                        </p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6">
                                     <div className="space-y-2">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                                           order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                           order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                           'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]'
                                        }`}>
                                           {order.status === 'Delivered' ? <CheckCircle2 size={10} /> : 
                                            order.status === 'Cancelled' ? <XCircle size={10} /> : <Clock size={10} />}
                                           {order.status}
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] block pl-1">{order._id.slice(-8).toUpperCase()}</p>
                                     </div>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                     <div className="flex items-center justify-end gap-2">
                                        {order.status === 'Pending' && (
                                           <>
                                              <button 
                                                 onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                 className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                                                 title="Mark as Delivered"
                                              >
                                                 <CheckCircle2 size={14} />
                                              </button>
                                              <button 
                                                 onClick={() => cancelOrder(order._id)}
                                                 className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                                 title="Cancel Order"
                                              >
                                                 <Trash2 size={14} />
                                              </button>
                                           </>
                                        )}
                                        {order.status !== 'Pending' && order.status !== 'Cancelled' && (
                                          <button 
                                             onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                             className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all uppercase tracking-widest"
                                          >
                                             <XCircle size={10} /> Cancel Order
                                          </button>
                                        )}
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}
             {view === "telemetry" && (
                <div className="space-y-8 animate-in mt-10 fade-in slide-in-from-bottom-5 duration-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Network Activity</p>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">User Telemetry Feed</h2>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Feed Active</span>
                        </div>
                    </div>

                    <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Identity</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Info</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Node</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Location</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {telemetry.map((log, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                                                        <Smartphone size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-white">{log.name || "Anonymous"}</h4>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                            <span>{log.os || "Unknown"}</span>
                                                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                                            <span>{log.ip || "0.0.0.0"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                               <div className="flex items-center gap-4">
                                                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                                     <Users size={16} />
                                                  </div>
                                                  <div>
                                                     <p className="text-[11px] font-bold text-slate-300">{log.email || "Not provided"}</p>
                                                     <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{log.phoneNumber || "Verified Lead"}</p>
                                                  </div>
                                               </div>
                                            </td>
                                            <td className="px-8 py-6">
                                               <div className="space-y-1">
                                                  <div className="flex items-center gap-2">
                                                     <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                     <span className="text-[10px] font-black text-white italic uppercase tracking-widest">{log.nodeTitle || "Dynamic Node"}</span>
                                                  </div>
                                                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">NODE #{log.qrId?.slice(-6).toUpperCase()}</p>
                                               </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                               <div className="inline-block px-3 py-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 text-[9px] font-black text-teal-400 uppercase tracking-widest leading-tight">
                                                  {log.location || "Location Unknown"}
                                               </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                               <div className="flex items-center justify-end gap-2 text-slate-400">
                                                  <p className="text-xs font-black text-white italic">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}</p>
                                                  <Clock size={12} className="opacity-40" />
                                               </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {telemetry.length === 0 && (
                              <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                                  <Activity size={40} className="text-slate-800" />
                                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Waiting for incoming signal bursts...</p>
                              </div>
                            )}
                        </div>
                    </div>
                </div>
             )}
          </main>
        </div>
      </div>
    </UserAuthWrapper>
  );
}
