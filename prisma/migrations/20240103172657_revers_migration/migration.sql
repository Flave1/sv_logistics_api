BEGIN TRY

BEGIN TRAN;


-- CreateTable
CREATE TABLE [dbo].[country] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [country_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [countryName] NVARCHAR(1000),
    [countryCode] NVARCHAR(1000),
    [currencyName] NVARCHAR(1000),
    [currencyCode] NVARCHAR(1000),
    [deleted] BIT,
    [status] BIT,
    CONSTRAINT [country_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
