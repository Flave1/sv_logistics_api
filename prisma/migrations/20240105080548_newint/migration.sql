/*
  Warnings:

  - Added the required column `clientId` to the `restaurant` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[menuOrders] ALTER COLUMN [customerId] INT NULL;
ALTER TABLE [dbo].[menuOrders] ADD [temporalId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[restaurant] ADD [clientId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[menuOrders] ADD CONSTRAINT [menuOrders_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
