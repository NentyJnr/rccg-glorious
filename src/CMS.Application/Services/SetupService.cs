using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public class SetupService : ISetupService
{
    private readonly ICmsDbContext _dbContext;

    public SetupService(ICmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrganizationSetting> GetOrganizationSettingsAsync(CancellationToken ct = default)
    {
        var settings = await _dbContext.OrganizationSettings.FirstOrDefaultAsync(ct);
        if (settings == null)
        {
            settings = new OrganizationSetting
            {
                ParishName = "RCCG Victory Parish",
                LogoUrl = "https://example.org/rccg-logo.png",
                BaseCurrency = "NGN"
            };
            _dbContext.OrganizationSettings.Add(settings);
            await _dbContext.SaveChangesAsync(ct);
        }

        return settings;
    }

    public async Task<OrganizationSetting> UpdateOrganizationSettingsAsync(OrganizationSetting request, CancellationToken ct = default)
    {
        var settings = await _dbContext.OrganizationSettings.FirstOrDefaultAsync(ct);
        if (settings == null)
        {
            settings = new OrganizationSetting();
            _dbContext.OrganizationSettings.Add(settings);
        }

        settings.ParishName = request.ParishName;
        settings.LogoUrl = request.LogoUrl;
        settings.BaseCurrency = request.BaseCurrency;
        settings.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(ct);
        return settings;
    }

    public async Task<List<Minister>> GetMinistersAsync(CancellationToken ct = default)
    {
        return await _dbContext.Ministers
            .AsNoTracking()
            .Where(m => m.IsActive)
            .OrderBy(m => m.FullName)
            .ToListAsync(ct);
    }

    public async Task<Minister> AddMinisterAsync(Minister minister, CancellationToken ct = default)
    {
        _dbContext.Ministers.Add(minister);
        await _dbContext.SaveChangesAsync(ct);
        return minister;
    }

    public async Task<List<ServiceType>> GetServiceTypesAsync(CancellationToken ct = default)
    {
        return await _dbContext.ServiceTypes
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .ToListAsync(ct);
    }

    public async Task<ServiceType> AddServiceTypeAsync(SaveServiceTypeDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Service type name is required.");

        var entity = new ServiceType
        {
            Name = request.Name.Trim(),
            Category = string.IsNullOrWhiteSpace(request.Category) ? "Sunday" : request.Category.Trim(),
            IsActive = request.IsActive
        };

        _dbContext.ServiceTypes.Add(entity);
        await _dbContext.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<ServiceType> UpdateServiceTypeAsync(string id, SaveServiceTypeDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Service type name is required.");

        ServiceType? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id == guidId, ct);
        }

        if (existing == null)
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Name == request.Name || s.Id.ToString() == id, ct);
        }

        if (existing == null)
        {
            existing = new ServiceType
            {
                Name = request.Name.Trim(),
                Category = string.IsNullOrWhiteSpace(request.Category) ? "Sunday" : request.Category.Trim(),
                IsActive = request.IsActive
            };
            _dbContext.ServiceTypes.Add(existing);
        }
        else
        {
            existing.Name = request.Name.Trim();
            existing.Category = string.IsNullOrWhiteSpace(request.Category) ? existing.Category : request.Category.Trim();
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteServiceTypeAsync(string id, CancellationToken ct = default)
    {
        ServiceType? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id == guidId, ct);
        }

        if (existing == null)
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id.ToString() == id, ct);
        }

        if (existing != null)
        {
            existing.IsActive = false;
            await _dbContext.SaveChangesAsync(ct);
            return true;
        }

        return false;
    }

    public async Task<List<OfferingCategory>> GetOfferingCategoriesAsync(CancellationToken ct = default)
    {
        return await _dbContext.OfferingCategories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync(ct);
    }

    public async Task<OfferingCategory> AddOfferingCategoryAsync(SaveOfferingCategoryDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Offering category name is required.");

        var code = string.IsNullOrWhiteSpace(request.Code)
            ? request.Name.Substring(0, Math.Min(4, request.Name.Length)).ToUpper()
            : request.Code;

        var entity = new OfferingCategory
        {
            Name = request.Name.Trim(),
            Code = code.Trim(),
            IsActive = request.IsActive
        };

        _dbContext.OfferingCategories.Add(entity);
        await _dbContext.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<OfferingCategory> UpdateOfferingCategoryAsync(string id, SaveOfferingCategoryDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Offering category name is required.");

        OfferingCategory? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Id == guidId, ct);
        }

        if (existing == null)
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Code == id || c.Name == request.Name || c.Id.ToString() == id, ct);
        }

        if (existing == null)
        {
            var code = string.IsNullOrWhiteSpace(request.Code)
                ? request.Name.Substring(0, Math.Min(4, request.Name.Length)).ToUpper()
                : request.Code;

            existing = new OfferingCategory
            {
                Name = request.Name.Trim(),
                Code = code.Trim(),
                IsActive = request.IsActive
            };
            _dbContext.OfferingCategories.Add(existing);
        }
        else
        {
            existing.Name = request.Name.Trim();
            if (!string.IsNullOrWhiteSpace(request.Code)) existing.Code = request.Code.Trim();
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteOfferingCategoryAsync(string id, CancellationToken ct = default)
    {
        OfferingCategory? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Id == guidId, ct);
        }

        if (existing == null)
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Code == id || c.Id.ToString() == id, ct);
        }

        if (existing != null)
        {
            existing.IsActive = false;
            await _dbContext.SaveChangesAsync(ct);
            return true;
        }

        return false;
    }

    public async Task<List<Department>> GetDepartmentsAsync(CancellationToken ct = default)
    {
        return await _dbContext.Departments
            .AsNoTracking()
            .Where(d => d.IsActive)
            .OrderBy(d => d.Name)
            .ToListAsync(ct);
    }

    public async Task<Department> AddDepartmentAsync(SaveDepartmentDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Department name is required.");

        var code = string.IsNullOrWhiteSpace(request.Code)
            ? request.Name.Substring(0, Math.Min(3, request.Name.Length)).ToUpper() + "-01"
            : request.Code;

        var entity = new Department
        {
            Name = request.Name.Trim(),
            Code = code.Trim(),
            HeadOfDepartment = request.HeadOfDepartment?.Trim() ?? "",
            Description = request.Description?.Trim() ?? "",
            MeetingSchedule = request.MeetingSchedule?.Trim() ?? "",
            IsActive = request.IsActive
        };

        _dbContext.Departments.Add(entity);
        await _dbContext.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<Department> UpdateDepartmentAsync(string id, SaveDepartmentDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Department name is required.");

        Department? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == guidId, ct);
        }

        if (existing == null)
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Code == id || d.Name == request.Name || d.Id.ToString() == id, ct);
        }

        if (existing == null)
        {
            var code = string.IsNullOrWhiteSpace(request.Code)
                ? request.Name.Substring(0, Math.Min(3, request.Name.Length)).ToUpper() + "-01"
                : request.Code;

            existing = new Department
            {
                Name = request.Name.Trim(),
                Code = code.Trim(),
                HeadOfDepartment = request.HeadOfDepartment?.Trim() ?? "",
                Description = request.Description?.Trim() ?? "",
                MeetingSchedule = request.MeetingSchedule?.Trim() ?? "",
                IsActive = request.IsActive
            };
            _dbContext.Departments.Add(existing);
        }
        else
        {
            existing.Name = request.Name.Trim();
            if (!string.IsNullOrWhiteSpace(request.Code)) existing.Code = request.Code.Trim();
            if (request.HeadOfDepartment != null) existing.HeadOfDepartment = request.HeadOfDepartment.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.MeetingSchedule != null) existing.MeetingSchedule = request.MeetingSchedule.Trim();
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteDepartmentAsync(string id, CancellationToken ct = default)
    {
        Department? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == guidId, ct);
        }

        if (existing == null)
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Code == id || d.Id.ToString() == id, ct);
        }

        if (existing != null)
        {
            existing.IsActive = false;
            await _dbContext.SaveChangesAsync(ct);
            return true;
        }

        return false;
    }
}
