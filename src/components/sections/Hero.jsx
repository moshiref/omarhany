import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import heroData from "../../data/heroData";

// --- Typewriter timing (fast + snappy, no slide/translate — text only) ---
const TYPING_SPEED = 45; // ms per character while appearing
const DELETING_SPEED = 28; // ms per character while disappearing (a bit faster)
const HOLD_AFTER_TYPING = 700; // short pause once the word is fully typed
const HOLD_AFTER_DELETING = 200; // brief pause before the next word starts typing

/**
 * TypewriterText
 * "I create" تفضل ثابتة تمامًا بدون أي حركة.
 * الكلمة المتغيرة تُكتب حرف بحرف ثم تُمحى حرف بحرف (Typewriter كلاسيكي)،
 * بدون أي Fade أو Slide أو Translate — فقط تغيّر في محتوى النص نفسه،
 * مع عرض ثابت (min-width) لمنع أي Layout Shift أثناء الحركة.
 */
function TypewriterText({ prefix, words }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | holding | deleting | waiting
  const timeoutRef = useRef(null);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (phase === "typing") {
      if (charCount < currentWord.length) {
        timeoutRef.current = setTimeout(() => {
          setCharCount((c) => c + 1);
        }, TYPING_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("deleting"), HOLD_AFTER_TYPING);
      }
    } else if (phase === "deleting") {
      if (charCount > 0) {
        timeoutRef.current = setTimeout(() => {
          setCharCount((c) => c - 1);
        }, DELETING_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => {
          setWordIndex((i) => (i + 1) % words.length);
          setPhase("typing");
        }, HOLD_AFTER_DELETING);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [charCount, phase, wordIndex, words]);

  // أطول كلمة تحدد عرض الحاوية الثابت حتى لا يحدث Layout Shift أبدًا
  const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const currentWord = words[wordIndex];
  const visibleText = currentWord.slice(0, charCount);

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 text-xl sm:text-2xl">
      <span className="text-text-secondary font-body">{prefix}</span>
      <span className="relative inline-block align-bottom">
        {/* Spacer بنفس عرض أطول كلمة — يضمن ثبات المساحة بدون أي حركة رأسية أو أفقية للعناصر حوله */}
        <span
          aria-hidden="true"
          className="invisible font-display font-semibold whitespace-pre"
        >
          {longestWord}
        </span>
        <span className="absolute inset-0 flex items-center font-display font-semibold text-accent whitespace-pre">
          {visibleText}
          <span className="typewriter-cursor ml-0.5 inline-block w-[2px] bg-accent" />
        </span>
      </span>
    </div>
  );
}

/**
 * Hero
 * القسم الأول من الـ Portfolio. مسؤول فقط عن عرض بيانات heroData —
 * لا توجد أي بيانات ثابتة مكتوبة داخل الـ JSX هنا.
 */
function Hero() {
  const {
    intro,
    name,
    role,
    description,
    secondaryDescription,
    animatedPrefix,
    animatedTexts,
    contentTypes,
    stats,
    ctaButtons,
    profileImage,
  } = heroData;

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full px-6 sm:px-10 lg:px-20 py-24 flex items-center"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-10">
        {/* ---------------- Left Side ---------------- */}
        <motion.div
          className="order-2 flex flex-col gap-6 lg:order-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={item} className="text-sm tracking-[0.3em] text-text-secondary uppercase">
            {intro}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-4xl font-semibold leading-[1.1] text-accent sm:text-5xl lg:text-6xl"
          >
            {name}
            <span className="mt-2 block text-2xl font-medium text-text-primary sm:text-3xl">
              {role}
            </span>
          </motion.h1>

          <motion.div variants={item}>
            <TypewriterText prefix={animatedPrefix} words={animatedTexts} />
          </motion.div>

          <motion.p variants={item} className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {description}
          </motion.p>

          <motion.p variants={item} className="max-w-xl text-sm leading-relaxed text-text-secondary/80 sm:text-base">
            {secondaryDescription}
          </motion.p>

          {/* Content Types */}
          <motion.div variants={item} className="flex flex-wrap gap-2 pt-1">
            {contentTypes.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-bg-card px-3.5 py-1.5 text-xs text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="flex gap-10 pt-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-2xl font-semibold text-text-primary sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-text-secondary sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-4 pt-4">
            {ctaButtons.map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                className={
                  btn.variant === "primary"
                    ? "rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg-main transition-colors duration-200 hover:bg-accent-hover"
                    : "rounded-full border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent"
                }
              >
                {btn.label}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* ---------------- Right Side (Image) ---------------- */}
        <motion.div
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <div className="relative w-full max-w-[320px] sm:max-w-[380px]">
            {/* Soft glow */}
            <div className="absolute -inset-6 rounded-[2rem] bg-accent/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border shadow-2xl">
              <img
                src={profileImage}
                alt={name}
                className="aspect-[4/5] w-full object-cover"
              />
              {/* Subtle bottom gradient for cohesion with dark palette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-main/40 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
