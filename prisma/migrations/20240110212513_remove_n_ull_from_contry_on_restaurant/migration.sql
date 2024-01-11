/*
  Warnings:

  - Made the column `countryId` on table `restaurant` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[restaurant] DROP CONSTRAINT [restaurant_countryId_fkey];

-- AlterTable
ALTER TABLE [dbo].[restaurant] ALTER COLUMN [countryId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[restaurant] ADD CONSTRAINT [restaurant_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[country]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
