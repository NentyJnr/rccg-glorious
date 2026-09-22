using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Services;

public interface IUserOnboardingService
{
    Task<OnboardUserResultDto> OnboardUserAsync(OnboardUserRequestDto request, CancellationToken cancellationToken = default);
    Task<LoginResultDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<bool> ChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken cancellationToken = default);
}

public class UserOnboardingService : IUserOnboardingService
{
    private readonly ICmsDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEmailNotificationService _emailService;

    public UserOnboardingService(
        ICmsDbContext dbContext,
        IPasswordHasher passwordHasher,
        IEmailNotificationService emailService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _emailService = emailService;
    }

    public async Task<OnboardUserResultDto> OnboardUserAsync(OnboardUserRequestDto request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLowerInvariant(), cancellationToken);

        if (existingUser != null)
        {
            throw new InvalidOperationException($"User with email '{request.Email}' already exists.");
        }

        string tempPassword = GenerateSecureTemporaryPassword();

        var user = new ApplicationUser
        {
            FullName = request.FullName,
            Email = request.Email.ToLowerInvariant(),
            Phone = request.Phone,
            Role = request.Role,
            MustChangePassword = true,
            IsActive = true,
            PasswordHash = _passwordHasher.HashPassword(tempPassword)
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _emailService.SendWelcomeEmailAsync(user.Email, user.FullName, tempPassword, cancellationToken);

        return new OnboardUserResultDto(
            user.Id,
            user.Email,
            "User successfully onboarded. Credentials sent via email."
        );
    }

    public async Task<LoginResultDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLowerInvariant(), cancellationToken);

        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedAccessException("Invalid credentials or account inactive.");
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        // Mock JWT Token generation for demonstration
        string mockJwtToken = $"Bearer_Token_For_{user.Id}";

        return new LoginResultDto(
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            user.MustChangePassword,
            mockJwtToken
        );
    }

    public async Task<bool> ChangePasswordAsync(ChangePasswordRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null || !user.IsActive)
        {
            throw new InvalidOperationException("User account not found or inactive.");
        }

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Current password is incorrect.");
        }

        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.MustChangePassword = false;
        user.UpdatedAtUtc = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static string GenerateSecureTemporaryPassword()
    {
        const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        var bytes = new byte[12];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(bytes);

        var sb = new System.Text.StringBuilder();
        foreach (byte b in bytes)
        {
            sb.Append(validChars[b % validChars.Length]);
        }
        return sb.ToString();
    }
}
