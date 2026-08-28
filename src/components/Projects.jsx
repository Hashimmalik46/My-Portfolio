import React from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "motion/react";
import { portfolioData } from "../data/portfolioData";
import TypewriterText from "./ui/TypewriterText";

export default function Projects() {
  const { projectsSection } = portfolioData;
  const { projects = [] } = projectsSection;

  return (
    <section id="Projects" className="relative w-full bg-black text-white select-none">
      {/* Centered Editorial Section Header with Black Background */}
      <div className="w-full flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-14 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-16 text-center bg-black text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto"
        >
          {/* Editorial Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-clashM text-xs px-2.5 py-0.5 rounded-full bg-white/[0.08] text-pAccent border border-pAccent/30 tracking-[0.2em] uppercase font-bold shadow-[0_0_12px_rgba(168,218,34,0.2)]">
              {projectsSection.badgeNumber || "02"}
            </span>
            <span className="w-6 h-px bg-white/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium">
              {projectsSection.badgeLabel || "Portfolio"}
            </span>
          </div>

          {/* Centered Heading in Longsile */}
          <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9]">
            {projectsSection.heading || "Selected Projects"}
          </h2>

          {/* Centered Subheading with Cormorant Italic */}
          <p className="font-cormorant italic text-2xl sm:text-3xl text-white/85 font-light max-w-xl">
            <TypewriterText text={projectsSection.subheading} cursorClassName="text-pAccent" />
          </p>
        </motion.div>
      </div>

      {/* Floating Sticky Overlapping Cards with Surrounding Space */}
      <div className="relative w-full pb-20 sm:pb-28 md:pb-36 flex flex-col items-center">
        {projects.map((project, index) => {
          return (
            <div
              key={project.id || index}
              className="sticky top-12 sm:top-16 lg:top-20 w-full flex items-center justify-center py-4 sm:py-6 px-4 sm:px-6 md:px-10 lg:px-14"
              style={{
                zIndex: index + 10,
              }}
            >
              {/* Floating Glass Card Body */}
              <div className="relative w-full max-w-6xl bg-[#090a0f]/85 backdrop-blur-2xl rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 sm:p-8 md:p-10 lg:p-12 overflow-hidden transition-all">
                {/* Top-Right Minimal White Project Number */}
                <div className="absolute top-4 right-5 sm:top-7 sm:right-8 lg:top-8 lg:right-11 z-30 pointer-events-none select-none">
                  <span className="font-jakarta text-xs sm:text-sm md:text-base font-semibold text-white/60 tracking-[0.25em]">
                    0{index + 1}
                  </span>
                </div>

                {/* Subtle ambient lighting backdrop inside card */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,218,34,0.035)_0%,transparent_70%)] blur-2xl" />
                  <div className="absolute bottom-6 left-6 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] blur-2xl" />
                </div>

                {/* Card Content Grid */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start relative z-10">
                  {/* Left Side: Category, Title, Description, Tech Stack & Visit Website Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:col-span-6 flex flex-col justify-start gap-4 sm:gap-5 order-2 lg:order-1 px-0.5 sm:px-0"
                  >
                    {/* Top Content Block */}
                    <div className="flex flex-col gap-3 sm:gap-4.5">
                      {/* Top Row: Category Text */}
                      <div className="flex items-center justify-between w-full">
                        <span className="font-jakarta text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/50 font-medium">
                          {project.category}
                        </span>
                      </div>

                      {/* Project Title: Clean, modern, balanced font size */}
                      <h3 className="font-clashM text-xl sm:text-2xl md:text-3xl lg:text-[2.65rem] text-white tracking-tight leading-snug sm:leading-[1.12]">
                        {project.title}
                      </h3>

                      {/* Description: Minimal & Professional Plus Jakarta Sans */}
                      <div className="flex flex-col gap-2 sm:gap-2.5">
                        <p className="font-jakarta text-sm sm:text-[15px] md:text-base text-white/80 font-normal leading-relaxed">
                          {project.short_desc}
                        </p>

                        {project.highlights && project.highlights.length > 0 && (
                          <ul className="hidden sm:flex flex-col gap-1.5 pt-1 text-xs sm:text-[13px] text-white/65 font-jakarta font-normal">
                            {project.highlights.slice(0, 2).map((highlight, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/80 mt-1.5 shrink-0" />
                                <span className="line-clamp-2">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                        {project.tags.map((tag) => (
                          <div
                            key={tag.id || tag.tag}
                            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-jakarta text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 px-2.5 sm:px-3 py-1 rounded-md sm:rounded-lg transition-colors shadow-sm"
                          >
                            {tag.img && (
                              <img
                                src={tag.img}
                                alt={tag.tag}
                                className="w-3.5 h-3.5 object-contain shrink-0"
                                loading="lazy"
                              />
                            )}
                            <span className="font-medium">{tag.tag}</span>
                          </div>
                        ))}
                      </div>

                      {/* GitHub Link Just Below Tech Stack Pills */}
                      {project.github && project.github !== "#" && (
                        <div className="pt-1">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Source Code on GitHub"
                            title="Source Code on GitHub"
                            className="group/gh inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer text-xs font-jakarta"
                          >
                            <Github size={15} strokeWidth={2} className="text-white/60 group-hover/gh:text-pAccent transition-colors" />
                            <span className="font-medium tracking-wide">Source Code</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action: Visit Website Link */}
                    <div className="flex items-center gap-5 sm:gap-6 pt-2 sm:pt-3.5">
                      {project.link && project.link !== "#" && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="group/demo inline-flex items-center gap-2 text-white hover:text-pAccent font-jakarta font-medium text-xs sm:text-sm md:text-base uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
                        >
                          <span>Visit Website</span>
                          <ArrowUpRight size={17} strokeWidth={2.2} className="transition-transform duration-200 group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5 text-white/80 group-hover/demo:text-pAccent sm:w-5 sm:h-5" />
                        </a>
                      )}
                    </div>
                  </motion.div>

                  {/* Right Side: Taller Project Image Frame with In-View Animation & Link */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end order-1 lg:order-2 mt-6 sm:mt-7 lg:mt-8 xl:mt-10 mb-2 sm:mb-4 lg:mb-0"
                  >
                    <a
                      href={project.link && project.link !== "#" ? project.link : undefined}
                      target={project.link && project.link !== "#" ? "_blank" : undefined}
                      rel="noreferrer"
                      aria-label={`Visit ${project.title} live website`}
                      className={`group relative block w-full max-w-lg lg:max-w-xl aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] overflow-hidden rounded-md sm:rounded-lg border border-white/10 hover:border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 ${
                        project.link && project.link !== "#" ? "cursor-pointer" : ""
                      }`}
                    >
                      <img
                        src={project.img}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      />
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
