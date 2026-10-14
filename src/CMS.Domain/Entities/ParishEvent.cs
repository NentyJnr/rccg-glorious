using CMS.Domain.Common;

namespace CMS.Domain.Entities;

public class ParishEvent : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string TimeString { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public bool IsFeatured { get; set; } = false;
    public bool RegistrationRequired { get; set; } = false;
    public string Status { get; set; } = "Upcoming"; // Upcoming, Completed, Cancelled
    public int? MaxCapacity { get; set; }

    public ICollection<EventSpeaker> Speakers { get; set; } = new List<EventSpeaker>();
}
