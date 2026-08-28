import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

const DEFAULT_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>~_-/\\+=[]{}?";

const generateScramble = (str, glyphPool = DEFAULT_GLYPHS) => {
  return str
    .split("")
    .map((char) => {
      if (char === " ") return " ";
      return glyphPool[Math.floor(Math.random() * glyphPool.length)];
    })
    .join("");
};

/**
 * GlitchRollingText Component
 * 
 * 1. Initially hidden so only "Hashim Malik" is visible.
 * 2. After a configured delay, the ENTIRE phrase ("WELCOME TO HASHVERSE")
 *    emerges with rolling cyber decryption and RGB chromatic aberration glitching.
 * 3. Once resolved, calls onComplete to trigger the upward Wipe Reveal.
 */
export default function GlitchRollingText({
  text = "Welcome to HashVerse",
  isReady = true,
  startDelay = 850,
  speed = 52,
  className = "",
  glyphs = DEFAULT_GLYPHS,
  enableGlitch = true,
  onComplete,
  holdDurationAfterComplete = 450,
}) {
  const targetText = text.toUpperCase();
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState(() => generateScramble(targetText, glyphs));
  const [isGlitching, setIsGlitching] = useState(false);
  const isResolvingRef = useRef(false);

  const startDecryption = useCallback(() => {
    if (isResolvingRef.current) return;
    isResolvingRef.current = true;
    setIsVisible(true);
    setIsGlitching(true);

    let iteration = 0;
    const totalLength = targetText.length;
    const stepsPerChar = 3;
    const maxIterations = totalLength * stepsPerChar;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            // If already resolved by head index
            if (index < Math.floor(iteration / stepsPerChar)) {
              return targetText[index];
            }
            // Rapidly roll random glyphs for the rest
            const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
            return randomGlyph;
          })
          .join("");
      });

      iteration += 1;

      // Micro-glitch flickers during roll
      if (iteration % 3 === 0) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 110);
      }

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(targetText);
        isResolvingRef.current = false;
        setIsGlitching(false);

        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, holdDurationAfterComplete);
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, glyphs, speed, onComplete, holdDurationAfterComplete]);

  // Trigger whole phrase emergence & glitch decryption after startDelay
  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      startDecryption();
    }, startDelay);

    return () => clearTimeout(timer);
  }, [isReady, startDelay, startDecryption]);

  // Periodic subtle micro-glitches after resolution
  useEffect(() => {
    if (!isReady || !enableGlitch) return;

    const triggerGlitchBurst = () => {
      setIsGlitching(true);
      const duration = 140 + Math.random() * 80;
      setTimeout(() => {
        setIsGlitching(false);
      }, duration);
    };

    const interval = setInterval(() => {
      if (!isResolvingRef.current && isVisible && Math.random() > 0.35) {
        triggerGlitchBurst();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isReady, isVisible, enableGlitch]);

  // Handle manual hover re-scramble & glitch burst
  const handleMouseEnter = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 220);
    startDecryption();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={handleMouseEnter}
      className={`relative inline-block select-none cursor-default ${className}`}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Cyan Chromatic Aberration Glitch Layer */}
      {isGlitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-cyan-400 opacity-80 pointer-events-none"
          style={{
            transform: "translate(-2.5px, 1px)",
            clipPath: "inset(20% 0 45% 0)",
            textShadow: "0 0 8px rgba(6,182,212,0.8)",
          }}
        >
          {displayText}
        </span>
      )}

      {/* Magenta / Pink Chromatic Aberration Glitch Layer */}
      {isGlitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-fuchsia-500 opacity-80 pointer-events-none"
          style={{
            transform: "translate(2.5px, -1px)",
            clipPath: "inset(55% 0 15% 0)",
            textShadow: "0 0 8px rgba(217,70,239,0.8)",
          }}
        >
          {displayText}
        </span>
      )}

      {/* Lime Accent Glow on Micro-Glitch */}
      {isGlitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-lime-400 opacity-60 pointer-events-none"
          style={{
            transform: "translate(1px, 2px)",
            clipPath: "inset(10% 0 75% 0)",
          }}
        >
          {displayText}
        </span>
      )}

      {/* Primary High-Contrast Text */}
      <span className="relative z-10 block tracking-[0.42em] font-light text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
        {displayText}
      </span>
    </motion.div>
  );
}
