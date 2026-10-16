-- =========================================================================================
-- RCCG GLORIOUS PARISH PORTAL — SUPERADMIN SEED SCRIPT
-- File Path: src/CMS.Infrastructure/Migrations/seed_superadmin_neotroltd.sql
-- Description: Seeds or updates neotroltd@gmail.com with SuperAdmin role and password credentials
-- Governance Compliance: Team Vatebra Enterprise Governance §5.1 (Rule 5.1)
-- =========================================================================================

IF EXISTS (SELECT 1 FROM [Users] WHERE LOWER([Email]) = 'neotroltd@gmail.com')
BEGIN
    UPDATE [Users]
    SET [Role] = 'SuperAdmin',
        [FullName] = 'Super Administrator',
        [IsActive] = 1,
        [MustChangePassword] = 0,
        [PasswordHash] = 'byy53Y9LZeJOHD8/pbxXmCNJI38Rq86s1Fu8t01iHCU=', -- SHA256 of Admin@12345
        [UpdatedAtUtc] = GETUTCDATE()
    WHERE LOWER([Email]) = 'neotroltd@gmail.com';

    PRINT 'User neotroltd@gmail.com successfully updated to SuperAdmin role.';
END
ELSE
BEGIN
    INSERT INTO [Users] (
        [Id],
        [FullName],
        [Email],
        [Phone],
        [Role],
        [MustChangePassword],
        [IsActive],
        [PasswordHash],
        [CreatedAtUtc]
    )
    VALUES (
        NEWID(),
        'Super Administrator',
        'neotroltd@gmail.com',
        '+2348000000000',
        'SuperAdmin',
        0,
        1,
        'byy53Y9LZeJOHD8/pbxXmCNJI38Rq86s1Fu8t01iHCU=', -- SHA256 of Admin@12345
        GETUTCDATE()
    );

    PRINT 'User neotroltd@gmail.com successfully inserted as SuperAdmin.';
END;
GO
