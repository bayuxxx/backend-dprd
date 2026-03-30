-- AlterTable
ALTER TABLE "pimpinan" ADD COLUMN     "isPast" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "masaJabatanId" TEXT;

-- CreateTable
CREATE TABLE "masa_jabatan" (
    "id" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "tahunMulai" INTEGER NOT NULL,
    "tahunSelesai" INTEGER NOT NULL,
    "isAktif" BOOLEAN NOT NULL DEFAULT false,
    "keterangan" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "masa_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "masa_jabatan_periode_key" ON "masa_jabatan"("periode");

-- AddForeignKey
ALTER TABLE "pimpinan" ADD CONSTRAINT "pimpinan_masaJabatanId_fkey" FOREIGN KEY ("masaJabatanId") REFERENCES "masa_jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
