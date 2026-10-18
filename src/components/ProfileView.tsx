import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Award, 
  Calendar,
  Briefcase,
  ExternalLink,
  ShieldAlert,
  Fingerprint,
  CloudCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { auth } from '../lib/firebase';

interface ProfileViewProps {
  role: UserRole;
}

export default function ProfileView({ role }: ProfileViewProps) {
  const firebaseUser = auth.currentUser;
  const isPerfusionist = role === 'perfusionist';
  
  const userData = {
    name: firebaseUser?.displayName || (isPerfusionist ? 'Arjun Mehta' : 'Dr. Sarah Chen'),
    title: isPerfusionist ? 'Senior Clinical Perfusionist' : 'Chief Cardiothoracic Surgeon',
    id: firebaseUser ? `UID-${firebaseUser.uid.substring(0, 8).toUpperCase()}` : (isPerfusionist ? 'NODE-PX-0082' : 'SURG-NX-9981'),
    email: firebaseUser?.email || (isPerfusionist ? 'arjun.mehta@wholeperf.med' : 'sarah.chen@wholeperf.med'),
    phone: '+91 98765 43210',
    location: 'Central Cardiac Unit, Room 402',
    joined: 'Jan 2022',
    certifications: isPerfusionist ? ['CCP-I', 'LP', 'RT'] : ['MD, FACS', 'FRCS', 'Board Certified'],
    specialization: isPerfusionist ? 'Adult Extracorporeal Membrane Oxygenation (ECMO)' : 'Minimally Invasive Valve Repair',
    bio: isPerfusionist ? 'Specializing in complex adult bypass procedures and long-term ECMO support. Passionate about hemodynamic data visualization and patient safety protocols.' : 'Lead surgeon with over 15 years experience in robotic-assisted thoracic surgery and structural heart interventions.'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-slate-900 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-rose-500 blur-[80px] rounded-full" />
            <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-blue-500 blur-[80px] rounded-full" />
          </div>
        </div>
        
        <div className="px-8 pb-8 flex flex-col items-center -mt-16 relative">
          <div className="w-32 h-32 rounded-[32px] bg-white p-2 shadow-xl border border-slate-50 relative group">
            <div className="w-full h-full rounded-[24px] bg-slate-900 flex items-center justify-center text-white text-4xl font-black overflow-hidden">
              {firebaseUser?.photoURL ? (
                <img src={firebaseUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userData.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{userData.name}</h2>
            <p className="text-rose-600 font-bold uppercase tracking-widest text-[10px] mt-1">{userData.title}</p>
            <p className="text-slate-400 font-mono text-[10px] mt-2 font-bold bg-slate-50 px-3 py-1 rounded-full inline-block border border-slate-100">
              Terminal Node: {userData.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Connected Channels</h3>
              {firebaseUser && (
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase">
                  <CloudCheck size={12} />
                  Synced
                </div>
              )}
            </div>
            <InfoItem icon={Mail} label="Cloud Email" value={userData.email} />
            <InfoItem icon={Phone} label="Direct Line" value={userData.phone} />
            <InfoItem icon={MapPin} label="Active Station" value={userData.location} />
            <InfoItem icon={Calendar} label="Nodesync Since" value={userData.joined} />
          </section>

          <section className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4 shadow-xl shadow-slate-900/10">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="text-rose-500" size={18} />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Security Profile</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Access Level</span>
                <span className="text-xs font-black text-emerald-400">{firebaseUser ? 'Verified Admin' : 'Class III'}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Cloud Link</span>
                <span className="text-xs font-black text-blue-400">{firebaseUser ? 'Authenticated' : 'Offline'}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Professional Details */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Briefcase size={14} className="text-rose-500" />
                Clinical Specialization
              </h3>
              <p className="text-2xl font-bold text-slate-900 leading-tight">
                {userData.specialization}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Award size={14} className="text-amber-500" />
                Valid Credentials
              </h3>
              <div className="flex flex-wrap gap-3">
                {userData.certifications.map((cert) => (
                  <span key={cert} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 shadow-sm">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Professional Brief</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                "{userData.bio}"
              </p>
            </div>
          </section>

          <section className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-200/50 rounded-2xl flex items-center justify-center text-rose-600">
              <ShieldAlert size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-900">Privileged Session Active</h4>
              <p className="text-xs text-rose-700/70 font-medium">Any data modifications are logged and cryptographically signed to your unique ID.</p>
            </div>
            <button className="text-rose-600 hover:text-rose-700 p-2 transform hover:scale-110 transition-all">
              <ExternalLink size={18} />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">{label}</p>
        <p className="text-xs font-bold text-slate-900 break-all">{value}</p>
      </div>
    </div>
  );
}
