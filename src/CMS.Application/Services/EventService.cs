using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public class EventService : IEventService
{
    private readonly ICmsDbContext _context;

    public EventService(ICmsDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParishEventDto>> GetEventsAsync(string? status, bool? featuredOnly, CancellationToken ct = default)
    {
        var query = _context.ParishEvents
            .Include(e => e.Speakers.OrderBy(s => s.DisplayOrder))
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(e => e.Status == status);
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
                }).ToList()
            })
            .ToListAsync(ct);
    }

    public async Task<ParishEventDto?> GetEventByIdAsync(Guid id, CancellationToken ct = default)
    {
        var ev = await _context.ParishEvents
            .Include(e => e.Speakers.OrderBy(s => s.DisplayOrder))
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, ct);

        if (ev == null) return null;

        return MapToDto(ev);
    }

    public async Task<ParishEventDto> CreateEventAsync(CreateParishEventRequestDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Venue))
        {
            throw new ArgumentException("Event Title and Venue are mandatory.");
        }

        var newEvent = new ParishEvent
        {
            Title = dto.Title.Trim(),
            Theme = dto.Theme?.Trim() ?? string.Empty,
            Description = dto.Description?.Trim() ?? string.Empty,
            CoverImageUrl = dto.CoverImageUrl?.Trim() ?? string.Empty,
            EventDate = dto.EventDate == default ? DateTime.UtcNow.AddDays(7) : dto.EventDate,
            TimeString = dto.TimeString?.Trim() ?? string.Empty,
            Venue = dto.Venue.Trim(),
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim(),
            IsFeatured = dto.IsFeatured,
            RegistrationRequired = dto.RegistrationRequired,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Upcoming" : dto.Status.Trim(),
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

        ev.Title = dto.Title.Trim();
        ev.Theme = dto.Theme?.Trim() ?? string.Empty;
        ev.Description = dto.Description?.Trim() ?? string.Empty;
        ev.CoverImageUrl = dto.CoverImageUrl?.Trim() ?? string.Empty;
        ev.EventDate = dto.EventDate == default ? ev.EventDate : dto.EventDate;
        ev.TimeString = dto.TimeString?.Trim() ?? string.Empty;
        ev.Venue = dto.Venue.Trim();
        ev.Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim();
        ev.IsFeatured = dto.IsFeatured;
        ev.RegistrationRequired = dto.RegistrationRequired;
        ev.Status = string.IsNullOrWhiteSpace(dto.Status) ? "Upcoming" : dto.Status.Trim();
        ev.MaxCapacity = dto.MaxCapacity;
        ev.UpdatedAtUtc = DateTime.UtcNow;

        if (dto.Speakers != null)
        {
            _context.EventSpeakers.RemoveRange(ev.Speakers);
            ev.Speakers.Clear();

            int order = 1;
            foreach (var spk in dto.Speakers)
            {
                if (!string.IsNullOrWhiteSpace(spk.FullName))
                {
                    ev.Speakers.Add(new EventSpeaker
                    {
                        ParishEventId = ev.Id,
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

        await _context.SaveChangesAsync(ct);
        return MapToDto(ev);
    }

    public async Task<bool> DeleteEventAsync(Guid id, CancellationToken ct = default)
    {
        var ev = await _context.ParishEvents.FirstOrDefaultAsync(e => e.Id == id, ct);
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
            }).ToList()
        };
    }
}
