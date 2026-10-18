import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  youthAlbums,
  ProgramAlbum,
  GalleryPhoto
} from '../data/youthGalleryData';
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
  Film
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
  const [currentAlbumId, setCurrentAlbumId] = useState<string>(initialAlbumId);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [slideSpeed, setSlideSpeed] = useState<number>(4500); // 4.5 seconds
  const [isMotionZoomActive, setIsMotionZoomActive] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Active album resolution
  const currentAlbum: ProgramAlbum =
    youthAlbums.find((a) => a.id === currentAlbumId) || youthAlbums[0];
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
        className="relative flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden min-h-[60vh] max-h-[75vh]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Blurred ambient background glow from current photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-3xl scale-125 transition-all duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${currentPhoto.src})` }}
        />

        {/* Ambient Radial Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#0d0a1f]/70 to-[#0d0a1f] pointer-events-none" />

        {/* Previous Chevron */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 z-30 p-3 rounded-full bg-black/40 hover:bg-emerald-600 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition transform hover:scale-110 shadow-xl"
          aria-label="Previous photo"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Next Chevron */}
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 z-30 p-3 rounded-full bg-black/40 hover:bg-emerald-600 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition transform hover:scale-110 shadow-xl"
          aria-label="Next photo"
        >
          <ChevronRight size={28} />
        </button>

        {/* The Motion Image Stage */}
        <div className="relative z-10 max-w-5xl w-full h-full flex flex-col items-center justify-center">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/15 bg-black/60 max-h-[62vh] aspect-[16/10] sm:aspect-[16/9] w-auto max-w-full flex items-center justify-center">
            <img
              key={currentPhoto.id}
              src={currentPhoto.src}
              alt={currentPhoto.title}
              className={`max-h-[62vh] w-auto max-w-full object-contain ${
                isMotionZoomActive
                  ? 'animate-kenburns'
                  : 'transition-opacity duration-700 ease-in-out'
              }`}
              loading="eager"
            />

            {/* Bottom floating caption overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    Photo {currentPhotoIndex + 1} of {photos.length}
                  </span>
                  {currentPhoto.photographer && (
                    <span className="text-[11px] text-white/60">
                      Captured by {currentPhoto.photographer}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white drop-shadow">
                  {currentPhoto.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-0.5">
                  {currentPhoto.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(currentPhoto)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            </div>
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
              <span>Download All 50 Photos from Drive</span>
              <ExternalLink size={14} className="opacity-70" />
            </a>
          </div>

          {/* Cards for other programs */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {youthAlbums.map((album) => {
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
                        50 Photos
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
        @keyframes kenburns-effect {
          0% {
            transform: scale(1.0) translate(0, 0);
          }
          50% {
            transform: scale(1.06) translate(-1%, -1%);
          }
          100% {
            transform: scale(1.12) translate(1%, 0.5%);
          }
        }
        .animate-kenburns {
          animation: kenburns-effect 9s ease-out infinite alternate;
        }
      `}</style>
    </div>
  );
};
