-- ============================================
-- Supabase Setup Script for Omar Portfolio
-- ============================================
-- انسخ هذا الكود والصقه في Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. إنشاء جدول الفيديوهات
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. تفعيل Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 3. السماح للجميع بقراءة الفيديوهات (للموقع العام)
CREATE POLICY "Allow public read access" ON videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. السماح للمستخدمين المسجلين فقط بإضافة فيديوهات
CREATE POLICY "Allow authenticated insert" ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. السماح للمستخدمين المسجلين فقط بحذف فيديوهات
CREATE POLICY "Allow authenticated delete" ON videos
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Storage Bucket Setup
-- ============================================
-- يجب إنشاء Bucket يدويًا من Dashboard:
-- 1. اذهب إلى Storage
-- 2. اضغط "New Bucket"
-- 3. الاسم: videos
-- 4. Public bucket: ✅ نعم
-- 5. اضغط "Create Bucket"

-- ثم أضف هذه السياسات للـ Bucket:
-- (يمكنك إضافتها من Storage > Policies)

-- سياسة القراءة العامة:
-- CREATE POLICY "Allow public read" ON storage.objects
--   FOR SELECT TO anon, authenticated
--   USING (bucket_id = 'videos');

-- سياسة الرفع للمستخدمين المسجلين:
-- CREATE POLICY "Allow authenticated upload" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'videos');

-- سياسة الحذف للمستخدمين المسجلين:
-- CREATE POLICY "Allow authenticated delete" ON storage.objects
--   FOR DELETE TO authenticated
--   USING (bucket_id = 'videos');
