# 🚀 دليل إعداد المشروع مع Supabase والنشر على Vercel

## 📋 المتطلبات
- حساب على [Supabase](https://supabase.com) (مجاني)
- حساب على [Vercel](https://vercel.com) (مجاني)
- حساب على [GitHub](https://github.com) (لرفع الكود)

---

## 1️⃣ إعداد Supabase

### أ) إنشاء مشروع جديد
1. اذهب إلى [supabase.com](https://supabase.com) وسجل دخولك
2. اضغط **"New Project"**
3. اختر **Organization** أو أنشئ واحدة جديدة
4. أدخل:
   - **Name**: `omar-portfolio` (أو أي اسم)
   - **Database Password**: اختر كلمة مرور قوية (احفظها!)
   - **Region**: اختر الأقرب لك (مثل `West EU` أو `Central EU`)
5. اضغط **"Create new project"** وانتظر دقيقتين

### ب) إنشاء جدول الفيديوهات
1. من القائمة الجانبية، اذهب إلى **SQL Editor**
2. اضغط **"New query"**
3. انسخ محتوى ملف `supabase-setup.sql` والصقه
4. اضغط **"Run"** أو `Ctrl + Enter`

### ج) إنشاء Storage Bucket
1. من القائمة الجانبية، اذهب إلى **Storage**
2. اضغط **"New bucket"**
3. أدخل:
   - **Name**: `videos`
   - **Public bucket**: ✅ فعّل هذا الخيار
4. اضغط **"Create bucket"**

### د) إضافة سياسات Storage
1. في صفحة **Storage**، اضغط على **Policies** (أو **Configuration** > **Policies**)
2. اضغط **"New Policy"** على bucket `videos`
3. اختر **"Create a new policy from scratch"**
4. أضف السياسات التالية:

**سياسة القراءة العامة:**
```sql
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'videos');
```

**سياسة الرفع للمستخدمين المسجلين:**
```sql
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'videos');
```

**سياسة الحذف للمستخدمين المسجلين:**
```sql
CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'videos');
```

### هـ) إنشاء حساب Admin
1. من القائمة الجانبية، اذهب إلى **Authentication** > **Users**
2. اضغط **"Add user"** > **"Create new user"**
3. أدخل:
   - **Email**: بريدك الإلكتروني
   - **Password**: كلمة مرور قوية
   - **Auto Confirm User**: ✅ فعّل هذا الخيار
4. اضغط **"Create user"**

### و) الحصول على API Keys
1. من القائمة الجانبية، اذهب إلى **Settings** > **API**
2. انسخ:
   - **Project URL** (مثل: `https://abcdefgh.supabase.co`)
   - **anon public** key (مفتاح طويل يبدأ بـ `eyJ...`)

---

## 2️⃣ إعداد المشروع محليًا

### أ) إنشاء ملف `.env`
1. في مجلد المشروع، أنشئ ملف جديد باسم `.env`
2. أضف المحتوى التالي (استبدل القيم بقيمك):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### ب) تشغيل المشروع محليًا
```bash
npm run dev
```

افتح المتصفح على `http://localhost:5173`

---

## 3️⃣ نقل الفيديوهات الحالية إلى Supabase

### الطريقة اليدوية (موصى بها):
1. اذهب إلى **Storage** > **videos** في Supabase Dashboard
2. اضغط **"Upload file"**
3. ارفع كل فيديو من مجلد `public/video/`
4. بعد رفع كل فيديو، اذهب إلى **Table Editor** > **videos**
5. اضغط **"Insert"** > **"Insert row"**
6. أدخل:
   - **title**: عنوان الفيديو (مثل: "Project 01")
   - **video_url**: اضغط على الفيديو في Storage وانسخ الرابط العام
   - **file_path**: اسم الملف في Storage (مثل: `ORS UGC.mp4`)

### الفيديوهات الحالية المطلوب نقلها:
| # | اسم الملف | العنوان المقترح |
|---|-----------|------------------|
| 1 | `ORS UGC.mp4` | Project 01 |
| 2 | `العواد UGC.mp4` | Project 02 |
| 3 | `بصمة كاتب.mp4` | Project 03 |
| 4 | `سوبر اسباني.mp4` | Project 04 |
| 5 | `فنون النبراوي.mp4` | Project 05 |
| 6 | `كرياتين مانجا.mp4` | Project 06 |

> ⚠️ **مهم**: لا تحذف الفيديوهات من `public/video/` حتى تتأكد أن كل شيء يعمل!

---

## 4️⃣ النشر على Vercel

### أ) رفع الكود على GitHub
```bash
git add .
git commit -m "Add Supabase integration and Admin Dashboard"
git push origin main
```

### ب) ربط المشروع بـ Vercel
1. اذهب إلى [vercel.com](https://vercel.com) وسجل دخولك
2. اضغط **"Add New"** > **"Project"**
3. اختر مستودع GitHub الخاص بك
4. في صفحة الإعداد:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### ج) إضافة Environment Variables
1. في نفس صفحة الإعداد، اذهب إلى **Environment Variables**
2. أضف:
   - **Name**: `VITE_SUPABASE_URL` | **Value**: رابط مشروعك
   - **Name**: `VITE_SUPABASE_ANON_KEY` | **Value**: مفتاح anon
3. اضغط **"Deploy"**

### د) بعد النشر
1. انتظر حتى ينتهي النشر (دقيقة أو دقيقتين)
2. اضغط على الرابط الذي يظهر لك (مثل: `omar-portfolio.vercel.app`)
3. جرّب الموقع!

---

## 5️⃣ استخدام Admin Dashboard

### الوصول للوحة التحكم:
- اذهب إلى: `https://your-site.vercel.app/admin`
- سجل دخولك بالبريد وكلمة المرور التي أنشأتها في Supabase

### إضافة فيديو جديد:
1. اضغط على منطقة الرفع أو اسحب فيديو
2. أدخل عنوان الفيديو
3. اضغط **"رفع الفيديو"**
4. انتظر حتى يكتمل الرفع
5. الفيديو سيظهر تلقائيًا في الموقع!

### حذف فيديو:
1. مرر الماوس على الفيديو في لوحة التحكم
2. اضغط على أيقونة الحذف (🗑️)
3. أكّد الحذف
4. الفيديو سيختفي من الموقع تلقائيًا!

---

## 6️⃣ التحقق من عمل كل شيء

### ✅ قائمة التحقق:
- [ ] الموقع يعمل على الرابط المنشور
- [ ] قسم Projects يعرض الفيديوهات من Supabase
- [ ] عدد المشاريع في Stats يتطابق مع عدد الفيديوهات
- [ ] يمكن تسجيل الدخول إلى `/admin`
- [ ] يمكن رفع فيديو جديد ويظهر في الموقع
- [ ] يمكن حذف فيديو ويختفي من الموقع
- [ ] الفيديوهات تعمل على الموبايل والديسكتوب

---

## 🔧 حل المشاكل الشائعة

### المشكلة: الفيديوهات لا تظهر
**الحل:**
1. تأكد من أن Bucket `videos` هو **Public**
2. تأكد من إضافة سياسات Storage بشكل صحيح
3. افتح Console في المتصفح وابحث عن أخطاء

### المشكلة: لا يمكن تسجيل الدخول
**الحل:**
1. تأكد من إنشاء المستخدم في Authentication > Users
2. تأكد من تفعيل **Auto Confirm User**
3. تأكد من صحة البريد وكلمة المرور

### المشكلة: خطأ في رفع الفيديو
**الحل:**
1. تأكد من تسجيل الدخول أولاً
2. تأكد من أن حجم الفيديو أقل من 50MB (الحد المجاني)
3. تأكد من سياسات Storage

---

## 📁 ملخص الملفات المهمة

| الملف | الوصف |
|-------|-------|
| `.env` | متغيرات البيئة (لا ترفعه على GitHub!) |
| `.env.example` | مثال لمتغيرات البيئة |
| `vercel.json` | إعدادات Vercel للـ SPA |
| `supabase-setup.sql` | سكريبت إعداد قاعدة البيانات |
| `src/lib/supabase.js` | إعداد اتصال Supabase |
| `src/lib/videos.js` | دوال إدارة الفيديوهات |
| `src/context/VideosContext.jsx` | Context للفيديوهات |
| `src/pages/AdminLogin.jsx` | صفحة تسجيل الدخول |
| `src/pages/AdminDashboard.jsx` | لوحة التحكم |

---

## 🎉 تهانينا!

بعد إكمال هذه الخطوات، سيكون لديك:
- ✅ موقع Portfolio احترافي
- ✅ لوحة تحكم لإدارة الفيديوهات
- ✅ قاعدة بيانات سحابية
- ✅ تخزين فيديوهات سحابي
- ✅ نظام تسجيل دخول آمن
- ✅ كل شيء يعمل أونلاين بدون الحاجة لجهازك!

---

**ملاحظة**: إذا واجهت أي مشكلة، راجع قسم "حل المشاكل الشائعة" أو تواصل معي.
