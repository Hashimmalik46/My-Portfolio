import { useState } from "react";
import {
  AnimatePresence,
  anticipate,
  easeIn,
  easeInOut,
  motion,
} from "motion/react";
import Skills from "./Skills";
import Orbit from "./OrbitSkills";
import { delay } from "motion";

const tabs = ["About", "Skills", "Experience"];
function About() {
  const [activeTab, setActiveTab] = useState("About");
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="md:flex md:justify-around flex flex-wrap gap-5 justify-center"
    >
      <div className="w-[300px] h-[300px] md:w-150 md:h-150 mt-10">
        <img
          src="/character.png"
          className="w-full h-full object-cover rounded-full"
          alt="character"
        />
      </div>

      <div className="gap-3 md:w-1/2 flex flex-col md:gap-5">
        <h1 className="text-3xl text-white font-longsile self-center mt-5">
          About Me
        </h1>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-full rounded-2xl p-2 flex items-center justify-between font-poppins shadow-lg md:justify-around">
          {tabs.map((tab) => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xl px-4 py-1.5 rounded-xl cursor-pointer transition-all duration-300
      ${
        activeTab === tab
          ? "bg-white/30 backdrop-blur-md text-white shadow-md scale-105 border border-white/30"
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
            >
              {tab}
            </span>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {activeTab === "About" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: easeInOut }}
            >
              <p className="text-white text-xl font-poppins text-justify mt-5">
                Frontend developer crafting modern, interactive web experiences
                with a focus on design, performance, and user experience. Always
                learning, always building.
              </p>
            </motion.div>
          )}

          {activeTab === "Skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: easeInOut }}
            >
              <Orbit />
            </motion.div>
          )}

          {activeTab === "Experience" && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: easeInOut }}
              className="text-white text-xl font-poppins text-justify mt-5"
            >
              <p className="text-white text-xl font-poppins text-center mt-5">
                Coming soon...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default About;
