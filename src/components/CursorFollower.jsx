import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Spring-Physics Lime Cursor Follower
 * Floats seamlessly with cursor movements, expanding gracefully over interactive elements.
 */
export default function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics configuration for organic fluid trailing
  const springConfig = { damping: 28, stiffness: 320, mass: 0.55 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (mouse)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Track hovering over clickable / interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("[role='button']") ||
          target.closest(".cursor-pointer"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Outer Spring Follower Ring & Subtle Lime Glow */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.8 : isHovered ? 1.3 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute top-0 left-0 w-7 h-7 rounded-full border border-pAccent/60 bg-pAccent/10 shadow-[0_0_12px_rgba(168,218,34,0.3),inset_0_0_6px_rgba(168,218,34,0.15)] flex items-center justify-center will-change-transform"
      >
        {/* Inner Lime Core Dot */}
        <motion.div
          animate={{
            scale: isHovered ? 0 : 1,
          }}
          transition={{ duration: 0.12 }}
          className="w-1.5 h-1.5 rounded-full bg-pAccent shadow-[0_0_6px_#a8da22]"
        />
      </motion.div>
    </div>
  );
}
