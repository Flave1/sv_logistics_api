BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[menuOrders] ADD [menuOrderId] INT,
[orderId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[orderCheckout] ADD [orderId] NVARCHAR(1000),
[status] INT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
