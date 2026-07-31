import { motion } from "framer-motion";
import projectsData from "../../data/projectsData";
import VideoCard from "../common/VideoCard";

/**
 * Projects — Premium Video Gallery
 * ---------------------------------------------------------------------------
 * - يعرض 6 فيديوهات فقط (من projectsData) داخل بطاقات VideoCard مستقلة.
 * - لا يستخدم IPhoneFrame إطلاقًا — تصميم Gallery مستقل عن Experience.
 * - Grid متجاوب: 1 عمود موبايل | 2 تابلت | 3 ديسكتوب/لابتوب.
 * - لا يوجد Autoplay — كل فيديو يبدأ فقط عند ضغط المستخدم على Play.
 */
function Projects() {
  const { sectionLabel, heading, subheading, projects } = projectsData;

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

        {/* ---------- Gallery Grid (6 Videos) ---------- */}
        <motion.div
          className="grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
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
              <VideoCard videoSrc={project.src} title={project.title} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;
