/*
  Warnings:

  - Added the required column `restaurantId` to the `userPermission` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[userPermission] ADD [restaurantId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[userPermission] ADD CONSTRAINT [userPermission_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
