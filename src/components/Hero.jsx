import { useRef, useState, useEffect } from "react";
import {
  Sparkles,
  Globe,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Disc3,
  X,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import {
  motion,
  AnimatePresence,
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
 * Shared Ambient Audio Hook
 * Unified playback engine ensuring desktop and mobile/tablet widgets stay 100% in sync
 */
function useAmbientAudio(playlist = [], audioSrc = "/audio/ambient_1.mp3") {
  const tracks =
    playlist && playlist.length > 0
      ? playlist
      : [
          { id: 1, title: "Ambient Flow 01", src: audioSrc || "/audio/ambient_1.mp3" },
          { id: 2, title: "Ambient Flow 02", src: "/audio/ambient_2.mp3" },
        ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioTagRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  useEffect(() => {
    const audio = audioTagRef.current;
    if (audio && isPlaying) {
      audio.load();
      audio
        .play()
        .catch((err) => console.warn("Auto-play switch notice:", err));
    }
  }, [currentTrackIndex]);

  const toggleSound = (e) => {
    e?.stopPropagation();
    const audio = audioTagRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.5;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio play notice:", err));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    setIsPlaying,
    audioTagRef,
    toggleSound,
    handleNext,
    handlePrev,
  };
}

/**
 * Luxury Desktop Top-Right Status & Ambient Music Widget
 */
function TopRightStatusDock({
  location = "Srinagar, Kashmir",
  socials = {},
  audioPlayer,
}) {
  const [timeStr, setTimeStr] = useState("");
  const {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    toggleSound,
    handleNext,
    handlePrev,
  } = audioPlayer;

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

  const socialLinks = [
    { id: "github", label: "GitHub", href: socials.github, icon: FaGithub },
    { id: "linkedin", label: "LinkedIn", href: socials.linkedin, icon: FaLinkedinIn },
    { id: "twitter", label: "X / Twitter", href: socials.twitter, icon: FaXTwitter },
    { id: "instagram", label: "Instagram", href: socials.instagram, icon: FaInstagram },
  ].filter((item) => Boolean(item.href));

  return (
    <div className="relative flex flex-col gap-3 p-3.5 sm:p-4 rounded-3xl bg-white/[0.13] hover:bg-white/[0.18] border border-white/30 hover:border-white/45 backdrop-blur-2xl backdrop-saturate-[200%] shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_24px_rgba(255,255,255,0.1),inset_0_1.5px_1px_rgba(255,255,255,0.6)] transition-all duration-300 group select-none font-jakarta min-w-[255px] pointer-events-auto">
      {/* Top Header: Location & Digital Clock Capsule */}
      <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-white/80 shrink-0" strokeWidth={1.8} />
          <span className="text-[11px] font-semibold text-white tracking-tight">
            {location}
          </span>
        </div>

        <span className="text-[10px] font-mono font-medium text-white/90 px-2 py-0.5 rounded-full bg-white/[0.12] border border-white/20 tracking-tight shadow-sm">
          {timeStr || "00:00:00"}
        </span>
      </div>

      {/* Middle: Luxury Apple-Style Multi-Track Ambient Music Player */}
      <div className="flex flex-col gap-2 p-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.13] border border-white/20 hover:border-white/35 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
        {/* Track Info Header: Spinning Vinyl Disc, Title & Live Equalizer Waves */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Vinyl Disc Artwork Badge */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/25 via-white/10 to-white/15 border border-white/30 flex items-center justify-center shadow-inner shrink-0">
              <Disc3
                className={`w-4 h-4 text-emerald-300 ${
                  isPlaying ? "animate-spin" : "opacity-80"
                }`}
                style={{ animationDuration: "3.5s" }}
              />
            </div>

            {/* Title & Status */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white tracking-tight truncate max-w-[115px]">
                {currentTrack.title || `Ambient Flow 0${currentTrackIndex + 1}`}
              </span>
              <span className="text-[9.5px] font-mono text-white/70 tracking-wide uppercase">
                {isPlaying ? "Now Playing" : "Paused"} • {String(currentTrackIndex + 1).padStart(2, "0")}/{String(tracks.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Dynamic Sound Equalizer Waves */}
          <div className="flex items-end gap-[2.5px] h-3.5 px-1 shrink-0">
            <span
              className={`w-[2px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "h-3.5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse"
                  : "h-1 bg-white/40"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "h-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-[pulse_0.7s_ease-in-out_infinite_0.2s]"
                  : "h-1 bg-white/40"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "h-4 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-[pulse_0.85s_ease-in-out_infinite_0.4s]"
                  : "h-1 bg-white/40"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "h-2.5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-[pulse_0.6s_ease-in-out_infinite_0.1s]"
                  : "h-1 bg-white/40"
              }`}
            />
          </div>
        </div>

        {/* Centered Transport Audio Controls */}
        <div className="flex items-center justify-center gap-3 pt-1 border-t border-white/10">
          <motion.button
            type="button"
            onClick={handlePrev}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            aria-label="Previous Track"
            className="w-7 h-7 rounded-full bg-white/[0.12] hover:bg-white/[0.28] border border-white/20 hover:border-white/40 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <SkipBack size={11} />
          </motion.button>

          <motion.button
            type="button"
            onClick={toggleSound}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            aria-label={isPlaying ? "Pause Ambient Music" : "Play Ambient Music"}
            className="w-8 h-8 rounded-full bg-white text-black hover:bg-white/95 shadow-[0_0_16px_rgba(255,255,255,0.5),0_2px_8px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer transition-transform"
          >
            {isPlaying ? (
              <Pause size={12} className="text-black fill-black" />
            ) : (
              <Play size={12} className="text-black fill-black ml-0.5" />
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleNext}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            aria-label="Next Track"
            className="w-7 h-7 rounded-full bg-white/[0.12] hover:bg-white/[0.28] border border-white/20 hover:border-white/40 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <SkipForward size={11} />
          </motion.button>
        </div>
      </div>

      {/* Bottom: Quick Social Icon Launchpad */}
      <div className="flex items-center justify-between gap-1 pt-0.5">
        {socialLinks.map((item) => {
          const IconComp = item.icon;
          return (
            <motion.a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 rounded-xl bg-white/[0.10] hover:bg-white/[0.28] border border-white/18 hover:border-white/45 flex items-center justify-center text-white/85 hover:text-white transition-all duration-200 shadow-sm"
            >
              <IconComp size={13} />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Mobile & Tablet Floating Bottom-Right Expanding Disc Pill Player
 * Smoothly morphs between a circular disc button and a compact horizontal frosted glass capsule.
 */
export function FloatingBottomRightDiscPlayer({
  audioPlayer,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const discRef = useRef(null);
  const {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    toggleSound,
    handleNext,
    handlePrev,
  } = audioPlayer;

  // Click outside to collapse back into disc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (discRef.current && !discRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={discRef}
      className="xl:hidden absolute bottom-6 right-4 sm:right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-auto select-none font-jakarta"
    >
      <motion.div
        layout
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`h-11 rounded-full bg-white/[0.13] hover:bg-white/[0.18] border border-white/30 hover:border-white/45 backdrop-blur-2xl backdrop-saturate-[200%] shadow-[0_16px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.1),inset_0_1.5px_1px_rgba(255,255,255,0.6)] flex items-center overflow-hidden transition-colors ${
          isOpen ? "px-3.5 gap-2.5 max-w-[92vw]" : "w-11 justify-center cursor-pointer"
        }`}
        onClick={!isOpen ? () => setIsOpen(true) : undefined}
      >
        {/* Left: Spinning Vinyl Disc Icon */}
        <div
          onClick={isOpen ? () => setIsOpen(false) : undefined}
          className={`w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0 ${
            isOpen ? "cursor-pointer" : ""
          }`}
        >
          <Disc3
            className={`w-3.5 h-3.5 text-emerald-300 ${
              isPlaying ? "animate-spin" : "opacity-80"
            }`}
            style={{ animationDuration: "3.5s" }}
          />
        </div>

        {/* Expanded Content (Subtle Minimal Fade) */}
        <AnimatePresence mode="sync">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-center gap-2.5 whitespace-nowrap overflow-hidden"
            >
              {/* Track Info */}
              <div className="flex flex-col min-w-0 max-w-[105px] sm:max-w-[130px]">
                <span className="text-[11px] font-semibold text-white truncate tracking-tight">
                  {currentTrack.title || `Ambient 0${currentTrackIndex + 1}`}
                </span>
                <span className="text-[8.5px] font-mono text-white/70 tracking-wider uppercase">
                  {isPlaying ? "Playing" : "Paused"} • {String(currentTrackIndex + 1).padStart(2, "0")}/{String(tracks.length).padStart(2, "0")}
                </span>
              </div>

              {/* Live Mini Sound Wave Bars */}
              <div className="flex items-end gap-[2px] h-3 px-0.5 shrink-0">
                <span
                  className={`w-[2px] rounded-full transition-all duration-300 ${
                    isPlaying ? "h-3 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" : "h-1 bg-white/40"
                  }`}
                />
                <span
                  className={`w-[2px] rounded-full transition-all duration-300 ${
                    isPlaying ? "h-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-[pulse_0.7s_ease-in-out_infinite_0.2s]" : "h-1 bg-white/40"
                  }`}
                />
                <span
                  className={`w-[2px] rounded-full transition-all duration-300 ${
                    isPlaying ? "h-3.5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-[pulse_0.85s_ease-in-out_infinite_0.4s]" : "h-1 bg-white/40"
                  }`}
                />
              </div>

              <span className="w-px h-4 bg-white/20 shrink-0" />

              {/* Transport Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.button
                  type="button"
                  onClick={handlePrev}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Previous Track"
                  className="w-6 h-6 rounded-full bg-white/[0.12] hover:bg-white/[0.28] border border-white/25 flex items-center justify-center text-white/85 transition-all cursor-pointer"
                >
                  <SkipBack size={10} />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={toggleSound}
                  whileTap={{ scale: 0.92 }}
                  aria-label={isPlaying ? "Pause Music" : "Play Music"}
                  className="w-7 h-7 rounded-full bg-white text-black hover:bg-white/95 shadow-[0_0_12px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause size={10} className="text-black fill-black" />
                  ) : (
                    <Play size={10} className="text-black fill-black ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Next Track"
                  className="w-6 h-6 rounded-full bg-white/[0.12] hover:bg-white/[0.28] border border-white/25 flex items-center justify-center text-white/85 transition-all cursor-pointer"
                >
                  <SkipForward size={10} />
                </motion.button>
              </div>

              {/* Close / Collapse Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                aria-label="Collapse Player"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer ml-0.5"
              >
                <X size={10} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Audio indicator dot when collapsed and playing */}
        {!isOpen && isPlaying && (
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse border border-black/40" />
        )}
      </motion.div>
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
      className={`group relative isolate inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-jakarta text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 select-none overflow-hidden ${
        isPrimary
          ? "text-black shadow-[0_12px_36px_rgba(255,255,255,0.22),0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_44px_rgba(255,255,255,0.35),0_6px_20px_rgba(0,0,0,0.5)] border border-white/90"
          : "text-white shadow-[0_12px_36px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-white/20 hover:border-white/35"
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

  // Single shared ambient audio controller for Hero
  const audioPlayer = useAmbientAudio(
    hero?.playlist,
    hero?.ambientAudio
  );

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
      className="relative w-full flex-1 flex flex-col justify-between px-6 sm:px-12 lg:px-20 xl:px-28 2xl:px-36 pt-48 sm:pt-36 lg:pt-36 xl:pt-32 mt-45 sm:mt-100 xl:mt-6 pb-8 xl:pb-10 z-10 text-white select-none"
    >
      {/* Hidden DOM Audio Element (Single Shared Instance) */}
      <audio
        ref={audioPlayer.audioTagRef}
        src={audioPlayer.currentTrack.src}
        preload="auto"
        onPlay={() => audioPlayer.setIsPlaying(true)}
        onPause={() => audioPlayer.setIsPlaying(false)}
        onEnded={audioPlayer.handleNext}
      />

      {/* Top-Right Live Time, Location & Quick Socials Dock (Desktop-Only) */}
      <motion.div
        variants={itemVariants}
        className="hidden xl:flex absolute top-36 right-20 xl:right-28 2xl:right-36 z-20 pointer-events-auto"
      >
        <TopRightStatusDock
          location={portfolioData.personal.location}
          socials={portfolioData.socials}
          audioPlayer={audioPlayer}
        />
      </motion.div>

      {/* Floating Bottom-Right Expanding Disc Pill Player (Mobile & Tablet - Home Section Only) */}
      <FloatingBottomRightDiscPlayer
        audioPlayer={audioPlayer}
      />

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