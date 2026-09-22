using CMS.Application.Common.Interfaces;
using CMS.Application.Services;
using CMS.Application.Validators;
using CMS.Infrastructure;
using CMS.Infrastructure.Persistence;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Add Infrastructure & Application Services
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped<IUserOnboardingService, UserOnboardingService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateServiceReportCommandValidator>();

// CORS policy configuration
var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://rccggloriouschurch.vercel.app" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendOrigin", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ensure Database Created for Local Dev & Seed Initial Accounts
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CmsDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
    dbContext.Database.EnsureCreated();
    await CmsDbSeeder.SeedInitialDataAsync(dbContext, passwordHasher);
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowFrontendOrigin");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program { }
