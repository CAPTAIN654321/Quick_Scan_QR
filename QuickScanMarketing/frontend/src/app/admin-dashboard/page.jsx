"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, QrCode, Globe, Shield, Activity, Zap, BarChart3, 
  Menu, X, Search, Trash2, ShieldCheck, Home, Terminal
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [qrList, setQrList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("overview"); // overview, users, qrs, activity

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const [usersRes, qrRes] = await Promise.all([
        fetch(`${apiUrl}/admin/users`, { headers }),
        fetch(`${apiUrl}/admin/qrs`, { headers })
      ]);

      const usersData = await usersRes.json();
      const qrData = await qrRes.json();

      setUsers(usersData);
      setQrList(qrData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      toast.error("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    console.log('Admin Dashboard Access Check:', userData);
    if (!userData) {
      console.log('No user data found, redirecting to login');
      router.push('/login');
      return;
    }
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      console.log('User role mismatch:', user.role, 'expected admin');
      toast.error("Access denied. Admin only.");
      router.push('/dashboard');
      return;
    }
    console.log('Admin access verified');

    fetchData();
  }, [router, fetchData]);

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/admin/delete-user/${id}`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("User removed from matrix");
      fetchData();
    } catch (err) {
      toast.error("Deletion cycle failed");
    }
  };

  const totalScans = qrList.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);

  const stats = [
    { name: 'TOTAL NODES', value: qrList.length, icon: Zap, color: 'text-orange-400', sub: 'CLUSTERS ACTIVE' },
    { name: 'ACTIVE USERS', value: users.length, icon: Users, color: 'text-blue-400', sub: 'AUTHORIZED AGENTS' },
    { name: 'SYSTEM SCANS', value: totalScans, icon: Globe, color: 'text-emerald-400', sub: 'GLOBAL TELEMETRY' },
    { name: 'SECURITY LEVEL', value: 'MAXIMUM', icon: ShieldCheck, color: 'text-indigo-400', sub: 'RBAC ENABLED' },
  ];

  if (loading) return (
    <div className="h-screen w-full bg-[#0B132B] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-400 font-mono text-xs animate-pulse">INITIALIZING ADMIN NEURAL INTERFACE...</p>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B132B] text-white selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-[260px] bg-[#14213D] border-r border-white/5 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                <Shield size={18} className="text-white" />
             </div>
             <span className="text-sm font-black italic tracking-[0.2em] text-white uppercase">Command Center</span>
          </div>
          <button className="lg:hidden p-1 text-slate-500 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 px-3 space-y-2">
           <button onClick={() => setView("overview")} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${view === 'overview' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
             <BarChart3 size={18} className={view === 'overview' ? 'text-indigo-400' : 'text-slate-500'} />
             <span className={`text-[11px] font-black uppercase tracking-widest ${view === 'overview' ? 'text-indigo-300' : 'text-slate-500'}`}>Overview</span>
           </button>

           <button onClick={() => setView("users")} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${view === 'users' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
             <Users size={18} className={view === 'users' ? 'text-indigo-400' : 'text-slate-500'} />
             <span className={`text-[11px] font-black uppercase tracking-widest ${view === 'users' ? 'text-indigo-300' : 'text-slate-500'}`}>User Management</span>
           </button>

           <button onClick={() => setView("qrs")} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${view === 'qrs' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
             <QrCode size={18} className={view === 'qrs' ? 'text-indigo-400' : 'text-slate-500'} />
             <span className={`text-[11px] font-black uppercase tracking-widest ${view === 'qrs' ? 'text-indigo-300' : 'text-slate-500'}`}>Matrix Nodes</span>
           </button>

           <button onClick={() => setView("activity")} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${view === 'activity' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
             <Activity size={18} className={view === 'activity' ? 'text-indigo-400' : 'text-slate-500'} />
             <span className={`text-[11px] font-black uppercase tracking-widest ${view === 'activity' ? 'text-indigo-300' : 'text-slate-500'}`}>Global Activity</span>
           </button>

           <div className="pt-4 pb-2 px-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Standard Access</p>
           </div>

           <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 transition-all">
             <Home size={18} className="text-slate-500" />
             <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Back to Hub</span>
           </Link>
        </div>

        <div className="p-6 mt-auto border-t border-white/5 bg-[#0B132B]/50">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">A</div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-tighter">System Admin</p>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Master Root</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B132B]/90 backdrop-blur-xl sticky top-0 z-40">
           <div className="flex items-center gap-4">
             <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
               <Menu size={20} className="text-slate-400" />
             </button>
             <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={14} />
                <span className="text-[10px] tracking-[0.3em] font-bold uppercase transition-all text-indigo-400/80 underline decoration-indigo-500/50 decoration-2 underline-offset-8">Command_Center / {view}</span>
             </div>
           </div>
        </header>

        <main className="p-8 max-w-[1400px] mx-auto w-full space-y-10">
           
           {/* Section Header */}
           <div>
              <p className="text-[10px] font-bold text-indigo-400 tracking-[0.3em] mb-1">CENTRAL INTELLIGENCE</p>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white via-indigo-200 to-indigo-400">Command Center</h1>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-[#1F2B4B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <stat.icon size={48} className={stat.color} />
                  </div>
                  <div className="flex flex-col gap-1 relative z-10">
                     <p className="text-[10px] font-black text-slate-500 tracking-widest">{stat.name}</p>
                     <p className="text-3xl font-black italic tracking-tighter">{stat.value}</p>
                     <p className="text-[9px] font-bold text-slate-600 tracking-tighter uppercase whitespace-nowrap">{stat.sub}</p>
                  </div>
                </div>
              ))}
           </div>

           {/* Content Views */}
           {view === "overview" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 {/* Recent Users */}
                 <div className="bg-[#1F2B4B] border border-white/5 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                       <Users size={20} className="text-blue-400" /> Latest Agents
                    </h3>
                    <div className="space-y-4">
                       {users.slice(-5).map((user, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">{user.name?.[0]}</div>
                                <div>
                                   <p className="text-xs font-bold">{user.name}</p>
                                   <p className="text-[10px] text-slate-500">{user.email}</p>
                                </div>
                             </div>
                             <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">{user.role}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* System Heatmap Data View */}
                 <div className="bg-[#1F2B4B] border border-white/5 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                       <Activity size={20} className="text-emerald-400" /> System Integrity
                    </h3>
                    <div className="p-8 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
                        <ShieldCheck size={40} className="text-slate-600 mb-4" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic">All systems operational within normal parameters</p>
                        <p className="text-[10px] text-slate-700 mt-2">LAST SYSTEM AUDIT: JUST NOW</p>
                    </div>
                 </div>
              </div>
           )}

           {view === "users" && (
              <div className="bg-[#1F2B4B] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                 <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-black italic uppercase">Agent Registry</h2>
                    <div className="relative hidden md:block">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                       <input type="text" placeholder="Search Agents..." className="bg-black/20 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50" />
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-[#14213D] text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <tr>
                             <th className="px-6 py-4">Agent Name</th>
                             <th className="px-6 py-4">Email Address</th>
                             <th className="px-6 py-4">Security Level</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {users.map((user) => (
                             <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">{user.name?.[0]}</div>
                                      <span className="text-xs font-bold">{user.name}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-400">{user.email}</td>
                                <td className="px-6 py-4">
                                   <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                      {user.role}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                   <button onClick={() => deleteUser(user._id)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                                      <Trash2 size={16} />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {view === "qrs" && (
              <div className="bg-[#1F2B4B] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-black italic uppercase">Matrix Node Registry</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
                    {qrList.map((qr) => (
                       <div key={qr._id} className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3 relative overflow-hidden group">
                          <div className="flex justify-between items-start">
                             <div className="bg-indigo-500/10 p-2 rounded-lg">
                                <QrCode size={20} className="text-indigo-400" />
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{qr.scanCount || 0} Scans</p>
                                <p className="text-[8px] text-slate-600 font-bold uppercase">{qr._id.slice(-8).toUpperCase()}</p>
                             </div>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Destination Target</p>
                             <p className="text-xs font-bold text-white truncate max-w-[200px]">{qr.link}</p>
                          </div>
                          <div className="pt-2 flex gap-2">
                             <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[60%]" style={{ width: `${Math.min((qr.scanCount || 0) * 5, 100)}%` }}></div>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {view === "activity" && (
               <div className="bg-[#1F2B4B] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#14213D]">
                    <div>
                       <h2 className="text-xl font-black italic uppercase italic">Global Telemetry Stream</h2>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time activity across all active nodes</p>
                    </div>
                    <div className="bg-indigo-600/10 px-4 py-2 rounded-lg border border-indigo-500/20">
                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Live Feed Active</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-[#0B132B] text-[10px] font-black uppercase text-slate-500 tracking-widest">
                           <tr>
                              <th className="px-6 py-4">Node ID</th>
                              <th className="px-6 py-4">Timestamp</th>
                              <th className="px-6 py-4">Location Entry</th>
                              <th className="px-6 py-4">Destination</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                           {(() => {
                              const allScans = [];
                              qrList.forEach(qr => {
                                 if (qr.scans) {
                                    qr.scans.forEach(scan => {
                                       allScans.push({
                                          ...scan,
                                          nodeId: qr._id,
                                          target: qr.link
                                       });
                                    });
                                 }
                              });
                              const sortedScans = allScans.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
                              
                              if (sortedScans.length === 0) {
                                 return (
                                    <tr>
                                       <td colSpan="4" className="px-6 py-20 text-center">
                                          <Activity size={40} className="mx-auto text-slate-700 mb-4 animate-pulse" />
                                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Awaiting telemetry data...</p>
                                       </td>
                                    </tr>
                                 );
                              }

                              return sortedScans.map((scan, i) => (
                                 <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                       <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-400 transition-colors uppercase">
                                          {scan.nodeId.slice(-8).toUpperCase()}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex flex-col">
                                          <span className="text-xs font-bold text-slate-200">{new Date(scan.timestamp).toLocaleDateString()}</span>
                                          <span className="text-[9px] text-slate-500">{new Date(scan.timestamp).toLocaleTimeString()}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-md text-[10px] tracking-widest uppercase border border-emerald-500/10">
                                          <Globe size={10} /> {scan.location || 'Unknown'}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4">
                                       <p className="text-[10px] font-bold text-blue-400 truncate max-w-[200px]" title={scan.target}>{scan.target}</p>
                                    </td>
                                 </tr>
                              ));
                           })()}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

        </main>
      </div>

    </div>
  );
}
