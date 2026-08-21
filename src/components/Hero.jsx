import { useRef, useState, useEffect } from "react";
import { Sparkles, Globe, Volume2, VolumeX } from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { portfolioData } from "../data/portfolioData";
import HeroChatbot from "./HeroChatbot";

/**
 * Typewriter headline effect with smooth blinking cursor
 */
function TypewriterText({
  text,
  isLoading,
  speed = 70,
  delay = 200,
  showCursor = true,
  cursorClassName = "w-[2.5px] sm:w-[4px] md:w-[6px] h-[0.72em]",
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setDisplayedText("");
      setIsDone(false);
      return;
    }

    let timeoutId;
    let currentIndex = 0;

    const startTyping = () => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayedText(text.slice(0, currentIndex));
          timeoutId = setTimeout(typeNextChar, speed + (Math.random() * 20 - 10));
        } else {
          setIsDone(true);
        }
      };
      typeNextChar();
    };

    const initialDelayId = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(initialDelayId);
      clearTimeout(timeoutId);
    };
  }, [text, isLoading, speed, delay]);

  return (
    <span className="inline-flex items-baseline">
      <span>{displayedText}</span>
      {showCursor && (
        <motion.span
          animate={{ opacity: isDone ? [1, 0] : [1, 0, 1] }}
          transition={{
            repeat: isDone ? 5 : Infinity,
            duration: 0.75,
            ease: "easeInOut",
          }}
          className={`inline-block ${cursorClassName} bg-white ml-1.5 sm:ml-2.5 rounded-full shadow-[0_0_14px_rgba(255,255,255,0.9)] self-center`}
        />
      )}
    </span>
  );
}

/**
 * Live Time, Location & Quick Socials Dock with Ambient Audio Controller
 */
