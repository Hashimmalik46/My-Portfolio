import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUpRight, Briefcase } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
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

function ScrollTimelineDot({ isFirst, idx, total, progress }) {
  if (isFirst) {
    return (
      <div className="relative flex items-center justify-center">
        <span className="absolute -inset-1 rounded-full bg-pAccent/25 animate-pulse" />
        <span className="relative block w-3.5 h-3.5 shrink-0 rounded-full bg-pAccent border-2 border-c1 shadow-[0_0_10px_rgba(168,218,34,0.85)]" />
      </div>
    );
  }

  // Exact physical contact position of each dot along the track
  const threshold = idx === 1 ? 0.42 : 0.84;
  const startHit = Math.max(0.01, threshold - 0.015);

  // Transitions sharply to lime the exact moment the line touches the dot
  const bg = useTransform(
    progress,
    [startHit, threshold, 1],
    ["#16161a", "#a8da22", "#a8da22"]
  );

  return (
    <motion.span
      style={{ backgroundColor: bg }}
      className="block w-3.5 h-3.5 shrink-0 rounded-full border-2 border-c1"
    />
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
      className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-28 z-10 bg-c1 text-secondary selection:bg-secondary selection:text-white"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
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

          <p className="font-cormorant italic text-2xl sm:text-3xl text-secondary/85 font-light leading-relaxed">
            {about.subheading}
          </p>

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

        {/* Right Column: Porcelain Glass Bento Grid */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Main Philosophy Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
            className="group relative bg-white/80 hover:bg-white/95 backdrop-blur-2xl border border-secondary/10 hover:border-secondary/20 rounded-3xl p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-[background-color,border-color,box-shadow] duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-jakarta tracking-[0.2em] uppercase text-secondary/50 font-semibold">
                {about.philosophy.badge}
              </span>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-pAccent animate-pulse" />
              </div>
            </div>

            <p className="font-jakarta text-base md:text-lg text-secondary/90 leading-relaxed font-normal">
              {about.philosophy.description}
            </p>
          </motion.div>

          {/* 2x2 Specialized Domain Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.domainCards.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.015,
                    transition: { duration: 0.25, ease: "easeOut" },
                  }}
                  className="group relative bg-white/70 hover:bg-white backdrop-blur-2xl border border-secondary/10 hover:border-secondary/25 rounded-2xl p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-[background-color,border-color,box-shadow] duration-300"
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
              className="relative bg-white/80 hover:bg-white/95 backdrop-blur-2xl border border-secondary/10 hover:border-secondary/20 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-[background-color,border-color,box-shadow] duration-300"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shadow-sm">
                    <Briefcase className="w-4 h-4 text-pAccent" />
                  </div>
                  <h3 className="font-clash text-lg md:text-xl font-bold text-secondary tracking-tight">
                    Journey & Milestones
                  </h3>
                </div>
                <span className="text-[11px] font-jakarta tracking-[0.2em] uppercase text-secondary/50 font-semibold">
                  Experience & Education
                </span>
              </div>

              <div
                ref={timelineRef}
                className="relative ml-2 sm:ml-3 pl-5 sm:pl-6 space-y-7"
              >
                {/* Vertical Timeline Track (Scroll-Driven Growth) */}
                <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-secondary/15 rounded-full overflow-hidden">
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
                      <div className="absolute -left-5 sm:-left-6 top-1.5 -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none">
                        <ScrollTimelineDot
                          isFirst={isFirst}
                          idx={idx}
                          total={about.timeline.length}
                          progress={smoothScaleY}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="font-clash text-base md:text-lg font-semibold text-secondary group-hover:text-black transition-colors">
                          {item.role}
                        </span>

                        {/* Year Badge with Live Pulse Indicator for Present entries */}
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-jakarta font-semibold px-2.5 py-0.5 rounded-full bg-secondary/[0.08] text-secondary/80 border border-secondary/15 group-hover:border-secondary/30 tracking-wide transition-colors">
                          {item.year.includes("Present") && (
                            <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-pulse shrink-0" />
                          )}
                          <span>{item.year}</span>
                        </span>
                      </div>

                      <div className="text-xs md:text-sm font-medium text-secondary/70 font-jakarta mb-2">
                        {item.organization}
                      </div>

                      <p className="text-xs md:text-sm text-secondary/80 font-jakarta leading-relaxed mb-3">
                        {item.description}
                      </p>

                      {/* Skill / Domain Tags */}
                      {item.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-semibold font-jakarta px-2.5 py-0.5 rounded-md bg-secondary/[0.06] hover:bg-secondary/[0.12] text-secondary/85 border border-secondary/10 transition-colors"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
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