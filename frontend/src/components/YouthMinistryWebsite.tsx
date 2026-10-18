import React, { useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  HeartHandshake,
  Instagram,
  MapPin,
  Menu,
  Music2,
  Quote,
  Sparkles,
  Target,
  Users,
  X,
  Youtube,
  Award,
  CheckCircle2,
  Send,
  Calendar,
  Lock,
  Flame,
  Heart
} from 'lucide-react';

export interface YouthMinistryWebsiteProps {
  onReturnToMain: () => void;
  onOpenPortal: () => void;
  parishName?: string;
}

const logo = '/youth_logo_transparent.png';
const youthSymbol = '/youth_symbol.png';
const logoFallback = '/assets/images/WhatsApp_Image_2026-10-16_at_5.23.05_AM.jpeg';

const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/8815046/pexels-photo-8815046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'Worship night',
    tag: 'Faith & worship'
  },
  {
    src: 'https://images.pexels.com/photos/7849436/pexels-photo-7849436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'Serving with joy',
    tag: 'Outreach day'
  },
  {
    src: 'https://images.pexels.com/photos/10353711/pexels-photo-10353711.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'Chosen family',
    tag: 'Youth community'
  },
  {
    src: 'https://images.pexels.com/photos/18751058/pexels-photo-18751058.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'Growing together',
    tag: 'Fellowship'
  },
  {
    src: 'https://images.pexels.com/photos/17026870/pexels-photo-17026870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'One body',
    tag: 'Sunday gathering'
  }
];

const events = [
  {
    id: 'awake-3-0',
    date: '16-18',
    month: 'OCT',
    year: '2026',
    title: 'AWAKE 3.0',
    badge: 'Awake 3.0 · Flagship 3-Day Program',
    theme: 'The High Praise of Our God',
    detail:
      'RCCG Glorious Church Youths presents AWAKE 3.0 — an explosive 3-day praise, worship, and spiritual revival convergence themed "The High Praise of Our God". Join Pastor Taiwo Adetunji (Host), Minister Christopher Yinka Philip (Youth President / Co-Host), anointed guest psalmists, and Glorious Youth Drama for unbroken prophetic high praise, spiritual warfare, impartation, and deep encounters.',
    highlights: [
      'Fri 16th Oct · 10:00 PM: Opening Night of High Praise (Vigil)',
      'Sat 17th Oct · 4:00 PM: Deep Worship, Word & Glorious Youth Drama',
      'Sun 18th Oct · 8:00 AM: Grand Thanksgiving Service & Anointing'
    ],
    time: 'Fri 16th (10:00 PM), Sat 17th (4:00 PM) & Sun 18th Oct (8:00 AM)',
    place: 'RCCG Glorious Church Auditorium, KM 36, Eputu B/Stop Beside Danco Filling Station, Lekki Epe Expressway, Lagos',
    image: '/awake_3_0_flyer.jpg',
    ministers:
      'Host: Pastor Taiwo Adetunji • Co-Host: Min. Christopher Yinka Philip (Youth President) • Drama: Glorious Youth Drama • Guest Ministers: Pastor Glory Ughegbe, Min. Ola (Youth Choir Leader), Min. Emmanuel Godspower, Min. Popekeyz, Min. Wale Praiz, Min. Yemisi, Min. Godwin Arthur, Min. Josephine, Min. Samuel Edufacts, Min. Maranatha, Min. Joshua Obioma',
    isPast: false
  },
  {
    id: 'weekly-fellowship',
    date: 'WED',
    month: 'WKLY',
    year: 'Every Week',
    title: 'Youth Prayer & Word Fellowship',
    badge: 'Weekly Discipleship',
    theme: 'Spiritual Growth, Prayer & Discipleship',
    detail:
      'Our core mid-week fellowship for spiritual growth and community. Experience passionate prayer sessions, transformative biblical messages, and interactive discussions that equip youths for impactful Christian living.',
    highlights: ['Prayer Sessions', 'Message', 'Discussions'],
    time: 'Every Wednesday · 6:00 PM GMT',
    place: 'Main Youth Chapel & YouTube Live Stream',
    image: galleryImages[0].src,
    ministers: 'Youth Pastoral Council & Discipleship Leaders',
    isPast: false
  },
  {
    id: 'prayer-walk',
    date: 'ANN',
    month: 'PAST',
    year: 'Milestone',
    title: 'Annual Youth Prayer Walk',
    badge: 'Concluded Milestone',
    theme: 'City & Campus Intercession',
    detail:
      'A faith-charged spiritual expedition through the city streets and campus corridors. Lifting holy hands to sanctify neighborhoods, interceding for academic breakthrough, national transformation, and youth revival.',
    highlights: [
      'Territorial Intercession Across the Community',
      'Campus Revival Declarations & Student Altars',
      'Community Outreach & Compassionate Evangelism'
    ],
    time: 'Concluded Spiritual Milestone · Annual Tradition',
    place: 'Parish Metropolis Routes & Campus Corridors',
    image: galleryImages[3].src,
    ministers: 'Parish Metropolis Corridors & Campus Outreach Vanguard',
    isPast: true
  }
];

