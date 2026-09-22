using CMS.Application.Common.Interfaces;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Infrastructure.Persistence;

public class CmsDbContext : DbContext, ICmsDbContext
{
    public CmsDbContext(DbContextOptions<CmsDbContext> options) : base(options)
    {
    }

    public DbSet<OrganizationSetting> OrganizationSettings => Set<OrganizationSetting>();
    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();
    public DbSet<Minister> Ministers => Set<Minister>();
    public DbSet<ServiceType> ServiceTypes => Set<ServiceType>();
    public DbSet<OfferingCategory> OfferingCategories => Set<OfferingCategory>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<ServiceReport> ServiceReports => Set<ServiceReport>();
    public DbSet<ServiceReportOffering> ServiceReportOfferings => Set<ServiceReportOffering>();
    public DbSet<OutreachReport> OutreachReports => Set<OutreachReport>();
    public DbSet<HouseFellowshipReport> HouseFellowshipReports => Set<HouseFellowshipReport>();
    public DbSet<Testimony> Testimonies => Set<Testimony>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ApplicationUser configuration
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(150);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
        });

        // ServiceReport & ServiceReportOffering relationships
        modelBuilder.Entity<ServiceReport>(entity =>
        {
            entity.HasOne(s => s.ServiceType)
                .WithMany()
                .HasForeignKey(s => s.ServiceTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(s => s.PreacherMinister)
                .WithMany()
                .HasForeignKey(s => s.PreacherMinisterId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ServiceReportOffering>(entity =>
        {
            entity.HasOne(s => s.ServiceReport)
                .WithMany(r => r.OfferingBreakdown)
                .HasForeignKey(s => s.ServiceReportId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.OfferingCategory)
                .WithMany()
                .HasForeignKey(s => s.OfferingCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return base.SaveChangesAsync(cancellationToken);
    }
}
