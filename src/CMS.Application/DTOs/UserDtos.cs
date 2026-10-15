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

