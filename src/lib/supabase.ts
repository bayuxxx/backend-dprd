import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET = process.env.STORAGE_BUCKET || 'dprd-media';

/**
 * Upload file buffer ke Supabase Storage
 * @returns Public URL file
 */
export async function uploadToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder: string = 'uploads'
): Promise<string> {
  const path = `${folder}/${Date.now()}-${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Hapus file dari Supabase Storage berdasarkan public URL
 */
export async function deleteFromStorage(publicUrl: string): Promise<void> {
  try {
    const url = new URL(publicUrl);
    // Path dimulai setelah /storage/v1/object/public/<bucket>/
    const pathParts = url.pathname.split(`/storage/v1/object/public/${BUCKET}/`);
    if (pathParts.length < 2) return;

    const filePath = pathParts[1];
    await supabase.storage.from(BUCKET).remove([filePath]);
  } catch {
    // Abaikan error saat delete (file mungkin tidak ada)
    console.warn('Gagal menghapus file dari storage:', publicUrl);
  }
}
