import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Code2 } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

function SkillsMarquee() {
  const { skills } = portfolioData;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "200px 0px" });

  // Standard skills array per track for clean, relaxed pacing
  const trackSkills = skills;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex items-center bg-[#070709] border-y border-white/10 z-20 select-none"
    >
      {/* Left Title in Longsile Font */}
      <div className="relative z-30 flex items-center gap-2.5 sm:gap-3 pl-4 sm:pl-8 md:pl-16 pr-3 sm:pr-6 md:pr-8 py-4 sm:py-5 md:py-6 bg-[#070709] shrink-0">
        <span className="font-longsile text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-wide">
          Skills
        </span>
        <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-pAccent shrink-0 animate-pulse" strokeWidth={2.2} />
      </div>

      {/* Infinite Scrolling Track Area */}
      <div className="relative flex-1 overflow-hidden py-4 sm:py-5 md:py-6 flex items-center">
        {/* Left Fade Transition right after title */}
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 md:w-24 bg-gradient-to-r from-[#070709] to-transparent z-10 pointer-events-none" />

        {/* Right Edge Smooth Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-[#070709] via-[#070709]/80 to-transparent z-10 pointer-events-none" />

        {/* Seamless Dual Loop Container */}
        <div className="flex w-max shrink-0">
          <motion.div
            animate={isInView ? { x: ["0%", "-100%"] } : { x: "0%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 55,
            }}
            className="flex shrink-0 items-center gap-6 sm:gap-8 md:gap-12 pr-6 sm:pr-8 md:pr-12 will-change-transform"
          >
            {trackSkills.map((skill, idx) => (
              <div key={`track1-${idx}`} className="flex items-center gap-6 sm:gap-8 md:gap-12 shrink-0">
                <span className="font-clash text-lg sm:text-2xl md:text-3xl uppercase tracking-wider text-white/85 hover:text-pAccent transition-colors duration-200">
                  {skill}
                </span>
                <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pAccent opacity-85 shrink-0" strokeWidth={2.2} />
              </div>
            ))}
          </motion.div>

          <motion.div
            animate={isInView ? { x: ["0%", "-100%"] } : { x: "0%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 55,
            }}
            className="flex shrink-0 items-center gap-6 sm:gap-8 md:gap-12 pr-6 sm:pr-8 md:pr-12 will-change-transform"
          >
            {trackSkills.map((skill, idx) => (
              <div key={`track2-${idx}`} className="flex items-center gap-6 sm:gap-8 md:gap-12 shrink-0">
                <span className="font-clash text-lg sm:text-2xl md:text-3xl uppercase tracking-wider text-white/85 hover:text-pAccent transition-colors duration-200">
                  {skill}
                </span>
                <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pAccent opacity-85 shrink-0" strokeWidth={2.2} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SkillsMarquee;
