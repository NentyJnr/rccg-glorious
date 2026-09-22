using CMS.Application.Common.Interfaces;
using CMS.Infrastructure.Persistence;
using CMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CMS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        string? connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            services.AddDbContext<CmsDbContext>(options =>
                options.UseSqlite("Data Source=cms_parish_portal.db"));
        }
        else
        {
            services.AddDbContext<CmsDbContext>(options =>
                options.UseSqlServer(connectionString));
        }

        services.AddScoped<ICmsDbContext>(provider => provider.GetRequiredService<CmsDbContext>());
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddTransient<IEmailNotificationService, EmailNotificationService>();

        return services;
    }
}
