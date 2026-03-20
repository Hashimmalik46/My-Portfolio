import { motion } from "framer-motion";

function Skills() {
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-[80vh] px-6 md:px-20">
      
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-15 text-center font-longsile text-white">
        My Expertise
      </h2>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        className="grid md:grid-cols-2 gap-10"
      >

        <motion.div
          variants={card}
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 rounded-3xl p-8 shadow-2xl"
        >
          <h3 className="text-2xl font-semibold mb-4 text-white">Frontend Development</h3>
          
          <p className="text-gray-400 mb-6">
            Building responsive, fast and interactive web applications with modern frameworks and tools.
          </p>

          <div className="flex flex-wrap gap-3 ">
            {["React", "Next.js", "Tailwind CSS", "JavaScript", "Framer Motion"].map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={card}
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 rounded-3xl p-8 shadow-2xl"
        >
          <h3 className="text-2xl font-semibold mb-4 text-white">UI/UX Design</h3>
          
          <p className="text-gray-400 mb-6">
            Designing intuitive and visually appealing user interfaces with a focus on user experience and accessibility.
          </p>

          <div className="flex flex-wrap gap-3">
            {["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research"].map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default Skills;