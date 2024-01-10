BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [label] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [latitude] NVARCHAR(1000) NOT NULL,
    [longitude] NVARCHAR(1000) NOT NULL,
    [customerId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [address_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [isDefault] BIT NOT NULL,
    CONSTRAINT [address_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[address] ADD CONSTRAINT [address_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
