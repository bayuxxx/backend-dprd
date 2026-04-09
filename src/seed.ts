import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: hashedPassword,
    },
  });

  const beritas = [
    {
      title: "Salat Idulfitri di Lingkungan Pemkab, Semangat Kebersamaan Menggema",
      slug: "salat-idulfitri-semangat-kebersamaan",
      excerpt: "Bupati dan Ketua DPRD Sumbawa Barat menghadiri pelaksanaan Salat Idulfitri 1447 Hijriah di halaman utama Kantor Bupati. Kegiatan tersebut berlangsung khidmat...",
      content: "<p>Ketua DPRD menghadiri pelaksanaan Salat Idulfitri 1447 Hijriah di halaman Kantor Pemkab. Kegiatan tersebut merupakan agenda tahunan yang bertujuan untuk mempererat tali silaturahmi antara jajaran pemerintahan dengan masyarakat luas.</p><p>Ribuan jamaah tampak memadati area sejak pukul 06.00 pagi. Dalam sambutannya, Ketua DPRD menekankan pentingnya kolaborasi dan saling memaafkan sebagai fondasi untuk membangun daerah yang lebih maju dan inklusif di tahun yang akan datang.</p>",
      imageUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
      category: "Berita Utama",
      isPublished: true,
    },
    {
      title: "DPRD Dukung Pemerataan Bantuan untuk Tempat Ibadah di Seluruh Kecamatan",
      slug: "dprd-dukung-pemerataan-bantuan-tempat-ibadah",
      excerpt: "Ketua DPRD mengapresiasi komitmen pemerintah daerah untuk terus mendukung rehabilitasi dan pembangunan fasilitas tempat ibadah di berbagai pelosok...",
      content: "<p>Dalam Rapat Paripurna hari ini, DPRD secara resmi menyetujui alokasi anggaran khusus untuk Program Pemerataan Bantuan Tempat Ibadah tahun 2026. Bantuan ini tidak hanya difokuskan pada pusat kota, melainkan akan disalurkan hingga ke desa-desa terpencil.</p><p>Program ini diharapkan dapat menjadi stimulus yang menguatkan kerukunan antar umat beragama serta menyediakan fasilitas ibadah yang layak dan representatif bagi masyarakat Sumbawa Barat.</p>",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
      category: "Berita Dewan",
      isPublished: true,
    },
    {
      title: "Armada Mudik Lebaran Gratis Harus Dalam Kondisi Prima",
      slug: "armada-mudik-lebaran-gratis-kondisi-prima",
      excerpt: "Wakil Ketua DPRD menekankan pentingnya memastikan seluruh armada program mudik gratis pemerintah daerah berada dalam kondisi mesin yang sehat guna menjamin keselamatan.",
      content: "<p>Menjelang arus mudik lebaran, DPRD melakukan inspeksi mendadak ke sejumlah depo bus yang bekerja sama dalam program Mudik Gratis 2026. Inspeksi ini bertujuan untuk menjamin semua armada angkutan dalam kondisi kelaikan jalan terbaik.</p><p>Keselamatan pemudik adalah prioritas tertinggi. Oleh karena itu, seluruh pimpinan PO Bus diinstruksikan untuk mengecek ulang rem, roda, fungsi lampu, hingga kesiapan fisik pengemudi sebelum izin operasi dikeluarkan oleh Dinas Perhubungan.</p>",
      imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      category: "Wakil Kita",
      isPublished: true,
    },
    {
      title: "Optimalisasi CSR BUMD untuk Program Bedah RTH dan Taman Kota",
      slug: "optimalisasi-csr-bumd-program-bedah-rth",
      excerpt: "DPRD mendorong keberlanjutan program perbaikan Ruang Terbuka Hijau (RTH) bagi warga melalui dana Corporate Social Responsibility (CSR) BUMD setempat.",
      content: "<p>Sebagai langkah inovatif dalam menata kota, DPRD telah mencapai kesepakatan bersama direksi BUMD untuk mengalokasikan minimal 30% dari dana CSR tahun ini khusus untuk program restorasi Ruang Terbuka Hijau (RTH).</p><p>Taman kota tidak hanya berfungsi sebagai paru-paru lingkungan, namun juga sebagai pusat interaksi sosial warga secara gratis. Konsep pembangunan ini diharapkan dapat meningkatkan indeks kebahagiaan masyarakat Sumbawa Barat dalam jangka panjang.</p>",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      category: "Berita Dewan",
      isPublished: true,
    }
  ];

  // --- SEED MASA JABATAN ---
  const mj2024 = await prisma.masaJabatan.upsert({
    where: { periode: '2024-2029' },
    update: {},
    create: {
      periode: '2024-2029',
      tahunMulai: 2024,
      tahunSelesai: 2029,
      isAktif: true,
      order: 1
    }
  });

  // --- SEED FRAKSI ---
  const fraksiData = [
    {
      slug: 'gerindra',
      name: 'Fraksi Partai Gerakan Indonesia Raya',
      shortName: 'Gerindra',
      kursi: 6,
      color: '#c8102e',
      masaJabatanId: mj2024.id,
      deskripsi: 'Fraksi Partai Gerindra DPRD Kabupaten Sumbawa Barat periode 2024-2029.',
      order: 1,
      anggota: [
        { name: 'H. Abidin, S.Pd.', jabatan: 'Ketua Fraksi', order: 1 },
        { name: 'Mustafa, S.H.', jabatan: 'Wakil Ketua', order: 2 },
        { name: 'Hj. Syarifah', jabatan: 'Sekretaris', order: 3 },
        { name: 'Ziaul Haq', jabatan: 'Anggota', order: 4 },
        { name: 'Bambang Sudarmanto', jabatan: 'Anggota', order: 5 },
        { name: 'Arifin', jabatan: 'Anggota', order: 6 },
      ]
    },
    {
      slug: 'golkar',
      name: 'Fraksi Partai Golongan Karya',
      shortName: 'Golkar',
      kursi: 5,
      color: '#f5c518',
      masaJabatanId: mj2024.id,
      deskripsi: 'Fraksi Partai Golkar DPRD Kabupaten Sumbawa Barat periode 2024-2029.',
      order: 2,
      anggota: [
        { name: 'H. Thamrin, S.E.', jabatan: 'Ketua Fraksi', order: 1 },
        { name: 'Sudarsih', jabatan: 'Sekretaris', order: 2 },
        { name: 'H. Mancawari', jabatan: 'Anggota', order: 3 },
      ]
    },
    {
      slug: 'pkb',
      name: 'Fraksi Partai Kebangkitan Bangsa',
      shortName: 'PKB',
      kursi: 4,
      color: '#006b3f',
      masaJabatanId: mj2024.id,
      order: 3,
      anggota: [
        { name: 'K.H. Syamsul Ismain', jabatan: 'Ketua Fraksi', order: 1 },
      ]
    },
    {
      slug: 'nasdem',
      name: 'Fraksi Partai NasDem',
      shortName: 'NasDem',
      kursi: 4,
      color: '#1b3a6b',
      masaJabatanId: mj2024.id,
      order: 4,
      anggota: []
    },
    {
      slug: 'pks',
      name: 'Fraksi Partai Keadilan Sejahtera',
      shortName: 'PKS',
      kursi: 3,
      color: '#ff6600',
      masaJabatanId: mj2024.id,
      order: 5,
      anggota: []
    },
    {
      slug: 'demokrat',
      name: 'Fraksi Partai Demokrat',
      shortName: 'Demokrat',
      kursi: 3,
      color: '#003580',
      masaJabatanId: mj2024.id,
      order: 6,
      anggota: []
    }
  ];

  for (const f of fraksiData) {
    const { anggota, ...info } = f;
    let fraksi = await prisma.fraksiInfo.findFirst({ where: { slug: f.slug } });
    if (fraksi) {
      fraksi = await prisma.fraksiInfo.update({
        where: { id: fraksi.id },
        data: info,
      });
    } else {
      fraksi = await prisma.fraksiInfo.create({
        data: info,
      });
    }

    // Seed anggota if none exist for this fraksi
    const existingAnggotaCount = await prisma.anggotaFraksi.count({
      where: { fraksiInfoId: fraksi.id }
    });

    if (existingAnggotaCount === 0) {
      for (const a of anggota) {
        await prisma.anggotaFraksi.create({
          data: {
            ...a,
            fraksiInfoId: fraksi.id,
          }
        });
      }
    }
  }

  console.log(`✅ Admin seeded: ${admin.username}`);
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log(`✅ Berita seeded: ${beritas.length} articles`);
  console.log(`✅ Fraksi seeded: ${fraksiData.length} groups`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

