import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchVideos } from '../lib/videos';
import projectsData from '../data/projectsData';

const VideosContext = createContext(null);

export function VideosProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchVideos();
      
      // إذا لم تكن هناك فيديوهات في Supabase، نستخدم البيانات المحلية كـ fallback
      if (data.length === 0) {
        setVideos(projectsData.projects.map((p, index) => ({
          id: `local-${p.id}`,
          title: p.title,
          video_url: p.src,
          file_path: null,
          isLocal: true,
          order: index,
        })));
      } else {
        setVideos(data);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError(err.message);
      // في حالة الخطأ، نستخدم البيانات المحلية
      setVideos(projectsData.projects.map((p, index) => ({
        id: `local-${p.id}`,
        title: p.title,
        video_url: p.src,
        file_path: null,
        isLocal: true,
        order: index,
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const refreshVideos = useCallback(() => {
    return loadVideos();
  }, [loadVideos]);

  const value = {
    videos,
    loading,
    error,
    refreshVideos,
    videosCount: videos.length,
  };

  return (
    <VideosContext.Provider value={value}>
      {children}
    </VideosContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideosProvider');
  }
  return context;
}
