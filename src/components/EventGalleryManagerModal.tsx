import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api, API_BASE_URL } from '../services/apiClient';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Star,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Loader2,
  Maximize2,
  Camera,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export interface EventPhoto {
  id: string;
  parishEventId: string;
  photoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  photographer?: string;
  displayOrder: number;
  isCover: boolean;
  fileSizeBytes: number;
  contentType: string;
  createdAtUtc: string;
}

export interface EventGalleryManagerModalProps {
  isOpen: boolean;
  eventId: string;
  eventTitle: string;
  eventDate?: string;
  initialCoverUrl?: string;
  onClose: () => void;
  onCoverUpdated?: (newCoverUrl: string) => void;
  onPhotosChanged?: (photoCount: number) => void;
}

export const EventGalleryManagerModal: React.FC<EventGalleryManagerModalProps> = ({
  isOpen,
  eventId,
  eventTitle,
  eventDate,
  initialCoverUrl,
  onClose,
  onCoverUpdated,
  onPhotosChanged
}) => {
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [photographerCredit, setPhotographerCredit] = useState<string>('RCCG Glorious Media');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState<string>('');
  const [previewPhoto, setPreviewPhoto] = useState<EventPhoto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Helper to format image URLs (prepending API host if relative)
  const formatPhotoUrl = useCallback((url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseHost = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    return `${baseHost}${url.startsWith('/') ? '' : '/'}${url}`;
  }, []);

  // Fetch photos for event
  const fetchPhotos = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    setUploadError(null);
    try {
      const res = await api.get<EventPhoto[]>(`Events/${eventId}/photos`);
      if (res.success && Array.isArray(res.data)) {
        setPhotos(res.data);
        if (onPhotosChanged) onPhotosChanged(res.data.length);
      } else {
        setPhotos([]);
      }
    } catch (err: any) {
      console.error('[EventGallery] Error fetching photos:', err);
      setUploadError('Failed to load gallery photos.');
    } finally {
      setIsLoading(false);
    }
  }, [eventId, onPhotosChanged]);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchPhotos();
      setFeedbackMessage(null);
      setDeleteConfirmId(null);
      setEditingPhotoId(null);
    }
  }, [isOpen, eventId, fetchPhotos]);

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewPhoto) {
          setPreviewPhoto(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, previewPhoto, onClose]);

  // Upload handler
  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    const maxSizeBytes = 12 * 1024 * 1024; // 12 MB

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith('image/')) {
        setUploadError(`'${file.name}' is not an image file.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setUploadError(`'${file.name}' exceeds the 12MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(20);

    const formData = new FormData();
    validFiles.forEach((f) => formData.append('files', f));
    if (photographerCredit.trim()) {
      formData.append('photographer', photographerCredit.trim());
    }

    try {
      setUploadProgress(50);
      const res = await api.upload<EventPhoto[]>(`Events/${eventId}/photos`, formData);
      setUploadProgress(90);

      if (res.success && res.data) {
        setFeedbackMessage({
          text: `Successfully uploaded ${res.data.length} photo${res.data.length > 1 ? 's' : ''}!`,
          type: 'success'
        });
        setTimeout(() => setFeedbackMessage(null), 4000);
        await fetchPhotos();

        // If any uploaded photo became the cover, notify parent
        const coverPhoto = res.data.find((p) => p.isCover);
        if (coverPhoto && onCoverUpdated) {
          onCoverUpdated(coverPhoto.photoUrl);
        }
      } else {
        setUploadError(res.message || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      console.error('[EventGallery] Upload error:', err);
      setUploadError(err?.message || 'Error occurred during file upload.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Set Cover Photo
  const handleSetCover = async (photo: EventPhoto) => {
    try {
      const res = await api.put(`Events/${eventId}/photos/${photo.id}/cover`, {});
      if (res.success) {
        setPhotos((prev) =>
          prev.map((p) => ({
            ...p,
            isCover: p.id === photo.id
          }))
        );
        if (onCoverUpdated) {
          onCoverUpdated(photo.photoUrl);
        }
        setFeedbackMessage({ text: 'Cover photo updated successfully!', type: 'success' });
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        setUploadError(res.message || 'Could not update cover photo.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Network error updating cover.');
    }
  };

  // Delete Photo
  const handleDeletePhoto = async (photoId: string) => {
    try {
      const res = await api.delete(`Events/${eventId}/photos/${photoId}`);
      if (res.success) {
        const remaining = photos.filter((p) => p.id !== photoId);
        setPhotos(remaining);
        if (onPhotosChanged) onPhotosChanged(remaining.length);
        setDeleteConfirmId(null);

        // If the deleted photo was cover, find new cover
        const deletedWasCover = photos.find((p) => p.id === photoId)?.isCover;
        if (deletedWasCover) {
          const nextCover = remaining.find((p) => p.isCover) || remaining[0];
          if (nextCover && onCoverUpdated) {
            onCoverUpdated(nextCover.photoUrl);
          }
        }

        setFeedbackMessage({ text: 'Photo deleted successfully.', type: 'success' });
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        setUploadError(res.message || 'Could not delete photo.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Network error deleting photo.');
    }
  };

  // Update Caption
  const handleSaveCaption = async (photoId: string) => {
    try {
      const res = await api.put<EventPhoto>(`Events/${eventId}/photos/${photoId}`, {
        caption: editCaption
      });
      if (res.success) {
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, caption: editCaption } : p))
        );
        setEditingPhotoId(null);
        setFeedbackMessage({ text: 'Caption updated.', type: 'success' });
        setTimeout(() => setFeedbackMessage(null), 2500);
      }
    } catch (err: any) {
      setUploadError('Failed to update caption.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-manager-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur">
          <div className="space-y-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3 text-amber-400" />
                <span>Gallery &amp; Photos Manager</span>
              </span>
              {eventDate && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{new Date(eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
              )}
            </div>
            <h3 id="gallery-manager-title" className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
              {eventTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FEEDBACK & ERROR BANNERS */}
        {feedbackMessage && (
          <div className="px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMessage.text}</span>
            </span>
            <button onClick={() => setFeedbackMessage(null)} className="text-emerald-300 hover:text-white text-xs">
              &times;
            </button>
          </div>
        )}

        {uploadError && (
          <div className="px-6 py-2.5 bg-rose-500/10 border-b border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{uploadError}</span>
            </span>
            <button onClick={() => setUploadError(null)} className="text-rose-300 hover:text-white text-xs">
              &times;
            </button>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* UPLOAD DROPZONE */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleUploadFiles(e.target.files);
                }
              }}
            />

            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-amber-400" />
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  {isUploading ? 'Uploading Event Photos...' : 'Drag and drop event photos here'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP (up to 12MB each, batch upload supported).
                </p>
              </div>

              {/* UPLOAD PROGRESS BAR */}
              {isUploading && (
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-3">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Choose Photos from Device'}</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-[11px] font-bold text-slate-500">Photographer:</span>
                  <input
                    type="text"
                    value={photographerCredit}
                    onChange={(e) => setPhotographerCredit(e.target.value)}
                    placeholder="e.g. RCCG Media"
                    className="bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-36"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GALLERY SECTION HEADER */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>Uploaded Event Photos</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-xs font-bold border border-slate-700">
                {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 hidden sm:block">
              Click ⭐ on any photo to set it as the event flyer/cover banner.
            </p>
          </div>

          {/* PHOTOS GRID OR EMPTY STATE */}
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Loading parish gallery...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="py-12 px-6 rounded-2xl bg-slate-950/30 border border-slate-800/60 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto border border-slate-700">
                <Camera className="w-7 h-7 text-slate-500" />
              </div>
              <h5 className="text-sm font-bold text-slate-300">No Photos In This Event Gallery Yet</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the dropzone above or click "Choose Photos" to upload pictures from this program. They will appear here and on the public parish website!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => {
                const fullUrl = formatPhotoUrl(photo.photoUrl);
                const isCurrentCover = photo.isCover;

                return (
                  <div
                    key={photo.id}
                    className={`group relative rounded-2xl overflow-hidden bg-slate-800 border transition-all duration-200 flex flex-col justify-between ${
                      isCurrentCover
                        ? 'border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/40'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {/* PHOTO THUMBNAIL */}
                    <div className="relative aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewPhoto(photo)}>
                      <img
                        src={fullUrl}
                        alt={photo.caption || eventTitle}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if broken
                          (e.target as HTMLImageElement).src = '/event_praise_night.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* COVER BADGE */}
                      {isCurrentCover && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow flex items-center gap-1">
                            <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                            <span>Cover Flyer</span>
                          </span>
                        </div>
                      )}

                      {/* LIGHTBOX HOVER ICON */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewPhoto(photo);
                          }}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white transition cursor-pointer"
                          title="View Fullscreen"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* PHOTO METADATA & IN-PLACE CAPTION */}
                    <div className="p-3 space-y-2 bg-slate-900/90 text-xs flex-1 flex flex-col justify-between">
                      {editingPhotoId === photo.id ? (
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            placeholder="Add photo caption..."
                            maxLength={150}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingPhotoId(null)}
                              className="px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveCaption(photo.id)}
                              className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-300 font-medium truncate" title={photo.caption || 'No caption'}>
                            {photo.caption || 'No caption added'}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            By {photo.photographer || 'RCCG Media'}
                          </p>
                        </div>
                      )}

                      {/* ACTION TOOLBAR */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                        {!isCurrentCover ? (
                          <button
                            type="button"
                            onClick={() => handleSetCover(photo)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Set as Event Cover Flyer"
                          >
                            <Star className="w-3 h-3 text-amber-400" />
                            <span>Set Cover</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Primary Cover</span>
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPhotoId(photo.id);
                              setEditCaption(photo.caption || '');
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
                            title="Edit Caption"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === photo.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-500"
                                title="Confirm Delete"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(photo.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Uploaded photos appear on the public parish website under this event's album.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Close Manager
          </button>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW LIGHTBOX */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={formatPhotoUrl(previewPhoto.photoUrl)}
              alt={previewPhoto.caption || eventTitle}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            {previewPhoto.caption && (
              <p className="mt-3 text-sm text-slate-200 font-medium text-center">
                {previewPhoto.caption}
              </p>
            )}
            <p className="text-xs text-slate-500 text-center mt-1">
              Photo credit: {previewPhoto.photographer || 'RCCG Glorious Media'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
