using CMS.API.Common;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

public record DutyAssignmentDto(
    string Id,
    string ServiceDate,
    string ServiceTypeName,
    string DepartmentName,
    string DutyRole,
    string AssignedPersonName,
    string? AssignedPersonEmail,
    string Status
);

public record MonthlyDepartmentRosterDto(
    string Id,
    string MonthYear,
    string DepartmentName,
    string HodName,
    string Status,
    List<DutyAssignmentDto> Assignments,
    string? SubmittedAt,
    string? ApprovedAt,
    string? ApprovedBy
);

[ApiController]
[Route("api/v1/[controller]")]
public class RostersController : ControllerBase
{
    private static readonly List<MonthlyDepartmentRosterDto> MockRosters = new()
    {
        new MonthlyDepartmentRosterDto(
            "ros_1",
            "2026-10",
            "Ushering Department",
            "Sister Grace Usang",
            "Approved",
            new List<DutyAssignmentDto>
            {
                new("d1", "2026-10-04", "Sunday 1st Service", "Ushering Department", "Lead Usher", "Sister Grace Usang", "grace@rccgvictory.org", "Approved"),
                new("d2", "2026-10-04", "Sunday 1st Service", "Ushering Department", "Offering Collection Lead", "Brother Emmanuel", "emmanuel@gmail.com", "Approved"),
                new("d3", "2026-10-11", "Sunday 1st Service", "Ushering Department", "Sanctuary Protocol", "Sister Blessing Grace", "grace.b@yahoo.com", "Approved")
            },
            "2026-09-20T10:00:00Z",
            "2026-09-21T14:30:00Z",
            "Minister Emmanuel (Service Coordinator)"
        ),
        new MonthlyDepartmentRosterDto(
            "ros_2",
            "2026-10",
            "Choir & Praise Team",
            "Minister David Okafor",
            "SubmittedForApproval",
            new List<DutyAssignmentDto>
            {
                new("d4", "2026-10-04", "Sunday 1st Service", "Choir & Praise Team", "Worship Leader", "Minister David Okafor", "david@rccgvictory.org", "Submitted"),
                new("d5", "2026-10-04", "Sunday 1st Service", "Choir & Praise Team", "Backing Vocalist", "Sister Mary Johnson", "mary@rccgvictory.org", "Submitted")
            },
            "2026-09-22T08:15:00Z",
            null,
            null
        )
    };

    [HttpGet]
    public IActionResult GetRosters([FromQuery] string? departmentName, [FromQuery] string? monthYear)
    {
        var query = MockRosters.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(departmentName) && !string.Equals(departmentName, "All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(r => string.Equals(r.DepartmentName, departmentName, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(monthYear))
        {
            query = query.Where(r => string.Equals(r.MonthYear, monthYear, StringComparison.OrdinalIgnoreCase));
        }

        return Ok(ApiResponseEnvelope<List<MonthlyDepartmentRosterDto>>.Ok(query.ToList()));
    }

    [HttpPost]
    public IActionResult CreateOrUpdateRoster([FromBody] MonthlyDepartmentRosterDto request)
    {
        var existingIdx = MockRosters.FindIndex(r => r.Id == request.Id || (r.DepartmentName == request.DepartmentName && r.MonthYear == request.MonthYear));
        if (existingIdx >= 0)
        {
            MockRosters[existingIdx] = request;
        }
        else
        {
            MockRosters.Add(request);
        }

        return Ok(ApiResponseEnvelope<MonthlyDepartmentRosterDto>.Ok(request, "Monthly duty roster saved successfully."));
    }

    [HttpPost("{id}/submit")]
    public IActionResult SubmitRosterForApproval(string id)
    {
        var roster = MockRosters.FirstOrDefault(r => r.Id == id);
        if (roster == null)
            return NotFound(ApiResponseEnvelope<bool>.Fail("Roster not found."));

        var updated = roster with { Status = "SubmittedForApproval", SubmittedAt = DateTime.UtcNow.ToString("o") };
        var idx = MockRosters.IndexOf(roster);
        MockRosters[idx] = updated;

        return Ok(ApiResponseEnvelope<MonthlyDepartmentRosterDto>.Ok(updated, "Roster submitted to Service Coordinator for approval."));
    }

    [HttpPost("{id}/approve")]
    public IActionResult ApproveRoster(string id, [FromQuery] string approvedBy)
    {
        var roster = MockRosters.FirstOrDefault(r => r.Id == id);
        if (roster == null)
            return NotFound(ApiResponseEnvelope<bool>.Fail("Roster not found."));

        var updatedAssignments = roster.Assignments.Select(a => a with { Status = "Approved" }).ToList();
        var updated = roster with
        {
            Status = "Approved",
            ApprovedAt = DateTime.UtcNow.ToString("o"),
            ApprovedBy = string.IsNullOrWhiteSpace(approvedBy) ? "Service Coordinator" : approvedBy,
            Assignments = updatedAssignments
        };

        var idx = MockRosters.IndexOf(roster);
        MockRosters[idx] = updated;

        return Ok(ApiResponseEnvelope<MonthlyDepartmentRosterDto>.Ok(updated, $"Roster approved successfully. Email notifications dispatched to {updatedAssignments.Count} assigned workers/ministers."));
    }

    [HttpGet("my-duties")]
    public IActionResult GetMyAssignedDuties([FromQuery] string personName)
    {
        var assignments = MockRosters
            .SelectMany(r => r.Assignments)
            .Where(a => string.Equals(a.AssignedPersonName, personName, StringComparison.OrdinalIgnoreCase) ||
                        (a.AssignedPersonEmail != null && a.AssignedPersonEmail.Contains(personName, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        return Ok(ApiResponseEnvelope<List<DutyAssignmentDto>>.Ok(assignments));
    }
}
