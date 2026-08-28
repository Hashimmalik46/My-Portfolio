import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function ScrollFadeWord({ word, progress, range, activeColor = "text-secondary" }) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block ${activeColor} will-change-transform`}
    >
      {word}
    </motion.span>
  );
}

export default function ScrollFadeText({
  as: Component = "p",
  text,
  className = "",
  activeColor = "text-secondary",
  offset = ["start 90%", "start 50%"],
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const words = text ? text.split(" ") : [];

  return (
    <Component
      ref={containerRef}
      className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}
    >
      {words.map((word, i) => {
        const start = i / Math.max(words.length, 1);
        const end = Math.min(1, start + (1.2 / Math.max(words.length, 1)));
        return (
          <ScrollFadeWord
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            activeColor={activeColor}
          />
        );
      })}
    </Component>
  );
}