const executives = [
  { name: 'Min. Christopher Yinka Philip', role: 'Youth President / Co-Host', initials: 'CY', color: 'bg-[#e9d8c9]' },
  { name: 'Min. Ola', role: 'Youth Choir Leader', initials: 'OL', color: 'bg-[#c8d7c2]' },
  { name: 'Grace Nwosu', role: 'Vice President', initials: 'GN', color: 'bg-[#d6cbed]' },
  { name: 'Esther Mensah', role: 'Communications', initials: 'EM', color: 'bg-[#f0ddae]' }
];

export const YouthMinistryWebsite: React.FC<YouthMinistryWebsiteProps> = ({
  onReturnToMain,
  onOpenPortal,
  parishName = 'RCCG Glorious Church'
}) => {
  const [activeEvent, setActiveEvent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Join Form State
  const [joinFullName, setJoinFullName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPhone, setJoinPhone] = useState('');
  const [joinCategory, setJoinCategory] = useState('Young Professional');
  const [joinInterest, setJoinInterest] = useState('Youth Leadership & Mentorship');
  const [joinSuccessBanner, setJoinSuccessBanner] = useState<string | null>(null);
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Auto-advance events carousel every 7 seconds
  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveEvent((current) => (current + 1) % events.length),
      7000
    );
    return () => window.clearInterval(timer);
  }, []);

  const event = events[activeEvent];
  const nextEvent = () => setActiveEvent((current) => (current + 1) % events.length);
  const previousEvent = () =>
    setActiveEvent((current) => (current - 1 + events.length) % events.length);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinFullName.trim() || !joinEmail.trim()) {
      alert('Please provide your full name and email address.');
      return;
    }
    setIsSubmittingJoin(true);
    try {
      const payload = {
        fullName: joinFullName.trim(),
        email: joinEmail.trim(),
        phoneNumber: joinPhone.trim(),
        youthCategory: joinCategory,
        interests: joinInterest,
        submittedAt: new Date().toISOString()
      };

      const res = await api.post<{ success: boolean; message: string; data?: any }>(
        '/Members/youth-register',
        payload
      );
      if (res && res.data && res.data.success) {
        setJoinSuccessBanner(
          `Hallelujah, ${joinFullName.trim()}! Your registration has been received. Youth leadership officials have been notified.`
        );
      } else {
        setJoinSuccessBanner(
          `Welcome to Glorious Youth, ${joinFullName.trim()}! We have recorded your interest and will reach out shortly.`
        );
      }

      setJoinFullName('');
      setJoinEmail('');
      setJoinPhone('');
    } catch {
      setJoinSuccessBanner(
        `Welcome to Glorious Youth, ${joinFullName.trim()}! Your details have been submitted. An official will connect with you.`
      );
      setJoinFullName('');
      setJoinEmail('');
      setJoinPhone('');
    } finally {
      setIsSubmittingJoin(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#e9f2e5] text-[#211b2e] font-sans antialiased selection:bg-[#4dbb62] selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. LIGHT MINT / PALE SAGE HEADER                              */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#EBF3EA]/95 text-slate-800 backdrop-blur-md transition-all shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
          <a
            href="#top"
            className="flex items-center gap-3 group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center">
              <img
                src={logo}
                alt="Glorious Church Youths Logo"
                className="h-10 sm:h-11 w-auto object-contain transition group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = logoFallback;
                }}
              />
            </div>
            <div className="border-l border-slate-300 pl-3 flex flex-col justify-center">
              <span className="block text-xs font-black tracking-widest text-[#130E3A] leading-tight">
                GLORIOUS
              </span>
              <span className="block text-[10px] font-bold tracking-wider text-emerald-600 leading-tight">
                YOUTH FELLOWSHIP
              </span>
            </div>
          </a>

          <button
            className="rounded-full border border-slate-300 p-2 text-slate-800 lg:hidden hover:bg-emerald-900/5 transition"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav
            className={`${
              menuOpen
                ? 'absolute left-0 right-0 top-[65px] flex flex-col bg-[#EBF3EA] px-6 py-6 shadow-2xl border-b border-emerald-900/10'
                : 'hidden'
            } gap-8 text-sm font-semibold text-slate-800 lg:static lg:flex lg:flex-row lg:items-center lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition"
            >
              About us
            </a>
            <a
              href="#mandate"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition"
            >
              Our Mandate
            </a>
            <a
              href="#events"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition"
            >
              Events
            </a>
            <a
              href="#gallery"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition"
            >
              Gallery
            </a>
            <a
              href="#team"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition"
            >
              Leadership
            </a>
            <div className="flex items-center gap-3 pt-2 lg:pt-0">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setIsJoinModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-sm hover:shadow-md transition inline-flex items-center justify-center gap-2"
              >
                <span>Join the family</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={onReturnToMain}
                className="px-4 py-2 rounded-full border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-slate-700 font-semibold text-xs transition inline-flex items-center gap-1.5"
                title="Return to Main Church Website"
              >
                <ArrowLeft size={13} />
                <span>Church Site</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------- */}
        {/* 3. HERO SECTION (Luminous Mint Canvas & Centered 3-Card Mosaic) */}
        {/* ------------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3EA] via-[#F4F9F3] to-[#e9f2e5] text-[#130E3A] pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
          {/* Ambient Lighting & Radial Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-emerald-300/30 via-teal-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 left-6 sm:left-16 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-6 sm:right-16 w-96 h-96 bg-indigo-200/25 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.10] pointer-events-none" />

          {/* Centered Narrative Container */}
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
            {/* Eyebrow Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-800 text-xs font-bold tracking-wider uppercase shadow-sm">
              <img
                src={youthSymbol}
                alt="Glorious Church Youths Symbol"
                className="h-4 sm:h-4.5 w-auto object-contain shrink-0"
                onError={(e) => {
                  e.currentTarget.src = logo;
                }}
              />
              <span>A Generation on Fire</span>
            </div>

            {/* Bold Display Headline with Hand-Drawn Accent */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#130E3A] leading-[1.08]">
              Rooted in Faith. <br className="hidden sm:inline" />
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="text-emerald-600">Alive with Purpose.</span>
                {/* Expressive hand-drawn squiggly accent underline */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-emerald-500 overflow-visible"
                  viewBox="0 0 300 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 14C55 5 110 18 165 10C215 3 265 14 297 10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Centered Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              A vibrant community of youths discovering Christ, serving boldly, and growing together. There is room for your story here.
            </p>

            {/* Action CTAs (Centered) */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
              >
                <span>See What's Happening</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#130E3A] font-bold text-sm sm:text-base border border-slate-300 shadow-md shadow-slate-200/50 hover:border-emerald-500 transition-all duration-200 hover:-translate-y-0.5"
              >
                Join Us
              </button>
            </div>

            {/* Social Proof with Real Avatar Silhouettes */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Youth Member"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Youth Member"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Youth Member"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                  alt="Youth Member"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                <span className="text-[#130E3A] font-bold">150+ youths</span> gathering weekly
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* DYNAMIC MULTI-IMAGE MOSAIC COLLAGE (3-Card Cluster)          */}
          {/* ------------------------------------------------------------- */}
          <div className="max-w-6xl mx-auto mt-12 sm:mt-16 px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Card: Community Fellowship (Tilted -3 deg) */}
              <div className="md:col-span-3 order-2 md:order-1 relative group">
                <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10 border-4 border-white transform md:-rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out h-64 md:h-80 bg-slate-100">
                  <img
                    src={galleryImages[2].src}
                    alt="Youth Community Fellowship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Community Life</p>
                    <p className="text-xs font-bold leading-tight">Authentic Fellowship</p>
                  </div>
                </div>
                {/* Floating mini badge on left card */}
                <div className="hidden lg:flex absolute -bottom-3 -right-2 bg-white/95 backdrop-blur-md border border-slate-200/80 px-3 py-1.5 rounded-full shadow-lg items-center gap-1.5 z-20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-bold text-slate-800">Chosen Family</span>
                </div>
              </div>

              {/* Center Card: Main Worship Hero Frame (Tall & Dominant) */}
              <div className="md:col-span-6 order-1 md:order-2 relative z-20">
                <div className="relative mx-auto max-w-sm sm:max-w-md h-[380px] sm:h-[460px] rounded-t-full rounded-b-[40px] overflow-hidden shadow-2xl shadow-emerald-950/20 border-4 border-white bg-slate-100 group">
                  <img
                    src="/youth_fellowship_hero.jpg"
                    alt="RCCG Glorious Youths Fellowship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = galleryImages[1].src;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Pill: Next Gathering */}
                <div className="absolute -top-3 right-2 sm:right-6 bg-[#130E3A]/90 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-30">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-left">
                    <p className="text-[9px] text-emerald-300 font-semibold uppercase tracking-wider">Weekly Fellowship</p>
                    <p className="text-xs text-white font-bold">Wednesdays • 6:00 PM</p>
                  </div>
                </div>

                {/* Floating Glass Card: Welcome Note */}
                <div className="absolute -bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-md border border-slate-200/80 p-3.5 rounded-2xl shadow-xl max-w-[220px] z-30">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Heart className="w-4 h-4 fill-emerald-500/20 text-emerald-600" />
                    <span className="text-xs font-bold text-[#130E3A]">You Belong Here</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Every story matters, and there is a family waiting for you.
                  </p>
                </div>
              </div>

              {/* Right Card: Passionate Praise (Tilted +3 deg) */}
              <div className="md:col-span-3 order-3 relative group">
                <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10 border-4 border-white transform md:rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out h-64 md:h-80 bg-slate-100">
                  <img
                    src={galleryImages[0].src}
                    alt="Youth Worship & Praise"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Worship Night</p>
                    <p className="text-xs font-bold leading-tight">Passion & Praise</p>
                  </div>
                </div>
                {/* Floating mini badge on right card */}
                <div className="hidden lg:flex absolute -top-3 -left-2 bg-white/95 backdrop-blur-md border border-slate-200/80 px-3 py-1.5 rounded-full shadow-lg items-center gap-1.5 z-20">
                  <Clock3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-slate-800">AWAKE 3.0 Live</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 4. WHO WE ARE (3-Pillars from frontend/project)                */}
        {/* ------------------------------------------------------------- */}
        <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#39994e]">
                Who we are
              </p>
              <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-[-0.03em] text-[#211566] sm:text-5xl">
                Not just a youth group. <span className="text-[#4dbb62]">A movement.</span>
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#625d6b]">
              We believe the church is at its best when young people are seen, heard, and equipped to live out their faith. Every gathering is a chance to encounter God and one another.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <article className="rounded-3xl bg-[#211566] p-8 text-white transition-all duration-300 hover:-translate-y-1.5 shadow-lg">
              <Target className="mb-10 text-[#75d283]" size={32} />
              <h3 className="mb-3 text-xl font-bold">Know God</h3>
              <p className="text-sm leading-6 text-white/70">
                We create honest spaces to encounter Jesus and build a vibrant, unshakable faith that lasts.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-8 text-[#211566] transition-all duration-300 hover:-translate-y-1.5 shadow-xl border border-[#cbe0c5]">
              <Users className="mb-10 text-[#39994e]" size={32} />
              <h3 className="mb-3 text-xl font-bold">Find belonging</h3>
              <p className="text-sm leading-6 text-[#4a5568]">
                No pretending. Just real friendships, shared tables, and a supportive family that always shows up.
              </p>
            </article>

            <article className="rounded-3xl bg-[#4dbb62] p-8 text-white transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-[#4dbb62]/20">
              <HeartHandshake className="mb-10 text-white" size={32} />
              <h3 className="mb-3 text-xl font-bold">Live on mission</h3>
              <p className="text-sm leading-6 text-white/85">
                We take what we learn beyond the room and into our campuses, workplaces, and neighborhoods.
              </p>
            </article>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 5. CORE DIVINE MANDATE BANNER                                 */}
        {/* ------------------------------------------------------------- */}
        <section id="mandate" className="py-20 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-[#cbe0c5] p-8 sm:p-14 text-center space-y-6 shadow-xl">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#211566]/10 text-[#211566] text-xs font-mono font-bold tracking-wider uppercase border border-[#211566]/20">
              <Award className="w-4 h-4 text-[#39994e]" />
              <span>OUR CORE DIVINE MANDATE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#211566] tracking-tight">
              A Vibrant Generation Anchored in Christ
            </h2>

            <p className="text-base sm:text-lg text-[#4a5568] leading-relaxed max-w-3xl mx-auto">
              At <strong className="text-[#211566] font-bold">RCCG Glorious Youth Ministry</strong>, our heartbeat is to build a passionate community where youths are grounded in the Word, empowered by the Holy Spirit, and equipped for global relevance. We build leaders, ignite visions, and champion a lifestyle of uncompromising holiness.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-[#211566] hover:bg-[#16103e] text-white text-xs font-extrabold uppercase tracking-wider shadow-xl shadow-[#211566]/25 transition hover:scale-105 active:scale-95"
              >
                GET INVOLVED TODAY
              </button>
              <a
                href="#events"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('events');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#211566] text-xs font-extrabold uppercase tracking-wider border border-[#cbe0c5] shadow-xs transition hover:border-[#211566]/40"
              >
                YOUTH FELLOWSHIP SCHEDULE
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 6. WHAT'S HAPPENING / EVENTS (Duplicated Carousel Layout)     */}
        {/* ------------------------------------------------------------- */}
        <section id="events" className="px-6 py-20 lg:px-10 lg:py-28 border-t border-[#d3e5cf]">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#39994e]">
                  Save your seat
                </p>
                <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-[#211566] sm:text-5xl">
                  What’s happening
                </h2>
              </div>
              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  onClick={previousEvent}
                  className="rounded-full border border-[#211566]/20 bg-white p-3 text-[#211566] shadow-xs transition hover:bg-[#211566] hover:text-white"
                  aria-label="Previous event"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  type="button"
                  onClick={nextEvent}
                  className="rounded-full border border-[#211566]/20 bg-white p-3 text-[#211566] shadow-xs transition hover:bg-[#211566] hover:text-white"
                  aria-label="Next event"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>

            {/* Featured Event Card */}
            <div className="grid overflow-hidden rounded-[2rem] bg-[#211566] lg:grid-cols-[1.08fr_0.92fr] shadow-2xl">
              <div className="relative min-h-[390px] overflow-hidden bg-black/40">
                <img
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211566]/95 via-[#211566]/30 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white">
                  <div>
                    <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#8fe09a] bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                      {event.badge}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
                      {event.title}
                    </h3>
                    {event.theme && (
                      <p className="mt-1 text-xs sm:text-sm font-bold text-amber-300 tracking-wide uppercase drop-shadow-sm">
                        Theme: {event.theme}
                      </p>
                    )}
                  </div>
                  <div className="hidden text-center sm:block bg-[#211566]/80 p-3 rounded-2xl border border-white/20 backdrop-blur-md shrink-0 ml-4">
                    <span className="block text-3xl font-black leading-none text-white">
                      {event.date}
                    </span>
                    <span className="text-xs font-bold tracking-widest text-[#8fe09a]">
                      {event.month}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-8 text-white sm:p-12 space-y-6">
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-14 items-center justify-center rounded-xl bg-[#4dbb62] font-black text-sm tracking-wider">
                        {event.date}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                        {event.month} &bull; {event.year}
                      </span>
                    </div>
                    {event.theme && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <span>THEME: {event.theme}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-base sm:text-lg leading-relaxed text-white/80">
                    {event.detail}
                  </p>

                  {/* Highlights pills */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {event.highlights.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/90"
                      >
                        <CheckCircle2 size={13} className="text-[#8fe09a] shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>

                  {event.ministers && (
                    <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs leading-relaxed space-y-1">
                      <div className="text-[#8fe09a] font-bold uppercase tracking-wider text-[10px]">
                        Program Ministers & Hosts
                      </div>
                      <p className="text-white/70">
                        {event.ministers}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 space-y-3 text-sm text-white/80">
                    <span className="flex items-center gap-3">
                      <Clock3 size={17} className="text-[#75d283] shrink-0" />
                      <span>{event.time}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <MapPin size={17} className="text-[#75d283] shrink-0" />
                      <span>{event.place}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="rounded-full bg-white px-6 py-3 font-bold text-[#211566] transition hover:bg-[#75d283] hover:text-white shadow-md inline-flex items-center gap-2"
                  >
                    <span>{event.isPast ? 'Inquire / Relive Highlights' : 'I’m interested · Register'}</span>
                    <ArrowRight size={15} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {events.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveEvent(idx)}
                        className={`h-2 rounded-full transition-all ${
                          activeEvent === idx ? 'w-6 bg-[#4dbb62]' : 'w-2 bg-white/30'
                        }`}
                        aria-label={`Show event ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 7. THE GALLERY (Duplicated from frontend/project)              */}
        {/* ------------------------------------------------------------- */}
        <section id="gallery" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28 border-t border-[#d3e5cf]">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#39994e]">
                The gallery
              </p>
              <h2 className="text-4xl font-extrabold tracking-[-0.03em] text-[#211566] sm:text-5xl">
                Scenes from the journey
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#625d6b]">
              Every photo holds a memory. Every memory is part of a bigger story.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <article
                key={image.title}
                className={`${
                  index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                } group relative min-h-[240px] overflow-hidden rounded-[1.5rem] shadow-md`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211566]/85 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ce5a4]">
                    {image.tag}
                  </p>
                  <h3 className="text-lg font-bold">{image.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 8. MEET THE TEAM / LEADERSHIP (Duplicated from frontend/project)*/}
        {/* ------------------------------------------------------------- */}
        <section id="team" className="bg-[#211566] px-6 py-20 text-white lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#81da8d]">
                  Meet the team
                </p>
                <h2 className="text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
                  Young leaders.<br />
                  <span className="text-[#72d27f]">Big-hearted service.</span>
                </h2>
                <p className="mt-6 max-w-sm leading-7 text-white/70">
                  A dedicated team of youth officials creating space for others to encounter God, grow in confidence, and step boldly into purpose.
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-wider text-white transition inline-flex items-center gap-2"
                  >
                    <span>Connect with Youth Leaders</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {executives.map((person) => (
                  <article key={person.name} className="group cursor-pointer">
                    <div
                      className={`mb-4 flex aspect-[0.82] items-end justify-center overflow-hidden rounded-[1.3rem] ${person.color} shadow-lg`}
                    >
                      <span className="text-5xl font-black text-[#211566]/70 transition duration-300 group-hover:scale-110">
                        {person.initials}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">{person.name}</h3>
                    <p className="mt-1 text-xs text-white/60">{person.role}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 9. MEMBER TESTIMONIAL BANNER                                 */}
        {/* ------------------------------------------------------------- */}
        <section className="py-16 px-6 lg:px-10">
          <div className="mx-auto max-w-7xl bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-[#cbe0c5] p-8 sm:p-12 shadow-xl grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-5">
              <div className="mt-1 hidden rounded-full bg-[#4dbb62] p-3.5 text-white sm:block shadow-md">
                <Quote size={24} />
              </div>
              <div>
                <p className="max-w-2xl text-2xl font-medium leading-relaxed text-[#211566] sm:text-3xl">
                  “I walked in looking for friends. I found a family and a faith that feels like home.”
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#39994e]">
                  — Adwoa, youth member
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm font-bold text-[#211566] bg-[#e9f2e5] px-6 py-3 rounded-full border border-[#cbe0c5] shadow-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4dbb62] animate-pulse" />
              <span>You belong here</span>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 10. COMPREHENSIVE FOOTER (Duplicated from frontend/project)   */}
      {/* ------------------------------------------------------------- */}
      <footer id="contact" className="bg-[#16103e] px-6 pb-10 pt-20 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
            <div>
              <div className="mb-6 inline-block bg-white/10 p-2 rounded-2xl border border-white/20">
                <img
                  src={logo}
                  alt="Glorious Church Youths Logo"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = logoFallback;
                  }}
                />
              </div>
              <p className="max-w-xs text-sm leading-7 text-white/60">
                A place to belong, believe, and become. We cannot wait to welcome you into the family.
              </p>
              <div className="mt-7 flex gap-3">
                <a
                  href="#contact"
                  className="rounded-full border border-white/15 p-3 text-white/70 transition hover:bg-[#4dbb62] hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-white/15 p-3 text-white/70 transition hover:bg-[#4dbb62] hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook size={17} />
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-white/15 p-3 text-white/70 transition hover:bg-[#4dbb62] hover:text-white"
                  aria-label="Youtube"
                >
                  <Youtube size={17} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#81da8d]">
                Explore
              </h3>
              <div className="space-y-3 text-sm text-white/65">
                <a className="block hover:text-white transition" href="#about">
                  Our story
                </a>
                <a className="block hover:text-white transition" href="#mandate">
                  Core mandate
                </a>
                <a className="block hover:text-white transition" href="#events">
                  Upcoming events
                </a>
                <a className="block hover:text-white transition" href="#gallery">
                  Gallery
                </a>
                <a className="block hover:text-white transition" href="#team">
                  Our leaders
                </a>
                <button
                  type="button"
                  onClick={onReturnToMain}
                  className="block text-left text-white/65 hover:text-white transition"
                >
                  &larr; Main Church Website
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#81da8d]">
                Gather with us
              </h3>
              <div className="space-y-4 text-sm text-white/65">
                <p className="flex gap-3 items-start">
                  <CalendarDays size={16} className="shrink-0 text-[#75d283] mt-0.5" />
                  <span>
                    Every Wednesday &bull; 6:00 PM<br />
                    Youth Discipleship Fellowship
                  </span>
                </p>
                <p className="flex gap-3 items-start">
                  <MapPin size={16} className="shrink-0 text-[#75d283] mt-0.5" />
                  <span>
                    {parishName}<br />
                    Youth Sanctuary Hall
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#81da8d]">
                Stay in the loop
              </h3>
              <p className="mb-4 text-sm leading-6 text-white/60">
                Get event announcements, spiritual devotions, and updates delivered to your inbox.
              </p>

              {newsletterSuccess ? (
                <div className="p-3 rounded-xl bg-[#4dbb62]/20 border border-[#4dbb62]/40 text-[#8fe09a] text-xs">
                  Thank you! You are subscribed to Glorious Youth updates.
                </div>
              ) : (
                <form className="flex border-b border-white/30 pb-2" onSubmit={handleNewsletterSubmit}>
                  <input
                    aria-label="Email address"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                    required
                  />
                  <button
                    aria-label="Subscribe"
                    className="text-[#75d283] hover:text-white transition"
                    type="submit"
                  >
                    <ArrowRight size={19} />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 pt-7 text-xs text-white/45 sm:flex-row items-center">
            <p>&copy; {new Date().getFullYear()} {parishName} Youths Fellowship. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onReturnToMain}
                className="hover:text-white transition flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Return to Main Church Site</span>
              </button>
              <span>&bull;</span>
              <p className="flex items-center gap-1.5 text-white/60">
                <Music2 size={14} className="text-[#75d283]" />
                <span>Made for a generation on fire</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* 11. YOUTH JOIN FELLOWSHIP MODAL                                */}
      {/* ------------------------------------------------------------- */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#211566] text-white p-6 relative">
              <button
                type="button"
                onClick={() => {
                  setIsJoinModalOpen(false);
                  setJoinSuccessBanner(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-[#8fe09a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Join the Glorious Youth Family</h3>
                  <p className="text-xs text-white/70">
                    Connect, get mentored, and step boldly into kingdom purpose
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {joinSuccessBanner ? (
                <div className="p-6 rounded-2xl bg-[#e9f2e5] border border-[#cbe0c5] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#4dbb62] text-white mx-auto flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-[#211566]">Hallelujah!</h4>
                  <p className="text-sm text-[#625d6b]">{joinSuccessBanner}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsJoinModalOpen(false);
                      setJoinSuccessBanner(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#211566] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#16103e] transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={joinFullName}
                      onChange={(e) => setJoinFullName(e.target.value)}
                      placeholder="e.g. Daniel Osei"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4dbb62] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={joinEmail}
                        onChange={(e) => setJoinEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4dbb62] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        WhatsApp / Phone
                      </label>
                      <input
                        type="tel"
                        value={joinPhone}
                        onChange={(e) => setJoinPhone(e.target.value)}
                        placeholder="+234..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4dbb62] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Youth Category
                      </label>
                      <select
                        value={joinCategory}
                        onChange={(e) => setJoinCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4dbb62] text-sm bg-white"
                      >
                        <option value="Young Professional">Young Professional</option>
                        <option value="Undergraduate">Undergraduate Student</option>
                        <option value="Teenager / Secondary">Teenager / Secondary</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Corps Member / NYSC">Corps Member</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Primary Interest
                      </label>
                      <select
                        value={joinInterest}
                        onChange={(e) => setJoinInterest(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4dbb62] text-sm bg-white"
                      >
                        <option value="Youth Leadership & Mentorship">Leadership &amp; Mentorship</option>
                        <option value="Worship & Creative Arts">Worship &amp; Creative Arts</option>
                        <option value="Evangelism & Community Outreach">Evangelism &amp; Outreach</option>
                        <option value="Media & Technology Ministry">Media &amp; Tech</option>
                        <option value="Prayer & Intercession">Prayer &amp; Intercession</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmittingJoin}
                      className="w-full py-3.5 rounded-full bg-[#4dbb62] hover:bg-[#65ce75] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#4dbb62]/25 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmittingJoin
                          ? 'Connecting & Alerting Youth Officials...'
                          : 'Submit & Connect with Youth Leaders'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
