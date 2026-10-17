-- =========================================================================================
-- RCCG GLORIOUS PARISH PORTAL — MASTER CONSOLIDATED DATABASE MIGRATION SCRIPT
-- Script File: src/CMS.Infrastructure/Migrations/master_migration_script.sql
-- Governance Compliance: Team Vatebra Enterprise Governance §5.1 (Rule 5.1)
-- Target RDBMS: Microsoft SQL Server 2012+ / Azure SQL Database
-- Description: Creates all 13 domain tables, audit columns, indexes, foreign keys,
--              EF Core migration history records, and idempotent initial system seed data.
-- =========================================================================================

SET NOCOUNT ON;
GO

-- 0. Ensure Migration History Table Exists
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

-- =========================================================================================
-- SECTION 1: CORE SYSTEM & PARISH CONFIGURATION TABLES
-- =========================================================================================

-- 1. OrganizationSettings Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[OrganizationSettings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [OrganizationSettings] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [ParishName] nvarchar(max) NOT NULL,
        [LogoUrl] nvarchar(max) NULL,
        [BaseCurrency] nvarchar(max) NOT NULL DEFAULT N'NGN',
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_OrganizationSettings] PRIMARY KEY ([Id])
    );
END;
GO

-- 2. Users Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Users] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [FullName] nvarchar(150) NOT NULL,
        [Email] nvarchar(150) NOT NULL,
        [Phone] nvarchar(max) NOT NULL DEFAULT N'',
        [Role] nvarchar(max) NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [MustChangePassword] bit NOT NULL DEFAULT 0,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[Users]') AND name = 'Phone')
    BEGIN
        ALTER TABLE [Users] ADD [Phone] nvarchar(max) NOT NULL DEFAULT N'';
    END;
END;
GO

-- 3. Ministers Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[Ministers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Ministers] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Title] nvarchar(max) NOT NULL,
        [FullName] nvarchar(max) NOT NULL,
        [ContactPhone] nvarchar(max) NOT NULL DEFAULT N'',
        [Email] nvarchar(max) NOT NULL DEFAULT N'',
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_Ministers] PRIMARY KEY ([Id])
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[Ministers]') AND name = 'ContactPhone')
        ALTER TABLE [Ministers] ADD [ContactPhone] nvarchar(max) NOT NULL DEFAULT N'';
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[Ministers]') AND name = 'Email')
        ALTER TABLE [Ministers] ADD [Email] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

-- 4. ServiceTypes Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[ServiceTypes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ServiceTypes] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Name] nvarchar(max) NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_ServiceTypes] PRIMARY KEY ([Id])
    );
END;
GO

-- 5. OfferingCategories Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[OfferingCategories]') AND type in (N'U'))
BEGIN
    CREATE TABLE [OfferingCategories] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_OfferingCategories] PRIMARY KEY ([Id])
    );
END;
GO

-- 6. Departments Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[Departments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Departments] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [HeadOfDepartment] nvarchar(max) NOT NULL DEFAULT N'',
        [Description] nvarchar(max) NOT NULL DEFAULT N'',
        [MeetingSchedule] nvarchar(max) NOT NULL DEFAULT N'',
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_Departments] PRIMARY KEY ([Id])
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[Departments]') AND name = 'MeetingSchedule')
        ALTER TABLE [Departments] ADD [MeetingSchedule] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

-- =========================================================================================
-- SECTION 2: SERVICE & REPORTING TABLES
-- =========================================================================================

-- 7. ServiceReports Table
-- Note: SQL Server requires ON DELETE NO ACTION (NEVER use 'RESTRICT')
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[ServiceReports]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ServiceReports] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [ServiceTypeId] uniqueidentifier NOT NULL,
        [ServiceDate] datetime2 NOT NULL,
        [MenCount] int NOT NULL DEFAULT 0,
        [WomenCount] int NOT NULL DEFAULT 0,
        [ChildrenCount] int NOT NULL DEFAULT 0,
        [FirstTimersCount] int NOT NULL DEFAULT 0,
        [NewConvertsCount] int NOT NULL DEFAULT 0,
        [PreacherMinisterId] uniqueidentifier NULL,
        [SingleOfferingAmount] decimal(18,2) NULL,
        [TotalSundayOffering] decimal(18,2) NULL,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_ServiceReports] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ServiceReports_ServiceTypes_ServiceTypeId] FOREIGN KEY ([ServiceTypeId]) REFERENCES [ServiceTypes] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_ServiceReports_Ministers_PreacherMinisterId] FOREIGN KEY ([PreacherMinisterId]) REFERENCES [Ministers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

-- 8. ServiceReportOfferings Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[ServiceReportOfferings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ServiceReportOfferings] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [ServiceReportId] uniqueidentifier NOT NULL,
        [OfferingCategoryId] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL DEFAULT 0,
        CONSTRAINT [PK_ServiceReportOfferings] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ServiceReportOfferings_ServiceReports_ServiceReportId] FOREIGN KEY ([ServiceReportId]) REFERENCES [ServiceReports] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_ServiceReportOfferings_OfferingCategories_OfferingCategoryId] FOREIGN KEY ([OfferingCategoryId]) REFERENCES [OfferingCategories] ([Id]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_ServiceReportOfferings_OfferingCategoryId] ON [ServiceReportOfferings] ([OfferingCategoryId]);
    CREATE INDEX [IX_ServiceReportOfferings_ServiceReportId] ON [ServiceReportOfferings] ([ServiceReportId]);
