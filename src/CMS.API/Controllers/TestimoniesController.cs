using CMS.Application.Common.Interfaces;
using CMS.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimoniesController : ControllerBase
{
    private readonly ICmsDbContext _context;

    public TestimoniesController(ICmsDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTestimonies()
    {
        var testimonies = await _context.Testimonies
            .Where(t => t.IsApproved)
            .OrderByDescending(t => t.SubmittedAt)
            .ToListAsync();

        return Ok(new { success = true, data = testimonies });
    }

    [HttpPost]
    public async Task<IActionResult> SubmitTestimony([FromBody] TestimonySubmissionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Content))
        {
            return BadRequest(new { success = false, message = "Full Name and Testimony Story are required." });
        }

        var testimony = new Testimony
        {
            FullName = dto.FullName.Trim(),
            Email = dto.Email?.Trim() ?? string.Empty,
            Phone = dto.Phone?.Trim() ?? string.Empty,
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "General Grace" : dto.Category.Trim(),
            Title = string.IsNullOrWhiteSpace(dto.Title) ? "Glory to God for Divine Goodness" : dto.Title.Trim(),
            Content = dto.Content.Trim(),
            AllowPublicSharing = dto.AllowPublicSharing,
            IsApproved = true,
            SubmittedAt = DateTime.UtcNow
        };

        _context.Testimonies.Add(testimony);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Testimony saved successfully!", data = testimony });
    }
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
