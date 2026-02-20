"use client";

import { IUser } from "@/types/user";
import { useEffect, useState } from "react";

interface Props {
  user: IUser;
}

export default function LibrarianView({ user }: Props) {
  const [passes, setPasses] = useState<any[]>([]);
  const [registry, setRegistry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [passesRes, registryRes] = await Promise.all([
        fetch("/api/pass"),
        fetch("/api/pass/registry")
      ]);
      const [passesData, registryData] = await Promise.all([
        passesRes.json(),
        registryRes.json()
      ]);
      setPasses(passesData);
      setRegistry(registryData);
    } catch (err) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (endpoint: string, passId: string) => {
    const res = await fetch(`/api/pass/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passId }),
    });

    if (res.ok) {
      fetchData();
    } else {
      console.warn("Action failed");
    }
  };

  const formatTime = (date: any) => {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in zoom-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Library Concierge</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Administrator: <span className="gradient-text font-black">{user.name}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-white/50 hover:bg-white px-6 py-4 rounded-3xl border border-slate-200 flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50"
          >
            <svg className={`w-4 h-4 text-indigo-600 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Refresh Registry</span>
          </button>
          <div className="bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 flex items-center gap-4">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Digital Registry Online</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -top-10 -left-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21l-8-4.5v-9L12 3l8 4.5v9z" />
              </svg>
            </div>
            <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-indigo-200">Session Protocols</h3>
            <ul className="space-y-4 relative">
              {[
                "Verify student identity upon entry.",
                "Mark exits promptly to avoid transit discrepancies.",
                "Ensure silence is maintained in study bays."
              ].map((text, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-indigo-50 leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 ring-1 ring-slate-200/50">
            <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-widest">Quick View</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Readers</span>
                <span className="text-xl font-black text-indigo-600">{passes.filter(p => p.status === "IN_LIBRARY").length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Visit Log</span>
                <span className="text-xl font-black text-indigo-600">{registry.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          {/* Active Traffic Table */}
          <section className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">Live Traffic Management</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time entry & exit control</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/10">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 underline decoration-indigo-200 decoration-2 underline-offset-4">Identity</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100">Session Stage</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 text-right">Desk Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {passes.map(pass => (
                    <tr key={pass._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            {pass.studentId.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 tracking-tight text-lg">{pass.studentId.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pass.studentId.rollNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${pass.status === "APPROVED" ? "bg-amber-50 text-amber-600 ring-1 ring-amber-100" :
                          "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pass.status === "APPROVED" ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`}></span>
                          {pass.status === "APPROVED" ? "Awaiting Check-in" : "In Library"}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        {pass.status === "APPROVED" ? (
                          <button
                            onClick={() => handleAction("library-entry", pass._id)}
                            className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-indigo-600 hover:scale-105 transition-all active:scale-95 shadow-xl shadow-slate-100"
                          >
                            Check In
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction("library-exit", pass._id)}
                            disabled={!!pass.libraryOutTime}
                            className={`font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-xl ${pass.libraryOutTime
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:scale-105 active:scale-95 border border-indigo-200"
                              }`}
                          >
                            {pass.libraryOutTime ? "Marked Departed" : "Mark Departure"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {passes.length === 0 && (
                    <tr><td colSpan={3} className="py-40 text-center font-black text-slate-300 uppercase tracking-[0.5em] text-sm">Quiet hours in session</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Library Registry (Date-wise visits) */}
          <section className="bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-white/5">
              <div className="p-3 bg-white/10 text-white rounded-2xl shadow-inner border border-white/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">Today's Library Registry</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified visits for {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5">Learner</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5">Entry</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5">Exit</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registry.map(record => (
                    <tr key={record._id} className="group hover:bg-white/5 transition-all duration-300">
                      <td className="px-10 py-8">
                        <div className="font-black text-white tracking-tight">{record.name}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{record.rollNo}</div>
                      </td>
                      <td className="px-10 py-8 text-slate-300 font-bold text-sm tracking-tight">{formatTime(record.inTime)}</td>
                      <td className="px-10 py-8 text-slate-300 font-bold text-sm tracking-tight">{formatTime(record.outTime)}</td>
                      <td className="px-10 py-8 text-right">
                        <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${record.outTime ? 'text-emerald-400 bg-emerald-400/10' : 'text-indigo-400 bg-indigo-400/10'}`}>
                          {record.outTime ? 'Completed' : 'Reading'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {registry.length === 0 && (
                    <tr><td colSpan={4} className="py-24 text-center font-black text-slate-700 uppercase tracking-[0.5em] text-sm">Registry is empty today</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
