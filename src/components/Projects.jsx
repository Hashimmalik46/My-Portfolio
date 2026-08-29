import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  ArrowUpRight,
  Github,
  Layers,
  BrainCircuit,
  Palette,
  Clapperboard,
  Globe,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { portfolioData } from "../data/portfolioData";
import ArchitecturalBackground from "./ui/ArchitecturalBackground";
import ScrollFadeText from "./ui/ScrollFadeText";

// Category Icon Mapping
const CATEGORY_ICONS = {
  "full-stack": Layers,
  "web-platforms": Globe,
  "ai-automation": BrainCircuit,
  "ui-ux": Palette,
  creative: Clapperboard,
};

function ProjectImageCard({ src, alt, link }) {
  return (
    <a
      href={link && link !== "#" ? link : undefined}
      target={link && link !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={`Visit ${alt} live project`}
      className={`group relative block w-full aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 bg-[#0a0b10] ${
        link && link !== "#" ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Project Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 ease-out sm:group-hover:scale-[1.04]"
      />

      {/* Glass Hover Sheen & Quick Action Trigger */}
      {link && link !== "#" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 sm:p-5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pAccent text-black font-jakarta font-semibold text-xs tracking-wide shadow-[0_0_20px_rgba(168,218,34,0.5)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span>Explore Live</span>
            <ExternalLink size={13} strokeWidth={2.5} />
          </div>
        </div>
      )}
    </a>
  );
}

function ProjectCardContent({ project, index, scrollProgress }) {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Content & Image entrance: Instant continuous response
  const startY = isMobile ? 14 : 26;
  const contentY = useTransform(scrollProgress, [0, 1], [startY, 0]);
  const contentOpacity = useTransform(scrollProgress, [0, 0.75], [0.35, 1]);

  return (
    <div className="w-full relative">
      {/* Card Content Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 xl:gap-10 items-center relative z-10">
        {/* Left Side: Category, Title, Description, Tech Stack & Links */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="lg:col-span-6 flex flex-col justify-start gap-3 sm:gap-4 order-2 lg:order-1 px-0.5 sm:px-0 will-change-transform"
        >
          {/* Top Content Block */}
          <div className="flex flex-col gap-2 sm:gap-3.5">
            {/* Category Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="font-jakarta text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/60 font-medium">
                {project.category}
              </span>
            </div>

            {/* Project Title: Static on phones, ScrollFade on tablet/desktop */}
            <h3 className="sm:hidden font-clashM text-[19px] text-white tracking-tight leading-snug">
              {project.title}
            </h3>
            <ScrollFadeText
              as="h3"
              text={project.title}
              className="hidden sm:flex font-clashM text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] text-white tracking-tight leading-snug sm:leading-[1.12]"
              activeColor="text-white"
            />

            {/* Description */}
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <p className="font-jakarta text-[13px] sm:text-[15px] md:text-base text-white/80 font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
                {project.short_desc}
              </p>

              {/* Highlights (Tablet/Desktop) */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="hidden sm:flex flex-col gap-1.5 pt-1">
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

          {/* Tech Stack Tags Grid */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 sm:pt-1">
            {project.tags?.map((tag) => (
              <div
                key={tag.id || tag.tag}
                className="flex items-center gap-1.5 text-xs sm:text-[13px] font-jakarta text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 px-2.5 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg transition-colors shadow-sm"
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

          {/* Action Row: Visit Website + Source Code */}
          <div className="flex items-center justify-between sm:justify-start gap-5 sm:gap-6 pt-1.5 sm:pt-3">
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="group/demo inline-flex items-center gap-2 text-white hover:text-pAccent font-jakarta font-medium text-xs sm:text-sm md:text-base uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
              >
                <span>Visit Website</span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform duration-200 group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5 text-white/80 group-hover/demo:text-pAccent sm:w-5 sm:h-5"
                />
              </a>
            )}

            {project.github && project.github !== "#" && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Source Code on GitHub"
                title="Source Code on GitHub"
                className="group/gh inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer text-xs font-jakarta"
              >
                <Github
                  size={15}
                  strokeWidth={2}
                  className="text-white/60 group-hover/gh:text-pAccent transition-colors"
                />
                <span className="font-medium tracking-wide">Source</span>
              </a>
            )}
          </div>
        </motion.div>

        {/* Right Side: Project Image Preview (Matching Content Motion) */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end order-1 lg:order-2 mt-0 mb-2 sm:mb-3 lg:mb-0 will-change-transform"
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

function ProjectCardItem({
  project,
  index,
  totalProjects = 1,
  progress,
  range = [0, 1],
  targetScale = 1,
  targetBrightness = 1,
  targetY = 0,
  targetRotateX = 0,
}) {
  const cardRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 640 : true
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track scroll for card content entrance as it scrolls into view
  const { scrollYProgress: entranceProgress } = useScroll({
    target: cardRef,
    offset: ["start 95%", "start 45%"],
  });

  // Dynamic transforms driven by the overall projects scroll progress
  const scale = useTransform(progress, range, [1, targetScale]);
  const y = useTransform(progress, range, [0, targetY]);
  const rotateX = useTransform(progress, range, [0, isDesktop ? targetRotateX : 0]);
  const overlayOpacity = useTransform(progress, range, [0, Math.max(0, 1 - targetBrightness)]);

  // Staggered cascading top offset so previous cards' terminal headers remain visible
  const stickyTop = isDesktop
    ? `calc(4.5rem + ${index * 24}px)`
    : `calc(1.2rem + ${index * 14}px)`;

  // Format category slug for terminal path
  const categorySlug = useMemo(() => {
    if (!project.category) return "core";
    return project.category
      .toLowerCase()
      .replace("&", "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, [project.category]);

  return (
    <div
      ref={cardRef}
      className="sticky w-full flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 mb-20 sm:mb-28 md:mb-36 sm:[perspective:1200px] transform-gpu"
      style={{
        top: stickyTop,
        zIndex: index + 10,
      }}
    >
      <motion.div
        style={{
          scale,
          rotateX,
          y,
          transformStyle: isDesktop ? "preserve-3d" : "flat",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
        whileHover={{
          scale: 1.008,
          transition: { duration: 0.2 },
        }}
        className="group/card relative w-full max-w-6xl bg-[#0D0E15]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/[0.12] hover:border-white/[0.18] shadow-[0_25px_60px_rgba(0,0,0,0.92),0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_20px_rgba(168,218,34,0.04)] overflow-hidden transition-all duration-300 will-change-transform"
      >
        {/* Atmospheric Depth Dimming Overlay (100% GPU flash-free alpha blend) */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-[#07080c] pointer-events-none z-20 rounded-[inherit]"
        />

        {/* Subtle Ambient Gradient Corner Glow with Delicate Hover Pulse */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-pAccent/[0.03] group-hover/card:bg-pAccent/[0.05] blur-[80px] transition-colors duration-500 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-emerald-500/[0.02] group-hover/card:bg-emerald-500/[0.04] blur-[80px] transition-colors duration-500 pointer-events-none" />

        {/* Outer Card Terminal Header Bar */}
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 bg-white/[0.025] border-b border-white/[0.08] backdrop-blur-md select-none relative z-10">
          {/* 3 Terminal Window Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] opacity-90 shadow-[0_0_6px_rgba(255,95,86,0.45)]" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] opacity-90 shadow-[0_0_6px_rgba(255,189,46,0.45)]" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] opacity-90 shadow-[0_0_6px_rgba(39,201,63,0.45)]" />
          </div>

          {/* Minimalist Terminal Directory / Path */}
          <div className="text-[11px] sm:text-xs font-mono text-white/40 tracking-wider">
            <span>~/{categorySlug}/{project.id}</span>
          </div>

          {/* Right Side Index Counter */}
          <div className="text-[11px] sm:text-xs font-mono text-white/50 tracking-widest uppercase">
            <span>0{index + 1}</span>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 xl:p-9 relative z-10">
          <ProjectCardContent
            project={project}
            index={index}
            scrollProgress={entranceProgress}
          />
        </div>
      </motion.div>
    </div>
  );
}

function getWarpedDockPath(notchX, W = 800, H = 70, totalTabs = 5, padX = 0) {
  if (W <= 0 || H <= 0) return "";
  const isMobile = W < 640;
  const r = Math.min(H / 2, isMobile ? 28 : 36);
  const innerW = W - 2 * padX;
  const tabW = innerW / totalTabs;
  
  // Wider, finer, smoother valley scoop with adaptive edge handling
  const nw = isMobile ? Math.min(tabW * 0.48, 44) : Math.min(tabW * 0.38, 48);
  const nd = isMobile ? Math.min(H * 0.44, 28) : Math.min(H * 0.44, 32);

  const cp1X = Math.max(r, notchX - nw);
  const cp2X = Math.min(W - r, notchX + nw);
  const halfSpan = (cp2X - cp1X) / 2;

  return `
    M ${r} 1.5
    L ${cp1X} 1.5
    C ${cp1X + halfSpan * 0.38} 1.5, ${notchX - halfSpan * 0.55} ${nd}, ${notchX} ${nd}
    C ${notchX + halfSpan * 0.55} ${nd}, ${cp2X - halfSpan * 0.38} 1.5, ${cp2X} 1.5
    L ${W - r} 1.5
    A ${r - 1.5} ${r - 1.5} 0 0 1 ${W - r} ${H - 1.5}
    L ${r} ${H - 1.5}
    A ${r - 1.5} ${r - 1.5} 0 0 1 ${r} 1.5
    Z
  `.replace(/\s+/g, " ").trim();
}

function WarpedDockShape({ activeIndex = 2, totalTabs = 5, containerRef }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, paddingLeft: 0, paddingRight: 0 });

  useEffect(() => {
    if (!containerRef?.current) return;
    const el = containerRef.current;
    
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;

      setDimensions({
        width: rect.width,
        height: rect.height,
        paddingLeft,
        paddingRight,
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    window.addEventListener("resize", updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [containerRef]);

  const W = dimensions.width || 800;
  const H = dimensions.height || 70;
  const padX = dimensions.paddingLeft || 0;
  const innerW = Math.max(1, W - 2 * padX);
  const targetX = padX + ((activeIndex + 0.5) / totalTabs) * innerW;

  const springX = useSpring(targetX, { stiffness: 420, damping: 32 });
  const [pathD, setPathD] = useState(() => getWarpedDockPath(targetX, W, H, totalTabs, padX));

  useEffect(() => {
    springX.set(targetX);
  }, [targetX, springX]);

  useEffect(() => {
    const unsubscribe = springX.on("change", (v) => {
      setPathD(getWarpedDockPath(v, W, H, totalTabs, padX));
    });
    return () => unsubscribe();
  }, [springX, W, H, totalTabs, padX]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
    >
      <path
        d={pathD}
        fill="#0c0d14"
        stroke="rgba(255, 255, 255, 0.14)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function Projects() {
  const { projectsSection } = portfolioData;
  const { projects = [], categories = [] } = projectsSection;
  const dockRef = useRef(null);
  const projectsContainerRef = useRef(null);

  // Global scroll tracker for the entire projects cards deck
  const { scrollYProgress: projectsScrollProgress } = useScroll({
    target: projectsContainerRef,
    offset: ["start start", "end end"],
  });

  // Fallback category structure if not present in data
  const categoryTaxonomy = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    return [
      { id: "web-platforms", label: "Web Platforms", match: ["Web Platform", "Web Platforms", "EdTech", "Social Platform"] },
      { id: "ai-automation", label: "AI & Systems", match: ["AI & Automation", "Real-Time Tracking"] },
      { id: "full-stack", label: "Full Stack", match: ["Full Stack"] },
      { id: "ui-ux", label: "UI/UX Design", match: ["UI/UX Design"] },
      { id: "creative", label: "Creative & Media", match: ["Creative & Media", "Creative"] },
    ];
  }, [categories]);

  const [activeCategoryId, setActiveCategoryId] = useState("full-stack");

  // Compute active category index for continuous warped dock
  const activeIndex = useMemo(() => {
    const idx = categoryTaxonomy.findIndex((c) => c.id === activeCategoryId);
    return idx >= 0 ? idx : 2;
  }, [categoryTaxonomy, activeCategoryId]);

  // Compute item count per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    categoryTaxonomy.forEach((cat) => {
      const count = projects.filter((p) => {
        if (cat.match) {
          return cat.match.some((m) => p.category?.toLowerCase() === m.toLowerCase());
        }
        return p.category?.toLowerCase() === cat.label?.toLowerCase();
      }).length;
      counts[cat.id] = count;
    });
    return counts;
  }, [projects, categoryTaxonomy]);

  // Filter projects by active category
  const filteredProjects = useMemo(() => {
    const currentCategory = categoryTaxonomy.find((c) => c.id === activeCategoryId) || categoryTaxonomy[2] || categoryTaxonomy[0];
    if (!currentCategory) return projects;

    return projects.filter((p) => {
      if (currentCategory.match) {
        return currentCategory.match.some(
          (m) => p.category?.toLowerCase() === m.toLowerCase()
        );
      }
      return p.category?.toLowerCase() === currentCategory.label?.toLowerCase();
    });
  }, [projects, activeCategoryId, categoryTaxonomy]);

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
      <div className="w-full flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 md:px-16 text-center relative z-10">
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
            className="font-cormorant italic text-2xl sm:text-3xl text-white/90 font-light max-w-2xl justify-center text-center"
            activeColor="text-white"
          />
        </motion.div>

        {/* Modern Warped Floating Category Dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 sm:mt-14 w-full max-w-5xl flex flex-col items-center z-20 pt-10 sm:pt-12 pb-4 overflow-visible"
        >
          {/* Unclipped Container with generous room */}
          <div className="w-full max-w-full overflow-visible pt-6 pb-12 sm:pb-16 px-2 sm:px-4 md:px-6 flex items-center justify-center">
            {/* Warped Container: Clean icon mode on mobile/tablet, full labels on desktop */}
            <div
              ref={dockRef}
              className="relative inline-flex items-center w-[96%] xs:w-full max-w-[440px] xs:max-w-[480px] sm:max-w-[520px] md:max-w-[560px] lg:max-w-4xl xl:max-w-5xl px-2.5 sm:px-4 lg:px-6 shrink-0 mx-auto h-[64px] sm:h-[74px] overflow-visible"
            >
              {/* Single Peeking Drafting Tool: Precision Millimeter Scale Ruler (Underneath Dock) */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[75%] max-w-2xl h-[18px] pointer-events-none select-none z-0 flex items-center justify-center opacity-15"
              >
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 20" fill="none" preserveAspectRatio="none">
                  {/* Ruler Base Guide */}
                  <line x1="10" y1="4" x2="490" y2="4" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                  
                  {/* Millimeter Scale Ticks */}
                  {Array.from({ length: 49 }).map((_, i) => {
                    const x = 10 + i * 10;
                    const isMajor = i % 5 === 0;
                    const isCenter = i === 24;
                    return (
                      <line
                        key={i}
                        x1={x}
                        y1="4"
                        x2={x}
                        y2={isCenter ? "16" : isMajor ? "12" : "8"}
                        stroke={isCenter ? "#a8da22" : isMajor ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}
                        strokeWidth={isCenter ? "1.2" : isMajor ? "0.9" : "0.6"}
                      />
                    );
                  })}
                  
                  {/* Unit Numbers Peeking Out */}
                  <text x="10" y="17" fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace">00</text>
                  <text x="125" y="17" fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace">25</text>
                  <text x="244" y="17" fill="rgba(168,218,34,0.7)" fontSize="6" fontFamily="monospace">50</text>
                  <text x="365" y="17" fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace">75</text>
                  <text x="475" y="17" fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace">100</text>
                </svg>
              </div>

              {/* 1. Continuous Warped Dock SVG Shape (Dynamic Pixel-Exact Responsive) */}
              <WarpedDockShape
                activeIndex={activeIndex}
                totalTabs={categoryTaxonomy.length}
                containerRef={dockRef}
              />

              {/* 2. Interactive Category Tabs */}
              {categoryTaxonomy.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                const count = categoryCounts[cat.id] ?? 0;
                const IconComponent = CATEGORY_ICONS[cat.id] || Layers;

                return (
                  <button
                    key={cat.id}
                    onClick={(e) => {
                      setActiveCategoryId(cat.id);
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                      });
                    }}
                    aria-label={cat.label}
                    title={cat.label}
                    className={`relative flex-1 h-full rounded-full text-xs sm:text-[13px] font-jakarta transition-colors duration-200 flex items-center justify-center cursor-pointer select-none z-10 ${
                      isActive ? "text-pAccent font-semibold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {/* Active Floating Circle Orb (Clean Radial Glow, Zero Square Clipping) */}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryOrb"
                        className="absolute -top-5 sm:-top-7 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0c0d14] border-2 border-pAccent text-pAccent flex items-center justify-center shadow-[0_0_22px_rgba(168,218,34,0.65),0_4px_16px_rgba(0,0,0,0.9)] z-30 pointer-events-none"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                      >
                        <IconComponent
                          size={16}
                          strokeWidth={2.4}
                          className="text-pAccent sm:w-5 sm:h-5"
                        />
                      </motion.div>
                    )}

                    {/* Stable Centered Tab Content */}
                    <div
                      className={`relative z-10 flex items-center justify-center gap-1.5 w-full transition-transform duration-200 ${
                        isActive ? "translate-y-2 sm:translate-y-2.5 scale-95" : "scale-100"
                      }`}
                    >
                      {/* Mobile & Tablet View (< lg): Clean Icon for inactive, count for active */}
                      <div className="flex lg:hidden items-center justify-center">
                        {!isActive ? (
                          <IconComponent
                            size={22}
                            strokeWidth={2.1}
                            className="text-white/60 hover:text-white hover:scale-110 transition-all duration-200 sm:w-6 sm:h-6"
                          />
                        ) : (
                          <span className="text-[11px] font-mono font-bold text-pAccent bg-pAccent/20 px-2 py-0.5 rounded-full border border-pAccent/30">
                            {count === 0 ? "0" : count < 10 ? `0${count}` : count}
                          </span>
                        )}
                      </div>

                      {/* Large Desktop View (>= lg): Full Label & Count */}
                      <div className="hidden lg:flex items-center justify-center gap-1.5">
                        <span className="whitespace-nowrap tracking-wide font-medium truncate max-w-[95px] sm:max-w-none">
                          {cat.label}
                        </span>

                        <span
                          className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                            isActive
                              ? "bg-pAccent/20 text-pAccent font-bold border border-pAccent/30"
                              : "bg-white/10 text-white/50 group-hover:text-white/80"
                          }`}
                        >
                          {count === 0 ? "0" : count < 10 ? `0${count}` : count}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Sticky Overlapping Cards Deck */}
      <div
        ref={projectsContainerRef}
        className="relative w-full pb-24 sm:pb-32 md:pb-44 flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full flex flex-col items-center"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => {
                const total = filteredProjects.length;
                const isLast = index === total - 1;
                // Immediate 1:1 scroll step partition (zero delay)
                const step = 1 / Math.max(1, total);
                const startRange = index * step * 0.85;
                const endRange = Math.min(1, (index + 1) * step);
                const range = [startRange, endRange];

                const targetScale = isLast ? 1 : Math.max(0.88, 1 - (total - index) * 0.04);
                const targetBrightness = isLast ? 1 : Math.max(0.68, 1 - (total - index) * 0.09);
                const targetY = isLast ? 0 : -((total - index) * 14);
                const targetRotateX = isLast ? 0 : -((total - index) * 2.2);

                return (
                  <ProjectCardItem
                    key={project.id || `${activeCategoryId}-${index}`}
                    project={project}
                    index={index}
                    totalProjects={total}
                    progress={projectsScrollProgress}
                    range={range}
                    targetScale={targetScale}
                    targetBrightness={targetBrightness}
                    targetY={targetY}
                    targetRotateX={targetRotateX}
                  />
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md my-14 sm:my-18 p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0D0E15]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center flex flex-col items-center gap-3 overflow-hidden"
              >
                {/* Contextual Content Icon */}
                {(() => {
                  const ActiveEmptyIcon = CATEGORY_ICONS[activeCategoryId] || Clapperboard;
                  return (
                    <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-pAccent shadow-[0_0_16px_rgba(168,218,34,0.12)] mb-0.5">
                      <ActiveEmptyIcon size={20} strokeWidth={2.2} className="text-pAccent" />
                    </div>
                  );
                })()}

                {/* Clean Heading */}
                <h4 className="font-clashM text-lg sm:text-xl text-white/90 tracking-wide">
                  Adding Soon...
                </h4>

                {/* Minimalist Subtitle */}
                <p className="text-xs sm:text-[13px] font-jakarta text-white/50 max-w-xs leading-relaxed">
                  Curating case studies and visual experiments in this category. Check back soon!
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
