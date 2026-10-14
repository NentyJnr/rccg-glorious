using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Route("api/[controller]")]
public class TestimoniesController : ControllerBase
{
    private readonly ITestimonyService _testimonyService;

    public TestimoniesController(ITestimonyService testimonyService)
    {
        _testimonyService = testimonyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTestimonies(CancellationToken ct)
    {
        var testimonies = await _testimonyService.GetApprovedTestimoniesAsync(ct);
        return Ok(ApiResponseEnvelope<List<TestimonyDto>>.Ok(testimonies, "Approved testimonies retrieved successfully."));
    }

    [HttpPost]
    public async Task<IActionResult> SubmitTestimony([FromBody] TestimonySubmissionDto dto, CancellationToken ct)
    {
        try
        {
            var testimony = await _testimonyService.SubmitTestimonyAsync(dto, ct);
            return Ok(ApiResponseEnvelope<TestimonyDto>.Ok(testimony, "Testimony submitted successfully and is awaiting pastoral review."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<TestimonyDto>.Fail(ex.Message));
        }
    }

    [HttpPut("{id:guid}/approve")]
    public async Task<IActionResult> ApproveTestimony(Guid id, CancellationToken ct)
    {
        bool approved = await _testimonyService.ApproveTestimonyAsync(id, ct);
        if (!approved)
        {
            return NotFound(ApiResponseEnvelope<bool>.Fail("Testimony not found."));
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Testimony approved for public church display."));
    }
}
