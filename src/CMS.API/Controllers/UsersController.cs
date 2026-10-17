using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers(CancellationToken ct)
    {
        var users = await _userService.GetUsersAsync(ct);
        return Ok(ApiResponseEnvelope<List<UserListItemDto>>.Ok(users, "User roster retrieved successfully."));
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> AssignRole(Guid id, [FromBody] AssignRoleRequestDto request, CancellationToken ct)
    {
        try
        {
            var req = request with { UserId = id };
            var updated = await _userService.AssignRoleAsync(req, ct);
            return Ok(ApiResponseEnvelope<UserListItemDto>.Ok(updated, $"Role '{updated.Role}' assigned successfully to {updated.FullName}."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponseEnvelope<UserListItemDto>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponseEnvelope<UserListItemDto>.Fail(ex.Message));
        }
    }

    [HttpPost("{id}/revoke-role")]
    public async Task<IActionResult> RevokeRole(Guid id, CancellationToken ct)
    {
        try
        {
            var updated = await _userService.RevokeRoleAsync(id, ct);
            return Ok(ApiResponseEnvelope<UserListItemDto>.Ok(updated, $"Specialized role revoked for {updated.FullName}. Reverted to Member."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponseEnvelope<UserListItemDto>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponseEnvelope<UserListItemDto>.Fail(ex.Message));
        }
    }

    [HttpGet("permissions")]
    public async Task<IActionResult> GetRolePermissions(CancellationToken ct)
    {
        var permissions = await _userService.GetRolePermissionsAsync(ct);
        return Ok(ApiResponseEnvelope<List<RolePermissionDto>>.Ok(permissions, "Role permissions matrix retrieved successfully."));
    }

    [HttpPut("permissions")]
    public async Task<IActionResult> SaveRolePermissions([FromBody] SaveRolePermissionsRequestDto request, CancellationToken ct)
    {
        var updated = await _userService.SaveRolePermissionsAsync(request, ct);
        return Ok(ApiResponseEnvelope<RolePermissionDto>.Ok(updated, $"Permissions for role '{request.Role}' updated successfully."));
    }

    [HttpGet("email-requests")]
    public async Task<IActionResult> GetEmailChangeRequests(CancellationToken ct)
    {
        var requests = await _userService.GetEmailChangeRequestsAsync(ct);
        return Ok(ApiResponseEnvelope<List<StaffEmailChangeRequestDto>>.Ok(requests, "Staff email change requests retrieved successfully."));
    }

    [HttpPost("{id}/email-request")]
    public async Task<IActionResult> SubmitEmailChangeRequest(Guid id, [FromBody] SubmitEmailChangeRequestDto request, CancellationToken ct)
    {
        try
        {
            var req = request with { UserId = id };
            var result = await _userService.SubmitEmailChangeRequestAsync(req, ct);
            return Ok(ApiResponseEnvelope<StaffEmailChangeRequestDto>.Ok(result, "Email change request submitted for administrative review."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponseEnvelope<StaffEmailChangeRequestDto>.Fail(ex.Message));
        }
    }

    [HttpPost("email-requests/{requestId}/review")]
    public async Task<IActionResult> ReviewEmailChangeRequest(Guid requestId, [FromBody] ReviewEmailChangeRequestDto request, CancellationToken ct)
    {
        try
        {
            await _userService.ReviewEmailChangeRequestAsync(requestId, request, ct);
            string actionText = request.Approve ? "approved and user profile email updated" : "rejected";
            return Ok(ApiResponseEnvelope<bool>.Ok(true, $"Email change request {actionText} successfully."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail(ex.Message));
        }
    }
}
