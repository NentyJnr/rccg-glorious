using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using CMS.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class SetupController : ControllerBase
{
    private readonly ISetupService _setupService;

    public SetupController(ISetupService setupService)
    {
        _setupService = setupService;
    }

    [HttpGet("organization")]
    public async Task<IActionResult> GetOrganizationSettings(CancellationToken ct)
    {
        var settings = await _setupService.GetOrganizationSettingsAsync(ct);
        return Ok(ApiResponseEnvelope<OrganizationSetting>.Ok(settings));
    }

    [HttpPut("organization")]
    public async Task<IActionResult> UpdateOrganizationSettings([FromBody] OrganizationSetting request, CancellationToken ct)
    {
        var settings = await _setupService.UpdateOrganizationSettingsAsync(request, ct);
        return Ok(ApiResponseEnvelope<OrganizationSetting>.Ok(settings, "Organization settings updated successfully."));
    }

    [HttpGet("ministers")]
    public async Task<IActionResult> GetMinisters(CancellationToken ct)
    {
        var ministers = await _setupService.GetMinistersAsync(ct);
        return Ok(ApiResponseEnvelope<List<Minister>>.Ok(ministers));
    }

    [HttpPost("ministers")]
    public async Task<IActionResult> AddMinister([FromBody] Minister minister, CancellationToken ct)
    {
        var result = await _setupService.AddMinisterAsync(minister, ct);
        return Ok(ApiResponseEnvelope<Minister>.Ok(result, "Minister added successfully."));
    }

    [HttpGet("service-types")]
    public async Task<IActionResult> GetServiceTypes(CancellationToken ct)
    {
        var serviceTypes = await _setupService.GetServiceTypesAsync(ct);
        return Ok(ApiResponseEnvelope<List<ServiceType>>.Ok(serviceTypes));
    }

    [HttpPost("service-types")]
    public async Task<IActionResult> AddServiceType([FromBody] SaveServiceTypeDto request, CancellationToken ct)
    {
        try
        {
            var entity = await _setupService.AddServiceTypeAsync(request, ct);
            return Ok(ApiResponseEnvelope<ServiceType>.Ok(entity, "Service type added successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<ServiceType>.Fail(ex.Message));
        }
    }

    [HttpPut("service-types/{id}")]
    public async Task<IActionResult> UpdateServiceType(string id, [FromBody] SaveServiceTypeDto request, CancellationToken ct)
    {
        try
        {
            var entity = await _setupService.UpdateServiceTypeAsync(id, request, ct);
            return Ok(ApiResponseEnvelope<ServiceType>.Ok(entity, "Service type updated successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<ServiceType>.Fail(ex.Message));
        }
    }

    [HttpDelete("service-types/{id}")]
    public async Task<IActionResult> DeleteServiceType(string id, CancellationToken ct)
    {
        await _setupService.DeleteServiceTypeAsync(id, ct);
        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Service type deactivated successfully."));
    }

    [HttpGet("offering-categories")]
    public async Task<IActionResult> GetOfferingCategories(CancellationToken ct)
    {
        var categories = await _setupService.GetOfferingCategoriesAsync(ct);
        return Ok(ApiResponseEnvelope<List<OfferingCategory>>.Ok(categories));
    }

    [HttpPost("offering-categories")]
    public async Task<IActionResult> AddOfferingCategory([FromBody] SaveOfferingCategoryDto request, CancellationToken ct)
    {
        try
        {
            var entity = await _setupService.AddOfferingCategoryAsync(request, ct);
            return Ok(ApiResponseEnvelope<OfferingCategory>.Ok(entity, "Offering category added successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<OfferingCategory>.Fail(ex.Message));
        }
    }

    [HttpPut("offering-categories/{id}")]
    public async Task<IActionResult> UpdateOfferingCategory(string id, [FromBody] SaveOfferingCategoryDto request, CancellationToken ct)
    {
        try
        {
            var entity = await _setupService.UpdateOfferingCategoryAsync(id, request, ct);
            return Ok(ApiResponseEnvelope<OfferingCategory>.Ok(entity, "Offering category updated successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<OfferingCategory>.Fail(ex.Message));
        }
    }

    [HttpDelete("offering-categories/{id}")]
    public async Task<IActionResult> DeleteOfferingCategory(string id, CancellationToken ct)
    {
        await _setupService.DeleteOfferingCategoryAsync(id, ct);
        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Offering category deactivated successfully."));
    }

    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartments(CancellationToken ct)
    {
        var departments = await _setupService.GetDepartmentsAsync(ct);
        return Ok(ApiResponseEnvelope<List<Department>>.Ok(departments));
    }

    [HttpPost("departments")]
    public async Task<IActionResult> AddDepartment([FromBody] SaveDepartmentDto request, CancellationToken ct)
    {
        try
        {
            var entity = await _setupService.AddDepartmentAsync(request, ct);
            return Ok(ApiResponseEnvelope<Department>.Ok(entity, "Parish Department added successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<Department>.Fail(ex.Message));
        }
    }

    [HttpPut("departments/{id}")]
    public async Task<IActionResult> UpdateDepartment(string id, [FromBody] SaveDepartmentDto request, CancellationToken ct)
    {
        try
        {
            var entity = await _setupService.UpdateDepartmentAsync(id, request, ct);
            return Ok(ApiResponseEnvelope<Department>.Ok(entity, "Department updated successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<Department>.Fail(ex.Message));
        }
    }

    [HttpDelete("departments/{id}")]
    public async Task<IActionResult> DeleteDepartment(string id, CancellationToken ct)
    {
        await _setupService.DeleteDepartmentAsync(id, ct);
        return Ok(ApiResponseEnvelope<bool>.Ok(true, "Department deactivated successfully."));
    }
}
