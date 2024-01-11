BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[orderCheckout] (
    [id] INT NOT NULL IDENTITY(1,1),
    [menuIds] NVARCHAR(1000) NOT NULL,
    [addressId] INT NOT NULL,
    [customerId] INT NOT NULL,
    [paymentStatus] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [orderCheckout_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [orderCheckout_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[orderCheckout] ADD CONSTRAINT [orderCheckout_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orderCheckout] ADD CONSTRAINT [orderCheckout_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
