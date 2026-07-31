// ============================================================================
// Hero Section — Data Layer
// ----------------------------------------------------------------------------
// كل بيانات الـ Hero موجودة هنا في مكان واحد فقط.
// لاحقًا عند ربط المشروع بـ Supabase، هذا الملف سيتحول ببساطة إلى
// استعلام (fetch) من جدول "hero_content" بدلاً من object ثابت،
// مع الحفاظ على نفس الشكل (shape) بالضبط حتى لا يحتاج أي Component للتغيير.
// ============================================================================

// صورة Omar الشخصية — Placeholder حاليًا.
// عند توفر صورة حقيقية: ضعها في src/assets/images/profile/
// (مثال: omar-profile.jpg) ثم غيّر هذا السطر فقط:
//   import profileImage from "../assets/images/profile/omar-profile.jpg";
import profileImage from "../assets/images/profile/omar-profile-placeholder.jpg";

const heroData = {
  // --- Identity ---
  name: "Omar Hany",
  role: "Content Creator",
  intro: "Hello, I'm",

  // --- Profile Image (مصدر واحد فقط للصورة) ---
  profileImage,
  isPlaceholderImage: true, // يتحول إلى false تلقائيًا عند وضع صورة حقيقية

  // --- Descriptions ---
  description:
    "I have over 40K followers on TikTok and 13K+ on YouTube, specializing in football content.",
  secondaryDescription:
    "I help brands connect with real audiences through authentic, high-quality UGC videos that feel natural, relatable, and impactful.",

  // --- Animated Text ("I create ...") ---
  animatedPrefix: "I create",
  animatedTexts: ["Football Content", "UGC Videos", "Brand Storytelling"],

  // --- Content Types ---
  contentTypes: [
    "Football Content",
    "UGC Videos",
    "Unboxing",
    "Reviews",
    "Lifestyle Content",
    "Branded Storytelling",
  ],

  // --- Social Stats (أرقام ثابتة، بدون Counter Animation) ---
  stats: [
    { value: "40K+", label: "TikTok Followers" },
    { value: "13K+", label: "YouTube Subscribers" },
  ],

  // --- CTA Buttons (جاهزة للربط لاحقًا بأقسام #projects و #contact) ---
  ctaButtons: [
    { label: "View My Work", href: "#projects", variant: "primary" },
    { label: "Let's Work Together", href: "#contact", variant: "secondary" },
  ],
};

export default heroData;
