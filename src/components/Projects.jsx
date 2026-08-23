import React, { useState, lazy, Suspense, useCallback } from "react";
import { ArrowUpRight, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { portfolioData } from "../data/portfolioData";
import TypewriterText from "./ui/TypewriterText";

const ProjectModal = lazy(() => import("./ProjectModal"));

// Curvy organic rotation deck angles
const ANGLES = [-1.8, 1.6, -1.4, 1.8, -1.5, 1.4, -1.6];

const StackingCard = React.memo(function StackingCard({ project, index, onOpenDetails }) {
  const angle = ANGLES[index % ANGLES.length];

  const handleClick = (e) => {
    e.currentTarget?.blur();
    onOpenDetails(project);
  };

  const handleDetailsBtnClick = (e) => {
    e.stopPropagation();
    e.currentTarget?.blur();
    onOpenDetails(project);
  };

  return (
    <div
      className="sticky top-24 sm:top-28 w-full max-w-xl sm:max-w-2xl mx-auto mb-20 sm:mb-28 md:mb-36 last:mb-0 z-10"
      style={{
        zIndex: index + 10,
      }}
    >
      <div
        onClick={handleClick}
        className="group relative w-full rounded-3xl bg-[#0e0f13] hover:bg-[#121319] border border-white/15 hover:border-pAccent/40 p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(168,218,34,0.12)] transition-[border-color,background-color,box-shadow,transform] duration-300 flex flex-col gap-4 will-change-transform origin-center hover:scale-[1.02] hover:!rotate-0 cursor-pointer"
        style={{
          transform: `rotate(${angle}deg)`,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {/* Top: Card Image Container */}
        <div className="relative block w-full aspect-[16/9] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-[#070709] border border-white/10 group-hover:border-pAccent/30 p-1.5 transition-colors duration-300 shadow-xl">
          <img
            src={project.img}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain rounded-xl opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-xl" />

          {/* Top-Left: Category Tag with Code Icon */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/85 border border-white/20 shadow-md">
            <Code2 className="w-3 h-3 text-pAccent shrink-0" strokeWidth={2.2} />
            <span className="text-[10px] font-jakarta uppercase tracking-wider text-white font-medium">
              {project.category}
            </span>
          </div>
        </div>

        {/* Bottom: Card Content, Metadata, Tech Stack & CTA */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-clashM text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-pAccent border border-pAccent/30 tracking-[0.15em] uppercase font-bold shadow-[0_0_10px_rgba(168,218,34,0.2)]">
                0{index + 1}
              </span>
              <h3 className="font-clash text-lg sm:text-xl md:text-2xl font-semibold text-white group-hover:text-pAccent transition-colors duration-300 truncate">
                {project.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-jakarta line-clamp-2">
              {project.short_desc}
            </p>
          </div>

          {/* Bottom Row: Tech Stack Pills & Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pt-3 border-t border-white/10 mt-auto">
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {project.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1.5 text-[11px] font-jakarta text-white/85 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 hover:text-white px-2.5 py-1 rounded-lg transition-colors duration-200 shadow-sm shrink-0"
                >
                  <img
                    src={tag.img}
                    alt={tag.tag}
                    className="w-3.5 h-3.5 object-contain shrink-0"
                  />
                  <span className="font-medium whitespace-nowrap">{tag.tag}</span>
                </div>
              ))}
            </div>

            {/* Segmented Action Pill Bar */}
            <div className="flex items-center p-0.5 rounded-full bg-white/[0.07] hover:bg-white/[0.1] border border-white/15 backdrop-blur-md shrink-0 ml-auto shadow-sm transition-colors">
              <button
                type="button"
                onClick={handleDetailsBtnClick}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white/80 hover:text-white font-jakarta font-medium text-xs transition-all hover:bg-white/10 cursor-pointer whitespace-nowrap"
              >
                <span>Details</span>
              </button>

              {project.link && project.link !== "#" && (
                <>
                  <span className="w-px h-3.5 bg-white/20 mx-0.5 shrink-0" />
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-pAccent text-black font-clash font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_2px_10px_rgba(255,255,255,0.12)] whitespace-nowrap cursor-pointer"
                  >
                    <span>Visit</span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

function Projects() {
  const { projectsSection } = portfolioData;
  const { projects, floatingImages = [] } = projectsSection;
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenDetails = useCallback((p) => {
    setSelectedProject(p);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section
      id="Projects"
      className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 pt-28 pb-36 z-10 text-white"
    >
      {/* Ambient Background Haze & Ghost Project Screen Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        {/* Top-Right Lime Haze Mesh Orb */}
        <div className="absolute top-[6%] -right-24 w-[480px] sm:w-[650px] h-[480px] sm:h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,218,34,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Mid-Left Cyan/Emerald Haze Orb */}
        <div className="absolute top-[40%] -left-32 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />

        {/* Bottom-Right Deep Lime/Purple Haze Orb */}
        <div className="absolute top-[70%] -right-24 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,218,34,0.07)_0%,transparent_70%)] pointer-events-none" />

        {/* Dynamically Mapped Floating Ghost Project Canvases (rendered on desktop viewports) */}
        <div className="hidden md:block">
          {floatingImages.map((item, idx) => {
            const rot = item.rotation !== undefined ? item.rotation : (idx % 2 === 0 ? -3.5 : 4);
            return (
              <motion.div
                key={item.id || idx}
                animate={{
                  y: [0, idx % 2 === 0 ? -12 : 12, 0],
                  rotate: [rot, rot + (idx % 2 === 0 ? 0.8 : -0.8), rot],
                }}
                transition={{
                  duration: item.duration || 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay || idx * 0.3,
                }}
                className={`absolute ${item.positionClass || "top-[10%] left-[2%]"} ${item.sizeClass || "w-[280px] sm:w-[380px] lg:w-[440px]"} aspect-[16/10] rounded-3xl overflow-hidden bg-[#070709]/80 border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.85)] ${item.opacityClass || "opacity-20 sm:opacity-25"} filter ${item.blurClass || "blur-[3px] sm:blur-[5px]"} transform-gpu`}
              >
                <img
                  src={item.src}
                  alt={item.alt || ""}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale-[25%]"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${item.tintGradient || "from-black/85 via-black/30 to-pAccent/15"}`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl w-full flex flex-col gap-14 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-4"
        >
          {/* Editorial Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-clashM text-xs px-2.5 py-0.5 rounded-full bg-white/[0.08] text-pAccent border border-pAccent/30 tracking-[0.2em] uppercase font-bold shadow-[0_0_12px_rgba(168,218,34,0.2)]">
              {projectsSection.badgeNumber}
            </span>
            <span className="w-6 h-px bg-white/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium">
              {projectsSection.badgeLabel}
            </span>
          </div>

          <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9]">
            {projectsSection.heading}
          </h2>

          <p className="font-cormorant italic text-2xl sm:text-3xl text-white/85 font-light max-w-xl">
            <TypewriterText text={projectsSection.subheading} cursorClassName="text-pAccent" />
          </p>
        </motion.div>

        {/* Stacking Cards Deck Container */}
        <div className="relative w-full flex flex-col items-center">
          {projects.map((project, index) => (
            <StackingCard
              key={project.id || index}
              project={project}
              index={index}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      </div>

      {/* High-Fidelity Project Architecture & Details Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              key={selectedProject.id || selectedProject.title || "project-modal"}
              isOpen={Boolean(selectedProject)}
              onClose={handleCloseDetails}
              project={selectedProject}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </section>
  );
}

export default Projects;
