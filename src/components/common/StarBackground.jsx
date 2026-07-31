import { useEffect, useRef } from "react";

/**
 * StarBackground
 * خلفية نجوم متحركة Minimal جدًا تغطي الموقع بالكامل.
 *
 * - اللون: نفس لون الـ Accent الذهبي (#c9b88a) المستخدم في اسم "Omar Hany".
 * - نجوم صغيرة (1.6–2.6px) وقليلة، بـ Opacity منخفضة.
 * - نوعان من الحركة فقط:
 *    1) Twinkle: Fade In / Fade Out ناعم وعشوائي (Sine wave).
 *    2) Drift: صعود بطيء جدًا لأعلى ثم اختفاء تدريجي، ثم تُعاد ولادة النجمة من جديد.
 * - Canvas واحد Fixed خلف كل المحتوى + pointer-events: none.
 * - Responsive: عدد النجوم يتناسب مع مساحة الشاشة (أقل على الموبايل).
 * - أداء: requestAnimationFrame واحد، يتوقف تلقائيًا عند إخفاء التبويب،
 *   ويحترم prefers-reduced-motion (يعرض نجومًا ثابتة خافتة بدون حركة).
 */

const STAR_COLOR = "201, 184, 138"; // #c9b88a — var(--color-accent)
const MAX_OPACITY = 0.45; // أقصى سطوع لأي نجمة (خافت عمدًا)
const DRIFTER_RATIO = 0.25; // نسبة النجوم التي تصعد ببطء
const DRIFT_SPEED = 6; // px لكل ثانية — بطيء جدًا

function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let rafId = null;
    let stars = [];
    let width = 0;
    let height = 0;
    let lastTime = performance.now();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const random = (min, max) => min + Math.random() * (max - min);

    function createStar(isDrifter) {
      return {
        x: random(0, width),
        y: random(0, height),
        radius: random(0.8, 1.3), // قطر فعلي 1.6–2.6px — أوضح قليلًا لكن ما زال Minimal
        isDrifter,
        // Twinkle: طور عشوائي + سرعة عشوائية بطيئة
        phase: random(0, Math.PI * 2),
        twinkleSpeed: random(0.15, 0.5), // rad/s — Fade بطيء جدًا
        // Drift: عمر النجمة قبل أن تختفي وتُستبدل
        life: random(0, 1),
        lifeDuration: random(14, 26), // ثانية
        maxOpacity: random(0.18, MAX_OPACITY),
      };
    }

    function buildStars() {
      // كثافة منخفضة جدًا: نجمة لكل ~14000px² على الكمبيوتر، وأقل على الموبايل
      const area = width * height;
      const isSmallScreen = width < 768;
      const density = isSmallScreen ? 1 / 22000 : 1 / 14000;
      const count = Math.max(18, Math.min(isSmallScreen ? 45 : 90, Math.floor(area * density)));

      stars = Array.from({ length: count }, (_, i) =>
        createStar(i < count * DRIFTER_RATIO)
      );
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // حد أقصى 2 للأداء
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();

      // عند تفعيل reduced-motion: ارسم إطارًا ثابتًا واحدًا فقط
      if (prefersReducedMotion) {
        draw(0, true);
      }
    }

    function starOpacity(star, time) {
      if (star.isDrifter) {
        // Fade In في أول 20% من العمر، Fade Out في آخر 30%
        const fadeIn = Math.min(star.life / 0.2, 1);
        const fadeOut = Math.min((1 - star.life) / 0.3, 1);
        return star.maxOpacity * Math.min(fadeIn, fadeOut);
      }
      // Twinkle ناعم بين 15% و 100% من maxOpacity
      const wave = (Math.sin(star.phase + time * star.twinkleSpeed) + 1) / 2;
      return star.maxOpacity * (0.15 + 0.85 * wave);
    }

    function draw(time, staticFrame = false) {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        const opacity = staticFrame
          ? star.maxOpacity * 0.5
          : starOpacity(star, time);

        if (opacity <= 0.004) continue;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${STAR_COLOR}, ${opacity.toFixed(3)})`;
        ctx.fill();
      }
    }

    function tick(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1); // ثانية
      lastTime = now;
      const time = now / 1000;

      for (const star of stars) {
        if (!star.isDrifter) continue;

        star.y -= DRIFT_SPEED * dt;
        star.life += dt / star.lifeDuration;

        // انتهى عمرها أو خرجت من الشاشة → ولادة جديدة من الأسفل
        if (star.life >= 1 || star.y < -4) {
          Object.assign(star, createStar(true), {
            y: random(height * 0.4, height + 4),
            life: 0,
          });
        }
      }

      draw(time);
      rafId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);

    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

export default StarBackground;
