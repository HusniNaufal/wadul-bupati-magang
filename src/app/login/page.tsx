'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // Save auth metadata in cookies (native, simple, accessible on both client and server)
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + 2 * 60 * 60 * 1000); // 2 hours session

        document.cookie = `admin_user=${encodeURIComponent(json.user.username)}; path=/; expires=${expiry.toUTCString()}; SameSite=Strict`;
        document.cookie = `admin_dinas=${encodeURIComponent(json.user.dinas)}; path=/; expires=${expiry.toUTCString()}; SameSite=Strict`;

        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(json.error || 'Autentikasi gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setErrorMsg('Gagal menghubungi server. Silakan periksa koneksi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center p-4">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Portal Publik
        </Link>
      </div>

      {/* Login Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-lg space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <img src="https://pengaduan.kuduskab.go.id/assets/images/asp_logo.png" alt="Logo" className="w-24 h-24 object-contain mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Akses Portal Dinas</h2>
          <p className="text-xs text-slate-400">Silakan masuk menggunakan kredensial akun dinas Anda</p>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-start gap-2.5">
            <svg className="w-4.5 h-4.5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="username" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all bg-slate-50 text-slate-800 font-semibold"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all bg-slate-50 text-slate-800 font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#356a70] text-white rounded-xl text-sm font-semibold hover:bg-[#2c5c61] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memproses...
              </>
            ) : (
              'Masuk Aplikasi'
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
        <p>Aplikasi Portal Wadul Bupati Dashboard</p>
        <p>Kabupaten Kudus &copy; 2026</p>
      </div>
    </div>
  );
}
