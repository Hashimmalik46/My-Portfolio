import { Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { portfolioData } from "../data/portfolioData";

function About() {
  const { about } = portfolioData;

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
                  {s.value}
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
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            className="group relative bg-white/80 hover:bg-white/95 backdrop-blur-2xl border border-secondary/10 hover:border-secondary/20 rounded-3xl p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300"
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
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.015,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                  className="group relative bg-white/70 hover:bg-white backdrop-blur-2xl border border-secondary/10 hover:border-secondary/25 rounded-2xl p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  <div>
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
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
        </div>
      </div>
    </section>
  );
}

export default About;