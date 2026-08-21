import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Sparkles,
  Wrench,
  FileText,
  Bot,
  Copy,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { portfolioData } from "../data/portfolioData";
import ResumeModal from "./ResumeModal";

/**
 * Apple Glass Interactive Surface
 * Provides dynamic specular ray tracing, cursor-following light glint,
 * and realistic optical glass beveling inspired by macOS & visionOS.
 */
function DynamicGlassContainer({
  children,
  className = "",
  isFloating = false,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse coordinates for specular reflection
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const smoothX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  // Specular surface sheen
  const radialBackground = useMotionTemplate`
    radial-gradient(
      180px circle at ${smoothX}px ${smoothY}px,
      rgba(255, 255, 255, 0.16),
      transparent 70%
    )
  `;

  // Razor-sharp border light glint
  const borderLight = useMotionTemplate`
    radial-gradient(
      130px circle at ${smoothX}px ${smoothY}px,
      rgba(255, 255, 255, 0.65),
      rgba(255, 255, 255, 0.1) 40%,
      transparent 80%
    )
  `;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(-500);
    mouseY.set(-500);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative isolate rounded-full transition-all duration-300 transform-gpu ${className}`}
      style={{
        background: isFloating
          ? "radial-gradient(ellipse 95% 85% at 50% 50%, rgba(24, 28, 40, 0.60) 35%, rgba(42, 48, 64, 0.48) 75%, rgba(255, 255, 255, 0.22) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.10) 40%, rgba(20, 20, 30, 0.42) 100%)",
        backdropFilter: "blur(28px) saturate(210%) brightness(105%)",
        WebkitBackdropFilter: "blur(28px) saturate(210%) brightness(105%)",
        boxShadow: isFloating
          ? `
            0 24px 48px -10px rgba(0, 0, 0, 0.6),
            0 8px 20px -4px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.28),
            inset 0 0 18px 2px rgba(255, 255, 255, 0.22),
            inset 0 1.2px 1px 0 rgba(255, 255, 255, 0.65),
            inset 0 -1.2px 1px 0 rgba(255, 255, 255, 0.45)
          `
          : `
            0 16px 36px -8px rgba(0, 0, 0, 0.45),
            0 4px 12px -2px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.12),
            inset 0 1.2px 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 2px 0 rgba(0, 0, 0, 0.25)
          `,
      }}
    >
      {/* 1. Dual-tone Contrast Border (Crisp white specular top & dark ambient bottom) */}
      <div className="absolute inset-0 rounded-full pointer-events-none border border-white/30 -z-10 shadow-[inset_0_0_14px_rgba(255,255,255,0.15)]" />

      {/* 2. Dynamic Cursor-Follow Specular Border Glint */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none p-[1px] z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: borderLight,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* 3. Dynamic Cursor-Follow Surface Specular Sheen */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none z-0 transition-opacity duration-300 mix-blend-plus-lighter"
        style={{
          opacity: isHovered ? 1 : 0,
          background: radialBackground,
        }}
      />

      {/* Content */}
      <div className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{children}</div>
    </div>
  );
}

function Navbar({ isLoading = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [floatingHoveredIndex, setFloatingHoveredIndex] = useState(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isToolsHovered, setIsToolsHovered] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const toolsRef = useRef(null);
  const { nav, socials, personal } = portfolioData;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hysteresis buffer for smooth transitions
      if (currentScrollY > 260 && !isScrolled) {
        setIsScrolled(true);
      } else if (currentScrollY < 140 && isScrolled) {
        setIsScrolled(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Click outside listener for tools menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setIsToolsOpen(false);
      }
    };
    if (isToolsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isToolsOpen]);

  const handleCopyEmail = () => {
    if (personal?.email) {
      navigator.clipboard.writeText(personal.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 pointer-events-none isolate transform-gpu"
        style={{
          WebkitTransform: "translate3d(0, 0, 0)",
          transform: "translate3d(0, 0, 0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        {/* 1. Full Top Navbar (Hero State - Original 3-column Layout) */}
        <nav
          className={`w-full flex items-center justify-between px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 pt-8 sm:pt-10 xl:pt-11 pb-6 transition-all duration-400 ease-out pointer-events-none ${
            isScrolled || isLoading
              ? "opacity-0 -translate-y-6 invisible"
              : "opacity-100 translate-y-0 visible"
          }`}
        >
          {/* Logo */}
          <motion.a
            href="#Home"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-khuma text-3xl font-bold text-white tracking-wide hover:opacity-80 transition-opacity pointer-events-auto"
          >
            {nav.logoText}
          </motion.a>

          {/* Center Links (Locked to exact horizontal center) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-auto">
            <DynamicGlassContainer className="p-1.5 px-3">
              <div className="flex items-center gap-1.5 font-poppins text-white/90">
                {nav.navLinks.map((link, idx) => {
                  const IconComp = link.icon;
                  const isItemHovered = hoveredIndex === idx;

                  return (
                    <motion.a
                      key={link.id}
                      href={link.href}
                      aria-label={link.label}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      whileHover={{ scale: 1.15, y: -1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative isolate flex items-center justify-center w-8 h-8 rounded-full text-white/80 hover:text-white transition-colors duration-200"
                    >
                      {/* Apple VisionOS / macOS Dock Sliding Glass Capsule */}
                      {isItemHovered && (
                        <motion.div
                          layoutId="topNavPillHover"
                          className="absolute inset-0 rounded-full bg-white/[0.18] border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 480,
                            damping: 30,
                          }}
                        />
                      )}
                      <IconComp size={17} strokeWidth={1.8} />

                      {/* Floating Micro-Tooltip */}
                      <AnimatePresence>
                        {isItemHovered && (
                          <motion.span
                            initial={{ opacity: 0, y: 8, scale: 0.85 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.85 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-11 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white bg-[#101014]/90 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.6)] pointer-events-none whitespace-nowrap"
                          >
                            {link.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.a>
                  );
                })}
              </div>
            </DynamicGlassContainer>
          </div>

        {/* Right Navigation Controls (Mobile: GitHub + LinkedIn + Tools | Desktop: Tools) */}
        <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
          {/* Mobile & Tablet Social Icons (GitHub & LinkedIn) */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-2.5">
            {socials.github && (
              <motion.a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.12] hover:bg-white/[0.22] backdrop-blur-xl border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.45)] flex items-center justify-center transition-all duration-200"
              >
                <img
                  src="/gallery/github.webp"
                  alt="GitHub"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain brightness-0 invert opacity-90"
                />
              </motion.a>
            )}
            {socials.linkedin && (
              <motion.a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.12] hover:bg-white/[0.22] backdrop-blur-xl border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.45)] flex items-center justify-center transition-all duration-200"
              >
                <img
                  src="/gallery/linkedin.webp"
                  alt="LinkedIn"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain brightness-0 invert opacity-90"
                />
              </motion.a>
            )}
          </div>

            {/* Tools Menu with Responsive Apple Glass Popover (Accessible on all screen sizes) */}
            <div ref={toolsRef} className="relative flex items-center justify-end">
              <motion.button
                type="button"
                onClick={() => {
                  setIsToolsOpen((prev) => !prev);
                  setIsToolsHovered(false);
                }}
                onMouseEnter={() => setIsToolsHovered(true)}
                onMouseLeave={() => setIsToolsHovered(false)}
                aria-label="Developer Tools"
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.92 }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-xl border shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.45)] flex items-center justify-center transition-all duration-200 select-none cursor-pointer group ${
                  isToolsOpen
                    ? "bg-white/[0.22] border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.25)] text-white"
                    : "bg-white/[0.12] hover:bg-white/[0.22] border-white/25 hover:border-white/40 text-white/85 hover:text-white"
                }`}
              >
                <Wrench
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                    isToolsOpen ? "rotate-45 text-white" : "group-hover:rotate-45"
                  }`}
                />

                {/* Floating Micro-Tooltip (Desktop Hover) */}
                <AnimatePresence>
                  {isToolsHovered && !isToolsOpen && (
                    <motion.span
                      initial={{ opacity: 0, y: 8, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.85 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-12 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white bg-[#101014]/90 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.6)] pointer-events-none whitespace-nowrap hidden sm:block"
                    >
                      Tools
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Minimalist Apple Glass Tools Dropdown (Smooth Cascading Pills) */}
              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: -6,
                        scale: 0.94,
                        transition: {
                          duration: 0.15,
                          ease: [0.32, 0.72, 0, 1],
                          staggerChildren: 0.04,
                          staggerDirection: -1,
                        },
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 420,
                          damping: 26,
                          mass: 0.6,
                          staggerChildren: 0.06,
                          delayChildren: 0.02,
                        },
                      },
                      exit: {
                        opacity: 0,
                        y: -6,
                        scale: 0.94,
                        transition: {
                          duration: 0.14,
                          ease: [0.32, 0.72, 0, 1],
                          staggerChildren: 0.03,
                          staggerDirection: -1,
                        },
                      },
                    }}
                    className="absolute right-0 top-full mt-2.5 flex flex-col gap-1.5 z-50 select-none items-end origin-top-right transform-gpu"
                  >
                    {/* Item 1: Resume Pill */}
                    <motion.button
                      type="button"
                      onClick={() => {
                        setIsResumeOpen(true);
                        setIsToolsOpen(false);
                      }}
                      variants={{
                        hidden: { opacity: 0, y: -12, scale: 0.88, filter: "blur(4px)" },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 24,
                            mass: 0.5,
                          },
                        },
                        exit: {
                          opacity: 0,
                          y: -8,
                          scale: 0.9,
                          filter: "blur(2px)",
                          transition: { duration: 0.12, ease: "easeOut" },
                        },
                      }}
                      whileHover={{ scale: 1.04, x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Resume Generator"
                      className="group flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-[#12141c]/90 hover:bg-[#181a24]/95 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/25 hover:border-white/40 shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.4)] text-white cursor-pointer whitespace-nowrap transition-colors duration-150"
                    >
                      <div className="w-5 h-5 rounded-full bg-pAccent/20 flex items-center justify-center text-pAccent shrink-0">
                        <FileText className="w-3 h-3 text-pAccent" />
                      </div>
                      <span className="text-xs font-medium text-white/90 group-hover:text-white font-jakarta">
                        Resume
                      </span>
                    </motion.button>

                    {/* Item 2: Copy Email Pill */}
                    <motion.button
                      type="button"
                      onClick={handleCopyEmail}
                      variants={{
                        hidden: { opacity: 0, y: -12, scale: 0.88, filter: "blur(4px)" },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 24,
                            mass: 0.5,
                          },
                        },
                        exit: {
                          opacity: 0,
                          y: -8,
                          scale: 0.9,
                          filter: "blur(2px)",
                          transition: { duration: 0.12, ease: "easeOut" },
                        },
                      }}
                      whileHover={{ scale: 1.04, x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Copy Email"
                      className={`group flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-full backdrop-blur-2xl backdrop-saturate-[180%] border cursor-pointer whitespace-nowrap transition-colors duration-150 ${
                        copiedEmail
                          ? "bg-emerald-950/85 border-emerald-400/50 shadow-[0_8px_24px_rgba(52,211,153,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.4)] text-emerald-300"
                          : "bg-[#12141c]/90 hover:bg-[#181a24]/95 border-white/25 hover:border-white/40 shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.4)] text-white"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          copiedEmail
                            ? "bg-emerald-500/30"
                            : "bg-white/15 group-hover:bg-white/25"
                        }`}
                      >
                        {copiedEmail ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-white/90" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium font-jakarta ${
                          copiedEmail
                            ? "text-emerald-400 font-semibold"
                            : "text-white/90 group-hover:text-white"
                        }`}
                      >
                        {copiedEmail ? "Copied!" : "Copy Email"}
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

      {/* 2. Floating Pill Navbar (Authentic Apple Glass Pill on Scroll) */}
      <div className="fixed top-6 inset-x-0 w-full flex justify-center z-50 pointer-events-none px-4 isolate transform-gpu">
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.88, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -25, scale: 0.9, filter: "blur(6px)" }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 28,
                mass: 0.8,
              }}
              className="pointer-events-auto max-w-full"
            >
              <DynamicGlassContainer
                isFloating={true}
                className="p-1.5 transition-transform duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2">
                  {/* Pill Logo */}
                  <motion.a
                    href="#Home"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="font-khuma text-xl font-bold text-white tracking-wide pl-3.5 pr-1.5 py-1 hover:text-pAccent transition-colors flex items-center gap-1.5 group select-none"
                  >
                    <span>{nav.logoText}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-pulse opacity-80" />
                  </motion.a>

                  {/* Expandable Navigation Links with Fluid Glass Dock Effect */}
                  <motion.div
                    initial={false}
                    animate={{
                      width: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                    className="flex items-center overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 pl-3 pr-2 py-0.5 border-l border-white/20 whitespace-nowrap">
                      {nav.navLinks.map((link, idx) => {
                        const IconComp = link.icon;
                        const isLinkHovered = floatingHoveredIndex === idx;

                        return (
                          <motion.a
                            key={link.id}
                            href={link.href}
                            aria-label={link.label}
                            onMouseEnter={() => setFloatingHoveredIndex(idx)}
                            onMouseLeave={() => setFloatingHoveredIndex(null)}
                            whileHover={{ scale: 1.15, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsExpanded(false)}
                            className="relative isolate flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.12] hover:bg-white/[0.22] backdrop-blur-xl border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.45)] text-white hover:text-pAccent transition-all group"
                          >
                            {/* Glass Dock Hover Capsule */}
                            {isLinkHovered && (
                              <motion.div
                                layoutId="floatingPillHover"
                                className="absolute inset-0 rounded-full bg-white/[0.22] border border-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md -z-10"
                                transition={{
                                  type: "spring",
                                  stiffness: 480,
                                  damping: 30,
                                }}
                              />
                            )}

                            <IconComp size={17} strokeWidth={1.8} />

                            {/* Floating Micro-Tooltip */}
                            <AnimatePresence>
                              {isLinkHovered && (
                                <motion.span
                                  initial={{ opacity: 0, y: 8, scale: 0.85 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 5, scale: 0.85 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-11 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white bg-[#101014]/90 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.6)] pointer-events-none whitespace-nowrap"
                                >
                                  {link.label}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.a>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Tactile Apple Glass Toggle Button */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label="Toggle navigation"
                    className="relative w-8 h-8 rounded-full bg-white/[0.12] hover:bg-white/[0.22] backdrop-blur-xl border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.45)] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer overflow-hidden group"
                  >
                    {/* Subtle button specular shine */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <motion.span
                      animate={{
                        rotate: isExpanded ? 45 : 0,
                        y: isExpanded ? 3 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 26,
                      }}
                      className="w-3.5 h-[1.5px] bg-white rounded-full origin-center transition-colors group-hover:bg-pAccent"
                    />
                    <motion.span
                      animate={{
                        rotate: isExpanded ? -45 : 0,
                        y: isExpanded ? -3 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 26,
                      }}
                      className="w-3.5 h-[1.5px] bg-white rounded-full origin-center transition-colors group-hover:bg-pAccent"
                    />
                  </motion.button>
                </div>
              </DynamicGlassContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>

    {/* ATS Resume Generation Modal */}
    <ResumeModal
      isOpen={isResumeOpen}
      onClose={() => setIsResumeOpen(false)}
    />
  </>
  );
}

export default Navbar;