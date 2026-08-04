import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import projectsData from "../../data/projectsData";
import VideoCard from "../common/VideoCard";
import { useVideos } from "../../context/VideosContext";

/**
 * Projects — Premium Video Gallery
 * ---------------------------------------------------------------------------
 * - يعرض الفيديوهات من Supabase (مع fallback للبيانات المحلية) داخل بطاقات VideoCard مستقلة.
 * - لا يستخدم IPhoneFrame إطلاقًا — تصميم Gallery مستقل عن Experience.
 * - Grid متجاوب: 1 عمود موبايل | 2 تابلت | 3 ديسكتوب/لابتوب.
 * - لا يوجد Autoplay — كل فيديو يبدأ فقط عند ضغط المستخدم على Play.
 */
function Projects() {
  const { sectionLabel, heading, subheading } = projectsData;
  const { videos, loading } = useVideos();
  // Fallback: إذا فشل whileInView على الموبايل، نُظهر البطاقات تلقائيًا بعد فترة قصيرة
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    if (!loading && videos.length > 0) {
      // بعد 800ms من اكتمال التحميل، نُجبر الظهور إذا لم يحدث بالفعل
      const timer = setTimeout(() => setForceShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, videos.length]);

  return (
    <section
      id="projects"
      className="relative w-full scroll-mt-20 overflow-x-clip px-6 py-24 sm:px-10 sm:py-28 lg:px-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ---------- Header ---------- */}
        <motion.div
          className="mb-12 flex flex-col items-center gap-4 text-center sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-sm tracking-[0.3em] text-text-secondary uppercase">
            {sectionLabel}
          </p>
          <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {subheading}
          </p>
        </motion.div>

        {/* ---------- Gallery Grid ---------- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : (
          <motion.div
            key={`projects-grid-${videos.length}`}
            className="grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            initial="hidden"
            animate={forceShow ? "show" : undefined}
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {videos.map((video) => (
              <motion.div
                key={video.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: "easeOut" },
                  },
                }}
                className="flex w-full justify-center"
              >
                <VideoCard videoSrc={video.video_url} title={video.title} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Projects;
