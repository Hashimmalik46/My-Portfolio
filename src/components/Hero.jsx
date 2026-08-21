import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { portfolioData } from "../data/portfolioData";
import HeroChatbot from "./HeroChatbot";

/**
 * Apple Glass Interactive Button
 * Implements real-time cursor ray specular glint and visionOS frosted glass (both Light/Primary and Dark/Secondary)
 */
function AppleGlassButton({
  href,
  label,
  variant = "secondary",
  className = "",
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isPrimary = variant === "primary";

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const smoothX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  const radialBackground = useMotionTemplate`
    radial-gradient(
      140px circle at ${smoothX}px ${smoothY}px,
      ${isPrimary ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.2)"},
      transparent 70%
    )
  `;

  const borderLight = useMotionTemplate`
    radial-gradient(
      110px circle at ${smoothX}px ${smoothY}px,
      ${isPrimary ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.75)"},
      ${isPrimary ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.1)"} 40%,
      transparent 80%
    )
  `;

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(-500);
        mouseY.set(-500);
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`relative px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full ${isPrimary ? "text-black font-bold" : "text-white font-medium"
        } text-[11px] sm:text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden select-none whitespace-nowrap ${className}`}
      style={{
        background: isPrimary
          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(245, 245, 250, 0.84) 50%, rgba(235, 238, 248, 0.9) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.10) 40%, rgba(20, 20, 30, 0.42) 100%)",
        backdropFilter: "blur(20px) saturate(190%)",
        WebkitBackdropFilter: "blur(20px) saturate(190%)",
        boxShadow: isPrimary
          ? `
            0 20px 48px -10px rgba(0, 0, 0, 0.5),
            0 0 24px rgba(255, 255, 255, 0.35),
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 1),
            inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.15)
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
      {/* 1. Contrast Border */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none ${isPrimary ? "border border-white/60" : "border border-white/25"
          } -z-10`}
      />

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
        className={`absolute inset-0 rounded-full pointer-events-none z-0 transition-opacity duration-300 ${isPrimary ? "mix-blend-overlay" : "mix-blend-plus-lighter"
          }`}
        style={{
          opacity: isHovered ? 1 : 0,
          background: radialBackground,
        }}
      />

      {/* Button Text */}
      <span
        className={`relative z-10 ${isPrimary
            ? "drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
            : "drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          }`}
      >
        {label}
      </span>
    </motion.a>
  );
}

function Hero({ isLoading = false }) {
  const { hero } = portfolioData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={!isLoading ? "visible" : "hidden"}
      className="relative w-full flex-1 flex flex-col items-center justify-center text-center px-4 pt-40 sm:pt-16 md:pt-8 z-10 text-white select-none translate-x-0 sm:translate-x-4 md:translate-x-8 xl:translate-x-20"
    >
      <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
        {/* Main Editorial Headline */}
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-center xl:items-start leading-[0.9] tracking-tight"
        >
          <span className="font-cormorant italic font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-center xl:text-left">
            {hero.greeting}
          </span>
          <span className="font-clashM text-4xl sm:text-6xl md:text-8xl lg:text-9xl mt-2 sm:mt-4 whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] text-center xl:text-left">
            {hero.name}
          </span>
        </motion.div>

        {/* Subtitle & Tagline */}
        <motion.p
          variants={itemVariants}
          className="mt-4 sm:mt-7 font-jakarta text-sm sm:text-lg md:text-2xl font-light text-white/75 tracking-wide max-w-xl text-center xl:text-left"
        >
          {hero.tagline.prefix}{" "}
          <span className="font-cormorant italic text-white font-normal text-lg sm:text-2xl md:text-3xl">
            {hero.tagline.highlight1}
          </span>{" "}
          {hero.tagline.connector}{" "}
          <span className="font-cormorant italic text-white font-normal text-lg sm:text-2xl md:text-3xl">
            {hero.tagline.highlight2}
          </span>
          {hero.tagline.suffix}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 w-full flex items-center justify-center gap-3 sm:gap-4 font-jakarta z-20"
        >
          {/* Apple Glassmorphism Primary (White Glass) View Projects Button */}
          <AppleGlassButton
            href={hero.ctaButtons.primary.href}
            label={hero.ctaButtons.primary.label}
            variant="primary"
          />

          {/* Apple Glassmorphism Secondary (Dark Glass) Get In Touch Button */}
          <AppleGlassButton
            href={hero.ctaButtons.secondary.href}
            label={hero.ctaButtons.secondary.label}
            variant="secondary"
          />
        </motion.div>
      </div>

      {/* Floating AI Chatbot Icon & Speech Bubble (Right) */}
      <HeroChatbot />
    </motion.div>
  );
}

export default Hero;