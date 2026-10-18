-- ============================================================================
-- Migration: Add EventPhotos Table for Parish Event Photo Galleries
-- Created: 2026-10-18
-- Target: SQL Server 2019+
-- Description: Supports event gallery uploads, multiple photos per event,
--              cover image designation, captions, and photographer credits.
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EventPhotos')
BEGIN
    CREATE TABLE [dbo].[EventPhotos] (
        [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        [ParishEventId] UNIQUEIDENTIFIER NOT NULL,
        [PhotoUrl] NVARCHAR(1000) NOT NULL,
        [ThumbnailUrl] NVARCHAR(1000) NULL,
        [Caption] NVARCHAR(300) NULL,
        [Photographer] NVARCHAR(150) NULL,
        [DisplayOrder] INT NOT NULL DEFAULT 0,
        [IsCover] BIT NOT NULL DEFAULT 0,
        [FileSizeBytes] BIGINT NOT NULL DEFAULT 0,
        [ContentType] NVARCHAR(100) NOT NULL DEFAULT 'image/jpeg',
        [CreatedAtUtc] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        [CreatedByUserId] UNIQUEIDENTIFIER NULL,
        [UpdatedAtUtc] DATETIME2 NULL,
        [UpdatedByUserId] UNIQUEIDENTIFIER NULL,
        CONSTRAINT [PK_EventPhotos] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_EventPhotos_ParishEvents_ParishEventId] FOREIGN KEY ([ParishEventId]) 
            REFERENCES [dbo].[ParishEvents] ([Id]) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX [IX_EventPhotos_ParishEventId_DisplayOrder] 
        ON [dbo].[EventPhotos] ([ParishEventId] ASC, [DisplayOrder] ASC);

    PRINT 'EventPhotos table created successfully with cascade delete and indexing.';
END
ELSE
BEGIN
    PRINT 'EventPhotos table already exists.';
END
GO
