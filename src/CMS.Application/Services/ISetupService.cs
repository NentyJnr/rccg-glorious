using CMS.Application.DTOs;
using CMS.Domain.Entities;

namespace CMS.Application.Services;

public interface ISetupService
{
    // Organization Settings
    Task<OrganizationSetting> GetOrganizationSettingsAsync(CancellationToken ct = default);
    Task<OrganizationSetting> UpdateOrganizationSettingsAsync(OrganizationSetting request, CancellationToken ct = default);

    // Ministers
    Task<List<Minister>> GetMinistersAsync(CancellationToken ct = default);
    Task<Minister> AddMinisterAsync(Minister minister, CancellationToken ct = default);

    // Service Types
    Task<List<ServiceType>> GetServiceTypesAsync(CancellationToken ct = default);
    Task<ServiceType> AddServiceTypeAsync(SaveServiceTypeDto request, CancellationToken ct = default);
    Task<ServiceType> UpdateServiceTypeAsync(string id, SaveServiceTypeDto request, CancellationToken ct = default);
    Task<bool> DeleteServiceTypeAsync(string id, CancellationToken ct = default);

    // Offering Categories
    Task<List<OfferingCategory>> GetOfferingCategoriesAsync(CancellationToken ct = default);
    Task<OfferingCategory> AddOfferingCategoryAsync(SaveOfferingCategoryDto request, CancellationToken ct = default);
    Task<OfferingCategory> UpdateOfferingCategoryAsync(string id, SaveOfferingCategoryDto request, CancellationToken ct = default);
    Task<bool> DeleteOfferingCategoryAsync(string id, CancellationToken ct = default);

    // Departments
    Task<List<Department>> GetDepartmentsAsync(CancellationToken ct = default);
    Task<Department> AddDepartmentAsync(SaveDepartmentDto request, CancellationToken ct = default);
    Task<Department> UpdateDepartmentAsync(string id, SaveDepartmentDto request, CancellationToken ct = default);
    Task<bool> DeleteDepartmentAsync(string id, CancellationToken ct = default);
}
