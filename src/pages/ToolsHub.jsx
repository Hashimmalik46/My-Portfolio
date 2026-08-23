import { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, FileText, Send, Sparkles } from "lucide-react";

export default function ToolsHub() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Workstation — Hashim Malik";
  }, []);

  const tools = [
    {
      id: "resume-builder",
      name: "ATS Resume Builder",
      description:
        "High-precision ATS resume studio with AI auto-fill generation, 4 curated templates, and instant 1-page PDF export.",
      tags: ["ATS Compliant", "AI Auto-Fill", "Clean PDF", "Interactive Editor"],
      route: "/tools/resume-builder",
      icon: FileText,
    },
    {
      id: "outreach-generator",
      name: "AI Outreach & Cover Letter Studio",
      description:
        "Generate high-converting cold emails, recruiter direct messages, and tailored narrative cover letters with 1-click mail links.",
      tags: ["Cold Emails", "LinkedIn DMs", "Cover Letters", "Follow-Up Sequences"],
      route: "/tools/outreach-generator",
      icon: Send,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#111827] font-jakarta relative selection:bg-black selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 1. Minimal Header */}
      <header className="border-b border-black/[0.08] bg-[#f8f7f3]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer group shrink-0"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform text-black" />
              <span>Portfolio</span>
            </Link>
            <span className="text-black/20 shrink-0">/</span>
            <span className="text-xs font-bold text-[#111827] font-clash tracking-wide truncate">
              Workstation
            </span>
          </div>

          {/* Live Status Capsule */}
          <div className="flex items-center shrink-0">
            <div className="inline-flex items-center rounded-full bg-white border border-black/[0.09] shadow-2xs py-1 px-2.5 sm:px-3 gap-2 hover:border-black/20 transition-all select-none">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#111827] font-clash">
                  Live
                </span>
              </div>
              <div className="h-3 w-px bg-black/10" />
              <span className="text-[10.5px] sm:text-[11px] font-medium text-gray-600 flex items-center gap-1">
                <span className="font-semibold text-black">2</span> Tools
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Minimal Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-8 sm:py-16">
        {/* Editorial Heading */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 border border-black/10 text-[11px] font-semibold text-gray-700 mb-2.5 sm:mb-3">
            <Sparkles size={11} className="text-black" />
            <span>Digital Studio</span>
          </div>
          <h1 className="font-clash text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight">
            Workstation
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-2xl sm:max-w-none font-normal leading-relaxed">
            Curated standalone software and career acceleration utilities engineered by Hashim Malik.
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
                className="group relative rounded-2xl bg-white hover:bg-white border border-black/[0.08] hover:border-black/25 p-4 sm:p-6 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
                  {/* Icon and Main Details */}
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#f8f7f3] border border-black/10 flex items-center justify-center text-black shrink-0 group-hover:scale-105 transition-transform shadow-2xs mt-0.5 sm:mt-0">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Title */}
                      <h2 className="font-clash text-base sm:text-lg font-bold text-[#111827] group-hover:text-black transition-colors">
                        {tool.name}
                      </h2>

                      {/* Summary */}
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-xl">
                        {tool.description}
                      </p>

                      {/* Tag Badges */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 flex-wrap">
                        {tool.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-[10.5px] font-medium text-gray-600 px-2 sm:px-2.5 py-0.5 rounded-md bg-[#f8f7f3] border border-black/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-3 sm:pt-0 border-t border-black/5 sm:border-t-0 flex sm:items-center sm:self-center shrink-0">
                    <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full bg-[#111827] group-hover:bg-black text-xs font-semibold text-white shadow-2xs group-hover:shadow transition-all">
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
      <footer className="border-t border-black/[0.08] py-5 px-4 text-xs text-gray-600 bg-[#f8f7f3]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>Engineered by Hashim Malik</span>
          <Link
            to="/"
            className="text-gray-600 hover:text-black font-medium transition-colors cursor-pointer"
          >
            ← Return to Portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}
