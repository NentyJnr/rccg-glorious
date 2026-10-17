using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface IUserService
{
    Task<List<UserListItemDto>> GetUsersAsync(CancellationToken ct = default);
    Task<UserListItemDto> AssignRoleAsync(AssignRoleRequestDto request, CancellationToken ct = default);
    Task<UserListItemDto> RevokeRoleAsync(Guid userId, CancellationToken ct = default);
    Task<List<RolePermissionDto>> GetRolePermissionsAsync(CancellationToken ct = default);
    Task<RolePermissionDto> SaveRolePermissionsAsync(SaveRolePermissionsRequestDto request, CancellationToken ct = default);
    Task<List<StaffEmailChangeRequestDto>> GetEmailChangeRequestsAsync(CancellationToken ct = default);
    Task<StaffEmailChangeRequestDto> SubmitEmailChangeRequestAsync(SubmitEmailChangeRequestDto request, CancellationToken ct = default);
    Task<bool> ReviewEmailChangeRequestAsync(Guid requestId, ReviewEmailChangeRequestDto request, CancellationToken ct = default);
}