END;
GO

-- 9. HouseFellowshipReports Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[HouseFellowshipReports]') AND type in (N'U'))
BEGIN
    CREATE TABLE [HouseFellowshipReports] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [CenterName] nvarchar(max) NOT NULL,
        [MeetingDate] datetime2 NOT NULL,
        [LeaderName] nvarchar(max) NOT NULL,
        [MenCount] int NOT NULL DEFAULT 0,
        [WomenCount] int NOT NULL DEFAULT 0,
        [ChildrenCount] int NOT NULL DEFAULT 0,
        [NewConvertsCount] int NOT NULL DEFAULT 0,
        [OfferingAmount] decimal(18,2) NOT NULL DEFAULT 0,
        [StudyTopic] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_HouseFellowshipReports] PRIMARY KEY ([Id])
    );
END;
GO

-- 10. OutreachReports Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[OutreachReports]') AND type in (N'U'))
BEGIN
    CREATE TABLE [OutreachReports] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [LocationName] nvarchar(max) NOT NULL,
        [Date] datetime2 NOT NULL,
        [MenCount] int NOT NULL DEFAULT 0,
        [WomenCount] int NOT NULL DEFAULT 0,
        [ChildrenCount] int NOT NULL DEFAULT 0,
        [NewConvertsCount] int NOT NULL DEFAULT 0,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_OutreachReports] PRIMARY KEY ([Id])
    );
END;
GO

-- =========================================================================================
-- SECTION 3: EVENTS, SPEAKERS & PUBLIC TESTIMONIES
-- =========================================================================================

-- 11. ParishEvents Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[ParishEvents]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ParishEvents] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Title] nvarchar(250) NOT NULL,
        [Theme] nvarchar(max) NOT NULL DEFAULT N'',
        [Description] nvarchar(max) NOT NULL DEFAULT N'',
        [CoverImageUrl] nvarchar(max) NOT NULL DEFAULT N'',
        [EventDate] datetime2 NOT NULL,
        [TimeString] nvarchar(max) NOT NULL DEFAULT N'',
        [Venue] nvarchar(250) NOT NULL,
        [Category] nvarchar(100) NOT NULL DEFAULT N'General',
        [IsFeatured] bit NOT NULL DEFAULT 0,
        [RegistrationRequired] bit NOT NULL DEFAULT 0,
        [Status] nvarchar(50) NOT NULL DEFAULT N'Upcoming',
        [MaxCapacity] int NULL,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_ParishEvents] PRIMARY KEY ([Id])
    );
END;
GO

-- 12. EventSpeakers Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[EventSpeakers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [EventSpeakers] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [ParishEventId] uniqueidentifier NOT NULL,
        [FullName] nvarchar(150) NOT NULL,
        [EcclesiasticalTitle] nvarchar(50) NOT NULL DEFAULT N'Pastor',
        [MinistryRole] nvarchar(100) NOT NULL DEFAULT N'Guest Speaker',
        [PhotoUrl] nvarchar(max) NULL,
        [Organization] nvarchar(200) NULL,
        [ShortBio] nvarchar(max) NULL,
        [DisplayOrder] int NOT NULL DEFAULT 0,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [CreatedByUserId] uniqueidentifier NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UpdatedByUserId] uniqueidentifier NULL,
        CONSTRAINT [PK_EventSpeakers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_EventSpeakers_ParishEvents_ParishEventId] FOREIGN KEY ([ParishEventId]) REFERENCES [ParishEvents] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_EventSpeakers_ParishEventId] ON [EventSpeakers] ([ParishEventId]);
END;
GO

-- 13. Testimonies Table
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[Testimonies]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Testimonies] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [FullName] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [Phone] nvarchar(max) NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [AllowPublicSharing] bit NOT NULL DEFAULT 1,
        [IsApproved] bit NOT NULL DEFAULT 0,
        [SubmittedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        CONSTRAINT [PK_Testimonies] PRIMARY KEY ([Id])
    );
END;
GO

-- =========================================================================================
-- SECTION 4: IDEMPOTENT INITIAL SYSTEM SEED DATA
-- =========================================================================================

