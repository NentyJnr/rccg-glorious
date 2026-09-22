using CMS.Application.Common.Interfaces;
using CMS.Application.DTOs;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Validators;

public class CreateServiceReportCommandValidator : AbstractValidator<CreateServiceReportCommand>
{
    public CreateServiceReportCommandValidator(ICmsDbContext dbContext)
    {
        RuleFor(x => x.ServiceTypeId).NotEmpty();
        RuleFor(x => x.ServiceDate).LessThanOrEqualTo(DateTime.UtcNow.AddDays(1))
            .WithMessage("Service date cannot be in the future.");

        // Headcount non-negative validation
        RuleFor(x => x.MenCount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.WomenCount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ChildrenCount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.FirstTimersCount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.NewConvertsCount).GreaterThanOrEqualTo(0);

        // Conditional Rules based on ServiceType Category
        WhenAsync(async (cmd, cancel) => await IsServiceCategoryAsync(dbContext, cmd.ServiceTypeId, "Midweek", cancel), () =>
        {
            RuleFor(x => x.PreacherMinisterId)
                .NotEmpty()
                .WithMessage("A preacher must be assigned for Midweek Services.");

            RuleFor(x => x.SingleOfferingAmount)
                .NotNull()
                .GreaterThanOrEqualTo(0)
                .WithMessage("A valid single summary offering amount is required for Midweek Services.");
        });

        WhenAsync(async (cmd, cancel) => await IsServiceCategoryAsync(dbContext, cmd.ServiceTypeId, "Sunday", cancel), () =>
        {
            RuleFor(x => x.OfferingBreakdown)
                .NotNull()
                .NotEmpty()
                .WithMessage("Sunday Services require line-item offering breakdown amounts.");

            RuleForEach(x => x.OfferingBreakdown).ChildRules(offering =>
            {
                offering.RuleFor(o => o.OfferingCategoryId).NotEmpty();
                offering.RuleFor(o => o.Amount).GreaterThanOrEqualTo(0);
            });
        });
    }

    private static async Task<bool> IsServiceCategoryAsync(ICmsDbContext dbContext, Guid serviceTypeId, string categoryName, CancellationToken cancellationToken)
    {
        var serviceType = await dbContext.ServiceTypes.FirstOrDefaultAsync(s => s.Id == serviceTypeId, cancellationToken);
        return serviceType != null && string.Equals(serviceType.Category, categoryName, StringComparison.OrdinalIgnoreCase);
    }
}
