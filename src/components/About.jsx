import {
  Layers,
  Palette,
  Clapperboard,
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "motion/react";

function About() {
  const stats = [
    { value: "2+", label: "Years Exp." },
    { value: "10+", label: "Projects Built" },
    { value: "End-to-End", label: "Workflow" },
  ];

  const highlights = [
    {
      icon: <Layers className="w-5 h-5 text-pAccent" />,
      title: "Full Stack (MERN)",
      desc: "Architecting scalable web platforms with MongoDB, Express, React, and Node.js with secure APIs.",
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-sAccent" />,
      title: "AI, ML & Deep Learning",
      desc: "Integrating intelligent models, computer vision pipelines, and deep neural network solutions into real-world applications.",
    },
    {
      icon: <Palette className="w-5 h-5 text-sAccent" />,
      title: "UI/UX Design",
      desc: "Designing high-fidelity design systems, wireframes, and responsive user journeys that prioritize usability and clean aesthetics.",
    },
    {
      icon: <Clapperboard className="w-5 h-5 text-pAccent" />,
      title: "Video Editing & Content Creation",
      desc: "Producing engaging digital content and post-production workflows that translate ideas into visual narratives.",
    },
  ];

  return (
    <section
      id="About"
      className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-28 z-10 text-white"
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
            <span className="font-clashM text-xs text-pAccent tracking-[0.25em] uppercase font-semibold">01</span>
            <span className="w-6 h-px bg-white/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium">
              Who I Am
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9]">
            About Me
          </h2>

          <p className="font-cormorant italic text-2xl sm:text-3xl text-white/85 font-light leading-relaxed">
            Developer, AI Practitioner & Visual Storyteller.
          </p>

          <p className="font-jakarta text-sm sm:text-base text-white/65 leading-relaxed">
            I engineer software across the stack—from scalable MERN architectures
            and intelligent computer vision models to intuitive UI/UX design and
            creative digital content.
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
            {stats.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="flex flex-col"
              >
                <span className="font-clash text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {s.value}
                </span>
                <span className="font-jakarta text-[11px] text-white/45 uppercase tracking-wider mt-0.5">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Glassmorphic Bento Grid */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Main Philosophy Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group relative bg-[#121214]/65 hover:bg-[#121214]/80 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/[0.18] rounded-3xl p-7 md:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.25),inset_0_-1px_1px_0_rgba(0,0,0,0.4)] transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-jakarta tracking-[0.2em] uppercase text-white/40 font-semibold">
                Philosophy
              </span>
              <Sparkles className="w-4 h-4 text-pAccent" />
            </div>

            <p className="font-jakarta text-base md:text-lg text-white/90 leading-relaxed font-normal">
              Merging deep technical logic—from machine learning algorithms to full-stack
              engineering—with intuitive design and creative media production. Every project is
              approached with architectural rigor, scalability, and visual clarity.
            </p>
          </motion.div>

          {/* 2x2 Specialized Domain Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => (
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
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/15 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)] transition-colors duration-300"
              >
                <div>
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-3.5 group-hover:bg-white/[0.1] transition-all"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="font-clash text-base md:text-lg font-medium text-white mb-1.5 group-hover:text-pAccent transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-jakarta text-xs md:text-sm text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 mt-5 text-[11px] uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                  <span>Domain</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;