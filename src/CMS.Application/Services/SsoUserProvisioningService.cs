using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CMS.Application.Services;

public class SsoUserProvisioningService : ISsoUserProvisioningService
{
    private readonly ICmsDbContext _dbContext;
    private readonly ISsoTokenValidatorService _tokenValidator;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<SsoUserProvisioningService> _logger;

    public SsoUserProvisioningService(
        ICmsDbContext dbContext,
        ISsoTokenValidatorService tokenValidator,
        IJwtTokenGenerator jwtTokenGenerator,
        ILogger<SsoUserProvisioningService> logger)
    {
        _dbContext = dbContext;
        _tokenValidator = tokenValidator;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    public async Task<LoginResultDto> ProcessGoogleLoginAsync(GoogleLoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var externalUser = await _tokenValidator.ValidateGoogleTokenAsync(request.IdToken, cancellationToken);
        return await ProvisionOrAuthenticateExternalUserAsync(externalUser, cancellationToken);
    }

    public async Task<LoginResultDto> ProcessMicrosoftLoginAsync(MicrosoftLoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var externalUser = await _tokenValidator.ValidateMicrosoftTokenAsync(request.IdToken, cancellationToken);
        return await ProvisionOrAuthenticateExternalUserAsync(externalUser, cancellationToken);
    }

    public async Task<LoginResultDto> ProvisionOrAuthenticateExternalUserAsync(ExternalAuthUserDto externalUser, CancellationToken cancellationToken = default)
    {
        string normalizedEmail = externalUser.Email.ToLowerInvariant().Trim();
        bool isDesignatedSuperAdmin = normalizedEmail == "neotroltd@gmail.com" || 
                                     normalizedEmail == "admin@rccgglorious.org";

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (user != null)
        {
            if (!user.IsActive)
            {
                _logger.LogWarning("SSO login attempted for deactivated user: {Email}", normalizedEmail);
                throw new UnauthorizedAccessException("Account is deactivated. Please contact your Parish Administrator.");
            }

            // Sync display name if missing
            if (string.IsNullOrWhiteSpace(user.FullName) && !string.IsNullOrWhiteSpace(externalUser.FullName))
            {
                user.FullName = externalUser.FullName;
            }

            // Automatically elevate designated initial accounts to SuperAdmin
            if (isDesignatedSuperAdmin && user.Role != "SuperAdmin")
            {
                user.Role = "SuperAdmin";
                _logger.LogInformation("Elevated designated administrator account to SuperAdmin: {Email}", normalizedEmail);
            }

            user.UpdatedAtUtc = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("SSO authentication successful for existing user: {Email} ({Role}) via {Provider}",
                user.Email, user.Role, externalUser.Provider);
        }
        else
        {
            // Just-In-Time (JIT) Provisioning for new SSO users
            user = new ApplicationUser
            {
                FullName = !string.IsNullOrWhiteSpace(externalUser.FullName) 
                    ? externalUser.FullName 
                    : (isDesignatedSuperAdmin ? "Super Administrator" : normalizedEmail.Split('@')[0]),
                Email = normalizedEmail,
                Phone = string.Empty,
                Role = isDesignatedSuperAdmin ? "SuperAdmin" : "Member",
                MustChangePassword = false, // SSO users manage passwords through identity provider
                IsActive = true,
                PasswordHash = string.Empty
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("JIT provisioning created new user account: {Email} ({Role}) via {Provider}",
                user.Email, user.Role, externalUser.Provider);
        }

        string token = _jwtTokenGenerator.GenerateToken(user);

        return new LoginResultDto(
            UserId: user.Id,
            FullName: user.FullName,
            Email: user.Email,
            Role: user.Role,
            MustChangePassword: user.MustChangePassword,
            Token: token
        );
    }
}
