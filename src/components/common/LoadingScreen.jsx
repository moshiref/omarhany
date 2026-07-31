import { motion } from "framer-motion";

/**
 * LoadingScreen
 * شاشة تحميل بسيطة وPremium تظهر لمدة قصيرة (~1.2s) قبل ظهور الـ Hero،
 * ثم تختفي بـ Fade Out ناعم.
 */
function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-main"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center gap-3">
        <motion.h1
          className="font-display text-2xl sm:text-3xl font-semibold tracking-[0.25em] text-text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          OMAR HANY
        </motion.h1>
        <motion.p
          className="text-xs sm:text-sm tracking-[0.4em] text-text-secondary uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          Content Creator
        </motion.p>

        {/* Loading line */}
        <div className="mt-8 h-[2px] w-32 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full w-full bg-accent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
