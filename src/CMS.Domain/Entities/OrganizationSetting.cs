using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class OrganizationSetting : BaseAuditableEntity
{
    public string ParishName { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string BaseCurrency { get; set; } = "NGN"; // e.g. NGN, USD, GBP
}
