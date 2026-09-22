using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class ApplicationUser : BaseAuditableEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // SystemAdmin, UsheringDepartment, HouseFellowshipLeader
    public string PasswordHash { get; set; } = string.Empty;
    public bool MustChangePassword { get; set; } = true;
    public bool IsActive { get; set; } = true;
}
