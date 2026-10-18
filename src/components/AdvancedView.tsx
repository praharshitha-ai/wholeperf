import React from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, Server, Database, Globe, Bell, Lock, UserPlus, History, ShieldCheck } from 'lucide-react';

export default function AdvancedView() {
  return (
    <div id="advanced-view" className="space-y-6">
      <header id="view-header" className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-slate-500">Configure core facility settings, user permissions, and digital infrastructure.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg">
          <UserPlus size={16} />
          Provision New User
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="text-rose-600" size={20} />
                <h3 className="font-black text-slate-900 uppercase tracking-tighter">Access & Authentication Logs</h3>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">Live Stream</div>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action/Event</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { user: 'Dr. Aris Thorne', id: 'UP-7212', action: 'Terminal Sync Success', time: '14:22:15', status: 'Verified' },
                    { user: 'Perfusionist X-1', id: 'PX-9921', action: 'New User Provisioned', time: '12:05:30', status: 'Provisioned' },
                    { user: 'System Admin', id: 'ROOT', action: 'Security Protocol Override', time: '09:12:44', status: 'Overridden' },
                    { user: 'Dr. Elena Vance', id: 'UP-3310', action: 'Login Attempt Failure', time: '08:45:12', status: 'Blocked' },
                  ].map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900 text-sm">{log.user}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{log.id}</div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-600">{log.action}</td>
                      <td className="px-8 py-5 text-xs font-mono text-slate-400">{log.time}</td>
                      <td className="px-8 py-5 text-right">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                          log.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' :
                          log.status === 'Blocked' ? 'bg-rose-50 text-rose-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 text-center border-t border-slate-50">
                <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">View All Infrastructure Logs</button>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" size={20} />
              <h3 className="font-black text-slate-900 uppercase tracking-tighter">Privacy & Compliance Settings</h3>
            </div>
            <div className="p-8 space-y-4">
              {[
                { title: 'Multi-Factor Bio-Auth', desc: 'Secure medical data with required biometric verification for all surgical staff.', status: true },
                { title: 'Terminal Logout (Idle)', desc: 'Automatically lock clinician terminals after 5 minutes of inactivity.', status: true },
                { title: 'External Lab Integration', desc: 'Allow verified third-party pathology software to feed hemodynamic data.', status: false },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{setting.title}</h4>
                    <p className="text-xs text-slate-500">{setting.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${setting.status ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${setting.status ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Server className="text-emerald-600" size={18} />
              <h3 className="font-bold text-slate-900">Infrastructure Health</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Central Server Storage</span>
                    <span className="text-sm font-medium text-slate-500">72% Full</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[72%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Medical Image CDN Latency</span>
                    <span className="text-sm font-medium text-slate-500">22ms</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[15%]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-amber-500" size={24} />
              <h3 className="font-bold text-lg">License Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Edition</span>
                <span className="font-bold text-blue-400">Enterprise Elite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Status</span>
                <span className="font-bold text-emerald-400">Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Expiration</span>
                <span className="font-bold">Dec 2026</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all border border-white/10">
              Manage Subscription
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Data Export', icon: Database },
                { label: 'Public Web', icon: Globe },
                { label: 'System Logs', icon: Settings },
                { label: 'Alert Config', icon: Bell },
              ].map((item, i) => (
                <button key={i} className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all group">
                  <item.icon size={20} className="text-slate-400 group-hover:text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
