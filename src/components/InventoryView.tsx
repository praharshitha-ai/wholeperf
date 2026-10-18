import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  RefreshCw, 
  AlertTriangle, 
  ArrowUpRight, 
  Search, 
  Database,
  CloudDownload,
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

const initialInventory = [
  { id: '1', name: 'Terumo Capiox FX25', category: 'Oxygenators', stock: 12, status: 'In Stock', threshold: 5, lastSync: '12 mins ago' },
  { id: '2', name: 'Nippon Centrifugal Pump', category: 'Equipment', stock: 3, status: 'Low Stock', threshold: 10, lastSync: '12 mins ago' },
  { id: '3', name: 'Custodiol HTK (Bharat Serum)', category: 'Medication', stock: 45, status: 'In Stock', threshold: 20, lastSync: '45 mins ago' },
  { id: '4', name: 'Adult Custom Tubing Kit (Poly Medicure)', category: 'Tubing Kits', stock: 28, status: 'In Stock', threshold: 15, lastSync: '12 mins ago' },
  { id: '5', name: 'Femoral Cannula 19Fr (Edward)', category: 'Cannulae', stock: 2, status: 'Low Stock', threshold: 4, lastSync: '1 hour ago' },
  { id: '6', name: 'Heparin 25,000 IU (Gland Pharma)', category: 'Medication', stock: 10, status: 'Low Stock', threshold: 20, lastSync: '12 mins ago' },
  { id: '7', name: 'Adrenaline 1mg (Sun Pharma)', category: 'Medication', stock: 50, status: 'In Stock', threshold: 25, lastSync: '5 mins ago' },
  { id: '8', name: 'Protamine Sulfate (Samarth Life Sciences)', category: 'Medication', stock: 30, status: 'In Stock', threshold: 15, lastSync: '10 mins ago' },
  { id: '9', name: 'Sodium Bicarbonate 7.5% (Neon Labs)', category: 'Medication', stock: 100, status: 'In Stock', threshold: 50, lastSync: '22 mins ago' },
  { id: '10', name: 'Hemoconcentrator (Poly Medicure)', category: 'Filters', stock: 15, status: 'In Stock', threshold: 10, lastSync: '30 mins ago' },
  { id: '11', name: 'Arterial Filter 40µ (Meril Life)', category: 'Filters', stock: 8, status: 'In Stock', threshold: 5, lastSync: '15 mins ago' },
  { id: '12', name: 'Noradrenaline 2mg (Viatris)', category: 'Medication', stock: 4, status: 'Low Stock', threshold: 10, lastSync: '8 mins ago' },
];

export default function InventoryView() {
  const [items, setItems] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLowStockAlert, setShowLowStockAlert] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(collection(db, 'inventory'), (snapshot) => {
          if (snapshot.empty) {
            // Initialize FB with defaults if empty
            initialInventory.forEach(async (item) => {
              await setDoc(doc(db, 'inventory', item.id), item);
            });
          } else {
            setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'inventory');
        });
        return () => unsubscribeSnapshot();
      } else {
        setItems(initialInventory);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const lowStockItems = items.filter(item => item.stock <= (item.threshold || 0));

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulation of a fetch from a central pharmacopia
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div id="inventory-view" className="space-y-6">
      <div className="flex items-center justify-between">
        <header id="view-header">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Perfusion Inventory</h1>
          <p className="text-slate-500">Inventory levels synchronized with central facility pharmacy.</p>
        </header>
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            className={`flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl transition-all font-bold ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800'}`}
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync with Pharmacy'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {lowStockItems.length > 0 && showLowStockAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-black text-amber-900 leading-tight">Critical Inventory Threshold Reached</h4>
                  <p className="text-xs text-amber-700 font-medium">
                    {lowStockItems.length} items have dropped below their reorder points. Action required to prevent clinical disruption.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowLowStockAlert(false)}
                  className="px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-xl text-xs font-black hover:bg-amber-100 transition-colors"
                >
                  Dismiss
                </button>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-black hover:bg-amber-700 transition-shadow shadow-lg shadow-amber-200">
                  Reorder All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Stock</h3>
            <Package className="text-rose-500" size={20} />
          </div>
          <p className="text-4xl font-black text-slate-900">412</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 w-fit rounded-lg">
            <CloudDownload size={14} />
            <span>Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Urgent Reorder</h3>
            <AlertTriangle className={lowStockItems.length > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-200'} size={20} />
          </div>
          <p className="text-4xl font-black text-slate-900">{lowStockItems.length.toString().padStart(2, '0')}</p>
          <p 
            onClick={() => setShowLowStockAlert(true)}
            className="mt-4 text-xs text-rose-500 font-bold italic underline cursor-pointer"
          >
            View depleted critical items
          </p>
        </div>

        <div className="p-6 bg-rose-600 rounded-2xl text-white shadow-xl shadow-rose-900/20 relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <h3 className="text-sm font-bold opacity-80 mb-1">Infrastructure Link</h3>
            <div className="flex items-center gap-2">
              <Database size={24} />
              <p className="text-2xl font-black">Connected</p>
            </div>
            <p className="text-[10px] uppercase font-black mt-2 tracking-tighter bg-rose-500/50 w-fit px-2 py-0.5 rounded">Real-time DB Active</p>
          </div>
          <div className="absolute right-0 bottom-0 p-4 opacity-10">
            <RefreshCw size={80} className="text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <h3 className="font-black text-slate-900 text-lg">Supply Status Matrix</h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by lot#, name or category..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-6 py-5">Item Definition</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Quantity</th>
                <th className="px-6 py-5">Facility Status</th>
                <th className="px-6 py-5">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              {items.map((item, i) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`hover:bg-slate-50/80 transition-colors group ${item.stock <= item.threshold ? 'bg-amber-50/30' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.stock <= item.threshold && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
                      )}
                      <div>
                        <span className="font-bold text-slate-900 not-italic block">{item.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter not-italic">Ref: LP-{item.id}412</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600 px-2 py-1 bg-slate-100 rounded-lg not-italic">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 not-italic text-lg">{item.stock}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase not-italic">Threshold: {item.threshold}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest not-italic ${
                      item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-400 not-italic flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                      <RefreshCw size={12} />
                      {item.lastSync}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
