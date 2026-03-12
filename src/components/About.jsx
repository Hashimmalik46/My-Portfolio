import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function About() {
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState("about");

  const activeClass =
    "text-sm md:text-xl text-pAccent underline font-poppins cursor-pointer transition-all duration-200";

  const inactiveClass =
    "text-sm md:text-xl text-white font-poppins cursor-pointer transition-all duration-200";


  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });

  const opacity1 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const y1 = useTransform(scrollYProgress, [0.2, 0.4], [20, 0]);

  const opacity2 = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.45], [20, 0]);

  const opacity3 = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const y3 = useTransform(scrollYProgress, [0.3, 0.5], [20, 0]);

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <div ref={ref} className="px-6 md:px-20">
      <motion.h1
        style={{ opacity, y }}
        className="font-longsile text-3xl md:text-5xl text-white mb-8"
      >
        About Me
      </motion.h1>

      <ul ref={ref} className="flex gap-6 md:gap-10 my-6 md:my-10">
        <motion.li
          style={{ opacity: opacity1, y: y1 }}
          className={activeTab === "about" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("about")}
        >
          About
        </motion.li>

        <motion.li
          style={{ opacity: opacity2, y: y2 }}
          className={activeTab === "skills" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("skills")}
        >
          Skills
        </motion.li>

        <motion.li
          style={{ opacity: opacity3, y: y3 }}
          className={activeTab === "exp" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("exp")}
        >
          Experience
        </motion.li>
      </ul>

      <motion.div style={{ opacity, y }} className="overflow-hidden">
        {activeTab === "about" && (
          <p className="text-base md:text-xl text-white font-poppins max-w-[600px]">
            I'm Hashim Malik, a passionate Frontend Developer who enjoys
            building clean and interactive web applications.
          </p>
        )}

        {activeTab === "skills" && (
          <div className="flex gap-6 md:gap-10 items-center flex-wrap">
            <img src="html.png" className="w-10 md:w-14" />
            <img src="css.png" className="w-10 md:w-14" />
            <img src="js.png" className="w-10 md:w-14" />
            <img src="react.png" className="w-10 md:w-14" />
            <img src="tailwind.png" className="w-10 md:w-14" />
          </div>
        )}

        {activeTab === "exp" && (
          <p className="text-base md:text-xl text-white font-poppins">
            Currently building projects and improving my frontend skills.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default About;
