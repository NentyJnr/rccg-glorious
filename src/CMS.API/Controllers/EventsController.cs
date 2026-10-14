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

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetEventById(Guid id, CancellationToken ct)
    {
        var ev = await _eventService.GetEventByIdAsync(id, ct);
        if (ev == null)
        {
            return NotFound(ApiResponseEnvelope<ParishEventDto>.Fail("Event not found"));
        }

        return Ok(ApiResponseEnvelope<ParishEventDto>.Ok(ev));
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] CreateParishEventRequestDto dto, CancellationToken ct)
    {
        try
        {
            var created = await _eventService.CreateEventAsync(dto, ct);
            return CreatedAtAction(nameof(GetEventById), new { id = created.Id }, ApiResponseEnvelope<ParishEventDto>.Ok(created, "Event created successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<ParishEventDto>.Fail(ex.Message));
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateParishEventRequestDto dto, CancellationToken ct)
    {
        var updated = await _eventService.UpdateEventAsync(id, dto, ct);
        if (updated == null)
        {
            return NotFound(ApiResponseEnvelope<ParishEventDto>.Fail("Event not found"));
        }

        return Ok(ApiResponseEnvelope<ParishEventDto>.Ok(updated, "Event updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id, CancellationToken ct)
    {
        bool deleted = await _eventService.DeleteEventAsync(id, ct);
        if (!deleted)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail("Event not found"));
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Event deleted successfully"));
    }
}
