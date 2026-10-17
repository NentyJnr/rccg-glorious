using System.Collections.Concurrent;
using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public class UserService : IUserService
{
    private readonly ICmsDbContext _context;

    // Thread-safe in-memory store for Role Permissions Matrix
    private static readonly ConcurrentDictionary<string, RolePermissionDto> _rolePermissions = new(StringComparer.OrdinalIgnoreCase);

    // Thread-safe in-memory store for Staff Email Change Requests
    private static readonly ConcurrentDictionary<Guid, StaffEmailChangeRequestDto> _emailRequests = new();

    static UserService()
    {
        InitializeDefaultRolePermissions();
    }

    public UserService(ICmsDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserListItemDto>> GetUsersAsync(CancellationToken ct = default)
    {
        var users = await _context.Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAtUtc)
            .ToListAsync(ct);

        return users.Select(u => new UserListItemDto(
            u.Id,
            u.FullName,
            u.Email,
            u.Phone,
            string.IsNullOrWhiteSpace(u.Role) ? "Member" : u.Role,
            u.IsActive,
            u.CreatedAtUtc,
            $"RCCG-STF-{u.Id.ToString()[..5].ToUpperInvariant()}"
        )).ToList();
    }

    public async Task<UserListItemDto> AssignRoleAsync(AssignRoleRequestDto request, CancellationToken ct = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID '{request.UserId}' was not found.");
        }

        user.Role = request.Role;
        user.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        return new UserListItemDto(
            user.Id,
            user.FullName,
            user.Email,
            user.Phone,
            user.Role,
            user.IsActive,
            user.CreatedAtUtc,
            $"RCCG-STF-{user.Id.ToString()[..5].ToUpperInvariant()}"
        );
    }

    public async Task<UserListItemDto> RevokeRoleAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID '{userId}' was not found.");
        }

        user.Role = "Member";
        user.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        return new UserListItemDto(
            user.Id,
            user.FullName,
            user.Email,
            user.Phone,
            user.Role,
            user.IsActive,
            user.CreatedAtUtc,
            $"RCCG-STF-{user.Id.ToString()[..5].ToUpperInvariant()}"
        );
    }

    public Task<List<RolePermissionDto>> GetRolePermissionsAsync(CancellationToken ct = default)
    {
        return Task.FromResult(_rolePermissions.Values.OrderBy(r => r.Role).ToList());
    }

    public Task<RolePermissionDto> SaveRolePermissionsAsync(SaveRolePermissionsRequestDto request, CancellationToken ct = default)
    {
        var updated = new RolePermissionDto(
            request.Role,
            request.Permissions,
            _rolePermissions.TryGetValue(request.Role, out var existing) ? existing.Description : "Custom configured parish role.",
            existing?.ClientSpecification
        );

        _rolePermissions[request.Role] = updated;
        return Task.FromResult(updated);
    }

    public Task<List<StaffEmailChangeRequestDto>> GetEmailChangeRequestsAsync(CancellationToken ct = default)
    {
        return Task.FromResult(_emailRequests.Values.OrderByDescending(r => r.RequestedAtUtc).ToList());
    }

    public async Task<StaffEmailChangeRequestDto> SubmitEmailChangeRequestAsync(SubmitEmailChangeRequestDto request, CancellationToken ct = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID '{request.UserId}' was not found.");
        }

        var newReq = new StaffEmailChangeRequestDto(
            Guid.NewGuid(),
            user.Id,
            user.FullName,
            user.Email,
            request.ProposedEmail.ToLowerInvariant(),
            request.Reason,
            "Pending",
            DateTime.UtcNow
        );

        _emailRequests[newReq.Id] = newReq;
        return newReq;
    }

    public async Task<bool> ReviewEmailChangeRequestAsync(Guid requestId, ReviewEmailChangeRequestDto request, CancellationToken ct = default)
    {
        if (!_emailRequests.TryGetValue(requestId, out var emailReq))
        {
            throw new KeyNotFoundException($"Email change request with ID '{requestId}' was not found.");
        }

        if (request.Approve)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == emailReq.UserId, ct);
            if (user != null)
            {
                user.Email = emailReq.ProposedEmail;
                user.UpdatedAtUtc = DateTime.UtcNow;
                await _context.SaveChangesAsync(ct);
            }

            _emailRequests[requestId] = emailReq with
            {
                Status = "Approved",
                ReviewedAtUtc = DateTime.UtcNow
            };
        }
        else
        {
            _emailRequests[requestId] = emailReq with
            {
                Status = "Rejected",
                ReviewedAtUtc = DateTime.UtcNow
            };
        }

        return true;
    }

    private static void InitializeDefaultRolePermissions()
    {
        var allPermissions = new List<string>
        {
            "users.view", "users.manage", "users.roles",
            "reports.view", "reports.create", "reports.finance",
            "events.view", "events.manage", "ministers.manage",
            "fellowship.view", "fellowship.manage",
            "outreach.view", "outreach.manage",
            "testimonies.view", "testimonies.manage",
            "setup.organization", "setup.departments", "setup.services"
        };

        _rolePermissions["SuperAdmin"] = new RolePermissionDto(
            "SuperAdmin",
            allPermissions,
            "Full master platform governance, infrastructure setup, security policies, and financial authorization.",
            "Client Specification: SuperAdmin has complete, unrestricted access across all portal modules."
        );

        _rolePermissions["SystemAdmin"] = new RolePermissionDto(
            "SystemAdmin",
            allPermissions.Where(p => p != "setup.organization").ToList(),
            "Full operations management, user onboarding, staff roster, and system configurations.",
            "Client Specification: SystemAdmin has executive administrative authority across all operational modules."
        );

        _rolePermissions["Pastor"] = new RolePermissionDto(
            "Pastor",
            new List<string>
            {
                "users.view", "reports.view", "reports.create", "reports.finance",
                "events.view", "events.manage", "ministers.manage",
                "fellowship.view", "outreach.view", "testimonies.view", "testimonies.manage"
            },
            "Executive pastoral oversight, pulpit ministry, service approvals, and spiritual reports review.",
            "Client Specification: Pastor role has executive spiritual oversight and financial visibility, with system infrastructure reserved for SuperAdmin."
        );

        _rolePermissions["Minister"] = new RolePermissionDto(
            "Minister",
            new List<string>
            {
                "users.view", "reports.view", "reports.create",
                "events.view", "fellowship.view", "outreach.view", "testimonies.view"
            },
            "Ordained pastoral and pulpit ministry, event ministrations, and counseling.",
            "Client Specification: Minister role can log and view reports, participate in event speaker agendas."
        );

        _rolePermissions["HOD"] = new RolePermissionDto(
            "HOD",
            new List<string>
            {
                "users.view", "reports.view", "reports.create",
                "events.view", "fellowship.view", "outreach.view"
            },
            "Departmental head leading protocol, choir, media, or outreach operations.",
            "Client Specification: HOD has departmental roster and report submission authorization."
        );

        _rolePermissions["Workforce"] = new RolePermissionDto(
            "Workforce",
            new List<string> { "events.view", "fellowship.view", "outreach.view", "testimonies.view" },
            "Active parish worker serving across service rotas and departments.",
            "Client Specification: Workforce members have operational service visibility."
        );

        _rolePermissions["Member"] = new RolePermissionDto(
            "Member",
            new List<string> { "events.view", "testimonies.view" },
            "Parish congregation member accessing public and community portal services.",
            "Client Specification: Standard congregation member privileges."
        );
    }
}
