"use client";

import { useEffect, useState } from "react";
import { 
  User, Mail, Lock, Shield, Save, ArrowLeft, 
  Terminal, Camera, CheckCircle2, AlertCircle, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/login';
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData(prev => ({
      ...prev,
      name: parsedUser.name || "",
      email: parsedUser.email || ""
    }));
    setLoading(false);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // If password is being changed, validate match
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        setSaving(false);
        return;
      }

      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const res = await fetch(`${apiUrl}/user/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        const newUserObj = { ...user, ...updateData };
        delete newUserObj.password; // Don't store password in localstorage
        localStorage.setItem('user', JSON.stringify(newUserObj));
        setUser(newUserObj);
        toast.success("Identity Nexus Updated Successfully");
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        toast.error("Network rejection. Please verify credentials.");
      }
    } catch (err) {
      toast.error("Security breach or connection failure");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0B132B] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B132B] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-[0.3em] text-[10px] uppercase">
              <Terminal size={14} />
              <span>Identity_Management / Core</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">My Profile</h1>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px]">
             <ArrowLeft size={16} /> Back to Hub
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Avatar & Status */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#14213D] border border-white/5 rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-5xl font-black italic shadow-[0_0_30px_rgba(79,70,229,0.3)] border-4 border-[#14213D] group-hover:scale-105 transition-transform">
                  {user.name?.[0].toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 rounded-xl border-4 border-[#14213D] hover:bg-indigo-500 transition-colors shadow-lg">
                  <Camera size={18} className="text-white" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white italic truncate px-2">{user.name}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.email}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                 <div className="flex items-center justify-between px-3 py-2 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Mode</span>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Shield size={10} /> Active
                    </span>
                 </div>
                 <div className="flex items-center justify-between px-3 py-2 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nexus ID</span>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">V-PRO#{user._id?.slice(-4).toUpperCase()}</span>
                 </div>
              </div>
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-6 space-y-4">
               <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                 <AlertCircle size={14} /> Security Protocol
               </h4>
               <p className="text-[11px] leading-relaxed text-indigo-200/60 font-medium">
                 Ensure your identity credentials remain confidential. Master-level changes are logged across the decentralized registry.
               </p>
            </div>
          </div>

          {/* Right Panel - Edit Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleUpdateProfile} className="bg-[#14213D] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                    <User size={20} className="text-indigo-400" /> Basic Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Identity Name</label>
                      <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400">
                           <User size={16} />
                         </div>
                         <input 
                           type="text" 
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-[#0B132B] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                           placeholder="Enter registered name"
                         />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Primary Email Node</label>
                      <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400">
                           <Mail size={16} />
                         </div>
                         <input 
                           type="email" 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full bg-[#0B132B] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                           placeholder="Enter master email"
                         />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Nexus */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-purple-400">
                    <Lock size={20} /> Security Nexus
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Update Password</label>
                      <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-purple-400">
                           <Lock size={16} />
                         </div>
                         <input 
                           type={showNewPass ? "text" : "password"} 
                           value={formData.newPassword}
                           onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                           className="w-full bg-[#0B132B] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-800"
                           placeholder="New Secure Key"
                         />
                         <button 
                           type="button"
                           onClick={() => setShowNewPass(!showNewPass)}
                           className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-white transition-colors"
                         >
                            {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Confirm Secret Key</label>
                      <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-purple-400">
                           <CheckCircle2 size={16} />
                         </div>
                         <input 
                           type="password" 
                           value={formData.confirmPassword}
                           onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                           className="w-full bg-[#0B132B] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-800"
                           placeholder="Verify Secret Key"
                         />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                 <p className="text-[10px] font-bold text-slate-500 italic">Last login: {new Date().toLocaleDateString()} from local node</p>
                 <button 
                   type="submit"
                   disabled={saving}
                   className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 active:scale-95"
                 >
                   {saving ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                   ) : (
                      <Save size={16} />
                   )}
                   Synchronize Changes
                 </button>
              </div>
            </form>

            <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-rose-500/10 transition-all">
                <div className="space-y-1">
                   <h4 className="text-sm font-black text-rose-400 italic uppercase">Deactivate Identity Node</h4>
                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Permanently dissolve your presence from the matrix</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all">
                   <AlertCircle size={20} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
