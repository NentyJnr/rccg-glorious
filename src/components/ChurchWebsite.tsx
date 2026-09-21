import React, { useState, useEffect } from 'react';
import {
  Church,
  Search,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Radio,
  HeartHandshake,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  Plus,
  Minus,
  MessageSquare,
  ShieldCheck,
  Globe,
  Award,
  Video,
  ArrowRight,
  Menu,
  X,
  UserCheck,
  CheckCircle2,
  Share2,
  Info,
  FileText
} from 'lucide-react';

interface ChurchWebsiteProps {
  onOpenPortal: () => void;
  parishName?: string;
}

type InfoModalKey = 'history' | 'vision' | 'beliefs' | 'structure' | 'health' | 'missions' | 'redemptionTv' | 'blog' | 'announcements' | 'youth' | null;

export const ChurchWebsite: React.FC<ChurchWebsiteProps> = ({
  onOpenPortal,
  parishName = 'RCCG Glorious Church'
}) => {
  // Mobile Nav Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Search Modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Accordion active tab state for Salvation steps
  const [activeSalvationStep, setActiveSalvationStep] = useState<number | null>(0);

  // Active Dropdown state for Desktop nav
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Giving Modal / Tab state
  const [givingModalOpen, setGivingModalOpen] = useState(false);

  // Info Modal State for Navigation Links
  const [infoModalKey, setInfoModalKey] = useState<InfoModalKey>(null);

  // Hero Motion Background Media State (Video & Images rotation)
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Schedule Filter State for Weekly Services
  const [scheduleTab, setScheduleTab] = useState<'all' | 'sunday' | 'midweek' | 'vigil'>('all');

  // Copy Feedback State for Bank Accounts
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopyAccount = (bankName: string, accountNo: string) => {
    navigator.clipboard.writeText(accountNo);
    setCopiedAccount(bankName);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  // Join Workforce Modal State
  const [workforceModalOpen, setWorkforceModalOpen] = useState(false);
  const [workforceSuccessMessage, setWorkforceSuccessMessage] = useState<string | null>(null);
  const [workforceForm, setWorkforceForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    department: 'Ushering & Protocol',
    status: 'Baptized Member',
    notes: '',
    baptismCertName: '',
    believersCertName: '',
    witCertName: ''
  });

  const handleWorkforceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workforceForm.fullName || !workforceForm.phone) {
      alert('Please fill in your Full Name and Phone Number.');
      return;
    }

    const newApp = {
      id: 'wr_' + Date.now(),
      fullName: workforceForm.fullName,
      email: workforceForm.email || 'N/A',
      phone: workforceForm.phone,
      gender: 'Not Specified',
      preferredDepartment: workforceForm.department,
      submissionDate: new Date().toISOString().split('T')[0],
      assignedMinisterId: null,
      assignedMinisterName: null,
      currentStage: 'Baptismal Class',
      stageStatus: 'Pending',
      certificates: {
        baptismCertName: workforceForm.baptismCertName || null,
        believersCertName: workforceForm.believersCertName || null,
        witCertName: workforceForm.witCertName || null
      },
      notes: workforceForm.notes
    };

    try {
      const existing = JSON.parse(localStorage.getItem('rccg_workforce_applications') || '[]');
      localStorage.setItem('rccg_workforce_applications', JSON.stringify([newApp, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setWorkforceSuccessMessage(`God bless you, ${workforceForm.fullName}! Your Workforce Application for ${workforceForm.department} has been submitted successfully. Our workforce coordinator will contact you shortly.`);
    setWorkforceModalOpen(false);
    setWorkforceForm({
      fullName: '',
      phone: '',
      email: '',
      department: 'Ushering & Protocol',
      status: 'Baptized Member',
      notes: '',
      baptismCertName: '',
      believersCertName: '',
      witCertName: ''
    });
    setTimeout(() => setWorkforceSuccessMessage(null), 8000);
  };

  // Share Testimony Modal State
  const [testimonyModalOpen, setTestimonyModalOpen] = useState(false);
  const [testimonySuccessMessage, setTestimonySuccessMessage] = useState<string | null>(null);

  // Testimony Form State
  const [testimonyForm, setTestimonyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Divine Healing',
    title: '',
    content: '',
    allowPublicSharing: true
  });

  // Dynamic Testimonies List State
  const [testimonies, setTestimonies] = useState([
    {
      id: '1',
      category: 'Divine Healing',
      title: 'Instant Healing During Holy Ghost Night',
      content: 'For 3 years I suffered severe chronic back pain. During the parish night vigil prayer session, Pastor prayed and called out my condition. Instantly the pain disappeared, and I am completely healed!',
      fullName: 'Sister Folake O.',
      subText: 'Glorious Church Member',
      date: 'Aug 2026',
      initials: 'FO',
      color: 'from-blue-500 to-emerald-500'
    },
    {
      id: '2',
      category: 'Career Breakthrough',
      title: 'Open Doors After Digging Deep Study',
      content: 'After months of job searching, I faithfully attended Tuesday Digging Deep. God answered my prayers with a global tech offer beyond my expectations! God is faithful.',
      fullName: 'Brother David A.',
      subText: 'Youth & Young Adults',
      date: 'Sep 2026',
      initials: 'DA',
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: '3',
      category: 'Family Restoration',
      title: 'Miraculous Fruit of the Womb',
      content: 'After 5 years of waiting, God blessed our home with healthy twins! We thank God for the prayers of the pastorate and the loving fellowship of Glorious Church.',
      fullName: 'Deacon & Mrs. Emmanuel',
      subText: 'Praise Team Fellowship',
      date: 'Sep 2026',
      initials: 'ME',
      color: 'from-blue-600 to-emerald-600'
    }
  ]);

  const handleSaveTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyForm.fullName || !testimonyForm.content) {
      alert('Please enter your Name and Testimony details.');
      return;
    }

    const newTestimonyObj = {
      id: Date.now().toString(),
      category: testimonyForm.category || 'General Grace',
      title: testimonyForm.title || 'Glory to God for Divine Goodness',
      content: testimonyForm.content,
      fullName: testimonyForm.fullName,
      subText: 'Parish Member',
      date: 'Just Now',
      initials: testimonyForm.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TC',
      color: 'from-blue-600 to-emerald-500'
    };

    // 1. Instantly update live UI praise wall
    setTestimonies((prev) => [newTestimonyObj, ...prev]);

    // 2. Persist to API backend
    try {
      await fetch('/api/Testimonies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonyForm)
      });
    } catch (err) {
      console.warn('API save fallback:', err);
    }

    // Reset form & show toast
    setTestimonyForm({
      fullName: '',
      email: '',
      phone: '',
      category: 'Divine Healing',
      title: '',
      content: '',
      allowPublicSharing: true
    });
    setTestimonyModalOpen(false);
    setTestimonySuccessMessage('Praise the Lord! Your testimony has been recorded and published on the Praise Wall.');
    setTimeout(() => setTestimonySuccessMessage(null), 6000);
  };



  // Salvation steps data from rccg.org
  const salvationSteps = [
    {
      title: 'Acknowledge all your sins (Acts 2:36 - 38)',
      content: 'Therefore let all the house of Israel know assuredly, that God hath made the same Jesus, whom ye have crucified, both Lord and Christ. Now when they heard this, they were pricked in their heart, and said unto Peter and to the rest of the apostles, Men and brethren, what shall we do? Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.'
    },
    {
      title: 'Confess those sins (Galatians 5:19 - 21)',
      content: 'Now the works of the flesh are manifest, which are these; Adultery, fornication, uncleanness, lasciviousness, Idolatry, witchcraft, hatred, variance, emulations, wrath, strife, seditions, heresies, Envyings, murders, drunkenness, revellings, and such like: of the which I tell you before, as I have also told you in time past, that they which do such things shall not inherit the kingdom of God.'
    },
    {
      title: 'Ask for forgiveness of sin (1 John 1:9)',
      content: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.'
    },
    {
      title: 'Repent of those sins (Acts 3:19)',
      content: 'Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord.'
    },
    {
      title: 'Forsake all your old ways and sinful habits (Luke 14:33)',
      content: 'So likewise, whosoever he be of you that forsaketh not all that he hath, he cannot be my disciple.'
    },
    {
      title: 'Join a Bible believing Church around (Hebrews 10:25)',
      content: 'Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another: and so much the more, as ye see the day approaching.'
    }
  ];

  const handleNavClick = (key: InfoModalKey) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setInfoModalKey(key);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-300 selection:text-slate-900">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. DUAL-LOGO NAVIGATION HEADER                                */}
      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {/* 1. FLOATING OVERLAY NAVIGATION HEADER ON HERO IMAGE           */}
      {/* ------------------------------------------------------------- */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-transparent border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          <div className="flex items-center justify-between h-28 sm:h-32">
            
            {/* BRANDING: ENLARGED DUAL LOGOS DIRECTLY ON HERO BACKGROUND */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Official RCCG Logo */}
              <a href="#" className="flex-shrink-0 transition transform hover:scale-105" title="RCCG Official Crest">
                <img
                  src="/rccg_official_logo.png"
                  alt="RCCG Official Crest"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain filter drop-shadow-lg"
                />
              </a>

              <div className="h-12 sm:h-14 w-px bg-white/40 hidden sm:block"></div>

              {/* Glorious Church Combined Logo */}
              <a href="#" className="flex items-center space-x-2 group">
                <img
                  src="/glorious_church_logo.png"
                  alt="RCCG Glorious Church Emblem"
                  className="h-20 sm:h-24 w-auto object-contain filter drop-shadow-lg transition transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </a>
            </div>

            {/* DESKTOP NAV MENU WITH LARGER FONTS & HIGHER CONTRAST */}
            <nav className="hidden lg:flex items-center space-x-3 text-sm sm:text-base font-black tracking-wider">
              {/* Home */}
              <a
                href="#"
                className="px-4 py-2 text-emerald-400 border-b-2 border-emerald-400 transition font-black uppercase tracking-wider"
              >
                HOME
              </a>

              {/* Who We Are Dropdown */}
              <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
                <button
                  onMouseEnter={() => setActiveDropdown('whoWeAre')}
                  onClick={() => setActiveDropdown(activeDropdown === 'whoWeAre' ? null : 'whoWeAre')}
                  className="px-4 py-2 text-white hover:text-emerald-300 transition flex items-center space-x-1.5 font-black uppercase tracking-wider"
                >
                  <span>WHO WE ARE</span>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>

                {activeDropdown === 'whoWeAre' && (
                  <div className="absolute left-0 mt-2 w-60 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-xl py-2 z-50 animate-fadeIn">
                    <button onClick={() => handleNavClick('history')} className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:text-emerald-400 hover:bg-slate-800/80 font-bold uppercase block">OUR HISTORY</button>
                    <button onClick={() => handleNavClick('vision')} className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:text-emerald-400 hover:bg-slate-800/80 font-bold uppercase block">MISSION &amp; VISION</button>
                    <button onClick={() => handleNavClick('beliefs')} className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:text-emerald-400 hover:bg-slate-800/80 font-bold uppercase block">OUR BELIEFS &amp; DOCTRINE</button>
                  </div>
                )}
              </div>

              {/* Give Your Life to Christ */}
              <a
                href="#salvation"
                className="px-4 py-2 text-white hover:text-emerald-300 transition flex items-center space-x-2 font-black uppercase tracking-wider"
              >
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>GIVE YOUR LIFE TO CHRIST</span>
              </a>

              {/* Online Giving */}
              <button
                onClick={() => setGivingModalOpen(true)}
                className="px-4 py-2 text-white hover:text-emerald-300 transition flex items-center space-x-2 font-black uppercase tracking-wider"
              >
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
                <span>ONLINE GIVING</span>
              </button>

              {/* Useful Links */}
              <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
                <button
                  onMouseEnter={() => setActiveDropdown('usefulLinks')}
                  onClick={() => setActiveDropdown(activeDropdown === 'usefulLinks' ? null : 'usefulLinks')}
                  className="px-4 py-2 text-white hover:text-emerald-300 transition flex items-center space-x-1.5 font-black uppercase tracking-wider"
                >
                  <span>USEFUL LINKS</span>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>

                {activeDropdown === 'usefulLinks' && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-xl py-2 z-50 animate-fadeIn">
                    <button onClick={() => { handleNavClick('blog'); }} className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:text-emerald-400 hover:bg-slate-800/80 font-bold uppercase block">BLOG</button>
                    <button onClick={() => { handleNavClick('announcements'); }} className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:text-emerald-400 hover:bg-slate-800/80 font-bold uppercase block">ANNOUNCEMENTS</button>
                  </div>
                )}
              </div>
            </nav>

            {/* HEADER ACTIONS: SEARCH & MOBILE TOGGLE */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20 backdrop-blur-md shadow-md"
                title="Search Website"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION MENU OVERLAY */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 text-white border-b border-slate-700/80 px-4 pt-3 pb-6 space-y-3 text-sm font-semibold shadow-2xl backdrop-blur-2xl uppercase animate-fadeIn">
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold">HOME</a>
            <div className="space-y-1 pl-3 border-l border-slate-700">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-mono">WHO WE ARE</span>
              <button onClick={() => handleNavClick('history')} className="w-full text-left block px-3 py-1.5 text-slate-200 hover:text-emerald-400">OUR HISTORY</button>
              <button onClick={() => handleNavClick('vision')} className="w-full text-left block px-3 py-1.5 text-slate-200 hover:text-emerald-400">MISSION &amp; VISION</button>
              <button onClick={() => handleNavClick('beliefs')} className="w-full text-left block px-3 py-1.5 text-slate-200 hover:text-emerald-400">OUR BELIEFS</button>
            </div>
            <a
              href="#salvation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-lg bg-blue-900/60 text-white font-extrabold flex items-center space-x-2 border border-blue-700/50"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>GIVE YOUR LIFE TO CHRIST</span>
            </a>
            <button
              onClick={() => { setGivingModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg bg-emerald-900/60 text-white font-bold flex items-center space-x-2 border border-emerald-700/50"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>ONLINE GIVING</span>
            </button>
            <div className="space-y-1 pl-3 border-l border-slate-700 pt-1">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-mono">USEFUL LINKS</span>
              <button onClick={() => { handleNavClick('blog'); }} className="w-full text-left block px-3 py-1.5 text-slate-200 hover:text-emerald-400">BLOG</button>
              <button onClick={() => { handleNavClick('announcements'); }} className="w-full text-left block px-3 py-1.5 text-slate-200 hover:text-emerald-400">ANNOUNCEMENTS</button>
            </div>

          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO BANNER SECTION WITH FULL-PAGE IMAGE & FLOATING NAVBAR */}
      {/* ------------------------------------------------------------- */}
      <section className="relative h-screen min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-white pt-28 sm:pt-32 pb-10 border-b border-slate-900">
        
        {/* BACKGROUND BRIGHT MOTION SLIDESHOW & VIDEO CONTAINER */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          
          {/* CONTINUOUS LIVE BACKGROUND VIDEO STREAM WITH SEAMLESS LOOP */}
          <div className="absolute inset-0 opacity-90 bg-slate-900">
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
              className="w-full h-full object-cover filter brightness-110 contrast-105"
            >
              <source src="https://summitchurch.com/GetFile.ashx?Guid=f6e6e89c-bfa7-4e46-9a9f-ee6c0f05a7b4" type="video/mp4" />
            </video>
          </div>

          {/* LIGHT & VIVID CINEMATIC OVERLAY (LOW DARKNESS FOR MAXIMUM BRIGHTNESS) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-slate-950/40"></div>
          <div className="absolute inset-0 bg-grid-subtle opacity-40"></div>
        </div>

        {/* HERO CONTENT WRAPPER - MATCHING CONTAINER MARGINS OF IMAGE 2 */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-10 w-full my-auto">
          
          <div className="w-full">
            
            {/* HERO TEXT CONTENT - ALIGNED DIRECTLY UNDER TOP-LEFT LOGO WITH COMFORTABLE SIDE MARGIN */}
            <div className="max-w-4xl mr-auto space-y-7 text-left flex flex-col items-start">
              
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-mono uppercase tracking-widest font-black backdrop-blur-md shadow-lg">
                <span>WELCOME TO OUR PARISH &bull; WELCOME TO OUR ZONE</span>
              </div>

              {/* MASSIVE DISTINCTIVE RCCG HEADLINE LAYOUT (ENLARGED) */}
              <div className="space-y-2 text-left">
                <h1 className="text-5xl sm:text-7xl lg:text-[5.25rem] font-black text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
                  The Redeemed <br />
                  <span className="relative inline-block text-white border-b-4 sm:border-b-8 border-emerald-400 pb-1 mr-2">
                    Christian
                  </span> <br />
                  Church of God.
                </h1>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 uppercase tracking-widest pt-2 drop-shadow-lg">
                  GLORIOUS CHURCH PARISH
                </div>
              </div>

              {/* SCRIPTURE MOTTO & WRITEUP (ENLARGED) */}
              <div className="space-y-2 text-left">
                <p className="text-base sm:text-lg lg:text-xl text-slate-100 font-semibold italic drop-shadow-md">
                  "Jesus Christ the same yesterday, and today, and forever."
                </p>
                <div className="text-xs sm:text-sm font-mono text-emerald-300 font-bold tracking-wider">
                  - Hebrews 13:8 -
                </div>
              </div>

              {/* Action Buttons (LEFT ALIGNED & ENLARGED) */}
              <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                <a
                  href="#salvation"
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/50 transition transform hover:scale-105 flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Give Your Life to Christ</span>
                </a>
                <button
                  onClick={() => setWorkforceModalOpen(true)}
                  className="px-7 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition transform hover:scale-105 flex items-center space-x-2 border border-blue-500/50"
                >
                  <UserCheck className="w-5 h-5 text-blue-200" />
                  <span>Join The Workforce</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM MOUNTAIN / WAVE DIVIDER SMOOTHLY TRANSITIONING TO THE WHITE SECTION BELOW */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-12 sm:h-16 text-blue-900 fill-current opacity-90"
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. WORKFORCE & MINISTRY CALLING BANNER                       */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-950 text-white py-10 shadow-md">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          
          {workforceSuccessMessage && (
            <div className="mb-6 bg-emerald-950/90 border border-emerald-400/60 p-4 rounded-2xl text-emerald-200 text-xs font-bold text-center animate-fadeIn shadow-xl">
              ✨ {workforceSuccessMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-emerald-400 font-black mb-1">
                SERVING IN GOD'S HOUSE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Join The Parish Workforce &amp; Serve With Purpose
              </h2>
              <p className="text-sm font-medium text-slate-200 mt-1 max-w-2xl">
                Discover your spiritual gifts, connect with active church departments, and make a lasting kingdom impact.
              </p>
            </div>

            <button
              onClick={() => setWorkforceModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition transform hover:scale-105 flex-shrink-0 flex items-center space-x-2 border border-emerald-300/40 uppercase tracking-wider"
            >
              <span>Join Workforce Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>



      {/* ------------------------------------------------------------- */}
      {/* 7. SALVATION & FAITH DECISION ACCORDION                       */}
      {/* ------------------------------------------------------------- */}
      <section id="salvation" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          
          <div className="text-center space-y-3 mb-12">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono uppercase tracking-wider font-bold border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              <span>Step Into New Life</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Do You Want To Give Your Life To Christ?
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Please follow the biblical steps below for true salvation and peace in Jesus Christ.
            </p>
          </div>

          {/* ACCORDION LIST */}
          <div className="space-y-4">
            {salvationSteps.map((step, idx) => {
              const isOpen = activeSalvationStep === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-emerald-500 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setActiveSalvationStep(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between space-x-4 focus:outline-none"
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center ${
                        isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        0{idx + 1}
                      </span>
                      <h3 className={`text-base sm:text-lg font-bold ${isOpen ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {step.title}
                      </h3>
                    </div>

                    <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-slate-700 leading-relaxed border-t border-slate-100 animate-fadeIn">
                      <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 italic font-serif text-slate-800">
                        "{step.content}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>



        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7.5 TESTIMONIES & PRAISE WALL                                 */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-slate-950 text-white border-b border-blue-900/50 relative overflow-hidden">
        {/* BRIGHT MOTION VIDEO BACKGROUND & LIGHT OVERLAY */}
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
            className="w-full h-full object-cover filter brightness-110 contrast-105 opacity-60"
          >
            <source src="https://summitchurch.com/GetFile.ashx?Guid=f6e6e89c-bfa7-4e46-9a9f-ee6c0f05a7b4" type="video/mp4" />
          </video>
          {/* CINEMATIC OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-blue-950/80 to-slate-950/90"></div>
          <div className="absolute inset-0 bg-grid-subtle opacity-25"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-10 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-mono uppercase tracking-wider font-extrabold border border-emerald-500/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>TESTIMONIES OF GOD'S GOODNESS</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
              A Place of Testimonies &amp; Amalgamation of Smiling Faces
            </h2>
            <p className="text-sm text-slate-300 font-medium max-w-2xl mx-auto">
              God is constantly doing wonders in our midst! Read inspiring testimonies of divine healing, breakthrough, elevation, and salvation from parish members.
            </p>
          </div>

          {testimonySuccessMessage && (
            <div className="bg-emerald-950/90 border border-emerald-500/60 p-4 rounded-2xl text-emerald-200 text-xs font-bold text-center animate-fadeIn shadow-xl">
              ✨ {testimonySuccessMessage}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => setTestimonyModalOpen(true)}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Share Your Testimony With Us</span>
            </button>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. PASTORAL LEADERSHIP & SPIRITUAL OVERSIGHT                 */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 space-y-12">
          
          {/* SECTION HEADER */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-mono uppercase tracking-wider font-extrabold border border-blue-200">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              <span>LEADERSHIP &amp; SPIRITUAL OVERSIGHT</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our Spiritual Leaders &amp; Pastoral Oversight
            </h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Guided by divine vision, sound biblical teaching, and committed leadership in service to God and humanity.
            </p>
          </div>

          {/* 2 LEADERSHIP CARDS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CARD 1: PASTOR E. A. ADEBOYE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg hover:shadow-xl transition flex flex-col justify-between space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* PORTRAIT */}
                <div className="w-full sm:w-48 h-64 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src="https://www.rccg.org/wp-content/uploads/2025/01/kj-799x1024.png"
                    alt="Pastor E. A. Adeboye"
                    className="w-full h-full object-cover object-top transition transform hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/rccg_official_logo.png';
                    }}
                  />
                </div>

                {/* DETAILS */}
                <div className="space-y-3 text-center sm:text-left flex-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-[11px] font-mono font-extrabold uppercase tracking-wider border border-blue-200">
                    General Overseer
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 leading-snug">
                    Pastor E. A. Adeboye
                  </h3>
                  <p className="text-xs font-mono uppercase text-blue-700 font-bold">
                    General Overseer, RCCG Worldwide
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-1">
                    Stay spiritually refreshed with daily messages, Open Heavens devotional, and anointed sermons from Daddy G.O. on all digital podcast platforms worldwide.
                  </p>
                </div>
              </div>

              {/* CARD FOOTER / LINKS */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <a
                  href="https://eaadeboye.com/podcasts/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition"
                >
                  <Radio className="w-4 h-4 text-emerald-300" />
                  <span>LISTEN TO SERMONS NOW</span>
                </a>

                <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase text-slate-500 pt-1">
                  <span>OFFICIAL SOCIAL MEDIA:</span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white transition">Facebook</a>
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition">X/Twitter</a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white transition">YouTube</a>
                    <a href="https://spotify.com" target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white transition">Spotify</a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: DR TAIWO ADETUNJI */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg hover:shadow-xl transition flex flex-col justify-between space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* PORTRAIT */}
                <div className="w-full sm:w-48 h-64 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src="/dr_taiwo_adetunji.jpg"
                    alt="Dr. Taiwo Adetunji"
                    className="w-full h-full object-cover object-top transition transform hover:scale-105"
                  />
                </div>

                {/* DETAILS */}
                <div className="space-y-3 text-center sm:text-left flex-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-mono font-extrabold uppercase tracking-wider border border-emerald-200">
                    Zonal Leadership
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 leading-snug">
                    Dr. Taiwo Adetunji
                  </h3>
                  <p className="text-xs font-mono uppercase text-emerald-700 font-bold">
                    Zonal Pastor
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-1">
                    Shepherding the congregation with a passion for spiritual growth, fervent prayer, community outreach, and kingdom transformation across the zone.
                  </p>
                </div>
              </div>

              {/* CARD FOOTER / LINKS */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition"
                >
                  <Mail className="w-4 h-4 text-emerald-300" />
                  <span>CONTACT ZONAL PASTORATE</span>
                </a>

                <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase text-slate-500 pt-1">
                  <span>PASTORAL SERVICES:</span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">Counseling</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">Prayer</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">Mentorship</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. PARISH SERVICE SCHEDULE & CONTACT SECTION                  */}
      {/* ------------------------------------------------------------- */}
      <section id="contact" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* SERVICE SCHEDULE COLUMN */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-extrabold">
                Worship Opportunities
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Glorious Church Weekly Service Schedule
              </h2>

              {/* Service Schedule Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold uppercase">
                <button
                  onClick={() => setScheduleTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl transition ${
                    scheduleTab === 'all'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  All Services
                </button>
                <button
                  onClick={() => setScheduleTab('sunday')}
                  className={`px-3.5 py-1.5 rounded-xl transition ${
                    scheduleTab === 'sunday'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Sundays
                </button>
                <button
                  onClick={() => setScheduleTab('midweek')}
                  className={`px-3.5 py-1.5 rounded-xl transition ${
                    scheduleTab === 'midweek'
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Mid-Week Studies
                </button>
              </div>

              <div className="space-y-3">
                {(scheduleTab === 'all' || scheduleTab === 'sunday') && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-blue-400 transition shadow-xs">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Sunday Glorious Service</div>
                      <div className="text-xs text-slate-500 font-medium">Lord's Day Praise, Worship &amp; Word</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200">
                      09:00 AM
                    </span>
                  </div>
                )}

                {(scheduleTab === 'all' || scheduleTab === 'midweek') && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-emerald-400 transition shadow-xs">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Digging Deep (Bible Study)</div>
                      <div className="text-xs text-slate-500 font-medium">Every Tuesday</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                      06:00 PM
                    </span>
                  </div>
                )}

                {(scheduleTab === 'all' || scheduleTab === 'midweek') && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-emerald-400 transition shadow-xs">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Youth Fellowship</div>
                      <div className="text-xs text-slate-500 font-medium">Every Wednesday</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                      06:00 PM
                    </span>
                  </div>
                )}

                {(scheduleTab === 'all' || scheduleTab === 'midweek') && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-emerald-400 transition shadow-xs">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Faith Clinic (Prayer Meeting)</div>
                      <div className="text-xs text-slate-500 font-medium">Every Thursday</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                      06:00 PM
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CONTACT & ENQUIRY FORM COLUMN */}
            <div className="lg:col-span-6 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Contact &amp; Prayer Requests</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Send us your prayer requests, testimonies, or parish enquiries.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your prayer request/message has been received.'); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-1 font-bold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brother Samuel"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-500 mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="samuel@example.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-500 mb-1 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+234800000000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-1 font-bold">Message / Prayer Request</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your request or message here..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-wider shadow-md transition"
                >
                  SEND PRAYER REQUEST
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. FOOTER SECTION                                            */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative bg-slate-950 text-blue-100 text-xs py-14 border-t border-blue-900/50 overflow-hidden">
        {/* BRIGHT MOTION VIDEO BACKGROUND & LIGHT OVERLAY */}
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
            className="w-full h-full object-cover filter brightness-110 contrast-105 opacity-60"
          >
            <source src="https://summitchurch.com/GetFile.ashx?Guid=f6e6e89c-bfa7-4e46-9a9f-ee6c0f05a7b4" type="video/mp4" />
          </video>
          {/* CINEMATIC OVERLAY FOR CRISP TEXT READABILITY */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/85 to-slate-950/90"></div>
          <div className="absolute inset-0 bg-grid-subtle opacity-25"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* BRAND COL */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src="/rccg_official_logo.png"
                  alt="RCCG Logo"
                  className="h-12 w-12 object-contain filter drop-shadow-lg"
                />
                <div className="h-8 w-px bg-white/20"></div>
                <img
                  src="/glorious_church_logo.png"
                  alt="Glorious Church"
                  className="h-14 w-auto object-contain filter drop-shadow-lg"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="font-extrabold text-white text-sm tracking-wide">{parishName}</div>
              <p className="text-blue-100/90 leading-relaxed text-[11px] font-medium">
                The Redeemed Christian Church of God. Holiness is our lifestyle; Heaven is our final goal.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-white font-black tracking-wider mb-3">Quick Navigation</h4>
              <div><a href="#" className="hover:text-white text-blue-100 font-medium transition">Home</a></div>
              <div><button onClick={() => handleNavClick('history')} className="hover:text-white text-blue-100 font-medium text-left transition">Our History</button></div>
              <div><button onClick={() => handleNavClick('vision')} className="hover:text-white text-blue-100 font-medium text-left transition">Mission &amp; Vision</button></div>
              <div><button onClick={() => handleNavClick('beliefs')} className="hover:text-white text-blue-100 font-medium text-left transition">Our Beliefs</button></div>
              <div><a href="#salvation" className="hover:text-white text-blue-100 font-medium transition">Give Your Life to Christ</a></div>
            </div>

            {/* MINISTRIES */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-white font-black tracking-wider mb-3">Ministries</h4>
              <div>
                <button
                  onClick={() => setInfoModalKey('youth')}
                  className="hover:text-white text-blue-100 font-medium text-left transition"
                >
                  Youth Ministry
                </button>
              </div>
            </div>

            {/* PORTAL ACCESS */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-white font-black tracking-wider mb-3">Parish Portal</h4>
              <p className="text-blue-100 text-[11px] font-medium leading-relaxed">
                Authorized ministers &amp; department heads can log into the CMS parish management portal.
              </p>
              <button
                onClick={onOpenPortal}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition border border-emerald-400"
              >
                Access CMS Portal
              </button>
            </div>

          </div>

          <div className="pt-8 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-blue-200/80 text-[11px] gap-4 font-medium">
            <div>
              &copy; {new Date().getFullYear()} {parishName} &bull; The Redeemed Christian Church of God. All Rights Reserved.
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://rccg.org/privacy-policy/" target="_blank" rel="noreferrer" className="hover:text-white text-blue-200 transition">Privacy Policy</a>
              <span>&bull;</span>
              <a href="https://www.rccg.org" target="_blank" rel="noreferrer" className="hover:text-white text-blue-200 transition">Official RCCG World Website</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* 11. INFORMATIONAL CONTENT MODAL (FOR DROPDOWN NAVIGATION)     */}
      {/* ------------------------------------------------------------- */}
      {infoModalKey && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setInfoModalKey(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HISTORY CONTENT */}
            {infoModalKey === 'history' && (
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-mono font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Church History</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Our History &amp; Legacy</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  The Redeemed Christian Church of God (RCCG) was founded in 1952 by Pa Josiah Akindayomi. Pa Akindayomi received a divine covenant from the Lord that RCCG would spread to the ends of the earth before the second coming of Jesus Christ.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  In 1981, Pastor Enoch Adejare Adeboye succeeded Pa Akindayomi as General Overseer. From 40 small parishes, RCCG has expanded rapidly under God's grace to over 50,000 parishes across 197 nations and territories worldwide.
                </p>
              </div>
            )}

            {/* MISSION & VISION CONTENT */}
            {infoModalKey === 'vision' && (
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Mission &amp; Vision</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Our Mission &amp; Vision Statement</h3>
                <div className="space-y-2 text-sm text-slate-700 font-medium">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">1. To make heaven.</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">2. To take as many people with us.</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">3. To have a member of RCCG in more families of all nations.</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">4. To accomplish No. 1 above, holiness will be our lifestyle.</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">5. To accomplish No. 2 and No. 3 above, we will plant churches within five minutes walking distance in every city and town of developing countries and within five minutes driving distance in every city and town of developed countries.</div>
                  <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 font-bold">6. We will pursue these objectives until every Nation in the world is reached for the Lord Jesus Christ.</div>
                </div>
              </div>
            )}

            {/* BELIEFS CONTENT */}
            {infoModalKey === 'beliefs' && (
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Doctrine &amp; Beliefs</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Our Fundamental Beliefs</h3>
                <div className="space-y-3 text-sm text-slate-600 font-medium">
                  <div><strong className="text-slate-900">1. The Holy Bible:</strong> The inspired, infallible Word of God (2 Tim 3:16).</div>
                  <div><strong className="text-slate-900">2. The Trinity:</strong> One God eternally existent in Father, Son, and Holy Spirit.</div>
                  <div><strong className="text-slate-900">3. Salvation:</strong> Eternal life received through repentance and faith in Jesus Christ.</div>
                  <div><strong className="text-slate-900">4. Baptism:</strong> Water baptism by immersion and Baptism of the Holy Spirit with speaking in tongues.</div>
                  <div><strong className="text-slate-900">5. Holiness &amp; Divine Healing:</strong> Living a consecrated life and trusting God for physical and spiritual healing.</div>
                </div>
              </div>
            )}

            {/* BLOG CONTENT */}
            {infoModalKey === 'blog' && (
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Parish Blog &amp; Articles</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Glorious Church Blog</h3>
                <div className="space-y-4 text-sm text-slate-600 font-medium">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="text-xs text-emerald-700 font-bold uppercase">September 2026 Edition</div>
                    <div className="text-base font-bold text-slate-900">Walking in Divine Dominion &amp; Purpose</div>
                    <p className="text-xs text-slate-600 leading-relaxed">Discover key spiritual guidelines for living a victorious life through prayer, consecration, and your faith in God's promises.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="text-xs text-emerald-700 font-bold uppercase">Family Life Series</div>
                    <div className="text-base font-bold text-slate-900">Building Godly Homes in Modern Times</div>
                    <p className="text-xs text-slate-600 leading-relaxed">Practical biblical principles for strengthening marriages, nurturing children, and fostering peaceful Christian households.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ANNOUNCEMENTS CONTENT */}
            {infoModalKey === 'announcements' && (
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parish Notices &amp; Weekly Announcements</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Weekly Parish Announcements</h3>
                <div className="space-y-3 text-sm text-slate-700 font-medium">
                  <div className="p-3.5 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 font-bold">
                    📢 <strong>Youth Fellowship:</strong> Holds every Wednesday by 06:00 PM at the Youth Chapel.
                  </div>
                  <div className="p-3.5 bg-blue-50 text-blue-950 rounded-xl border border-blue-200 font-bold">
                    🙏 <strong>Faith Clinic (Prayer Meeting):</strong> Holds every Thursday by 06:00 PM. Come with your prayer requests!
                  </div>
                </div>
              </div>
            )}

            {/* STRUCTURE CONTENT */}
            {infoModalKey === 'structure' && (
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-mono font-bold">
                  <Church className="w-3.5 h-3.5" />
                  <span>Governance</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">RCCG Church Structure</h3>
                <div className="space-y-2 text-sm text-slate-700 font-medium">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-blue-900">General Overseer:</strong> Pastor Enoch Adejare Adeboye</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-blue-900">Governing Council:</strong> Highest spiritual and administrative body</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-blue-900">Continental Overseers &amp; AGOs:</strong> International region supervision</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-blue-900">Provinces &amp; Parishes:</strong> Local parish leadership and community outreach</div>
                </div>
              </div>
            )}

            {/* HEALTH CONTENT */}
            {infoModalKey === 'health' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900">Department of Public Health</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  The RCCG Department of Public Health is committed to medical outreaches, free health screenings, maternal welfare, and community healthcare initiatives across urban and rural communities.
                </p>
              </div>
            )}

            {/* MISSIONS CONTENT */}
            {infoModalKey === 'missions' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900">African &amp; Global Missions</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  African Missions spearheads church planting, borehole water projects, educational support, and welfare for missionaries working in remote parts of Africa and underserved continents.
                </p>
              </div>
            )}

            {/* REDEMPTION TV CONTENT */}
            {infoModalKey === 'redemptionTv' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900">Redemption Television Ministry</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Redemption TV broadcasts 24/7 gospel preaching, Holy Ghost Service live streams, youth programs, and anointed worship music across satellite networks and digital media platforms.
                </p>
                <a
                  href="https://rccgworld.org/rccg/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-800 text-white font-bold text-xs"
                >
                  <span>Watch Redemption TV Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* YOUTH MINISTRY COMING SOON CONTENT */}
            {infoModalKey === 'youth' && (
              <div className="space-y-5 text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold">
                  <span>Glorious Youth Ministry</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Glorious Youth Website Coming Soon</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium max-w-md mx-auto">
                  We are currently preparing an inspiring digital space for our vibrant youth community. Stay tuned for updates, events, and resources!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setInfoModalKey(null)}
                    className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-md transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInfoModalKey(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 12. ONLINE GIVING MODAL                                       */}
      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {/* 12. PARISH BANK TRANSFER DETAILS MODAL                        */}
      {/* ------------------------------------------------------------- */}
      {givingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setGivingModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Parish Bank Transfer Details</h3>
                <p className="text-xs text-slate-500 font-medium">{parishName} Official Bank Accounts</p>
              </div>
            </div>

            {/* DIRECT BANK TRANSFER DETAILS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase text-slate-600 font-bold tracking-wider">
                  Official Account Numbers for Transfers
                </h4>
                <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                  Instant Transfer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* 1. Access Bank */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-400 transition space-y-1.5 relative group shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-900">Access Bank</span>
                    <button
                      onClick={() => handleCopyAccount('Access Bank', '12458796312')}
                      className={`text-[10px] px-2.5 py-0.5 rounded border transition font-bold ${
                        copiedAccount === 'Access Bank'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {copiedAccount === 'Access Bank' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-lg font-mono font-black text-slate-900 tracking-wider">12458796312</div>
                  <div className="text-[11px] text-slate-700 font-bold truncate">RCCG Glorious Church</div>
                  <div className="text-[10px] text-slate-500 font-medium">For Tithes &amp; General Offerings</div>
                </div>

                {/* 2. UBA Bank */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-red-400 transition space-y-1.5 relative group shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-red-700">UBA Bank</span>
                    <button
                      onClick={() => handleCopyAccount('UBA Bank', '12458796312')}
                      className={`text-[10px] px-2.5 py-0.5 rounded border transition font-bold ${
                        copiedAccount === 'UBA Bank'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {copiedAccount === 'UBA Bank' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-lg font-mono font-black text-slate-900 tracking-wider">12458796312</div>
                  <div className="text-[11px] text-slate-700 font-bold truncate">RCCG Glorious Church (Projects)</div>
                  <div className="text-[10px] text-slate-500 font-medium">For Building &amp; Capital Projects</div>
                </div>

                {/* 3. Zenith Bank */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-400 transition space-y-1.5 relative group shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-800">Zenith Bank</span>
                    <button
                      onClick={() => handleCopyAccount('Zenith Bank', '12458796312')}
                      className={`text-[10px] px-2.5 py-0.5 rounded border transition font-bold ${
                        copiedAccount === 'Zenith Bank'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {copiedAccount === 'Zenith Bank' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-lg font-mono font-black text-slate-900 tracking-wider">12458796312</div>
                  <div className="text-[11px] text-slate-700 font-bold truncate">RCCG Glorious Church (Welfare)</div>
                  <div className="text-[10px] text-slate-500 font-medium">For Mercy &amp; Benevolence</div>
                </div>

                {/* 4. GTBank */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-400 transition space-y-1.5 relative group shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900">GTBank</span>
                    <button
                      onClick={() => handleCopyAccount('GTBank', '12458796312')}
                      className={`text-[10px] px-2.5 py-0.5 rounded border transition font-bold ${
                        copiedAccount === 'GTBank'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {copiedAccount === 'GTBank' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-lg font-mono font-black text-slate-900 tracking-wider">12458796312</div>
                  <div className="text-[11px] text-slate-700 font-bold truncate">RCCG Glorious Church (Missions)</div>
                  <div className="text-[10px] text-slate-500 font-medium">For Global Missions &amp; Outreach</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setGivingModalOpen(false)}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition"
              >
                DONE / CLOSE WINDOW
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 12.5 SHARE YOUR TESTIMONY MODAL & FORM                         */}
      {/* ------------------------------------------------------------- */}
      {testimonyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            
            <button
              onClick={() => setTestimonyModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Share Your Testimony</h3>
                <p className="text-xs text-slate-500 font-medium">A place of Testimonies, &amp; Amalgamation of Smiling Faces</p>
              </div>
            </div>

            {/* TESTIMONY SUBMISSION FORM */}
            <form onSubmit={handleSaveTestimony} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={testimonyForm.fullName}
                  onChange={(e) => setTestimonyForm({ ...testimonyForm, fullName: e.target.value })}
                  placeholder="e.g. Sister Mercy Adebayo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={testimonyForm.email}
                    onChange={(e) => setTestimonyForm({ ...testimonyForm, email: e.target.value })}
                    placeholder="mercy@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={testimonyForm.phone}
                    onChange={(e) => setTestimonyForm({ ...testimonyForm, phone: e.target.value })}
                    placeholder="+2348012345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Testimony Category
                  </label>
                  <select
                    value={testimonyForm.category}
                    onChange={(e) => setTestimonyForm({ ...testimonyForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition font-semibold"
                  >
                    <option value="Divine Healing">Divine Healing</option>
                    <option value="Career Breakthrough">Career / Business Breakthrough</option>
                    <option value="Salvation / Revival">Salvation &amp; Spiritual Growth</option>
                    <option value="Family Restoration">Family &amp; Fruit of the Womb</option>
                    <option value="Financial Provision">Financial Provision</option>
                    <option value="General Grace">General Thanksgiving &amp; Grace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Short Title
                  </label>
                  <input
                    type="text"
                    value={testimonyForm.title}
                    onChange={(e) => setTestimonyForm({ ...testimonyForm, title: e.target.value })}
                    placeholder="e.g. God Healed My Sickness"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                  Testimony Story <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonyForm.content}
                  onChange={(e) => setTestimonyForm({ ...testimonyForm, content: e.target.value })}
                  placeholder="Share what the Lord has done for you in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="allowPublicSharing"
                  checked={testimonyForm.allowPublicSharing}
                  onChange={(e) => setTestimonyForm({ ...testimonyForm, allowPublicSharing: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="allowPublicSharing" className="text-[11px] text-slate-600 font-medium">
                  I agree to let RCCG Glorious Church publish this testimony on the Praise Wall and during church services.
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTestimonyModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black uppercase tracking-wider shadow-lg shadow-emerald-950/30 transition transform hover:scale-102 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Submit &amp; Save Testimony</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 13. SEARCH MODAL                                             */}
      {/* ------------------------------------------------------------- */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-mono uppercase text-slate-700 font-bold">Search Glorious Church Website</h3>
              <button onClick={() => setSearchModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Type service name, sermon, giving, beliefs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>

            <div className="text-xs text-slate-500 pt-2">
              Popular searches: <button onClick={() => setSearchQuery('Services')} className="text-blue-700 font-semibold hover:underline">Services</button>, <button onClick={() => setSearchQuery('Workforce')} className="text-blue-700 font-semibold hover:underline">Workforce</button>, <button onClick={() => setSearchQuery('Open Heavens')} className="text-blue-700 font-semibold hover:underline">Open Heavens</button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 14. JOIN WORKFORCE REGISTRATION MODAL                         */}
      {/* ------------------------------------------------------------- */}
      {workforceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            
            <button
              onClick={() => setWorkforceModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Join The Parish Workforce</h3>
                <p className="text-xs text-slate-500 font-medium">Serve God with your time, talents, and gifts at Glorious Church</p>
              </div>
            </div>

            <form onSubmit={handleWorkforceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={workforceForm.fullName}
                  onChange={(e) => setWorkforceForm({ ...workforceForm, fullName: e.target.value })}
                  placeholder="e.g. Sister Grace Okon"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={workforceForm.phone}
                    onChange={(e) => setWorkforceForm({ ...workforceForm, phone: e.target.value })}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={workforceForm.email}
                    onChange={(e) => setWorkforceForm({ ...workforceForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Preferred Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={workforceForm.department}
                    onChange={(e) => setWorkforceForm({ ...workforceForm, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Ushering & Protocol">Ushering &amp; Protocol</option>
                    <option value="Choir & Praise Team">Choir &amp; Praise Team</option>
                    <option value="Media & Technical Broadcast">Media &amp; Technical Broadcast</option>
                    <option value="Sanitation & Environmental">Sanitation &amp; Environmental</option>
                    <option value="Children & Youth Ministry">Children &amp; Youth Ministry</option>
                    <option value="Evangelism & Follow-up">Evangelism &amp; Follow-up</option>
                    <option value="Prayer & Intercession">Prayer &amp; Intercession</option>
                    <option value="Mercy & Welfare Department">Mercy &amp; Welfare Department</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                    Membership Status
                  </label>
                  <select
                    value={workforceForm.status}
                    onChange={(e) => setWorkforceForm({ ...workforceForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Baptized Member">Water &amp; Holy Spirit Baptized</option>
                    <option value="Believers Class Graduate">Believers Class Graduate</option>
                    <option value="Worker Transfer">Worker Transfer from RCCG Parish</option>
                    <option value="New Member">New Parishioner</option>
                  </select>
                </div>
              </div>

              {/* PRIOR TRAINING CERTIFICATES (OPTIONAL / NULLABLE) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Prior Class Verification Certificates (Optional)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    If you have completed any of these training programs, upload your certificates for verification. (Can be left empty if not yet completed).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Baptism Cert</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setWorkforceForm({ ...workforceForm, baptismCertName: file ? file.name : '' });
                      }}
                      className="w-full text-[10px] text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200"
                    />
                    {workforceForm.baptismCertName && (
                      <span className="text-[10px] text-emerald-700 font-medium block truncate mt-0.5">
                        ✓ {workforceForm.baptismCertName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Believer's Cert</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setWorkforceForm({ ...workforceForm, believersCertName: file ? file.name : '' });
                      }}
                      className="w-full text-[10px] text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200"
                    />
                    {workforceForm.believersCertName && (
                      <span className="text-[10px] text-emerald-700 font-medium block truncate mt-0.5">
                        ✓ {workforceForm.believersCertName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Worker in Training</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setWorkforceForm({ ...workforceForm, witCertName: file ? file.name : '' });
                      }}
                      className="w-full text-[10px] text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200"
                    />
                    {workforceForm.witCertName && (
                      <span className="text-[10px] text-emerald-700 font-medium block truncate mt-0.5">
                        ✓ {workforceForm.witCertName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider">
                  Brief Statement / Experience
                </label>
                <textarea
                  rows={3}
                  value={workforceForm.notes}
                  onChange={(e) => setWorkforceForm({ ...workforceForm, notes: e.target.value })}
                  placeholder="Share a brief note about your interest or previous church worker experience..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setWorkforceModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black uppercase tracking-wider shadow-lg shadow-emerald-950/30 transition transform hover:scale-102 flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
