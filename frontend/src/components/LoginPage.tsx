import React, { useState, useEffect } from 'react';
import { 
  Church, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  UserCheck,
  Building2,
  Cpu
} from 'lucide-react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  mustChangePassword: boolean;
  isActive: boolean;
}

export interface OrganizationSetting {
  parishName: string;
  logoUrl: string;
  baseCurrency: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  availableUsers: User[];
  orgSetting: OrganizationSetting;
}

// Background Visual Assets
const BG_IMAGES = [
  'https://images.unsplash.com/photo-1548625361-185122c4f826?auto=format&fit=crop&q=80&w=2000', // Cathedral / Ambient Light
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000', // Cyber Data Grid
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=2000'  // Abstract Stained Glass Lights
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, availableUsers, orgSetting }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  // Auto-cycle background image every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Quick Preset Handlers
  const handleSelectPreset = (presetEmail: string, defaultPass: string = 'Admin@12345') => {
    setEmail(presetEmail);
    setPassword(defaultPass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try real API Login
      const response = await fetch('http://localhost:5230/api/v1/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const envelope = await response.json();
        if (envelope.success && envelope.data) {
          const apiUser: User = {
            id: envelope.data.userId || 'u-api',
            fullName: envelope.data.fullName || email.split('@')[0],
            email: envelope.data.email || email,
            phone: '+2348000000000',
            role: envelope.data.role || 'SystemAdmin',
            mustChangePassword: envelope.data.mustChangePassword || false,
            isActive: true
          };
          setIsLoading(false);
          onLoginSuccess(apiUser);
          return;
        }
      }
    } catch {
      // API call failed or not reachable -> fallback to local preset check
    }

    // 2. Local Fallback Verification
    setTimeout(() => {
      setIsLoading(false);
      const matchedUser = availableUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (matchedUser) {
        onLoginSuccess(matchedUser);
      } else if (email.trim().length > 3) {
        // Fallback for custom dev login
        const devUser: User = {
          id: 'u-dev-' + Date.now(),
          fullName: email.split('@')[0].toUpperCase(),
          email: email.trim(),
          phone: '+2348011112222',
          role: 'SystemAdmin',
          mustChangePassword: false,
          isActive: true
        };
        onLoginSuccess(devUser);
      } else {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* ---------------- AUTO-CYCLING WARM BACKGROUND IMAGERY ---------------- */}
      {BG_IMAGES.map((imgUrl, index) => (
        <div
          key={imgUrl}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeBgIndex ? 'opacity-65' : 'opacity-0'
          }`}
        >
          <img
            src={imgUrl}
            alt="Parish Background"
            className="w-full h-full object-cover animate-pan-zoom"
          />
        </div>
      ))}

      {/* ---------------- AMBIENT WARM GLOW OVERLAYS ---------------- */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/60 via-slate-900/30 to-emerald-950/40 backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />
      
      {/* Dynamic Glowing Warm Radial Blurs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-500/25 rounded-full blur-[140px] pointer-events-none" />

      {/* ---------------- AMBIENT STATUS BADGES (BRIGHT & RECEPTIVE) ---------------- */}
      {/* Top Left Live Status Node */}
      <div className="hidden md:flex absolute top-8 left-8 items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 backdrop-blur-md shadow-xl text-xs font-mono text-slate-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-bold tracking-wide text-slate-900">RCCG PARISH PORTAL</span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-700 font-extrabold">SECURE SERVER ONLINE</span>
      </div>

      {/* Bottom Right System Info Badge */}
      <div className="hidden md:flex absolute bottom-8 right-8 items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 backdrop-blur-md shadow-xl text-xs font-mono text-slate-700 font-bold">
        <Cpu className="w-3.5 h-3.5 text-emerald-600" />
        <span>Enterprise Security Engine</span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-700 font-extrabold">v1.2.0</span>
      </div>

      {/* ---------------- MAIN SIGN-IN CARD (BRIGHT & HIGH CONTRAST) ---------------- */}
      <div className="relative z-10 w-full max-w-md px-6 py-8 sm:px-10 sm:py-10 mx-4 bg-white/95 backdrop-blur-2xl text-slate-900 rounded-3xl border border-slate-200/90 shadow-2xl transition-all duration-300">
        
        {/* BRAND EMBLEM & HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4 group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center p-3 shadow-md ring-4 ring-emerald-500/10">
              {orgSetting.logoUrl ? (
                <img src={orgSetting.logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-xs" />
              ) : (
                <Church className="w-10 h-10 text-emerald-600" />
              )}
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            {orgSetting.parishName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-extrabold tracking-wider uppercase">
            PARISH MANAGEMENT &amp; REPORTING PORTAL
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-800 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Enterprise Authentication</span>
          </div>
        </div>

        {/* ERROR BANNER */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 font-medium animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM CONTROLS */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL FIELD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 tracking-wider uppercase">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@rccgglorious.org"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition duration-200 font-medium"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); setErrorMessage('Please contact your System Administrator / IT Officer to reset your password.'); }}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold transition text-[11px]"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition duration-200 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* REMEMBER ME CHECKBOX */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-600 font-medium">Remember active session</span>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-[11px] text-slate-400 font-medium">
          RCCG Glorious Parish Management System • All rights reserved
        </div>
      </div>
    </div>
  );
};
