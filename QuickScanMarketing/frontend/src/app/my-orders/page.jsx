"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package, ShoppingBag, Truck, CheckCircle2, Clock, XCircle,
  ArrowLeft, Home, Zap, Layers, RefreshCw, ChevronRight,
  CreditCard, Calendar, Hash, ShieldCheck, Map
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import UserAuthWrapper from "@/components/UserAuthWrapper";
import Chatbot from "@/components/Chatbot";


const STATUS_CONFIG = {
  Pending:    { color: "text-orange-400",   bg: "bg-orange-500/10",   border: "border-orange-500/20",   icon: Clock,         label: "Pending",     step: 1 },
  Processing: { color: "text-indigo-400",   bg: "bg-indigo-500/10",   border: "border-indigo-500/20",   icon: RefreshCw,     label: "Processing",  step: 2 },
  Shipped:    { color: "text-blue-400",     bg: "bg-blue-500/10",     border: "border-blue-500/20",     icon: Truck,         label: "Shipped",     step: 3 },
  "Out for Delivery": { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: Map, label: "Out for Delivery", step: 4 },
  Delivered:  { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2,  label: "Delivered",   step: 5 },
  Cancelled:  { color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/20",    icon: XCircle,       label: "Cancelled",   step: 0 },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
  const Icon = cfg.icon;
  return (
    <div className="flex flex-col items-end gap-1">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-lg ${cfg.color} ${cfg.bg} ${cfg.border} shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
        <Icon size={12} className="animate-pulse" />
        {cfg.label}
      </span>
      {cfg.step > 0 && cfg.step < 5 && (
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter italic">In Transit Pipeline</p>
      )}
    </div>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === "Paid";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isPaid ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
      <CreditCard size={11} />
      {status || "Pending"}
    </span>
  );
}

function OrderCard({ order, index, onCancel }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const themeName = order.theme?.name || "Custom";
  const formatName = order.format?.name || "Standee";
  const qrCount = (order.addedQrs || []).length;
  const isPending = order.status === "Pending";

  return (
    <div className="group relative bg-[#111827] border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.08)]">
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${order.theme?.from || "from-indigo-600"} ${order.theme?.to || "to-cyan-400"}`} />

      <div className="p-6">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <span className="text-sm font-black text-indigo-400">#{index + 1}</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                {order.title || "Custom Standee"}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {order.subtitle || "Quick Scan Marketing"}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Progress Bar */}
        {order.status !== 'Cancelled' && (
          <div className="mb-6 px-1">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)] ${
                  order.status === 'Delivered' ? 'bg-emerald-500 w-full' : 
                  order.status === 'Shipped' ? 'bg-blue-500 w-3/4' :
                  order.status === 'Processing' ? 'bg-indigo-500 w-1/2' : 'bg-orange-500 w-1/4'
                }`}
              />
            </div>
            <div className="flex justify-between mt-2">
               <span className={`text-[8px] font-black uppercase tracking-widest ${order.status ? 'text-indigo-400' : 'text-slate-700'}`}>Order Placed</span>
               <span className={`text-[8px] font-black uppercase tracking-widest ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'text-indigo-400' : 'text-slate-700'}`}>Processing</span>
               <span className={`text-[8px] font-black uppercase tracking-widest ${['Shipped', 'Delivered'].includes(order.status) ? 'text-indigo-400' : 'text-slate-700'}`}>Shipped</span>
               <span className={`text-[8px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'text-emerald-400' : 'text-slate-700'}`}>Delivered</span>
            </div>
          </div>
        )}

        {/* Info badges */}
        <div className="flex gap-2 items-center mb-5">
           <PaymentBadge status={order.paymentStatus} />
           <div className="h-1 w-1 rounded-full bg-slate-800"></div>
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Operation: Logistics_0{index + 1}</p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Format</p>
            <p className="text-xs font-bold text-white">{formatName}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Theme</p>
            <p className="text-xs font-bold text-white">{themeName}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Quantity</p>
            <p className="text-xs font-bold text-white">{order.quantity || 1} pcs</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">QR Nodes</p>
            <p className="text-xs font-bold text-white">{qrCount} active</p>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
              <Hash size={11} />
              <span className="font-mono">{order._id?.slice(-12).toUpperCase() || "—"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
              <Calendar size={11} />
              <span>{formatDate(order.createdAt)}</span>
            </div>
            {order.deliveryAgentNumber && (
              <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl group/agent transition-all hover:bg-indigo-500/20">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                   <Truck size={14} className="group-hover/agent:animate-bounce" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5">Deployment Personnel</p>
                   <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-white italic tracking-widest">{order.deliveryAgentNumber}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                   </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isPending && (
              <button 
                onClick={() => onCancel(order._id)}
                className="px-4 py-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Cancel Order
              </button>
            )}
            {order.totalPrice ? (
              <span className="text-lg font-black text-white">
                ₹{Number(order.totalPrice).toFixed(2)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" ? `http://${window.location.hostname}:5000` : "http://localhost:5000");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/order/all`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const res = await fetch(`${apiUrl}/order/update/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (res.ok) {
        toast.success("Order cancelled");
        fetchOrders();
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const STATUS_FILTERS = ["All", "Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    shipped: orders.filter(o => o.status === "Shipped").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
  };

  return (
    <UserAuthWrapper>
      <div className="min-h-screen bg-[#060B1A] text-white font-sans">
      <Toaster position="top-right" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#060B1A]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="flex items-center gap-2 text-white font-black italic tracking-widest">
          <ShoppingBag size={18} className="text-indigo-400" />
          My Orders
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            <Home size={14} /> Dashboard
          </Link>
          <Link href="/standee" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            <Layers size={14} /> New
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10 space-y-10">

        {/* ── Page title ── */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Order History
          </h1>
          <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.3em]">
            Your standee deployments & status
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: stats.total, color: "text-white", icon: Package },
            { label: "Pending",      value: stats.pending, color: "text-amber-400", icon: Clock },
            { label: "Shipped",      value: stats.shipped, color: "text-cyan-400", icon: Truck },
            { label: "Delivered",    value: stats.delivered, color: "text-emerald-400", icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.label} className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
              <div className="p-2 rounded-xl bg-white/5">
                <s.icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{s.label}</p>
                <p className={`text-2xl font-black italic ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                filter === f
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={fetchOrders}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw size={11} /> Refresh
          </button>
        </div>

        {/* ── Order list ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ShoppingBag size={36} className="text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2">
                No Orders Found
              </h2>
              <p className="text-slate-500 text-sm max-w-xs">
                {filter !== "All"
                  ? `No orders with status "${filter}". Try a different filter.`
                  : "You haven't placed any standee orders yet. Design one and order it!"}
              </p>
            </div>
            <Link
              href="/standee"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5"
            >
              <Zap size={14} /> Design a Standee
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, i) => (
              <OrderCard key={order._id} order={order} index={i} onCancel={handleCancel} />
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <ShieldCheck size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Want another standee?</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Create a new custom design</p>
              </div>
            </div>
            <Link
              href="/standee"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5 whitespace-nowrap"
            >
              New Order <ChevronRight size={14} />
            </Link>
          </div>
        )}

      </main>
      <Chatbot role="user" />
    </div>
    </UserAuthWrapper>
  );
}
