import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Briefcase, UserRound } from "lucide-react";
import ArchitecturalBackground from "./ui/ArchitecturalBackground";
import ScrollFadeText from "./ui/ScrollFadeText";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "motion/react";
import { portfolioData } from "../data/portfolioData";

function CounterUp({ value }) {
  const numMatch = String(value).match(/^(\d+)(.*)$/);
  const target = numMatch ? parseInt(numMatch[1], 10) : null;
  const suffix = numMatch ? numMatch[2] : "";

  const motionVal = useMotionValue(0);
  const [displayNumber, setDisplayNumber] = useState(0);

  // Buttery-smooth organic spring physics
  const springVal = useSpring(motionVal, {
    stiffness: 38,
    damping: 22,
    mass: 1.1,
  });

  const rounded = useTransform(springVal, (v) => Math.round(v));

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayNumber(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  if (target === null) {
    return <span>{value}</span>;
  }

  return (
    <motion.span
      onViewportEnter={() => {
        motionVal.set(0);
        motionVal.set(target);
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="inline-block tabular-nums"
    >
      {displayNumber}{suffix}
    </motion.span>
  );
}

function ScrollTimelineDot({ isFirst, idx, progress }) {
  // Exact physical contact position of each dot along the track
  const threshold = idx === 1 ? 0.42 : 0.84;
  const startHit = Math.max(0.01, threshold - 0.015);

  // Transitions sharply to lime the exact moment the line touches the dot
  const bg = useTransform(
    progress,
    [startHit, threshold, 1],
    ["#16161a", "#a8da22", "#a8da22"]
  );

  if (isFirst) {
    return (
      <div className="relative flex items-center justify-center">
        <span className="absolute -inset-1 rounded-full bg-pAccent/25 animate-pulse" />
        <span className="relative block w-3.5 h-3.5 shrink-0 rounded-full bg-pAccent border-2 border-c1 shadow-[0_0_10px_rgba(168,218,34,0.85)]" />
      </div>
    );
  }

  return (
    <motion.span
      style={{ backgroundColor: bg }}
      className="block w-3.5 h-3.5 shrink-0 rounded-full border-2 border-c1"
    />
  );
}

function AboutImageCard({ imageSrc, imageCaption, imageTag }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 92%", "start 48%"],
  });

  // Scroll-linked curtain wipe: directly moves in lockstep with the user's scroll
  const curtainY = useTransform(scrollYProgress, [0, 1], ["0%", "105%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <div
      ref={cardRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-secondary/10 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] group select-none isolate sm:hover:-translate-y-1 transition-all duration-300"
    >
      {/* 1. Scroll-Linked Image Settle */}
      <motion.img
        src={imageSrc}
        alt={imageCaption || "Hashim Malik"}
        loading="lazy"
        decoding="async"
        style={{ scale: imageScale }}
        className="w-full h-full object-cover object-center sm:group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* 2. Scroll-Linked Wipe Curtain Reveal with Glowing Lime Accent Edge */}
      <motion.div
        style={{ y: curtainY }}
        className="absolute inset-0 bg-[#0d0e15] pointer-events-none z-30 border-b-[2.5px] border-pAccent shadow-[0_4px_20px_#a8da22] will-change-transform"
      />

      {/* 3. Subtle Bottom-Only Scrim for Watermark Legibility */}
      {imageCaption && (
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none z-10" />
      )}

      {/* 4. Top-Right Glass Badge */}
      {imageTag && (
        <div className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 text-white/95 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-pAccent shadow-[0_0_8px_#a8da22]" />
            <span className="text-[10px] font-jakarta font-semibold tracking-[0.12em] uppercase">
              {imageTag}
            </span>
          </div>
        </div>
      )}

      {/* 5. Bottom-Left Editorial Signature Watermark */}
      {imageCaption && (
        <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <UserRound className="w-3.5 h-3.5 text-pAccent shrink-0 drop-shadow-[0_0_8px_rgba(168,218,34,0.9)]" />
            <span className="font-clash text-xs sm:text-sm font-semibold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {imageCaption}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PaperGrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-[0.04] mix-blend-multiply z-0"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="paper-noise-pattern">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise-pattern)" />
      </svg>
    </div>
  );
}

function DraggableSpringLine() {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag coordinates: touchX (0-360), dragDY (vertical displacement)
  const motionDY = useMotionValue(0);
  const motionX = useMotionValue(180);

  // Damped harmonic spring physics for realistic string reverberation
  const springDY = useSpring(motionDY, {
    stiffness: 600,
    damping: 14,
    mass: 0.6,
  });

  const springX = useSpring(motionX, {
    stiffness: 450,
    damping: 18,
  });

  // Base key nodes of the original scribble shape
  const basePoints = [
    { x: 2, y: 7 },
    { x: 22, y: 1.5 },
    { x: 42, y: 12.5 },
    { x: 65, y: 6.5 },
    { x: 88, y: 1 },
    { x: 110, y: 13 },
    { x: 135, y: 7 },
    { x: 160, y: 1.5 },
    { x: 182, y: 12.5 },
    { x: 205, y: 6.5 },
    { x: 228, y: 1 },
    { x: 250, y: 13 },
    { x: 275, y: 7 },
    { x: 300, y: 1.5 },
    { x: 322, y: 12.5 },
    { x: 345, y: 6.5 },
    { x: 352, y: 4 },
    { x: 356, y: 9 },
    { x: 358, y: 7 },
  ];

  const [pathD, setPathD] = useState(
    "M 2 7 C 22 1.5, 42 12.5, 65 6.5 C 88 1, 110 13, 135 7 C 160 1.5, 182 12.5, 205 6.5 C 228 1, 250 13, 275 7 C 300 1.5, 322 12.5, 345 6.5 C 352 4, 356 9, 358 7"
  );

  useEffect(() => {
    const updatePath = () => {
      const dy = springDY.get();
      const cx = springX.get();

      // Deform every node along the string relative to grab position cx
      const deformed = basePoints.map((pt, i) => {
        if (i === 0 || i === basePoints.length - 1) return pt; // Endpoints stay pinned
        const dist = pt.x - cx;
        // Gaussian bell-curve displacement with smooth boundary taper
        const influence = Math.exp(-(dist * dist) / 9500);
        const edgeTaper = Math.sin((pt.x / 360) * Math.PI);
        const yOffset = dy * influence * edgeTaper;
        return {
          x: pt.x,
          y: pt.y + yOffset,
        };
      });

      const d = `M ${deformed[0].x} ${deformed[0].y} C ${deformed[1].x} ${deformed[1].y}, ${deformed[2].x} ${deformed[2].y}, ${deformed[3].x} ${deformed[3].y} C ${deformed[4].x} ${deformed[4].y}, ${deformed[5].x} ${deformed[5].y}, ${deformed[6].x} ${deformed[6].y} C ${deformed[7].x} ${deformed[7].y}, ${deformed[8].x} ${deformed[8].y}, ${deformed[9].x} ${deformed[9].y} C ${deformed[10].x} ${deformed[10].y}, ${deformed[11].x} ${deformed[11].y}, ${deformed[12].x} ${deformed[12].y} C ${deformed[13].x} ${deformed[13].y}, ${deformed[14].x} ${deformed[14].y}, ${deformed[15].x} ${deformed[15].y} C ${deformed[16].x} ${deformed[16].y}, ${deformed[17].x} ${deformed[17].y}, ${deformed[18].x} ${deformed[18].y}`;
      setPathD(d);
    };

    const unsubDY = springDY.on("change", updatePath);
    const unsubX = springX.on("change", updatePath);
    return () => {
      unsubDY();
      unsubX();
    };
  }, [springDY, springX]);

  const updateCoordinates = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = Math.max(5, Math.min(355, ((e.clientX - rect.left) / rect.width) * 360));
    const relativeY = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 60;
    const clampedDY = Math.max(-42, Math.min(42, relativeY));
    motionX.set(relativeX);
    motionDY.set(clampedDY);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateCoordinates(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      updateCoordinates(e);
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch (_) {}
      motionDY.set(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-8 py-0.5 flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none group"
      title="Click and drag anywhere on the line to pluck!"
    >
      <svg
        viewBox="0 0 360 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 text-secondary/35 group-hover:text-secondary/80 overflow-visible transition-colors"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          stroke="currentColor"
          strokeWidth={isDragging ? "2.2" : "1.8"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function About() {
  const { about } = portfolioData;
  const timelineRef = useRef(null);

  // Scroll-linked dynamic progress for the timeline line reaching full bottom
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 85%"],
  });

  const clampedProgress = useTransform(scrollYProgress, (v) => Math.min(Math.max(v, 0), 1));

  const smoothScaleY = useSpring(clampedProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      id="About"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 py-20 sm:py-28 z-10 bg-c1 text-secondary selection:bg-secondary selection:text-white overflow-hidden"
    >
      {/* Subtle Architectural Cream Background Layer */}
      <ArchitecturalBackground
        watermarkText="ABOUT"
        watermarkPosition="top-left"
      />

      {/* 1. Full-Width Editorial Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full flex flex-col gap-4 mb-10 sm:mb-14 relative z-10"
      >
        {/* Editorial Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="font-clashM text-xs px-2.5 py-0.5 rounded-full bg-secondary text-pAccent tracking-[0.2em] uppercase font-bold shadow-sm">
            {about.badgeNumber}
          </span>
          <span className="w-6 h-px bg-secondary/20" />
          <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-secondary/60 font-semibold">
            {about.badgeLabel}
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-secondary leading-[0.9]">
          {about.heading}
        </h2>

        {/* Cormorant Subheading */}
        <ScrollFadeText
          text={about.subheading}
          className="font-cormorant italic text-2xl sm:text-3xl md:text-4xl text-secondary/85 font-light leading-relaxed max-w-4xl"
          activeColor="text-secondary"
        />
      </motion.div>

      {/* 2. Bento Grid Layout */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10">
        {/* Left Column: Portrait Photo, Bio & Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28"
        >
          {/* Portrait Photo Card */}
          {(about.image || about.avatar) && (
            <AboutImageCard
              imageSrc={about.image || about.avatar}
              imageCaption={about.imageCaption}
              imageTag={about.imageTag}
            />
          )}

          <p className="font-jakarta text-sm sm:text-base text-secondary/75 leading-relaxed">
            {about.bio}
          </p>

          {/* Draggable Elastic Spring String with Snap-back Pluck Physics */}
          <DraggableSpringLine />

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-0 -mt-3.5">
            {about.stats.map((s, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-clash text-xl sm:text-2xl font-bold text-secondary tracking-tight">
                  <CounterUp value={s.value} />
                </span>
                <span className="font-jakarta text-[9px] sm:text-[10px] text-secondary/55 uppercase tracking-wider mt-0.5 font-medium">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Tactile Paper Bento Grid */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* 2x2 Specialized Domain Compact Paper Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {about.domainCards.map((item, idx) => {
              const IconComp = item.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative bg-[#FAF8F5] border border-secondary/12 hover:border-secondary/25 rounded-xl sm:rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-[0_4px_16px_rgba(28,25,23,0.03),0_1px_2px_rgba(28,25,23,0.02),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-[0_10px_24px_rgba(28,25,23,0.06)] sm:hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Paper Fiber Texture Layer */}
                  <PaperGrainOverlay />

                  <div className="flex items-center gap-3 relative z-10 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 shadow-sm">
                      <IconComp className="w-4 h-4 text-pAccent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-clash text-sm sm:text-[15px] font-semibold text-secondary group-hover:text-black transition-colors truncate">
                        {item.title}
                      </h3>
                      {item.tag && (
                        <span className="text-[10px] font-jakarta uppercase tracking-wider text-secondary/50 font-medium">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowUpRight className="w-3.5 h-3.5 text-pAccent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 relative z-10 ml-2" />
                </motion.div>
              );
            })}
          </div>

          {/* Career & Academic Timeline (Tactile Parchment Card) */}
          {about.timeline && about.timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#FAF8F5] border border-secondary/12 hover:border-secondary/22 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(28,25,23,0.05),0_1px_3px_rgba(28,25,23,0.03),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-300 overflow-hidden"
            >
              {/* Paper Fiber Texture Layer */}
              <PaperGrainOverlay />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-secondary/10">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shadow-sm shrink-0">
                      <Briefcase className="w-4 h-4 text-pAccent" />
                    </div>
                    <h3 className="font-clash text-base sm:text-lg md:text-xl font-bold text-secondary tracking-tight truncate">
                      Journey & Milestones
                    </h3>
                  </div>
                  <span className="hidden xs:inline-flex items-center text-[10px] sm:text-[11px] font-jakarta tracking-[0.15em] uppercase text-secondary/50 font-semibold px-2.5 py-1 rounded-lg bg-secondary/[0.04] border border-secondary/10 shrink-0">
                    Experience & Education
                  </span>
                </div>

                <div
                  ref={timelineRef}
                  className="relative ml-1.5 sm:ml-3 pl-4 sm:pl-6 space-y-4 sm:space-y-5"
                >
                  {/* Vertical Timeline Track (Scroll-Driven Growth) */}
                  <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-secondary/15 rounded-full overflow-hidden">
                    {/* Scroll-Driven Dynamic Lime Beam */}
                    <motion.div
                      style={{
                        scaleY: smoothScaleY,
                        originY: 0,
                      }}
                      className="w-full h-full bg-gradient-to-b from-pAccent via-[#a8da22] to-pAccent shadow-[0_0_8px_#a8da22]"
                    />
                  </div>

                  {about.timeline.map((item, idx) => {
                    const isFirst = idx === 0;

                    return (
                      <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group"
                      >
                        {/* Timeline Node Dot (Scroll-linked illumination) */}
                        <div className="absolute -left-4 sm:-left-6 top-4 -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none">
                          <ScrollTimelineDot
                            isFirst={isFirst}
                            idx={idx}
                            progress={scrollYProgress}
                            total={about.timeline.length}
                          />
                        </div>

                        {/* Milestone Card with Inset Paper Tone */}
                        <div className="relative rounded-2xl p-4 sm:p-5 bg-[#F4F0E8]/70 hover:bg-[#F4F0E8] border border-secondary/8 hover:border-secondary/18 transition-all duration-300 shadow-[0_2px_8px_rgba(28,25,23,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
                          {/* Top Header Row: Role & Year Pill */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 mb-2">
                            <h4 className="font-clash text-base sm:text-lg font-semibold text-secondary group-hover:text-black transition-colors leading-snug">
                              {item.role}
                            </h4>
                            <span className="self-start sm:self-auto inline-flex items-center text-[10px] sm:text-[11px] font-jakarta font-semibold px-2.5 py-0.5 rounded-full bg-secondary/8 text-secondary/80 border border-secondary/10 tracking-normal shrink-0">
                              {item.year}
                            </span>
                          </div>

                          {/* Organization Subtitle */}
                          <div className="text-xs sm:text-[13px] font-medium font-jakarta text-secondary/70 mb-2.5">
                            {item.organization}
                          </div>

                          {/* Description: Clean readable body copy */}
                          <p className="text-xs sm:text-[13px] text-secondary/65 font-jakarta leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;