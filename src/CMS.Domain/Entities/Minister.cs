using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class Minister : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty; // Pastor, Deacon, Deaconess, Minister
    public string FullName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
