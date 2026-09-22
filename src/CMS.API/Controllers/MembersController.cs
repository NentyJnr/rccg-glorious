using CMS.API.Common;
using CMS.Application.Common.Interfaces;
using CMS.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MembersController : ControllerBase
{
    private readonly ICmsDbContext _dbContext;

    public MembersController(ICmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetMembers([FromQuery] string? departmentName, CancellationToken cancellationToken)
    {
        var users = await _dbContext.Users
            .Where(u => u.IsActive)
            .OrderBy(u => u.FullName)
            .ToListAsync(cancellationToken);

        var members = users.Select(u => new
        {
            id = u.Id.ToString(),
            surname = u.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? u.FullName,
            firstname = u.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries).Skip(1).FirstOrDefault() ?? "",
            fullName = u.FullName,
            whatsappNumber = u.Phone,
            email = u.Email,
            homeAddress = "Parish District, Lagos",
            dobDay = 15,
            dobMonth = "August",
            gender = "Male",
            membershipStatus = "Full Member",
            assignedDepartment = u.Role ?? "Ushering Department",
            role = u.Role,
            dateJoined = "2025-01-15"
        }).ToList();

        if (!string.IsNullOrWhiteSpace(departmentName) && !string.Equals(departmentName, "All", StringComparison.OrdinalIgnoreCase))
        {
            members = members.Where(m => string.Equals(m.assignedDepartment, departmentName, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Ok(ApiResponseEnvelope<object>.Ok(members, "Members list retrieved successfully."));
    }

    [HttpPost]
    public async Task<IActionResult> RegisterMember([FromBody] ApplicationUser request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            return BadRequest(ApiResponseEnvelope<ApplicationUser>.Fail("Full name is required."));

        _dbContext.Users.Add(request);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Ok(ApiResponseEnvelope<ApplicationUser>.Ok(request, "Member registered successfully."));
    }
}
