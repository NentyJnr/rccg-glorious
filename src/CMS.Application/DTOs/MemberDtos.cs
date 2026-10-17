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

public record YouthRegistrationRequestDto(
    string FullName,
    string Email,
    string Phone,
    string? Category,
    string? PrimaryInterest
);

public record YouthRegistrationResponseDto(
    string Id,
    string FullName,
    string Email,
    string Phone,
    string Department,
    string Category,
    string PrimaryInterest,
    List<string> NotifiedOfficials,
    string Message
);

public class LeadershipCouncilMemberDto
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? RoleTitle { get; set; }
}


