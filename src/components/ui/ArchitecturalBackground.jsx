import React from "react";

/**
 * ArchitecturalBackground
 * A refined, elegant architectural backdrop supporting both cream (light) and dark (obsidian) themes.
 * Features:
 * - Subtle architectural grid pattern with micro-crosshair intersections
 * - Smooth ambient radial glows tailored for light or dark backgrounds
 * - Faint gradient-faded outline typography watermark
 * - Ultra-subtle, non-distracting ambient pinpoint dots at selected intersections
 */
export default function ArchitecturalBackground({
  theme = "light", // 'light' | 'dark'
  density = "minimal", // 'minimal' | 'extended'
  watermarkText = "ABOUT",
  watermarkPosition = "top-right", // 'top-right' | 'top-left' | 'bottom-right' | 'center'
}) {
  const isDark = theme === "dark";
  const isExtended = density === "extended";

  // Breathing pinpoint dot capped at max 70% brightness
  const dotClass = isDark
    ? "w-1.5 h-1.5 rounded-full bg-[#a8da22]/65 shadow-[0_0_3px_rgba(168,218,34,0.25)] opacity-70 animate-pulse"
    : "w-1.5 h-1.5 rounded-full bg-[#a8da22]/65 shadow-[0_0_3px_rgba(168,218,34,0.2)] opacity-70 animate-pulse";

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 isolate"
    >
      {/* 1. Architectural Grid Pattern (80px x 80px) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-100"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`arch-grid-${theme}-${watermarkText.toLowerCase()}`}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Subtle Grid Lines */}
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={isDark ? "rgba(255, 255, 255, 0.045)" : "rgba(28, 25, 23, 0.055)"}
              strokeWidth="1"
            />
            {/* Minimal architectural crosshair at intersections */}
            <path
              d="M -4 0 L 4 0 M 0 -4 L 0 4"
              fill="none"
              stroke={isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(28, 25, 23, 0.12)"}
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#arch-grid-${theme}-${watermarkText.toLowerCase()})`}
        />
      </svg>

      {/* 2. Soft Ambient Radial Glows */}
      {isDark ? (
        <>
          {/* Top-Left Subtle Lime Glow */}
          <div className="absolute -top-24 -left-24 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,218,34,0.06)_0%,transparent_60%)] blur-3xl" />

          {/* Bottom-Right Deep Ambient Moonlight Glow */}
          <div className="absolute -bottom-24 -right-24 w-[520px] sm:w-[700px] h-[520px] sm:h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_60%)] blur-3xl" />

          {/* Top-Right Ambient Lime Accent */}
          <div className="absolute top-1/4 -right-16 w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,218,34,0.04)_0%,transparent_60%)] blur-2xl" />
        </>
      ) : (
        <>
          {/* Top-Left Champagne Glow */}
          <div className="absolute -top-24 -left-24 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(247,233,215,0.7)_0%,transparent_60%)] blur-2xl" />

          {/* Bottom-Right Warm Ivory Glow */}
          <div className="absolute -bottom-24 -right-24 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,228,208,0.65)_0%,transparent_60%)] blur-2xl" />

          {/* Top-Right Signature Subtle Lime Ambience */}
          <div className="absolute top-1/4 -right-16 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,218,34,0.045)_0%,transparent_60%)] blur-2xl" />
        </>
      )}

      {/* 3. Smooth Gradient Fading Background Typography Watermark */}
      <div
        className={`absolute font-longsile uppercase tracking-[0.06em] select-none pointer-events-none leading-none z-0 ${
          watermarkPosition === "top-right"
            ? "top-6 sm:top-10 -right-4 sm:-right-8"
            : watermarkPosition === "top-left"
            ? "top-6 sm:top-10 -left-4 sm:-left-8"
            : watermarkPosition === "bottom-left"
            ? "bottom-8 sm:bottom-12 -left-4 sm:-left-8"
            : "top-12 left-1/2 -translate-x-1/2"
        }`}
        style={{
          fontSize: "clamp(6.5rem, 16vw, 15rem)",
          backgroundImage: isDark
            ? "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0) 100%)"
            : "linear-gradient(180deg, rgba(28, 25, 23, 0.06) 0%, rgba(28, 25, 23, 0.02) 60%, rgba(28, 25, 23, 0) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: isDark
            ? "1px rgba(255, 255, 255, 0.04)"
            : "1px rgba(28, 25, 23, 0.035)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 90%)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 90%)",
        }}
      >
        {watermarkText}
      </div>

      {/* 4. Minimal Soft Pinpoint Dots (Subtle ambient presence) */}
      {/* Node 1: Top-Left Region */}
      <div className="absolute top-[160px] left-[80px] sm:left-[160px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className={dotClass} />
      </div>

      {/* Node 2: Top-Right Region */}
      <div className="absolute top-[240px] right-[80px] sm:right-[160px] translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className={dotClass} />
      </div>

      {/* Node 3: Bottom-Right Region */}
      <div className="absolute bottom-[240px] right-[80px] sm:right-[240px] translate-x-1/2 translate-y-1/2 flex items-center justify-center">
        <span className={dotClass} />
      </div>

      {/* Node 4: Bottom-Left Region */}
      <div className="absolute bottom-[160px] left-[80px] sm:left-[160px] -translate-x-1/2 translate-y-1/2 hidden sm:flex items-center justify-center">
        <span className={dotClass} />
      </div>

      {/* 5. Extended Density Nodes (Only enabled when density="extended", e.g. for Projects) */}
      {isExtended && (
        <>
          {/* Node 5: Upper Mid-Left */}
          <div className="absolute top-[480px] left-[80px] sm:left-[240px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className={dotClass} />
          </div>

          {/* Node 6: Upper Mid-Right */}
          <div className="absolute top-[560px] right-[80px] sm:right-[240px] translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className={dotClass} />
          </div>

          {/* Node 7: 35% Scroll Margin Right */}
          <div className="absolute top-[35%] right-[60px] sm:right-[140px] translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className={dotClass} />
          </div>

          {/* Node 8: 55% Mid-Section Left */}
          <div className="absolute top-[55%] left-[80px] sm:left-[180px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className={dotClass} />
          </div>

          {/* Node 9: 75% Lower Section Right */}
          <div className="absolute top-[75%] right-[80px] sm:right-[200px] translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className={dotClass} />
          </div>
        </>
      )}
    </div>
  );
}
