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

        // 6. Seed Parish Events & Guest Speakers
        if (!await dbContext.ParishEvents.AnyAsync())
        {
            var praiseNight = new ParishEvent
            {
                Title = "Annual Praise & Worship Night 2026",
                Theme = "Sounds of Victory & Divine Exaltation",
                Description = "Join us for an unforgettable night of high praise, deep worship, and prophetic ministrations as we celebrate God's divine faithfulness across the zone.",
                CoverImageUrl = "/event_praise_night.jpg",
                EventDate = new DateTime(2026, 10, 24, 21, 0, 0, DateTimeKind.Utc),
                TimeString = "Friday, October 24, 2026 • 9:00 PM GMT",
                Venue = "Main Sanctuary Auditorium, RCCG Glorious Church Parish",
                Category = "Praise & Worship",
                IsFeatured = true,
                RegistrationRequired = true,
                Status = "Upcoming",
                MaxCapacity = 500,
                Speakers = new List<EventSpeaker>
                {
                    new EventSpeaker
                    {
                        FullName = "Pastor E. A. Adeboye",
                        EcclesiasticalTitle = "Pastor",
                        MinistryRole = "General Overseer / Apostolic Blessings",
                        Organization = "RCCG Worldwide",
                        PhotoUrl = "/adeboye-enoch-jpeg.webp",
                        ShortBio = "General Overseer of the Redeemed Christian Church of God.",
                        DisplayOrder = 1
                    },
                    new EventSpeaker
                    {
                        FullName = "Pastor (Dr.) Taiwo Adetunji",
                        EcclesiasticalTitle = "Pastor (Dr.)",
                        MinistryRole = "Host Pastor & Convener",
                        Organization = "RCCG Glorious Church",
                        PhotoUrl = "/dr_taiwo_adetunji.jpg",
                        ShortBio = "Pastor-in-Charge of RCCG Glorious Church Parish, passionate about revival and transformative worship.",
                        DisplayOrder = 2
                    },
                    new EventSpeaker
                    {
                        FullName = "Minister David Okafor",
                        EcclesiasticalTitle = "Minister",
                        MinistryRole = "Guest Worship Minister",
                        Organization = "RCCG National Praise Team",
                        PhotoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
                        ShortBio = "Anointed worship minister and recording psalmist leading atmospheres of praise.",
                        DisplayOrder = 3
                    }
                }
            };

            var youthSummit = new ParishEvent
            {
                Title = "Kingdom Youth Leadership Summit",
                Theme = "Empowered for Dominion & Excellence",
                Description = "Empowering young professionals, students, and emerging leaders with biblical wisdom, career strategies, and spiritual capacity to excel in contemporary society.",
                CoverImageUrl = "/event_youth_summit.jpg",
                EventDate = new DateTime(2026, 11, 14, 10, 0, 0, DateTimeKind.Utc),
                TimeString = "Saturday, November 14, 2026 • 10:00 AM GMT",
                Venue = "Youth Center & Online Virtual Live Stream",
                Category = "Youth & Leadership",
                IsFeatured = true,
                RegistrationRequired = true,
                Status = "Upcoming",
                MaxCapacity = 350,
                Speakers = new List<EventSpeaker>
                {
                    new EventSpeaker
                    {
                        FullName = "Pastor (Dr.) Taiwo Adetunji",
                        EcclesiasticalTitle = "Pastor (Dr.)",
                        MinistryRole = "Host & Keynote Speaker",
                        Organization = "RCCG Glorious Church",
                        PhotoUrl = "/dr_taiwo_adetunji.jpg",
                        ShortBio = "Spiritual mentor and ministry leader dedicated to building youth capacity.",
                        DisplayOrder = 1
                    },
                    new EventSpeaker
                    {
                        FullName = "Sister Grace Usang",
                        EcclesiasticalTitle = "Sister",
                        MinistryRole = "Guest Speaker / Career Panelist",
                        Organization = "Vatebra Enterprise Tech",
                        PhotoUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
                        ShortBio = "Corporate technology executive and youth empowerment advocate.",
                        DisplayOrder = 2
                    }
                }
            };

            dbContext.ParishEvents.AddRange(praiseNight, youthSummit);
        }

        await dbContext.SaveChangesAsync();
    }
}
