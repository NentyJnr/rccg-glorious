using CMS.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace CMS.Infrastructure.Services;

public class EmailNotificationService : IEmailNotificationService
{
    private readonly ILogger<EmailNotificationService> _logger;

    public EmailNotificationService(ILogger<EmailNotificationService> logger)
    {
        _logger = logger;
    }

    public Task SendWelcomeEmailAsync(string recipientEmail, string recipientName, string temporaryPassword, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "DISPATCHING ONBOARDING EMAIL to {Email} ({Name}): Your temporary password is '{TempPassword}'. Please reset upon first login.",
            recipientEmail, recipientName, temporaryPassword);

        return Task.CompletedTask;
    }
}
