BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[orderCheckout] ALTER COLUMN [addressId] INT NULL;
ALTER TABLE [dbo].[orderCheckout] ALTER COLUMN [customerId] INT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
