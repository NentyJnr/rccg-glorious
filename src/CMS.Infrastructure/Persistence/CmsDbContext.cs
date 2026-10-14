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
    public DbSet<ParishEvent> ParishEvents => Set<ParishEvent>();
    public DbSet<EventSpeaker> EventSpeakers => Set<EventSpeaker>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);
        configurationBuilder.Properties<decimal>().HavePrecision(18, 2);
    }

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

        // HouseFellowshipReport financial precision
        modelBuilder.Entity<HouseFellowshipReport>(entity =>
        {
            entity.Property(h => h.OfferingAmount).HasPrecision(18, 2);
        });

        // ServiceReport & ServiceReportOffering relationships and precisions
        modelBuilder.Entity<ServiceReport>(entity =>
        {
            entity.Property(s => s.SingleOfferingAmount).HasPrecision(18, 2);
            entity.Property(s => s.TotalSundayOffering).HasPrecision(18, 2);

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
            entity.Property(s => s.Amount).HasPrecision(18, 2);

            entity.HasOne(s => s.ServiceReport)
                .WithMany(r => r.OfferingBreakdown)
                .HasForeignKey(s => s.ServiceReportId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.OfferingCategory)
                .WithMany()
                .HasForeignKey(s => s.OfferingCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ParishEvent & EventSpeaker relationships
        modelBuilder.Entity<ParishEvent>(entity =>
        {
            entity.Property(e => e.Title).IsRequired().HasMaxLength(250);
            entity.Property(e => e.Venue).IsRequired().HasMaxLength(250);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.HasMany(e => e.Speakers)
                .WithOne(s => s.ParishEvent)
                .HasForeignKey(s => s.ParishEventId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EventSpeaker>(entity =>
        {
            entity.Property(s => s.FullName).IsRequired().HasMaxLength(150);
            entity.Property(s => s.EcclesiasticalTitle).HasMaxLength(50);
            entity.Property(s => s.MinistryRole).HasMaxLength(100);
            entity.Property(s => s.Organization).HasMaxLength(200);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return base.SaveChangesAsync(cancellationToken);
    }
}
