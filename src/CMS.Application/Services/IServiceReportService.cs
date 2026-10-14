using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface IServiceReportService
{
    Task<ServiceReportResultDto> CreateServiceReportAsync(CreateServiceReportCommand command, CancellationToken ct = default);
    Task<List<ServiceReportResultDto>> GetAllReportsAsync(int page = 1, int pageSize = 50, CancellationToken ct = default);
}
