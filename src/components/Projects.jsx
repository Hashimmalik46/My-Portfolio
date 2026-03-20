import { motion } from "framer-motion";
import { useState } from "react";

const projects = [
  {
    title: "Role Based Clinic Management System",
    img: "/Zooncare.png",
  },
  {
    title: "Campus Connect",
    img: "/CC.png",
  },
];

function Projects() {
  const [activeIndex, setActiveIndex] = useState(null);
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-[80vh] px-6 md:px-20  text-white">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-longsile">
        Projects
      </h2>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {projects.map((project, i) => (
          <motion.div
            key={i}
            variants={card}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            className="relative overflow-hidden rounded-2xl group cursor-pointer"
          >
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-60 object-cover"
            />

            <div
              className={`absolute inset-0 bg-black/60 flex items-center justify-center transition duration-500 
    ${activeIndex === i ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
            >
              <h3 className="text-xl font-semibold text-center">
                {project.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Projects;
