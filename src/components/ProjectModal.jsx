import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, Github, Code2 } from "lucide-react";
import { motion } from "motion/react";

/**
 * Executive Project Architecture Spotlight Modal
 * Designed with an editorial, minimalist Apple/Linear design system.
 * Optimized for Safari/WebKit with dedicated GPU compositing and smooth exit transitions.
 */
export default function ProjectModal({ isOpen, onClose, project }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.lenis?.stop();
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.lenis?.start();
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen, onClose]);

  if (!project || typeof document === "undefined") return null;

  const modalJSX = (
    <div
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden pointer-events-auto select-auto font-jakarta isolate touch-none"
    >
      {/* Backdrop Blur (Hardware-accelerated with instant WebKit click response) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md sm:backdrop-blur-lg transform-gpu cursor-pointer touch-manipulation select-none"
        style={{
          WebkitBackdropFilter: "blur(16px)",
          WebkitTransform: "translate3d(0,0,0)",
        }}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl h-[88dvh] sm:h-[660px] max-h-[92dvh] sm:max-h-[90vh] bg-[#0c0d12] border border-white/[0.14] rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col z-10 overflow-hidden transform-gpu"
        style={{
          WebkitTransform: "translate3d(0,0,0)",
        }}
      >
        {/* 1. Header Bar */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.08] bg-[#090a0f] gap-2 select-none">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-1">
            <span className="text-[10px] font-clashM tracking-[0.12em] sm:tracking-[0.2em] uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-pAccent font-semibold shrink-0 whitespace-nowrap">
              {project.category}
            </span>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/20 shrink-0" />
            <span className="text-[11px] sm:text-xs text-white/60 font-medium truncate">
              Architecture Spotlight
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] active:scale-90 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer touch-manipulation"
          >
            <X size={14} />
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        <div
          className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 min-h-0 space-y-5 sm:space-y-7 overscroll-contain touch-pan-y"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.18) transparent",
          }}
        >
          {/* Media Preview Banner */}
          <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-[#050608] border border-white/[0.1] shadow-2xl p-1.5 sm:p-2 group">
            <img
              src={project.img2 || project.img}
              alt={project.title}
              className="w-full h-full object-contain rounded-lg sm:rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-lg sm:rounded-xl" />
          </div>

          {/* Title & Overview */}
          <div>
            <h3 className="font-clash text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 sm:mb-3">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-white/75 leading-relaxed font-normal">
              {project.full_desc || project.short_desc}
            </p>
          </div>

          {/* Engineering Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                <span>Key Engineering Decisions</span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                {project.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] transition-colors"
                  >
                    <span className="text-[10px] sm:text-[11px] font-clashM text-pAccent font-bold mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-white/85 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              <Code2 className="w-3.5 h-3.5 text-pAccent" />
              <span>Technologies & Tools</span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/[0.1] text-[11px] sm:text-xs text-white/90 font-medium hover:border-white/20 transition-colors shadow-sm"
                >
                  <img
                    src={tag.img}
                    alt={tag.tag}
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{tag.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Action Footer */}
        <div className="shrink-0 flex items-center justify-between gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-white/[0.08] bg-[#090a0f]">
          {/* GitHub Link */}
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Github size={14} className="text-white/80" />
              <span>Source Code</span>
            </a>
          ) : (
            <div />
          )}

          {/* Live Demo Site */}
          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-pAccent text-black font-clash font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.12)]"
            >
              <span>Visit</span>
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
