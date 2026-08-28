import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { portfolioData } from "../data/portfolioData";
import GlitchRollingText from "./ui/GlitchRollingText";
import StaggerGlitchText from "./ui/StaggerGlitchText";

/**
 * CloudPreloader Component
 * 
 * Minimalist cinematic cloud preloader with subtle pixelation:
 * - Staggered character fade-in glitch for name ("Hashim Malik").
 * - Once name stagger finishes, the cyber rolling matrix glitch on ("Welcome to HashVerse") begins.
 * - Once subtitle finishes, triggers the upward Wipe Reveal unmasking the homepage.
 * - Luminous wipe beam line leading the unmasking transition.
 */
export default function CloudPreloader({ onStartReveal }) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isNameComplete, setIsNameComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const touchStartY = useRef(null);
  const hasTriggeredRef = useRef(false);

  const { personal, preloader } = portfolioData || {};
  const name = preloader?.name || personal?.name || "Hashim Malik";
  const subtitle = preloader?.subtitle || "Welcome to HashVerse";
  const topTag = preloader?.topTag || "PORTFOLIO";
  const scrollPrompt = preloader?.scrollPrompt || "SCROLL";
  const durationSeconds = preloader?.durationSeconds ?? 6;
  const videoSrc = preloader?.videoSrc || "/gallery/clouds.webm";

  const handleTrigger = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsExiting(true);

    // Keep scroll position firmly at top
    window.scrollTo({ top: 0, behavior: "instant" });

    // Notify parent immediately for synchronized reveal
    if (onStartReveal) onStartReveal();
  }, [onStartReveal]);

  // Auto-reveal after durationSeconds of active playback
  useEffect(() => {
    if (!isVideoReady) return;
    const timer = setTimeout(() => {
      handleTrigger();
    }, durationSeconds * 1000);

    return () => clearTimeout(timer);
  }, [isVideoReady, handleTrigger, durationSeconds]);

  // Ensure Video plays immediately on mount & fallback safety timer
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
      if (video.readyState >= 2) {
        setIsVideoReady(true);
      }
    }

    // Safety fallback so UI always emerges gracefully even on slow connections
    const fallbackTimer = setTimeout(() => {
      setIsVideoReady(true);
    }, 500);

    return () => clearTimeout(fallbackTimer);
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
        setIsVideoReady(true);
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
      initial={{ y: "0%", opacity: 1 }}
      animate={
        isExiting
          ? {
              y: "-100%",
              opacity: 1,
            }
          : {
              y: "0%",
              opacity: 1,
            }
      }
      exit={{
        y: "-100%",
        opacity: 1,
        transition: { duration: 0.95, ease: [0.85, 0, 0.15, 1] },
      }}
      transition={{ duration: 0.95, ease: [0.85, 0, 0.15, 1] }}
      onClick={handleTrigger}
      className="fixed inset-0 z-[100] flex flex-col justify-between items-center py-12 sm:py-16 px-6 bg-black cursor-pointer overflow-hidden touch-none select-none pointer-events-auto transform-gpu"
    >
      {/* Video element (Active in DOM for decoder playback) */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsVideoReady(true)}
        onCanPlay={() => setIsVideoReady(true)}
        onEnded={handleTrigger}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] pointer-events-none opacity-0"
      />

      {/* Real-time Subtle Pixelated Render Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.03] pointer-events-none transition-opacity duration-700 ease-out"
        style={{
          imageRendering: "pixelated",
          filter: "contrast(1.04) brightness(0.96)",
          opacity: isVideoReady ? 1 : 0,
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
        initial={{ opacity: 0, y: -10 }}
        animate={
          isExiting
            ? { opacity: 0, y: -25 }
            : isVideoReady
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: -10 }
        }
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 flex items-center gap-3 font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 font-light"
      >
        <span className="w-1 h-1 rounded-full bg-white/40" />
        <span>{topTag}</span>
        <span>•</span>
        <span>{new Date().getFullYear()}</span>
      </motion.div>

      {/* Center: Ultra-Minimal Name & Cyber Glitch/Rolling Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={
          isExiting
            ? { opacity: 0, y: -45, scale: 0.96 }
            : isVideoReady
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 15 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center gap-3.5 my-auto"
      >
        {/* Staggered Glitch Entrance for Name */}
        <motion.div
          animate={{
            y: [0, 5, 0],
            opacity: [0.75, 1, 0.75],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.6,
            ease: "easeInOut",
          }}
        >
          <StaggerGlitchText
            text={name}
            isReady={isVideoReady}
            initialDelay={0.12}
            staggerDelay={0.045}
            onComplete={() => setIsNameComplete(true)}
            className="font-longsile text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white/95 font-normal tracking-wide drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          />
        </motion.div>

        {/* Glitch & Rolling Decoder Subtitle: Appears after Name completes */}
        <div className="font-jakarta text-[9.5px] sm:text-[11px] md:text-[11.5px] tracking-[0.4em] uppercase text-white/80 font-light">
          <GlitchRollingText
            text={subtitle}
            isReady={isNameComplete}
            startDelay={150}
            speed={50}
            enableGlitch={true}
            holdDurationAfterComplete={450}
            onComplete={handleTrigger}
          />
        </div>
      </motion.div>

      {/* Bottom: Minimalist Downward Floating Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={
          isExiting
            ? { opacity: 0, y: 20 }
            : isVideoReady
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 10 }
        }
        transition={{ duration: 0.6, delay: 0.15 }}
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
            {scrollPrompt}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Luminous Wipe Reveal Lead Beam */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 15%, rgba(168,218,34,0.95) 50%, rgba(255,255,255,0.4) 85%, transparent 100%)",
          boxShadow:
            "0 0 16px rgba(168,218,34,0.8), 0 0 32px rgba(255,255,255,0.5)",
          opacity: isExiting ? 1 : 0.35,
          transition: "opacity 0.3s ease",
        }}
      />
    </motion.div>
  );
}
