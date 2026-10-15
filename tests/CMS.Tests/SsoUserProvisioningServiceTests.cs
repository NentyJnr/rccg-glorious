using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Application.Services;
using CMS.Domain.Entities;
using CMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace CMS.Tests;

public class SsoUserProvisioningServiceTests
{
    private ICmsDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<CmsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new CmsDbContext(options);
    }

    private class MockSsoTokenValidatorService : ISsoTokenValidatorService
    {
        public Task<ExternalAuthUserDto> ValidateGoogleTokenAsync(string idToken, CancellationToken cancellationToken = default)
        {
            if (idToken == "invalid_token")
                throw new UnauthorizedAccessException("Invalid Google ID token signature");

            return Task.FromResult(new ExternalAuthUserDto(
                Email: "newparishioner@gmail.com",
                FullName: "Bro John Google",
                ExternalUserId: "google-sub-123",
                Provider: "Google",
                AvatarUrl: "https://lh3.googleusercontent.com/photo.jpg"
            ));
        }

        public Task<ExternalAuthUserDto> ValidateMicrosoftTokenAsync(string idToken, CancellationToken cancellationToken = default)
        {
            if (idToken == "invalid_token")
                throw new UnauthorizedAccessException("Invalid Microsoft token");

            return Task.FromResult(new ExternalAuthUserDto(
                Email: "pastor@rccgglorious.org",
                FullName: "Pastor Tunde Microsoft",
                ExternalUserId: "ms-oid-456",
                Provider: "Microsoft"
            ));
        }
    }

    [Fact]
    public async Task ProcessGoogleLoginAsync_Provisions_New_User_Atomically()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var validator = new MockSsoTokenValidatorService();
        var jwtGenerator = new TestJwtTokenGenerator();
        var ssoService = new SsoUserProvisioningService(db, validator, jwtGenerator, NullLogger<SsoUserProvisioningService>.Instance);

        var request = new GoogleLoginRequestDto("valid_google_token");

        // Act
        var result = await ssoService.ProcessGoogleLoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("newparishioner@gmail.com", result.Email);
        Assert.Equal("Bro John Google", result.FullName);
        Assert.Equal("Member", result.Role);
        Assert.False(result.MustChangePassword);
        Assert.NotEmpty(result.Token);

        var userInDb = await db.Users.FirstOrDefaultAsync(u => u.Email == "newparishioner@gmail.com");
        Assert.NotNull(userInDb);
        Assert.True(userInDb.IsActive);
        Assert.False(userInDb.MustChangePassword);
    }

    [Fact]
    public async Task ProcessMicrosoftLoginAsync_Authenticates_Existing_User_And_Preserves_Role()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var existingUser = new ApplicationUser
        {
            FullName = "Pastor Tunde",
            Email = "pastor@rccgglorious.org",
            Role = "Pastor",
            IsActive = true,
            MustChangePassword = false
        };
        db.Users.Add(existingUser);
        await ((CmsDbContext)db).SaveChangesAsync();

        var validator = new MockSsoTokenValidatorService();
        var jwtGenerator = new TestJwtTokenGenerator();
        var ssoService = new SsoUserProvisioningService(db, validator, jwtGenerator, NullLogger<SsoUserProvisioningService>.Instance);

        var request = new MicrosoftLoginRequestDto("valid_ms_token");

        // Act
        var result = await ssoService.ProcessMicrosoftLoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("pastor@rccgglorious.org", result.Email);
        Assert.Equal("Pastor", result.Role); // Preserved administrative role
        Assert.NotEmpty(result.Token);
    }

    [Fact]
    public async Task ProcessGoogleLoginAsync_Rejects_Deactivated_Account()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var deactivatedUser = new ApplicationUser
        {
            FullName = "Former Worker",
            Email = "newparishioner@gmail.com",
            Role = "Member",
            IsActive = false
        };
        db.Users.Add(deactivatedUser);
        await ((CmsDbContext)db).SaveChangesAsync();

        var validator = new MockSsoTokenValidatorService();
        var jwtGenerator = new TestJwtTokenGenerator();
        var ssoService = new SsoUserProvisioningService(db, validator, jwtGenerator, NullLogger<SsoUserProvisioningService>.Instance);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            ssoService.ProcessGoogleLoginAsync(new GoogleLoginRequestDto("valid_google_token")));
    }
}
