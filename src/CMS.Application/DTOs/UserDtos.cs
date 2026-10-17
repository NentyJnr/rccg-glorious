namespace CMS.Application.DTOs;

public record OnboardUserRequestDto(
    string FullName,
    string Email,
    string Phone,
    string Role
);

public record OnboardUserResultDto(
    Guid UserId,
    string Email,
    string Message
);

public record LoginRequestDto(
    string Email,
    string Password
);

public record LoginResultDto(
    Guid UserId,
    string FullName,
    string Email,
    string Role,
    bool MustChangePassword,
    string Token
);

public record ChangePasswordRequestDto(
    Guid UserId,
    string CurrentPassword,
    string NewPassword
);

public record GoogleLoginRequestDto(
    string IdToken
);

public record MicrosoftLoginRequestDto(
    string IdToken
);

public record ExternalAuthUserDto(
    string Email,
    string FullName,
    string ExternalUserId,
    string Provider,
    string? AvatarUrl = null
);

public record UserListItemDto(
    Guid Id,
    string FullName,
    string Email,
    string Phone,
    string Role,
    bool IsActive,
    DateTime CreatedAtUtc,
    string? StaffCode = null
);

public record AssignRoleRequestDto(
    Guid UserId,
    string Role
);

public record RolePermissionDto(
    string Role,
    List<string> Permissions,
    string? Description = null,
    string? ClientSpecification = null
);

public record SaveRolePermissionsRequestDto(
    string Role,
    List<string> Permissions
);

public record StaffEmailChangeRequestDto(
    Guid Id,
    Guid UserId,
    string StaffName,
    string CurrentEmail,
    string ProposedEmail,
    string Reason,
    string Status, // Pending, Approved, Rejected
    DateTime RequestedAtUtc,
    DateTime? ReviewedAtUtc = null
);

public record SubmitEmailChangeRequestDto(
    Guid UserId,
    string ProposedEmail,
    string Reason
);

public record ReviewEmailChangeRequestDto(
    bool Approve,
    string? Note = null
);


