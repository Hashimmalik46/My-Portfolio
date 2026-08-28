import { useEffect, useRef } from "react";
import { motion } from "motion/react";

/**
 * StaggerGlitchText Component
 * 
 * Staggers in each character with a subtle fade-in, upward drift,
 * and micro chromatic aberration glitch before settling.
 * Calls onComplete when the entire name finishes animating.
 */
export default function StaggerGlitchText({
  text = "Hashim Malik",
  isReady = true,
  initialDelay = 0.15,
  staggerDelay = 0.05,
  onComplete,
  className = "",
}) {
  const characters = text.split("");
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isReady || hasCompletedRef.current) return;

    // Total animation time for all staggered characters
    const totalDuration = (initialDelay + characters.length * staggerDelay + 0.4) * 1000;
    const timer = setTimeout(() => {
      hasCompletedRef.current = true;
      if (onComplete) onComplete();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [isReady, initialDelay, staggerDelay, characters.length, onComplete]);

  return (
    <motion.h1
      className={`inline-flex items-center justify-center flex-wrap select-none ${className}`}
      style={{
        willChange: "transform, opacity",
        transform: "translate3d(0, 0, 0)",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            y: 16,
            scale: 0.92,
            filter: "blur(4px)",
            textShadow: "2px 0 0 rgba(6,182,212,0.8), -2px 0 0 rgba(244,63,94,0.8)",
          }}
          animate={
            isReady
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  textShadow: "0 4px 24px rgba(0,0,0,0.85)",
                }
              : {
                  opacity: 0,
                  y: 16,
                  scale: 0.92,
                  filter: "blur(4px)",
                  textShadow: "2px 0 0 rgba(6,182,212,0.8), -2px 0 0 rgba(244,63,94,0.8)",
                }
          }
          transition={{
            duration: 0.5,
            delay: initialDelay + index * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`inline-block ${char === " " ? "w-[0.28em]" : ""}`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
