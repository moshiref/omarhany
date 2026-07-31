// ============================================================================
// Projects Section — Data Layer
// ----------------------------------------------------------------------------
// معرض فيديوهات الـ Content Creator — كل فيديو يُعرض داخل Video Card Premium
// (بدون iPhone Frame — تصميم مستقل عن Experience).
//
// لإضافة فيديو جديد:
//   1) ضع ملف الفيديو داخل public/video/
//   2) أضف object جديد داخل projects مع src: "/video/اسم-الملف.mp4"
//
// ملاحظة: فيديو Experience (experience-video.mp4) مخصص لقسم Experience فقط.
// ============================================================================

const projectsData = {
  sectionLabel: "Projects",
  heading: "My Work",
  subheading:
    "A selection of my best content — from football storytelling to brand collaborations.",

  projects: [
    { id: 1, title: "Project 01", src: "/video/ORS UGC.mp4" },
    { id: 2, title: "Project 02", src: "/video/العواد UGC.mp4" },
    { id: 3, title: "Project 03", src: "/video/بصمة كاتب.mp4" },
    { id: 4, title: "Project 04", src: "/video/سوبر اسباني.mp4" },
    { id: 5, title: "Project 05", src: "/video/فنون النبراوي.mp4" },
    { id: 6, title: "Project 06", src: "/video/كرياتين مانجا.mp4" },
  ],
};

export default projectsData;
