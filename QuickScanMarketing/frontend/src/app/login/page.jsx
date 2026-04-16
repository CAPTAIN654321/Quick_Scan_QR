'use client';
import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import Link from 'next/link';
import { ArrowRight, QrCode, Shield, User, Terminal, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

const loginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email address'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    setIsAdminMode(params.get('mode') === 'admin');
  }, []);
  const loginForm = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('Attempting hardcoded Nexus connection...');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000');
        const response = await axios.post(`${apiUrl}/user/authenticate`, values);
        
        toast.success('Welcome Back!');
        localStorage.clear();
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          role: response.data.role,
          name: response.data.name
        }));
        console.log('Saved user to storage. Role detected:', response.data.role);
        
        const targetRole = (response.data.role || '').toLowerCase();
        
        if (targetRole === 'admin') {
          toast.success('Admin clearance verified. Entering Command Center...');
          window.location.href = '/admin-dashboard'; // Use hard redirect to bypass router issues
        } else {
          toast.success('Agent clearance verified. Entering Hub...');
          window.location.href = '/dashboard';
        }
      } catch (err) {
        if (!err.response) {
          toast.error('Nexus Backend Offline. Ensure server is running on port 5000.');
        } else {
          toast.error(err.response.data?.message || 'Matrix Access Denied. Verify credentials.');
        }
      }
      setSubmitting(false);
    }
  });

  return (
    <div className={`flex min-h-screen w-full font-sans transition-all duration-1000 ${isAdminMode ? 'bg-[#0B132B] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Background Effects for Admin Mode */}
      {isAdminMode && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:3s]"></div>
        </div>
      )}

      {/* Right Side: Hero Image & Branding */}
      <div className={`hidden w-1/2 lg:block relative z-10 overflow-hidden transition-all duration-1000 ${isAdminMode ? 'grayscale brightness-50 contrast-125' : ''}`}>
        <div className={`absolute inset-0 z-20 p-16 flex flex-col justify-end transition-all duration-1000 ${isAdminMode ? 'bg-black/60' : 'bg-indigo-900/40'}`}>
            <div className="space-y-6 max-w-lg">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in ${isAdminMode ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' : 'border-white/20 text-white bg-white/10'}`}>
                    {isAdminMode ? 'Root Nexus Control' : 'Physical-to-Digital Bridge'}
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter leading-[0.9] text-white">
                    {isAdminMode ? 'Control the. matrix' : 'Grow your. brand'}
                </h1>
                <p className="text-xl text-white/70 font-medium leading-relaxed">
                    {isAdminMode 
                      ? 'Access centralized telemetry across all network nodes with military-grade precision and real-time data streaming.' 
                      : 'Bridge the gap between your physical products and digital presence with Smart QR technology and real-time analytics.'}
                </p>
            </div>
        </div>
        <img 
          src={isAdminMode 
            ? "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            : "/login-hero.png"} 
          alt="Hero background" 
          className="h-full w-full object-cover"
        />
      </div>

      {/* Left Side: Login Form Container */}
      <div className="relative z-10 flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-24 py-12 transition-all duration-700">
        <div className="mx-auto w-full max-w-md">
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-12">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 ${isAdminMode ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-white text-indigo-600 shadow-slate-200'}`}>
                <QrCode size={28} className={isAdminMode ? 'text-white' : ''} />
            </div>
            <div>
                <h2 className={`text-2xl font-black tracking-tighter transition-colors ${isAdminMode ? 'text-white' : 'text-slate-900'}`}>Smart QR</h2>
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500">v-pro nexus 1.0</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className={`flex p-1 rounded-2xl mb-12 border transition-all duration-700 ${isAdminMode ? 'bg-black/20 border-white/5' : 'bg-slate-200/50 border-slate-200'}`}>
             <button 
               onClick={() => setIsAdminMode(false)}
               type="button"
               className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!isAdminMode ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
                <User size={14} /> User Access
             </button>
             <button 
               onClick={() => setIsAdminMode(true)}
               type="button"
               className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAdminMode ? 'bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-white/5'}`}
             >
                <Shield size={14} /> Command Center
             </button>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-10">
              <h1 className={`text-5xl font-black italic tracking-tighter uppercase transition-all ${isAdminMode ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-slate-900'}`}>
                {isAdminMode ? 'Admin Portal' : 'Welcome Back'}
              </h1>
              <p className="mt-2 text-slate-500 font-medium">
                {isAdminMode ? 'Enter root credentials for matrix access.' : "Don't have an account?"}
                {!isAdminMode && (
                  <Link href="/signup" className="ml-2 font-black text-indigo-600 hover:text-indigo-400 decoration-2 underline-offset-4 hover:underline transition-all">
                    Sign up today
                  </Link>
                )}
              </p>
          </div>
          
          {/* The Form */}
          <form className="space-y-6" onSubmit={loginForm.handleSubmit}>
            <div className="space-y-2">
              <label 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isAdminMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                Access Email
              </label>
              <div className="relative group">
                <input 
                    id="email"
                    name="email"
                    type="email" 
                    onChange={loginForm.handleChange}
                    onBlur={loginForm.handleBlur}
                    value={loginForm.values.email}
                    className={`block w-full rounded-2xl border px-5 py-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                        isAdminMode 
                        ? 'bg-black/20 border-white/5 text-white focus:ring-indigo-500/50 focus:border-indigo-500' 
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-indigo-500/50 focus:border-indigo-500'
                    }`} 
                    placeholder="you@email.com"
                />
              </div>
              {loginForm.errors.email && loginForm.touched.email && (
                 <p className="text-[11px] text-rose-500 font-black italic uppercase tracking-tighter ml-2">{loginForm.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isAdminMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Root Password
                </label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:underline transition-all">
                    Forgot Access?
                </Link>
              </div>
              <div className="relative group">
                <input 
                    id="password"
                    name="password"
                    type="password" 
                    onChange={loginForm.handleChange}
                    onBlur={loginForm.handleBlur}
                    value={loginForm.values.password}
                    className={`block w-full rounded-2xl border px-5 py-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                        isAdminMode 
                        ? 'bg-black/20 border-white/5 text-white focus:ring-indigo-500/50 focus:border-indigo-500' 
                        : 'bg-white border-slate-200 text-slate-900 focus:ring-indigo-500/50 focus:border-indigo-500'
                    }`} 
                    placeholder="••••••••"
                />
              </div>
              {loginForm.errors.password && loginForm.touched.password && (
                 <p className="text-[11px] text-rose-500 font-black italic uppercase tracking-tighter ml-2">{loginForm.errors.password}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loginForm.isSubmitting}
              className={`w-full group relative flex items-center justify-center gap-3 py-5 rounded-2xl font-black italic uppercase tracking-widest transition-all overflow-hidden ${
                isAdminMode 
                ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:-translate-y-1' 
                : 'bg-[#14213D] text-white shadow-xl hover:bg-black hover:-translate-y-1'
              }`}
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {loginForm.isSubmitting ? (
                    'Decrypting Matrix...'
                ) : (
                    <>
                        {isAdminMode ? <Terminal size={18} /> : <Lock size={18} />}
                        {isAdminMode ? 'Initialize Command Center' : 'Access Hub Portal'}
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                    </>
                )}
            </button>
          </form>

          {/* Footer Decoration */}
          <div className="mt-16 pt-8 border-t border-slate-500/10 flex justify-between items-center opacity-40">
              <p className="text-[8px] font-bold uppercase tracking-widest tracking-[0.5em]">Global Encryption Active</p>
              <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/10"></div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;