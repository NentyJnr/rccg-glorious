using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public class ServiceReportService : IServiceReportService
{
    private readonly ICmsDbContext _dbContext;
    private readonly IValidator<CreateServiceReportCommand> _validator;

    public ServiceReportService(ICmsDbContext dbContext, IValidator<CreateServiceReportCommand> validator)
    {
        _dbContext = dbContext;
        _validator = validator;
    }

    public async Task<ServiceReportResultDto> CreateServiceReportAsync(CreateServiceReportCommand command, CancellationToken ct = default)
    {
        var validationResult = await _validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            throw new ValidationException(errors);
        }

        var serviceType = await _dbContext.ServiceTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == command.ServiceTypeId, ct);

        if (serviceType == null)
        {
            throw new ArgumentException("Invalid ServiceType specified.");
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
        await _dbContext.SaveChangesAsync(ct);

        var preacher = command.PreacherMinisterId.HasValue
            ? await _dbContext.Ministers.AsNoTracking().FirstOrDefaultAsync(m => m.Id == command.PreacherMinisterId.Value, ct)
            : null;

        return new ServiceReportResultDto(
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
    }

    public async Task<List<ServiceReportResultDto>> GetAllReportsAsync(int page = 1, int pageSize = 50, CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var reports = await _dbContext.ServiceReports
            .Include(r => r.ServiceType)
            .Include(r => r.PreacherMinister)
            .Include(r => r.OfferingBreakdown)
            .ThenInclude(o => o.OfferingCategory)
            .AsNoTracking()
            .OrderByDescending(r => r.ServiceDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return reports.Select(r => new ServiceReportResultDto(
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
    }
}
