import { ArrowDown, Sparkles } from "lucide-react";
import { motion } from "motion/react";

function Hero({ isLoading = false }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={!isLoading ? "visible" : "hidden"}
      className="relative w-full flex-1 flex flex-col items-center justify-center text-center px-4 z-10 text-white select-none"
    >
      {/* Main Editorial Headline */}
      <motion.div
        variants={itemVariants}
        className="relative flex flex-col items-center leading-[0.85] tracking-tight"
      >
        <span className="font-cormorant italic font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          Hi, I'm
        </span>
        <span className="font-clashM text-5xl sm:text-7xl md:text-8xl lg:text-9xl mt-3 sm:mt-4 ml-8 sm:ml-20 md:ml-32 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
          Hashim Malik
        </span>
      </motion.div>

      {/* Subtitle & Tagline */}
      <motion.p
        variants={itemVariants}
        className="mt-6 sm:mt-8 font-jakarta text-base sm:text-xl md:text-2xl font-light text-white/75 tracking-wide max-w-xl"
      >
        A software engineer crafting interfaces where{" "}
        <span className="font-cormorant italic text-white font-normal text-xl sm:text-2xl md:text-3xl">
          code
        </span>{" "}
        meets{" "}
        <span className="font-cormorant italic text-white font-normal text-xl sm:text-2xl md:text-3xl">
          pure aesthetics
        </span>
        .
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={itemVariants}
        className="mt-8 flex items-center gap-4 font-jakarta z-20"
      >
        <motion.a
          href="#Projects"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="px-7 py-3.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white/90 transition-colors shadow-[0_0_25px_rgba(255,255,255,0.25)]"
        >
          View Projects
        </motion.a>
        <motion.a
          href="#Contact"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="px-7 py-3.5 rounded-full bg-gradient-to-b from-white/[0.14] to-white/[0.06] hover:from-white/[0.20] hover:to-white/[0.10] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/25 text-white font-medium text-xs sm:text-sm uppercase tracking-wider hover:border-white/45 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.3)]"
        >
          Get In Touch
        </motion.a>
      </motion.div>

      {/* Bottom Floating Philosophy Glass Card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.8 },
          x: { duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="hidden lg:flex flex-col absolute bottom-12 right-8 xl:right-16 max-w-[300px] bg-black/40 backdrop-blur-2xl backdrop-saturate-[180%] border-l-2 border-l-pAccent border-y border-r border-white/15 p-4.5 rounded-r-2xl text-left font-jakarta shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.2)]"
      >
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-semibold">
            Philosophy
          </p>
          <Sparkles className="w-3.5 h-3.5 text-pAccent" />
        </div>
        <p className="text-xs sm:text-sm text-white/85 leading-snug">
          Designing with intention, building with precision.{" "}
          <span className="italic font-cormorant text-base sm:text-lg text-white">
            Code meets aesthetics.
          </span>
        </p>
      </motion.div>

      {/* Bottom Scroll Cue */}
      <motion.a
        href="#About"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-jakarta">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </motion.a>
    </motion.div>
  );
}

export default Hero;