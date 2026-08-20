import { useState, useEffect } from "react";
import { House, UserRound, Code2, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function Navbar({ isLoading = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hysteresis buffer
      if (currentScrollY > 300 && !isScrolled) {
        setIsScrolled(true);
      } else if (currentScrollY < 150 && isScrolled) {
        setIsScrolled(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      {/* 1. Full Top Navbar */}
      <nav
        className={`w-full flex items-center justify-between px-6 md:px-16 py-6 transition-all duration-300 ease-out ${
          isScrolled || isLoading
            ? "opacity-0 -translate-y-4 pointer-events-none invisible"
            : "opacity-100 translate-y-0 pointer-events-auto visible"
        }`}
      >
        {/* Logo */}
        <motion.a
          href="#Home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="font-khuma text-3xl font-bold text-white tracking-wide hover:opacity-80 transition-opacity"
        >
          Hash
        </motion.a>

        {/* Center Links (Apple Light Glass Pill) */}
        <div className="hidden md:flex items-center gap-6 font-poppins text-white/90 bg-white/[0.07] hover:bg-white/[0.1] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.3),inset_0_-1px_1px_0_rgba(0,0,0,0.2)] px-6 py-3 rounded-full transition-all duration-300">
          <motion.a
            href="#Home"
            whileHover={{ scale: 1.2, y: -1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-pAccent transition-colors duration-200"
          >
            <House size={20} strokeWidth={1.8} />
          </motion.a>
          <motion.a
            href="#About"
            whileHover={{ scale: 1.2, y: -1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-pAccent transition-colors duration-200"
          >
            <UserRound size={20} strokeWidth={1.8} />
          </motion.a>
          <motion.a
            href="#Projects"
            whileHover={{ scale: 1.2, y: -1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-pAccent transition-colors duration-200"
          >
            <Code2 size={20} strokeWidth={1.8} />
          </motion.a>
          <motion.a
            href="#Contact"
            whileHover={{ scale: 1.2, y: -1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-pAccent transition-colors duration-200"
          >
            <Send size={20} strokeWidth={1.8} />
          </motion.a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <motion.a
            href="https://github.com/Hashimmalik46"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transition-colors duration-200"
          >
            <img
              src="/gallery/github.webp"
              alt="GitHub"
              className="w-5 h-5 object-contain brightness-0 invert opacity-90"
            />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/hashim-malik-a868102b0/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transition-colors duration-200"
          >
            <img
              src="/gallery/linkedin.webp"
              alt="LinkedIn"
              className="w-5 h-5 object-contain brightness-0 invert opacity-90"
            />
          </motion.a>
        </div>
      </nav>

      {/* 2. Floating Pill Navbar (Apple Dark Glass Pill) */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2">
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="pointer-events-auto"
            >
              <div className="flex items-center bg-[#121214]/65 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/[0.18] shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.25),inset_0_-1px_1px_0_rgba(0,0,0,0.4)] rounded-full p-2 gap-3">
                {/* Pill Logo */}
                <motion.a
                  href="#Home"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="font-khuma text-xl font-bold text-white tracking-wide pl-3 hover:text-pAccent transition-colors"
                >
                  Hash
                </motion.a>

                {/* Expandable Navigation Links with Smooth Fluid Collapse */}
                <motion.div
                  initial={false}
                  animate={{
                    width: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="flex items-center overflow-hidden"
                >
                  <div className="flex items-center gap-4 pl-3 pr-1 py-1 border-l border-white/15 whitespace-nowrap">
                    <motion.a
                      href="#Home"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsExpanded(false)}
                      className="text-white/80 hover:text-pAccent transition-colors"
                    >
                      <House size={18} strokeWidth={1.8} />
                    </motion.a>
                    <motion.a
                      href="#About"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsExpanded(false)}
                      className="text-white/80 hover:text-pAccent transition-colors"
                    >
                      <UserRound size={18} strokeWidth={1.8} />
                    </motion.a>
                    <motion.a
                      href="#Projects"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsExpanded(false)}
                      className="text-white/80 hover:text-pAccent transition-colors"
                    >
                      <Code2 size={18} strokeWidth={1.8} />
                    </motion.a>
                    <motion.a
                      href="#Contact"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsExpanded(false)}
                      className="text-white/80 hover:text-pAccent transition-colors"
                    >
                      <Send size={18} strokeWidth={1.8} />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Toggle Button */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label="Toggle navigation"
                  className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <motion.span
                    animate={{
                      rotate: isExpanded ? 45 : 0,
                      y: isExpanded ? 3 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-3.5 h-0.5 bg-white rounded-full origin-center"
                  />
                  <motion.span
                    animate={{
                      rotate: isExpanded ? -45 : 0,
                      y: isExpanded ? -3 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-3.5 h-0.5 bg-white rounded-full origin-center"
                  />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;