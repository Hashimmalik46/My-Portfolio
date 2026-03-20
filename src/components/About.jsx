import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function About() {
  const ref = useRef(null);

  // Scroll trigger for this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.3"], // starts at ~20% visibility
  });

  // Image animation (comes up)
  const imgY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const imgOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Text container animation (slight delay feel)
  const textOpacity = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  // Word animation variants
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const text =
    "I am a passionate developer focused on building modern, responsive and visually engaging web experiences.";

  return (
    <div
      ref={ref}
      className="flex flex-col md:flex-row items-start gap-10 px-6 md:px-20"
    >
      {/* Image */}
      <motion.div
        style={{ y: imgY, opacity: imgOpacity }}
        className="w-full md:w-1/2"
      >
        <img
          src="/character.png"
          alt="About"
          className="w-full shadow-2xl"
        />
      </motion.div>

      {/* Text */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="w-full md:w-1/2 text-white"
      >
        <h2 className="text-4xl font-bold mb-4 font-longsile">About Me</h2>

        <motion.p
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="text-lg text-gray-300 leading-relaxed font-poppins"
        >
          {text.split(" ").map((wordText, i) => (
            <motion.span
              key={i}
              variants={word}
              className="inline-block mr-2"
            >
              {wordText}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </div>
  );
}

export default About;