import { motion } from "framer-motion";
import experienceData from "../../data/experienceData";
import IPhoneFrame from "../common/IPhoneFrame";

/**
 * ScrollArrow
 * سهم صغير بلون الـ Accent — ينزل قليلًا ثم يرجع ببطء (Loop ~2.8s)
 * مع Fade خفيف جدًا (لا يختفي تمامًا).
 */
function ScrollArrow() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0], opacity: [0.9, 0.45, 0.9] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      className="flex justify-center text-accent lg:hidden"
      aria-hidden="true"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4v16" />
        <path d="m6 14 6 6 6-6" />
      </svg>
    </motion.div>
  );
}

/**
 * Experience
 * Desktop: نص يسار | iPhone يمين
 * Mobile:  iPhone → السهم → النص
 * ملاحظة: الـ iPhone Frame أصبح Component مشتركًا (src/components/common/IPhoneFrame.jsx)
 * يُستخدم هنا وفي قسم Projects بنفس التصميم والإعدادات بالضبط.
 */
function Experience() {
  const {
    sectionLabel,
    heading,
    paragraphs,
    whatIDoTitle,
    whatIDo,
    closing,
    videoSrc,
  } = experienceData;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <section
      id="experience"
      className="relative w-full scroll-mt-20 overflow-x-clip px-6 py-24 sm:px-10 sm:py-28 lg:px-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-10">
        {/* ---------------- iPhone + Arrow ----------------
            على الموبايل يظهر أولًا (order-1)، على الديسكتوب يمين (lg:order-2) */}
        <motion.div
          className="order-1 flex h-full flex-col items-center gap-6 lg:order-2 lg:items-start lg:justify-self-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <IPhoneFrame
            videoSrc={videoSrc}
            sizeClassName="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[520px] lg:max-w-[760px] lg:min-h-[560px] xl:max-w-[860px] xl:min-h-[620px]"
          />

          <ScrollArrow />
        </motion.div>

        {/* ---------------- Text ----------------
            على الموبايل يظهر بعد السهم (order-2)، على الديسكتوب يسار (lg:order-1) */}
        <motion.div
          className="order-2 flex flex-col gap-6 lg:order-1"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.p
            variants={item}
            className="text-sm tracking-[0.3em] text-text-secondary uppercase"
          >
            {sectionLabel}
          </motion.p>

          <motion.h2
            variants={item}
            className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
          >
            {heading}
          </motion.h2>

          {paragraphs.map((paragraph) => (
            <motion.p
              key={paragraph.slice(0, 24)}
              variants={item}
              className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              {paragraph}
            </motion.p>
          ))}

          {/* What I Do */}
          <motion.div variants={item} className="flex flex-col gap-4 pt-2">
            <h3 className="font-display text-lg font-semibold text-text-primary sm:text-xl">
              {whatIDoTitle}
            </h3>
            <ul className="flex flex-col gap-3">
              {whatIDo.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  {/* نقطة ذهبية صغيرة */}
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-xl border-l-2 border-accent/60 pl-4 text-sm font-medium leading-relaxed text-text-primary sm:text-base"
          >
            {closing}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
