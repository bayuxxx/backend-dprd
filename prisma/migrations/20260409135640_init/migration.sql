-- CreateTable
CREATE TABLE `banners` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'Berita Dewan',
    `imageUrl` TEXT NULL,
    `linkUrl` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beritas` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `imageUrl` TEXT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'Berita Dewan',
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `beritas_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masa_jabatan` (
    `id` VARCHAR(191) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `tahunMulai` INTEGER NOT NULL,
    `tahunSelesai` INTEGER NOT NULL,
    `isAktif` BOOLEAN NOT NULL DEFAULT false,
    `keterangan` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `masa_jabatan_periode_key`(`periode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pimpinan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `faction` VARCHAR(191) NULL,
    `period` VARCHAR(191) NOT NULL DEFAULT '2024-2029',
    `masaJabatanId` VARCHAR(191) NULL,
    `isPast` BOOLEAN NOT NULL DEFAULT false,
    `imageUrl` TEXT NULL,
    `bio` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bamus_info` (
    `id` VARCHAR(191) NOT NULL,
    `masaJabatan` VARCHAR(191) NOT NULL DEFAULT '2024-2029',
    `deskripsi` TEXT NULL,
    `isAktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_bamus` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `faction` VARCHAR(191) NULL,
    `imageUrl` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `bamusInfoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bapemperda_info` (
    `id` VARCHAR(191) NOT NULL,
    `masaJabatan` VARCHAR(191) NOT NULL DEFAULT '2024-2029',
    `deskripsi` TEXT NULL,
    `isAktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_bapemperda` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `faction` VARCHAR(191) NULL,
    `imageUrl` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `bapemperdaInfoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banggar_info` (
    `id` VARCHAR(191) NOT NULL,
    `masaJabatan` VARCHAR(191) NOT NULL DEFAULT '2024-2029',
    `deskripsi` TEXT NULL,
    `isAktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_banggar` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `faction` VARCHAR(191) NULL,
    `imageUrl` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `banggarInfoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bk_info` (
    `id` VARCHAR(191) NOT NULL,
    `masaJabatan` VARCHAR(191) NOT NULL DEFAULT '2024-2029',
    `deskripsi` TEXT NULL,
    `isAktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_bk` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `faction` VARCHAR(191) NULL,
    `imageUrl` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `bkInfoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `komisi_info` (
    `id` VARCHAR(191) NOT NULL,
    `namaKomisi` VARCHAR(191) NOT NULL,
    `masaJabatan` VARCHAR(191) NOT NULL DEFAULT '2024-2029',
    `deskripsi` TEXT NULL,
    `isAktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_komisi` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `faction` VARCHAR(191) NULL,
    `imageUrl` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `komisiInfoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sekretariat` (
    `id` VARCHAR(191) NOT NULL,
    `visi` TEXT NULL,
    `misi` TEXT NULL,
    `tugas` TEXT NULL,
    `fungsi` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_sekretariat` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NULL,
    `imageUrl` TEXT NULL,
    `isSekretaris` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fraksi_info` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#c8102e',
    `kursi` INTEGER NOT NULL DEFAULT 0,
    `masaJabatanId` VARCHAR(191) NULL,
    `deskripsi` TEXT NULL,
    `logoUrl` TEXT NULL,
    `isAktif` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fraksi_info_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_fraksi` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `faction` VARCHAR(191) NULL,
    `imageUrl` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `fraksiInfoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pimpinan` ADD CONSTRAINT `pimpinan_masaJabatanId_fkey` FOREIGN KEY (`masaJabatanId`) REFERENCES `masa_jabatan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_bamus` ADD CONSTRAINT `anggota_bamus_bamusInfoId_fkey` FOREIGN KEY (`bamusInfoId`) REFERENCES `bamus_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_bapemperda` ADD CONSTRAINT `anggota_bapemperda_bapemperdaInfoId_fkey` FOREIGN KEY (`bapemperdaInfoId`) REFERENCES `bapemperda_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_banggar` ADD CONSTRAINT `anggota_banggar_banggarInfoId_fkey` FOREIGN KEY (`banggarInfoId`) REFERENCES `banggar_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_bk` ADD CONSTRAINT `anggota_bk_bkInfoId_fkey` FOREIGN KEY (`bkInfoId`) REFERENCES `bk_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_komisi` ADD CONSTRAINT `anggota_komisi_komisiInfoId_fkey` FOREIGN KEY (`komisiInfoId`) REFERENCES `komisi_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fraksi_info` ADD CONSTRAINT `fraksi_info_masaJabatanId_fkey` FOREIGN KEY (`masaJabatanId`) REFERENCES `masa_jabatan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_fraksi` ADD CONSTRAINT `anggota_fraksi_fraksiInfoId_fkey` FOREIGN KEY (`fraksiInfoId`) REFERENCES `fraksi_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
