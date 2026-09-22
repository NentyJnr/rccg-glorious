using CMS.API.Common;
using CMS.Application.Common.Interfaces;
using CMS.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class SetupController : ControllerBase
{
    private readonly ICmsDbContext _dbContext;

    public SetupController(ICmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("organization")]
    public async Task<IActionResult> GetOrganizationSettings(CancellationToken cancellationToken)
    {
        var settings = await _dbContext.OrganizationSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings == null)
        {
            settings = new OrganizationSetting
            {
                ParishName = "RCCG Victory Parish",
                LogoUrl = "https://example.org/rccg-logo.png",
                BaseCurrency = "NGN"
            };
            _dbContext.OrganizationSettings.Add(settings);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(ApiResponseEnvelope<OrganizationSetting>.Ok(settings));
    }

    [HttpPut("organization")]
    public async Task<IActionResult> UpdateOrganizationSettings([FromBody] OrganizationSetting request, CancellationToken cancellationToken)
    {
        var settings = await _dbContext.OrganizationSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings == null)
        {
            settings = new OrganizationSetting();
            _dbContext.OrganizationSettings.Add(settings);
        }

        settings.ParishName = request.ParishName;
        settings.LogoUrl = request.LogoUrl;
        settings.BaseCurrency = request.BaseCurrency;
        settings.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<OrganizationSetting>.Ok(settings, "Organization settings updated successfully."));
    }

    [HttpGet("ministers")]
    public async Task<IActionResult> GetMinisters(CancellationToken cancellationToken)
    {
        var ministers = await _dbContext.Ministers
            .Where(m => m.IsActive)
            .OrderBy(m => m.FullName)
            .ToListAsync(cancellationToken);

        return Ok(ApiResponseEnvelope<List<Minister>>.Ok(ministers));
    }

    [HttpPost("ministers")]
    public async Task<IActionResult> AddMinister([FromBody] Minister minister, CancellationToken cancellationToken)
    {
        _dbContext.Ministers.Add(minister);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<Minister>.Ok(minister, "Minister added successfully."));
    }

    [HttpGet("service-types")]
    public async Task<IActionResult> GetServiceTypes(CancellationToken cancellationToken)
    {
        var serviceTypes = await _dbContext.ServiceTypes
            .Where(s => s.IsActive)
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .ToListAsync(cancellationToken);

        return Ok(ApiResponseEnvelope<List<ServiceType>>.Ok(serviceTypes));
    }

    [HttpPost("service-types")]
    public async Task<IActionResult> AddServiceType([FromBody] SaveServiceTypeDto request, CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(ApiResponseEnvelope<ServiceType>.Fail("Service type name is required."));

        var entity = new ServiceType
        {
            Name = request.Name,
            Category = string.IsNullOrWhiteSpace(request.Category) ? "Sunday" : request.Category,
            IsActive = request.IsActive
        };

        _dbContext.ServiceTypes.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<ServiceType>.Ok(entity, "Service type added successfully."));
    }

    [HttpPut("service-types/{id}")]
    public async Task<IActionResult> UpdateServiceType(string id, [FromBody] SaveServiceTypeDto request, CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(ApiResponseEnvelope<ServiceType>.Fail("Service type name is required."));

        ServiceType? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id == guidId, cancellationToken);
        }

        if (existing == null)
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Name == request.Name || s.Id.ToString() == id, cancellationToken);
        }

        if (existing == null)
        {
            existing = new ServiceType
            {
                Name = request.Name,
                Category = string.IsNullOrWhiteSpace(request.Category) ? "Sunday" : request.Category,
                IsActive = request.IsActive
            };
            _dbContext.ServiceTypes.Add(existing);
        }
        else
        {
            existing.Name = request.Name;
            existing.Category = string.IsNullOrWhiteSpace(request.Category) ? existing.Category : request.Category;
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<ServiceType>.Ok(existing, "Service type updated successfully."));
    }

    [HttpDelete("service-types/{id}")]
    public async Task<IActionResult> DeleteServiceType(string id, CancellationToken cancellationToken)
    {
        ServiceType? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id == guidId, cancellationToken);
        }

        if (existing == null)
        {
            existing = await _dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id.ToString() == id, cancellationToken);
        }

        if (existing != null)
        {
            existing.IsActive = false;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Service type deactivated successfully."));
    }

    [HttpGet("offering-categories")]
    public async Task<IActionResult> GetOfferingCategories(CancellationToken cancellationToken)
    {
        var categories = await _dbContext.OfferingCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);

        return Ok(ApiResponseEnvelope<List<OfferingCategory>>.Ok(categories));
    }

    [HttpPost("offering-categories")]
    public async Task<IActionResult> AddOfferingCategory([FromBody] SaveOfferingCategoryDto request, CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(ApiResponseEnvelope<OfferingCategory>.Fail("Offering category name is required."));

        var code = string.IsNullOrWhiteSpace(request.Code)
            ? request.Name.Substring(0, Math.Min(4, request.Name.Length)).ToUpper()
            : request.Code;

        var entity = new OfferingCategory
        {
            Name = request.Name,
            Code = code,
            IsActive = request.IsActive
        };

        _dbContext.OfferingCategories.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<OfferingCategory>.Ok(entity, "Offering category added successfully."));
    }

    [HttpPut("offering-categories/{id}")]
    public async Task<IActionResult> UpdateOfferingCategory(string id, [FromBody] SaveOfferingCategoryDto request, CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(ApiResponseEnvelope<OfferingCategory>.Fail("Offering category name is required."));

        OfferingCategory? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Id == guidId, cancellationToken);
        }

        if (existing == null)
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Code == id || c.Name == request.Name || c.Id.ToString() == id, cancellationToken);
        }

        if (existing == null)
        {
            var code = string.IsNullOrWhiteSpace(request.Code)
                ? request.Name.Substring(0, Math.Min(4, request.Name.Length)).ToUpper()
                : request.Code;

            existing = new OfferingCategory
            {
                Name = request.Name,
                Code = code,
                IsActive = request.IsActive
            };
            _dbContext.OfferingCategories.Add(existing);
        }
        else
        {
            existing.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Code)) existing.Code = request.Code;
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<OfferingCategory>.Ok(existing, "Offering category updated successfully."));
    }

    [HttpDelete("offering-categories/{id}")]
    public async Task<IActionResult> DeleteOfferingCategory(string id, CancellationToken cancellationToken)
    {
        OfferingCategory? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Id == guidId, cancellationToken);
        }

        if (existing == null)
        {
            existing = await _dbContext.OfferingCategories.FirstOrDefaultAsync(c => c.Code == id || c.Id.ToString() == id, cancellationToken);
        }

        if (existing != null)
        {
            existing.IsActive = false;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Offering category deactivated successfully."));
    }

    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartments(CancellationToken cancellationToken)
    {
        var departments = await _dbContext.Departments
            .Where(d => d.IsActive)
            .OrderBy(d => d.Name)
            .ToListAsync(cancellationToken);

        return Ok(ApiResponseEnvelope<List<Department>>.Ok(departments));
    }

    [HttpPost("departments")]
    public async Task<IActionResult> AddDepartment([FromBody] SaveDepartmentDto request, CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(ApiResponseEnvelope<Department>.Fail("Department name is required."));

        var code = string.IsNullOrWhiteSpace(request.Code)
            ? request.Name.Substring(0, Math.Min(3, request.Name.Length)).ToUpper() + "-01"
            : request.Code;

        var entity = new Department
        {
            Name = request.Name,
            Code = code,
            HeadOfDepartment = request.HeadOfDepartment ?? "",
            Description = request.Description ?? "",
            MeetingSchedule = request.MeetingSchedule ?? "",
            IsActive = request.IsActive
        };

        _dbContext.Departments.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<Department>.Ok(entity, "Parish Department added successfully."));
    }

    [HttpPut("departments/{id}")]
    public async Task<IActionResult> UpdateDepartment(string id, [FromBody] SaveDepartmentDto request, CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(ApiResponseEnvelope<Department>.Fail("Department name is required."));

        Department? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == guidId, cancellationToken);
        }

        if (existing == null)
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Code == id || d.Name == request.Name || d.Id.ToString() == id, cancellationToken);
        }

        if (existing == null)
        {
            var code = string.IsNullOrWhiteSpace(request.Code)
                ? request.Name.Substring(0, Math.Min(3, request.Name.Length)).ToUpper() + "-01"
                : request.Code;

            existing = new Department
            {
                Name = request.Name,
                Code = code,
                HeadOfDepartment = request.HeadOfDepartment ?? "",
                Description = request.Description ?? "",
                MeetingSchedule = request.MeetingSchedule ?? "",
                IsActive = request.IsActive
            };
            _dbContext.Departments.Add(existing);
        }
        else
        {
            existing.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Code)) existing.Code = request.Code;
            if (request.HeadOfDepartment != null) existing.HeadOfDepartment = request.HeadOfDepartment;
            if (request.Description != null) existing.Description = request.Description;
            if (request.MeetingSchedule != null) existing.MeetingSchedule = request.MeetingSchedule;
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<Department>.Ok(existing, "Department updated successfully."));
    }

    [HttpDelete("departments/{id}")]
    public async Task<IActionResult> DeleteDepartment(string id, CancellationToken cancellationToken)
    {
        Department? existing = null;
        if (Guid.TryParse(id, out var guidId))
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == guidId, cancellationToken);
        }

        if (existing == null)
        {
            existing = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Code == id || d.Id.ToString() == id, cancellationToken);
        }

        if (existing != null)
        {
            existing.IsActive = false;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Department deactivated successfully."));
    }
}

public class SaveServiceTypeDto
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class SaveOfferingCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class SaveDepartmentDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string HeadOfDepartment { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MeetingSchedule { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

