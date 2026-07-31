import { motion } from "framer-motion";
import { FaTiktok, FaInstagram, FaYoutube, FaFacebookF, FaWhatsapp } from "react-icons/fa";

/**
 * Contact
 * قسم تواصل بسيط ومتناسق مع الـ Dark Theme + لون الـ Accent الذهبي.
 * يحمل id="contact" حتى تعمل روابط الـ Navbar وزر Let's Talk.
 */
function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-20 overflow-x-clip px-6 py-24 sm:px-10 sm:py-28 lg:px-20"
    >
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">
          Contact
        </p>

        <h2 className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
          Let's Work <span className="text-accent">Together</span>
        </h2>

        <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          Have a project in mind or want to collaborate on authentic UGC
          content? Feel free to reach out — I'd love to hear from you.
        </p>

        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          <a
            href="https://wa.me/201120146502"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-3xl border border-border bg-surface/70 px-5 py-4 text-sm font-medium text-text-primary transition duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
            <span className="text-[#25D366]">WhatsApp</span>
          </a>

          <a
            href="https://www.facebook.com/share/1849jDmxQv/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-3xl border border-border bg-surface/70 px-5 py-4 text-sm font-medium text-text-primary transition duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            <FaFacebookF className="h-5 w-5 text-[#1877F2]" />
            <span className="text-[#1877F2]">Facebook</span>
          </a>

          <a
            href="https://www.instagram.com/omarhany360?igsh=d21jbnlnZnd5bmhs&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-3xl border border-border bg-surface/70 px-5 py-4 text-sm font-medium text-[#FF7A18] transition duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            <FaInstagram className="h-5 w-5 text-[#FF7A18]" />
            <span className="text-[#FF7A18]">Instagram</span>
          </a>

          <a
            href="https://youtube.com/@7adotah.men.modarag?si=9bf6Q4utqOAcUdRN"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-3xl border border-border bg-surface/70 px-5 py-4 text-sm font-medium text-[#FF0000] transition duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent"
          >
            <FaYoutube className="h-5 w-5 text-[#FF0000]" />
            <span className="text-[#FF0000]">YouTube</span>
          </a>

          <a
            href="https://www.tiktok.com/@.7adotah.men.modarag?_r=1&_t=ZS-95Rg2rpVe9l"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-3xl border border-border bg-surface/70 px-5 py-4 text-sm font-medium text-[#A0A0A0] transition duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent xl:justify-self-center xl:col-span-2 xl:col-start-2"
          >
            <FaTiktok className="h-5 w-5 text-[#A0A0A0]" />
            <span className="text-[#A0A0A0]">TikTok</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
