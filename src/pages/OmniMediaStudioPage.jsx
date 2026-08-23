import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolioData";
import OmniMediaStudio from "../components/OmniMediaStudio";
import ThemeToggle from "../components/ThemeToggle";

export default function OmniMediaStudioPage() {
  const toolInfo = portfolioData?.workstation?.tools?.find((t) => t.id === "media-converter");
  const toolName = toolInfo?.name || "Image & PDF Studio";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${toolName} — Workstation | ${portfolioData?.personal?.name || "Hashim Malik"}`;
  }, [toolName]);

  return (
    <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#08090d] text-[#111827] dark:text-[#f3f4f6] font-jakarta flex flex-col justify-between selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      {/* Sleek Minimal Header */}
      <header className="border-b border-black/[0.08] dark:border-white/[0.08] bg-[#f8f7f3]/90 dark:bg-[#08090d]/90 backdrop-blur-md sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left: Return to Workstation & Tool Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link
              to="/tools"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer group shrink-0"
              title="Return to Workstation"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-black dark:text-white" />
              <span>{portfolioData?.workstation?.title || "Workstation"}</span>
            </Link>
            <span className="text-black/25 dark:text-white/25 shrink-0 font-normal text-xs select-none">/</span>
            <span className="text-xs font-bold text-[#111827] dark:text-white font-clash tracking-wide truncate translate-y-[1px] pl-1 pr-0.5">
              {toolName}
            </span>
          </div>

          {/* Right: Theme Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle variant="minimal" />
          </div>
        </div>
      </header>

      {/* Main Studio Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full mx-auto px-4 py-3 sm:py-5">
        <OmniMediaStudio />
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="border-t border-black/[0.08] dark:border-white/[0.08] py-5 sm:py-6 px-3.5 sm:px-6 text-xs text-gray-500 dark:text-gray-400 bg-[#f8f7f3] dark:bg-[#08090d] transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          {/* Left: Attribution */}
          <div className="flex items-center gap-2">
            <span className="font-khuma text-base font-bold text-[#111827] dark:text-white tracking-wider">
              {portfolioData?.nav?.logoText || "Hash"}
            </span>
            <span className="text-black/20 dark:text-white/20 font-light">•</span>
            <span className="text-gray-600 dark:text-gray-400">Engineered by {portfolioData?.personal?.name || "Hashim Malik"}</span>
          </div>

          {/* Center: Live Specific Tool Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium select-none">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>{toolName}</span>
          </div>

          {/* Right: Quick Links */}
          <div className="flex items-center gap-3 sm:gap-4 font-medium text-gray-600 dark:text-gray-400">
            {portfolioData?.socials?.github && (
              <a
                href={portfolioData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                GitHub
              </a>
            )}
            {portfolioData?.socials?.linkedin && (
              <a
                href={portfolioData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            )}
            <Link
              to="/"
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 font-semibold text-[#111827] dark:text-white"
            >
              <span>Portfolio</span>
              <ArrowUpRight size={11} className="shrink-0" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
