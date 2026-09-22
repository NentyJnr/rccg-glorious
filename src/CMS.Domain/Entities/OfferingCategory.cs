using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class OfferingCategory : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty; // Workers, Sunday School, Children, Thanksgiving, Firstfruit, etc.
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
