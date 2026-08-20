import { useRef, useState } from "react";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const projects = [
  {
    title: "Role Based Clinic Management System",
    img: "/gallery/Zooncare.webp",
    category: "Full Stack",
    short_desc:
      "Full-stack clinical management platform built with a role-based access architecture, secure doctor-patient records, and real-time scheduling.",
    tags: [
      { id: 1, img: "/gallery/react.webp", tag: "React" },
      { id: 2, img: "/gallery/tailwind.webp", tag: "Tailwind" },
    ],
    link: "https://zooncare.in",
  },
  {
    title: "Dandwoat Dental Clinic",
    img: "/gallery/dandwoat.webp",
    category: "Web Platform",
    short_desc:
      "Comprehensive dental healthcare portal featuring online appointment bookings, treatment guides, and patient inquiry workflows.",
    tags: [
      { id: 1, img: "/gallery/wordpress.webp", tag: "WordPress" },
      { id: 2, img: "/gallery/css.webp", tag: "CSS" },
    ],
    link: "https://dandwoat.com",
  },
  {
    title: "IntelliSentry Hostel Management System",
    img: "/gallery/intellisentry.webp",
    category: "Full Stack",
    short_desc:
      "Smart hostel administration platform handling automated check-ins, student records, and room allocations with custom backend logic.",
    tags: [
      { id: 1, img: "/gallery/react.webp", tag: "React" },
      { id: 2, img: "/gallery/supabase.webp", tag: "Supabase" },
      { id: 3, img: "/gallery/flask.webp", tag: "Flask" },
    ],
    link: "https://intellisentry.vercel.app",
  },
  {
    title: "Campus Connect",
    img: "/gallery/CC.webp",
    category: "Social Platform",
    short_desc:
      "Closed academic social network enabling campus-wide student communication, event feeds, and peer collaborations.",
    tags: [
      { id: 1, img: "/gallery/html.webp", tag: "HTML" },
      { id: 2, img: "/gallery/css.webp", tag: "CSS" },
      { id: 3, img: "/gallery/js.webp", tag: "JavaScript" },
    ],
    link: "https://kwitter-nine.vercel.app/",
  },
  {
    title: "Arabic with Dr Sajad",
    img: "/gallery/SS.webp",
    category: "EdTech",
    short_desc:
      "Content-driven publishing and educational platform with integrated video course delivery, membership tiers, and payments.",
    tags: [{ id: 1, img: "/gallery/wordpress.webp", tag: "WordPress" }],
    link: "https://arabicwithdrsajad.com/",
  },
  {
    title: "Agentic AI for Lead Generation",
    img: "/gallery/agentic.webp",
    category: "AI & Automation",
    short_desc:
      "Autonomous agent-driven workflow designed to extract, qualify, and route high-intent leads using machine intelligence and API pipelines.",
    tags: [
      { id: 1, img: "/gallery/react.webp", tag: "React" },
      { id: 2, img: "/gallery/flask.webp", tag: "Flask" },
      { id: 3, img: "/gallery/supabase.webp", tag: "Supabase" },
    ],
    link: "#",
  },
  {
    title: "Safe School Bus Tracker",
    img: "/gallery/bus.webp",
    category: "Real-Time Tracking",
    short_desc:
      "Real-time school transport and child tracking application with instant route updates and synchronized parent alerts.",
    tags: [
      { id: 1, img: "/gallery/react.webp", tag: "React" },
      { id: 2, img: "/gallery/supabase.webp", tag: "Supabase" },
      { id: 3, img: "/gallery/tailwind.webp", tag: "Tailwind" },
    ],
    link: "https://live-school-bus-tracking.vercel.app/",
  },
];

function StackingCard({ project, index, total }) {
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Curvy organic rotation deck angles
  const angles = [-1.8, 1.6, -1.4, 1.8, -1.5, 1.4, -1.6];
  const angle = angles[index % angles.length];

  const isLongDesc = project.short_desc && project.short_desc.length > 180;

  return (
    <div
      ref={containerRef}
      className="sticky top-24 sm:top-28 w-full max-w-xl sm:max-w-2xl mx-auto mb-20 sm:mb-28 md:mb-36 last:mb-0"
      style={{
        zIndex: index + 10,
      }}
    >
      <div
        className="group relative w-full rounded-3xl bg-[#0e0f13] hover:bg-[#121319] border border-white/15 hover:border-pAccent/40 p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(168,218,34,0.12)] transition-all duration-300 flex flex-col gap-4 will-change-transform origin-center hover:scale-[1.02] hover:!rotate-0"
        style={{
          transform: `rotate(${angle}deg)`,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {/* Top: Card Image Container */}
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="relative block w-full aspect-[16/9] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-[#070709] border border-white/10 group-hover:border-pAccent/30 p-1.5 transition-colors duration-300 shadow-xl cursor-pointer"
        >
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-full object-contain rounded-xl opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-xl" />

          {/* Top-Left: Category Tag with Code Icon */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/85 border border-white/20 shadow-md">
            <Code2 className="w-3 h-3 text-pAccent shrink-0" strokeWidth={2.2} />
            <span className="text-[10px] font-jakarta uppercase tracking-wider text-white font-medium">
              {project.category}
            </span>
          </div>

          {/* Top-Right: Glassmorphic External Link Badge */}
          <div className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/85 border border-white/25 flex items-center justify-center text-pAccent group-hover:bg-pAccent group-hover:text-black group-hover:border-pAccent transition-all duration-300 shadow-md">
            <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </div>
        </a>

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

            <div className="text-xs sm:text-sm text-white/80 leading-relaxed font-jakarta">
              <span>
                {isLongDesc && !isExpanded
                  ? `${project.short_desc.slice(0, 170)}...`
                  : project.short_desc}
              </span>
              {isLongDesc && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="inline-block ml-1.5 font-semibold text-pAccent hover:text-white transition-colors cursor-pointer text-xs underline decoration-pAccent/50 hover:decoration-white"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Tech Stack Pills & Visit CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/10">
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {project.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1.5 text-[11px] font-jakarta text-white/85 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 hover:text-white px-2.5 py-1 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  <img
                    src={tag.img}
                    alt={tag.tag}
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span className="font-medium">{tag.tag}</span>
                </div>
              ))}
            </div>

            {/* Visit Project CTA */}
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-pAccent text-black font-clash font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_4px_16px_rgba(255,255,255,0.15)] shrink-0 cursor-pointer"
              >
                <span>Visit Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section
      id="Projects"
      className="relative w-full flex flex-col items-center justify-center px-6 md:px-16 pt-28 pb-36 z-10 text-white"
    >
      <div className="max-w-6xl w-full flex flex-col gap-14">
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
              02
            </span>
            <span className="w-6 h-px bg-white/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium">
              Selected Works
            </span>
          </div>

          <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9]">
            Selected Projects
          </h2>

          <p className="font-cormorant italic text-2xl sm:text-3xl text-white/85 font-light max-w-xl">
            A showcase of full-stack engineering, AI implementations, and
            production web platforms.
          </p>
        </motion.div>

        {/* Stacking Cards Deck Container */}
        <div className="relative w-full flex flex-col items-center">
          {projects.map((project, index) => (
            <StackingCard
              key={index}
              project={project}
              index={index}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