function TopRightStatusDock({
  location = "Srinagar, Kashmir",
  socials = {},
  audioSrc = "/audio/ambient.mp3",
}) {
  const [timeStr, setTimeStr] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) {
      const audio = new Audio(audioSrc || "/audio/ambient.mp3");
      audio.loop = true;
      audio.volume = 0.45;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Ambient audio notice (audio file not yet placed):", err);
            setIsPlaying((prev) => !prev);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const socialLinks = [
    { id: "github", label: "GitHub", href: socials.github, icon: FaGithub },
    { id: "linkedin", label: "LinkedIn", href: socials.linkedin, icon: FaLinkedinIn },
    { id: "twitter", label: "X / Twitter", href: socials.twitter, icon: FaXTwitter },
    { id: "instagram", label: "Instagram", href: socials.instagram, icon: FaInstagram },
  ].filter((item) => Boolean(item.href));

  return (
    <div className="flex flex-col gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 hover:border-white/35 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all group select-none font-jakarta min-w-[220px]">
      {/* Top Header: Location & Live Clock */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-white/70 shrink-0" strokeWidth={1.8} />
          <span className="text-xs font-medium text-white/90 tracking-tight">
            {location}
          </span>
        </div>
        <span className="text-[11px] font-mono text-white/60 tracking-tight font-medium">
          {timeStr || "00:00:00"}
        </span>
      </div>

      {/* Middle: Ambient Sound / Music Equalizer Controller */}
      <button
        type="button"
        onClick={toggleSound}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 transition-all text-left cursor-pointer group/audio"
      >
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-white/50 group-hover/audio:text-white/80 shrink-0" />
          )}
          <span className="text-[11px] font-medium text-white/80 group-hover/audio:text-white transition-colors">
            {isPlaying ? "Ambient Sound" : "Mute Ambience"}
          </span>
        </div>

        {/* Live Equalizer Sound Waves */}
        <div className="flex items-end gap-[3px] h-3 px-0.5">
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isPlaying
                ? "h-3 bg-emerald-400 animate-pulse"
                : "h-1 bg-white/30"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isPlaying
                ? "h-2 bg-emerald-400 animate-[pulse_0.7s_ease-in-out_infinite_0.2s]"
                : "h-1 bg-white/30"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isPlaying
                ? "h-3.5 bg-emerald-400 animate-[pulse_0.85s_ease-in-out_infinite_0.4s]"
                : "h-1 bg-white/30"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isPlaying
                ? "h-2 bg-emerald-400 animate-[pulse_0.6s_ease-in-out_infinite_0.1s]"
                : "h-1 bg-white/30"
            }`}
          />
        </div>
      </button>

      {/* Bottom Row: Quick Socials Dock */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        {socialLinks.map((item) => {
          const IconComp = item.icon;
          return (
            <motion.a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              whileHover={{ scale: 1.12, y: -1.5 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.22] border border-white/15 hover:border-white/40 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm"
            >
              <IconComp size={14} />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Apple Glass Interactive Button
 * Implements real-time visionOS frosted glass (both Light/Primary and Dark/Secondary)
 */
function AppleGlassButton({
  href,
  label,
  variant = "secondary",
  className = "",
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`relative group px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full ${
        isPrimary ? "text-black font-bold" : "text-white font-medium"
      } text-[11px] sm:text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden select-none whitespace-nowrap border ${
        isPrimary
          ? "border-white/80 hover:border-white shadow-[0_20px_48px_-10px_rgba(0,0,0,0.5),0_0_24px_rgba(255,255,255,0.35)]"
          : "border-white/20 hover:border-white/40 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.45),0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
      } ${className}`}
      style={{
        background: isPrimary
          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 245, 250, 0.88) 50%, rgba(235, 238, 248, 0.92) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 40%, rgba(20, 20, 30, 0.45) 100%)",
        backdropFilter: "blur(20px) saturate(190%)",
        WebkitBackdropFilter: "blur(20px) saturate(190%)",
        boxShadow: isPrimary
          ? "inset 0 1.5px 1px 0 rgba(255, 255, 255, 1), inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.15)"
          : "inset 0 1.2px 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.3)",
        transform: "translateZ(0)",
      }}
    >
      {/* Specular Surface Light Glint on Hover */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: isPrimary
            ? "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Button Text */}
      <span
        className={`relative z-10 ${
          isPrimary
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
      className="relative w-full flex-1 flex flex-col justify-between px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 pt-48 sm:pt-36 lg:pt-36 xl:pt-32 mt-50 sm:mt-100 xl:mt-6 pb-8 xl:pb-10 z-10 text-white select-none"
    >
      {/* Top-Right Live Time, Location & Quick Socials Dock (Desktop-Only) */}
      <motion.div
        variants={itemVariants}
        className="hidden xl:flex absolute top-36 right-20 xl:right-28 2xl:right-36 z-20 pointer-events-auto"
      >
        <TopRightStatusDock
          location={portfolioData.personal.location}
          socials={portfolioData.socials}
          audioSrc={portfolioData.hero?.ambientAudio}
        />
      </motion.div>

      {/* 1. Main Editorial Headline (Top-Left on Desktop, Centered on Mobile/Tablet/iPad) */}
      <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-center xl:items-start leading-[0.9] tracking-tight"
        >
          <span className="font-cormorant italic font-normal text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-center xl:text-left">
            <TypewriterText
              text={hero.greeting}
              isLoading={isLoading}
              speed={60}
              delay={200}
              showCursor={false}
            />
          </span>
          <span className="font-clashM text-3xl sm:text-5xl md:text-7xl lg:text-8xl mt-1.5 sm:mt-3 whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] text-center xl:text-left">
            <TypewriterText
              text={hero.name}
              isLoading={isLoading}
              speed={80}
              delay={700}
              showCursor={true}
            />
          </span>
        </motion.div>

        {/* Mobile & Tablet & iPad Pro Tagline, CTAs & Chat Bar (Grouped directly below headline) */}
        <div className="flex xl:hidden flex-col items-center text-center max-w-xl mx-auto mt-4 sm:mt-7">
          <motion.p
            variants={itemVariants}
            className="font-jakarta text-sm sm:text-base font-light text-white/80 tracking-wide text-center"
          >
            {hero.tagline.prefix}{" "}
            <span className="font-cormorant italic text-white font-normal text-base sm:text-xl">
              {hero.tagline.highlight1}
            </span>{" "}
            {hero.tagline.connector}{" "}
            <span className="font-cormorant italic text-white font-normal text-base sm:text-xl">
              {hero.tagline.highlight2}
            </span>
            {hero.tagline.suffix}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-3 sm:gap-4 font-jakarta z-20"
          >
            <AppleGlassButton
              href={hero.ctaButtons.primary.href}
              label={hero.ctaButtons.primary.label}
              variant="primary"
            />
            <AppleGlassButton
              href={hero.ctaButtons.secondary.href}
              label={hero.ctaButtons.secondary.label}
              variant="secondary"
            />
          </motion.div>

          {/* AI Chat Bar directly in upper mobile/tablet block */}
          <div className="mt-8 sm:mt-10 w-full max-w-[325px] sm:max-w-sm mx-auto z-30 pointer-events-auto">
            <HeroChatbot />
          </div>
        </div>
      </div>

      {/* 2. Desktop-Only Bottom-Left Editorial Card */}
      {hero.philosophyCard && (
        <motion.div
          variants={itemVariants}
          className="hidden xl:flex absolute bottom-12 left-20 xl:left-28 2xl:left-36 flex-col items-start text-left max-w-xs z-20 pointer-events-auto gap-2.5"
        >
          {/* Section Eyebrow (Matching About/Projects/Contact) */}
          <div className="flex items-center gap-2.5">
            <span className="font-clashM text-[11px] px-2.5 py-0.5 rounded-full bg-white text-black tracking-[0.2em] uppercase font-bold shadow-sm">
              {hero.philosophyCard.badgeNumber}
            </span>
            <span className="w-5 h-px bg-white/30" />
            <span className="font-jakarta text-[10px] uppercase tracking-[0.25em] text-white/70 font-semibold">
              {hero.philosophyCard.badgeLabel}
            </span>
          </div>

          <p className="font-jakarta text-xs sm:text-sm font-light text-white/75 leading-relaxed">
            {hero.philosophyCard.text}
          </p>
        </motion.div>
      )}

      {/* 3. Desktop-Only Right-Aligned Tagline & CTA Action Block */}
      <div className="hidden xl:flex flex-col items-end self-end text-right max-w-md xl:max-w-lg ml-auto mb-16 xl:mb-20 z-20">
        {/* Subtitle & Tagline */}
        <motion.p
          variants={itemVariants}
          className="font-jakarta text-base md:text-lg lg:text-xl font-light text-white/80 tracking-wide text-right"
        >
          {hero.tagline.prefix}{" "}
          <span className="font-cormorant italic text-white font-normal text-xl md:text-2xl">
            {hero.tagline.highlight1}
          </span>{" "}
          {hero.tagline.connector}{" "}
          <span className="font-cormorant italic text-white font-normal text-xl md:text-2xl">
            {hero.tagline.highlight2}
          </span>
          {hero.tagline.suffix}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-4 sm:mt-5 w-full flex items-center justify-end gap-3 sm:gap-4 font-jakarta z-20"
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

      {/* 4. Desktop-Only Absolute Center AI Chat Bar */}
      <div className="hidden xl:block xl:absolute xl:bottom-8 xl:left-1/2 xl:-translate-x-1/2 w-full max-w-[325px] sm:max-w-sm mx-auto px-4 z-30 pointer-events-auto">
        <HeroChatbot />
      </div>
    </motion.div>
  );
}

export default Hero;