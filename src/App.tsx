/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import GrandRecordsView from './components/GrandView';
import CalculatorView from './components/CalculatorView';
import InventoryView from './components/InventoryView';
import PatientLogsView from './components/PatientLogsView';
import AdvancedView from './components/AdvancedView';
import DualView from './components/DualView';
import LoginView from './components/LoginView';
import ProfileView from './components/ProfileView';
import DeviceConnectivity from './components/DeviceConnectivity';
import { ViewType, UserRole } from './types';
import { Bell, Search, Settings, Heart, LogOut, Bluetooth, Link, Mail, CloudCheck } from 'lucide-react';
import { auth, signOut } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dual');
  const [showSplash, setShowSplash] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isConnectivityOpen, setIsConnectivityOpen] = useState(false);
  const [connectedHardware, setConnectedHardware] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // If logged in via Firebase, we still need a "role" for UI purposes
        // In a real app, this would be stored in Firestore 'users/{uid}'
        setUserRole('perfusionist'); 
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserRole(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'grand': return <GrandRecordsView />;
      case 'calculator': return <CalculatorView />;
      case 'inventory': return <InventoryView />;
      case 'logs': return <PatientLogsView />;
      case 'advanced': return <AdvancedView />;
      case 'dual': return <DualView />;
      case 'profile': return <ProfileView role={userRole} />;
      default: return <GrandRecordsView />;
    }
  };

  if (showSplash) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8 
          }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 bg-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/20">
            <Heart className="text-white w-14 h-14 fill-current" />
          </div>
          <div className="text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-black text-white tracking-tighter"
            >
              Wholeperf
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.6 }}
              className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs mt-2"
            >
              Cardiac Perfusion Suite
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="h-1 bg-rose-600 rounded-full mt-8"
          />
        </motion.div>
      </div>
    );
  }

  if (!userRole) {
    return <LoginView onLogin={setUserRole} onConnectDevice={() => setIsConnectivityOpen(true)} />;
  }

  return (
    <div id="app-root" className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main id="main-content" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header id="top-navbar" className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Global telemetry search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-rose-500 transition-all outline-none" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsConnectivityOpen(true)}
              className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                connectedHardware 
                ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 shadow-sm shadow-blue-500/10' 
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {connectedHardware ? <Link size={14} /> : <Bluetooth size={14} />}
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {connectedHardware ? `Hardware: Syncing` : 'Link Device'}
              </span>
              {connectedHardware && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse ml-1" />}
            </button>

            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
              <Mail size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest break-all">
                {firebaseUser?.email ? `Vault: ${firebaseUser.email}` : 'Local Mode'}
              </span>
              {firebaseUser && <CloudCheck size={14} className="ml-1" />}
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Mainframe Connected</span>
            </div>
            
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('profile')}
                className="text-right hidden sm:block hover:opacity-80 transition-opacity"
              >
                <p className="text-xs font-black text-slate-900 leading-none">
                  {firebaseUser?.displayName || (userRole === 'perfusionist' ? 'Arjun Mehta' : 'Dr. Sarah Chen')}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  {firebaseUser ? 'Cloud Node' : `${userRole} Node`}
                </p>
              </button>
              <div 
                onClick={() => setCurrentView('profile')}
                className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold border border-slate-800 shadow-lg relative group cursor-pointer hover:ring-2 hover:ring-rose-500 transition-all overflow-hidden"
              >
                {firebaseUser?.photoURL ? (
                  <img src={firebaseUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userRole === 'perfusionist' ? 'AM' : 'SC'
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Logout"
                >
                  <LogOut size={10} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div id="scroll-container" className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Connectivity Modal */}
        <AnimatePresence>
          {isConnectivityOpen && (
            <DeviceConnectivity 
              isOpen={isConnectivityOpen}
              onClose={() => setIsConnectivityOpen(false)}
              onConnect={setConnectedHardware}
              connectedDevice={connectedHardware}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
