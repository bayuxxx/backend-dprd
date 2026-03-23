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

  for (const b of beritas) {
    await prisma.berita.upsert({
      where: { slug: b.slug },
      update: {},
      create: b
    });
  }

  console.log(`✅ Admin seeded: ${admin.username}`);
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log(`✅ Berita seeded: ${beritas.length} articles`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
