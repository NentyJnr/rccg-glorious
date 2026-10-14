namespace CMS.Application.DTOs;

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
