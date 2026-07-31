import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import aboutData from "../../data/aboutData";

// --- توقيت الـ Keyword Loop ---
const FADE_DURATION = 0.5; // ثانية — Fade In / Fade Out
const HOLD_DURATION = 2200; // ms — مدة ثبات الكلمة قبل الاختفاء

/**
 * AnimatedKeyword
 * كلمة واحدة في كل مرة: Fade In → تثبت قليلًا → Fade Out → الكلمة التالية.
 * حاوية بارتفاع ثابت لمنع أي Layout Shift.
 */
function AnimatedKeyword({ words }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % words.length),
      HOLD_DURATION + FADE_DURATION * 1000
    );
    return () => clearTimeout(timer);
  }, [index, words.length]);

  return (
    <span className="relative inline-flex h-[1.4em] min-w-[10ch] items-center align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
          className="font-display font-semibold text-accent whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * About
 * قسم تعريفي بدون صورة — نص + Social Proof + Animated Keywords.
 */
function About() {
  const { sectionLabel, heading, description, stats, keywords } = aboutData;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <section
      id="about"
      className="relative w-full scroll-mt-20 px-6 py-24 sm:px-10 sm:py-28 lg:px-20"
    >
      <motion.div
        className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p
          variants={item}
          className="text-sm tracking-[0.3em] text-text-secondary uppercase"
        >
          {sectionLabel}
        </motion.p>

        <motion.h2
          variants={item}
          className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
        >
          {heading}
        </motion.h2>

        <motion.p
          variants={item}
          className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          {description}
        </motion.p>

        {/* Social Proof */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-10 pt-2 sm:gap-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-display text-3xl font-semibold text-accent sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-text-secondary sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Animated Keywords */}
        <motion.div
          variants={item}
          className="pt-4 text-xl text-text-secondary sm:text-2xl"
        >
          <AnimatedKeyword words={keywords} />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default About;
