using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace CMS.Infrastructure.Services;

public class SsoTokenValidatorService : ISsoTokenValidatorService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SsoTokenValidatorService> _logger;
    private static readonly ConcurrentDictionary<string, ConfigurationManager<OpenIdConnectConfiguration>> _msConfigManagers = new();

    public SsoTokenValidatorService(IConfiguration configuration, ILogger<SsoTokenValidatorService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ExternalAuthUserDto> ValidateGoogleTokenAsync(string idToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(idToken))
        {
            throw new ArgumentException("Google ID token cannot be empty.", nameof(idToken));
        }

        string? clientId = _configuration["Authentication:Google:ClientId"]?.Trim().Trim('"', '\'');

        try
        {
            var validationSettings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = !string.IsNullOrWhiteSpace(clientId) ? new[] { clientId } : null
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, validationSettings);

            if (payload == null)
            {
                throw new UnauthorizedAccessException("Failed to parse Google ID token payload.");
            }

            if (!payload.EmailVerified)
            {
                throw new UnauthorizedAccessException("Google account email is not verified.");
            }

            string email = payload.Email?.ToLowerInvariant() ?? string.Empty;
            string name = !string.IsNullOrWhiteSpace(payload.Name) ? payload.Name : email.Split('@')[0];
            string externalUserId = payload.Subject ?? string.Empty;
            string? picture = payload.Picture;

            return new ExternalAuthUserDto(
                Email: email,
                FullName: name,
                ExternalUserId: externalUserId,
                Provider: "Google",
                AvatarUrl: picture
            );
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Invalid Google ID token supplied: {Message}", ex.Message);
            throw new UnauthorizedAccessException($"Invalid Google ID token: {ex.Message}");
        }
        catch (Exception ex) when (ex is not UnauthorizedAccessException)
        {
            _logger.LogError(ex, "Unexpected error during Google token verification");
            throw new UnauthorizedAccessException("Google token verification failed. Please try again.");
        }
    }

    public async Task<ExternalAuthUserDto> ValidateMicrosoftTokenAsync(string idToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(idToken))
        {
            throw new ArgumentException("Microsoft ID token cannot be empty.", nameof(idToken));
        }

        string? clientId = _configuration["Authentication:Microsoft:ClientId"]?.Trim().Trim('"', '\'');
        string tenantId = _configuration["Authentication:Microsoft:TenantId"]?.Trim().Trim('"', '\'') ?? "common";

        try
        {
            var configManager = _msConfigManagers.GetOrAdd(tenantId, t =>
            {
                string discoveryEndpoint = $"https://login.microsoftonline.com/{t}/v2.0/.well-known/openid-configuration";
                return new ConfigurationManager<OpenIdConnectConfiguration>(
                    discoveryEndpoint,
                    new OpenIdConnectConfigurationRetriever(),
                    new HttpDocumentRetriever());
            });

            var openIdConfig = await configManager.GetConfigurationAsync(cancellationToken);

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                IssuerValidator = (issuer, securityToken, parameters) =>
                {
                    if (issuer.StartsWith("https://login.microsoftonline.com/", StringComparison.OrdinalIgnoreCase) &&
                        issuer.EndsWith("/v2.0", StringComparison.OrdinalIgnoreCase))
                    {
                        return issuer;
                    }

                    if (issuer.StartsWith("https://sts.windows.net/", StringComparison.OrdinalIgnoreCase))
                    {
                        return issuer;
                    }

                    throw new SecurityTokenInvalidIssuerException($"Untrusted Microsoft issuer: {issuer}");
                },
                ValidateAudience = !string.IsNullOrWhiteSpace(clientId),
                ValidAudiences = !string.IsNullOrWhiteSpace(clientId)
                    ? new[] { clientId, $"api://{clientId}" }
                    : null,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = openIdConfig.SigningKeys,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5)
            };

            var handler = new JwtSecurityTokenHandler();
            var principal = handler.ValidateToken(idToken, validationParameters, out var validatedToken);

            string? email = principal.FindFirst("preferred_username")?.Value
                            ?? principal.FindFirst(ClaimTypes.Email)?.Value
                            ?? principal.FindFirst("email")?.Value
                            ?? principal.FindFirst(ClaimTypes.Upn)?.Value;

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new UnauthorizedAccessException("Unable to extract verified email from Microsoft token.");
            }

            string name = principal.FindFirst("name")?.Value
                          ?? principal.FindFirst(ClaimTypes.Name)?.Value
                          ?? email.Split('@')[0];

            string externalUserId = principal.FindFirst("oid")?.Value
                                    ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                    ?? principal.FindFirst("sub")?.Value
                                    ?? string.Empty;

            return new ExternalAuthUserDto(
                Email: email.ToLowerInvariant(),
                FullName: name,
                ExternalUserId: externalUserId,
                Provider: "Microsoft",
                AvatarUrl: null
            );
        }
        catch (SecurityTokenException ex)
        {
            _logger.LogWarning(ex, "Microsoft token validation failed: {Message}", ex.Message);
            throw new UnauthorizedAccessException($"Invalid Microsoft token: {ex.Message}");
        }
        catch (Exception ex) when (ex is not UnauthorizedAccessException)
        {
            _logger.LogError(ex, "Unexpected error during Microsoft token verification");
            throw new UnauthorizedAccessException("Microsoft token verification failed. Please try again.");
        }
    }
}
