import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Mail, 
  Bell,
  X,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface PortalComingSoonPageProps {
  onReturnToWebsite: () => void;
  onOpenLiveLogin?: () => void;
  parishName?: string;
}

export const PortalComingSoonPage: React.FC<PortalComingSoonPageProps> = ({
  onReturnToWebsite,
  onOpenLiveLogin,
  parishName = 'RCCG Glorious Church'
}) => {
  const [email, setEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Security Passcode Gate Modal State
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(null);
    setNotifySuccess(true);
    setEmail('');
    setTimeout(() => setNotifySuccess(false), 8000);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);

    const REQUIRED_CODE = 'NeotroLtd@2026';

    if (passcode.trim() === REQUIRED_CODE) {
      setPasscodeModalOpen(false);
      setPasscode('');
      if (onOpenLiveLogin) {
        onOpenLiveLogin();
      }
    } else {
      setPasscodeError('Access Denied: Invalid Security Code. You are unauthorized to access the portal.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* 1. BRIGHT MOTION VIDEO BACKGROUND & LIGHT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onTimeUpdate={(e) => {
            const vid = e.currentTarget;
            if (vid.duration && vid.currentTime >= vid.duration - 0.25) {
              vid.currentTime = 0.05;
              vid.play().catch(() => {});
            }
          }}
          onEnded={(e) => {
            const vid = e.currentTarget;
            vid.currentTime = 0.05;
            vid.play().catch(() => {});
          }}
          className="w-full h-full object-cover filter brightness-110 contrast-105 opacity-85"
        >
          <source src="https://summitchurch.com/GetFile.ashx?Guid=f6e6e89c-bfa7-4e46-9a9f-ee6c0f05a7b4" type="video/mp4" />
        </video>
        {/* LIGHT & VIVID CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60"></div>
        <div className="absolute inset-0 bg-grid-subtle opacity-30"></div>
      </div>

      {/* 2. TOP FLOATING NAVIGATION BAR */}
      <header className="relative z-20 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between">
        
        {/* PARISH BRANDING DUAL LOGOS (DIRECTLY ON BACKGROUND) */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          <img
            src="/rccg_official_logo.png"
            alt="RCCG Logo"
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain filter drop-shadow-lg"
          />
          <div className="h-10 sm:h-12 w-px bg-white/40 hidden sm:block"></div>
          <img
            src="/glorious_church_logo.png"
            alt="Glorious Church"
            className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-lg"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* RETURN TO WEBSITE BUTTON */}
        <button
          onClick={onReturnToWebsite}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-black uppercase tracking-wider border border-slate-700/80 shadow-lg backdrop-blur-md transition transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Return to Website</span>
        </button>
      </header>

      {/* 3. MAIN HERO COMING SOON CONTENT */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12 my-auto text-center space-y-10">
        
        {/* STATUS BADGE */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-900/60 text-emerald-300 text-xs font-mono uppercase tracking-widest font-black border border-emerald-500/40 backdrop-blur-md shadow-xl">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>PARISH MANAGEMENT CMS &bull; PORTAL UNDER CONSTRUCTION</span>
        </div>

        {/* HEADLINE & SUBTITLE */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
            The Official Parish Portal Is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-blue-400">
              Coming Soon
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            We are currently building and finalizing the official administrative management portal for {parishName}. Ordained ministers, department heads, and church leaders will soon enjoy seamless attendance tracking, financial reports, and workforce management.
          </p>
        </div>

        {/* NOTIFICATION SUBSCRIPTION CARD */}
        <div className="max-w-xl mx-auto bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            <Bell className="w-4 h-4" />
            <span>GET NOTIFIED WHEN WE GO LIVE</span>
          </div>

          {notifySuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold animate-fadeIn flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Thank you! Your notification request has been recorded. We will email you at launch.</span>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your minister or leader email address..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition transform hover:scale-105 flex-shrink-0 flex items-center justify-center space-x-2"
              >
                <span>Notify Me</span>
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-400 font-medium">
            Exclusive to {parishName} ministers, ushering protocol, choir, and departmental leaders.
          </p>
        </div>

        {/* DRAFT LOGIN OVERRIDE LINK (PASSCODE PROTECTED) */}
        {onOpenLiveLogin && (
          <div className="pt-6">
            <button
              onClick={() => {
                setPasscodeError(null);
                setPasscode('');
                setPasscodeModalOpen(true);
              }}
              className="text-xs text-slate-400 hover:text-white underline font-mono transition tracking-wide"
            >
              Are you an authorized administrator? Click here to access draft portal login
            </button>
          </div>
        )}

      </main>

      {/* 4. PASSCODE AUTHORIZATION POPUP MODAL */}
      {passcodeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
            
            <button
              onClick={() => setPasscodeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="p-3 rounded-2xl bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Administrator Verification</h3>
                <p className="text-xs text-slate-400 font-medium">Enter security authorization code to proceed</p>
              </div>
            </div>

            {passcodeError && (
              <div className="p-3.5 rounded-2xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-bold flex items-center space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5 tracking-wider">
                  Security Passcode <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter security passcode..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPasscodeModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition transform hover:scale-102 flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Code &amp; Access</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 5. FOOTER BAR */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} {parishName} &bull; Parish CMS Portal
          </div>
          <div className="flex items-center space-x-2 text-slate-500 font-mono text-[11px]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>POWERED BY VATEBRA ENTERPRISE PARISH CORE</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
