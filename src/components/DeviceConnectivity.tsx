import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bluetooth, 
  BluetoothOff, 
  Link, 
  Unlink, 
  Cpu, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  X,
  Smartphone,
  Tablet,
  Search
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'HLM' | 'Monitor' | 'Tablet';
  signal: number;
}

interface DeviceConnectivityProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (deviceName: string | null) => void;
  connectedDevice: string | null;
}

export default function DeviceConnectivity({ isOpen, onClose, onConnect, connectedDevice }: DeviceConnectivityProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mockDevices: Device[] = [
    { id: 'HLM-882', name: 'Master-Pump HL800', type: 'HLM', signal: 92 },
    { id: 'MON-102', name: 'Hemosphere Prime', type: 'Monitor', signal: 78 },
    { id: 'TAB-LX', name: 'Circulatory Tablet Pro', type: 'Tablet', signal: 85 },
  ];

  const startScan = () => {
    setIsScanning(true);
    setError(null);
    setDevices([]);
    
    setTimeout(() => {
      setDevices(mockDevices);
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    if (isOpen && !connectedDevice) {
      startScan();
    }
  }, [isOpen]);

  const handleConnect = (device: Device) => {
    setIsScanning(true);
    setTimeout(() => {
      onConnect(device.name);
      setIsScanning(false);
      onClose();
    }, 1500);
  };

  const handleDisconnect = () => {
    onConnect(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Bluetooth size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Sync Protocol</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Device Pairing Interface</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {connectedDevice ? (
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-sm mb-4 border border-emerald-50">
                  <Link size={28} />
                </div>
                <h3 className="text-lg font-black text-emerald-900">{connectedDevice}</h3>
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-1">Active Synchronization</p>
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-500 text-[10px] font-black uppercase">
                  <Activity size={12} className="animate-pulse" />
                  Live Telemetry Stream
                </div>
              </div>
              
              <button 
                onClick={handleDisconnect}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
              >
                <Unlink size={16} />
                Terminate Connection
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nearby Hardware</p>
                {isScanning && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase">
                    <RefreshCw size={12} className="animate-spin" />
                    Scanning...
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {devices.length > 0 ? (
                  devices.map((device) => (
                    <button
                      key={device.id}
                      onClick={() => handleConnect(device)}
                      disabled={isScanning}
                      className="w-full p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md rounded-2xl flex items-center gap-4 transition-all group"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm border border-slate-100">
                        {device.type === 'HLM' ? <Cpu size={20} /> : <Tablet size={20} />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{device.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">{device.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 items-end h-3">
                          {[1, 2, 3, 4].map(i => (
                            <div 
                              key={i} 
                              className={`w-0.5 rounded-full ${i <= (device.signal/25) ? 'bg-emerald-500' : 'bg-slate-200'}`}
                              style={{ height: `${i * 3}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  ))
                ) : isScanning ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-full h-[72px] bg-slate-50 rounded-2xl animate-pulse" />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-xs text-slate-400 font-bold uppercase">No hardware detected in proximity</p>
                    <button 
                      onClick={startScan}
                      className="mt-4 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      Retry Discovery
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="text-blue-600 mt-0.5" size={16} />
                <p className="text-[10px] text-blue-800 leading-relaxed font-bold">
                  Ensure the Heart-Lung Machine Bluetooth transponder is in 'Listen' mode and within 3 meters of this station.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
