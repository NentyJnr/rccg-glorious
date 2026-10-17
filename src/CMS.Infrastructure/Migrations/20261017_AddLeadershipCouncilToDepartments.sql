-- ==============================================================================
-- Script: Add LeadershipCouncilJson to Departments Table
-- Target Database: SQL Server (RCCG Glorious Church Parish CMS)
-- Execution: Safe & Idempotent (can be executed multiple times without error)
-- ==============================================================================

IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[Departments]') 
    AND name = 'LeadershipCouncilJson'
)
BEGIN
    ALTER TABLE [Departments] ADD [LeadershipCouncilJson] NVARCHAR(MAX) NOT NULL DEFAULT '[]';
    PRINT 'SUCCESS: Added LeadershipCouncilJson column to Departments table.';
END
ELSE
BEGIN
    PRINT 'INFO: Column LeadershipCouncilJson already exists on Departments table.';
END;
GO
