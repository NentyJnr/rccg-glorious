import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  youthAlbums,
  ProgramAlbum,
  GalleryPhoto
} from '../data/youthGalleryData';
import { api, API_BASE_URL } from '../services/apiClient';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Images,
  Sparkles,
  Share2,
  Check,
  Film,
  Info
} from 'lucide-react';

export interface YouthProgramGalleryProps {
  initialAlbumId?: string;
  onClose: () => void;
  onSelectAlbum?: (albumId: string) => void;
}

export const YouthProgramGallery: React.FC<YouthProgramGalleryProps> = ({
  initialAlbumId = 'awake-3-0',
  onClose,
  onSelectAlbum
}) => {
  const [allAlbums, setAllAlbums] = useState<ProgramAlbum[]>(youthAlbums);
  const [currentAlbumId, setCurrentAlbumId] = useState<string>(initialAlbumId);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [slideSpeed, setSlideSpeed] = useState<number>(4500); // 4.5 seconds
  const [isMotionZoomActive, setIsMotionZoomActive] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCaption, setShowCaption] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Fetch dynamic albums from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicAlbums() {
      try {
        const res = await api.get<any[]>('Events');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const baseHost = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
          const formatUrl = (u: string) => (!u ? '' : (u.startsWith('http://') || u.startsWith('https://') ? u : `${baseHost}${u.startsWith('/') ? '' : '/'}${u}`));
          const dynamicAlbums: ProgramAlbum[] = [];

          for (const ev of res.data) {
            if (ev.photos && ev.photos.length > 0) {
              dynamicAlbums.push({
                id: ev.id,
                title: ev.title,
                shortTitle: ev.title.length > 20 ? ev.title.slice(0, 18) + '...' : ev.title,
                tag: ev.category || 'Parish Event',
                date: ev.eventDate ? new Date(ev.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Gathering',
                coverImage: formatUrl(ev.coverImageUrl || ev.photos[0].photoUrl),
                description: ev.description || `High-impact moments and kingdom encounters from ${ev.title}.`,
                externalDriveUrl: 'https://drive.google.com',
                photos: ev.photos.map((p: any, idx: number) => ({
                  id: p.id || `photo-${idx}`,
                  src: formatUrl(p.photoUrl),
                  thumbnail: formatUrl(p.thumbnailUrl || p.photoUrl),
                  title: p.caption || ev.title,
                  caption: p.caption || ev.title,
                  photographer: p.photographer || 'RCCG Glorious Media'
                }))
              });
            }
          }

          if (dynamicAlbums.length > 0 && isMounted) {
            const existingWithoutDynamic = youthAlbums.filter(
              (ya) => !dynamicAlbums.some((da) => da.id === ya.id || da.title.toLowerCase() === ya.title.toLowerCase())
            );
            setAllAlbums([...dynamicAlbums, ...existingWithoutDynamic]);
          }
        }
      } catch (err) {
        console.warn('[YouthProgramGallery] Dynamic gallery fetch fallback to seed:', err);
      }
    }
    loadDynamicAlbums();
    return () => { isMounted = false; };
  }, []);

  // Active album resolution
  const currentAlbum: ProgramAlbum =
    allAlbums.find((a) => a.id === currentAlbumId) || allAlbums[0];
  const photos = currentAlbum.photos;
  const currentPhoto: GalleryPhoto = photos[currentPhotoIndex] || photos[0];

  // Sync if initialAlbumId prop changes
  useEffect(() => {
    if (initialAlbumId && initialAlbumId !== currentAlbumId) {
      setCurrentAlbumId(initialAlbumId);
      setCurrentPhotoIndex(0);
    }
  }, [initialAlbumId]);

  // Handle album change
  const handleSwitchAlbum = (albumId: string) => {
    setCurrentAlbumId(albumId);
    setCurrentPhotoIndex(0);
    if (onSelectAlbum) {
      onSelectAlbum(albumId);
    }
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Next / Previous navigation
  const handleNext = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Slideshow auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, slideSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, slideSpeed, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen, onClose]);

  // Keep active thumbnail scrolled into view in the filmstrip
  useEffect(() => {
    if (!filmstripRef.current) return;
    const activeThumb = filmstripRef.current.children[currentPhotoIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentPhotoIndex]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreenchange
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Download photo handler
  const handleDownload = async (photo: GalleryPhoto) => {
    setIsDownloading(true);
    try {
      const response = await fetch(photo.src, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentAlbum.shortTitle.toLowerCase().replace(/\s+/g, '_')}_photo_${currentPhotoIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: Open in new tab so user can right-click / long-press save
      window.open(photo.src, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy album link
  const handleShare = () => {
    const url = window.location.href.split('#')[0] + `#gallery-${currentAlbum.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0d0a1f] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white"
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP COMMAND BAR                                               */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#130e2e]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back button & Album info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-emerald-600 hover:text-white text-xs font-semibold text-white/90 transition shadow-xs"
              title="Return to youth website"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Youth Home</span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="border-l border-white/20 pl-3">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentAlbum.tag}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
                {currentAlbum.title}
              </h1>
            </div>
          </div>

          {/* Right actions: Counter, Slide controls, Fullscreen & Download */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Photo Counter */}
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80">
              <span className="text-emerald-400 font-bold">
                {currentPhotoIndex + 1}
              </span>
              <span className="text-white/40"> / {photos.length} Photos</span>
            </div>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`p-2 rounded-full border transition flex items-center justify-center ${
                isPlaying
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
              }`}
              title={isPlaying ? 'Pause Motion Slideshow' : 'Start Motion Slideshow'}
              aria-label={isPlaying ? 'Pause Motion' : 'Play Motion'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            {/* Speed toggle */}
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-[11px] font-medium">
              {[
                { label: '3s', val: 3000 },
                { label: '4.5s', val: 4500 },
                { label: '6s', val: 6000 }
              ].map((speed) => (
                <button
                  key={speed.val}
                  onClick={() => setSlideSpeed(speed.val)}
                  className={`px-2.5 py-1 rounded-full transition ${
                    slideSpeed === speed.val
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>

            {/* Motion Zoom Toggle */}
            <button
              onClick={() => setIsMotionZoomActive((m) => !m)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                isMotionZoomActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
              }`}
              title="Toggle cinematic slow-drift motion effect"
            >
              <Sparkles size={14} />
              <span>Motion {isMotionZoomActive ? 'ON' : 'OFF'}</span>
            </button>

            {/* Download single photo */}
            <button
              onClick={() => handleDownload(currentPhoto)}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-emerald-500 text-white text-xs font-semibold transition border border-white/10"
              title="Download this high-resolution photo"
            >
              <Download size={14} className={isDownloading ? 'animate-bounce' : ''} />
              <span className="hidden sm:inline">Save Photo</span>
            </button>

            {/* External Google Drive Full Archive Link */}
            <a
              href={currentAlbum.externalDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              title="Open the cloud drive folder to view and download all uncompressed 50+ photos"
            >
              <ExternalLink size={14} />
              <span className="hidden md:inline">Full Archive Drive</span>
              <span className="md:hidden">Drive</span>
            </a>

            {/* Toggle Caption Info Bar */}
            <button
              onClick={() => setShowCaption((s) => !s)}
              className={`p-2 rounded-full border transition ${
                showCaption
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
              }`}
              title={showCaption ? 'Hide photo caption bar' : 'Show photo caption bar'}
              aria-label="Toggle caption bar"
            >
              <Info size={16} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition"
              title="Copy link to this program album"
            >
              {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Slideshow Progress Bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
            <div
              key={currentPhotoIndex}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300"
              style={{
                animation: `progress-fill ${slideSpeed}ms linear`
              }}
            />
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN MOTION STAGE                                             */}
      {/* ------------------------------------------------------------- */}
      <main
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-[62vh] max-h-[82vh]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Blurred ambient background glow from current photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-3xl scale-125 transition-all duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${currentPhoto.src})` }}
        />

        {/* Ambient Radial Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#0d0a1f]/75 to-[#0d0a1f] pointer-events-none" />

        {/* Previous Chevron */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-emerald-600 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition transform hover:scale-110 shadow-xl"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} className="sm:w-7 sm:h-7" />
        </button>

        {/* Next Chevron */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-emerald-600 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition transform hover:scale-110 shadow-xl"
          aria-label="Next photo"
        >
          <ChevronRight size={24} className="sm:w-7 sm:h-7" />
        </button>

        {/* The Motion Image Stage - Dynamic uncropped frame supporting portrait, landscape and square */}
        <div className="relative z-10 max-w-6xl w-full h-full flex flex-col items-center justify-center px-1 sm:px-4">
          <div className="relative inline-flex flex-col items-center max-w-full rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/85 backdrop-blur-md">
            
            {/* The Image Container - NEVER crops heads, feet, or edges */}
            <div
              className={`relative flex items-center justify-center overflow-hidden max-w-full bg-black/95 ${
                isFullscreen
                  ? showCaption ? 'max-h-[70vh] sm:max-h-[76vh]' : 'max-h-[86vh]'
                  : showCaption ? 'max-h-[54vh] sm:max-h-[62vh]' : 'max-h-[64vh] sm:max-h-[70vh]'
              }`}
            >
              <img
                key={currentPhoto.id}
                src={currentPhoto.src}
                alt={currentPhoto.title}
                className={`w-auto max-w-full object-contain block select-none ${
                  isFullscreen
                    ? showCaption ? 'max-h-[70vh] sm:max-h-[76vh]' : 'max-h-[86vh]'
                    : showCaption ? 'max-h-[54vh] sm:max-h-[62vh]' : 'max-h-[64vh] sm:max-h-[70vh]'
                } ${
                  isMotionZoomActive
                    ? 'animate-subtle-motion'
                    : 'transition-opacity duration-700 ease-in-out'
                }`}
                loading="eager"
              />
            </div>

            {/* Bottom Info & Action Bar - Dedicated space underneath photo, ZERO overlay obstruction */}
            {showCaption && (
              <div className="w-full bg-[#130e2e]/95 border-t border-white/10 px-4 py-2.5 sm:px-6 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-white">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                      Photo {currentPhotoIndex + 1} of {photos.length}
                    </span>
                    {currentPhoto.photographer && (
                      <span className="text-[11px] text-white/60 truncate">
                        Captured by {currentPhoto.photographer}
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                    {currentPhoto.title}
                  </h2>
                  {currentPhoto.caption && (
                    <p className="text-xs text-white/75 line-clamp-1 mt-0.5">
                      {currentPhoto.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDownload(currentPhoto)}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition transform hover:scale-105 active:scale-95"
                    title="Download this photo"
                  >
                    <Download size={13} className={isDownloading ? 'animate-bounce' : ''} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 50-PHOTO FILMSTRIP THUMBNAILS CAROUSEL                         */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-20 bg-[#130e2e]/95 border-t border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-white/90">
              <Film size={14} className="text-emerald-400" />
              <span>50 High-Resolution Photos — Scroll or Click any image</span>
            </span>
            <span className="text-[11px] text-white/50">
              Tip: Press Space to pause, Left/Right arrows to flip
            </span>
          </div>

          <div
            ref={filmstripRef}
            className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-white/5 scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {photos.map((p, idx) => {
              const isSelected = idx === currentPhotoIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentPhotoIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative shrink-0 rounded-lg overflow-hidden transition-all transform ${
                    isSelected
                      ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#130e2e] scale-105 opacity-100 z-10'
                      : 'opacity-50 hover:opacity-90 hover:scale-100'
                  }`}
                  style={{ width: '74px', height: '52px' }}
                  title={`Jump to photo ${idx + 1}: ${p.title}`}
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-black text-white bg-black/70 px-1 rounded">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* IN-PAGE PROGRAM BROWSER: VIEW OTHER ALBUMS & CLOUD DOWNLOADS   */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-20 bg-[#0e0a22] border-t border-white/15 px-4 py-8 sm:px-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                <Images size={14} />
                <span>Explore Other Program Albums</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                More Scenes from the Journey
              </h2>
              <p className="text-sm text-white/70 max-w-xl mt-1">
                Click any program below to switch the motion slider, or access the full high-resolution cloud drive archive to download original uncompressed photos.
              </p>
            </div>

            <a
              href={currentAlbum.externalDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/40 transition shrink-0"
            >
              <Download size={16} />
              <span>Download Archive from Drive</span>
              <ExternalLink size={14} className="opacity-70" />
            </a>
          </div>

          {/* Cards for other programs */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {allAlbums.map((album) => {
              const isCurrent = album.id === currentAlbumId;
              return (
                <div
                  key={album.id}
                  onClick={() => handleSwitchAlbum(album.id)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 text-left ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/20 bg-emerald-950/30'
                      : 'border-white/10 hover:border-emerald-400/60 bg-white/5 hover:bg-white/10 hover:-translate-y-1'
                  }`}
                >
                  {/* Thumbnail / Cover */}
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Active Badge */}
                    {isCurrent ? (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-black shadow-md flex items-center gap-1">
                        <Check size={10} strokeWidth={3} />
                        Active
                      </span>
                    ) : (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-emerald-300 border border-emerald-400/30 backdrop-blur-xs">
                        {album.photos.length} Photos
                      </span>
                    )}

                    <span className="absolute bottom-2 left-2.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {album.tag}
                    </span>
                  </div>

                  {/* Album Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                      {album.title}
                    </h3>
                    <p className="text-[11px] text-white/60 line-clamp-2 mt-1 leading-relaxed">
                      {album.description}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/5">
                      <span>{album.date}</span>
                      <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5">
                        {isCurrent ? 'Viewing' : 'Slide View'} →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Style for Keyframes */}
      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes subtle-motion-effect {
          0% {
            transform: scale(1.0);
          }
          50% {
            transform: scale(1.015);
          }
          100% {
            transform: scale(1.0);
          }
        }
        .animate-subtle-motion {
          animation: subtle-motion-effect 10s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};
