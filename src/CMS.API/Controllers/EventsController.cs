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
}
