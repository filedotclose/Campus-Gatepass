"use client";

import { IUser } from "@/types/user";
import { useEffect, useState } from "react";

interface Props {
  user: IUser;
}

export default function WardenView({ user }: Props) {
  const [passes, setPasses] = useState<any[]>([]);
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

  const handleAction = async (endpoint: string, passId: string) => {
    const res = await fetch(`/api/pass/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passId }),
    });

    if (res.ok) {
      fetchPasses();
    } else {
      console.warn("Action failed");
    }
  };

  const pendingPasses = passes.filter(p => p.status === "PENDING");
  const activePasses = passes.filter(p => p.status === "APPROVED" || p.status === "IN_LIBRARY");
  const historyPasses = passes.filter(p => p.status === "RETURNED");

  const formatTime = (date: any) => {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Hostel Control Center</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Chief Administrator: <span className="gradient-text font-black">{user.name}</span>
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
          <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 ring-1 ring-slate-200/50 shrink-0">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 leading-none">{pendingPasses.length}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">To Review</p>
            </div>
          </div>
          <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 ring-1 ring-slate-200/50 shrink-0">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 leading-none">{activePasses.length}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Active Field</p>
            </div>
          </div>
        </div>
      </header>

      {/* Daily Brief Card */}
      <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          <svg className="w-40 h-40 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.11v4.71c0 4.49-3 8.71-7 9.82-4-1.11-7-5.33-7-9.82V6.29l7-3.11zm1 10.82h-2V16h2v-2zm0-2h-2V7h2v5z" />
          </svg>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-indigo-400 text-sm font-black uppercase tracking-[0.3em]">Security Intelligence</h3>
            <button
              onClick={fetchPasses}
              className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Feed
            </button>
          </div>
          <p className="text-white text-2xl font-bold max-w-2xl leading-tight tracking-tight">
            All systems operational. <span className="text-slate-400">Ensure every student check-out is visually confirmed against the digital pass record.</span>
          </p>
          <div className="pt-4 flex gap-6">
            <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Gate Sync Active
            </div>
            <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              RFID/OTP Fallback Ready
            </div>
          </div>
        </div>
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-1 gap-12">
        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Approval Queue</h3>
            <span className="bg-white/50 px-5 py-2 rounded-2xl border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority Review</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/10">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Stated Purpose</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 text-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {pendingPasses.map(pass => (
                  <tr key={pass._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-700 text-xl font-black shrink-0 shadow-inner">
                          {pass.studentId.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight text-lg leading-none mb-2">{pass.studentId.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pass.studentId.rollNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="max-w-xs">
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed italic">" {pass.reason} "</p>
                      </div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50 text-right">
                      <button
                        onClick={() => handleAction("approve", pass._id)}
                        className="bg-indigo-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                      >
                        Grant Access
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingPasses.length === 0 && (
                  <tr><td colSpan={3} className="py-24 text-center font-black text-slate-300 uppercase tracking-[0.5em] text-sm">All clear at the desk</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
          <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Dispatches</h3>
            <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Gates
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/10">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Subject</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Lifecycle</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Logistics Timeline</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 text-right">Gate Ops</th>
                </tr>
              </thead>
              <tbody>
                {activePasses.map(pass => (
                  <tr key={pass._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-8 border-b border-slate-50 font-black text-slate-800 tracking-tight">
                      <div className="flex flex-col">
                        <span>{pass.studentId.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{pass.studentId.rollNo}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-indigo-100">
                        {pass.status.replace("_", " ")}
                      </div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className={`text-[8px] font-black uppercase ${pass.hostelOutTime ? 'text-indigo-600' : 'text-slate-300'}`}>Hostel Exit</span>
                          <span className="text-xs font-bold text-slate-700">{formatTime(pass.hostelOutTime)}</span>
                        </div>
                        <div className="w-4 h-[1px] bg-slate-200 mt-2"></div>
                        <div className="flex flex-col items-center">
                          <span className={`text-[8px] font-black uppercase ${pass.libraryInTime ? 'text-indigo-600' : 'text-slate-300'}`}>Lib Entry</span>
                          <span className="text-xs font-bold text-slate-700">{formatTime(pass.libraryInTime)}</span>
                        </div>
                        <div className="w-4 h-[1px] bg-slate-200 mt-2"></div>
                        <div className="flex flex-col items-center">
                          <span className={`text-[8px] font-black uppercase ${pass.libraryOutTime ? 'text-indigo-600' : 'text-slate-300'}`}>Lib Exit</span>
                          <span className="text-xs font-bold text-slate-700">{formatTime(pass.libraryOutTime)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50 text-right space-x-3">
                      {!pass.hostelOutTime && (
                        <button
                          onClick={() => handleAction("hostel-exit", pass._id)}
                          className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                        >
                          Open Gate
                        </button>
                      )}
                      {(pass.status === "IN_LIBRARY" || (pass.status === "APPROVED" && pass.hostelOutTime)) && (
                        <button
                          onClick={() => handleAction("hostel-entry", pass._id)}
                          className="bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-200"
                        >
                          Confirm Entry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {activePasses.length === 0 && (
                  <tr><td colSpan={4} className="py-24 text-center font-black text-slate-300 uppercase tracking-[0.5em] text-sm">Quiet night at the entrance</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
          <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Movement History</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Sessions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/10">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Hostel Exit</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Lib In/Out</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Hostel Re-entry</th>
                </tr>
              </thead>
              <tbody>
                {historyPasses.map(pass => (
                  <tr key={pass._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="font-black text-slate-800 tracking-tight">{pass.studentId.name}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pass.studentId.rollNo}</div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="text-sm font-bold text-slate-700">{formatTime(pass.hostelOutTime)}</div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="text-[10px] font-bold text-slate-600">IN: {formatTime(pass.libraryInTime)}</div>
                      <div className="text-[10px] font-bold text-slate-600">OUT: {formatTime(pass.libraryOutTime)}</div>
                    </td>
                    <td className="px-10 py-8 border-b border-slate-50">
                      <div className="text-sm font-black text-indigo-600">{formatTime(pass.hostelInTime)}</div>
                    </td>
                  </tr>
                ))}
                {historyPasses.length === 0 && (
                  <tr><td colSpan={4} className="py-24 text-center font-black text-slate-300 uppercase tracking-[0.5em] text-sm">No history yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
