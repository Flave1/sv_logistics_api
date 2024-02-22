BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[userPermission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [type] INT NOT NULL,
    [permissions] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [userPermission_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[userPermission] ADD CONSTRAINT [userPermission_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