-- 14.1 Seed Organization Settings
IF NOT EXISTS (SELECT 1 FROM [OrganizationSettings])
BEGIN
    INSERT INTO [OrganizationSettings] ([Id], [ParishName], [LogoUrl], [BaseCurrency], [CreatedAtUtc])
    VALUES (
        NEWID(),
        N'RCCG Glorious Parish',
        N'https://images.unsplash.com/photo-1548625361-185122c4f826?auto=format&fit=crop&q=80&w=300',
        N'NGN',
        GETUTCDATE()
    );
END;
GO

-- 14.2 Seed System Accounts (SuperAdmin, SystemAdmin, Pastor, HODs)
-- Password Hashes computed via SHA-256 Base64 matching CMS.Infrastructure.Services.PasswordHasher:
-- 'Admin@12345'  -> 'byy53Y9LZeJOHD8/pbxXmCNJI38Rq86s1Fu8t01iHCU='
-- 'Pastor@12345' -> 'Y7Uh7dlJ2lJ6a1E9YK1kKzj9xUS5d02qL77ynMYg5pA='
-- 'Hod@12345'    -> 'kptsRxXpOb2Qmv9IELBY4UnGL3EVWvfvSONCGU2NSZQ='

-- 1. Super Administrator (neotroltd@gmail.com)
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Email] = N'neotroltd@gmail.com')
BEGIN
    INSERT INTO [Users] ([Id], [FullName], [Email], [Phone], [Role], [PasswordHash], [MustChangePassword], [IsActive], [CreatedAtUtc])
    VALUES (NEWID(), N'Super Administrator', N'neotroltd@gmail.com', N'+2348000000000', N'SuperAdmin', N'byy53Y9LZeJOHD8/pbxXmCNJI38Rq86s1Fu8t01iHCU=', 0, 1, GETUTCDATE());
END
ELSE
BEGIN
    UPDATE [Users]
    SET [Role] = N'SuperAdmin',
        [PasswordHash] = N'byy53Y9LZeJOHD8/pbxXmCNJI38Rq86s1Fu8t01iHCU=',
        [MustChangePassword] = 0,
        [IsActive] = 1,
        [UpdatedAtUtc] = GETUTCDATE()
    WHERE [Email] = N'neotroltd@gmail.com';
END;
GO

-- 2. System Administrator (admin@rccgglorious.org)
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Email] = N'admin@rccgglorious.org')
BEGIN
    INSERT INTO [Users] ([Id], [FullName], [Email], [Phone], [Role], [PasswordHash], [MustChangePassword], [IsActive], [CreatedAtUtc])
    VALUES (NEWID(), N'System Administrator', N'admin@rccgglorious.org', N'+2348011111111', N'SystemAdmin', N'byy53Y9LZeJOHD8/pbxXmCNJI38Rq86s1Fu8t01iHCU=', 0, 1, GETUTCDATE());
END
ELSE
BEGIN
    UPDATE [Users]
    SET [Role] = N'SystemAdmin',
        [PasswordHash] = N'byy53Y9LZeJOHD8/pbxXmCNJI38Rq86s1Fu8t01iHCU=',
        [MustChangePassword] = 0,
        [IsActive] = 1,
        [UpdatedAtUtc] = GETUTCDATE()
    WHERE [Email] = N'admin@rccgglorious.org';
END;
GO

-- 3. Pastor In Charge (pastor@rccgglorious.org)
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Email] = N'pastor@rccgglorious.org')
BEGIN
    INSERT INTO [Users] ([Id], [FullName], [Email], [Phone], [Role], [PasswordHash], [MustChangePassword], [IsActive], [CreatedAtUtc])
    VALUES (NEWID(), N'Pastor In Charge', N'pastor@rccgglorious.org', N'+2348022222222', N'Pastor', N'Y7Uh7dlJ2lJ6a1E9YK1kKzj9xUS5d02qL77ynMYg5pA=', 0, 1, GETUTCDATE());
END
ELSE
BEGIN
    UPDATE [Users]
    SET [Role] = N'Pastor',
        [PasswordHash] = N'Y7Uh7dlJ2lJ6a1E9YK1kKzj9xUS5d02qL77ynMYg5pA=',
        [MustChangePassword] = 0,
        [IsActive] = 1,
        [UpdatedAtUtc] = GETUTCDATE()
    WHERE [Email] = N'pastor@rccgglorious.org';
END;
GO

