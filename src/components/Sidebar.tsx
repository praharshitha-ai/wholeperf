import React from 'react';
import { 
  Calculator, 
  Boxes, 
  History, 
  ShieldAlert, 
  LayoutDashboard,
  Heart,
  Monitor
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const items = [
    { id: 'dual', label: 'Metric Console', icon: Monitor },
    { id: 'calculator', label: 'Perfusion Calculator', icon: Calculator },
    { id: 'logs', label: 'Patient Logs', icon: History },
    { id: 'inventory', label: 'Perfusion Inventory', icon: Boxes },
    { id: 'grand', label: 'Grand Records', icon: LayoutDashboard },
    { id: 'advanced', label: 'System Control', icon: ShieldAlert },
  ];

  return (
    <div id="sidebar" className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800">
      <div id="sidebar-header" className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
          <Heart className="text-white w-5 h-5 fill-current" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">Wholeperf</span>
      </div>

      <nav id="sidebar-nav" className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div id="sidebar-footer" className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
            CP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Arjun Mehta</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Perfusionist</span>
          </div>
        </div>
      </div>
    </div>
  );
}
