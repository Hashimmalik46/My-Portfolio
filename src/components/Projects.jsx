import React, { useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { portfolioData } from "../data/portfolioData";
import ArchitecturalBackground from "./ui/ArchitecturalBackground";
import ScrollFadeText from "./ui/ScrollFadeText";

function ProjectImageCard({ src, alt, link }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start 48%"],
  });

  // Scroll-controlled downward curtain wipe
  const curtainY = useTransform(scrollYProgress, [0, 1], ["0%", "105%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <a
      ref={containerRef}
      href={link && link !== "#" ? link : undefined}
      target={link && link !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={`Visit ${alt} live website`}
      className={`group relative block w-full max-w-lg lg:max-w-xl aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] overflow-hidden rounded-md sm:rounded-lg border border-white/10 hover:border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 bg-[#0c0d12] ${
        link && link !== "#" ? "cursor-pointer" : ""
      }`}
    >
      {/* Scroll-Linked Project Image Settle */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ scale: imageScale }}
        className="w-full h-full object-cover transition-transform duration-700 ease-out sm:group-hover:scale-[1.03]"
      />

      {/* Tablet/Desktop Only: Scroll-Driven Wipe Down Curtain */}
      <motion.div
        style={{ y: curtainY }}
        className="hidden sm:block absolute inset-0 bg-[#090a0f] pointer-events-none z-20 border-b-2 border-pAccent shadow-[0_4px_16px_rgba(168,218,34,0.65)] will-change-transform"
      />
    </a>
  );
}

function ProjectCardContent({ project, index, scrollProgress }) {
  // Image settles first with increased upward travel
  const imageY = useTransform(scrollProgress, [0, 0.55], [48, 0]);
  const imageScale = useTransform(scrollProgress, [0, 0.55], [0.95, 1]);

  // Content entrance with increased upward displacement and deliberate delay window
  const contentY = useTransform(scrollProgress, [0, 0.28, 0.95], [96, 96, 0]);
  const contentOpacity = useTransform(scrollProgress, [0, 0.28, 0.78], [0, 0, 1]);

  return (
    <div className="w-full relative">
      {/* Top-Right Minimal White Project Number */}
      <div className="absolute top-0 right-1 sm:top-0 sm:right-2 lg:top-0 lg:right-2 z-30 pointer-events-none select-none">
        <span className="font-jakarta text-xs sm:text-sm md:text-base font-semibold text-white/60 tracking-[0.25em]">
          0{index + 1}
        </span>
      </div>

      {/* Card Content Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start relative z-10">
        {/* Left Side: Category, Title, Description, Tech Stack & Links (Scroll-Linked Upward Motion) */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="lg:col-span-6 flex flex-col justify-start gap-4 sm:gap-5 order-2 lg:order-1 px-0.5 sm:px-0 will-change-transform"
        >
          {/* Top Content Block */}
          <div className="flex flex-col gap-3 sm:gap-4.5">
            {/* Category */}
            <div className="flex items-center justify-between w-full">
              <span className="font-jakarta text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/50 font-medium">
                {project.category}
              </span>
            </div>

            {/* Project Title: Static on phones, ScrollFade on tablet/desktop */}
            <h3 className="sm:hidden font-clashM text-xl text-white tracking-tight leading-snug">
              {project.title}
            </h3>
            <ScrollFadeText
              as="h3"
              text={project.title}
              className="hidden sm:flex font-clashM text-xl sm:text-2xl md:text-3xl lg:text-[2.65rem] text-white tracking-tight leading-snug sm:leading-[1.12]"
              activeColor="text-white"
            />

            {/* Description */}
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <p className="font-jakarta text-sm sm:text-[15px] md:text-base text-white/80 font-normal leading-relaxed">
                {project.short_desc}
              </p>

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-1">
                  {project.highlights.map((item, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] md:text-sm font-jakarta text-white/70 leading-normal"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-pAccent shrink-0 mt-1.5 shadow-[0_0_8px_#a8da22]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack & External Action Block */}
          <div className="flex flex-col gap-3 pt-2 sm:pt-3">
            {/* Tech Stack Tags Grid */}
            <div className="flex flex-wrap items-center gap-2">
              {project.tags?.map((tag) => (
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

            {/* GitHub Link */}
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

        {/* Right Side: Project Image Preview (Scroll-Linked Settle & Upward Motion) */}
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end order-1 lg:order-2 mt-6 sm:mt-7 lg:mt-8 xl:mt-10 mb-2 sm:mb-4 lg:mb-0 will-change-transform"
        >
          <ProjectImageCard
            src={project.img}
            alt={project.title}
            link={project.link}
          />
        </motion.div>
      </div>
    </div>
  );
}

function ProjectCardItem({ project, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 98%", "start 38%"],
  });

  return (
    <div
      ref={cardRef}
      className="sticky top-12 sm:top-16 lg:top-20 w-full flex items-center justify-center py-4 sm:py-6 px-4 sm:px-6 md:px-10 lg:px-14"
      style={{
        zIndex: index + 10,
      }}
    >
      <div className="relative w-full max-w-6xl bg-[#0D0E15] rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 sm:p-8 md:p-10 lg:p-12 overflow-hidden">
        <ProjectCardContent project={project} index={index} scrollProgress={scrollYProgress} />
      </div>
    </div>
  );
}

export default function Projects() {
  const { projectsSection } = portfolioData;
  const { projects = [] } = projectsSection;

  return (
    <section
      id="Projects"
      className="relative w-full bg-black text-white select-none"
    >
      {/* Subtle Dark Architectural Grid Background Layer */}
      <ArchitecturalBackground
        theme="dark"
        density="extended"
        watermarkText="WORK"
        watermarkPosition="top-right"
      />

      {/* Centered Editorial Section Header */}
      <div className="w-full flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-14 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
          <ScrollFadeText
            text={projectsSection.subheading}
            className="font-cormorant italic text-2xl sm:text-3xl text-white/90 font-light max-w-xl justify-center text-center"
            activeColor="text-white"
          />
        </motion.div>
      </div>

      {/* Floating Sticky Overlapping Cards */}
      <div className="relative w-full pb-20 sm:pb-28 md:pb-36 flex flex-col items-center">
        {projects.map((project, index) => (
          <ProjectCardItem
            key={project.id || index}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
