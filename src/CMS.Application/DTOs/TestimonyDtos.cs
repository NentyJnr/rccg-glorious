namespace CMS.Application.DTOs;

public class TestimonyDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool AllowPublicSharing { get; set; }
    public bool IsApproved { get; set; }
    public DateTime SubmittedAt { get; set; }
}

public class TestimonySubmissionDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Category { get; set; } = "General Grace";
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool AllowPublicSharing { get; set; } = true;
}
