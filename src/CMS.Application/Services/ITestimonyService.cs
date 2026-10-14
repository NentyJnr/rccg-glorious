using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface ITestimonyService
{
    Task<List<TestimonyDto>> GetApprovedTestimoniesAsync(CancellationToken ct = default);
    Task<TestimonyDto> SubmitTestimonyAsync(TestimonySubmissionDto dto, CancellationToken ct = default);
    Task<bool> ApproveTestimonyAsync(Guid id, CancellationToken ct = default);
}
