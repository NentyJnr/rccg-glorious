using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public class MemberService : IMemberService
{
    private readonly ICmsDbContext _dbContext;

    public MemberService(ICmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<MemberListItemDto>> GetMembersAsync(string? departmentName, CancellationToken ct = default)
    {
        var users = await _dbContext.Users
            .AsNoTracking()
            .Where(u => u.IsActive)
            .OrderBy(u => u.FullName)
            .ToListAsync(ct);

        var members = users.Select(u => new MemberListItemDto(
            u.Id.ToString(),
            u.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? u.FullName,
            u.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).Skip(1).FirstOrDefault() ?? "",
            u.FullName,
            u.Phone,
            u.Email,
            "Parish District, Lagos",
            15,
            "August",
            "Male",
            "Full Member",
            u.Role ?? "Ushering Department",
            u.Role,
            "2025-01-15"
        )).ToList();

        if (!string.IsNullOrWhiteSpace(departmentName) && !string.Equals(departmentName, "All", StringComparison.OrdinalIgnoreCase))
        {
            members = members.Where(m => string.Equals(m.AssignedDepartment, departmentName, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return members;
    }

    public async Task<MemberListItemDto> RegisterMemberAsync(RegisterMemberRequestDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException("Full name is required.");

        var user = new ApplicationUser
        {
            FullName = request.FullName.Trim(),
            Email = string.IsNullOrWhiteSpace(request.Email) ? $"{Guid.NewGuid():N}@rccgglorious.org" : request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone?.Trim() ?? string.Empty,
            Role = request.Department ?? request.Role ?? "Member",
            IsActive = true,
            MustChangePassword = false,
            PasswordHash = string.Empty
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(ct);

        return new MemberListItemDto(
            user.Id.ToString(),
            user.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? user.FullName,
            user.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).Skip(1).FirstOrDefault() ?? "",
            user.FullName,
            user.Phone,
            user.Email,
            "Parish District, Lagos",
            15,
            "August",
            "Male",
            "Full Member",
            user.Role,
            user.Role,
            DateTime.UtcNow.ToString("yyyy-MM-dd")
        );
    }
}
