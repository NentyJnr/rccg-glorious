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

    public Task SendYouthRegistrationAlertAsync(
        IEnumerable<string> recipientEmails,
        string registrantName,
        string registrantEmail,
        string registrantPhone,
        string category,
        string primaryInterest,
        CancellationToken cancellationToken = default)
    {
        var emailList = recipientEmails?.Where(e => !string.IsNullOrWhiteSpace(e)).Distinct().ToList() ?? new List<string>();
        var recipientsDisplay = emailList.Count > 0 ? string.Join(", ", emailList) : "youth-leadership@rccggloriouschurch.org (Fallback)";

        _logger.LogInformation(
            "DISPATCHING YOUTH REGISTRATION ALERT to Officials [{Recipients}]: New Registrant '{Name}' | Email: {Email} | Phone: {Phone} | Category: {Category} | Interest: {Interest}",
            recipientsDisplay, registrantName, registrantEmail, registrantPhone, category, primaryInterest);

        return Task.CompletedTask;
    }
}

