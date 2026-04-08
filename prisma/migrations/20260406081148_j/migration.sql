-- CreateTable
CREATE TABLE "banggar_info" (
    "id" TEXT NOT NULL,
    "masaJabatan" TEXT NOT NULL DEFAULT '2024-2029',
    "deskripsi" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banggar_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_banggar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "faction" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "banggarInfoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_banggar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anggota_banggar" ADD CONSTRAINT "anggota_banggar_banggarInfoId_fkey" FOREIGN KEY ("banggarInfoId") REFERENCES "banggar_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
