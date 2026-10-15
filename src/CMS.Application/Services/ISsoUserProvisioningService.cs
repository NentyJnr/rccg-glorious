using CMS.Application.DTOs;

namespace CMS.Application.Services;

public interface ISsoUserProvisioningService
{
    Task<LoginResultDto> ProcessGoogleLoginAsync(GoogleLoginRequestDto request, CancellationToken cancellationToken = default);
    Task<LoginResultDto> ProcessMicrosoftLoginAsync(MicrosoftLoginRequestDto request, CancellationToken cancellationToken = default);
    Task<LoginResultDto> ProvisionOrAuthenticateExternalUserAsync(ExternalAuthUserDto externalUser, CancellationToken cancellationToken = default);
}
