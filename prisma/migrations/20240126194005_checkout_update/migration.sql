/*
  Warnings:

  - You are about to drop the column `menuOrderId` on the `menuOrders` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[menuOrders] DROP COLUMN [menuOrderId];
ALTER TABLE [dbo].[menuOrders] ADD [orderCheckoutId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[menuOrders] ADD CONSTRAINT [menuOrders_orderCheckoutId_fkey] FOREIGN KEY ([orderCheckoutId]) REFERENCES [dbo].[orderCheckout]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
