BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[users] DROP CONSTRAINT [users_restaurantId_fkey];

-- AlterTable
ALTER TABLE [dbo].[users] ALTER COLUMN [restaurantId] INT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
