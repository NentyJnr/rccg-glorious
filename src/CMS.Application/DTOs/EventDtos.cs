namespace CMS.Application.DTOs;

public class EventSpeakerDto
{
    public Guid Id { get; set; }
    public Guid ParishEventId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string EcclesiasticalTitle { get; set; } = "Pastor";
    public string MinistryRole { get; set; } = "Guest Speaker";
    public string? PhotoUrl { get; set; }
    public string? Organization { get; set; }
    public string? ShortBio { get; set; }
    public int DisplayOrder { get; set; }
}

public class ParishEventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string TimeString { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public bool IsFeatured { get; set; }
    public bool RegistrationRequired { get; set; }
    public string Status { get; set; } = "Upcoming";
    public int? MaxCapacity { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public List<EventSpeakerDto> Speakers { get; set; } = new();
}

public class CreateSpeakerRequestDto
{
    public string FullName { get; set; } = string.Empty;
    public string EcclesiasticalTitle { get; set; } = "Pastor";
    public string MinistryRole { get; set; } = "Guest Speaker";
    public string? PhotoUrl { get; set; }
    public string? Organization { get; set; }
    public string? ShortBio { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

public class CreateParishEventRequestDto
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
    public string Status { get; set; } = "Upcoming";
    public int? MaxCapacity { get; set; }
    public List<CreateSpeakerRequestDto> Speakers { get; set; } = new();
}

public class UpdateParishEventRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string TimeString { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public bool IsFeatured { get; set; }
    public bool RegistrationRequired { get; set; }
    public string Status { get; set; } = "Upcoming";
    public int? MaxCapacity { get; set; }
    public List<CreateSpeakerRequestDto> Speakers { get; set; } = new();
}
