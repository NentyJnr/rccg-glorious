using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface IEventService
{
    Task<List<ParishEventDto>> GetEventsAsync(string? status, bool? featuredOnly, CancellationToken ct = default);
    Task<ParishEventDto?> GetEventByIdAsync(Guid id, CancellationToken ct = default);
    Task<ParishEventDto> CreateEventAsync(CreateParishEventRequestDto dto, CancellationToken ct = default);
    Task<ParishEventDto?> UpdateEventAsync(Guid id, UpdateParishEventRequestDto dto, CancellationToken ct = default);
    Task<ParishEventDto> UpsertEventAsync(string idOrKey, UpdateParishEventRequestDto dto, CancellationToken ct = default);
    Task<bool> DeleteEventAsync(Guid id, CancellationToken ct = default);
    Task<bool> DeleteEventByStringIdAsync(string idOrKey, CancellationToken ct = default);

    Task<List<EventPhotoDto>> GetEventPhotosAsync(Guid eventId, CancellationToken ct = default);
    Task<List<EventPhotoDto>> UploadEventPhotosAsync(Guid eventId, List<(Stream Stream, string FileName, string ContentType)> files, string? defaultPhotographer, CancellationToken ct = default);
    Task<bool> DeleteEventPhotoAsync(Guid eventId, Guid photoId, CancellationToken ct = default);
    Task<bool> SetCoverPhotoAsync(Guid eventId, Guid photoId, CancellationToken ct = default);
    Task<EventPhotoDto?> UpdateEventPhotoAsync(Guid eventId, Guid photoId, UpdateEventPhotoRequestDto dto, CancellationToken ct = default);
}
