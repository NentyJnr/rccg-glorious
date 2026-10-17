import React, { useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import {
  Church,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Users,
  Video,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  X,
  Share2,
  Download,
  GraduationCap,
  Heart,
  Award,
  MessageSquare,
  HelpCircle,
  Menu
} from 'lucide-react';

export interface YouthMinistryWebsiteProps {
  onReturnToMain: () => void;
  onOpenPortal: () => void;
  parishName?: string;
}

interface LeaderPresenter {
  id: string;
  name: string;
  role: string;
  institution: string;
  imageUrl: string;
  bio: string;
  specialty: string;
}

interface ContentResource {
  id: string;
  title: string;
  category: 'modules' | 'curriculum' | 'outlines' | 'articles' | 'quest';
  categoryLabel: string;
  duration: string;
  description: string;
  fileSize?: string;
  author: string;
}

export const YouthMinistryWebsite: React.FC<YouthMinistryWebsiteProps> = ({
  onReturnToMain,
  onOpenPortal,
  parishName = 'RCCG Glorious Church'
}) => {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeEventSlide, setActiveEventSlide] = useState(0);
  const [isEventCarouselPaused, setIsEventCarouselPaused] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState<'modules' | 'curriculum' | 'outlines' | 'articles' | 'quest'>('modules');
  const [selectedLeader, setSelectedLeader] = useState<LeaderPresenter | null>(null);
  const [selectedResource, setSelectedResource] = useState<ContentResource | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Join Form State
  const [joinFullName, setJoinFullName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPhone, setJoinPhone] = useState('');
  const [joinCategory, setJoinCategory] = useState('Young Professional');
  const [joinInterest, setJoinInterest] = useState('Youth Leadership & Mentorship');
  const [joinSuccessBanner, setJoinSuccessBanner] = useState<string | null>(null);
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);

  // Newsletter Form State
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Hero Carousel Slides
  const heroSlides = [
    {
      id: 'slide-1',
      category: 'Events & Conferences',
      title: 'Spiritually Equipping Youth & Young Adults in Rapidly Changing Times',
      description:
        'We do this by providing transformative spiritual practices, self-awareness exercises, discipleship circles, and leadership development so that young believers and their communities may rise up resiliently, modeling a healthy and whole way forward for all.',
      actionText: 'Find Out More',
      actionUrl: '#events',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
      imageCaption: 'Glorious Youth Fellowship & Spiritual Formation'
    },
    {
      id: 'slide-2',
      category: 'Worship & Resources',
      title: 'Vibrant Youth Worship, Praise Nights & Spiritual Formation',
      description:
        'A new youth fellowship year begins! Explore rich spiritual toolkits designed for personal prayer, fostering youth student leadership, campus cell worship, and biblical theological grounding in the Word of God.',
      actionText: 'Explore Worship Resources',
      actionUrl: '#resources',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
      imageCaption: 'Ignite Youth Choir & Acoustic Worship Ministry'
    },
    {
      id: 'slide-3',
      category: 'Mentorship & Career',
      title: 'The Marketplace Leadership & Campus Mentorship Vanguard',
      description:
        'Bridging deep Christian spirituality with marketplace excellence. Connect with senior industry leaders, university chaplains, and tech professionals dedicated to walking with young adults across career transitions, ethics, and purposeful callings.',
      actionText: 'Meet Our Mentors',
      actionUrl: '#presenters',
      imageUrl: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=1200',
      imageCaption: 'Empowering Young Leaders for Marketplace Impact'
    }
  ];

  // Auto-advance Carousel every 6 seconds unless paused
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselPaused, heroSlides.length]);

  // Youth Gatherings & Events Slideshow Data (Text & Typography only - No images)
  const eventSlides = [
    {
      id: 'event-weekly-activity',
      type: 'weekly' as const,
      status: 'Active Ongoing Activity',
      statusBadgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      title: 'Youth Prayer & Word Fellowship',
      schedule: 'Every Wednesday • 6:00 PM GMT',
      durationTag: 'Weekly Mid-Week Discipleship',
      location: 'Main Youth Chapel & YouTube Live Stream',
      description:
        'Our core mid-week fellowship for spiritual growth and community. Experience passionate prayer sessions, transformative biblical messages, and interactive discussions that equip youths for impactful Christian living.',
      highlights: [
        'Prayer Sessions',
        'Message',
        'Discussions'
      ],
      actionLabel: 'Attend Next Wednesday',
      actionType: 'join' as const,
      isPast: false
    },
    {
      id: 'event-praise-worship-2026',
      type: 'upcoming' as const,
      status: 'Next Major Event • 3-Day Program',
      statusBadgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      title: 'Annual Youth Praise & Worship Program',
      schedule: 'Friday 16th, Saturday 17th & Sunday 18th of October 2026',
      durationTag: '3 Full Days of Revival & Prophetic Praise',
      location: 'Main Church Auditorium & Global Live Broadcast',
      description:
        'Our flagship 3-day praise and worship convergence uniting youths across cities. Experience uninterrupted prophetic praise, acoustic worship breakouts, guest ministrations, spiritual impartation, and Holy Spirit revival.',
      highlights: [
        'Fri 16th Oct: Explosive Opening Night of Prophetic Praise',
        'Sat 17th Oct: Worship Breakdown, Youth Choir & Creative Arts',
        'Sun 18th Oct: Grand Thanksgiving, Prophetic Decrees & Anointing'
      ],
      actionLabel: 'Register for 3-Day Program',
      actionType: 'join' as const,
      isPast: false
    },
    {
      id: 'event-prayer-walk',
      type: 'past' as const,
      status: 'Past Event • Annual Milestone',
      statusBadgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      title: 'Annual Youth Prayer Walk',
      schedule: 'Concluded Spiritual Milestone • Annual Tradition',
      durationTag: 'City & Campus Territorial Intercession',
      location: 'Parish Metropolis Routes & Campus Corridors',
      description:
        'A faith-charged spiritual expedition through the city streets and campus corridors. Lifting holy hands to sanctify neighborhoods, interceding for academic breakthrough, national transformation, and youth revival.',
      highlights: [
        'Territorial Intercession Across the Community',
        'Campus Revival Declarations & Student Altars',
        'Community Outreach & Compassionate Evangelism'
      ],
      actionLabel: 'Relive Highlights / Inquire',
      actionType: 'info' as const,
      isPast: true
    }
  ];

  // Auto-advance Events Slideshow every 7 seconds unless paused
  useEffect(() => {
    if (isEventCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveEventSlide((prev) => (prev + 1) % eventSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isEventCarouselPaused, eventSlides.length]);

  // Featured Presenters & Youth Mentors
  const leaders: LeaderPresenter[] = [
    {
      id: 'lead-1',
      name: 'Pastor (Dr.) Taiwo Adetunji',
      role: 'Parish Pastor & Youth Mentor',
      institution: 'RCCG Glorious Church Parish',
      imageUrl: '/dr_taiwo_adetunji.jpg',
      bio: 'Pastor (Dr.) Taiwo Adetunji has mentored generations of youth and young professionals across academic institutions and parishes worldwide, focusing on spiritual authenticity, leadership courage, and holy living.',
      specialty: 'Spiritual Formation & Kingdom Leadership'
    },
    {
      id: 'lead-2',
      name: 'Minister David Okafor',
      role: 'Youth Music Director & Worship Leader',
      institution: 'Glorious Worship Institute',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'Minister David Okafor leads contemporary praise and worship ministrations, conducting workshops for choir vocalists, campus acoustic groups, and youth worship organizers.',
      specialty: 'Creative Arts & Praise Ministration'
    },
    {
      id: 'lead-3',
      name: 'Sister Grace Usang',
      role: 'Youth Technology & Career Mentor',
      institution: 'Vatebra Enterprise Technology',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: 'Senior enterprise solution architect and youth career coach guiding university graduates and early-career youth in high-growth software engineering, product innovation, and ethical workplace leadership.',
      specialty: 'STEM Career Development & Faith at Work'
    },
    {
      id: 'lead-4',
      name: 'Pastor Oluwaseun Adeleke',
      role: 'Youth Discipleship & Biblical Educator',
      institution: 'RCCG Directorate of Christian Education',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      bio: 'Pastor Oluwaseun facilitates interactive biblical hermeneutics, doctrinal foundations, and apologetics for youth tackling modern skepticism and societal dilemmas.',
      specialty: 'Apologetics & Doctrinal Foundations'
    },
    {
      id: 'lead-5',
      name: 'Dr. Almeda M. Wright',
      role: 'Associate Professor of Youth Ministry',
      institution: 'Yale Divinity School',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      bio: 'Renowned researcher and author examining adolescent spirituality, intersectional faith development, and transformative educational practices for youth ministries.',
      specialty: 'Adolescent Faith & Holistic Flourishing'
    },
    {
      id: 'lead-6',
      name: 'Brother Kevin Nnamdi',
      role: 'Student Campus Fellowship President',
      institution: 'RCCG Campus Fellowship Network',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
      bio: 'Directs outreach initiatives and evangelistic networks across tertiary institutions, mobilizing peer-to-peer Bible study fellowships and campus prayer walks.',
      specialty: 'Peer Evangelism & Campus Cell Groups'
    },
    {
      id: 'lead-7',
      name: 'Sister Hannah Peters',
      role: 'Youth Media, Digital Content & Design',
      institution: 'Glorious Youth Media Lab',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      bio: 'Digital content producer spearheading visual storytelling, podcast series, and social media ministries that articulate timeless gospel truths through contemporary media.',
      specialty: 'Digital Storytelling & Creative Ministry'
    },
    {
      id: 'lead-8',
      name: 'Dr. Skip Masback',
      role: 'Founder & Senior Research Scholar',
      institution: 'Yale Youth Ministry Institute',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      bio: 'Scholar and non-profit leader who dedicated his life to equipping church leaders with scientific insights and theological practices for adolescent spiritual flourishing.',
      specialty: 'Youth Ministry Theory & Empirical Research'
    }
  ];

  // Resource Database
  const contentResources: ContentResource[] = [
    {
      id: 'res-1',
      title: 'Foundational Discipleship for Young Believers in the Digital Era',
      category: 'modules',
      categoryLabel: 'Training Modules',
      duration: '4-Week Self-Paced Module',
      author: 'RCCG Directorate of Christian Education',
      fileSize: '2.4 MB PDF',
      description:
        'A comprehensive 4-module video and syllabus guide equipping young Christians to cultivate private devotional life, navigate social media pressures, and defend faith gracefully.'
    },
    {
      id: 'res-2',
      title: 'Kingdom Leadership in the Marketplace & Campus Classrooms',
      category: 'modules',
      categoryLabel: 'Training Modules',
      duration: '6 Video Sessions + Study Guide',
      author: 'Vatebra Enterprise & Youth Directorate',
      fileSize: '3.8 MB PDF',
      description:
        'Practical training on ethical decision-making, professional excellence, public speaking, and leading student organizations with Christian humility and confidence.'
    },
    {
      id: 'res-3',
      title: 'Living Holy & Whole: Adolescent Mental Health & Divine Peace',
      category: 'modules',
      categoryLabel: 'Training Modules',
      duration: '3 Intensive Sessions',
      author: 'Yale Youth Ministry Institute & RCCG Welfare',
      fileSize: '1.9 MB PDF',
      description:
        'Addressing anxiety, burnout, loneliness, and identity crises through sound psychological practices integrated with biblical prayer and community accountability.'
    },
    {
      id: 'res-4',
      title: 'Annual Youth Fellowship Curriculum: Walking in Divine Dominion',
      category: 'curriculum',
      categoryLabel: 'Curriculum',
      duration: '52-Week Full Syllabus',
      author: 'Glorious Youth Ministerial Council',
      fileSize: '5.6 MB PDF',
      description:
        'Complete annual study curriculum covering systematic theology, church history, evangelism methods, Christian marriage preparation, and vocational stewardship.'
    },
    {
      id: 'res-5',
      title: 'Campus Bible Study Lesson Series: The Book of Romans',
      category: 'curriculum',
      categoryLabel: 'Curriculum',
      duration: '16-Part Discussion Series',
      author: 'Pastor Oluwaseun Adeleke',
      fileSize: '3.1 MB PDF',
      description:
        'Deep-dive verse-by-verse inductive study through Romans, unpacking justification by faith, sanctification, life in the Spirit, and Christian civil responsibility.'
    },
    {
      id: 'res-6',
      title: 'Sample Youth Service Format & Acoustic Worship Run-Sheet',
      category: 'outlines',
      categoryLabel: 'Sample Outlines',
      duration: 'Instant Template',
      author: 'Minister David Okafor',
      fileSize: '450 KB DOCX',
      description:
        'Practical templates for scheduling youth services, organizing intercessory prayer sessions, praise transitions, testimonies, and interactive sermon Q&A segments.'
    },
    {
      id: 'res-7',
      title: 'Youth Group Constitution & Leadership Transition Guidelines',
      category: 'outlines',
      categoryLabel: 'Sample Outlines',
      duration: 'Governance Handbook',
      author: 'Parish Youth Advisory Board',
      fileSize: '820 KB PDF',
      description:
        'Standard operational guidelines for nominating youth executives, managing fellowship funds transparently, and organizing safe off-site camps and retreats.'
    },
    {
      id: 'res-8',
      title: 'Cultivating Moral Courage When Peer Pressure is at Its Peak',
      category: 'articles',
      categoryLabel: 'Articles & Readings',
      duration: '8 Min Read',
      author: 'Pastor (Dr.) Taiwo Adetunji',
      fileSize: 'Web Article',
      description:
        'Biblical wisdom for refusing moral compromise in university campuses, professional offices, and modern digital spaces, grounded in the example of Daniel and Joseph.'
    },
    {
      id: 'res-9',
      title: 'The YMI Youth Quest: Annual Spiritual Retreat & Leadership Camp',
      category: 'quest',
      categoryLabel: 'The Quest Program',
      duration: '3-Day Immersive Retreat Guide',
      author: 'Youth Ministry Institute & Glorious Church',
      fileSize: '4.2 MB PDF Package',
      description:
        'An intensive outdoor camp experience bringing together teens and young adults for silent prayer vigils, campfire testimonies, career hackathons, and holy living impartations.'
    }
  ];

  const filteredResources = contentResources.filter(
    (r) => activeContentTab === 'modules' || r.category === activeContentTab
  );

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinFullName || !joinEmail || !joinPhone) return;

    setIsSubmittingJoin(true);
    try {
      const res = await api.post<any>('/Members/youth-register', {
        fullName: joinFullName.trim(),
        email: joinEmail.trim(),
        phone: joinPhone.trim(),
        category: joinCategory,
        primaryInterest: joinInterest
      });

      if (res && res.success && res.data) {
        const count = res.data.notifiedOfficials?.length || 0;
        setJoinSuccessBanner(
          `Hallelujah! Welcome ${joinFullName}. Your registration has been received and our Youth Leadership team (${count > 0 ? `${count} officials alerted` : 'Youth Coordinator'}) will reach out to you within 24 hours.`
        );
      } else {
        setJoinSuccessBanner(`Hallelujah! Welcome ${joinFullName}. Our Youth Ministry coordinator will reach out to you within 24 hours.`);
      }
    } catch (err) {
      console.warn('API sync fallback active:', err);
      setJoinSuccessBanner(`Hallelujah! Welcome ${joinFullName}. Our Youth Ministry coordinator will reach out to you within 24 hours.`);
    } finally {
      setIsSubmittingJoin(false);
      setTimeout(() => {
        setJoinFullName('');
        setJoinEmail('');
        setJoinPhone('');
        setIsJoinModalOpen(false);
        setJoinSuccessBanner(null);
      }, 4500);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterName('');
      setNewsletterEmail('');
      setNewsletterSuccess(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-900 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP AFFILIATION STRIP (Modeled after Yale University Bar)   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#002244] text-white border-b border-blue-950/40 text-[11px] font-semibold py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="text-amber-300 font-mono tracking-wider uppercase text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30">
              RCCG Worldwide
            </span>
            <span className="text-blue-100 font-medium">
              {parishName} &bull; Youth &amp; Young Adults Institute
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onReturnToMain}
              className="text-amber-300 hover:text-white transition flex items-center space-x-1.5 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Main Church Site</span>
            </button>
            <span className="text-blue-800">|</span>
            <button
              type="button"
              onClick={onOpenPortal}
              className="hover:text-emerald-300 text-blue-200 transition font-medium"
            >
              Parish CMS Portal
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN HEADER & NAVIGATION                                   */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Official Youth Logo / Brand */}
          <a href="#" className="flex items-center space-x-3 group py-1">
            <img
              src="/youth_logo.png"
              alt="RCCG Glorious Church Youths Logo"
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/youth_logo.jpg';
              }}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold text-slate-700 tracking-wide uppercase">
            <a href="#about" className="hover:text-[#00356b] transition pb-1 border-b-2 border-transparent hover:border-[#00356b]">
              About
            </a>
            <a href="#events" className="hover:text-[#00356b] transition pb-1 border-b-2 border-transparent hover:border-[#00356b]">
              Events
            </a>
            <a href="#what-we-do" className="hover:text-[#00356b] transition pb-1 border-b-2 border-transparent hover:border-[#00356b]">
              What We Do
            </a>
            <a href="#flourishing" className="hover:text-[#00356b] transition pb-1 border-b-2 border-transparent hover:border-[#00356b]">
              Flourishing Life
            </a>
            <a href="#presenters" className="hover:text-[#00356b] transition pb-1 border-b-2 border-transparent hover:border-[#00356b]">
              Presenters
            </a>
            <a href="#resources" className="hover:text-[#00356b] transition pb-1 border-b-2 border-transparent hover:border-[#00356b]">
              Resources
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#00356b] hover:bg-[#002244] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-900/10 hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              Join Fellowship
            </button>
            <button
              type="button"
              onClick={onReturnToMain}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Return to Main Parish Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-4 shadow-xl">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <img
                src="/youth_logo.png"
                alt="RCCG Glorious Church Youths"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/youth_logo.jpg';
                }}
              />
              <span className="text-[10px] font-mono uppercase bg-blue-50 text-[#00356b] px-2.5 py-0.5 rounded-full font-bold">
                Glorious Youths
              </span>
            </div>
            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-700 uppercase">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#00356b] py-1 border-b border-slate-100"
              >
                About Us &amp; Mission
              </a>
              <a
                href="#events"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#00356b] py-1 border-b border-slate-100"
              >
                Youth Events &amp; Summits
              </a>
              <a
                href="#what-we-do"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#00356b] py-1 border-b border-slate-100"
              >
                What We Do
              </a>
              <a
                href="#flourishing"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#00356b] py-1 border-b border-slate-100"
              >
                The Flourishing Life Project
              </a>
              <a
                href="#presenters"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#00356b] py-1 border-b border-slate-100"
              >
                Meet Our Presenters &amp; Mentors
              </a>
              <a
                href="#resources"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#00356b] py-1 border-b border-slate-100"
              >
                Learning &amp; Resources
              </a>
            </nav>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsJoinModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-[#00356b] text-white font-black text-xs uppercase tracking-wider"
              >
                Join Youth Fellowship
              </button>
              <button
                type="button"
                onClick={onReturnToMain}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Church Website</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. HERO SPOTLIGHT CAROUSEL (Direct from Reference Design)     */}
      {/* ------------------------------------------------------------- */}
      <section
        className="relative bg-slate-100/70 py-8 sm:py-12 px-4 sm:px-8 border-b border-slate-200"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="max-w-7xl mx-auto">
          {/* Main Slide Card */}
          <div className="bg-white rounded-3xl sm:rounded-[32px] border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px] transition-all duration-500">
            {/* Left Content Column (approx 38%) */}
            <div className="lg:col-span-5 p-7 sm:p-12 flex flex-col justify-between space-y-6 bg-white z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#00356b] text-[11px] font-mono font-bold uppercase tracking-wider border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{heroSlides[activeHeroSlide].category}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#00356b] tracking-tight leading-tight">
                  {heroSlides[activeHeroSlide].title}
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                  {heroSlides[activeHeroSlide].description}
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={heroSlides[activeHeroSlide].actionUrl}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-slate-300 hover:border-[#00356b] bg-white hover:bg-[#00356b] text-[#00356b] hover:text-white font-black text-xs uppercase tracking-wider shadow-sm transition duration-300"
                >
                  {heroSlides[activeHeroSlide].actionText}
                </a>

                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition"
                >
                  Connect With Us
                </button>
              </div>
            </div>

            {/* Right Photo Column (approx 62%) */}
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-full bg-slate-900 overflow-hidden">
              <img
                src={heroSlides[activeHeroSlide].imageUrl}
                alt={heroSlides[activeHeroSlide].title}
                className="w-full h-full object-cover transition duration-700 transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

              {/* Official Youth Logo Watermark Badge */}
              <div className="absolute top-6 right-6 p-2 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/60 flex items-center">
                <img
                  src="/youth_logo.png"
                  alt="RCCG Glorious Church Youths"
                  className="h-7 sm:h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/youth_logo.jpg';
                  }}
                />
              </div>

              {/* Caption Tag */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-medium backdrop-blur-md bg-slate-900/60 p-3.5 rounded-2xl border border-white/20">
                {heroSlides[activeHeroSlide].imageCaption}
              </div>
            </div>
          </div>

          {/* Carousel Navigation Indicators & Controls */}
          <div className="mt-6 flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHeroSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeHeroSlide === idx
                      ? 'w-10 bg-[#00356b]'
                      : 'w-3 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() =>
                  setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
                }
                className="p-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-sm transition"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)
                }
                className="p-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-sm transition"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. THE YOUTH MINISTRY MISSION BANNER (Elementor a7b94fb)      */}
      {/* ------------------------------------------------------------- */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-8 bg-white text-center border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-xs inline-flex items-center">
              <img
                src="/youth_logo.png"
                alt="RCCG Glorious Church Youths Mandate"
                className="h-12 sm:h-14 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/youth_logo.jpg';
                }}
              />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-mono font-bold tracking-wider uppercase border border-amber-200">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>OUR CORE DIVINE MANDATE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00356b] tracking-tight">
            A Vibrant Generation Anchored in Christ
          </h2>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            At <strong className="text-[#00356b] font-bold">RCCG Glorious Youth Ministry</strong>, our heartbeat is to build a passionate community where youths are grounded in the Word, empowered by the Holy Spirit, and equipped for global relevance. We build leaders, ignite visions, and champion a lifestyle of uncompromising holiness.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-[#00356b] hover:bg-[#002244] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
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
              className="px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider border border-slate-200 shadow-xs transition-all"
            >
              YOUTH FELLOWSHIP SCHEDULE
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. WHAT WE DO (3-Pillar Cards - Elementor ca2f651)             */}
      {/* ------------------------------------------------------------- */}
      <section id="what-we-do" className="py-16 sm:py-20 px-4 sm:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#00356b] tracking-tight">
              What We Do
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Our 3-pillar ecosystem equips young believers to lead holy, purpose-driven lives in spiritual depth, intellectual rigor, and vocational mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: We Conduct Scholarship */}
            <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
                    alt="Youth Ministry Scholarship"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs font-mono font-bold uppercase text-white bg-blue-900/80 px-3 py-1 rounded-full border border-white/20">
                    Pillar 01
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <h3 className="text-xl font-black text-[#00356b] group-hover:text-blue-700 transition">
                    We Conduct Scholarship
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Our scholarship includes conducting, funding, and publishing original research into the theory and practice of youth ministry, and convening meetings of scholars, youth workers, and pastors in theology, Bible study, and adolescent flourishing.
                  </p>
                </div>
              </div>

              <div className="p-7 pt-0">
                <a
                  href="#resources"
                  className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#00356b] hover:text-blue-800 transition space-x-1"
                >
                  <span>Find Out More</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Pillar 2: We Resource Youth Ministries */}
            <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
                    alt="Resources for Youth Leaders"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs font-mono font-bold uppercase text-white bg-emerald-900/80 px-3 py-1 rounded-full border border-white/20">
                    Pillar 02
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <h3 className="text-xl font-black text-[#00356b] group-hover:text-emerald-700 transition">
                    We Resource Youth Ministries
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Our resources include curricular materials, program modules, communication templates, “best practices” exemplars and guides for developing youth ministry mission statements, schedules, and sample sermon outlines.
                  </p>
                </div>
              </div>

              <div className="p-7 pt-0">
                <a
                  href="#resources"
                  className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#00356b] hover:text-emerald-800 transition space-x-1"
                >
                  <span>Find Out More</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Pillar 3: We Equip Leaders */}
            <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800"
                    alt="Youth Leadership Training"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs font-mono font-bold uppercase text-white bg-amber-900/80 px-3 py-1 rounded-full border border-white/20">
                    Pillar 03
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <h3 className="text-xl font-black text-[#00356b] group-hover:text-amber-700 transition">
                    We Equip Leaders
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Our training programs include monthly seminars, summer symposia, web courses, Bible study for student leaders, interdisciplinary toolkits, and an online library of video lectures featuring seasoned pastors and scholars.
                  </p>
                </div>
              </div>

              <div className="p-7 pt-0">
                <a
                  href="#presenters"
                  className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#00356b] hover:text-amber-800 transition space-x-1"
                >
                  <span>Find Out More</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. THE FLOURISHING LIFE PROJECT (Elementor 96c73d5)           */}
      {/* ------------------------------------------------------------- */}
      <section id="flourishing" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#00356b] text-xs font-mono font-bold uppercase tracking-wider border border-blue-200">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Flagship Youth Initiative</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00356b] tracking-tight">
              The Flourishing Life Project
            </h2>

            <p className="text-slate-600 text-base leading-relaxed font-normal">
              The YMI Flourishing Life Project was inspired by a deep concern for the complex spiritual, academic, and mental hurdles befalling our youth and campuses today. 
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Over 100 practical theologians, pastors, and youth workers from around the world have collaborated to conduct foundational research, publish monographs, host regional symposia, and develop 3 comprehensive sets of curricular modules and supporting resources. The RCCG Glorious Youth Ministry is honored to deploy the fruits of their labors on this platform.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveContentTab('modules');
                  const el = document.getElementById('resources');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3 rounded-full bg-[#00356b] hover:bg-[#002244] text-white text-xs font-black uppercase tracking-wider shadow-md transition"
              >
                Access Curricular Modules
              </button>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="px-7 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition"
              >
                Participate in Fellowship
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900"
                alt="Flourishing Youth Community"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002244]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-medium backdrop-blur-md bg-white/10 p-4 rounded-2xl border border-white/20">
                Spiritual growth, mental wellbeing &amp; student leadership roundtables.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. MEET OUR PRESENTERS & MENTORS (Elementor 0a26257)          */}
      {/* ------------------------------------------------------------- */}
      <section id="presenters" className="py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider border border-amber-200 mb-2">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Mentors, Speakers &amp; Ministers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#00356b] tracking-tight">
                Meet Our Presenters
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsJoinModalOpen(true)}
              className="px-6 py-2.5 rounded-full border border-slate-300 hover:border-[#00356b] bg-white text-[#00356b] hover:bg-[#00356b] hover:text-white text-xs font-black uppercase tracking-wider transition"
            >
              Request a Youth Mentor
            </button>
          </div>

          {/* 8-Profile Circular Avatar Grid (Exact Elementor loop-grid 13402) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {leaders.map((leader) => (
              <div
                key={leader.id}
                onClick={() => setSelectedLeader(leader)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                {/* Circular Portrait with Negative Margin Layout */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md group-hover:border-[#00356b] transition mb-4">
                  <img
                    src={leader.imageUrl}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#00356b] group-hover:text-blue-700 transition leading-snug">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">
                      {leader.role}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 mt-3">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                      {leader.institution}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. EXPLORE OUR CONTENT (Elementor 46a1263)                     */}
      {/* ------------------------------------------------------------- */}
      <section id="resources" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#00356b] tracking-tight">
              Explore Our Content
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Curated modules, training curriculum, and discussion outlines engineered to empower youth fellowships, campus cells, and individual discipleship.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
            {[
              { id: 'modules', label: 'Training Modules' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'outlines', label: 'Sample Materials & Outlines' },
              { id: 'articles', label: 'Articles & Readings' },
              { id: 'quest', label: 'The Quest Program' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveContentTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition ${
                  activeContentTab === tab.id
                    ? 'bg-[#00356b] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-lg transition duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                    <span className="uppercase text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
                      {item.categoryLabel}
                    </span>
                    <span>{item.duration}</span>
                  </div>

                  <h3 className="text-lg font-black text-[#00356b] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center justify-between">
                  <div className="text-[11px] font-medium text-slate-500">
                    By {item.author}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedResource(item)}
                    className="p-2 rounded-xl bg-white hover:bg-[#00356b] text-[#00356b] hover:text-white border border-slate-300 transition shadow-sm"
                    title="View Resource Details"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. YOUTH FELLOWSHIP SCHEDULE / EVENTS SLIDESHOW SECTION       */}
      {/* ------------------------------------------------------------- */}
      <section
        id="events"
        className="py-16 sm:py-24 px-4 sm:px-8 bg-slate-900 text-white relative overflow-hidden"
        onMouseEnter={() => setIsEventCarouselPaused(true)}
        onMouseLeave={() => setIsEventCarouselPaused(false)}
      >
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Section Header with Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-400/30 mb-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Youth Gatherings &amp; Events Calendar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Upcoming Youth Gatherings &amp; Programs
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-1 font-normal">
                An interactive slideshow of our weekly discipleship rhythm, flagship 3-day annual revival summit, and milestone youth gatherings.
              </p>
            </div>

            {/* Slideshow Controls & Primary Register Action */}
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-full">
                <button
                  type="button"
                  onClick={() =>
                    setActiveEventSlide((prev) => (prev === 0 ? eventSlides.length - 1 : prev - 1))
                  }
                  className="p-1.5 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  aria-label="Previous Gathering"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs font-bold text-slate-300 px-1">
                  0{activeEventSlide + 1} / 0{eventSlides.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveEventSlide((prev) => (prev + 1) % eventSlides.length)
                  }
                  className="p-1.5 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  aria-label="Next Gathering"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
              >
                Register for Next Fellowship
              </button>
            </div>
          </div>

          {/* Active Event Slide Card (Spotlight Showcase - Pure Typography & Design, No Images) */}
          {(() => {
            const currentEvent = eventSlides[activeEventSlide];
            return (
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-800/95 via-slate-800/70 to-slate-900 border border-slate-700/80 p-6 sm:p-10 shadow-2xl transition-all duration-300">
                {/* Meta Top Line */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border ${currentEvent.statusBadgeColor}`}>
                      {currentEvent.status}
                    </span>
                    {currentEvent.isPast && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-700/90 text-slate-300 text-[10px] font-mono uppercase font-semibold">
                        Concluded
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Auto-advancing Slide {activeEventSlide + 1} of {eventSlides.length}</span>
                  </div>
                </div>

                {/* Main Content Info */}
                <div className="pt-6 space-y-6">
                  <div className="space-y-1.5">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                      {currentEvent.title}
                    </h3>
                    <p className="text-emerald-400 text-xs sm:text-sm font-mono uppercase font-bold tracking-wider">
                      {currentEvent.durationTag}
                    </p>
                  </div>

                  {/* Schedule & Location Pills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                          Schedule &amp; Dates
                        </div>
                        <div className="text-sm sm:text-base font-bold text-white">
                          {currentEvent.schedule}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                          Meeting Location / Broadcast
                        </div>
                        <div className="text-sm sm:text-base font-bold text-white">
                          {currentEvent.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Narrative Body */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
                    {currentEvent.description}
                  </p>

                  {/* 3 Key Highlights */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Program Highlights &amp; Sessions
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentEvent.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 flex items-start space-x-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-700/60">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsJoinModalOpen(true)}
                        className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        {currentEvent.actionLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('footer');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700 transition"
                      >
                        Contact Youth Executives
                      </button>
                    </div>

                    {/* Interactive Slide Dots */}
                    <div className="flex items-center space-x-2">
                      {eventSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveEventSlide(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            activeEventSlide === idx
                              ? 'w-8 bg-emerald-400'
                              : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                          }`}
                          aria-label={`Switch to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Interactive Event Selector Cards (Click any card to jump directly to slide) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {eventSlides.map((slide, idx) => {
              const isActive = activeEventSlide === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveEventSlide(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 border-emerald-400 shadow-xl shadow-emerald-500/10 -translate-y-1'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${slide.statusBadgeColor}`}>
                        {slide.type === 'upcoming'
                          ? 'Next Event'
                          : slide.type === 'weekly'
                          ? 'Weekly'
                          : 'Past Event'}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <h4 className={`text-sm font-bold leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {slide.title}
                    </h4>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 line-clamp-1 border-t border-slate-700/50 pt-2">
                    {slide.schedule}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. COMPREHENSIVE FOOTER (Elementor 8677)                      */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-[#002244] text-white pt-16 pb-8 border-t border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Column 1: Parish Identity (col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="inline-block bg-white p-2.5 rounded-2xl shadow-lg border border-white/20">
                <img
                  src="/youth_logo.png"
                  alt="RCCG Glorious Church Youths"
                  className="h-10 sm:h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/youth_logo.jpg';
                  }}
                />
              </div>
              <p className="text-blue-100/80 text-xs leading-relaxed">
                Nurturing a generation of uncompromising believers grounded in spiritual excellence, moral courage, and impactful kingdom leadership.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onReturnToMain}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Main Church Site</span>
                </button>
              </div>
            </div>

            {/* Column 2: Navigation Links (col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-2">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-blue-100 font-medium">
                <li><a href="#about" className="hover:text-white transition">About &amp; Mission Statement</a></li>
                <li><a href="#events" className="hover:text-white transition">Youth Events &amp; Vigil Nights</a></li>
                <li><a href="#resources" className="hover:text-white transition">Curriculum &amp; Study Outlines</a></li>
                <li><a href="#presenters" className="hover:text-white transition">Youth Leadership &amp; Mentors</a></li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="hover:text-white transition text-left text-emerald-300 font-bold"
                  >
                    Join Glorious Youth Fellowship &rarr;
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Newsletter (col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-2">
                Glorious Youth Pulse
              </h4>
              <p className="text-blue-100/80 text-xs leading-relaxed">
                Subscribe to our weekly youth devotional, event alerts, and mentorship articles.
              </p>

              {newsletterSuccess ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed successfully to Youth Pulse!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-blue-950/60 border border-blue-900 text-white placeholder-blue-300/50 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-blue-950/60 border border-blue-900 text-white placeholder-blue-300/50 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow"
                  >
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>

            {/* Column 4: Follow Us & Social Media (col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-2">
                Follow Us
              </h4>
              <p className="text-blue-100/80 text-xs leading-relaxed">
                Join our conversations, reels, and video teachings across our digital channels.
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-800 text-white flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-900/60 hover:bg-rose-600 border border-blue-800 text-white flex items-center justify-center transition"
                  aria-label="YouTube"
                >
                  <Video className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-900/60 hover:bg-pink-600 border border-blue-800 text-white flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <Sparkles className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-blue-200/80 text-[11px] gap-4 font-medium">
            <div>
              &copy; {new Date().getFullYear()} Glorious Youth Ministry &bull; {parishName} &bull; RCCG Worldwide.
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={onReturnToMain} className="hover:text-white transition">
                Main Parish Website
              </button>
              <span>&bull;</span>
              <button onClick={onOpenPortal} className="hover:text-white transition">
                CMS Portal
              </button>
              <span>&bull;</span>
              <a href="https://rccg.org" target="_blank" rel="noreferrer" className="hover:text-white transition">
                RCCG.org
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* 11. PRESENTER / LEADER BIO MODAL                              */}
      {/* ------------------------------------------------------------- */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setSelectedLeader(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-md shrink-0">
                <img
                  src={selectedLeader.imageUrl}
                  alt={selectedLeader.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[11px] font-mono font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                  {selectedLeader.institution}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#00356b]">
                  {selectedLeader.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {selectedLeader.role}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                About &amp; Ministry Scope
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {selectedLeader.bio}
              </p>
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs font-medium text-[#00356b]">
                <strong>Primary Specialty:</strong> {selectedLeader.specialty}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 12. RESOURCE DETAILS & DOWNLOAD MODAL                         */}
      {/* ------------------------------------------------------------- */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                {selectedResource.categoryLabel}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#00356b]">
                {selectedResource.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Author: {selectedResource.author} &bull; {selectedResource.duration}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedResource.description}
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between text-xs font-semibold text-emerald-950">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Format: {selectedResource.fileSize || 'Digital Syllabus'}</span>
              </div>
              <span className="text-[11px] uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                Free Access
              </span>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="px-5 py-2.5 rounded-xl text-slate-600 font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Thank you for accessing "${selectedResource.title}". Downloading resource package...`);
                  setSelectedResource(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#00356b] hover:bg-[#002244] text-white font-black text-xs uppercase tracking-wider shadow-md transition flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Material</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 13. JOIN YOUTH FELLOWSHIP / CONNECT MODAL                     */}
      {/* ------------------------------------------------------------- */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <img
                  src="/youth_logo.png"
                  alt="RCCG Glorious Church Youths"
                  className="h-9 sm:h-10 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/youth_logo.jpg';
                  }}
                />
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Glorious Youths
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#00356b]">
                Join Youth Fellowship
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Connect with young believers, campus networks, and spiritual mentors.
              </p>
            </div>

            {joinSuccessBanner ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold leading-relaxed">
                {joinSuccessBanner}
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={joinFullName}
                    onChange={(e) => setJoinFullName(e.target.value)}
                    placeholder="e.g. Samuel Adeyemi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#00356b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      placeholder="samuel@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#00356b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      required
                      value={joinPhone}
                      onChange={(e) => setJoinPhone(e.target.value)}
                      placeholder="+234 801 234 5678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#00356b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status / Age Category</label>
                    <select
                      value={joinCategory}
                      onChange={(e) => setJoinCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#00356b] bg-white"
                    >
                      <option value="Undergraduate Student">Undergraduate Student</option>
                      <option value="Postgraduate Student">Postgraduate Student</option>
                      <option value="Young Professional">Young Professional</option>
                      <option value="Entrepreneur / Creative">Entrepreneur / Creative</option>
                      <option value="Teenager (13-19)">Teenager (13-19)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Interest</label>
                    <select
                      value={joinInterest}
                      onChange={(e) => setJoinInterest(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#00356b] bg-white"
                    >
                      <option value="Youth Leadership & Mentorship">Youth Leadership &amp; Mentorship</option>
                      <option value="Choir & Music Ministration">Choir &amp; Music Ministration</option>
                      <option value="Media & Creative Tech">Media &amp; Creative Tech</option>
                      <option value="Campus Evangelism & Missions">Campus Evangelism &amp; Missions</option>
                      <option value="Career & Business Networking">Career &amp; Business Networking</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmittingJoin}
                    className="w-full py-3 rounded-xl bg-[#00356b] hover:bg-[#002244] text-white font-black text-xs uppercase tracking-wider shadow-md transition disabled:opacity-60 flex items-center justify-center space-x-2"
                  >
                    {isSubmittingJoin ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Connecting &amp; Notifying Officials...</span>
                      </>
                    ) : (
                      <span>Submit &amp; Connect</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
