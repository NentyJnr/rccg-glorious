namespace CMS.Domain.Entities;

public class Testimony
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Category { get; set; } = "General Grace";
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool AllowPublicSharing { get; set; } = true;
    public bool IsApproved { get; set; } = true;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
