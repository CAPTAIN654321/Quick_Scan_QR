"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, QrCode, Globe, Shield, Activity, Zap, BarChart3, 
  Menu, X, Search, Trash2, ShieldCheck, Home, Terminal, LogOut,
  ShoppingBag, MapPin, CreditCard, CheckCircle2, Clock, XCircle,
  Smartphone, Database, ArrowRight, User, Inbox, Check
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
  const [qrList, setQrList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [metrics, setMetrics] = useState({ userCount: 0, qrCount: 0, scanCount: 0, orderCount: 0, pendingRequests: 0 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("overview"); 
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000");

      const [usersRes, qrRes, orderRes, metricsRes, telemetryRes] = await Promise.all([
        fetch(`${apiUrl}/admin/users`, { headers }),
        fetch(`${apiUrl}/admin/qrs`, { headers }),
        fetch(`${apiUrl}/admin/orders`, { headers }),
        fetch(`${apiUrl}/admin/metrics`, { headers }),
        fetch(`${apiUrl}/admin/telemetry`, { headers })
      ]);

      const [uData, qData, oData, mData, tData] = await Promise.all([
        usersRes.json(),
        qrRes.json(),
        orderRes.json(),
        metricsRes.json(),
        telemetryRes.json()
      ]);

      setUsers(uData || []);
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
    if (!userData) { router.push('/login'); return; }
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      toast.error("Access denied. Admin only.");
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, [router, fetchData]);

  const deleteUser = async (id, role, email) => {
    if (email === 'rahulvarma100000@gmail.com') return;
    if (!confirm("Are you sure you want to remove this agent?")) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/admin/delete-user/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { fetchData(); toast.success("Agent removed."); }
    } catch (err) { toast.error("Deletion failed"); }
  };

  const updateOrder = async (id, updateData) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/order/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        toast.success(`Order data synchronized`);
        fetchData();
      }
    } catch (err) { toast.error("Order synchronization failed"); }
  };

  const updateOrderStatus = (id, newStatus) => updateOrder(id, { status: newStatus });
  const updateOrderAgent = (id, agentNumber) => updateOrder(id, { deliveryAgentNumber: agentNumber });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("All fields mandatory.");
      return;
    }
    setIsCreatingAdmin(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/admin/create-admin`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      if (res.ok) {
        toast.success("New Admin Initialized.");
        setNewAdmin({ name: '', email: '', password: '' });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Initialization rejected");
      }
    } catch (err) { toast.error("Initialization failed"); }
    finally { setIsCreatingAdmin(false); }
  };

  const stats = [
    { name: 'TOTAL NODES', value: metrics.qrCount, icon: QrCode, color: 'text-orange-400', sub: 'ACTIVE' },
    { name: 'ACTIVE USERS', value: metrics.userCount, icon: Users, color: 'text-blue-400', sub: 'AGENTS' },
    { name: 'PENDING ORDERS', value: metrics.orderCount, icon: ShoppingBag, color: 'text-emerald-400', sub: 'PHYSICAL' },
    { name: 'SYSTEM SCANS', value: metrics.scanCount, icon: Globe, color: 'text-indigo-400', sub: 'TELEMETRY' },
  ];

  if (loading) return <div className="h-screen bg-[#0B132B] flex items-center justify-center text-blue-400 font-black tracking-widest animate-pulse italic">INITIALIZING COMMAND CENTER...</div>;

  return (
    <UserAuthWrapper>
      <div className="flex h-screen bg-[#0B132B] text-white selection:bg-indigo-500/30 overflow-hidden font-sans">
        <aside className={`bg-[#14213D] border-r border-white/5 transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
            {!isSidebarCollapsed && <span className="font-black tracking-widest uppercase italic text-sm">Nexus Core</span>}
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all"><ArrowRight size={16} className={isSidebarCollapsed ? '' : 'rotate-180'} /></button>
          </div>
          <div className="flex-1 px-3 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
            {[
              { id: 'overview', icon: BarChart3, label: 'HUB' },
              { id: 'users', icon: Users, label: 'AGENTS' },
              { id: 'qrs', icon: QrCode, label: 'NODES' },
              { id: 'telemetry', icon: Database, label: 'SIGNAL' },
              { id: 'orders', icon: ShoppingBag, label: 'LOGISTICS' }
            ].map(v => (
              <button key={v.id} onClick={() => setView(v.id)} className={`w-full flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all ${view === v.id ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.05)]' : 'text-slate-500 hover:bg-white/5'}`}>
                <v.icon size={18} />
                {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{v.label}</span>}
              </button>
            ))}
          </div>
          <div className="p-6 border-t border-white/5">
            <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 hover:text-rose-400 transition-colors"><LogOut size={16} /> {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}</button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden bg-[#0B132B]">
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B132B]/90 backdrop-blur-xl z-50">
             <div className="flex items-center gap-3 text-indigo-400"><Terminal size={14} /><span className="text-[10px] uppercase font-black tracking-[0.3em]">Command_Center / {view}</span></div>
             <div className="flex items-center gap-4">
               <Link href="/dashboard" className="text-slate-500 hover:text-white transition-all"><Home size={18} /></Link>
               <button onClick={handleLogout} className="p-2 bg-white/5 rounded-xl hover:bg-rose-500/20 hover:text-rose-400 transition-all border border-white/10"><LogOut size={16} /></button>
             </div>
          </header>

          <main className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar pb-20">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-indigo-400 tracking-[0.4em] mb-1">NETWORK_INTELLIGENCE</p>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter">{view === 'overview' ? 'Nexus Hub' : view.toUpperCase() + ' Registry'}</h1>
              </div>
              <p className="text-emerald-400 font-black text-[10px] tracking-widest uppercase border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">ENCRYPTED // ACTIVE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-[#14213D] border border-white/5 p-6 rounded-2xl relative group overflow-hidden hover:border-indigo-500/30 transition-all shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><s.icon size={48} /></div>
                  <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">{s.name}</p>
                  <p className="text-3xl font-black italic tracking-tighter">{s.value}</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {view === 'overview' && (
              <div className="bg-[#14213D] border border-white/5 p-12 rounded-[2rem] text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/5"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <ShieldCheck size={48} />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Matrix Secure</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">Network backbone synchronized. Automated admission protocol verified. All sectors clear.</p>
                </div>
              </div>
            )}

            {view === 'users' && (
              <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                   <h3 className="text-indigo-400 font-black uppercase text-xs mb-6 italic tracking-widest flex items-center gap-2">
                     <Zap size={14} /> Initialize Administrative Node
                   </h3>
                   <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input type="text" placeholder="NAME / CALLSIGN" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="bg-black/40 border border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" />
                      <input type="email" placeholder="ACCESS EMAIL" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="bg-black/40 border border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" />
                      <input type="text" placeholder="ROOT PASSKEY" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="bg-black/40 border border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" />
                      <button type="submit" disabled={isCreatingAdmin} className="bg-indigo-600 font-black italic rounded-xl text-xs uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50">Deploy Node</button>
                   </form>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/20 text-[10px] uppercase text-slate-500 font-black tracking-widest border-b border-white/5">
                      <tr><th className="px-8 py-5">Personnel Profile</th><th className="px-8 py-5 text-center">Clearance Status</th><th className="px-8 py-5 text-center">Intake Node</th><th className="px-8 py-5 text-right">Operation</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 font-black text-sm border border-white/10">{u.name?.[0].toUpperCase()}</div>
                                <div>
                                   <p className="text-sm font-black text-white">{u.name}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{u.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <span className={`text-[9px] font-black px-3 py-1 rounded border uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.1)]' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{u.role}</span>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 uppercase tracking-widest bg-emerald-500/5">Approved</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-white uppercase tracking-tight">{new Date(u.createdAt).toLocaleDateString()}</span>
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{new Date(u.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            {u.email !== 'rahulvarma100000@gmail.com' ? (
                               <button onClick={() => deleteUser(u._id, u.role, u.email)} className="bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-500 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-900/10">Decommission</button>
                            ) : (
                               <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-5 py-2 border border-white/5 rounded-xl italic">Shielded</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === 'qrs' && (
               <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-black/20 text-[10px] uppercase text-slate-500 font-black tracking-widest border-b border-white/5">
                        <tr><th className="px-8 py-5">Node Identity</th><th className="px-8 py-5 text-center">Engagement Scans</th><th className="px-8 py-5 text-center">Signal Status</th><th className="px-8 py-5 text-right">Operation</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {qrList.map(qr => (
                          <tr key={qr._id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400"><QrCode size={18} /></div>
                                  <div>
                                     <p className="text-sm font-black text-white italic uppercase">{qr.customConfig?.title?.text || 'Dynamic Node'}</p>
                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[150px]">{qr.link}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className="text-lg font-black italic text-white leading-none">{qr.scanCount || 0}</span>
                               <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Bursts</span>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">Active</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all"><Search size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}

            {view === 'telemetry' && (
              <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/20 text-[10px] uppercase text-slate-500 font-black tracking-widest border-b border-white/5">
                      <tr><th className="px-8 py-5">Burst Identity</th><th className="px-8 py-5">Source Node</th><th className="px-8 py-5 text-center">Location Trace</th><th className="px-8 py-5 text-right">Timeline</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {telemetry.map((t, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400"><Smartphone size={18} /></div>
                                <div>
                                   <p className="text-sm font-black text-white italic">{t.name || 'Anonymous'}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{t.ip}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-black italic text-indigo-300">{t.nodeTitle}</td>
                          <td className="px-8 py-6 text-center">
                             <span className="px-3 py-1 rounded-md border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[9px] font-black uppercase tracking-widest">{t.location || 'Unknown'}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex items-center justify-end gap-2 text-slate-400">
                                <p className="text-xs font-black text-white italic">{new Date(t.timestamp).toLocaleTimeString()}</p>
                                <Clock size={12} className="opacity-40" />
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === 'orders' && (
              <div className="bg-[#14213D] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/20 text-[10px] uppercase text-slate-500 font-black tracking-widest border-b border-white/5">
                      <tr><th className="px-8 py-5">Deployment Units</th><th className="px-8 py-5">Shipping Intel</th><th className="px-8 py-5">Fulfillment Status</th><th className="px-8 py-5 text-right">Operation</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map(o => (
                        <tr key={o._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                             <p className="text-xs font-black text-white uppercase">{o.format?.name || 'Standee'}</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase">{o.title}</p>
                             <span className="text-[8px] font-black text-blue-400 uppercase mt-1 inline-block">{o.quantity} Units</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed max-w-[200px] truncate">{o.address?.street}, {o.address?.city}</div>
                             <div className="flex flex-col gap-2 mt-2">
                                 <div className="text-[9px] font-black text-indigo-400 italic flex items-center gap-1.5 bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/10 w-fit">
                                    <User size={10} /> {o.address?.phone}
                                 </div>
                                 <div className="relative group/agent">
                                    <input 
                                       type="text" 
                                       placeholder="AGENT #" 
                                       defaultValue={o.deliveryAgentNumber}
                                       onBlur={(e) => {
                                          if (e.target.value !== o.deliveryAgentNumber) {
                                             updateOrderAgent(o._id, e.target.value);
                                          }
                                       }}
                                       className="bg-black/40 border border-white/5 p-1 px-2 rounded-lg text-[9px] font-black text-white outline-none focus:border-amber-500/50 transition-all w-32 placeholder:text-slate-800"
                                    />
                                    <Truck size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
                                 </div>
                              </div>
                          </td>
                          <td className="px-8 py-6">
                              <select 
                                value={o.status} 
                                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest outline-none bg-black/20 cursor-pointer transition-all ${
                                  o.status === 'Delivered' ? 'text-emerald-400 border-emerald-500/20' : 
                                  o.status === 'Shipped' ? 'text-blue-400 border-blue-500/20' :
                                  o.status === 'Cancelled' ? 'text-rose-400 border-rose-500/20' :
                                  'text-orange-400 border-orange-500/20'
                                }`}
                              >
                                <option value="Pending" className="bg-[#14213D] text-white">Pending</option>
                                <option value="Shipped" className="bg-[#14213D] text-white">Shipped</option>
                                <option value="Delivered" className="bg-[#14213D] text-white">Delivered</option>
                                <option value="Cancelled" className="bg-[#14213D] text-white">Cancelled</option>
                              </select>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-500">
                                <span className="text-[10px] font-black uppercase italic tracking-tighter">
                                   {new Date(o.createdAt).toLocaleDateString()}
                                </span>
                                <Clock size={12} className="opacity-40" />
                              </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </UserAuthWrapper>
  );
}
