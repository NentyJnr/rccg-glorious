using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface IEventService
{
    Task<List<ParishEventDto>> GetEventsAsync(string? status, bool? featuredOnly, CancellationToken ct = default);
    Task<ParishEventDto?> GetEventByIdAsync(Guid id, CancellationToken ct = default);
    Task<ParishEventDto> CreateEventAsync(CreateParishEventRequestDto dto, CancellationToken ct = default);
    Task<ParishEventDto?> UpdateEventAsync(Guid id, UpdateParishEventRequestDto dto, CancellationToken ct = default);
    Task<bool> DeleteEventAsync(Guid id, CancellationToken ct = default);
}
