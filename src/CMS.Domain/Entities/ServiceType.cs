using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class ServiceType : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty; // Digging Deep, Faith Clinic, 1st Service, Sunday School
    public string Category { get; set; } = string.Empty; // "Midweek" or "Sunday"
    public bool IsActive { get; set; } = true;
}
