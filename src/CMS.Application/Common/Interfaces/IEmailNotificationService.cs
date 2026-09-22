namespace CMS.Application.Common.Interfaces;

public interface IEmailNotificationService
{
    Task SendWelcomeEmailAsync(string recipientEmail, string recipientName, string temporaryPassword, CancellationToken cancellationToken = default);
}
