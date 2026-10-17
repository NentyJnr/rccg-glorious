namespace CMS.Application.Common.Interfaces;

public interface IEmailNotificationService
{
    Task SendWelcomeEmailAsync(string recipientEmail, string recipientName, string temporaryPassword, CancellationToken cancellationToken = default);

    Task SendYouthRegistrationAlertAsync(
        IEnumerable<string> recipientEmails,
        string registrantName,
        string registrantEmail,
        string registrantPhone,
        string category,
        string primaryInterest,
        CancellationToken cancellationToken = default);
}

