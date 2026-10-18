import React from 'react';
import { motion } from 'motion/react';
import { Heart, User, Activity, ShieldCheck, ArrowRight, Bluetooth, Mail } from 'lucide-react';
import { UserRole } from '../types';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
  onConnectDevice: () => void;
}

export default function LoginView({ onLogin, onConnectDevice }: LoginViewProps) {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        onLogin('perfusionist'); 
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, handle silently or show a gentle notice
        setLoginError("Authentication window closed. Try again.");
      } else {
        setLoginError("Connection failed. Check your network.");
        console.error("Login failed:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Brand & Mission */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500"
          >
            <Heart size={18} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Life Support</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]"
            >
              WHOLE<span className="text-rose-600">PERF.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 font-medium max-w-md mx-auto lg:mx-0"
            >
              Advanced cardiac perfusion management and real-time hemodynamic monitoring for the modern surgical theater.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-8 pt-4"
          >
            <div className="text-center lg:text-left">
              <p className="text-2xl font-black text-white">2.4k+</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Nodes</p>
            </div>
            <div className="w-[1px] h-10 bg-slate-800" />
            <div className="text-center lg:text-left">
              <p className="text-2xl font-black text-white">99.9%</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Uptime Precision</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Role Selection */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[40px] shadow-2xl"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">Terminal Access</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">Select your privileged role to continue</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 text-center"
                    >
                      {loginError}
                    </motion.div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Universal Clinician ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter ID (e.g., UP-8221)" 
                      disabled={isLoggingIn}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-mono disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Terminal Passcode</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      disabled={isLoggingIn}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-rose-500/50 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Mail size={16} />
                    )}
                    {isLoggingIn ? 'Establishing Link...' : 'Unlock & Sync Device'}
                  </button>
                </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-slate-900/40 px-4 text-slate-500">Or Continue As</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RoleButton 
                  role="perfusionist"
                  title="Perfusionist"
                  description="Pump Controls"
                  icon={Activity}
                  color="rose"
                  onClick={() => onLogin('perfusionist')}
                />
                <RoleButton 
                  role="surgeon"
                  title="Lead Surgeon"
                  description="Telemetry"
                  icon={ShieldCheck}
                  color="blue"
                  onClick={() => onLogin('surgeon')}
                />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-700/50 flex flex-col items-center">
              <button 
                onClick={onConnectDevice}
                className="mb-8 flex items-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 hover:bg-blue-500/20 transition-all group pointer-events-auto"
              >
                <Bluetooth size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Link Clinical Hardware</span>
              </button>
              
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-4">Secured by Biometric Trust Network</p>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-rose-500"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        delay: i * 0.2,
                        ease: "linear"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
        <span>Build v4.2.0</span>
        <div className="w-1 h-1 bg-slate-800 rounded-full" />
        <span>Demo build, not for clinical use</span>
      </div>
    </div>
  );
}

function RoleButton({ title, description, icon: Icon, color, onClick }: any) {
  const themes: any = {
    rose: {
      bg: 'hover:bg-rose-500/10',
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500',
      text: 'group-hover:text-rose-500'
    },
    blue: {
      bg: 'hover:bg-blue-500/10',
      border: 'hover:border-blue-500/50',
      iconBg: 'bg-blue-500',
      text: 'group-hover:text-blue-500'
    }
  };

  const theme = themes[color];

  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-6 p-6 rounded-3xl border border-slate-700/50 bg-slate-800/20 text-left transition-all duration-300 ${theme.bg} ${theme.border} hover:shadow-xl hover:shadow-${color}-500/10`}
    >
      <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center text-white shrink-0 shadow-lg`}>
        <Icon size={28} />
      </div>
      <div className="flex-1">
        <h3 className={`text-lg font-bold text-white transition-colors ${theme.text}`}>{title}</h3>
        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:border-white transition-all">
        <ArrowRight size={16} />
      </div>
    </button>
  );
}
