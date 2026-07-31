import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar
 * شريط تنقّل ثابت (Fixed) متناسق مع ألوان الموقع الداكنة + لمسة الـ Accent الذهبية.
 * متجاوب بالكامل:
 *  - موبايل/تابلت (< lg): زر هامبرغر يفتح قائمة منسدلة بحركة ناعمة.
 *  - كمبيوتر (>= lg): روابط أفقية ثابتة.
 * لا يغيّر أي شيء في باقي الموقع — يُضاف فقط فوق المحتوى الحالي.
 */
const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // إضافة خلفية معتمة + Blur عند النزول بالصفحة
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // قفل سكرول الصفحة عند فتح قائمة الموبايل
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  /**
   * التنقل اليدوي — يضمن عمل الروابط على الموبايل:
   * 1. يغلق القائمة ويلغي Scroll Lock فورًا.
   * 2. ينتظر إطارًا واحدًا حتى يستعيد الـ body الـ scroll.
   * 3. ينفّذ Smooth Scroll إلى الـ Section المطلوب.
   */
  const handleNavClick = (e, href) => {
    e.preventDefault();
    closeMenu();
    const target = document.querySelector(href);
    if (!target) return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "border-b border-border/60 bg-bg-main/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:h-[72px] sm:px-10 lg:px-20">
        {/* ---------- Logo ---------- */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="font-display text-lg font-semibold tracking-wide text-text-primary transition-colors duration-200 hover:text-accent"
        >
          Omar<span className="text-accent">.</span>Hany
        </a>

        {/* ---------- Desktop Links ---------- */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group relative text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
              >
                {link.label}
                {/* خط سفلي ذهبي يظهر عند الـ Hover */}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="rounded-full border border-accent/60 px-5 py-2 text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-bg-main"
            >
              Let's Talk
            </a>
          </li>
        </ul>

        {/* ---------- Mobile / Tablet Hamburger ---------- */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg-card/60 text-text-primary transition-colors duration-200 hover:border-accent/50 lg:hidden"
        >
          <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 top-0 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 rounded bg-current transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                isOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* ---------- Mobile / Tablet Menu ---------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden border-b border-border/60 bg-bg-main/95 backdrop-blur-md lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4 sm:px-10">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-text-secondary transition-colors duration-200 hover:bg-bg-card hover:text-accent"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * NAV_LINKS.length, duration: 0.25 }}
                className="pt-2"
              >
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="block rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-bg-main transition-colors duration-200 hover:bg-accent-hover"
                >
                  Let's Talk
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
