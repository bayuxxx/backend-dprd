-- CreateTable
CREATE TABLE "bamus_info" (
    "id" TEXT NOT NULL,
    "masaJabatan" TEXT NOT NULL DEFAULT '2024-2029',
    "deskripsi" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bamus_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_bamus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "faction" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "bamusInfoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_bamus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anggota_bamus" ADD CONSTRAINT "anggota_bamus_bamusInfoId_fkey" FOREIGN KEY ("bamusInfoId") REFERENCES "bamus_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
