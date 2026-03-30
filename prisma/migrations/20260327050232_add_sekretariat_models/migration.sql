-- CreateTable
CREATE TABLE "sekretariat" (
    "id" TEXT NOT NULL,
    "visi" TEXT,
    "misi" TEXT,
    "tugas" TEXT,
    "fungsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sekretariat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_sekretariat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "unit" TEXT,
    "imageUrl" TEXT,
    "isSekretaris" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_sekretariat_pkey" PRIMARY KEY ("id")
);
