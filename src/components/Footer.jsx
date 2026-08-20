import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "motion/react";
import { portfolioData } from "../data/portfolioData";

function Footer() {
  const { footer, socials, personal } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full bg-[#121214]/65 backdrop-blur-2xl backdrop-saturate-[180%] border-t border-white/15 px-6 md:px-16 py-8 text-white z-10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)]"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-jakarta">
        {/* Left: Brand, Indicator & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-pulse" />
            <span className="font-khuma text-xl font-bold tracking-wider text-white">
              {footer.brandName}
            </span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <p className="text-xs sm:text-sm text-white/50">
            &copy; {new Date().getFullYear()} {footer.copyrightText}
          </p>
        </div>

        {/* Center: Apple-Style Translucent Social Tiles */}
        <div className="flex items-center gap-3">
          {socials.github && (
            <motion.a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl border border-white/10 hover:border-white/25 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]"
            >
              <Github className="w-4 h-4" />
            </motion.a>
          )}
          {socials.linkedin && (
            <motion.a
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl border border-white/10 hover:border-white/25 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]"
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>
          )}
          {personal.email && (
            <motion.a
              href={`mailto:${personal.email}`}
              aria-label="Email"
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl border border-white/10 hover:border-white/25 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)]"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          )}
        </div>

        {/* Right: Specular Glass Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/10 hover:border-white/25 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300 cursor-pointer"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      </div>
    </motion.footer>
  );
}

export default Footer;