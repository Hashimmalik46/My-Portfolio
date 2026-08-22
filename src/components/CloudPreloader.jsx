import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

/**
 * CloudPreloader Component
 * 
 * Minimalist cinematic cloud preloader with subtle pixelation:
 * - Plays seamless cloud video up to 7 seconds.
 * - Subtle, delicate pixelated texture.
 * - Minimalist Longsile typography for "Hashim Malik".
 * - Side and radial cinematic vignettes.
 */
export default function CloudPreloader({ onStartReveal }) {
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const touchStartY = useRef(null);
  const hasTriggeredRef = useRef(false);

  const { personal } = portfolioData || {};
  const name = personal?.name || "Hashim Malik";

  const handleTrigger = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsExiting(true);

    // Keep scroll position firmly at top
    window.scrollTo({ top: 0, behavior: "instant" });

    // Notify parent immediately for synchronized reveal
    if (onStartReveal) onStartReveal();
  }, [onStartReveal]);

  // Auto-reveal after exactly 6 seconds of playback
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTrigger();
    }, 6000);

    return () => clearTimeout(timer);
  }, [handleTrigger]);

  // Ensure Video plays immediately on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  // Real-time Subtle Pixelation Render Loop
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let animId;

    // Subtle, fine pixel resolution: 2.2px gives an ultra-delicate digital texture
    const pixelBlockSize = 2.2;

    const render = () => {
      if (video.readyState >= 2) {
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;
        const targetW = Math.max(Math.floor(vw / pixelBlockSize), 120);
        const targetH = Math.max(Math.floor(vh / pixelBlockSize), 68);

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(video, 0, 0, targetW, targetH);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    // Intercept scroll/touch gestures
    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleTrigger();
    };

    const handleKeyDown = (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", "Enter"].includes(e.code)) {
        e.preventDefault();
        handleTrigger();
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleTrigger();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTrigger]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.08,
        filter: "blur(8px)",
        transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
      }}
      animate={
        isExiting
          ? {
              opacity: 0,
              scale: 1.08,
              filter: "blur(8px)",
            }
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleTrigger}
      className="fixed inset-0 z-[100] flex flex-col justify-between items-center py-12 sm:py-16 px-6 bg-black cursor-pointer overflow-hidden touch-none select-none pointer-events-auto"
    >
      {/* 10-Second Seamless Cloud Video (Active in DOM for decoder playback) */}
      <video
        ref={videoRef}
        src="/gallery/clouds.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onEnded={handleTrigger}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] pointer-events-none opacity-0"
      />

      {/* Real-time Subtle Pixelated Render Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.03] pointer-events-none"
        style={{
          imageRendering: "pixelated",
          filter: "contrast(1.04) brightness(0.96)",
        }}
      />

      {/* Subtle Micro Dither Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Cinematic Edge & Side Vignettes */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/75 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Top Minimal Line Accent */}
      <motion.div
        animate={isExiting ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center gap-3 font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 font-light"
      >
        <span className="w-1 h-1 rounded-full bg-white/40" />
        <span>PORTFOLIO</span>
        <span>•</span>
        <span>{new Date().getFullYear()}</span>
      </motion.div>

      {/* Center: Ultra-Minimal "Hashim Malik" in Longsile Font */}
      <motion.div
        animate={isExiting ? { opacity: 0, y: -15, scale: 0.97 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 flex flex-col items-center text-center gap-3.5 my-auto"
      >
        <motion.h1
          animate={{
            y: [0, 6, 0],
            opacity: [0.65, 1, 0.65],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0, 0, 0)",
            WebkitFontSmoothing: "antialiased",
          }}
          className="font-longsile text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white/95 font-normal tracking-wide drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] select-none"
        >
          {name}
        </motion.h1>

        {/* Minimal Subtitle */}
        <motion.span
          animate={{
            y: [0, 6, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0, 0, 0)",
          }}
          className="font-jakarta text-[9.5px] sm:text-[10.5px] tracking-[0.4em] uppercase text-white/60 font-light"
        >
          Full Stack & AI Engineer
        </motion.span>
      </motion.div>

      {/* Bottom: Minimalist Downward Floating Indicator */}
      <motion.div
        animate={isExiting ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{
            y: [0, 6, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0, 0, 0)",
          }}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <span className="font-mono text-[8.5px] tracking-[0.35em] uppercase text-white/40">
            SCROLL
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
