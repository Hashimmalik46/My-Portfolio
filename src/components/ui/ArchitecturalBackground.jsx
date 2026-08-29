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
      {/* 0. Real Photographic Paper Texture Layer (Light / Cream Sections) */}
      {!isDark && (
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <img
            src="/Texturelabs_Paper_313M.jpg"
            alt=""
            className="w-full h-full object-cover opacity-[0.22] mix-blend-multiply"
            loading="eager"
          />
        </div>
      )}

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
              stroke={isDark ? "rgba(255, 255, 255, 0.035)" : "rgba(28, 25, 23, 0.095)"}
              strokeWidth="1"
            />
            {/* Minimal architectural crosshair at intersections */}
            <path
              d="M -4 0 L 4 0 M 0 -4 L 0 4"
              fill="none"
              stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(28, 25, 23, 0.18)"}
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
          {/* Node 5: Top Outer Mid-Left */}
          <div className="absolute top-[320px] left-[80px] sm:left-[180px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className={dotClass} />
          </div>

          {/* Node 6: Top Outer Mid-Right */}
          <div className="absolute top-[320px] right-[80px] sm:right-[180px] translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className={dotClass} />
          </div>
        </>
      )}

      {/* 6. Precision Mathematical & Architectural Drafting Equipment (For Dark/Projects Section - Top & Bottom ONLY) */}
      {isDark && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
          {/* === TOP REGION (Header Area) === */}
          
          {/* Top-Left Tool: Drafting Compass with Measured Angle Arc */}
          <svg
            className="absolute top-[150px] sm:top-[190px] left-[2%] sm:left-[5%] w-[200px] sm:w-[260px] h-[200px] sm:h-[260px] opacity-[0.12] sm:opacity-[0.15] text-white overflow-visible"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Pivot Origin & Crosshair */}
            <circle cx="50" cy="150" r="2.5" fill="#a8da22" />
            <path d="M 40 150 L 60 150 M 50 140 L 50 160" stroke="rgba(168,218,34,0.5)" strokeWidth="0.8" />
            
            {/* Compass Joint Hinge at Top */}
            <circle cx="100" cy="40" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="#000" />
            <circle cx="100" cy="40" r="2" fill="#a8da22" />
            
            {/* Compass Needle Leg */}
            <path d="M 100 40 L 50 150" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            
            {/* Compass Pencil Leg */}
            <path d="M 100 40 L 160 140" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            <circle cx="160" cy="140" r="2" fill="#a8da22" />
            
            {/* Measured Angle Arc */}
            <path d="M 160 140 A 110 110 0 0 0 95 48" stroke="rgba(168,218,34,0.3)" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Angle & Radius Dimension Annotation */}
            <text x="110" y="110" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">R = 120.0 mm</text>
            <text x="95" y="130" fill="rgba(168,218,34,0.45)" fontSize="8" fontFamily="monospace">θ = 54.7°</text>
          </svg>

          {/* Top-Right Tool: Drafting Triangle / Set Square 30°-60°-90° */}
          <svg
            className="absolute top-[50px] sm:top-[70px] right-[2%] sm:right-[5%] w-[190px] sm:w-[250px] h-[190px] sm:h-[250px] opacity-[0.11] sm:opacity-[0.14] text-white overflow-visible"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Outer Triangle */}
            <polygon points="30,170 170,170 170,30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="rgba(255,255,255,0.01)" />
            
            {/* Inner Triangle Cutout */}
            <polygon points="65,145 145,145 145,65" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            
            {/* Millimeter Hash Marks along Base */}
            <path d="M 40 170 L 40 164 M 50 170 L 50 162 M 60 170 L 60 164 M 70 170 L 70 162 M 80 170 L 80 164 M 90 170 L 90 162 M 100 170 L 100 160 M 110 170 L 110 162 M 120 170 L 120 164 M 130 170 L 130 162 M 140 170 L 140 164 M 150 170 L 150 160 M 160 170 L 160 164" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            
            {/* Millimeter Hash Marks along Vertical Leg */}
            <path d="M 170 40 L 164 40 M 170 50 L 162 50 M 170 60 L 164 60 M 170 70 L 162 70 M 170 80 L 164 80 M 170 90 L 162 90 M 170 100 L 160 100 M 170 110 L 162 110 M 170 120 L 164 120 M 170 130 L 162 130 M 170 140 L 164 140 M 170 150 L 160 150 M 170 160 L 164 160" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            
            {/* Angle Spec Labels */}
            <text x="45" y="160" fill="rgba(168,218,34,0.4)" fontSize="8" fontFamily="monospace">45°</text>
            <text x="148" y="55" fill="rgba(168,218,34,0.4)" fontSize="8" fontFamily="monospace">45°</text>
            <text x="145" y="162" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">90°</text>
          </svg>

          {/* === BOTTOM REGION (Below Cards) === */}

          {/* Bottom-Left Tool: Minimal Harmonic Sine Wave */}
          <svg
            className="absolute bottom-[40px] sm:bottom-[60px] left-[3%] sm:left-[6%] w-[180px] sm:w-[220px] h-[70px] sm:h-[90px] opacity-[0.10] sm:opacity-[0.13] text-white overflow-visible hidden sm:block"
            viewBox="0 0 200 80"
            fill="none"
          >
            {/* Center Zero Axis */}
            <path d="M 10 40 L 190 40" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            {/* Vertical Axis */}
            <path d="M 30 10 L 30 70" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            
            {/* Smooth Harmonic Sinusoidal Wave */}
            <path
              d="M 30 40 Q 55 10 80 40 T 130 40 T 180 40"
              stroke="#a8da22"
              strokeWidth="1.2"
              strokeOpacity="0.4"
              fill="none"
            />
            {/* Formula Annotation */}
            <text x="85" y="24" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace">y = A·sin(ωt)</text>
          </svg>

          {/* Bottom-Right Tool: Cartesian 3D Coordinate Axis */}
          <svg
            className="absolute bottom-[40px] sm:bottom-[60px] right-[3%] sm:right-[6%] w-[130px] sm:w-[160px] h-[130px] sm:h-[160px] opacity-[0.11] sm:opacity-[0.14] text-white overflow-visible"
            viewBox="0 0 140 140"
            fill="none"
          >
            {/* Origin & Axis Lines */}
            <circle cx="40" cy="100" r="2.5" fill="#a8da22" />
            {/* X-Axis */}
            <path d="M 40 100 L 120 100" stroke="rgba(168,218,34,0.45)" strokeWidth="1.2" />
            <path d="M 114 96 L 120 100 L 114 104" fill="rgba(168,218,34,0.5)" />
            <text x="125" y="104" fill="rgba(168,218,34,0.5)" fontSize="9" fontFamily="monospace">X</text>
            
            {/* Y-Axis */}
            <path d="M 40 100 L 40 20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
            <path d="M 36 26 L 40 20 L 44 26" fill="rgba(255,255,255,0.4)" />
            <text x="36" y="14" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">Y</text>
            
            {/* Z-Axis (Isometric Depth) */}
            <path d="M 40 100 L 10 130" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="4" y="138" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">Z</text>
            
            {/* Coordinate Origin Spec */}
            <text x="48" y="118" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">(0, 0, 0)</text>
          </svg>
        </div>
      )}
    </div>
  );
}
