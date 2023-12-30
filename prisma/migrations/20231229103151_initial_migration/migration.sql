BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[restaurant] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [restaurant_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [name] NVARCHAR(1000),
    [deleted] BIT,
    [status] BIT,
    [phoneNumber] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [openingTime] NVARCHAR(1000),
    [closingTime] NVARCHAR(1000),
    [hasFreeDelivery] BIT,
    [freeDeliveryAmount] DECIMAL(32,16),
    CONSTRAINT [restaurant_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [hash] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [otherPhoneNumber] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [nextOfKinName] NVARCHAR(1000),
    [nextOfKinPhoneNumber] NVARCHAR(1000),
    [nextOfKinAddress] NVARCHAR(1000),
    [userTypeId] INT NOT NULL,
    [courierTypeId] INT NOT NULL,
    [restaurantId] INT NOT NULL,
    [passwordResetToken] NVARCHAR(1000),
    [deleted] BIT,
    [status] BIT,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[userType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [userType_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deleted] BIT,
    [status] BIT,
    CONSTRAINT [userType_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[courierType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [courierType_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deleted] BIT,
    [status] BIT,
    CONSTRAINT [courierType_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[menuCategory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL,
    [deleted] BIT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [menuCategory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [restaurantId] INT NOT NULL,
    CONSTRAINT [menuCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[menu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [price] DECIMAL(32,16) NOT NULL,
    [availability] BIT NOT NULL,
    [discount] NVARCHAR(1000),
    [dietaryInformation] NVARCHAR(1000),
    [status] BIT NOT NULL,
    [deleted] BIT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [menu_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [menuCategoryId] INT NOT NULL,
    [restaurantId] INT NOT NULL,
    CONSTRAINT [menu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[availabilitySchedule] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dayOfWeek] INT NOT NULL,
    [startTime] NVARCHAR(1000) NOT NULL,
    [endTime] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL,
    [deleted] BIT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [availabilitySchedule_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [menuId] INT NOT NULL,
    [restaurantId] INT NOT NULL,
    CONSTRAINT [availabilitySchedule_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[menuOrders] (
    [id] INT NOT NULL IDENTITY(1,1),
    [customerId] INT NOT NULL,
    [restaurantId] INT NOT NULL,
    [menuId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [menuOrders_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [status] INT NOT NULL,
    [deleted] BIT NOT NULL,
    CONSTRAINT [menuOrders_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_courierTypeId_fkey] FOREIGN KEY ([courierTypeId]) REFERENCES [dbo].[courierType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_userTypeId_fkey] FOREIGN KEY ([userTypeId]) REFERENCES [dbo].[userType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[menuCategory] ADD CONSTRAINT [menuCategory_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[menu] ADD CONSTRAINT [menu_menuCategoryId_fkey] FOREIGN KEY ([menuCategoryId]) REFERENCES [dbo].[menuCategory]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[menu] ADD CONSTRAINT [menu_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[availabilitySchedule] ADD CONSTRAINT [availabilitySchedule_menuId_fkey] FOREIGN KEY ([menuId]) REFERENCES [dbo].[menu]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[availabilitySchedule] ADD CONSTRAINT [availabilitySchedule_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[menuOrders] ADD CONSTRAINT [menuOrders_restaurantId_fkey] FOREIGN KEY ([restaurantId]) REFERENCES [dbo].[restaurant]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[menuOrders] ADD CONSTRAINT [menuOrders_menuId_fkey] FOREIGN KEY ([menuId]) REFERENCES [dbo].[menu]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
