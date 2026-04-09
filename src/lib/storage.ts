import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

// Pastikan folder uploads ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Simpan file buffer ke disk lokal
 * @returns Relative URL path (e.g. "/uploads/banners/1234567890-foto.jpg")
 */
export async function uploadToStorage(
  buffer: Buffer,
  filename: string,
  _mimeType: string,
  folder: string = 'uploads'
): Promise<string> {
  const folderPath = path.join(UPLOAD_DIR, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Bersihkan nama file
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueFilename = `${Date.now()}-${safeFilename}`;
  const filePath = path.join(folderPath, uniqueFilename);

  fs.writeFileSync(filePath, buffer);

  // Return relative URL yang bisa diakses via static serving
  return `/uploads/${folder}/${uniqueFilename}`;
}

/**
 * Hapus file dari disk lokal berdasarkan URL path
 */
export async function deleteFromStorage(fileUrl: string): Promise<void> {
  try {
    // fileUrl format: "/uploads/folder/filename.ext"
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;

    const relativePath = fileUrl.replace('/uploads/', '');
    const fullPath = path.join(UPLOAD_DIR, relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch {
    console.warn('Gagal menghapus file dari storage:', fileUrl);
  }
}
