BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[restaurant] ADD [countryId] INT,
[latitude] DECIMAL(32,16),
[longitude] DECIMAL(32,16);

-- AddForeignKey
ALTER TABLE [dbo].[restaurant] ADD CONSTRAINT [restaurant_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[country]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
