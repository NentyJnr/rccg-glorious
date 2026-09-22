-- =========================================================================================
-- RCCG GLORIOUS PARISH PORTAL — MASTER CONSOLIDATED DATABASE MIGRATION SCRIPT
-- Script File: src/CMS.Infrastructure/Migrations/master_migration_script.sql
-- Generated On: 2026-09-22
-- Environment: Target SQL Server / SQL Azure / SQLite
-- Governance Compliance: Team Vatebra Enterprise Governance §5.1 (Rule 5.1)
-- =========================================================================================

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

-- 1. Create OrganizationSettings Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[OrganizationSettings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [OrganizationSettings] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [ParishName] nvarchar(200) NOT NULL,
        [LogoUrl] nvarchar(500) NOT NULL,
        [BaseCurrency] nvarchar(10) NOT NULL DEFAULT N'NGN',
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_OrganizationSettings] PRIMARY KEY ([Id])
    );
END;
GO

-- 2. Create Users Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Users] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [FullName] nvarchar(150) NOT NULL,
        [Email] nvarchar(150) NOT NULL,
        [Role] nvarchar(50) NOT NULL,
        [PasswordHash] nvarchar(500) NOT NULL,
        [MustChangePassword] bit NOT NULL DEFAULT 1,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;
GO

-- 3. Create Ministers Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Ministers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Ministers] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Title] nvarchar(50) NOT NULL,
        [FullName] nvarchar(150) NOT NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_Ministers] PRIMARY KEY ([Id])
    );
END;
GO

-- 4. Create ServiceTypes Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ServiceTypes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ServiceTypes] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Name] nvarchar(100) NOT NULL,
        [Category] nvarchar(50) NOT NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_ServiceTypes] PRIMARY KEY ([Id])
    );
END;
GO

-- 5. Create OfferingCategories Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[OfferingCategories]') AND type in (N'U'))
BEGIN
    CREATE TABLE [OfferingCategories] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Name] nvarchar(100) NOT NULL,
        [Code] nvarchar(20) NOT NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_OfferingCategories] PRIMARY KEY ([Id])
    );
END;
GO

-- 6. Create Departments Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Departments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Departments] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [Name] nvarchar(150) NOT NULL,
        [Code] nvarchar(20) NOT NULL,
        [HeadOfDepartment] nvarchar(150) NULL,
        [Description] nvarchar(500) NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_Departments] PRIMARY KEY ([Id])
    );
END;
GO

-- 7. Create ServiceReports Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ServiceReports]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ServiceReports] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [ServiceTypeId] uniqueidentifier NOT NULL,
        [ServiceDate] nvarchar(10) NOT NULL,
        [MenCount] int NOT NULL DEFAULT 0,
        [WomenCount] int NOT NULL DEFAULT 0,
        [ChildrenCount] int NOT NULL DEFAULT 0,
        [FirstTimersCount] int NOT NULL DEFAULT 0,
        [NewConvertsCount] int NOT NULL DEFAULT 0,
        [PreacherMinisterId] uniqueidentifier NULL,
        [SingleOfferingAmount] decimal(18,2) NULL,
        [TotalSundayOffering] decimal(18,2) NULL,
        [CreatedByUserId] uniqueidentifier NULL,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_ServiceReports] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ServiceReports_ServiceTypes_ServiceTypeId] FOREIGN KEY ([ServiceTypeId]) REFERENCES [ServiceTypes] ([Id]) ON DELETE RESTRICT,
        CONSTRAINT [FK_ServiceReports_Ministers_PreacherMinisterId] FOREIGN KEY ([PreacherMinisterId]) REFERENCES [Ministers] ([Id]) ON DELETE RESTRICT
    );
END;
GO

-- 8. Create ServiceReportOfferings Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ServiceReportOfferings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ServiceReportOfferings] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [ServiceReportId] uniqueidentifier NOT NULL,
        [OfferingCategoryId] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL DEFAULT 0,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_ServiceReportOfferings] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ServiceReportOfferings_ServiceReports_ServiceReportId] FOREIGN KEY ([ServiceReportId]) REFERENCES [ServiceReports] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_ServiceReportOfferings_OfferingCategories_OfferingCategoryId] FOREIGN KEY ([OfferingCategoryId]) REFERENCES [OfferingCategories] ([Id]) ON DELETE RESTRICT
    );
END;
GO

-- 9. Create HouseFellowshipReports Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[HouseFellowshipReports]') AND type in (N'U'))
BEGIN
    CREATE TABLE [HouseFellowshipReports] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [CenterName] nvarchar(150) NOT NULL,
        [ReportDate] nvarchar(10) NOT NULL,
        [MenCount] int NOT NULL DEFAULT 0,
        [WomenCount] int NOT NULL DEFAULT 0,
        [ChildrenCount] int NOT NULL DEFAULT 0,
        [OfferingAmount] decimal(18,2) NOT NULL DEFAULT 0,
        [StudyTopic] nvarchar(250) NOT NULL,
        [LeaderName] nvarchar(150) NULL,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_HouseFellowshipReports] PRIMARY KEY ([Id])
    );
END;
GO

-- 10. Create OutreachReports Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[OutreachReports]') AND type in (N'U'))
BEGIN
    CREATE TABLE [OutreachReports] (
        [Id] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
        [LocationName] nvarchar(150) NOT NULL,
        [ReportDate] nvarchar(10) NOT NULL,
        [MenReached] int NOT NULL DEFAULT 0,
        [WomenReached] int NOT NULL DEFAULT 0,
        [ChildrenReached] int NOT NULL DEFAULT 0,
        [SoulsWonCount] int NOT NULL DEFAULT 0,
        [LeaderName] nvarchar(150) NULL,
        [CreatedAtUtc] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAtUtc] datetime2 NULL,
        CONSTRAINT [PK_OutreachReports] PRIMARY KEY ([Id])
    );
END;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260922050803_InitialCreate', N'9.0.0');
GO

COMMIT;
GO
