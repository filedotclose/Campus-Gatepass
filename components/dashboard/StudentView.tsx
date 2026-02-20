"use client";

import { IUser } from "@/types/user";
import { useEffect, useState } from "react";

interface Props {
  user: IUser;
}

export default function StudentView({ user }: Props) {
  const [passes, setPasses] = useState<any[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPasses = async () => {
    try {
      const res = await fetch("/api/pass");
      const data = await res.json();
      setPasses(data);
    } catch (err) {
      console.error("Failed to fetch passes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/pass/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      setReason("");
      fetchPasses();
    } else {
      const data = await res.json();
      console.warn(data.message || "Failed to request pass");
    }
  };

  const activePass = passes.find(p => p.status !== "RETURNED");

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Student Hub</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Welcome back, <span className="gradient-text font-black">{user.name}</span>.
            Your session is synchronized.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-5 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Facility Status: Operational</span>
          </div>
          <div className="w-[1px] h-4 bg-slate-200"></div>
          <button
            onClick={fetchPasses}
            disabled={loading}
            className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Data
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Request & Tips */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 ring-1 ring-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <svg className="w-32 h-32 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Instant Gate Pass
            </h3>

            {activePass ? (
              <div className="p-6 bg-slate-900 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center gap-3 text-white">
                  <div className="relative">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping absolute"></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full relative border-2 border-slate-900"></div>
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">Current Active Pass</span>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Status</p>
                  <p className="text-xl font-black text-white uppercase tracking-tight">{activePass.status}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "One pass at a time. Finish your return before requesting a new entry."
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Purpose of Visit</label>
                  <textarea
                    placeholder="e.g. Preparing for DBMS exam..."
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[140px] text-slate-700 text-sm font-medium leading-relaxed"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
                <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 tracking-widest uppercase text-xs">
                  Request Access
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          <div className="bg-linear-to-br from-slate-900 to-indigo-950 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-indigo-400">Library Hacks</h3>
            <ul className="space-y-5 relative">
              {[
                "Silent zones start from the 3rd Floor.",
                "E-Resources available via Campus Wi-Fi.",
                "Always check-out with the Librarian."
              ].map((tip, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <span className="text-indigo-500 font-black text-sm">{idx + 1}.</span>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 ring-1 ring-slate-200/50 min-h-[600px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Movement History</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">LIVE TRACKING</span>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Hydrating Dashboard...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {passes.map((pass) => (
                  <div key={pass._id} className="group p-6 bg-slate-50 border border-slate-200/50 rounded-3xl hover:bg-white hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${pass.status === "RETURNED" ? "bg-emerald-100 text-emerald-600" :
                        pass.status === "PENDING" ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                        } shadow-inner`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transit</p>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-slate-600">OUT: <span className="text-indigo-600">{pass.transitToLibrary ?? "—"}m</span></span>
                          <span className="text-xs font-black text-slate-600">RTN: <span className="text-indigo-600">{pass.transitToHostel ?? "—"}m</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-black text-slate-800">{new Date(pass.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{pass.status}</p>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed line-clamp-2">" {pass.reason} "</p>
                    </div>
                  </div>
                ))}
                {passes.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-40 opacity-20 grayscale">
                    <svg className="w-32 h-32 text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" />
                    </svg>
                    <p className="text-2xl font-black text-slate-400 tracking-tighter uppercase whitespace-nowrap">Your digital footprint starts here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
