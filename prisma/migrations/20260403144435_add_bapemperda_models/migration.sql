-- CreateTable
CREATE TABLE "bapemperda_info" (
    "id" TEXT NOT NULL,
    "masaJabatan" TEXT NOT NULL DEFAULT '2024-2029',
    "deskripsi" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bapemperda_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_bapemperda" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "faction" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "bapemperdaInfoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_bapemperda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anggota_bapemperda" ADD CONSTRAINT "anggota_bapemperda_bapemperdaInfoId_fkey" FOREIGN KEY ("bapemperdaInfoId") REFERENCES "bapemperda_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
