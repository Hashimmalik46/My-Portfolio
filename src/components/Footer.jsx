import { useState } from "react";
import { ArrowUp, Github, Linkedin, Mail, Sparkles, Disc3, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { portfolioData } from "../data/portfolioData";

function Footer() {
  const { footer, socials, personal, hero } = portfolioData;

  const [audioMode, setAudioMode] = useState(() => {
    return localStorage.getItem("portfolio_audio_mode") || hero?.audioWidgetType || "simple";
  });
  const [toastMsg, setToastMsg] = useState("");

  const toggleAudioMode = () => {
    const nextMode = audioMode === "simple" ? "player" : "simple";
    setAudioMode(nextMode);
    localStorage.setItem("portfolio_audio_mode", nextMode);
    window.dispatchEvent(new Event("portfolio_audio_mode_changed"));
    setToastMsg(nextMode === "player" ? "🎵 Vinyl Player Active" : "🔊 Simple Ambient Active");
    setTimeout(() => setToastMsg(""), 2200);
  };

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.85 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        {/* Left: Brand, Hidden Audio Mode Switcher & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left relative">
          <button
            type="button"
            onClick={toggleAudioMode}
            className="flex items-center gap-2 cursor-pointer group select-none text-left focus:outline-none"
            title={`Audio Mode: ${audioMode === "player" ? "Vinyl Playlist Player" : "Simple Ambient Mute"} (Click to switch)`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                audioMode === "player" ? "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.9)]" : "bg-pAccent shadow-[0_0_8px_rgba(168,218,34,0.8)]"
              } animate-pulse group-hover:scale-125 transition-transform shrink-0`}
            />
            <span className="font-khuma text-xl font-bold tracking-wider text-white group-hover:text-pAccent transition-colors">
              {footer.brandName}
            </span>
          </button>

          {/* Secret Mode Toast */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-9 left-0 px-2.5 py-1 rounded-md bg-black/90 border border-white/20 text-[10.5px] font-semibold text-white shadow-xl pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5"
              >
                <span>{toastMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

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

        {/* Right: All Tools & Back to Top */}
        <div className="flex items-center gap-3">
          {/* All Tools Button */}
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/tools"
              className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] backdrop-blur-xl border border-white/15 hover:border-pAccent/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.25)] text-xs font-semibold text-white/80 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-pAccent group-hover:scale-110 transition-transform" />
              <span>All Tools</span>
            </Link>
          </motion.div>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/10 hover:border-white/25 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;