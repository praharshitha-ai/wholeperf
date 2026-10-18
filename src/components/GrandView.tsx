import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Activity, 
  Package, 
  AlertCircle, 
  Search, 
  Filter, 
  Download,
  Share2,
  Clock,
  Heart,
  RefreshCw,
  CloudCheck
} from 'lucide-react';
import { 
  db, 
  auth,
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const initialRecords = [
  { id: 'WP-7212', case: 'CABG x3', doc: 'Dr. Aris Thorne', date: 'May 08, 2026', safety: '99.2%' },
  { id: 'WP-7213', case: 'Valve Replacement', doc: 'Dr. Elena Vance', date: 'May 08, 2026', safety: '98.5%' },
  { id: 'WP-7214', case: 'Aortic Repair', doc: 'Dr. Marcus Sterling', date: 'May 07, 2026', safety: '97.8%' },
  { id: 'WP-7215', case: 'Heart Transplant', doc: 'Dr. Sarah Chen', date: 'May 06, 2026', safety: '99.9%' },
  { id: 'WP-7216', case: 'Bentall Procedure', doc: 'Dr. Iyer', date: 'May 05, 2026', safety: '98.2%' },
  { id: 'WP-7217', case: 'Double Lung Transplant', doc: 'Dr. Reddy', date: 'May 05, 2026', safety: '97.5%' },
  { id: 'WP-7218', case: 'ASD Closure', doc: 'Dr. Sarah Chen', date: 'May 04, 2026', safety: '99.4%' },
  { id: 'WP-7219', case: 'ECMO Initiation', doc: 'Dr. Marcus Sterling', date: 'May 04, 2026', safety: '99.0%' },
  { id: 'WP-7220', case: 'Thoracic Aorta Repair', doc: 'Dr. Aris Thorne', date: 'May 03, 2026', safety: '98.7%' },
];

const chartData = [
  { name: 'Mon', surgeries: 8, efficiency: 94 },
  { name: 'Tue', surgeries: 12, efficiency: 91 },
  { name: 'Wed', surgeries: 10, efficiency: 96 },
  { name: 'Thu', surgeries: 15, efficiency: 92 },
  { name: 'Fri', surgeries: 11, efficiency: 95 },
  { name: 'Sat', surgeries: 4, efficiency: 98 },
  { name: 'Sun', surgeries: 3, efficiency: 97 },
];

export default function GrandRecordsView() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(collection(db, 'records'), (snapshot) => {
          if (snapshot.empty) {
            initialRecords.forEach(async (r) => {
              await setDoc(doc(db, 'records', r.id), r);
            });
          } else {
            setRecords(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
          }
          setLastUpdate(new Date());
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'records');
        });
        return () => unsubscribeSnapshot();
      } else {
        setRecords(initialRecords);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const [doctorFilter, setDoctorFilter] = useState('all');
  const [caseFilter, setCaseFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const surgeons = ['Dr. Aris Thorne', 'Dr. Elena Vance', 'Dr. Marcus Sterling', 'Dr. Sarah Chen'];
  const caseTypes = ['CABG', 'Valve Replacement', 'Aortic Aneurysm', 'Congenital', 'Peripheral', 'Heart Transplant', 'Carotid Endarterectomy'];

  return (
    <div id="grand-view" className="space-y-6">
      <header id="view-header" className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Grand Records</h1>
          <p className="text-slate-500">Centralized database for all historical and live perfusion data.</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl shadow-sm">
            <RefreshCw size={14} className="animate-spin-slow" />
            <span>Data updates automatically every hour</span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2 bg-slate-100 px-2 py-0.5 rounded">
            Last Batch: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </header>

      <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3">
        <div className="p-2 bg-rose-600 rounded-lg">
          <Clock size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-rose-900">Automated Data Cycle Confirmed</p>
          <p className="text-xs text-rose-700">Data updates automatically every hour. Wholeperf Central Processing Unit synchronizes all clinical logs and surgical telemetry.</p>
        </div>
      </div>

      <div id="records-filters" className="flex flex-col gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Patient ID or Keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-500 transition-all font-medium placeholder:text-slate-400" 
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-colors font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95">
            <Download size={16} />
            Export Vault
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Surgical Lead</label>
            <select 
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-rose-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Doctors</option>
              {surgeons.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Case Category</label>
            <select 
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-rose-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Cases</option>
              {caseTypes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Timeline</label>
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-rose-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Monthly</option>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select 
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-rose-500 transition-all appearance-none cursor-pointer"
              >
                <option value="2024">2026</option>
                <option value="2023">2025</option>
                <option value="2022">2024</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div id="records-table" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 text-lg">Detailed Procedural Vault</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Live Sync Enabled</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Patient ID</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Procedure</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Lead Surgeon</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Date</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Safety Index</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-50 last:border-none">
                  <td className="p-4 font-black text-rose-600 text-sm">{record.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-sm">{record.case}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Standard Protocol v4.2</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300" />
                      <span className="text-sm font-bold text-slate-700">{record.doc}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={12} />
                      <span className="text-xs font-bold">{record.date}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: record.safety }} />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 tracking-tighter">{record.safety}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em] hover:tracking-[0.3em] transition-all">
            Load Full Surgical History
          </button>
        </div>
      </div>

      <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: '8,214', icon: Users, color: 'blue' },
          { label: 'Avg Efficiency', value: '94.2%', icon: Activity, color: 'emerald' },
          { label: 'Critical Errors', value: '0.02%', icon: AlertCircle, color: 'rose' },
          { label: 'Active Circuits', value: '06', icon: Heart, color: 'rose' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <Share2 size={16} className="text-slate-300 cursor-pointer hover:text-slate-500" />
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <h3 className="font-black text-slate-900 text-lg mb-8">Surgery Volume Analysis</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#fff1f2'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(225,29,72,0.1)' }}
                />
                <Bar dataKey="surgeries" fill="#e11d48" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16" />
        </div>

        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <h3 className="font-black text-slate-900 text-lg mb-8">Clinical Safety Efficiency</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} domain={[80, 100]} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="efficiency" stroke="#10b981" fillOpacity={1} fill="url(#colorEff)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
