using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public class EventService : IEventService
{
    private readonly ICmsDbContext _context;
    private readonly IMediaStorageService _mediaStorageService;

    public EventService(ICmsDbContext context, IMediaStorageService mediaStorageService)
    {
        _context = context;
        _mediaStorageService = mediaStorageService;
    }

    public async Task<List<ParishEventDto>> GetEventsAsync(string? status, bool? featuredOnly, CancellationToken ct = default)
    {
        var query = _context.ParishEvents
            .Include(e => e.Speakers.OrderBy(s => s.DisplayOrder))
            .Include(e => e.Photos.OrderBy(p => p.DisplayOrder).ThenBy(p => p.CreatedAtUtc))
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            var trimmed = status.Trim().ToLower();
            query = query.Where(e => e.Status.ToLower() == trimmed);
        }

        if (featuredOnly.HasValue && featuredOnly.Value)
        {
            query = query.Where(e => e.IsFeatured);
        }

        return await query
            .OrderBy(e => e.EventDate)
            .Select(e => new ParishEventDto
            {
                Id = e.Id,
                Title = e.Title,
                Theme = e.Theme,
                Description = e.Description,
                CoverImageUrl = e.CoverImageUrl,
                EventDate = e.EventDate,
                TimeString = e.TimeString,
                Venue = e.Venue,
                Category = e.Category,
                IsFeatured = e.IsFeatured,
                RegistrationRequired = e.RegistrationRequired,
                Status = e.Status,
                MaxCapacity = e.MaxCapacity,
                CreatedAtUtc = e.CreatedAtUtc,
                Speakers = e.Speakers.Select(s => new EventSpeakerDto
                {
                    Id = s.Id,
                    ParishEventId = s.ParishEventId,
                    FullName = s.FullName,
                    EcclesiasticalTitle = s.EcclesiasticalTitle,
                    MinistryRole = s.MinistryRole,
                    PhotoUrl = s.PhotoUrl,
                    Organization = s.Organization,
                    ShortBio = s.ShortBio,
                    DisplayOrder = s.DisplayOrder
                }).ToList(),
                Photos = e.Photos.OrderBy(p => p.DisplayOrder).ThenBy(p => p.CreatedAtUtc).Select(p => new EventPhotoDto
                {
                    Id = p.Id,
                    ParishEventId = p.ParishEventId,
                    PhotoUrl = p.PhotoUrl,
                    ThumbnailUrl = p.ThumbnailUrl,
                    Caption = p.Caption,
                    Photographer = p.Photographer,
                    DisplayOrder = p.DisplayOrder,
                    IsCover = p.IsCover,
                    FileSizeBytes = p.FileSizeBytes,
                    ContentType = p.ContentType,
                    CreatedAtUtc = p.CreatedAtUtc
                }).ToList(),
                PhotoCount = e.Photos.Count
            })
            .ToListAsync(ct);
    }

    public async Task<ParishEventDto?> GetEventByIdAsync(Guid id, CancellationToken ct = default)
    {
        var ev = await _context.ParishEvents
            .Include(e => e.Speakers.OrderBy(s => s.DisplayOrder))
            .Include(e => e.Photos.OrderBy(p => p.DisplayOrder).ThenBy(p => p.CreatedAtUtc))
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, ct);

        if (ev == null) return null;

        return MapToDto(ev);
    }

    public async Task<ParishEventDto> CreateEventAsync(CreateParishEventRequestDto dto, CancellationToken ct = default)
    {
        bool isDraft = string.Equals(dto.Status, "Draft", StringComparison.OrdinalIgnoreCase);
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ArgumentException("Event Title is mandatory.");
        }

        if (!isDraft && string.IsNullOrWhiteSpace(dto.Venue))
        {
            throw new ArgumentException("Event Venue is mandatory for published events.");
        }

        var newEvent = new ParishEvent
        {
            Title = dto.Title.Trim(),
            Theme = dto.Theme?.Trim() ?? string.Empty,
            Description = dto.Description?.Trim() ?? string.Empty,
            CoverImageUrl = dto.CoverImageUrl?.Trim() ?? string.Empty,
            EventDate = dto.EventDate == default ? DateTime.UtcNow.AddDays(7) : dto.EventDate,
            TimeString = dto.TimeString?.Trim() ?? string.Empty,
            Venue = string.IsNullOrWhiteSpace(dto.Venue) ? (isDraft ? "TBA (Draft)" : "Main Sanctuary Auditorium") : dto.Venue.Trim(),
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim(),
            IsFeatured = dto.IsFeatured,
            RegistrationRequired = dto.RegistrationRequired,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? (isDraft ? "Draft" : "Upcoming") : dto.Status.Trim(),
            MaxCapacity = dto.MaxCapacity,
            CreatedAtUtc = DateTime.UtcNow
        };

        if (dto.Speakers != null && dto.Speakers.Count > 0)
        {
            int order = 1;
            foreach (var spk in dto.Speakers)
            {
                if (!string.IsNullOrWhiteSpace(spk.FullName))
                {
                    newEvent.Speakers.Add(new EventSpeaker
                    {
                        FullName = spk.FullName.Trim(),
                        EcclesiasticalTitle = string.IsNullOrWhiteSpace(spk.EcclesiasticalTitle) ? "Pastor" : spk.EcclesiasticalTitle.Trim(),
                        MinistryRole = string.IsNullOrWhiteSpace(spk.MinistryRole) ? "Guest Speaker" : spk.MinistryRole.Trim(),
                        PhotoUrl = spk.PhotoUrl?.Trim(),
                        Organization = spk.Organization?.Trim(),
                        ShortBio = spk.ShortBio?.Trim(),
                        DisplayOrder = spk.DisplayOrder > 0 ? spk.DisplayOrder : order++,
                        CreatedAtUtc = DateTime.UtcNow
                    });
                }
            }
        }

        _context.ParishEvents.Add(newEvent);
        await _context.SaveChangesAsync(ct);

        return MapToDto(newEvent);
    }

    public async Task<ParishEventDto?> UpdateEventAsync(Guid id, UpdateParishEventRequestDto dto, CancellationToken ct = default)
    {
        var ev = await _context.ParishEvents
            .Include(e => e.Speakers)
            .FirstOrDefaultAsync(e => e.Id == id, ct);

        if (ev == null) return null;

        bool isDraft = string.Equals(dto.Status, "Draft", StringComparison.OrdinalIgnoreCase);
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ArgumentException("Event Title is mandatory.");
        }

        if (!isDraft && string.IsNullOrWhiteSpace(dto.Venue))
        {
            throw new ArgumentException("Event Venue is mandatory for published events.");
        }

        ev.Title = dto.Title.Trim();
        ev.Theme = dto.Theme?.Trim() ?? string.Empty;
        ev.Description = dto.Description?.Trim() ?? string.Empty;
        ev.CoverImageUrl = dto.CoverImageUrl?.Trim() ?? string.Empty;
        ev.EventDate = dto.EventDate == default ? ev.EventDate : dto.EventDate;
        ev.TimeString = dto.TimeString?.Trim() ?? string.Empty;
        ev.Venue = string.IsNullOrWhiteSpace(dto.Venue) ? (isDraft ? "TBA (Draft)" : ev.Venue) : dto.Venue.Trim();
        ev.Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim();
        ev.IsFeatured = dto.IsFeatured;
        ev.RegistrationRequired = dto.RegistrationRequired;
        ev.Status = string.IsNullOrWhiteSpace(dto.Status) ? (isDraft ? "Draft" : "Upcoming") : dto.Status.Trim();
        ev.MaxCapacity = dto.MaxCapacity;
        ev.UpdatedAtUtc = DateTime.UtcNow;

        if (dto.Speakers != null)
        {
            var existingSpeakers = await _context.EventSpeakers
                .Where(s => s.ParishEventId == ev.Id)
                .ToListAsync(ct);

            if (existingSpeakers.Count > 0)
            {
                _context.EventSpeakers.RemoveRange(existingSpeakers);
            }

            int order = 1;
            foreach (var spk in dto.Speakers)
            {
                if (!string.IsNullOrWhiteSpace(spk.FullName))
                {
                    var speaker = new EventSpeaker
                    {
                        Id = Guid.NewGuid(),
                        ParishEventId = ev.Id,
                        FullName = spk.FullName.Trim(),
                        EcclesiasticalTitle = string.IsNullOrWhiteSpace(spk.EcclesiasticalTitle) ? "Pastor" : spk.EcclesiasticalTitle.Trim(),
                        MinistryRole = string.IsNullOrWhiteSpace(spk.MinistryRole) ? "Guest Speaker" : spk.MinistryRole.Trim(),
                        PhotoUrl = spk.PhotoUrl?.Trim(),
                        Organization = spk.Organization?.Trim(),
                        ShortBio = spk.ShortBio?.Trim(),
                        DisplayOrder = spk.DisplayOrder > 0 ? spk.DisplayOrder : order++,
                        CreatedAtUtc = DateTime.UtcNow
                    };
                    _context.EventSpeakers.Add(speaker);
                }
            }
        }

        await _context.SaveChangesAsync(ct);
        ev.Speakers = await _context.EventSpeakers
            .Where(s => s.ParishEventId == ev.Id)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(ct);
        return MapToDto(ev);
    }

    public async Task<ParishEventDto> UpsertEventAsync(string idOrKey, UpdateParishEventRequestDto dto, CancellationToken ct = default)
    {
        ParishEvent? ev = null;

        if (Guid.TryParse(idOrKey, out var parsedGuid))
        {
            ev = await _context.ParishEvents
                .Include(e => e.Speakers)
                .FirstOrDefaultAsync(e => e.Id == parsedGuid, ct);
        }

        if (ev == null && !string.IsNullOrWhiteSpace(dto.Title))
        {
            var targetTitle = dto.Title.Trim().ToLower();
            ev = await _context.ParishEvents
                .Include(e => e.Speakers)
                .FirstOrDefaultAsync(e => e.Title.Trim().ToLower() == targetTitle, ct);
        }

        bool isDraft = string.Equals(dto.Status, "Draft", StringComparison.OrdinalIgnoreCase);
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ArgumentException("Event Title is mandatory.");
        }

        if (!isDraft && string.IsNullOrWhiteSpace(dto.Venue))
        {
            throw new ArgumentException("Event Venue is mandatory for published events.");
        }

        if (ev != null)
        {
            ev.Title = dto.Title.Trim();
            ev.Theme = dto.Theme?.Trim() ?? string.Empty;
            ev.Description = dto.Description?.Trim() ?? string.Empty;
            ev.CoverImageUrl = dto.CoverImageUrl?.Trim() ?? string.Empty;
            ev.EventDate = dto.EventDate == default ? ev.EventDate : dto.EventDate;
            ev.TimeString = dto.TimeString?.Trim() ?? string.Empty;
            ev.Venue = string.IsNullOrWhiteSpace(dto.Venue) ? (isDraft ? "TBA (Draft)" : ev.Venue) : dto.Venue.Trim();
            ev.Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim();
            ev.IsFeatured = dto.IsFeatured;
            ev.RegistrationRequired = dto.RegistrationRequired;
            ev.Status = string.IsNullOrWhiteSpace(dto.Status) ? (isDraft ? "Draft" : "Upcoming") : dto.Status.Trim();
            ev.MaxCapacity = dto.MaxCapacity;
            ev.UpdatedAtUtc = DateTime.UtcNow;

            if (dto.Speakers != null)
            {
                var existingSpeakers = await _context.EventSpeakers
                    .Where(s => s.ParishEventId == ev.Id)
                    .ToListAsync(ct);

                if (existingSpeakers.Count > 0)
                {
                    _context.EventSpeakers.RemoveRange(existingSpeakers);
                }

                int order = 1;
                foreach (var spk in dto.Speakers)
                {
                    if (!string.IsNullOrWhiteSpace(spk.FullName))
                    {
                        var speaker = new EventSpeaker
                        {
                            Id = Guid.NewGuid(),
                            ParishEventId = ev.Id,
                            FullName = spk.FullName.Trim(),
                            EcclesiasticalTitle = string.IsNullOrWhiteSpace(spk.EcclesiasticalTitle) ? "Pastor" : spk.EcclesiasticalTitle.Trim(),
                            MinistryRole = string.IsNullOrWhiteSpace(spk.MinistryRole) ? "Guest Speaker" : spk.MinistryRole.Trim(),
                            PhotoUrl = spk.PhotoUrl?.Trim(),
                            Organization = spk.Organization?.Trim(),
                            ShortBio = spk.ShortBio?.Trim(),
                            DisplayOrder = spk.DisplayOrder > 0 ? spk.DisplayOrder : order++,
                            CreatedAtUtc = DateTime.UtcNow
                        };
                        _context.EventSpeakers.Add(speaker);
                    }
                }
            }

            await _context.SaveChangesAsync(ct);
            ev.Speakers = await _context.EventSpeakers
                .Where(s => s.ParishEventId == ev.Id)
                .OrderBy(s => s.DisplayOrder)
                .ToListAsync(ct);
            return MapToDto(ev);
        }
        else
        {
            var newEvent = new ParishEvent
            {
                Title = dto.Title.Trim(),
                Theme = dto.Theme?.Trim() ?? string.Empty,
                Description = dto.Description?.Trim() ?? string.Empty,
                CoverImageUrl = dto.CoverImageUrl?.Trim() ?? string.Empty,
                EventDate = dto.EventDate == default ? DateTime.UtcNow.AddDays(7) : dto.EventDate,
                TimeString = dto.TimeString?.Trim() ?? string.Empty,
                Venue = string.IsNullOrWhiteSpace(dto.Venue) ? (isDraft ? "TBA (Draft)" : "Main Sanctuary Auditorium") : dto.Venue.Trim(),
                Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim(),
                IsFeatured = dto.IsFeatured,
                RegistrationRequired = dto.RegistrationRequired,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? (isDraft ? "Draft" : "Upcoming") : dto.Status.Trim(),
                MaxCapacity = dto.MaxCapacity,
                CreatedAtUtc = DateTime.UtcNow
            };

            if (dto.Speakers != null && dto.Speakers.Count > 0)
            {
                int order = 1;
                foreach (var spk in dto.Speakers)
                {
                    if (!string.IsNullOrWhiteSpace(spk.FullName))
                    {
                        newEvent.Speakers.Add(new EventSpeaker
                        {
                            FullName = spk.FullName.Trim(),
                            EcclesiasticalTitle = string.IsNullOrWhiteSpace(spk.EcclesiasticalTitle) ? "Pastor" : spk.EcclesiasticalTitle.Trim(),
                            MinistryRole = string.IsNullOrWhiteSpace(spk.MinistryRole) ? "Guest Speaker" : spk.MinistryRole.Trim(),
                            PhotoUrl = spk.PhotoUrl?.Trim(),
                            Organization = spk.Organization?.Trim(),
                            ShortBio = spk.ShortBio?.Trim(),
                            DisplayOrder = spk.DisplayOrder > 0 ? spk.DisplayOrder : order++,
                            CreatedAtUtc = DateTime.UtcNow
                        });
                    }
                }
            }

            _context.ParishEvents.Add(newEvent);
            await _context.SaveChangesAsync(ct);
            return MapToDto(newEvent);
        }
    }

    public async Task<bool> DeleteEventAsync(Guid id, CancellationToken ct = default)
    {
        var ev = await _context.ParishEvents.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (ev == null) return false;

        _context.ParishEvents.Remove(ev);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteEventByStringIdAsync(string idOrKey, CancellationToken ct = default)
    {
        ParishEvent? ev = null;
        if (Guid.TryParse(idOrKey, out var parsedGuid))
        {
            ev = await _context.ParishEvents.FirstOrDefaultAsync(e => e.Id == parsedGuid, ct);
        }

        if (ev == null && !string.IsNullOrWhiteSpace(idOrKey))
        {
            var target = idOrKey.Trim().ToLower();
            ev = await _context.ParishEvents.FirstOrDefaultAsync(e => e.Title.Trim().ToLower() == target, ct);
        }

        if (ev == null) return false;

        _context.ParishEvents.Remove(ev);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private static ParishEventDto MapToDto(ParishEvent ev)
    {
        return new ParishEventDto
        {
            Id = ev.Id,
            Title = ev.Title,
            Theme = ev.Theme,
            Description = ev.Description,
            CoverImageUrl = ev.CoverImageUrl,
            EventDate = ev.EventDate,
            TimeString = ev.TimeString,
            Venue = ev.Venue,
            Category = ev.Category,
            IsFeatured = ev.IsFeatured,
            RegistrationRequired = ev.RegistrationRequired,
            Status = ev.Status,
            MaxCapacity = ev.MaxCapacity,
            CreatedAtUtc = ev.CreatedAtUtc,
            Speakers = ev.Speakers.Select(s => new EventSpeakerDto
            {
                Id = s.Id,
                ParishEventId = s.ParishEventId,
                FullName = s.FullName,
                EcclesiasticalTitle = s.EcclesiasticalTitle,
                MinistryRole = s.MinistryRole,
                PhotoUrl = s.PhotoUrl,
                Organization = s.Organization,
                ShortBio = s.ShortBio,
                DisplayOrder = s.DisplayOrder
            }).ToList(),
            Photos = ev.Photos.OrderBy(p => p.DisplayOrder).ThenBy(p => p.CreatedAtUtc).Select(p => new EventPhotoDto
            {
                Id = p.Id,
                ParishEventId = p.ParishEventId,
                PhotoUrl = p.PhotoUrl,
                ThumbnailUrl = p.ThumbnailUrl,
                Caption = p.Caption,
                Photographer = p.Photographer,
                DisplayOrder = p.DisplayOrder,
                IsCover = p.IsCover,
                FileSizeBytes = p.FileSizeBytes,
                ContentType = p.ContentType,
                CreatedAtUtc = p.CreatedAtUtc
            }).ToList(),
            PhotoCount = ev.Photos.Count
        };
    }

    public async Task<List<EventPhotoDto>> GetEventPhotosAsync(Guid eventId, CancellationToken ct = default)
    {
        return await _context.EventPhotos
            .Where(p => p.ParishEventId == eventId)
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.CreatedAtUtc)
            .AsNoTracking()
            .Select(p => new EventPhotoDto
            {
                Id = p.Id,
                ParishEventId = p.ParishEventId,
                PhotoUrl = p.PhotoUrl,
                ThumbnailUrl = p.ThumbnailUrl,
                Caption = p.Caption,
                Photographer = p.Photographer,
                DisplayOrder = p.DisplayOrder,
                IsCover = p.IsCover,
                FileSizeBytes = p.FileSizeBytes,
                ContentType = p.ContentType,
                CreatedAtUtc = p.CreatedAtUtc
            })
            .ToListAsync(ct);
    }

    public async Task<List<EventPhotoDto>> UploadEventPhotosAsync(
        Guid eventId,
        List<(Stream Stream, string FileName, string ContentType)> files,
        string? defaultPhotographer,
        CancellationToken ct = default)
    {
        var ev = await _context.ParishEvents
            .Include(e => e.Photos)
            .FirstOrDefaultAsync(e => e.Id == eventId, ct);

        if (ev == null)
        {
            throw new ArgumentException("Parish event not found.");
        }

        int currentMaxOrder = ev.Photos.Any() ? ev.Photos.Max(p => p.DisplayOrder) : 0;
        bool hasExistingCover = ev.Photos.Any(p => p.IsCover) || !string.IsNullOrWhiteSpace(ev.CoverImageUrl);
        var createdPhotos = new List<EventPhoto>();

        foreach (var file in files)
        {
            var uploadResult = await _mediaStorageService.UploadFileAsync(
                file.Stream,
                file.FileName,
                file.ContentType,
                $"events/{eventId}",
                ct);

            if (!uploadResult.Success)
            {
                continue;
            }

            currentMaxOrder++;
            bool shouldBeCover = !hasExistingCover && createdPhotos.Count == 0;

            var photoEntity = new EventPhoto
            {
                ParishEventId = eventId,
                PhotoUrl = uploadResult.Url,
                ThumbnailUrl = uploadResult.ThumbnailUrl ?? uploadResult.Url,
                Caption = Path.GetFileNameWithoutExtension(file.FileName),
                Photographer = defaultPhotographer ?? "Glorious Media",
                DisplayOrder = currentMaxOrder,
                IsCover = shouldBeCover,
                FileSizeBytes = uploadResult.FileSizeBytes,
                ContentType = uploadResult.ContentType
            };

            if (shouldBeCover)
            {
                ev.CoverImageUrl = uploadResult.Url;
                hasExistingCover = true;
            }

            createdPhotos.Add(photoEntity);
            _context.EventPhotos.Add(photoEntity);
        }

        await _context.SaveChangesAsync(ct);

        return createdPhotos.Select(p => new EventPhotoDto
        {
            Id = p.Id,
            ParishEventId = p.ParishEventId,
            PhotoUrl = p.PhotoUrl,
            ThumbnailUrl = p.ThumbnailUrl,
            Caption = p.Caption,
            Photographer = p.Photographer,
            DisplayOrder = p.DisplayOrder,
            IsCover = p.IsCover,
            FileSizeBytes = p.FileSizeBytes,
            ContentType = p.ContentType,
            CreatedAtUtc = p.CreatedAtUtc
        }).ToList();
    }

    public async Task<bool> DeleteEventPhotoAsync(Guid eventId, Guid photoId, CancellationToken ct = default)
    {
        var photo = await _context.EventPhotos
            .FirstOrDefaultAsync(p => p.Id == photoId && p.ParishEventId == eventId, ct);

        if (photo == null) return false;

        // Attempt physical file cleanup
        await _mediaStorageService.DeleteFileAsync(photo.PhotoUrl, ct);

        bool wasCover = photo.IsCover;
        _context.EventPhotos.Remove(photo);

        if (wasCover)
        {
            // Pick next photo to become cover, if any
            var nextPhoto = await _context.EventPhotos
                .Where(p => p.ParishEventId == eventId && p.Id != photoId)
                .OrderBy(p => p.DisplayOrder)
                .FirstOrDefaultAsync(ct);

            var ev = await _context.ParishEvents.FirstOrDefaultAsync(e => e.Id == eventId, ct);
            if (ev != null)
            {
                if (nextPhoto != null)
                {
                    nextPhoto.IsCover = true;
                    ev.CoverImageUrl = nextPhoto.PhotoUrl;
                }
                else
                {
                    ev.CoverImageUrl = string.Empty;
                }
            }
        }

        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> SetCoverPhotoAsync(Guid eventId, Guid photoId, CancellationToken ct = default)
    {
        var ev = await _context.ParishEvents
            .Include(e => e.Photos)
            .FirstOrDefaultAsync(e => e.Id == eventId, ct);

        if (ev == null) return false;

        var targetPhoto = ev.Photos.FirstOrDefault(p => p.Id == photoId);
        if (targetPhoto == null) return false;

        foreach (var p in ev.Photos)
        {
            p.IsCover = (p.Id == photoId);
        }

        ev.CoverImageUrl = targetPhoto.PhotoUrl;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<EventPhotoDto?> UpdateEventPhotoAsync(
        Guid eventId,
        Guid photoId,
        UpdateEventPhotoRequestDto dto,
        CancellationToken ct = default)
    {
        var photo = await _context.EventPhotos
            .FirstOrDefaultAsync(p => p.Id == photoId && p.ParishEventId == eventId, ct);

        if (photo == null) return null;

        if (dto.Caption != null) photo.Caption = dto.Caption.Trim();
        if (dto.Photographer != null) photo.Photographer = dto.Photographer.Trim();
        if (dto.DisplayOrder > 0) photo.DisplayOrder = dto.DisplayOrder;

        await _context.SaveChangesAsync(ct);

        return new EventPhotoDto
        {
            Id = photo.Id,
            ParishEventId = photo.ParishEventId,
            PhotoUrl = photo.PhotoUrl,
            ThumbnailUrl = photo.ThumbnailUrl,
            Caption = photo.Caption,
            Photographer = photo.Photographer,
            DisplayOrder = photo.DisplayOrder,
            IsCover = photo.IsCover,
            FileSizeBytes = photo.FileSizeBytes,
            ContentType = photo.ContentType,
            CreatedAtUtc = photo.CreatedAtUtc
        };
    }
}
