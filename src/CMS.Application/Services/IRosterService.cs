using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface IRosterService
{
    Task<List<MonthlyDepartmentRosterDto>> GetRostersAsync(string? departmentName, string? monthYear, CancellationToken ct = default);
    Task<MonthlyDepartmentRosterDto> SaveRosterAsync(MonthlyDepartmentRosterDto request, CancellationToken ct = default);
    Task<MonthlyDepartmentRosterDto?> SubmitRosterForApprovalAsync(string id, CancellationToken ct = default);
    Task<MonthlyDepartmentRosterDto?> ApproveRosterAsync(string id, string approvedBy, CancellationToken ct = default);
    Task<List<DutyAssignmentDto>> GetMyAssignedDutiesAsync(string personName, CancellationToken ct = default);
}
