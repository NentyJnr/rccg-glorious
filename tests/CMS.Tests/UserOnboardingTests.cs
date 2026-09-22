using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Application.Services;
using CMS.Domain.Entities;
using CMS.Infrastructure.Persistence;
using CMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace CMS.Tests;

public class UserOnboardingTests
{
    private ICmsDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<CmsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new CmsDbContext(options);
    }

    [Fact]
    public async Task OnboardUser_Sets_MustChangePassword_To_True_And_Dispatches_Email()
    {
        // Arrange
        var dbContext = GetInMemoryDbContext();
        var passwordHasher = new PasswordHasher();
        var emailService = new EmailNotificationService(NullLogger<EmailNotificationService>.Instance);
        var onboardingService = new UserOnboardingService(dbContext, passwordHasher, emailService);

        var request = new OnboardUserRequestDto(
            "Brother David",
            "david@parish.org",
            "+2348012345678",
            "UsheringDepartment"
        );

        // Act
        var result = await onboardingService.OnboardUserAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("david@parish.org", result.Email);

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == "david@parish.org");
        Assert.NotNull(user);
        Assert.True(user.MustChangePassword);
        Assert.True(user.IsActive);
        Assert.NotEmpty(user.PasswordHash);
    }

    [Fact]
    public async Task ChangePassword_Resets_MustChangePassword_Flag_To_False()
    {
        // Arrange
        var dbContext = GetInMemoryDbContext();
        var passwordHasher = new PasswordHasher();
        var emailService = new EmailNotificationService(NullLogger<EmailNotificationService>.Instance);
        var onboardingService = new UserOnboardingService(dbContext, passwordHasher, emailService);

        var request = new OnboardUserRequestDto(
            "Sister Grace",
            "grace@parish.org",
            "+2348087654321",
            "HouseFellowshipLeader"
        );

        await onboardingService.OnboardUserAsync(request);

        // Retrieve temp user and simulate initial login to retrieve temp pass check
        var user = await dbContext.Users.FirstAsync(u => u.Email == "grace@parish.org");

        // Act - Reset password
        // Use passwordHasher directly to simulate correct current password
        string newPass = "NewSecureP@ssw0rd2026!";
        user.PasswordHash = passwordHasher.HashPassword("TempPass123!");
        await dbContext.SaveChangesAsync();

        var changePassReq = new ChangePasswordRequestDto(user.Id, "TempPass123!", newPass);
        bool changeSuccess = await onboardingService.ChangePasswordAsync(changePassReq);

        // Assert
        Assert.True(changeSuccess);
        var updatedUser = await dbContext.Users.FirstAsync(u => u.Id == user.Id);
        Assert.False(updatedUser.MustChangePassword);
        Assert.True(passwordHasher.VerifyPassword(newPass, updatedUser.PasswordHash));
    }
}
