using CMS.API.Common;
using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/service-reports")]
public class ServiceReportsController : ControllerBase
{
    private readonly ICmsDbContext _dbContext;
    private readonly IValidator<CreateServiceReportCommand> _validator;

    public ServiceReportsController(ICmsDbContext dbContext, IValidator<CreateServiceReportCommand> validator)
    {
        _dbContext = dbContext;
        _validator = validator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateServiceReport([FromBody] CreateServiceReportCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponseEnvelope<ServiceReportResultDto>.Fail("Validation failed.", errors));
        }

        var serviceType = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id == command.ServiceTypeId, cancellationToken);
        if (serviceType == null)
        {
            return BadRequest(ApiResponseEnvelope<ServiceReportResultDto>.Fail("Invalid ServiceType specified."));
        }

        var report = new ServiceReport
        {
            ServiceTypeId = command.ServiceTypeId,
            ServiceDate = command.ServiceDate,
            MenCount = command.MenCount,
            WomenCount = command.WomenCount,
            ChildrenCount = command.ChildrenCount,
            FirstTimersCount = command.FirstTimersCount,
            NewConvertsCount = command.NewConvertsCount,
            CreatedByUserId = command.CreatedByUserId
        };

        decimal totalOffering = 0;

        if (string.Equals(serviceType.Category, "Midweek", StringComparison.OrdinalIgnoreCase))
        {
            report.PreacherMinisterId = command.PreacherMinisterId;
            report.SingleOfferingAmount = command.SingleOfferingAmount;
            totalOffering = command.SingleOfferingAmount ?? 0;
        }
        else if (string.Equals(serviceType.Category, "Sunday", StringComparison.OrdinalIgnoreCase))
        {
            if (command.OfferingBreakdown != null)
            {
                foreach (var item in command.OfferingBreakdown)
                {
                    report.OfferingBreakdown.Add(new ServiceReportOffering
                    {
                        OfferingCategoryId = item.OfferingCategoryId,
                        Amount = item.Amount
                    });
                    totalOffering += item.Amount;
                }
            }
            report.TotalSundayOffering = totalOffering;
        }

        _dbContext.ServiceReports.Add(report);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var preacher = command.PreacherMinisterId.HasValue
            ? await _dbContext.Ministers.FirstOrDefaultAsync(m => m.Id == command.PreacherMinisterId.Value, cancellationToken)
            : null;

        var result = new ServiceReportResultDto(
            report.Id,
            serviceType.Name,
            serviceType.Category,
            report.ServiceDate,
            report.MenCount,
            report.WomenCount,
            report.ChildrenCount,
            report.TotalAttendance,
            report.FirstTimersCount,
            report.NewConvertsCount,
            preacher?.FullName,
            totalOffering
        );

        return Ok(ApiResponseEnvelope<ServiceReportResultDto>.Ok(result, "Service report submitted successfully."));
    }

    [HttpGet]
    public async Task<IActionResult> GetAllReports(CancellationToken cancellationToken)
    {
        var reports = await _dbContext.ServiceReports
            .Include(r => r.ServiceType)
            .Include(r => r.PreacherMinister)
            .Include(r => r.OfferingBreakdown)
            .ThenInclude(o => o.OfferingCategory)
            .OrderByDescending(r => r.ServiceDate)
            .ToListAsync(cancellationToken);

        var dtos = reports.Select(r => new ServiceReportResultDto(
            r.Id,
            r.ServiceType.Name,
            r.ServiceType.Category,
            r.ServiceDate,
            r.MenCount,
            r.WomenCount,
            r.ChildrenCount,
            r.TotalAttendance,
            r.FirstTimersCount,
            r.NewConvertsCount,
            r.PreacherMinister?.FullName,
            r.SingleOfferingAmount ?? r.TotalSundayOffering ?? 0
        )).ToList();

        return Ok(ApiResponseEnvelope<List<ServiceReportResultDto>>.Ok(dtos, "Service reports retrieved successfully."));
    }
}
