-- CreateTable
CREATE TABLE `Country` (
    `name` VARCHAR(191) NOT NULL,
    `capital` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `population` INTEGER NULL,
    `flag` VARCHAR(191) NULL,
    `currencies` VARCHAR(191) NULL,
    `estimated_gdp` DECIMAL(20, 2) NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
