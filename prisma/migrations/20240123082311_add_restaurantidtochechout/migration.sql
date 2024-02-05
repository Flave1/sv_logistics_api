BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[orderCheckout] ADD [restaurantId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[orderCheckout] ADD CONSTRAINT [orderCheckout_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
