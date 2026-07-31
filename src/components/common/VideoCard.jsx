import { useRef, useState, useEffect } from "react";

/**
 * VideoCard — بطاقة فيديو Premium لمعرض Projects
 * ---------------------------------------------------------------------------
 * - نسبة 9:16 مع object-fit: cover + Shadow عميق + Glow ناعم بلون الـ Accent.
 * - Native Controls (controls attribute) — Play/Pause/Volume/Fullscreen من المتصفح.
 * - لا يوجد Autoplay إطلاقًا — الفيديو يبدأ فقط عند ضغط المستخدم على Play.
 * - Poster/Thumbnail ثابت: يتم التقاط فريم من الفيديو نفسه (preload="metadata"
 *   + seek إلى 0.1s) ويظل ظاهرًا من البداية بدل الشاشة السوداء، حتى يضغط
 *   المستخدم Play فيظهر الفيديو بشكل طبيعي.
 * - تشغيل حصري: عند تشغيل أي فيديو يتم إيقاف كل الفيديوهات الأخرى تلقائيًا
 *   (Custom Event على مستوى الصفحة) — لا يمكن تشغيل فيديوهين معًا.
 * - IntersectionObserver: إيقاف الفيديو فقط عند خروجه من الشاشة (Pause فقط)،
 *   بدون أي تشغيل تلقائي عند العودة، مع الحفاظ على currentTime.
 * - Lazy Loading: لا يتم تحميل الفيديو إلا عند اقترابه من الشاشة (أداء أفضل).
 */

// اسم الحدث المخصص لإيقاف الفيديوهات الأخرى عند تشغيل أي فيديو
const VIDEO_PLAY_EVENT = "projects:video-play";

function VideoCard({ videoSrc, title }) {
  const videoRef = useRef(null);
  // هل اقترب الفيديو من الشاشة؟ (Lazy Loading — تحميل فقط، بدون تشغيل)
  const [shouldLoad, setShouldLoad] = useState(false);
  // هل بدأ المستخدم تشغيل الفيديو؟ (لإخفاء الـ Poster Overlay)
  const [isPlaying, setIsPlaying] = useState(false);

  // مراقبة ظهور الفيديو داخل الشاشة:
  // - عند الاقتراب من الشاشة → تحميل الفيديو فقط (بدون Play).
  // - عند الخروج من الشاشة → Pause فوري (يتوقف الصوت معه)، مع بقاء currentTime كما هو.
  // - عند العودة → لا شيء — التشغيل يدوي فقط عبر الـ Native Controls.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Lazy Loading: تحميل الفيديو عند اقترابه من الشاشة لأول مرة
          setShouldLoad((prev) => (prev ? prev : true));
        }

        if (entry.intersectionRatio < 0.5) {
          // الفيديو بدأ يختفي من الشاشة → إيقاف فقط (بدون أي Autoplay لاحقًا)
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: [0, 0.5, 1], rootMargin: "200px 0px" }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  // Poster/Thumbnail ثابت من البداية:
  // بمجرد تحميل الـ Metadata ننتقل إلى فريم 0.1s ونثبت عليه (بدون تشغيل)،
  // فيظهر الفريم كـ Thumbnail بدل الشاشة السوداء ويظل ظاهرًا حتى يضغط المستخدم Play.
  useEffect(() => {
    if (!shouldLoad) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    const captureThumbnailFrame = () => {
      // لا نغيّر الموضع إذا كان المستخدم قد شغّل الفيديو بالفعل
      if (video.currentTime === 0 && video.paused) {
        // فريم قريب جدًا من البداية ليكون Thumbnail ثابتًا
        video.currentTime = 0.1;
      }
    };

    if (video.readyState >= 1) {
      captureThumbnailFrame();
    } else {
      video.addEventListener("loadedmetadata", captureThumbnailFrame);
    }

    return () => {
      video.removeEventListener("loadedmetadata", captureThumbnailFrame);
    };
  }, [shouldLoad]);

  // تشغيل حصري: الاستماع لحدث تشغيل أي فيديو آخر وإيقاف هذا الفيديو فورًا
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const handleOtherVideoPlay = (event) => {
      // إذا كان الفيديو الذي بدأ التشغيل ليس هذا الفيديو → إيقاف فوري
      if (event.detail !== video && !video.paused) {
        video.pause();
      }
    };

    window.addEventListener(VIDEO_PLAY_EVENT, handleOtherVideoPlay);
    return () => {
      window.removeEventListener(VIDEO_PLAY_EVENT, handleOtherVideoPlay);
    };
  }, []);

  // عند ضغط المستخدم Play: إخفاء الـ Poster + إيقاف كل الفيديوهات الأخرى
  const handlePlay = () => {
    setIsPlaying(true);
    // بثّ حدث لكل البطاقات الأخرى لإيقاف أي فيديو يعمل
    window.dispatchEvent(new CustomEvent(VIDEO_PLAY_EVENT, { detail: videoRef.current }));
  };

  const handleOverlayPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    }
    handlePlay();
  };

  // عند الإيقاف (Pause/انتهاء/خروج من الشاشة): إعادة إظهار الـ Poster الثابت
  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="group relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[clamp(340px,30vw,440px)]">
      {/* Glow ناعم خلف البطاقة — بلون الـ Accent (#c9b88a) */}
      <div
        className="absolute -inset-6 rounded-[2.5rem] blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundColor: "rgba(201, 184, 138, 0.10)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -inset-2 rounded-[2rem] blur-lg transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundColor: "rgba(201, 184, 138, 0.08)" }}
        aria-hidden="true"
      />

      {/* جسم البطاقة — Shadow عميق + Border خفيف + Hover Scale بسيط */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-[#1a1d22] to-[#0f1114] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.75),0_0_40px_-8px_rgba(201,184,138,0.15)]">
        {/* الشاشة — نسبة 9:16 */}
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={shouldLoad ? videoSrc : undefined}
            controls
            loop
            playsInline
            preload="metadata"
            onPlay={handlePlay}
            onPause={handlePause}
            className="absolute inset-0 h-full w-full object-cover video-controls-visible"
          />

          {/* Poster/Thumbnail ثابت — يظهر من البداية ويختفي فقط أثناء التشغيل.
              يستخدم نفس مصدر الفيديو مع #t=0.1 لالتقاط الفريم الأول كصورة ثابتة. */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-end justify-center bg-black/20 pointer-events-none" aria-hidden="true">
              <video
                src={`${videoSrc}#t=0.1`}
                muted
                playsInline
                preload="metadata"
                tabIndex={-1}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleOverlayPlay}
                className="relative mb-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/60 px-5 py-3 text-sm font-medium text-text-primary transition hover:border-accent hover:text-accent pointer-events-auto"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-text-primary">
                  ▶
                </span>
                Play Video
              </button>
            </div>
          )}
        </div>
      </div>

      {/* عنوان المشروع */}
      <h3 className="mt-4 text-center font-display text-lg font-semibold text-text-primary">
        {title}
      </h3>
    </div>
  );
}

export default VideoCard;
