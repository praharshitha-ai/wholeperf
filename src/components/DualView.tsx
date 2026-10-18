import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Wind, 
  Thermometer, 
  Droplet, 
  Zap, 
  RotateCcw, 
  Cpu,
  Monitor,
  Clock,
  User
} from 'lucide-react';

export default function DualView() {
  const [time, setTime] = useState(new Date());
  const [vitals, setVitals] = useState({
    map: 65,
    cvp: 8,
    temp: 36.5,
    svo2: 75,
    flow: 4.2,
    rpm: 2450,
    res: 850,
    artP: 180
  });

  // Simulate real-time data jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setVitals(v => ({
        map: v.map + (Math.random() - 0.5) * 2,
        cvp: v.cvp + (Math.random() - 0.5) * 0.5,
        temp: v.temp + (Math.random() - 0.5) * 0.1,
        svo2: v.svo2 + (Math.random() - 0.5) * 1,
        flow: v.flow + (Math.random() - 0.5) * 0.1,
        rpm: v.rpm + (Math.random() - 0.5) * 20,
        res: v.res - (Math.random() * 0.5), // Slow drain simulation
        artP: v.artP + (Math.random() - 0.5) * 5
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="dual-perfusion-view" className="h-full flex flex-col gap-6">
      {/* Patient Profile & HUD Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Patient Profile Card */}
        <div className="xl:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
            <User size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-black text-slate-900 truncate">Sanjeev Kumar</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md tracking-widest">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">ID Number</p>
                <p className="text-[10px] font-bold text-rose-600">PX-9921</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Age / Sex</p>
                <p className="text-[10px] font-bold text-slate-700">62 / Male</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Weight</p>
                <p className="text-[10px] font-bold text-slate-700">74.5 kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global HUD Bar */}
        <div className="xl:col-span-2 flex items-center justify-between bg-slate-900 rounded-2xl p-4 text-white border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/40">
              <Monitor size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-rose-500">Metric Perfusion Console</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">High-Fidelity Telemetry • v4.2.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">System Clock</p>
              <p className="text-lg font-mono font-bold">
                {time.toLocaleTimeString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true 
                })}
              </p>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="text-right">
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">Total Bypass Time</p>
              <p className="text-lg font-mono font-bold text-emerald-400">01:42:15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left Section: Hemodynamics */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="text-rose-500" size={18} />
              <h3 className="font-bold text-slate-900">Patient Hemodynamics</h3>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Live Feed</span>
          </div>
          
          <div className="flex-1 p-6 grid grid-cols-2 gap-4">
            <DataCard label="Mean Art. Pressure" value={Math.round(vitals.map)} unit="mmHg" icon={Droplet} color="rose" />
            <DataCard label="Central Venous P." value={vitals.cvp.toFixed(1)} unit="mmHg" icon={Activity} color="blue" />
            <DataCard label="Core Temperature" value={vitals.temp.toFixed(1)} unit="°C" icon={Thermometer} color="amber" />
            <DataCard label="Venous Saturation" value={Math.round(vitals.svo2)} unit="%" icon={Wind} color="emerald" />
            
            <div className="col-span-2 mt-4 h-32 bg-slate-900 rounded-2xl relative overflow-hidden flex items-end px-4 pb-4">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ECG Signal (II)</span>
              </div>
              <svg className="w-full h-full text-rose-500 opacity-60" preserveAspectRatio="none" viewBox="0 0 400 100">
                <path d="M0 50 L50 50 L60 20 L75 80 L85 50 L150 50 L160 10 L175 90 L185 50 L250 50 L260 30 L275 70 L285 50 L400 50" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Section: Machine Parameters */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="text-blue-400" size={18} />
              <h3 className="font-bold text-white">Machine Parameters</h3>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Active State</span>
          </div>

          <div className="flex-1 p-6 grid grid-cols-2 gap-4">
            <DataCard label="Blood Flow Rate" value={vitals.flow.toFixed(2)} unit="L/min" icon={Zap} color="blue" dark />
            <DataCard label="Centrifugal RPM" value={Math.round(vitals.rpm).toLocaleString()} unit="RPM" icon={RotateCcw} color="slate" dark />
            <DataCard label="Venous Reservoir" value={Math.round(vitals.res)} unit="mL" icon={Droplet} color="rose" dark />
            <DataCard label="Arterial Pressure" value={Math.round(vitals.artP)} unit="mmHg" icon={Activity} color="amber" dark />

            <div className="col-span-2 mt-4 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pump Controller V3</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Synchronized</span>
              </div>
              <div className="flex gap-2 h-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i < 8 ? 'bg-blue-500/40' : 'bg-slate-700/30'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Alerts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
          <Clock size={20} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Critical Event</p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-900">13:12:04</span>
            <span className="text-xs text-slate-500">Flow drop detected - Corrected automatically by Auto-RPM module.</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
          View Event Log
        </button>
      </div>
    </div>
  );
}

function DataCard({ label, value, unit, icon: Icon, color, dark = false }: any) {
  const colors: any = {
    rose: dark ? 'text-rose-400' : 'text-rose-600',
    blue: dark ? 'text-blue-400' : 'text-blue-600',
    emerald: dark ? 'text-emerald-400' : 'text-emerald-600',
    amber: dark ? 'text-amber-400' : 'text-amber-600',
    slate: dark ? 'text-slate-300' : 'text-slate-700'
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      dark 
      ? 'bg-slate-800/40 border-slate-700/50' 
      : 'bg-white border-slate-100 hover:border-rose-100'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
        <Icon className={colors[color]} size={14} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
        <span className={`text-[10px] font-bold uppercase ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{unit}</span>
      </div>
    </div>
  );
}
