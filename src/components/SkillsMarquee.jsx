import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Code2 } from "lucide-react";
import { portfolioData } from "../data/portfolioData";

function SkillsMarquee() {
  const { skills } = portfolioData;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "100px 0px" });

  // Quadruple items to guarantee a seamless continuous infinite strip
  const marqueeItems = [...skills, ...skills, ...skills, ...skills];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex items-center bg-[#070709] border-y border-white/10 z-20 select-none"
    >
      {/* Left Title in Longsile Font */}
      <div className="relative z-30 flex items-center gap-3 pl-6 sm:pl-10 md:pl-16 pr-4 sm:pr-8 py-5 sm:py-6 bg-[#070709] shrink-0">
        <span className="font-longsile text-3xl sm:text-4xl md:text-5xl text-white tracking-wide">
          Skills
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-pulse" />
      </div>

      {/* Smooth Fade Transition from Title */}
      <div className="absolute left-[120px] sm:left-[170px] md:left-[220px] top-0 bottom-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent z-20 pointer-events-none" />

      {/* Right Edge Smooth Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-48 bg-gradient-to-l from-black via-black/85 to-transparent z-20 pointer-events-none" />

      {/* Infinite Scrolling Track Emerging from Beneath */}
      <div className="relative flex-1 overflow-hidden py-5 sm:py-6">
        <motion.div
          animate={isInView ? { x: ["0%", "-50%"] } : { x: "0%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 16,
          }}
          className="flex items-center gap-6 sm:gap-8 md:gap-14 whitespace-nowrap will-change-transform"
        >
          {marqueeItems.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-8 md:gap-14">
              <span className="font-clash text-xl sm:text-2xl md:text-3xl uppercase tracking-wider text-white/85 hover:text-pAccent transition-colors duration-200">
                {skill}
              </span>
              <Code2 className="w-4 h-4 text-pAccent opacity-85 shrink-0" strokeWidth={2.2} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default SkillsMarquee;
