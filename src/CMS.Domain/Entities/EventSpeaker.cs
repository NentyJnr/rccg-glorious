using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class EventSpeaker : BaseAuditableEntity
{
    public Guid ParishEventId { get; set; }
    public ParishEvent? ParishEvent { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EcclesiasticalTitle { get; set; } = "Pastor"; // Pastor, Deacon, Evangelist, Bishop, Minister
    public string MinistryRole { get; set; } = "Guest Speaker";  // Keynote Speaker, Host Minister, Worship Leader
    public string? PhotoUrl { get; set; }
    public string? Organization { get; set; }
    public string? ShortBio { get; set; }
    public int DisplayOrder { get; set; } = 0;
}
