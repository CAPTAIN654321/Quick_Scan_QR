"use client";

import { useEffect, useState } from "react";
import { 
  User, Mail, Lock, Shield, Save, ArrowLeft, 
  Terminal, Camera, CheckCircle2, AlertCircle, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import UserAuthWrapper from "@/components/UserAuthWrapper";

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
        updateData.currentPassword = formData.currentPassword;
      }

      // Using the session-aware update-me endpoint
      const res = await fetch(`${apiUrl}/user/update-me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        const updatedUserResponse = await res.json();
        const fullUser = { ...user, ...updatedUserResponse };
        localStorage.setItem('user', JSON.stringify(fullUser));
        setUser(fullUser);
        toast.success("Identity profile updated successfully.");
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        toast.error("Failed to update profile data.");
      }
    } catch (err) {
      toast.error("Network synchronization error.");
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
    <UserAuthWrapper>
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
                    {user.name?.[0].toUpperCase() || "A"}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 rounded-xl border-4 border-[#14213D] hover:bg-indigo-500 transition-colors shadow-lg">
                    <Camera size={18} className="text-white" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white italic truncate px-2">{user.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.email}</p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Access Level</span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{user.role || 'Agent'}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security</span>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
                   </div>
                </div>
              </div>

              <div className="bg-[#0A1128] border border-white/5 rounded-2xl p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <Shield size={18} className="text-indigo-400" />
                    <h4 className="text-sm font-black italic uppercase tracking-widest">Security Intel</h4>
                 </div>
                 <p className="text-[10px] leading-relaxed text-slate-500 font-medium">Your account is protected by hardware-grade encryption. Change your security keys regularly to maintain active clearance.</p>
              </div>
            </div>

            {/* Right Panel - Settings Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleUpdateProfile} className="bg-[#14213D] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl">
                
                {/* Identity Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <User size={20} className="text-indigo-400" />
                    <h3 className="text-xl font-black italic uppercase tracking-widest underline decoration-indigo-500/30 underline-offset-8">Identity Protocol</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Display Alias</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-indigo-500 outline-none transition-all"
                        placeholder="Agent Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Communication Hub (Email)</label>
                      <input 
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full bg-[#0B132B]/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 outline-none cursor-not-allowed"
                        placeholder={user.email || "agent@nexus.net"}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Management */}
                <div className="space-y-6 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-4 mb-2">
                    <Lock size={20} className="text-purple-400" />
                    <h3 className="text-xl font-black italic uppercase tracking-widest underline decoration-purple-500/30 underline-offset-8">Keys Authorization</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Current Secret</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPass ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-purple-500 outline-none transition-all pr-12"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">New Root Key</label>
                        <div className="relative">
                          <input 
                            type={showNewPass ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-purple-500 outline-none transition-all pr-12"
                            placeholder="New secure access"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                          >
                            {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Repeat Root Key</label>
                        <input 
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-purple-500 outline-none transition-all"
                          placeholder="Verify new access"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black italic tracking-widest uppercase py-5 rounded-2xl flex justify-center items-center gap-3 shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={18} /> Save Identity Update
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </UserAuthWrapper>
  );
}
