import React, { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";

export default function WorkstationSection() {
  const containerRef = useRef(null);

  // Scroll Trigger Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Dual Row Scroll Parallax: Row 1 moves Right to Left, Row 2 moves Left to Right
  const x1 = useTransform(scrollYProgress, [0, 1], ["5%", "-35%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-35%", "5%"]);

  return (
    <div
      id="Workstation"
      ref={containerRef}
      className="relative w-full overflow-hidden py-10 sm:py-14 md:py-16 bg-[#070709] border-y border-white/10 flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center select-none z-20"
    >
      {/* Left Edge Smooth Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent z-20 pointer-events-none" />

      {/* Right Edge Smooth Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-40 md:w-56 bg-gradient-to-l from-[#070709] via-[#070709]/95 to-transparent z-20 pointer-events-none" />

      {/* Row 1: Workstation (Right to Left Parallax) */}
      <motion.div
        style={{ x: x1 }}
        className="flex items-center gap-6 sm:gap-10 md:gap-14 whitespace-nowrap will-change-transform"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`workstation-${i}`} className="flex items-center gap-6 sm:gap-10 md:gap-14 shrink-0">
            <span
              className={`font-clashM text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide leading-none transition-colors duration-200 ${
                i % 2 === 0 ? "text-white" : "text-pAccent"
              }`}
            >
              {i % 2 === 0 ? "Workstation" : "Tools"}
            </span>
            <ArrowUpRight
              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0 transition-colors duration-200 ${
                i % 2 !== 0 ? "text-pAccent" : "text-white/40"
              }`}
              strokeWidth={2.2}
            />
          </div>
        ))}
      </motion.div>

      

      {/* Minimal Explore CTA Button Pinned on the Right */}
      <div className="absolute right-4 sm:right-8 md:right-16 z-30 flex items-center">
        <Link
          to="/tools"
          className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/[0.08] hover:bg-pAccent text-white hover:text-black border border-white/15 hover:border-pAccent text-xs sm:text-sm font-semibold font-jakarta backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105"
        >
          <span>Explore</span>
          <ArrowUpRight
            size={14}
            strokeWidth={2.5}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
