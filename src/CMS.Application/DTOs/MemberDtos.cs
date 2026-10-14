namespace CMS.Application.DTOs;

public record MemberListItemDto(
    string Id,
    string Surname,
    string Firstname,
    string FullName,
    string WhatsappNumber,
    string Email,
    string HomeAddress,
    int DobDay,
    string DobMonth,
    string Gender,
    string MembershipStatus,
    string AssignedDepartment,
    string? Role,
    string DateJoined
);

public record RegisterMemberRequestDto(
    string FullName,
    string Email,
    string Phone,
    string? Role,
    string? Department
);
