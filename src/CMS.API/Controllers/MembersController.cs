using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MembersController : ControllerBase
{
    private readonly IMemberService _memberService;

    public MembersController(IMemberService memberService)
    {
        _memberService = memberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMembers([FromQuery] string? departmentName, CancellationToken cancellationToken)
    {
        var members = await _memberService.GetMembersAsync(departmentName, cancellationToken);
        return Ok(ApiResponseEnvelope<List<MemberListItemDto>>.Ok(members, "Members list retrieved successfully."));
    }

    [HttpPost]
    public async Task<IActionResult> RegisterMember([FromBody] RegisterMemberRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var registered = await _memberService.RegisterMemberAsync(request, cancellationToken);
            return Ok(ApiResponseEnvelope<MemberListItemDto>.Ok(registered, "Member registered successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<MemberListItemDto>.Fail(ex.Message));
        }
    }

    [HttpPost("youth-register")]
    public async Task<IActionResult> RegisterYouthProspect([FromBody] YouthRegistrationRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var registered = await _memberService.RegisterYouthProspectAsync(request, cancellationToken);
            return Ok(ApiResponseEnvelope<YouthRegistrationResponseDto>.Ok(registered, registered.Message));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponseEnvelope<YouthRegistrationResponseDto>.Fail(ex.Message));
        }
    }
}

