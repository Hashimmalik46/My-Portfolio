import React, { useEffect, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
} from "motion/react";

/**
 * TorchAnimal
 * A smart, animated cute explorer character that dynamically tracks cursor direction and quadrant:
 * 
 * Behaviors:
 * 1. Horizontal Motion:
 *    - Moving H -> M (left-to-right): Cat sits on left, torch aims towards the right (↘ or ↗).
 *    - Moving M -> H (right-to-left): Cat sits on right, torch aims towards the left (↙ or ↖).
 * 2. Vertical Position:
 *    - Top of container: Cat floats above text, eyes look down, torch aims downwards into letters.
 *    - Bottom of container: Cat floats below text, eyes look up, torch aims upwards into letters.
 * 3. Fluid Physics (Not Rigid):
 *    - Smooth 3D turning flip (scaleX spring)
 *    - Velocity-driven inertial lean/tilt
 *    - Breathing/floating idle bobbing & periodic eye blink
 */
export default function TorchAnimal({ isVisible, smoothX, smoothY, containerRef }) {
  // Eye blinking state cycle
  const [isBlinking, setIsBlinking] = useState(false);

  // Direction & Quadrant states
  const [facingRight, setFacingRight] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200);

    return () => clearInterval(blinkInterval);
  }, []);

  // Velocity tracking on X axis
  const mouseVelX = useVelocity(smoothX);

  useEffect(() => {
    const unsubVel = mouseVelX.on("change", (latestVel) => {
      // 60px/s threshold with hysteresis to avoid jitter when moving vertically or resting
      if (latestVel > 60) {
        setFacingRight(true); // Moving left-to-right (H -> M)
      } else if (latestVel < -60) {
        setFacingRight(false); // Moving right-to-left (M -> H)
      }
    });

    const unsubY = smoothY.on("change", (latestY) => {
      if (!containerRef?.current) return;
      const height = containerRef.current.offsetHeight || 220;
      // 10% hysteresis buffer around center line
      if (latestY > height * 0.54) {
        setIsAtBottom(true); // Cursor is in bottom half -> Cat is below, looking up
      } else if (latestY < height * 0.46) {
        setIsAtBottom(false); // Cursor is in top half -> Cat is above, looking down
      }
    });

    return () => {
      unsubVel();
      unsubY();
    };
  }, [mouseVelX, smoothY, containerRef]);

  // Spring-smoothed horizontal flip (scaleX)
  const targetScaleX = useMotionValue(facingRight ? 1 : -1);
  useEffect(() => {
    targetScaleX.set(facingRight ? 1 : -1);
  }, [facingRight]);
  const smoothScaleX = useSpring(targetScaleX, { stiffness: 450, damping: 28 });

  // Spring-smoothed position offsets
  const targetOffsetX = useMotionValue(facingRight ? -45 : 45);
  const targetOffsetY = useMotionValue(isAtBottom ? 50 : -50);

  useEffect(() => {
    targetOffsetX.set(facingRight ? -45 : 45);
    targetOffsetY.set(isAtBottom ? 50 : -50);
  }, [facingRight, isAtBottom]);

  const smoothOffsetX = useSpring(targetOffsetX, { stiffness: 320, damping: 26 });
  const smoothOffsetY = useSpring(targetOffsetY, { stiffness: 320, damping: 26 });

  // Combined position springs
  const targetX = useTransform([smoothX, smoothOffsetX], ([x, offX]) => x + offX);
  const targetY = useTransform([smoothY, smoothOffsetY], ([y, offY]) => y + offY);

  const animalX = useSpring(targetX, { stiffness: 360, damping: 28, mass: 0.2 });
  const animalY = useSpring(targetY, { stiffness: 360, damping: 28, mass: 0.2 });

  // Dynamic tilt/lean based on horizontal mouse movement speed
  const tiltAngle = useTransform(mouseVelX, [-1000, 0, 1000], [-12, 0, 12]);
  const smoothTilt = useSpring(tiltAngle, { stiffness: 220, damping: 22 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.7,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: animalX,
        top: animalY,
        x: "-50%",
        y: "-50%",
        scaleX: smoothScaleX,
        rotate: smoothTilt,
        pointerEvents: "none",
        zIndex: 40,
      }}
      className="select-none"
    >
      {/* Idle Floating & Breathing Bob Animation */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center"
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Character Fur Gradient */}
              <linearGradient id="furGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2c3038" />
                <stop offset="60%" stopColor="#1a1d24" />
                <stop offset="100%" stopColor="#12141a" />
              </linearGradient>

              {/* Belly & Face Highlight */}
              <linearGradient id="furHighlight" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#474f5d" />
                <stop offset="100%" stopColor="#222630" />
              </linearGradient>

              {/* Inner Ear Soft Pink */}
              <linearGradient id="innerEar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>

              {/* Realistic Anodized Black Metal Gradient */}
              <linearGradient id="realTorchMetal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="30%" stopColor="#475569" />
                <stop offset="60%" stopColor="#64748b" />
                <stop offset="85%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Chrome Bezel Ring Gradient */}
              <linearGradient id="torchChrome" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              {/* Lime/Gold Emitter Core */}
              <radialGradient id="emitterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#a8da22" />
                <stop offset="100%" stopColor="#4d7c0f" />
              </radialGradient>
            </defs>

            {/* ============================================================= */}
            {/* MODE 1: AT TOP OF CONTAINER (LOOKING & SHINING DOWNWARDS ↘) */}
            {/* ============================================================= */}
            {!isAtBottom && (
              <g id="cat-looking-down">
                {/* --- TAIL --- */}
                <motion.path
                  d="M24 64 C12 60 8 46 16 38 C20 34 24 40 22 48"
                  stroke="#2c3038"
                  strokeWidth="7"
                  strokeLinecap="round"
                  animate={{ rotate: [-6, 8, -6] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: "24px", originY: "64px" }}
                />
                <circle cx="16" cy="38" r="3.5" fill="#cbd5e1" opacity="0.9" />

                {/* --- BODY --- */}
                <ellipse cx="48" cy="58" rx="22" ry="19" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="2" />
                <ellipse cx="48" cy="56" rx="14" ry="12" fill="url(#furHighlight)" opacity="0.85" />

                {/* --- LEFT EAR --- */}
                <motion.g
                  animate={{ rotate: [0, -3, 2, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: "32px", originY: "25px" }}
                >
                  <polygon points="26,28 34,7 44,25" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="1.8" />
                  <polygon points="29,25 34,12 40,23" fill="url(#innerEar)" opacity="0.8" />
                </motion.g>

                {/* --- RIGHT EAR --- */}
                <motion.g
                  animate={{ rotate: [0, 4, -2, 0] }}
                  transition={{ duration: 3.8, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: "68px", originY: "25px" }}
                >
                  <polygon points="56,25 66,7 74,28" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="1.8" />
                  <polygon points="60,23 66,12 71,25" fill="url(#innerEar)" opacity="0.8" />
                </motion.g>

                {/* --- HEAD --- */}
                <circle cx="50" cy="32" r="22" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="2" />

                {/* Cheek Fluffs */}
                <path d="M26 34 C22 32 22 38 26 40" fill="#2c3038" />
                <path d="M74 34 C78 32 78 38 74 40" fill="#2c3038" />

                {/* Blush */}
                <ellipse cx="36" cy="36" rx="4" ry="2.2" fill="#fb7185" opacity="0.45" />
                <ellipse cx="64" cy="36" rx="4" ry="2.2" fill="#fb7185" opacity="0.45" />

                {/* --- EYES (Looking Down-Right) --- */}
                <g>
                  {isBlinking ? (
                    <path d="M35 30 Q40 33 45 30" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                  ) : (
                    <g>
                      <ellipse cx="40" cy="30" rx="5" ry="6" fill="#0f172a" />
                      <circle cx="42" cy="32" r="2.2" fill="#ffffff" />
                      <circle cx="39" cy="28.5" r="1.1" fill="#ffffff" />
                    </g>
                  )}

                  {isBlinking ? (
                    <path d="M55 30 Q60 33 65 30" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                  ) : (
                    <g>
                      <ellipse cx="60" cy="30" rx="5" ry="6" fill="#0f172a" />
                      <circle cx="62" cy="32" r="2.2" fill="#ffffff" />
                      <circle cx="59" cy="28.5" r="1.1" fill="#ffffff" />
                    </g>
                  )}
                </g>

                {/* Nose & Mouth */}
                <polygon points="49,35 53,35 51,38" fill="#fb7185" />
                <path
                  d="M46 39 Q49 42 51 39 Q53 42 56 39"
                  stroke="#f8fafc"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />

                {/* --- REAL TORCH ROTATED DOWN-RIGHT --- */}
                <g id="torch-down-right" transform="rotate(-32 50 45)">
                  <rect x="46" y="43" width="8" height="3" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                  <rect x="45" y="46" width="10" height="22" rx="2" fill="url(#realTorchMetal)" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="46" y1="50" x2="54" y2="50" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="53" x2="54" y2="53" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="56" x2="54" y2="56" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="59" x2="54" y2="59" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="62" x2="54" y2="62" stroke="#0f172a" strokeWidth="0.9" />
                  <rect x="43.5" y="68" width="13" height="7" rx="1" fill="url(#realTorchMetal)" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="44" y1="70.5" x2="56" y2="70.5" stroke="#0f172a" strokeWidth="1" />
                  <line x1="44" y1="73" x2="56" y2="73" stroke="#0f172a" strokeWidth="1" />
                  <polygon points="43.5,75 56.5,75 59,86 41,86" fill="url(#realTorchMetal)" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="42.5" y1="84" x2="57.5" y2="84" stroke="url(#torchChrome)" strokeWidth="1.4" />
                  <rect x="40" y="85.5" width="20" height="3" rx="1" fill="url(#torchChrome)" stroke="#0f172a" strokeWidth="1" />
                  <ellipse cx="50" cy="88.5" rx="9.5" ry="3" fill="url(#emitterGlow)" stroke="#ffffff" strokeWidth="0.8" />
                  <ellipse cx="50" cy="88.5" rx="5" ry="1.5" fill="#ffffff" />
                  <circle cx="42" cy="58" r="5" fill="#2c3038" stroke="#0f1115" strokeWidth="1.5" />
                  <circle cx="58" cy="58" r="5" fill="#2c3038" stroke="#0f1115" strokeWidth="1.5" />
                </g>
              </g>
            )}

            {/* ============================================================= */}
            {/* MODE 2: AT BOTTOM OF CONTAINER (LOOKING & SHINING UPWARDS ↗) */}
            {/* ============================================================= */}
            {isAtBottom && (
              <g id="cat-looking-up">
                {/* --- TAIL --- */}
                <motion.path
                  d="M24 74 C12 76 8 60 16 52 C20 48 24 54 22 62"
                  stroke="#2c3038"
                  strokeWidth="7"
                  strokeLinecap="round"
                  animate={{ rotate: [-6, 8, -6] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: "24px", originY: "74px" }}
                />
                <circle cx="16" cy="52" r="3.5" fill="#cbd5e1" opacity="0.9" />

                {/* --- BODY --- */}
                <ellipse cx="48" cy="72" rx="22" ry="19" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="2" />
                <ellipse cx="48" cy="74" rx="14" ry="12" fill="url(#furHighlight)" opacity="0.85" />

                {/* --- LEFT EAR --- */}
                <motion.g
                  animate={{ rotate: [0, -3, 2, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: "32px", originY: "32px" }}
                >
                  <polygon points="26,35 34,14 44,32" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="1.8" />
                  <polygon points="29,32 34,19 40,30" fill="url(#innerEar)" opacity="0.8" />
                </motion.g>

                {/* --- RIGHT EAR --- */}
                <motion.g
                  animate={{ rotate: [0, 4, -2, 0] }}
                  transition={{ duration: 3.8, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ originX: "68px", originY: "32px" }}
                >
                  <polygon points="56,32 66,14 74,35" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="1.8" />
                  <polygon points="60,30 66,19 71,32" fill="url(#innerEar)" opacity="0.8" />
                </motion.g>

                {/* --- HEAD --- */}
                <circle cx="50" cy="42" r="22" fill="url(#furGradient)" stroke="#0f1115" strokeWidth="2" />

                {/* Cheek Fluffs */}
                <path d="M26 44 C22 42 22 48 26 50" fill="#2c3038" />
                <path d="M74 44 C78 42 78 48 74 50" fill="#2c3038" />

                {/* Blush */}
                <ellipse cx="36" cy="46" rx="4" ry="2.2" fill="#fb7185" opacity="0.45" />
                <ellipse cx="64" cy="46" rx="4" ry="2.2" fill="#fb7185" opacity="0.45" />

                {/* --- EYES (Looking Up-Right) --- */}
                <g>
                  {isBlinking ? (
                    <path d="M35 38 Q40 41 45 38" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                  ) : (
                    <g>
                      <ellipse cx="40" cy="38" rx="5" ry="6" fill="#0f172a" />
                      <circle cx="42" cy="35" r="2.2" fill="#ffffff" />
                      <circle cx="39" cy="39" r="1.1" fill="#ffffff" />
                    </g>
                  )}

                  {isBlinking ? (
                    <path d="M55 38 Q60 41 65 38" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
                  ) : (
                    <g>
                      <ellipse cx="60" cy="38" rx="5" ry="6" fill="#0f172a" />
                      <circle cx="62" cy="35" r="2.2" fill="#ffffff" />
                      <circle cx="59" cy="39" r="1.1" fill="#ffffff" />
                    </g>
                  )}
                </g>

                {/* Nose & Mouth */}
                <polygon points="49,44 53,44 51,47" fill="#fb7185" />
                <path
                  d="M46 48 Q49 51 51 48 Q53 51 56 48"
                  stroke="#f8fafc"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />

                {/* Feet */}
                <ellipse cx="36" cy="88" rx="7" ry="4.5" fill="#1e222a" stroke="#0f1115" strokeWidth="1.5" />
                <ellipse cx="64" cy="88" rx="7" ry="4.5" fill="#1e222a" stroke="#0f1115" strokeWidth="1.5" />

                {/* --- REAL TORCH ROTATED UP-RIGHT --- */}
                <g id="torch-up-right" transform="rotate(32 50 55)">
                  <rect x="46" y="74" width="8" height="3" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                  <rect x="45" y="52" width="10" height="22" rx="2" fill="url(#realTorchMetal)" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="46" y1="56" x2="54" y2="56" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="59" x2="54" y2="59" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="62" x2="54" y2="62" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="65" x2="54" y2="65" stroke="#0f172a" strokeWidth="0.9" />
                  <line x1="46" y1="68" x2="54" y2="68" stroke="#0f172a" strokeWidth="0.9" />
                  <rect x="43.5" y="45" width="13" height="7" rx="1" fill="url(#realTorchMetal)" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="44" y1="47.5" x2="56" y2="47.5" stroke="#0f172a" strokeWidth="1" />
                  <line x1="44" y1="50" x2="56" y2="50" stroke="#0f172a" strokeWidth="1" />
                  <polygon points="43.5,45 56.5,45 59,34 41,34" fill="url(#realTorchMetal)" stroke="#0f172a" strokeWidth="1.2" />
                  <line x1="42.5" y1="36" x2="57.5" y2="36" stroke="url(#torchChrome)" strokeWidth="1.4" />
                  <rect x="40" y="31.5" width="20" height="3" rx="1" fill="url(#torchChrome)" stroke="#0f172a" strokeWidth="1" />
                  <ellipse cx="50" cy="31.5" rx="9.5" ry="3" fill="url(#emitterGlow)" stroke="#ffffff" strokeWidth="0.8" />
                  <ellipse cx="50" cy="31.5" rx="5" ry="1.5" fill="#ffffff" />
                  <circle cx="42" cy="62" r="5" fill="#2c3038" stroke="#0f1115" strokeWidth="1.5" />
                  <circle cx="58" cy="62" r="5" fill="#2c3038" stroke="#0f1115" strokeWidth="1.5" />
                </g>
              </g>
            )}
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
