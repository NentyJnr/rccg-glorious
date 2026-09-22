using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Application.Common.Interfaces;

public interface ICmsDbContext
{
    DbSet<OrganizationSetting> OrganizationSettings { get; }
    DbSet<ApplicationUser> Users { get; }
    DbSet<Minister> Ministers { get; }
    DbSet<ServiceType> ServiceTypes { get; }
    DbSet<OfferingCategory> OfferingCategories { get; }
    DbSet<Department> Departments { get; }
    DbSet<ServiceReport> ServiceReports { get; }
    DbSet<ServiceReportOffering> ServiceReportOfferings { get; }
    DbSet<OutreachReport> OutreachReports { get; }
    DbSet<HouseFellowshipReport> HouseFellowshipReports { get; }
    DbSet<Testimony> Testimonies { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
