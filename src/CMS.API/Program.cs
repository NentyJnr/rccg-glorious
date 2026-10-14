using CMS.API.Common;
using CMS.Application;
using CMS.Application.Common.Interfaces;
using CMS.Infrastructure;
using CMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add Infrastructure & Application Services
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

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

// Global Exception Handling Middleware (Standard Enterprise Error Envelope)
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        var envelope = ApiResponseEnvelope<object>.Fail($"Server error: {ex.Message}");
        await context.Response.WriteAsJsonAsync(envelope);
    }
});

// Swagger enabled for all environments (including MonsterASP Production)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "RCCG Glorious Church API v1");
    c.RoutePrefix = "swagger";
});

// Apply database migrations and seed initial data safely
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CmsDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

    // 1. Ensure all pending EF Core migrations are executed and tables are created
    await dbContext.Database.MigrateAsync();

    // 2. Seed initial data into the created tables
    await CmsDbSeeder.SeedInitialDataAsync(dbContext, passwordHasher);
}

app.UseCors("AllowFrontendOrigin");
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program { }