-- 4. HOD Ushering (hod.ushering@rccgglorious.org)
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Email] = N'hod.ushering@rccgglorious.org')
BEGIN
    INSERT INTO [Users] ([Id], [FullName], [Email], [Phone], [Role], [PasswordHash], [MustChangePassword], [IsActive], [CreatedAtUtc])
    VALUES (NEWID(), N'Sister Grace Usang (HOD Ushering)', N'hod.ushering@rccgglorious.org', N'+2348033333333', N'HOD', N'kptsRxXpOb2Qmv9IELBY4UnGL3EVWvfvSONCGU2NSZQ=', 0, 1, GETUTCDATE());
END;
GO

-- 5. HOD Choir (hod.choir@rccgglorious.org)
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Email] = N'hod.choir@rccgglorious.org')
BEGIN
    INSERT INTO [Users] ([Id], [FullName], [Email], [Phone], [Role], [PasswordHash], [MustChangePassword], [IsActive], [CreatedAtUtc])
    VALUES (NEWID(), N'Minister David Okafor (HOD Choir)', N'hod.choir@rccgglorious.org', N'+2348044444444', N'HOD', N'kptsRxXpOb2Qmv9IELBY4UnGL3EVWvfvSONCGU2NSZQ=', 0, 1, GETUTCDATE());
END;
GO

-- 14.3 Seed Service Types
IF NOT EXISTS (SELECT 1 FROM [ServiceTypes])
BEGIN
    INSERT INTO [ServiceTypes] ([Id], [Name], [Category], [IsActive], [CreatedAtUtc])
    VALUES 
        (NEWID(), N'Sunday 1st Service', N'Sunday', 1, GETUTCDATE()),
        (NEWID(), N'Sunday 2nd Service', N'Sunday', 1, GETUTCDATE()),
        (NEWID(), N'Digging Deep', N'Midweek', 1, GETUTCDATE()),
        (NEWID(), N'Faith Clinic', N'Midweek', 1, GETUTCDATE());
END;
GO

-- 14.4 Seed Offering Categories
IF NOT EXISTS (SELECT 1 FROM [OfferingCategories])
BEGIN
    INSERT INTO [OfferingCategories] ([Id], [Name], [Code], [IsActive], [CreatedAtUtc])
    VALUES 
        (NEWID(), N'Sunday Offering', N'OFFR', 1, GETUTCDATE()),
        (NEWID(), N'Tithe', N'TITH', 1, GETUTCDATE()),
        (NEWID(), N'Building Fund', N'BLDG', 1, GETUTCDATE()),
        (NEWID(), N'Thanksgiving', N'THKG', 1, GETUTCDATE()),
        (NEWID(), N'First Fruit', N'FRST', 1, GETUTCDATE());
END;
GO

-- 14.5 Seed Departments
IF NOT EXISTS (SELECT 1 FROM [Departments])
BEGIN
    INSERT INTO [Departments] ([Id], [Name], [Code], [HeadOfDepartment], [Description], [MeetingSchedule], [IsActive], [CreatedAtUtc])
    VALUES 
        (NEWID(), N'Ushering Department', N'USH-01', N'Sister Grace Usang', N'Sanctuary Protocol & Ushering', N'Sundays 7:00 AM', 1, GETUTCDATE()),
        (NEWID(), N'Choir & Praise Team', N'CHR-01', N'Minister David Okafor', N'Worship & Praise Administration', N'Saturdays 5:00 PM', 1, GETUTCDATE()),
        (NEWID(), N'Media & Technical', N'MED-01', N'Brother Daniel Chidubem', N'Audio, Video & Broadcast', N'Sundays 6:30 AM', 1, GETUTCDATE()),
        (NEWID(), N'Protocol & Security', N'PRT-01', N'Deacon James Vance', N'Parish Security & Order', N'Sundays 7:00 AM', 1, GETUTCDATE()),
        (NEWID(), N'House Fellowship', N'HFL-01', N'Brother Samuel Adebayo', N'Home Cell Administration', N'Wednesdays 6:00 PM', 1, GETUTCDATE()),
        (NEWID(), N'Church on the Street (Outreach)', N'OUT-01', N'Evangelist Peter King', N'Evangelism & Community Outreach', N'3rd Saturdays 10:00 AM', 1, GETUTCDATE());
END;
GO

-- =========================================================================================
-- SECTION 5: REGISTER EF CORE MIGRATION ENTRIES
-- =========================================================================================

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260922050803_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260922050803_InitialCreate', N'9.0.0');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20261014173122_01')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261014173122_01', N'9.0.0');
END;
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20261014163000_AddParishEventsAndSpeakers')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261014163000_AddParishEventsAndSpeakers', N'9.0.0');
END;
GO

-- Migration: Add LeadershipCouncilJson to Departments
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[Departments]') 
    AND name = 'LeadershipCouncilJson'
)
BEGIN
    ALTER TABLE [Departments] ADD [LeadershipCouncilJson] NVARCHAR(MAX) NOT NULL DEFAULT '[]';
END;
GO

COMMIT TRANSACTION;
GO

