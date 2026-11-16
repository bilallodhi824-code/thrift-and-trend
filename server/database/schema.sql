-- ========================================================
-- THRIFT & TREND - Microsoft SQL Server (MSSQL) Schema
-- Database: ThriftAndTrendDB
-- ========================================================

USE ThriftAndTrendDB;
GO

-- 1. Users Table (Authentication & Customer Profiles)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FullName NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) NOT NULL DEFAULT 'customer',
        Phone NVARCHAR(50) NULL,
        Address NVARCHAR(500) NULL,
        City NVARCHAR(100) NULL,
        PostalCode NVARCHAR(50) NULL,
        Country NVARCHAR(100) NULL DEFAULT 'US',
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    CREATE INDEX IX_Users_Email ON Users(Email);
    PRINT 'Created table Users';
END
GO

-- 2. Products Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id NVARCHAR(100) PRIMARY KEY,
        Slug NVARCHAR(100) NOT NULL UNIQUE,
        Name NVARCHAR(255) NOT NULL,
        Subtitle NVARCHAR(500) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        Gender NVARCHAR(50) NOT NULL,
        Condition NVARCHAR(50) NOT NULL,
        Price DECIMAL(10,2) NOT NULL,
        OriginalPrice DECIMAL(10,2) NOT NULL,
        Rating DECIMAL(3,2) NOT NULL DEFAULT 5.0,
        ReviewCount INT NOT NULL DEFAULT 0,
        Badge NVARCHAR(50) NULL,
        Stock INT NOT NULL DEFAULT 10,
        Description NVARCHAR(MAX) NOT NULL,
        Story NVARCHAR(MAX) NOT NULL,
        FitAdvice NVARCHAR(MAX) NOT NULL,
        CareInstructions NVARCHAR(MAX) NOT NULL,
        AuthenticationNotes NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    CREATE INDEX IX_Products_Category ON Products(Category);
    CREATE INDEX IX_Products_Condition ON Products(Condition);
    PRINT 'Created table Products';
END
GO

-- 3. ProductColors Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductColors')
BEGIN
    CREATE TABLE ProductColors (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProductId NVARCHAR(100) NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
        Name NVARCHAR(100) NOT NULL,
        Hex NVARCHAR(20) NOT NULL,
        ImageIndex INT NOT NULL DEFAULT 0
    );
    PRINT 'Created table ProductColors';
END
GO

-- 4. ProductImages Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductImages')
BEGIN
    CREATE TABLE ProductImages (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProductId NVARCHAR(100) NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
        ImageUrl NVARCHAR(500) NOT NULL,
        SortOrder INT NOT NULL DEFAULT 0
    );
    PRINT 'Created table ProductImages';
END
GO

-- 5. ProductSizes Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductSizes')
BEGIN
    CREATE TABLE ProductSizes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProductId NVARCHAR(100) NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
        SizeEU INT NOT NULL,
        Stock INT NOT NULL DEFAULT 5
    );
    PRINT 'Created table ProductSizes';
END
GO

-- 6. Orders Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE Orders (
        Id NVARCHAR(100) PRIMARY KEY,
        UserId INT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE SET NULL,
        CustomerName NVARCHAR(255) NOT NULL,
        CustomerEmail NVARCHAR(255) NOT NULL,
        CustomerPhone NVARCHAR(100) NULL,
        ShippingAddress NVARCHAR(500) NOT NULL,
        City NVARCHAR(100) NOT NULL,
        PostalCode NVARCHAR(50) NOT NULL,
        Country NVARCHAR(100) NOT NULL DEFAULT 'US',
        Subtotal DECIMAL(10,2) NOT NULL,
        TotalSavings DECIMAL(10,2) NOT NULL,
        Discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        ShippingFee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        TotalAmount DECIMAL(10,2) NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Processing',
        TrackingNumber NVARCHAR(100) NULL,
        PromoCodeUsed NVARCHAR(50) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    CREATE INDEX IX_Orders_UserId ON Orders(UserId);
    CREATE INDEX IX_Orders_CreatedAt ON Orders(CreatedAt DESC);
    PRINT 'Created table Orders';
END
GO

-- 7. OrderItems Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderId NVARCHAR(100) NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,
        ProductId NVARCHAR(100) NOT NULL,
        ProductName NVARCHAR(255) NOT NULL,
        ColorName NVARCHAR(100) NOT NULL,
        SizeEU INT NOT NULL,
        UnitPrice DECIMAL(10,2) NOT NULL,
        Quantity INT NOT NULL DEFAULT 1,
        TotalPrice DECIMAL(10,2) NOT NULL
    );
    PRINT 'Created table OrderItems';
END
GO

-- 8. Wishlists Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Wishlists')
BEGIN
    CREATE TABLE Wishlists (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
        ProductId NVARCHAR(100) NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT UQ_User_Product UNIQUE (UserId, ProductId)
    );
    PRINT 'Created table Wishlists';
END
GO
