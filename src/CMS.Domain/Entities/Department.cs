using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class Department : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string HeadOfDepartment { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MeetingSchedule { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
