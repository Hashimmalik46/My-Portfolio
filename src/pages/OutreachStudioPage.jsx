import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OutreachStudio from "../components/OutreachStudio";

export default function OutreachStudioPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "AI Cold Outreach & Cover Letter Studio — Workstation | Hashim Malik";
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#111827] font-jakarta flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Sleek Minimal Header */}
      <header className="border-b border-black/[0.08] bg-[#f8f7f3]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/tools"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer group"
              title="Return to Workstation"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-black" />
              <span>Workstation</span>
            </Link>
            <span className="text-black/20">/</span>
            <span className="text-xs font-bold text-[#111827] font-clash tracking-wide">
              Outreach Studio
            </span>
          </div>

          <Link
            to="/"
            className="text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            Portfolio Home
          </Link>
        </div>
      </header>

      {/* Main Studio Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full mx-auto px-4 py-3 sm:py-5">
        <OutreachStudio />
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="border-t border-black/[0.08] py-4 px-4 text-xs text-gray-600 bg-[#f8f7f3]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Engineered by Hashim Malik</span>
          <div className="flex items-center gap-4">
            <Link
              to="/tools"
              className="text-gray-600 hover:text-black font-medium transition-colors cursor-pointer"
            >
              Workstation
            </Link>
            <Link
              to="/tools/resume-builder"
              className="text-gray-600 hover:text-black font-medium transition-colors cursor-pointer"
            >
              Resume Builder
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-black font-medium transition-colors cursor-pointer"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
