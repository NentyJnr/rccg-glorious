using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class RostersController : ControllerBase
{
    private readonly IRosterService _rosterService;

    public RostersController(IRosterService rosterService)
    {
        _rosterService = rosterService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRosters([FromQuery] string? departmentName, [FromQuery] string? monthYear, CancellationToken ct)
    {
        var rosters = await _rosterService.GetRostersAsync(departmentName, monthYear, ct);
        return Ok(ApiResponseEnvelope<List<MonthlyDepartmentRosterDto>>.Ok(rosters, "Department rosters retrieved successfully."));
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrUpdateRoster([FromBody] MonthlyDepartmentRosterDto request, CancellationToken ct)
    {
        var saved = await _rosterService.SaveRosterAsync(request, ct);
        return Ok(ApiResponseEnvelope<MonthlyDepartmentRosterDto>.Ok(saved, "Monthly duty roster saved successfully."));
    }

    [HttpPost("{id}/submit")]
    public async Task<IActionResult> SubmitRosterForApproval(string id, CancellationToken ct)
    {
        var updated = await _rosterService.SubmitRosterForApprovalAsync(id, ct);
        if (updated == null)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail("Roster not found."));
        }

        return Ok(ApiResponseEnvelope<MonthlyDepartmentRosterDto>.Ok(updated, "Roster submitted to Service Coordinator for approval."));
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveRoster(string id, [FromQuery] string approvedBy, CancellationToken ct)
    {
        var updated = await _rosterService.ApproveRosterAsync(id, approvedBy, ct);
        if (updated == null)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail("Roster not found."));
        }

        return Ok(ApiResponseEnvelope<MonthlyDepartmentRosterDto>.Ok(updated, "Roster approved successfully."));
    }

    [HttpGet("my-duties")]
    public async Task<IActionResult> GetMyAssignedDuties([FromQuery] string personName, CancellationToken ct)
    {
        var assignments = await _rosterService.GetMyAssignedDutiesAsync(personName, ct);
        return Ok(ApiResponseEnvelope<List<DutyAssignmentDto>>.Ok(assignments, "Assigned duties retrieved successfully."));
    }
}
