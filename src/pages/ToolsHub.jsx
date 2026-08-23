import { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Wrench } from "lucide-react";
import { portfolioData } from "../data/portfolioData";
import ThemeToggle from "../components/ThemeToggle";

export default function ToolsHub() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Workstation — Hashim Malik";
  }, []);

  const tools = portfolioData?.workstation?.tools || [];

  return (
    <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#08090d] text-[#111827] dark:text-[#f3f4f6] font-jakarta relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col justify-between overflow-x-hidden transition-colors duration-200">
      {/* 1. Minimal Header */}
      <header className="border-b border-black/[0.08] dark:border-white/[0.08] bg-[#f8f7f3]/90 dark:bg-[#08090d]/90 backdrop-blur-md sticky top-0 z-20 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left: Brand Identity & Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link
              to="/"
              className="font-khuma text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-wider hover:opacity-75 transition-opacity select-none shrink-0"
              title={`${portfolioData?.personal?.name || "Hash"} Portfolio`}
            >
              {portfolioData?.nav?.logoText || "Hash"}
            </Link>
            <span className="text-black/25 dark:text-white/25 shrink-0 font-normal text-xs select-none">/</span>
            <span className="text-xs font-bold text-[#111827] dark:text-white font-clash tracking-wide truncate translate-y-[1px] pl-1 pr-0.5">
              {portfolioData?.workstation?.title || "Workstation"}
            </span>
          </div>

          {/* Right: Theme Toggle & Portfolio Link */}
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle variant="minimal" />
            <Link
              to="/"
              className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer group shrink-0"
              title="Return to portfolio"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform text-black dark:text-white" />
              <span>Portfolio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Minimal Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-8 sm:py-16">
        {/* Editorial Heading */}
        <div className="mb-8 sm:mb-12">
          {/* Editorial Eyebrow matching Portfolio Sections */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3.5">
            <span className="w-6 h-6 rounded-full bg-[#111827] dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
              <Wrench size={11} strokeWidth={2.2} />
            </span>
            <span className="w-5 sm:w-6 h-px bg-black/20 dark:bg-white/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-black/60 dark:text-white/60 font-semibold">
              {portfolioData?.workstation?.eyebrow || "DIGITAL STUDIO"}
            </span>
          </div>
          <h1 className="font-clash text-2xl sm:text-4xl font-bold text-[#111827] dark:text-white tracking-tight">
            {portfolioData?.workstation?.title || "Workstation"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1.5 max-w-2xl sm:max-w-none font-normal leading-relaxed">
            {portfolioData?.workstation?.subtitle || "Curated standalone software and career acceleration utilities engineered by Hashim Malik."}
          </p>
        </div>

        {/* Responsive Minimal Tool Directory */}
        <div className="space-y-3.5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(tool.route)}
                className="group relative rounded-2xl bg-white dark:bg-[#11131b] hover:bg-white dark:hover:bg-[#151822] border border-black/[0.08] dark:border-white/[0.08] hover:border-black/25 dark:hover:border-white/25 p-4 sm:p-6 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
                  {/* Icon and Main Details */}
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#f8f7f3] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white shrink-0 group-hover:scale-105 transition-transform shadow-2xs mt-0.5 sm:mt-0">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Title */}
                      <h2 className="font-clash text-base sm:text-lg font-bold text-[#111827] dark:text-white group-hover:text-black dark:group-hover:text-pAccent transition-colors">
                        {tool.name}
                      </h2>

                      {/* Summary */}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed max-w-xl">
                        {tool.description}
                      </p>

                      {/* Tag Badges */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 flex-wrap">
                        {tool.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-[10.5px] font-medium text-gray-600 dark:text-gray-300 px-2 sm:px-2.5 py-0.5 rounded-md bg-[#f8f7f3] dark:bg-white/[0.05] border border-black/5 dark:border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-3 sm:pt-0 border-t border-black/5 dark:border-white/5 sm:border-t-0 flex sm:items-center sm:self-center shrink-0">
                    <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full bg-[#111827] group-hover:bg-black dark:bg-white dark:group-hover:bg-gray-100 text-xs font-semibold text-white dark:text-black shadow-2xs group-hover:shadow transition-all">
                      <span>Open App</span>
                      <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 3. Minimal Footer */}
      <footer className="border-t border-black/[0.08] dark:border-white/[0.08] py-5 sm:py-6 px-3.5 sm:px-6 text-xs text-gray-500 dark:text-gray-400 bg-[#f8f7f3] dark:bg-[#08090d] transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          {/* Left: Attribution */}
          <div className="flex items-center gap-2">
            <span className="font-khuma text-base font-bold text-[#111827] dark:text-white tracking-wider">
              Hash
            </span>
            <span className="text-black/20 dark:text-white/20 font-light">•</span>
            <span className="text-gray-600 dark:text-gray-400">Engineered by Hashim Malik</span>
          </div>

          {/* Center: Subtle Live Status */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium select-none">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  portfolioData?.workstation?.isOnline !== false ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  portfolioData?.workstation?.isOnline !== false ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            <span>{portfolioData?.workstation?.status || "All systems operational"}</span>
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
