import { ArrowUpRight, Code2 } from "lucide-react";
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
    title: "Safee School Bus Tracker",
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

function Projects() {
  return (
    <section
      id="Projects"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-28 z-10 text-white"
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

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project, index) => (
            <motion.a
              key={index}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: (index % 3) * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -6,
                scale: 1.015,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/15 hover:border-pAccent/40 p-4 transition-colors duration-200 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(168,218,34,0.12)] flex-1 justify-between"
            >
              {/* Card Image Container */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#0c0c0e] border border-white/10 group-hover:border-pAccent/30 flex items-center justify-center p-1.5 transition-colors duration-300">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-contain rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-xl" />

                {/* Top-Left: Category Tag with Code Icon */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <Code2 className="w-3 h-3 text-pAccent shrink-0" strokeWidth={2.2} />
                  <span className="text-[10px] font-jakarta uppercase tracking-wider text-white/85 font-medium">
                    {project.category}
                  </span>
                </div>

                {/* Top-Right: Glassmorphic Arrow Badge in Lime */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 flex items-center justify-center text-pAccent group-hover:bg-pAccent group-hover:text-black group-hover:border-pAccent transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 justify-between gap-4 p-2 pt-5">
                <div>
                  <h3 className="font-clash text-lg md:text-xl font-medium text-white group-hover:text-pAccent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="font-jakarta text-xs md:text-sm text-white/60 line-clamp-3 leading-relaxed mt-2">
                    {project.short_desc}
                  </p>
                </div>

                {/* Minimalist Tech Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                  {project.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1.5 text-[11px] font-jakarta text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 hover:text-white px-2.5 py-1 rounded-lg transition-colors duration-200 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.08)]"
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
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
