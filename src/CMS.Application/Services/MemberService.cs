using System.Text.Json;
using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CMS.Application.Services;

public class MemberService : IMemberService
{
    private readonly ICmsDbContext _dbContext;
    private readonly IEmailNotificationService _emailNotificationService;
    private readonly ILogger<MemberService> _logger;

    public MemberService(
        ICmsDbContext dbContext,
        IEmailNotificationService emailNotificationService,
        ILogger<MemberService> logger)
    {
        _dbContext = dbContext;
        _emailNotificationService = emailNotificationService;
        _logger = logger;
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

    public async Task<YouthRegistrationResponseDto> RegisterYouthProspectAsync(YouthRegistrationRequestDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException("Full name is required.");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email address is required.");
        if (string.IsNullOrWhiteSpace(request.Phone))
            throw new ArgumentException("WhatsApp / Phone number is required.");

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var normalizedPhone = request.Phone.Trim();

        var existingUser = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, ct);

        ApplicationUser user;
        if (existingUser != null)
        {
            user = existingUser;
            user.FullName = request.FullName.Trim();
            user.Phone = normalizedPhone;
            user.Role = "Youth Member";
            user.UpdatedAtUtc = DateTime.UtcNow;
        }
        else
        {
            user = new ApplicationUser
            {
                FullName = request.FullName.Trim(),
                Email = normalizedEmail,
                Phone = normalizedPhone,
                Role = "Youth Member",
                IsActive = true,
                MustChangePassword = false,
                PasswordHash = string.Empty
            };
            _dbContext.Users.Add(user);
        }

        await _dbContext.SaveChangesAsync(ct);

        // Dynamic Official Email Discovery:
        // 1. Locate the Youth Ministry department
        var youthDept = await _dbContext.Departments
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.IsActive && (d.Name.Contains("Youth") || d.Code.Contains("YTH")), ct);

        var recipientEmails = new List<string>();

        if (youthDept != null)
        {
            // Parse LeadershipCouncilJson if present
            if (!string.IsNullOrWhiteSpace(youthDept.LeadershipCouncilJson) && youthDept.LeadershipCouncilJson != "[]")
            {
                try
                {
                    var councilMembers = JsonSerializer.Deserialize<List<LeadershipCouncilMemberDto>>(
                        youthDept.LeadershipCouncilJson,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (councilMembers != null)
                    {
                        foreach (var m in councilMembers)
                        {
                            if (!string.IsNullOrWhiteSpace(m.Email))
                                recipientEmails.Add(m.Email.Trim().ToLowerInvariant());
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to parse Youth LeadershipCouncilJson");
                }
            }

            // Check HeadOfDepartment if set
            if (!string.IsNullOrWhiteSpace(youthDept.HeadOfDepartment) && youthDept.HeadOfDepartment != "Unassigned")
            {
                var hodName = youthDept.HeadOfDepartment.Trim().ToLowerInvariant();
                var hodUser = await _dbContext.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.IsActive && u.FullName.ToLower() == hodName, ct);

                if (hodUser != null && !string.IsNullOrWhiteSpace(hodUser.Email))
                {
                    recipientEmails.Add(hodUser.Email.Trim().ToLowerInvariant());
                }
            }
        }

        // Also check any user accounts with Youth HOD or President role
        var youthRoleUsers = await _dbContext.Users
            .AsNoTracking()
            .Where(u => u.IsActive && (u.Role == "HOD Youth" || u.Role == "Youth President" || u.Role == "Youth Leader"))
            .Select(u => u.Email)
            .ToListAsync(ct);

        foreach (var rEmail in youthRoleUsers)
        {
            if (!string.IsNullOrWhiteSpace(rEmail))
                recipientEmails.Add(rEmail.Trim().ToLowerInvariant());
        }

        recipientEmails = recipientEmails.Distinct(StringComparer.OrdinalIgnoreCase).ToList();

        // Dispatch alert notification to the resolved youth officials
        await _emailNotificationService.SendYouthRegistrationAlertAsync(
            recipientEmails,
            user.FullName,
            user.Email,
            user.Phone,
            request.Category ?? "Young Adult",
            request.PrimaryInterest ?? "Youth Fellowship & Leadership",
            ct);

        return new YouthRegistrationResponseDto(
            user.Id.ToString(),
            user.FullName,
            user.Email,
            user.Phone,
            "Youth Ministry",
            request.Category ?? "Young Adult",
            request.PrimaryInterest ?? "Youth Fellowship & Leadership",
            recipientEmails,
            $"Welcome {user.FullName}! Your registration has been received and our Youth Leadership team has been notified."
        );
    }
}

