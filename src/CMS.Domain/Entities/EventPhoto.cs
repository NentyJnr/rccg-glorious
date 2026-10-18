using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class EventPhoto : BaseAuditableEntity
{
    public Guid ParishEventId { get; set; }
    public ParishEvent ParishEvent { get; set; } = null!;

    public string PhotoUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public string? Photographer { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsCover { get; set; } = false;
    public long FileSizeBytes { get; set; } = 0;
    public string ContentType { get; set; } = "image/jpeg";
}
