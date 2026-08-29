import React, { useEffect, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
} from "motion/react";

/**
 * AstroExplorer (Chibi Cosmic Astronaut with Umbilical Spacecraft Safety Tether)
 * A super cute, high-detail chibi space explorer that floats across the starry sky,
 * tethered to their spaceship with a zero-g umbilical lifeline cable,
 * holding a luminous celestial star that casts the radiant spotlight beam into the letters.
 * 
 * Behaviors:
 * 1. Horizontal Motion:
 *    - Moving left-to-right: Astronaut faces right, tether trailing behind to the left (↘ / ↗).
 *    - Moving right-to-left: Astronaut faces left, tether trailing behind to the right (↙ / ↖).
 * 2. Vertical Position:
 *    - Top of text: Floating in zero-g above letters, arms holding starlight beam pointing down.
 *    - Bottom of text: Floating in zero-g below letters, arms holding starlight beam pointing up.
 * 3. Fluid Zero-G Physics:
 *    - Spring-smoothed 3D turning flip (scaleX)
 *    - Inertial speed tilt
 *    - Floating bobbing & jetpack thruster plasma pulse
 *    - Wavy undulating spacecraft safety tether cable
 *    - Antenna LED pulse & twinkling starlight particle rays
 */
export default function AstroExplorer({ isVisible, smoothX, smoothY, containerRef }) {
  // Antenna LED blink state cycle
  const [isBlinking, setIsBlinking] = useState(false);

  // Direction & Quadrant states
  const [facingRight, setFacingRight] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 2600);

    return () => clearInterval(blinkInterval);
  }, []);

  // Velocity tracking on X axis
  const mouseVelX = useVelocity(smoothX);

  useEffect(() => {
    const unsubVel = mouseVelX.on("change", (latestVel) => {
      if (latestVel > 60) {
        setFacingRight(true);
      } else if (latestVel < -60) {
        setFacingRight(false);
      }
    });

    const unsubY = smoothY.on("change", (latestY) => {
      if (!containerRef?.current) return;
      const height = containerRef.current.offsetHeight || 220;
      if (latestY > height * 0.54) {
        setIsAtBottom(true);
      } else if (latestY < height * 0.46) {
        setIsAtBottom(false);
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
  const tiltAngle = useTransform(mouseVelX, [-1000, 0, 1000], [-14, 0, 14]);
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
      {/* Zero-G Floating Bob Animation */}
      <motion.div
        animate={{
          y: [0, -7, 0],
          rotate: [0, 1.8, -1.8, 0],
        }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center"
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          <svg
            viewBox="-75 -25 190 145"
            className="w-full h-full drop-shadow-[0_14px_32px_rgba(0,0,0,0.95)] overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Cute Chibi Space Suit Gradient */}
              <linearGradient id="chibiSuit" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3d4452" />
                <stop offset="50%" stopColor="#252a34" />
                <stop offset="100%" stopColor="#141720" />
              </linearGradient>

              {/* Suit Joint & Accent Puffy Padding */}
              <linearGradient id="chibiPuff" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#556075" />
                <stop offset="100%" stopColor="#1f242d" />
              </linearGradient>

              {/* Glossy Visor Shield Gradient with Cosmic Horizon Reflection */}
              <linearGradient id="chibiVisor" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bef264" />
                <stop offset="30%" stopColor="#a8da22" />
                <stop offset="65%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Helmet Metallic Collar */}
              <linearGradient id="collarRim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Luminous Celestial Star Radial Glow */}
              <radialGradient id="starCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fef08a" />
                <stop offset="75%" stopColor="#a8da22" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Jetpack Blue Plasma Thruster Glow */}
              <radialGradient id="thrusterPlasma" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#38bdf8" />
                <stop offset="85%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Celestial Light Beam Aura */}
              <radialGradient id="beamAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a8da22" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#a8da22" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Umbilical Tether Cable Gradient - Upper Mode (UserSpace Coordinates) */}
              <linearGradient id="tetherGradientUp" x1="20" y1="40" x2="-56" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a8da22" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#e2e8f0" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>

              {/* Umbilical Tether Cable Gradient - Lower Mode (UserSpace Coordinates) */}
              <linearGradient id="tetherGradientDown" x1="20" y1="50" x2="-56" y2="78" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a8da22" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#e2e8f0" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* ============================================================= */}
            {/* MODE 1: AT TOP OF CONTAINER (LOOKING & SHINING DOWNWARDS ↘) */}
            {/* ============================================================= */}
            {!isAtBottom && (
              <g id="chibi-astro-down">
                {/* 0. SPACECRAFT UMBILICAL SAFETY TETHER (Subtle Wave with Little Zero-G Bump) */}
                <path
                  d="M 20 40 C 6 48 -8 20 -22 32 C -34 42 -44 24 -56 12"
                  stroke="url(#tetherGradientUp)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="4 3"
                  fill="none"
                />
                {/* Carabiner / Tether Swivel Ring */}
                <circle cx="20" cy="40" r="1.8" fill="#a8da22" stroke="#090a0f" strokeWidth="0.8" />

                {/* 1. JETPACK BACKPACK */}
                <rect x="20" y="36" width="13" height="26" rx="4" fill="url(#chibiPuff)" stroke="#090a0f" strokeWidth="1.5" />
                <line x1="26.5" y1="38" x2="26.5" y2="60" stroke="#090a0f" strokeWidth="1" />
                {/* Thruster Nozzle & Plasma Flame */}
                <polygon points="21,62 31,62 33,68 19,68" fill="#1e293b" stroke="#090a0f" strokeWidth="1" />
                <motion.ellipse
                  cx="26"
                  cy="74"
                  rx="4.5"
                  ry="6"
                  fill="url(#thrusterPlasma)"
                  animate={{ ry: [4.5, 7.5, 4.5], opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />

                {/* 2. BACK ARM (Left Arm reaching across chest towards the star) */}
                <path
                  d="M 38 56 Q 48 50 64 56"
                  stroke="url(#chibiSuit)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 38 56 Q 48 50 64 56"
                  stroke="#090a0f"
                  strokeWidth="1.4"
                  fill="none"
                />
                {/* Left Glove Mitten */}
                <circle cx="65" cy="56" r="4.5" fill="#475063" stroke="#090a0f" strokeWidth="1.4" />

                {/* 3. ASTRONAUT BODY & LIFE SUPPORT */}
                <ellipse cx="48" cy="62" rx="19" ry="17" fill="url(#chibiSuit)" stroke="#090a0f" strokeWidth="1.8" />
                
                {/* Chest Life Support Badge */}
                <rect x="42" y="56" width="12" height="9" rx="2.5" fill="#1b2029" stroke="#475569" strokeWidth="0.8" />
                <circle cx="45" cy="60" r="1.3" fill="#a8da22" />
                <circle cx="48.5" cy="60" r="1.3" fill="#38bdf8" />
                <circle cx="52" cy="60" r="1.3" fill="#fb7185" />

                {/* Cute Floating Space Boots */}
                <ellipse cx="38" cy="80" rx="6.5" ry="4" fill="#191c24" stroke="#090a0f" strokeWidth="1.4" />
                <ellipse cx="58" cy="80" rx="6.5" ry="4" fill="#191c24" stroke="#090a0f" strokeWidth="1.4" />

                {/* 4. HELMET & BUBBLE VISOR */}
                <circle cx="50" cy="34" r="23" fill="url(#chibiSuit)" stroke="#090a0f" strokeWidth="2" />
                <ellipse cx="50" cy="50" rx="15" ry="4.5" fill="url(#collarRim)" stroke="#090a0f" strokeWidth="1.2" />

                {/* Large Cute Bubble Visor (Looking Down-Right) */}
                <ellipse cx="54" cy="34" rx="16" ry="14" fill="#090a0f" />
                <ellipse cx="54" cy="34" rx="14.5" ry="12.5" fill="url(#chibiVisor)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

                {/* Visor Glare & Star Twinkles */}
                <path d="M44 27 Q54 22 64 28 Q55 32 44 27" fill="#ffffff" opacity="0.75" />
                <polygon points="62,36 63,34 65,34 63.5,37 64.5,39 62,37.5 60.5,39 61.5,37 60,34 62,34" fill="#ffffff" opacity="0.8" />
                <circle cx="49" cy="40" r="1.2" fill="#ffffff" opacity="0.6" />

                {/* Side Antenna with Blinking Lime LED */}
                <line x1="28" y1="30" x2="21" y2="16" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
                <circle
                  cx="21"
                  cy="16"
                  r="2.6"
                  fill={isBlinking ? "#ffffff" : "#a8da22"}
                  className="shadow-[0_0_10px_rgba(168,218,34,1)]"
                />

                {/* 5. CELESTIAL GLOWING STAR (Held in front) */}
                <g id="starlight-orb-down" transform="translate(72, 60)">
                  {/* Outer Pulsing Starlight Aura */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="17"
                    fill="url(#beamAura)"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.65, 0.95, 0.65] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Orbiting Stardust Ring */}
                  <ellipse cx="0" cy="0" rx="14" ry="5" stroke="#a8da22" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" transform="rotate(-25)" />

                  {/* Core 5-Pointed Luminous Star */}
                  <motion.path
                    d="M 0 -9 L 2.6 -2.6 L 9 0 L 2.6 2.6 L 0 9 L -2.6 2.6 L -9 0 L -2.6 -2.6 Z"
                    fill="url(#starCoreGlow)"
                    stroke="#ffffff"
                    strokeWidth="0.9"
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Intense Diamond Core Glint */}
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                </g>

                {/* 6. FRONT ARM (Right Arm reaching out holding bottom/front of star) */}
                <path
                  d="M 52 64 Q 60 70 70 66"
                  stroke="url(#chibiSuit)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 52 64 Q 60 70 70 66"
                  stroke="#090a0f"
                  strokeWidth="1.4"
                  fill="none"
                />
                {/* Right Glove Mitten cupping the star */}
                <circle cx="71" cy="65" r="4.8" fill="#475063" stroke="#090a0f" strokeWidth="1.4" />
                {/* Glove Thumb */}
                <circle cx="69" cy="61" r="2.2" fill="#3d4452" />
              </g>
            )}

            {/* ============================================================= */}
            {/* MODE 2: AT BOTTOM OF CONTAINER (LOOKING & SHINING UPWARDS ↗) */}
            {/* ============================================================= */}
            {isAtBottom && (
              <g id="chibi-astro-up">
                {/* 0. SPACECRAFT UMBILICAL SAFETY TETHER (Subtle Wave with Little Zero-G Bump - Opposite Side) */}
                <path
                  d="M 20 50 C 6 42 -8 70 -22 58 C -34 48 -44 66 -56 78"
                  stroke="url(#tetherGradientDown)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="4 3"
                  fill="none"
                />
                {/* Carabiner / Tether Swivel Ring */}
                <circle cx="20" cy="50" r="1.8" fill="#a8da22" stroke="#090a0f" strokeWidth="0.8" />

                {/* 1. JETPACK BACKPACK */}
                <rect x="20" y="46" width="13" height="26" rx="4" fill="url(#chibiPuff)" stroke="#090a0f" strokeWidth="1.5" />
                <line x1="26.5" y1="48" x2="26.5" y2="70" stroke="#090a0f" strokeWidth="1" />
                {/* Thruster Nozzle & Plasma Flame */}
                <polygon points="21,72 31,72 33,78 19,78" fill="#1e293b" stroke="#090a0f" strokeWidth="1" />
                <motion.ellipse
                  cx="26"
                  cy="84"
                  rx="4.5"
                  ry="6"
                  fill="url(#thrusterPlasma)"
                  animate={{ ry: [4.5, 7.5, 4.5], opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />

                {/* 2. BACK ARM (Left Arm reaching up towards the star) */}
                <path
                  d="M 38 66 Q 48 52 64 48"
                  stroke="url(#chibiSuit)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 38 66 Q 48 52 64 48"
                  stroke="#090a0f"
                  strokeWidth="1.4"
                  fill="none"
                />
                {/* Left Glove Mitten */}
                <circle cx="65" cy="48" r="4.5" fill="#475063" stroke="#090a0f" strokeWidth="1.4" />

                {/* 3. ASTRONAUT BODY & LIFE SUPPORT */}
                <ellipse cx="48" cy="70" rx="19" ry="17" fill="url(#chibiSuit)" stroke="#090a0f" strokeWidth="1.8" />
                
                {/* Chest Life Support Badge */}
                <rect x="42" y="66" width="12" height="9" rx="2.5" fill="#1b2029" stroke="#475569" strokeWidth="0.8" />
                <circle cx="45" cy="70" r="1.3" fill="#a8da22" />
                <circle cx="48.5" cy="70" r="1.3" fill="#38bdf8" />
                <circle cx="52" cy="70" r="1.3" fill="#fb7185" />

                {/* Cute Floating Space Boots */}
                <ellipse cx="38" cy="89" rx="6.5" ry="4" fill="#191c24" stroke="#090a0f" strokeWidth="1.4" />
                <ellipse cx="58" cy="89" rx="6.5" ry="4" fill="#191c24" stroke="#090a0f" strokeWidth="1.4" />

                {/* 4. HELMET & BUBBLE VISOR */}
                <circle cx="50" cy="42" r="23" fill="url(#chibiSuit)" stroke="#090a0f" strokeWidth="2" />
                <ellipse cx="50" cy="58" rx="15" ry="4.5" fill="url(#collarRim)" stroke="#090a0f" strokeWidth="1.2" />

                {/* Large Cute Bubble Visor (Looking Up-Right) */}
                <ellipse cx="54" cy="40" rx="16" ry="14" fill="#090a0f" />
                <ellipse cx="54" cy="40" rx="14.5" ry="12.5" fill="url(#chibiVisor)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

                {/* Visor Glare & Star Twinkles */}
                <path d="M44 33 Q54 28 64 34 Q55 38 44 33" fill="#ffffff" opacity="0.75" />
                <polygon points="62,42 63,40 65,40 63.5,43 64.5,45 62,43.5 60.5,45 61.5,43 60,40 62,40" fill="#ffffff" opacity="0.8" />
                <circle cx="49" cy="46" r="1.2" fill="#ffffff" opacity="0.6" />

                {/* Side Antenna with Blinking Lime LED */}
                <line x1="28" y1="38" x2="21" y2="24" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
                <circle
                  cx="21"
                  cy="24"
                  r="2.6"
                  fill={isBlinking ? "#ffffff" : "#a8da22"}
                  className="shadow-[0_0_10px_rgba(168,218,34,1)]"
                />

                {/* 5. CELESTIAL GLOWING STAR (Held in front) */}
                <g id="starlight-orb-up" transform="translate(72, 46)">
                  {/* Outer Pulsing Starlight Aura */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="17"
                    fill="url(#beamAura)"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.65, 0.95, 0.65] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Orbiting Stardust Ring */}
                  <ellipse cx="0" cy="0" rx="14" ry="5" stroke="#a8da22" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" transform="rotate(25)" />

                  {/* Core 5-Pointed Luminous Star */}
                  <motion.path
                    d="M 0 -9 L 2.6 -2.6 L 9 0 L 2.6 2.6 L 0 9 L -2.6 2.6 L -9 0 L -2.6 -2.6 Z"
                    fill="url(#starCoreGlow)"
                    stroke="#ffffff"
                    strokeWidth="0.9"
                    animate={{ rotate: [0, -90, -180, -270, -360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Intense Diamond Core Glint */}
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                </g>

                {/* 6. FRONT ARM (Right Arm reaching up holding bottom of star) */}
                <path
                  d="M 52 68 Q 62 60 70 52"
                  stroke="url(#chibiSuit)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 52 68 Q 62 60 70 52"
                  stroke="#090a0f"
                  strokeWidth="1.4"
                  fill="none"
                />
                {/* Right Glove Mitten cupping the star */}
                <circle cx="71" cy="51" r="4.8" fill="#475063" stroke="#090a0f" strokeWidth="1.4" />
                {/* Glove Thumb */}
                <circle cx="69" cy="47" r="2.2" fill="#3d4452" />
              </g>
            )}
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * FloatingAstroGraphic
 * Standalone zero-G floating astronaut graphic specifically for mobile/tablet footer layouts
 * where the giant interactive text header is hidden.
 */
export function FloatingAstroGraphic({ className = "w-20 h-20", flipped = true }) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 2600);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.div
      animate={{
        y: [0, -9, 0],
        rotate: [0, 3, -2, 0],
      }}
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <div className={`w-full h-full ${flipped ? "-scale-x-100" : ""}`}>
        <svg
          viewBox="-75 -25 190 145"
          className="w-full h-full drop-shadow-[0_14px_32px_rgba(0,0,0,0.95)] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          <linearGradient id="mobChibiSuit" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3d4452" />
            <stop offset="50%" stopColor="#252a34" />
            <stop offset="100%" stopColor="#141720" />
          </linearGradient>

          <linearGradient id="mobChibiPuff" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#556075" />
            <stop offset="100%" stopColor="#1f242d" />
          </linearGradient>

          <linearGradient id="mobChibiVisor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="30%" stopColor="#a8da22" />
            <stop offset="65%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="mobCollarRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <radialGradient id="mobStarCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="75%" stopColor="#a8da22" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="mobThrusterPlasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="85%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="mobBeamAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a8da22" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#a8da22" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <linearGradient id="mobTetherGradientUp" x1="20" y1="40" x2="-56" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a8da22" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#e2e8f0" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g id="mob-chibi-astro">
          {/* Spacecraft Umbilical Tether */}
          <path
            d="M 20 40 C 6 48 -8 20 -22 32 C -34 42 -44 24 -56 12"
            stroke="url(#mobTetherGradientUp)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="4 3"
            fill="none"
          />
          <circle cx="20" cy="40" r="1.8" fill="#a8da22" stroke="#090a0f" strokeWidth="0.8" />

          {/* Jetpack Backpack */}
          <rect x="20" y="36" width="13" height="26" rx="4" fill="url(#mobChibiPuff)" stroke="#090a0f" strokeWidth="1.5" />
          <line x1="26.5" y1="38" x2="26.5" y2="60" stroke="#090a0f" strokeWidth="1" />
          <polygon points="21,62 31,62 33,68 19,68" fill="#1e293b" stroke="#090a0f" strokeWidth="1" />
          <motion.ellipse
            cx="26"
            cy="74"
            rx="4.5"
            ry="6"
            fill="url(#mobThrusterPlasma)"
            animate={{ ry: [4.5, 7.5, 4.5], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />

          {/* Back Arm */}
          <path
            d="M 38 56 Q 48 50 64 56"
            stroke="url(#mobChibiSuit)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 38 56 Q 48 50 64 56"
            stroke="#090a0f"
            strokeWidth="1.4"
            fill="none"
          />
          <circle cx="65" cy="56" r="4.5" fill="#475063" stroke="#090a0f" strokeWidth="1.4" />

          {/* Astronaut Body */}
          <ellipse cx="48" cy="62" rx="19" ry="17" fill="url(#mobChibiSuit)" stroke="#090a0f" strokeWidth="1.8" />
          <rect x="42" y="56" width="12" height="9" rx="2.5" fill="#1b2029" stroke="#475569" strokeWidth="0.8" />
          <circle cx="45" cy="60" r="1.3" fill="#a8da22" />
          <circle cx="48.5" cy="60" r="1.3" fill="#38bdf8" />
          <circle cx="52" cy="60" r="1.3" fill="#fb7185" />

          {/* Space Boots */}
          <ellipse cx="38" cy="80" rx="6.5" ry="4" fill="#191c24" stroke="#090a0f" strokeWidth="1.4" />
          <ellipse cx="58" cy="80" rx="6.5" ry="4" fill="#191c24" stroke="#090a0f" strokeWidth="1.4" />

          {/* Helmet & Visor */}
          <circle cx="50" cy="34" r="23" fill="url(#mobChibiSuit)" stroke="#090a0f" strokeWidth="2" />
          <ellipse cx="50" cy="50" rx="15" ry="4.5" fill="url(#mobCollarRim)" stroke="#090a0f" strokeWidth="1.2" />
          <ellipse cx="54" cy="34" rx="16" ry="14" fill="#090a0f" />
          <ellipse cx="54" cy="34" rx="14.5" ry="12.5" fill="url(#mobChibiVisor)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />

          {/* Visor Glare & Star Twinkles */}
          <path d="M44 27 Q54 22 64 28 Q55 32 44 27" fill="#ffffff" opacity="0.75" />
          <polygon points="62,36 63,34 65,34 63.5,37 64.5,39 62,37.5 60.5,39 61.5,37 60,34 62,34" fill="#ffffff" opacity="0.8" />
          <circle cx="49" cy="40" r="1.2" fill="#ffffff" opacity="0.6" />

          {/* Antenna */}
          <line x1="28" y1="30" x2="21" y2="16" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
          <circle
            cx="21"
            cy="16"
            r="2.6"
            fill={isBlinking ? "#ffffff" : "#a8da22"}
            className="shadow-[0_0_10px_rgba(168,218,34,1)]"
          />

          {/* Celestial Glowing Star */}
          <g transform="translate(72, 60)">
            <motion.circle
              cx="0"
              cy="0"
              r="17"
              fill="url(#mobBeamAura)"
              animate={{ scale: [1, 1.25, 1], opacity: [0.65, 0.95, 0.65] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <ellipse cx="0" cy="0" rx="14" ry="5" stroke="#a8da22" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" transform="rotate(-25)" />
            <motion.path
              d="M 0 -9 L 2.6 -2.6 L 9 0 L 2.6 2.6 L 0 9 L -2.6 2.6 L -9 0 L -2.6 -2.6 Z"
              fill="url(#mobStarCoreGlow)"
              stroke="#ffffff"
              strokeWidth="0.9"
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>

          {/* Front Arm */}
          <path
            d="M 52 64 Q 60 70 70 66"
            stroke="url(#mobChibiSuit)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 52 64 Q 60 70 70 66"
            stroke="#090a0f"
            strokeWidth="1.4"
            fill="none"
          />
          <circle cx="71" cy="65" r="4.8" fill="#475063" stroke="#090a0f" strokeWidth="1.4" />
          <circle cx="69" cy="61" r="2.2" fill="#3d4452" />
        </g>
      </svg>
      </div>
    </motion.div>
  );
}
