using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using CMS.Application.Validators;
using CMS.Domain.Entities;
using CMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CMS.Tests;

public class ServiceReportValidationTests
{
    private ICmsDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<CmsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new CmsDbContext(options);
    }

    [Fact]
    public async Task MidweekService_FailsValidation_When_Preacher_Or_SingleOffering_Is_Missing()
    {
        // Arrange
        var dbContext = GetInMemoryDbContext();
        var midweekType = new ServiceType { Id = Guid.NewGuid(), Name = "Digging Deep", Category = "Midweek" };
        dbContext.ServiceTypes.Add(midweekType);
        await dbContext.SaveChangesAsync();

        var validator = new CreateServiceReportCommandValidator(dbContext);

        var invalidCommand = new CreateServiceReportCommand(
            ServiceTypeId: midweekType.Id,
            ServiceDate: DateTime.UtcNow,
            MenCount: 10,
            WomenCount: 15,
            ChildrenCount: 5,
            FirstTimersCount: 0,
            NewConvertsCount: 0,
            PreacherMinisterId: null, // Missing required Preacher
            SingleOfferingAmount: null, // Missing required Offering Amount
            OfferingBreakdown: null,
            CreatedByUserId: Guid.NewGuid()
        );

        // Act
        var result = await validator.ValidateAsync(invalidCommand);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("PreacherMinisterId"));
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("SingleOfferingAmount"));
    }

    [Fact]
    public async Task SundayService_FailsValidation_When_OfferingBreakdown_Is_Empty()
    {
        // Arrange
        var dbContext = GetInMemoryDbContext();
        var sundayType = new ServiceType { Id = Guid.NewGuid(), Name = "1st Service", Category = "Sunday" };
        dbContext.ServiceTypes.Add(sundayType);
        await dbContext.SaveChangesAsync();

        var validator = new CreateServiceReportCommandValidator(dbContext);

        var invalidCommand = new CreateServiceReportCommand(
            ServiceTypeId: sundayType.Id,
            ServiceDate: DateTime.UtcNow,
            MenCount: 50,
            WomenCount: 70,
            ChildrenCount: 30,
            FirstTimersCount: 5,
            NewConvertsCount: 2,
            PreacherMinisterId: null,
            SingleOfferingAmount: null,
            OfferingBreakdown: new List<OfferingBreakdownItemDto>(), // Empty breakdown
            CreatedByUserId: Guid.NewGuid()
        );

        // Act
        var result = await validator.ValidateAsync(invalidCommand);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("OfferingBreakdown"));
    }

    [Fact]
    public async Task SundayService_PassesValidation_With_Valid_OfferingBreakdown()
    {
        // Arrange
        var dbContext = GetInMemoryDbContext();
        var sundayType = new ServiceType { Id = Guid.NewGuid(), Name = "1st Service", Category = "Sunday" };
        dbContext.ServiceTypes.Add(sundayType);

        var category1 = new OfferingCategory { Id = Guid.NewGuid(), Name = "Workers Offering", Code = "WRK" };
        var category2 = new OfferingCategory { Id = Guid.NewGuid(), Name = "Sunday School Offering", Code = "SS" };
        dbContext.OfferingCategories.AddRange(category1, category2);

        await dbContext.SaveChangesAsync();

        var validator = new CreateServiceReportCommandValidator(dbContext);

        var validCommand = new CreateServiceReportCommand(
            ServiceTypeId: sundayType.Id,
            ServiceDate: DateTime.UtcNow,
            MenCount: 50,
            WomenCount: 70,
            ChildrenCount: 30,
            FirstTimersCount: 5,
            NewConvertsCount: 2,
            PreacherMinisterId: null,
            SingleOfferingAmount: null,
            OfferingBreakdown: new List<OfferingBreakdownItemDto>
            {
                new OfferingBreakdownItemDto(category1.Id, 15000),
                new OfferingBreakdownItemDto(category2.Id, 25000)
            },
            CreatedByUserId: Guid.NewGuid()
        );

        // Act
        var result = await validator.ValidateAsync(validCommand);

        // Assert
        Assert.True(result.IsValid);
    }
}
