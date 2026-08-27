import { ArrowUpRight, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import TypewriterText from "./ui/TypewriterText";
import { portfolioData } from "../data/portfolioData";

export default function WorkstationSection() {
  const { workstation } = portfolioData;

  return (
    <div
      id="Workstation"
      className="relative w-full overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 px-4 sm:px-8 md:px-16 py-5 sm:py-6 md:py-7 bg-[#070709] border-y border-white/10 z-20 select-none"
    >
      {/* Left: Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="font-longsile text-2xl sm:text-3xl md:text-4xl text-white tracking-wide">
            {workstation?.title || "Workstation"}
          </span>
          <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-pAccent shrink-0 animate-pulse" strokeWidth={2.2} />
        </div>

        <span className="hidden sm:inline w-px h-5 bg-white/20 shrink-0" />

        <p className="font-cormorant italic text-lg sm:text-xl md:text-2xl text-white/80 font-light leading-snug">
          <TypewriterText
            text={
              workstation?.subtitle ||
              "A curated suite of practical tools and AI-powered utilities for work, creativity, and everyday tasks."
            }
            cursorClassName="text-pAccent"
          />
        </p>
      </div>

      {/* Right: Explore CTA Button */}
      <div className="shrink-0 flex items-center self-start md:self-auto">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 px-5 py-2 sm:py-2.5 rounded-full bg-pAccent hover:bg-[#b8f030] text-black text-xs font-bold font-jakarta transition-all shadow-md hover:scale-105"
        >
          <span>Explore</span>
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
