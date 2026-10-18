using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents([FromQuery] string? status, [FromQuery] bool? featuredOnly, CancellationToken ct)
    {
        var events = await _eventService.GetEventsAsync(status, featuredOnly, ct);
        return Ok(ApiResponseEnvelope<List<ParishEventDto>>.Ok(events, "Events retrieved successfully"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEventById(string id, CancellationToken ct)
    {
        if (Guid.TryParse(id, out var guidId))
        {
            var ev = await _eventService.GetEventByIdAsync(guidId, ct);
            if (ev != null)
            {
                return Ok(ApiResponseEnvelope<ParishEventDto>.Ok(ev));
            }
        }

        var all = await _eventService.GetEventsAsync(null, null, ct);
        var match = all.FirstOrDefault(e => e.Title.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (match != null)
        {
            return Ok(ApiResponseEnvelope<ParishEventDto>.Ok(match));
        }

        return NotFound(ApiResponseEnvelope<ParishEventDto>.Fail("Event not found"));
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateParishEventRequestDto dto, CancellationToken ct)
    {
        try
        {
            var created = await _eventService.CreateEventAsync(dto, ct);
            return CreatedAtAction(nameof(GetEventById), new { id = created.Id.ToString() }, ApiResponseEnvelope<ParishEventDto>.Ok(created, "Event created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<ParishEventDto>.Fail(ex.Message));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(string id, [FromBody] UpdateParishEventRequestDto dto, CancellationToken ct)
    {
        try
        {
            var updated = await _eventService.UpsertEventAsync(id, dto, ct);
            return Ok(ApiResponseEnvelope<ParishEventDto>.Ok(updated, "Event saved successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<ParishEventDto>.Fail(ex.Message));
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(string id, CancellationToken ct)
    {
        bool deleted = await _eventService.DeleteEventByStringIdAsync(id, ct);
        if (!deleted)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail("Event not found"));
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Event deleted successfully"));
    }

    [HttpGet("{id}/photos")]
    public async Task<IActionResult> GetEventPhotos(string id, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var guidId))
        {
            var all = await _eventService.GetEventsAsync(null, null, ct);
            var match = all.FirstOrDefault(e => e.Title.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (match == null) return NotFound(ApiResponseEnvelope<List<EventPhotoDto>>.Fail("Event not found"));
            guidId = match.Id;
        }

        var photos = await _eventService.GetEventPhotosAsync(guidId, ct);
        return Ok(ApiResponseEnvelope<List<EventPhotoDto>>.Ok(photos, "Event photos retrieved successfully"));
    }

    [HttpPost("{id}/photos")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadEventPhotos(
        string id,
        [FromForm] List<IFormFile> files,
        [FromForm] string? photographer,
        CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var guidId))
        {
            var all = await _eventService.GetEventsAsync(null, null, ct);
            var match = all.FirstOrDefault(e => e.Title.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (match == null) return NotFound(ApiResponseEnvelope<List<EventPhotoDto>>.Fail("Event not found"));
            guidId = match.Id;
        }

        if (files == null || files.Count == 0)
        {
            return BadRequest(ApiResponseEnvelope<List<EventPhotoDto>>.Fail("No image files were provided for upload."));
        }

        if (files.Count > 25)
        {
            return BadRequest(ApiResponseEnvelope<List<EventPhotoDto>>.Fail("Exceeded maximum batch upload limit of 25 files at a time."));
        }

        const long maxSizeBytes = 12 * 1024 * 1024; // 12 MB
        var fileTuples = new List<(Stream Stream, string FileName, string ContentType)>();

        foreach (var file in files)
        {
            if (file.Length > maxSizeBytes)
            {
                return BadRequest(ApiResponseEnvelope<List<EventPhotoDto>>.Fail($"File '{file.FileName}' exceeds the maximum allowed size of 12MB."));
            }

            fileTuples.Add((file.OpenReadStream(), file.FileName, file.ContentType));
        }

        try
        {
            var uploaded = await _eventService.UploadEventPhotosAsync(guidId, fileTuples, photographer, ct);
            return Ok(ApiResponseEnvelope<List<EventPhotoDto>>.Ok(uploaded, $"{uploaded.Count} photo(s) uploaded successfully to event gallery"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<List<EventPhotoDto>>.Fail(ex.Message));
        }
    }

    [HttpPut("{id}/photos/{photoId}/cover")]
    public async Task<IActionResult> SetCoverPhoto(string id, Guid photoId, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var guidId))
        {
            var all = await _eventService.GetEventsAsync(null, null, ct);
            var match = all.FirstOrDefault(e => e.Title.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (match == null) return NotFound(ApiResponseEnvelope<bool>.Fail("Event not found"));
            guidId = match.Id;
        }

        bool success = await _eventService.SetCoverPhotoAsync(guidId, photoId, ct);
        if (!success)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail("Photo or event not found"));
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Event cover photo updated successfully"));
    }

    [HttpPut("{id}/photos/{photoId}")]
    public async Task<IActionResult> UpdatePhotoDetails(
        string id,
        Guid photoId,
        [FromBody] UpdateEventPhotoRequestDto dto,
        CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var guidId))
        {
            var all = await _eventService.GetEventsAsync(null, null, ct);
            var match = all.FirstOrDefault(e => e.Title.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (match == null) return NotFound(ApiResponseEnvelope<EventPhotoDto>.Fail("Event not found"));
            guidId = match.Id;
        }

        var updated = await _eventService.UpdateEventPhotoAsync(guidId, photoId, dto, ct);
        if (updated == null)
        {
            return NotFound(ApiResponseEnvelope<EventPhotoDto>.Fail("Photo not found"));
        }

        return Ok(ApiResponseEnvelope<EventPhotoDto>.Ok(updated, "Photo details updated successfully"));
    }

    [HttpDelete("{id}/photos/{photoId}")]
    public async Task<IActionResult> DeletePhoto(string id, Guid photoId, CancellationToken ct)
    {
        if (!Guid.TryParse(id, out var guidId))
        {
            var all = await _eventService.GetEventsAsync(null, null, ct);
            var match = all.FirstOrDefault(e => e.Title.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (match == null) return NotFound(ApiResponseEnvelope<bool>.Fail("Event not found"));
            guidId = match.Id;
        }

        bool deleted = await _eventService.DeleteEventPhotoAsync(guidId, photoId, ct);
        if (!deleted)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail("Photo not found"));
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Photo deleted successfully"));
    }
}
