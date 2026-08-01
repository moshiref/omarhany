import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { fetchVideos, uploadVideo, deleteVideo } from '../lib/videos';

function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin');
        return;
      }
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // جلب الفيديوهات
  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      setError('فشل في تحميل الفيديوهات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user]);

  // رفع فيديو جديد
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) {
      setError('يرجى اختيار فيديو وإدخال العنوان');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadVideo(selectedFile, title.trim());
      setSuccess('تم رفع الفيديو بنجاح!');
      setTitle('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadVideos();
    } catch (err) {
      setError(err.message || 'فشل في رفع الفيديو');
    } finally {
      setUploading(false);
    }
  };

  // حذف فيديو
  const handleDelete = async (video) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${video.title}"؟`)) {
      return;
    }

    setDeleting(video.id);
    setError(null);
    setSuccess(null);

    try {
      await deleteVideo(video.id, video.file_path);
      setSuccess('تم حذف الفيديو بنجاح!');
      await loadVideos();
    } catch (err) {
      setError(err.message || 'فشل في حذف الفيديو');
    } finally {
      setDeleting(null);
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0b0d]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0b0d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary transition hover:border-accent hover:text-accent"
            >
              عرض الموقع
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-2xl border border-white/10 bg-[#111318] p-6"
        >
          <h2 className="mb-6 font-display text-lg font-semibold">إضافة فيديو جديد</h2>
          
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                عنوان الفيديو
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: Project 07"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-text-primary placeholder-text-secondary/50 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                ملف الفيديو
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 px-6 py-10 transition hover:border-accent/50 hover:bg-white/10"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-accent">{selectedFile.name}</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mb-3 h-10 w-10 text-text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-text-secondary">اضغط لاختيار فيديو أو اسحبه هنا</p>
                    <p className="mt-1 text-sm text-text-secondary/60">MP4, WebM, MOV</p>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile || !title.trim()}
              className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-black transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  جاري الرفع...
                </span>
              ) : (
                'رفع الفيديو'
              )}
            </button>
          </form>
        </motion.section>

        {/* Videos List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-[#111318] p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">الفيديوهات الحالية</h2>
            <span className="rounded-full bg-accent/20 px-3 py-1 text-sm text-accent">
              {videos.length} فيديو
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            </div>
          ) : videos.length === 0 ? (
            <div className="py-10 text-center text-text-secondary">
              لا توجد فيديوهات حتى الآن. ارفع أول فيديو!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  {/* Video Preview */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                    <video
                      src={video.video_url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-medium text-white">{video.title}</h3>
                    <p className="mt-1 text-xs text-white/60">
                      {new Date(video.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(video)}
                    disabled={deleting === video.id}
                    className="absolute right-3 top-3 rounded-full bg-red-500/80 p-2 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100 disabled:opacity-50"
                  >
                    {deleting === video.id ? (
                      <span className="block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}

export default AdminDashboard;
