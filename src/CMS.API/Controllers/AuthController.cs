using CMS.API.Common;
using CMS.Application.DTOs;
using CMS.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserOnboardingService _onboardingService;

    public AuthController(IUserOnboardingService onboardingService)
    {
        _onboardingService = onboardingService;
    }

    [HttpPost("onboard")]
    public async Task<IActionResult> Onboard([FromBody] OnboardUserRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _onboardingService.OnboardUserAsync(request, cancellationToken);
            return Ok(ApiResponseEnvelope<OnboardUserResultDto>.Ok(result, "User onboarded successfully. Credentials sent via email."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponseEnvelope<OnboardUserResultDto>.Fail(ex.Message));
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _onboardingService.LoginAsync(request, cancellationToken);
            return Ok(ApiResponseEnvelope<LoginResultDto>.Ok(result, "Authentication successful."));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponseEnvelope<LoginResultDto>.Fail(ex.Message));
        }
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            bool success = await _onboardingService.ChangePasswordAsync(request, cancellationToken);
            return Ok(ApiResponseEnvelope<bool>.Ok(success, "Password changed successfully. You may now access protected portal routes."));
        }
        catch (Exception ex) when (ex is UnauthorizedAccessException || ex is InvalidOperationException)
        {
            return BadRequest(ApiResponseEnvelope<bool>.Fail(ex.Message));
        }
    }
}
