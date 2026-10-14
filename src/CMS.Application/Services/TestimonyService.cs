using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public class TestimonyService : ITestimonyService
{
    private readonly ICmsDbContext _context;

    public TestimonyService(ICmsDbContext context)
    {
        _context = context;
    }

    public async Task<List<TestimonyDto>> GetApprovedTestimoniesAsync(CancellationToken ct = default)
    {
        return await _context.Testimonies
            .AsNoTracking()
            .Where(t => t.IsApproved)
            .OrderByDescending(t => t.SubmittedAt)
            .Select(t => new TestimonyDto
            {
                Id = t.Id,
                FullName = t.FullName,
                Category = t.Category,
                Title = t.Title,
                Content = t.Content,
                AllowPublicSharing = t.AllowPublicSharing,
                IsApproved = t.IsApproved,
                SubmittedAt = t.SubmittedAt
            })
            .ToListAsync(ct);
    }

    public async Task<TestimonyDto> SubmitTestimonyAsync(TestimonySubmissionDto dto, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Content))
        {
            throw new ArgumentException("Full Name and Testimony Story are required.");
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
            IsApproved = false, // Moderation gate: defaults to false pending approval
            SubmittedAt = DateTime.UtcNow
        };

        _context.Testimonies.Add(testimony);
        await _context.SaveChangesAsync(ct);

        return new TestimonyDto
        {
            Id = testimony.Id,
            FullName = testimony.FullName,
            Category = testimony.Category,
            Title = testimony.Title,
            Content = testimony.Content,
            AllowPublicSharing = testimony.AllowPublicSharing,
            IsApproved = testimony.IsApproved,
            SubmittedAt = testimony.SubmittedAt
        };
    }

    public async Task<bool> ApproveTestimonyAsync(Guid id, CancellationToken ct = default)
    {
        var testimony = await _context.Testimonies.FirstOrDefaultAsync(t => t.Id == id, ct);
        if (testimony == null) return false;

        testimony.IsApproved = true;
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
