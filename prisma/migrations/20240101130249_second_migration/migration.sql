BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[restaurant] ADD [description] NVARCHAR(1000),
[email] NVARCHAR(1000),
[image] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
