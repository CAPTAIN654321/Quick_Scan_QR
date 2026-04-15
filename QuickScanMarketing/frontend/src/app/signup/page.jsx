'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import Link from 'next/link';
import { ArrowRight, QrCode } from 'lucide-react';

const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(3, 'Name is too short'),
  email: Yup.string().required('Email is required').email('Invalid email address'),
  password: Yup.string()
    .required('Password is required')
    .matches(/[A-Z]/, 'Uppercase letter is required')
    .matches(/[a-z]/, 'Lowercase letter is required')
    .matches(/[0-9]/, 'Number is required')
    .matches(/[_.@#/]/, 'Special character is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const Signup = () => {
  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.post(`${apiUrl}/user/add`, values);
        if (res.status === 200) {
          toast.success('Registration successful! Please log in.');
          resetForm();
        } else {
          toast.error("Registration failed");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred during registration");
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans selection:bg-blue-500/30">
      {/* Right Side: Image (Hidden on mobile) */}
      <div className="hidden w-1/2 lg:block relative order-1 lg:order-none">
        <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply z-10 p-12 flex flex-col justify-end pb-24">
            <blockquote className="space-y-2 mt-auto text-white">
              <h2 className="text-4xl font-bold mb-4">Start Growing Today.</h2>
              <p className="text-xl font-light italic max-w-lg leading-relaxed">Join thousands of businesses who use Smart QR to track physical engagement and boost real-world conversions instantly.</p>
            </blockquote>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
          alt="Signup background" 
          className="h-full w-full object-cover"
        />
      </div>

      {/* Left Side: Signup Form */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-24 py-12 order-2 lg:order-none bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 text-indigo-600">
            <QrCode size={32} />
            <span className="text-xl font-bold tracking-tight text-slate-800">Smart QR</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Create an account</h1>
          <p className="mt-2 text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Log in instead
            </Link>
          </p>

          <form className="mt-8 space-y-5" onSubmit={signupForm.handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                value={signupForm.values.name}
                className={`mt-1 block w-full rounded-2xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${signupForm.errors.name && signupForm.touched.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                placeholder="Jane Doe"
              />
              {signupForm.errors.name && signupForm.touched.name && (
                <p className="mt-2 text-xs text-red-600 font-medium">{signupForm.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                value={signupForm.values.email}
                className={`mt-1 block w-full rounded-2xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${signupForm.errors.email && signupForm.touched.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                placeholder="you@email.com"
              />
              {signupForm.errors.email && signupForm.touched.email && (
                <p className="mt-2 text-xs text-red-600 font-medium">{signupForm.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                value={signupForm.values.password}
                className={`mt-1 block w-full rounded-2xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${signupForm.errors.password && signupForm.touched.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                placeholder="••••••••"
              />
              {signupForm.errors.password && signupForm.touched.password && (
                <p className="mt-2 text-xs text-red-600 font-medium">{signupForm.errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                value={signupForm.values.confirmPassword}
                className={`mt-1 block w-full rounded-2xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${signupForm.errors.confirmPassword && signupForm.touched.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                placeholder="••••••••"
              />
              {signupForm.errors.confirmPassword && signupForm.touched.confirmPassword && (
                <p className="mt-2 text-xs text-red-600 font-medium">{signupForm.errors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={signupForm.isSubmitting}
                className="w-full flex justify-center items-center rounded-2xl bg-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {signupForm.isSubmitting ? 'Creating account...' : (
                  <>Create Account <ArrowRight size={16} className="ml-2" /></>
                )}
              </button>
            </div>
            
            <p className="text-xs text-slate-500 text-center mt-4 pt-4 border-t border-slate-100">
               By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;  