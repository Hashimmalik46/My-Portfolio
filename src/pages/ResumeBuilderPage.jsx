import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StandaloneResumeBuilder from "../components/StandaloneResumeBuilder";

export default function ResumeBuilderPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "ATS Resume Studio — Workstation | Hashim Malik";
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#111827] font-jakarta flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Sleek Minimal Header */}
      <header className="border-b border-black/[0.08] bg-[#f8f7f3]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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
              ATS Resume Studio
            </span>
          </div>
        </div>
      </header>

      {/* Main Resume Builder Content Area */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-3 sm:p-6">
        <StandaloneResumeBuilder standalone={true} />
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="border-t border-black/[0.08] py-4 px-4 text-xs text-gray-600 bg-[#f8f7f3]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Engineered by Hashim Malik</span>
          <div className="flex items-center gap-4">
            <Link
              to="/tools"
              className="text-gray-600 hover:text-black font-medium transition-colors cursor-pointer"
            >
              Workstation
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
