import { supabase } from './supabase';

const TABLE_NAME = 'videos';
const BUCKET_NAME = 'videos';

/**
 * جلب جميع الفيديوهات من Supabase مرتبة حسب created_at
 * @returns {Promise<Array>} قائمة الفيديوهات
 */
export async function fetchVideos() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }

  return data || [];
}

/**
 * رفع فيديو جديد إلى Supabase Storage وحفظ بياناته في Database
 * @param {File} file - ملف الفيديو
 * @param {string} title - عنوان الفيديو
 * @returns {Promise<Object>} بيانات الفيديو المحفوظ
 */
export async function uploadVideo(file, title) {
  // إنشاء اسم فريد للملف
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  // رفع الملف إلى Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading video:', uploadError);
    throw uploadError;
  }

  // الحصول على الرابط العام
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  // حفظ البيانات في Database
  const { data, error: dbError } = await supabase
    .from(TABLE_NAME)
    .insert([
      {
        title,
        video_url: publicUrl,
        file_path: filePath,
      },
    ])
    .select()
    .single();

  if (dbError) {
    // إذا فشل حفظ البيانات، نحذف الملف المرفوع
    await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    console.error('Error saving video data:', dbError);
    throw dbError;
  }

  return data;
}

/**
 * حذف فيديو من Supabase Storage وDatabase
 * @param {string} id - معرف الفيديو في Database
 * @param {string} filePath - مسار الملف في Storage
 * @returns {Promise<void>}
 */
export async function deleteVideo(id, filePath) {
  // حذف من Storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting video from storage:', storageError);
    throw storageError;
  }

  // حذف من Database
  const { error: dbError } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting video from database:', dbError);
    throw dbError;
  }
}
