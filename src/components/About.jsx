import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUpRight, Briefcase, UserRound } from "lucide-react";
import ArchitecturalBackground from "./ui/ArchitecturalBackground";
import ScrollFadeText from "./ui/ScrollFadeText";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  AnimatePresence,
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden bg-white/40 border border-secondary/10 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] group select-none isolate sm:hover:-translate-y-1 transition-all duration-300"
    >
      {/* 1. Zoom Image Reveal on Scroll */}
      <motion.img
        src={imageSrc}
        alt={imageCaption || "Hashim Malik"}
        loading="lazy"
        decoding="async"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full object-cover object-center sm:group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* 2. Luxury Curtain Wipe Shutter with Glowing Lime Accent Edge */}
      <motion.div
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1], delay: 0.05 }}
        style={{ originY: 0 }}
        className="absolute inset-0 z-30 bg-[#0d0e15] pointer-events-none overflow-hidden"
      >
        {/* Glowing Lime Leading Tracer Line */}
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-pAccent shadow-[0_0_14px_#a8da22]" />
      </motion.div>

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
    </motion.div>
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
      className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-16 py-20 sm:py-28 z-10 bg-c1 text-secondary selection:bg-secondary selection:text-white overflow-hidden"
    >
      {/* Subtle Architectural Cream Background Layer */}
      <ArchitecturalBackground
        watermarkText="ABOUT"
        watermarkPosition="top-left"
      />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
        {/* Left Column: Heading, Bio & Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28"
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
          <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl text-secondary leading-[0.9]">
            {about.heading}
          </h2>

          {/* Portrait Photo Card with Progressive Blur-Up & Loading Shimmer */}
          {(about.image || about.avatar) && (
            <AboutImageCard
              imageSrc={about.image || about.avatar}
              imageCaption={about.imageCaption}
              imageTag={about.imageTag}
            />
          )}

          <ScrollFadeText
            text={about.subheading}
            className="font-cormorant italic text-2xl sm:text-3xl text-secondary/85 font-light leading-relaxed"
            activeColor="text-secondary"
          />

          <p className="font-jakarta text-sm sm:text-base text-secondary/70 leading-relaxed">
            {about.bio}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-secondary/15">
            {about.stats.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="flex flex-col"
              >
                <span className="font-clash text-xl sm:text-2xl font-bold text-secondary tracking-tight">
                  <CounterUp value={s.value} />
                </span>
                <span className="font-jakarta text-[9px] sm:text-[10px] text-secondary/55 uppercase tracking-wider mt-0.5 font-medium">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* Right Column: Porcelain Bento Grid */}
        <div className="lg:col-span-7 flex flex-col gap-5">

          {/* 2x2 Specialized Domain Cards with Staggered Parallax Float */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.domainCards.map((item, idx) => {
              const IconComp = item.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative bg-white border border-secondary/10 hover:border-secondary/25 rounded-2xl p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] sm:hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3.5 shadow-sm"
                    >
                      <IconComp className="w-5 h-5 text-pAccent" />
                    </motion.div>
                    <h3 className="font-clash text-base md:text-lg font-medium text-secondary mb-1.5 group-hover:text-black transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-jakarta text-xs md:text-sm text-secondary/65 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 mt-5 text-[11px] uppercase tracking-wider text-secondary/60 group-hover:text-secondary transition-colors font-medium">
                    <span>{item.tag || "Domain"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-pAccent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Career & Academic Timeline */}
          {about.timeline && about.timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white border border-secondary/10 hover:border-secondary/20 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
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
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.12 }}
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

                      {/* Milestone Card */}
                      <div className="rounded-2xl p-4 sm:p-5 bg-c1/40 hover:bg-c1/75 border border-secondary/8 hover:border-secondary/20 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
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
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;