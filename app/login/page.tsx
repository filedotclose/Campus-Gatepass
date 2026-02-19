"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-700">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
        {/* Left: Branding & Info */}
        <div className="hidden lg:block space-y-10 animate-in slide-in-from-bottom duration-700">
          <div className="space-y-4">
            {/* <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.3em] shadow-lg shadow-indigo-100">Smart Campus</span> */}
            <h1 className="text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              The Digital <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">GatePass</span> System.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
              Secure, fast, and transparent movement tracking for the modern student. Zero paperwork, total accountability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-3xl font-black text-slate-800">100%</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Digitized Logs</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-slate-800">&lt; 10s</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Clearance Time</p>
            </div>
          </div>
        </div>

        {/* Right: Login Card */}
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 ring-1 ring-slate-200/50 relative animate-in zoom-in duration-700">
          <div className="space-y-2 mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Portal</h2>
            <p className="text-slate-500 font-medium">Enter your credentials to manage your passes.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <input
                type="email"
                placeholder="identity@campus.edu"
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold animate-in fade-in flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-100 hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 tracking-[0.15em] uppercase text-[10px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Authenticate
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Identity Verified via Campus LDAP
          </p>
        </div>
      </div>
    </div>
  );
}
