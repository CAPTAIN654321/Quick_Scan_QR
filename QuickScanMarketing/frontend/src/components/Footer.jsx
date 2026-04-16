"use client";

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const pathname = usePathname()

  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <svg width={32} height={32} viewBox="0 0 95 94" className="text-indigo-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M96 0V47L48 94H0V47L48 0H96Z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-slate-800">Smart QR</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-slate-500">
            <Link href="/home" className="hover:text-indigo-600 transition">Home</Link>
            <Link href="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>
            <Link href="/login" className="hover:text-indigo-600 transition">Log In</Link>
            <Link href="/signup" className="hover:text-indigo-600 transition">Sign Up</Link>
          </nav>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Vision QR Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer