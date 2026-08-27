import { useState, useRef } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Sparkles,
  Layers,
  FileText,
  QrCode,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { Link } from "react-router-dom";
import { portfolioData } from "../data/portfolioData";

/**
 * BigInteractiveName
 * Renders giant display typography with stroked outline by default.
 * Moving the cursor reveals radiant colored & illuminated fill *only*
 * within the spotlight radius over the hover area.
 */
function BigInteractiveName({ name = "Hashim" }) {
  const textRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinates relative to the interactive text element
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Ultra-smooth, relaxed springs for luxurious slow liquid movement
  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 20, mass: 1.5 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 20, mass: 1.5 });

  // Tighter, focused radial mask template (180px radius) following cursor smoothly
  const maskImage = useMotionTemplate`radial-gradient(circle 180px at ${smoothX}px ${smoothY}px, black 0%, rgba(0,0,0,0.8) 50%, transparent 100%)`;

  const handleMouseMove = (e) => {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="relative w-full overflow-hidden select-none pt-4 sm:pt-6 md:pt-8 pb-0 flex items-center justify-center">
      {/* Interactive Text Wrapper - Only triggers when cursor is directly over the text */}
      <div
        ref={textRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-block text-center cursor-default px-1 sm:px-3"
      >
        {/* 1. Base Layer: Single Crisp Stroked Outline in Clash Display */}
        <h1
          className="font-clash font-bold leading-none tracking-normal text-[22vw] sm:text-[21.5vw] md:text-[21vw] lg:text-[20.5vw] select-none transition-all duration-300 pointer-events-auto"
          style={{
            color: "#000000",
            WebkitTextStroke: "2.2px rgba(255, 255, 255, 0.2)",
            paintOrder: "stroke fill",
          }}
        >
          {name}
        </h1>

        {/* 2. Top Spotlight Layer: Ultra-Slow, Cinematic 2.8s Fill/Unfill Transitions */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center text-center w-full"
          style={{
            maskImage: maskImage,
            WebkitMaskImage: maskImage,
          }}
        >
          <h1
            className="font-clash font-bold leading-none tracking-normal text-[22vw] sm:text-[21.5vw] md:text-[21vw] lg:text-[20.5vw] text-pAccent select-none"
          >
            {name}
          </h1>
        </motion.div>
      </div>
    </div>
  );
}

function Footer() {
  const { footer, socials, personal, workstation, hero } = portfolioData;

  // Audio Mode Easter Egg state
  const [audioMode, setAudioMode] = useState(() => {
    return (
      localStorage.getItem("portfolio_audio_mode") ||
      hero?.audioWidgetType ||
      "simple"
    );
  });
  const [toastMsg, setToastMsg] = useState("");

  const toggleAudioMode = () => {
    const nextMode = audioMode === "simple" ? "player" : "simple";
    setAudioMode(nextMode);
    localStorage.setItem("portfolio_audio_mode", nextMode);
    window.dispatchEvent(new Event("portfolio_audio_mode_changed"));
    setToastMsg(
      nextMode === "player" ? "🎵 Vinyl Player Active" : "🔊 Simple Ambient Active"
    );
    setTimeout(() => setToastMsg(""), 2200);
  };

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.95 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Home", href: "#Home" },
    { label: "About", href: "#About" },
    { label: "Projects", href: "#Projects" },
    { label: "Workstation", href: "#Workstation" },
    { label: "Contact", href: "#Contact" },
  ];

  const toolsList = workstation?.tools || [
    { name: "ATS Resume Studio", route: "/tools/resume-builder", icon: FileText },
    { name: "Outreach Studio", route: "/tools/outreach-generator", icon: Send },
    { name: "Image & PDF Studio", route: "/tools/media-converter", icon: Layers },
    { name: "Smart QR Studio", route: "/tools/qr-studio", icon: QrCode },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      url: socials.github,
      icon: FaGithub,
      hoverClass: "hover:border-white/40 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]",
    },
    {
      name: "LinkedIn",
      url: socials.linkedin,
      icon: FaLinkedinIn,
      hoverClass: "hover:border-[#0077b5]/60 hover:text-[#0077b5] hover:shadow-[0_0_20px_rgba(0,119,181,0.3)]",
    },
    {
      name: "Instagram",
      url: socials.instagram,
      icon: FaInstagram,
      hoverClass: "hover:border-[#E1306C]/60 hover:text-[#E1306C] hover:shadow-[0_0_20px_rgba(225,48,108,0.3)]",
    },
    {
      name: "X (Twitter)",
      url: socials.twitter,
      icon: FaXTwitter,
      hoverClass: "hover:border-white/40 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]",
    },
  ].filter((item) => !!item.url);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full bg-black text-white border-t border-white/10 overflow-hidden isolate"
    >

      {/* ========================================================================= */}
      {/* 1. TOP SECTION: GIANT STROKED 'HASHIM' (HIDDEN ON PHONE LAYOUT) */}
      {/* ========================================================================= */}
      <div className="w-full relative hidden md:block">
        <BigInteractiveName name={personal?.shortName || "Hashim"} />
      </div>

      {/* ========================================================================= */}
      {/* 2. MIDDLE SECTION: MULTI-COLUMN STRUCTURE */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-20 sm:pt-24 md:pt-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* ------------------------------------------------------------- */}
          {/* COLUMN 1: Hash Logo & Social Profiles */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Hash Brand & Mode Switcher */}
            <div className="flex items-center gap-3 relative">
              <button
                type="button"
                onClick={toggleAudioMode}
                className="flex items-center gap-3 cursor-pointer group select-none text-left focus:outline-none"
                title={`Audio Mode: ${
                  audioMode === "player"
                    ? "Vinyl Playlist Player"
                    : "Simple Ambient Mute"
                } (Click to switch)`}
              >
                <span
                  className={`w-3 h-3 rounded-full ${
                    audioMode === "player"
                      ? "bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,1)]"
                      : "bg-pAccent shadow-[0_0_12px_rgba(168,218,34,0.9)]"
                  } animate-pulse group-hover:scale-125 transition-transform shrink-0`}
                />
                <span className="font-khuma text-3xl font-bold tracking-wider text-white group-hover:text-pAccent transition-colors">
                  {footer?.brandName || "Hash"}
                </span>
              </button>

              {/* Secret Audio Mode Toast Notification */}
              <AnimatePresence>
                {toastMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-10 left-0 px-3 py-1 rounded-lg bg-black/90 border border-white/20 text-xs font-semibold text-white shadow-2xl pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5 backdrop-blur-xl"
                  >
                    <span>{toastMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Social Media Glass Cards */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((item) => {
                const IconComp = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    whileHover={{ y: -3, scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 transition-all duration-300 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] ${item.hoverClass}`}
                    title={item.name}
                  >
                    <IconComp className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* COLUMN 2: Quick Links (Navigation) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col gap-4">
            <h3 className="font-jakarta text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2.5 font-jakarta text-sm">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-white/70 hover:text-pAccent hover:translate-x-1 inline-flex items-center gap-1 transition-all duration-200"
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* COLUMN 3: Workstation Tools & Studios */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-3 sm:col-span-1 flex flex-col gap-4">
            <h3 className="font-jakarta text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
              Digital Tools
            </h3>
            <ul className="flex flex-col gap-2.5 font-jakarta text-sm">
              {toolsList.map((tool) => (
                <li key={tool.name}>
                  <Link
                    to={tool.route}
                    className="text-white/70 hover:text-pAccent hover:translate-x-1 inline-flex items-center transition-all duration-200"
                  >
                    <span>{tool.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/tools"
                  className="inline-flex items-center gap-1 text-xs font-medium text-white/60 hover:text-white transition-colors duration-200"
                >
                  <span>View All Tools</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* COLUMN 4: Get in Touch */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="font-jakarta text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-2.5 font-jakarta text-sm">
              <li>
                <a
                  href={`mailto:${personal?.email || "hashimzahoor2003@gmail.com"}`}
                  className="text-white/70 hover:text-pAccent hover:translate-x-1 inline-flex items-center transition-all duration-200"
                >
                  <span>{personal?.email || "hashimzahoor2003@gmail.com"}</span>
                </a>
              </li>
              <li className="text-white/60">
                <span>{personal?.location || "Srinagar, Kashmir"}</span>
              </li>
              <li className="text-white/60 pt-0.5">
                <span>Open for: Full-Stack & AI Roles</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM BAR (SUB-FOOTER): COPYRIGHT, TECH NOTE & BACK TO TOP */}
      {/* ========================================================================= */}
      <div className="w-full border-t border-white/[0.08] bg-black/40 backdrop-blur-xl py-6 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-jakarta text-white/50">
          {/* Copyright */}
          <div>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white/80 font-medium">
              {personal?.name || "Hashim Malik"}
            </span>
            . All rights reserved.
          </div>

          {/* Magnetic Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] backdrop-blur-xl border border-white/10 hover:border-pAccent/40 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)] text-xs font-medium text-white/70 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-pAccent group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;