using CMS.Application.Common.Interfaces;
using CMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Infrastructure.Persistence;

public static class CmsDbSeeder
{
    public static async Task SeedInitialDataAsync(CmsDbContext dbContext, IPasswordHasher passwordHasher)
    {
        // 1. Seed Organization Settings
        if (!await dbContext.OrganizationSettings.AnyAsync())
        {
            dbContext.OrganizationSettings.Add(new OrganizationSetting
            {
                ParishName = "RCCG Glorious Parish",
                LogoUrl = "https://images.unsplash.com/photo-1548625361-185122c4f826?auto=format&fit=crop&q=80&w=300",
                BaseCurrency = "NGN"
            });
        }

        // 2. Seed Clean System Accounts
        var defaultAccounts = new List<(string Email, string Name, string Role, string Pass)>
        {
            ("admin@rccgglorious.org", "System Administrator", "SystemAdmin", "Admin@12345"),
            ("pastor@rccgglorious.org", "Pastor In Charge", "Pastor", "Pastor@12345"),
            ("hod.ushering@rccgglorious.org", "Sister Grace Usang (HOD Ushering)", "HOD", "Hod@12345"),
            ("hod.choir@rccgglorious.org", "Minister David Okafor (HOD Choir)", "HOD", "Hod@12345"),
            ("hod.fellowship@rccgglorious.org", "Brother Samuel Adebayo (HOD Fellowship)", "HOD", "Hod@12345"),
            ("hod.outreach@rccgglorious.org", "Evangelist Peter King (HOD Outreach)", "HOD", "Hod@12345")
        };

        foreach (var acc in defaultAccounts)
        {
            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == acc.Email);
            if (existingUser == null)
            {
                dbContext.Users.Add(new ApplicationUser
                {
                    FullName = acc.Name,
                    Email = acc.Email,
                    Phone = "+2348000000000",
                    Role = acc.Role,
                    MustChangePassword = false,
                    IsActive = true,
                    PasswordHash = passwordHasher.HashPassword(acc.Pass)
                });
            }
            else
            {
                existingUser.Role = acc.Role;
                existingUser.PasswordHash = passwordHasher.HashPassword(acc.Pass);
                existingUser.MustChangePassword = false;
                existingUser.IsActive = true;
            }
        }

        // 3. Seed Service Types
        if (!await dbContext.ServiceTypes.AnyAsync())
        {
            dbContext.ServiceTypes.AddRange(
                new ServiceType { Name = "Sunday 1st Service", Category = "Sunday", IsActive = true },
                new ServiceType { Name = "Sunday 2nd Service", Category = "Sunday", IsActive = true },
                new ServiceType { Name = "Digging Deep", Category = "Midweek", IsActive = true },
                new ServiceType { Name = "Faith Clinic", Category = "Midweek", IsActive = true }
            );
        }

        // 4. Seed Offering Categories
        if (!await dbContext.OfferingCategories.AnyAsync())
        {
            dbContext.OfferingCategories.AddRange(
                new OfferingCategory { Name = "Sunday Offering", Code = "OFFR", IsActive = true },
                new OfferingCategory { Name = "Tithe", Code = "TITH", IsActive = true },
                new OfferingCategory { Name = "Building Fund", Code = "BLDG", IsActive = true },
                new OfferingCategory { Name = "Thanksgiving", Code = "THKG", IsActive = true },
                new OfferingCategory { Name = "First Fruit", Code = "FRST", IsActive = true }
            );
        }

        // 5. Seed Departments
        if (!await dbContext.Departments.AnyAsync())
        {
            dbContext.Departments.AddRange(
                new Department { Name = "Ushering Department", Code = "USH-01", HeadOfDepartment = "Sister Grace Usang", Description = "Sanctuary Protocol & Ushering", IsActive = true },
                new Department { Name = "Choir & Praise Team", Code = "CHR-01", HeadOfDepartment = "Minister David Okafor", Description = "Worship & Praise Administration", IsActive = true },
                new Department { Name = "Media & Technical", Code = "MED-01", HeadOfDepartment = "Brother Daniel Chidubem", Description = "Audio, Video & Broadcast", IsActive = true },
                new Department { Name = "Protocol & Security", Code = "PRT-01", HeadOfDepartment = "Deacon James Vance", Description = "Parish Security & Order", IsActive = true },
                new Department { Name = "House Fellowship", Code = "HFL-01", HeadOfDepartment = "Brother Samuel Adebayo", Description = "Home Cell Administration", IsActive = true },
                new Department { Name = "Church on the Street (Outreach)", Code = "OUT-01", HeadOfDepartment = "Evangelist Peter King", Description = "Evangelism & Community Outreach", IsActive = true }
            );
        }

        await dbContext.SaveChangesAsync();
    }
}
