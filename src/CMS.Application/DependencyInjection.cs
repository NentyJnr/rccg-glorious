using CMS.Application.Services;
using CMS.Application.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace CMS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUserOnboardingService, UserOnboardingService>();
        services.AddScoped<ISsoUserProvisioningService, SsoUserProvisioningService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<IServiceReportService, ServiceReportService>();
        services.AddScoped<ISetupService, SetupService>();
        services.AddScoped<IMemberService, MemberService>();
        services.AddScoped<ITestimonyService, TestimonyService>();
        services.AddScoped<IRosterService, RosterService>();

        services.AddValidatorsFromAssemblyContaining<CreateServiceReportCommandValidator>();

        return services;
    }
}
