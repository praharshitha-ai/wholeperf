import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Search, 
  Filter, 
  FileEdit, 
  ClipboardCheck, 
  Activity, 
  Calendar,
  History,
  ChevronRight,
  TrendingUp,
  Plus,
  Save,
  X,
  Heart,
  CloudCheck
} from 'lucide-react';
import { 
  db, 
  auth, 
  collection, 
  doc, 
  setDoc, 
  where,
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  handleFirestoreError,
  OperationType 
} from '../lib/firebase';

const initialRecordings = [
  { 
    id: 'P-901', 
    name: 'Rajesh Kumar', 
    procedure: 'AVR + CABG x2', 
    date: '2024-05-08', 
    bsa: 1.82, 
    surgeon: 'Dr. Gupta', 
    status: 'Intra-Op',
    notes: 'Standard cannulation, bypass initiated smoothly.',
    postOpNotes: 'Stable hemodynamic profile. Awaiting ICU transfer.'
  }
];

export default function PatientLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any | null>(null);

  useEffect(() => {
    // Wait for auth to be ready
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(
          collection(db, 'patients'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setLogs(docs.length > 0 ? docs : initialRecordings);
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'patients');
        });

        return () => unsubscribeSnapshot();
      } else {
        setLogs(initialRecordings);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleAddNew = () => {
    const newId = `P-${Math.floor(100 + Math.random() * 900)}`;
    const newLog = {
      id: newId,
      name: '',
      procedure: '',
      date: new Date().toISOString().split('T')[0],
      bsa: 0,
      surgeon: '',
      status: 'Intra-Op',
      notes: '',
      postOpNotes: ''
    };
    setEditFormData(newLog);
    setIsEditing(true);
  };

  const handleEdit = (log: any) => {
    setEditFormData({ ...log });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !auth.currentUser) return;

    try {
      const docRef = doc(db, 'patients', editFormData.id);
      const dataToSave = {
        ...editFormData,
        userId: auth.currentUser.uid,
        updatedAt: serverTimestamp(),
        createdAt: editFormData.createdAt || serverTimestamp()
      };
      await setDoc(docRef, dataToSave);
      setIsEditing(false);
      setEditFormData(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `patients/${editFormData.id}`);
    }
  };

  return (
    <div id="patient-logs-view" className="space-y-6">
      <div className="flex items-center justify-between">
        <header id="view-header">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patient Procedure Logs</h1>
          <p className="text-slate-500">Comprehensive perfusion records and intra-operative notes.</p>
        </header>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
          >
            <Plus size={18} />
            New Procedure Log
          </button>
          <div className="hidden md:flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl font-bold text-sm border border-rose-100">
            <Activity size={16} className="animate-pulse" />
            <span>Real-time Sync Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name or ID..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelectedLog(log);
                  setIsEditing(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedLog?.id === log.id 
                  ? 'bg-rose-50 border-rose-200 shadow-md' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{log.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    log.status === 'Intra-Op' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>{log.status}</span>
                </div>
                <h4 className="font-bold text-slate-900">{log.name || 'Untitled Record'}</h4>
                <p className="text-xs text-slate-500 mt-1">{log.procedure || 'No procedure defined'}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] font-medium text-slate-400 italic">Dr. {log.surgeon || 'Unassigned'}</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isEditing && editFormData ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden"
              >
                <form onSubmit={handleSave}>
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center">
                        <FileEdit size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black">
                          {logs.find(l => l.id === editFormData.id) ? 'Edit Record' : 'Create New Record'}
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{editFormData.id}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Patient Name</label>
                        <input 
                          required
                          value={editFormData.name}
                          onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Procedure Type</label>
                        <input 
                          required
                          value={editFormData.procedure}
                          onChange={e => setEditFormData({...editFormData, procedure: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                          placeholder="e.g. CABG x3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Surgeon</label>
                        <input 
                          required
                          value={editFormData.surgeon}
                          onChange={e => setEditFormData({...editFormData, surgeon: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                          placeholder="e.g. Dr. Verma"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</label>
                        <select 
                          value={editFormData.status}
                          onChange={e => setEditFormData({...editFormData, status: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none font-medium appearance-none"
                        >
                          <option value="Intra-Op">Intra-Op</option>
                          <option value="Post-Op">Post-Op</option>
                          <option value="Pre-Op">Pre-Op</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Perfusionist Observations</label>
                      <textarea 
                        value={editFormData.notes}
                        onChange={e => setEditFormData({...editFormData, notes: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none font-medium h-32 resize-none"
                        placeholder="Detailed intra-operative notes..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Post-Operative Recovery Notes</label>
                      <textarea 
                        value={editFormData.postOpNotes}
                        onChange={e => setEditFormData({...editFormData, postOpNotes: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none font-medium h-32 resize-none"
                        placeholder="Recovery status, ICU transfer notes, etc..."
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700"
                    >
                      Discard Changes
                    </button>
                    <button 
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      <Save size={18} />
                      Commit Record
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : selectedLog ? (
              <motion.div
                key={selectedLog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white">
                      <User size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{selectedLog.name}</h2>
                      <p className="text-slate-500 font-medium">Record ID: {selectedLog.id} • BSA: {selectedLog.bsa} m²</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEdit(selectedLog)}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-600 text-sm"
                  >
                    <FileEdit size={18} />
                    Modify
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Procedure Details</h5>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 py-2 border-b border-slate-50">
                          <ClipboardCheck className="text-rose-500" size={18} />
                          <span className="text-sm font-medium text-slate-700">{selectedLog.procedure}</span>
                        </div>
                        <div className="flex items-center gap-3 py-2 border-b border-slate-50">
                          <User className="text-slate-400" size={18} />
                          <span className="text-sm font-medium text-slate-700">Surgeon: {selectedLog.surgeon}</span>
                        </div>
                        <div className="flex items-center gap-3 py-2 border-b border-slate-50">
                          <Calendar className="text-slate-400" size={18} />
                          <span className="text-sm font-medium text-slate-700">Date: {selectedLog.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intra-Op Performance</h5>
                      <div className="p-4 bg-slate-900 rounded-2xl text-white">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-slate-400">ECC Efficiency</span>
                          <TrendingUp className="text-emerald-400" size={16} />
                        </div>
                        <p className="text-2xl font-black italic">98.4%</p>
                        <p className="text-[10px] text-slate-500 mt-1">Flow stability within normal variance.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4">Perfusionist Observations</h5>
                      <p className="text-sm text-slate-700 leading-relaxed italic">
                        "{selectedLog.notes}"
                      </p>
                    </div>

                    {selectedLog.postOpNotes && (
                      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">Post-Operative Recovery Notes</h5>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {selectedLog.postOpNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <History size={12} />
                    <span>Last updated 24 mins ago</span>
                  </div>
                  <button className="text-blue-600 font-bold text-sm hover:underline">Download Detailed PDF Report</button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-4">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Selection Required</h3>
                <p className="text-slate-500 text-center max-w-xs">Please select a patient record from the sidebar to view full procedural telemetry and logs.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
