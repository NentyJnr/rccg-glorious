namespace CMS.Application.DTOs;

public class EventPhotoDto
{
    public Guid Id { get; set; }
    public Guid ParishEventId { get; set; }
    public string PhotoUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public string? Photographer { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsCover { get; set; }
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; } = "image/jpeg";
    public DateTime CreatedAtUtc { get; set; }
}

public class UpdateEventPhotoRequestDto
{
    public string? Caption { get; set; }
    public string? Photographer { get; set; }
    public int DisplayOrder { get; set; }
}
