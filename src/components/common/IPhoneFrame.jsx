import { useRef, useState, useEffect } from "react";

/**
 * IPhoneFrame — Component مشترك بين Experience و Projects
 * ---------------------------------------------------------------------------
 * إطار iPhone حديث وواقعي (Dynamic Island + أزرار جانبية + Bezel معدني)
 * يعرض فيديو Vertical 9:16 داخل الشاشة بالكامل (object-fit: cover)
 * مع Glow ناعم بلون الـ Accent (#c9b88a).
 *
 * المزايا:
 * - IntersectionObserver: إيقاف الفيديو فور خروجه من الشاشة فقط (Pause فقط)،
 *   بدون أي تشغيل/استكمال تلقائي عند العودة — التشغيل يدوي فقط.
 * - لا يوجد Autoplay إطلاقًا — الفيديو يبدأ فقط عند ضغط المستخدم على Play.
 * - Controls: Play / Pause + Mute / Unmute + Volume Slider.
 *
 * الأحجام الافتراضية (نفس Experience):
 *   Mobile: 270px | Tablet: 300px | Desktop: clamp(400px, 36vw, 540px)
 * ويمكن تخصيصها عبر sizeClassName (تُستخدم في Projects لشبكة 3/2/1).
 */
function IPhoneFrame({
  videoSrc,
  sizeClassName = "max-w-[320px] sm:max-w-[360px] lg:max-w-[clamp(480px,42vw,680px)]",
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showNativeControls, setShowNativeControls] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setShowNativeControls(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const revealControls = () => {
    setShowControls(true);
  };

  // مراقبة ظهور الفيديو داخل الشاشة عبر IntersectionObserver:
  // - بمجرد أن يبدأ الفيديو في الخروج من الشاشة → Pause فوري (ويتوقف الصوت معه فورًا).
  // - عند العودة والظهور مرة أخرى → لا يوجد أي تشغيل تلقائي (يبقى متوقفًا عند نفس الموضع).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5) {
          // الفيديو بدأ يختفي من الشاشة → إيقاف فوري (Pause فقط)
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        }
        // ملاحظة: لا يوجد استكمال تلقائي عند العودة — التشغيل يدوي فقط
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(video);

    // تنظيف الـ Observer بشكل صحيح عند إزالة الـ Component
    return () => observer.disconnect();
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    revealControls();
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    revealControls();
  };

  const handleVolume = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const value = Number(e.target.value);
    video.volume = value;
    video.muted = value === 0;
    setIsMuted(video.muted);
  };

  return (
    <div className={`relative w-full min-h-[420px] sm:min-h-[470px] ${sizeClassName}`}>
      {/* Glow ناعم خلف الـ iPhone — بنفس لون السهم (Accent #c9b88a) */}
      <div
        className="absolute -inset-10 rounded-[4.5rem] blur-3xl"
        style={{ backgroundColor: "rgba(201, 184, 138, 0.14)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -inset-3 rounded-[3.4rem] blur-xl"
        style={{ backgroundColor: "rgba(201, 184, 138, 0.10)" }}
        aria-hidden="true"
      />

      {/* جسم الجهاز — إطار معدني داكن مع حافة فاتحة خفيفة */}
      <div className="relative h-full rounded-[3rem] border border-white/10 bg-gradient-to-b from-[#3a3f47] via-[#23272e] to-[#15181d] p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
        {/* زر الطاقة (يمين) */}
        <div className="absolute -right-[2.5px] top-32 h-16 w-[3px] rounded-r-md bg-[#3a3f47]" />
        {/* أزرار الصوت (يسار) */}
        <div className="absolute -left-[2.5px] top-24 h-8 w-[3px] rounded-l-md bg-[#3a3f47]" />
        <div className="absolute -left-[2.5px] top-36 h-8 w-[3px] rounded-l-md bg-[#3a3f47]" />
        {/* زر الصامت (يسار أعلى) */}
        <div className="absolute -left-[2.5px] top-16 h-4 w-[3px] rounded-l-md bg-[#3a3f47]" />

        {/* الشاشة */}
        <div
          className="relative aspect-[9/19] w-full cursor-pointer overflow-hidden rounded-[2.4rem] bg-black"
          onClick={revealControls}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            controls={showNativeControls}
            className="absolute inset-0 h-full w-full object-cover lg:object-contain"
          />

          {/* Dynamic Island */}
          <div className="pointer-events-none absolute left-1/2 top-2.5 z-10 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black shadow-inner">
            {/* عدسة الكاميرا */}
            <div className="absolute right-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#1a1d22] ring-1 ring-white/5" />
          </div>

          {/* Home Indicator */}
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 h-[4px] w-24 -translate-x-1/2 rounded-full bg-white/40" />

          {/* ---------- Video Controls ---------- */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-6 pt-10 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-3">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors duration-200 hover:border-accent/60 hover:text-accent active:scale-95"
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.5-6.86a1.03 1.03 0 0 0 0-1.76L9.56 4.26A1.03 1.03 0 0 0 8 5.14Z" />
                  </svg>
                )}
              </button>

              {/* Mute / Unmute */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors duration-200 hover:border-accent/60 hover:text-accent active:scale-95"
              >
                {isMuted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>
            </div>

            {/* Volume Slider — يظهر فقط عند إلغاء الصامت */}
            {!isMuted && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                defaultValue="1"
                onChange={handleVolume}
                aria-label="Volume"
                className="mx-auto h-1 w-3/4 cursor-pointer appearance-none rounded-full bg-white/25 accent-[#c9b88a]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IPhoneFrame;
