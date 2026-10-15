using CMS.Application.DTOs;

namespace CMS.Application.Common.Interfaces;

public interface ISsoTokenValidatorService
{
    Task<ExternalAuthUserDto> ValidateGoogleTokenAsync(string idToken, CancellationToken cancellationToken = default);
    Task<ExternalAuthUserDto> ValidateMicrosoftTokenAsync(string idToken, CancellationToken cancellationToken = default);
}
