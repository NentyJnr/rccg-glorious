using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/service-reports")]
public class ServiceReportsController : ControllerBase
{
    private readonly IServiceReportService _reportService;

    public ServiceReportsController(IServiceReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateServiceReport([FromBody] CreateServiceReportCommand command, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _reportService.CreateServiceReportAsync(command, cancellationToken);
            return Ok(ApiResponseEnvelope<ServiceReportResultDto>.Ok(result, "Service report submitted successfully."));
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors.Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponseEnvelope<ServiceReportResultDto>.Fail("Validation failed.", errors));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<ServiceReportResultDto>.Fail(ex.Message));
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllReports([FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var reports = await _reportService.GetAllReportsAsync(page, pageSize, cancellationToken);
        return Ok(ApiResponseEnvelope<List<ServiceReportResultDto>>.Ok(reports, "Service reports retrieved successfully."));
    }
}
