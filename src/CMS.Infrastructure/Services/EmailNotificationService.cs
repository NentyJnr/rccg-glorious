using System.Net;
using System.Net.Mail;
using CMS.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CMS.Infrastructure.Services;

public class EmailNotificationService : IEmailNotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailNotificationService> _logger;

    public EmailNotificationService(
        IConfiguration configuration,
        ILogger<EmailNotificationService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendWelcomeEmailAsync(
        string recipientEmail,
        string recipientName,
        string temporaryPassword,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(recipientEmail))
        {
            _logger.LogWarning("SendWelcomeEmailAsync aborted: recipient email is null or empty.");
            return;
        }

        try
        {
            var frontendUrl = (_configuration["AppConfig:FrontendBaseUrl"] ?? "https://rccggloriouschurch.vercel.app").TrimEnd('/');
            var loginUrl = $"{frontendUrl}/login";

            var encodedName = WebUtility.HtmlEncode(recipientName ?? "Church Leader");
            var encodedEmail = WebUtility.HtmlEncode(recipientEmail.Trim());
            var encodedPassword = WebUtility.HtmlEncode(temporaryPassword);
            var currentYear = DateTime.UtcNow.Year;

            var bodyHtml = $@"<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""utf-8"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
    <title>Welcome to RCCG Glorious Church</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;"">
    <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" style=""background-color: #f1f5f9; padding: 32px 16px;"">
        <tr>
            <td align=""center"">
                <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" style=""max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);"">
                    <!-- Header -->
                    <tr>
                        <td style=""background: linear-gradient(135deg, #00205B 0%, #0a3682 100%); padding: 36px 32px; text-align: center; border-bottom: 4px solid #F59E0B;"">
                            <h1 style=""margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;"">RCCG GLORIOUS CHURCH</h1>
                            <p style=""margin: 6px 0 0 0; color: #e2e8f0; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;"">Parish Management &amp; Member Portal</p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style=""padding: 36px 32px;"">
                            <h2 style=""margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700;"">Welcome, {encodedName}! 👋</h2>
                            <p style=""margin: 0 0 20px 0; color: #475569; font-size: 15px;"">
                                An official account has been provisioned for you on the <strong>RCCG Glorious Church Portal</strong>. You can now access member directories, event schedules, rosters, service reports, and church administration services.
                            </p>

                            <!-- Credentials Box -->
                            <div style=""background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #00205B; border-radius: 8px; padding: 20px; margin: 24px 0;"">
                                <h3 style=""margin: 0 0 14px 0; color: #00205B; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;"">Your Temporary Credentials</h3>
                                <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" style=""font-size: 14px;"">
                                    <tr>
                                        <td style=""padding: 6px 0; color: #64748b; width: 140px; font-weight: 600;"">Portal Link:</td>
                                        <td style=""padding: 6px 0; color: #0f172a;""><a href=""{frontendUrl}"" style=""color: #2563eb; text-decoration: none; font-weight: 600;"">{frontendUrl}</a></td>
                                    </tr>
                                    <tr>
                                        <td style=""padding: 6px 0; color: #64748b; font-weight: 600;"">Username / Email:</td>
                                        <td style=""padding: 6px 0; color: #0f172a; font-weight: 600;"">{encodedEmail}</td>
                                    </tr>
                                    <tr>
                                        <td style=""padding: 6px 0; color: #64748b; font-weight: 600;"">Temporary Password:</td>
                                        <td style=""padding: 6px 0;"">
                                            <span style=""display: inline-block; background-color: #e2e8f0; color: #00205B; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 15px; font-weight: 700; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px;"">{encodedPassword}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- CTA Button -->
                            <div style=""text-align: center; margin: 32px 0;"">
                                <a href=""{loginUrl}"" style=""display: inline-block; background-color: #00205B; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 32, 91, 0.25);"">
                                    Sign In to Parish Portal &rarr;
                                </a>
                            </div>

                            <!-- Security Notice Callout -->
                            <div style=""background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin-top: 24px;"">
                                <p style=""margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;"">
                                    <strong>🔒 Security Notice:</strong> For your protection, you are required to change your temporary password immediately upon your first login. Please do not share these credentials with anyone.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;"">
                            <p style=""margin: 0 0 6px 0; color: #64748b; font-size: 13px;"">
                                &copy; {currentYear} RCCG Glorious Church. All rights reserved.
                            </p>
                            <p style=""margin: 0; color: #94a3b8; font-size: 12px;"">
                                If you did not request or expect this account, please notify church administration immediately.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";

            using var smtpClient = CreateSmtpClient();
            using var message = new MailMessage
            {
                From = GetSenderAddress(),
                Subject = "Welcome to RCCG Glorious Church — Your Login Credentials",
                Body = bodyHtml,
                IsBodyHtml = true
            };
            message.To.Add(new MailAddress(recipientEmail.Trim(), recipientName));

            await smtpClient.SendMailAsync(message, cancellationToken);

            _logger.LogInformation(
                "Successfully dispatched live welcome onboarding email to {Email} ({Name}) via SMTP.",
                recipientEmail, recipientName);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to send welcome email via SMTP to {Email} ({Name}). User onboarding transaction will proceed safely.",
                recipientEmail, recipientName);
        }
    }

    public async Task SendYouthRegistrationAlertAsync(
        IEnumerable<string> recipientEmails,
        string registrantName,
        string registrantEmail,
        string registrantPhone,
        string category,
        string primaryInterest,
        CancellationToken cancellationToken = default)
    {
        var emailList = recipientEmails?
            .Where(e => !string.IsNullOrWhiteSpace(e))
            .Select(e => e.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList() ?? new List<string>();

        if (emailList.Count == 0)
        {
            var fallback = _configuration["EmailSettings:Username"] ?? "neotroltd@gmail.com";
            emailList.Add(fallback);
        }

        var recipientsDisplay = string.Join(", ", emailList);

        try
        {
            var frontendUrl = (_configuration["AppConfig:FrontendBaseUrl"] ?? "https://rccggloriouschurch.vercel.app").TrimEnd('/');
            var membersUrl = $"{frontendUrl}/members";

            var encodedName = WebUtility.HtmlEncode(registrantName ?? "Prospective Youth Member");
            var encodedEmail = WebUtility.HtmlEncode(registrantEmail ?? "N/A");
            var encodedPhone = WebUtility.HtmlEncode(registrantPhone ?? "N/A");
            var encodedCategory = WebUtility.HtmlEncode(category ?? "Youth / Young Adult");
            var encodedInterest = WebUtility.HtmlEncode(primaryInterest ?? "Youth Fellowship & Leadership");
            var timestampUtc = DateTime.UtcNow.ToString("MMM dd, yyyy HH:mm");

            var bodyHtml = $@"<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""utf-8"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
    <title>New Youth Registration Alert</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;"">
    <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" style=""background-color: #f1f5f9; padding: 32px 16px;"">
        <tr>
            <td align=""center"">
                <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" style=""max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);"">
                    <!-- Header -->
                    <tr>
                        <td style=""background: linear-gradient(135deg, #00205B 0%, #0a3682 100%); padding: 32px; text-align: center; border-bottom: 4px solid #10B981;"">
                            <h1 style=""margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;"">RCCG GLORIOUS CHURCH</h1>
                            <p style=""margin: 6px 0 0 0; color: #a7f3d0; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;"">Youth Ministry &bull; New Registration Alert</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style=""padding: 32px;"">
                            <h2 style=""margin: 0 0 12px 0; color: #0f172a; font-size: 18px; font-weight: 700;"">Youth Leadership Team,</h2>
                            <p style=""margin: 0 0 20px 0; color: #475569; font-size: 14px;"">
                                A new youth prospect has registered online via the church portal. Below are their registration details for immediate follow-up:
                            </p>

                            <!-- Details Table -->
                            <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" style=""background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;"">
                                <tr style=""border-bottom: 1px solid #e2e8f0;"">
                                    <td style=""padding: 12px 16px; color: #64748b; font-weight: 600; width: 140px; font-size: 13px;"">Full Name:</td>
                                    <td style=""padding: 12px 16px; color: #0f172a; font-weight: 700; font-size: 14px;"">{encodedName}</td>
                                </tr>
                                <tr style=""border-bottom: 1px solid #e2e8f0; background-color: #ffffff;"">
                                    <td style=""padding: 12px 16px; color: #64748b; font-weight: 600; font-size: 13px;"">Email Address:</td>
                                    <td style=""padding: 12px 16px; color: #0f172a; font-size: 14px;""><a href=""mailto:{encodedEmail}"" style=""color: #2563eb; text-decoration: none;"">{encodedEmail}</a></td>
                                </tr>
                                <tr style=""border-bottom: 1px solid #e2e8f0;"">
                                    <td style=""padding: 12px 16px; color: #64748b; font-weight: 600; font-size: 13px;"">Phone Number:</td>
                                    <td style=""padding: 12px 16px; color: #0f172a; font-size: 14px;"">{encodedPhone}</td>
                                </tr>
                                <tr style=""border-bottom: 1px solid #e2e8f0; background-color: #ffffff;"">
                                    <td style=""padding: 12px 16px; color: #64748b; font-weight: 600; font-size: 13px;"">Youth Category:</td>
                                    <td style=""padding: 12px 16px; color: #0f172a; font-size: 14px;""><span style=""background-color: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-weight: 600;"">{encodedCategory}</span></td>
                                </tr>
                                <tr style=""border-bottom: 1px solid #e2e8f0;"">
                                    <td style=""padding: 12px 16px; color: #64748b; font-weight: 600; font-size: 13px;"">Primary Interest:</td>
                                    <td style=""padding: 12px 16px; color: #0f172a; font-size: 14px;"">{encodedInterest}</td>
                                </tr>
                                <tr style=""background-color: #ffffff;"">
                                    <td style=""padding: 12px 16px; color: #64748b; font-weight: 600; font-size: 13px;"">Registered At:</td>
                                    <td style=""padding: 12px 16px; color: #64748b; font-size: 13px;"">{timestampUtc} UTC</td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <div style=""text-align: center; margin: 28px 0;"">
                                <a href=""{membersUrl}"" style=""display: inline-block; background-color: #00205B; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 6px;"">
                                    View Members Directory &rarr;
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;"">
                            <p style=""margin: 0; color: #64748b; font-size: 12px;"">
                                RCCG Glorious Church Youth Leadership Notification Service &bull; Automated System Dispatch
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";

            using var smtpClient = CreateSmtpClient();
            using var message = new MailMessage
            {
                From = GetSenderAddress(),
                Subject = $"Youth Registration Alert: {registrantName} ({category})",
                Body = bodyHtml,
                IsBodyHtml = true
            };

            foreach (var email in emailList)
            {
                message.To.Add(new MailAddress(email));
            }

            await smtpClient.SendMailAsync(message, cancellationToken);

            _logger.LogInformation(
                "Successfully dispatched youth registration alert email via SMTP to [{Recipients}] for registrant '{Name}'.",
                recipientsDisplay, registrantName);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to dispatch youth registration alert email via SMTP to [{Recipients}] for registrant '{Name}'. Registration transaction will proceed safely.",
                recipientsDisplay, registrantName);
        }
    }

    private SmtpClient CreateSmtpClient()
    {
        var host = _configuration["EmailSettings:Host"] ?? "smtp.gmail.com";
        var port = int.TryParse(_configuration["EmailSettings:Port"], out var p) ? p : 587;
        var username = _configuration["EmailSettings:Username"] ?? "neotroltd@gmail.com";
        var password = _configuration["EmailSettings:Password"] ?? "jjbhftkgtfnicawt";
        var enableSsl = !bool.TryParse(_configuration["EmailSettings:EnableSsl"], out var ssl) || ssl;

        return new SmtpClient(host, port)
        {
            EnableSsl = enableSsl,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(username, password),
            Timeout = 15000 // 15s timeout
        };
    }

    private MailAddress GetSenderAddress()
    {
        var fromConfig = _configuration["EmailSettings:From"];
        var username = _configuration["EmailSettings:Username"] ?? "neotroltd@gmail.com";

        if (!string.IsNullOrWhiteSpace(fromConfig))
        {
            try
            {
                var trimmed = fromConfig.Trim();
                if (trimmed.StartsWith("\"") && trimmed.Contains("\" <") && trimmed.EndsWith(">"))
                {
                    var parts = trimmed.Split(new[] { "\" <" }, StringSplitOptions.RemoveEmptyEntries);
                    var displayName = parts[0].TrimStart('\"');
                    var address = parts[1].TrimEnd('>');
                    return new MailAddress(address, displayName);
                }
                return new MailAddress(trimmed);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not parse configured 'From' address '{FromConfig}'. Falling back to default sender.", fromConfig);
            }
        }

        return new MailAddress(username, "RCCG Glorious Church");
    }
}


