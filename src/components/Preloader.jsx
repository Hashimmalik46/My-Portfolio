import { useState, useEffect } from "react";
import { motion } from "motion/react";

function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1600; // 1.6s smooth duration

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth custom ease-out
      const eased = 1 - Math.pow(1 - progress, 3.5);
      const current = Math.floor(eased * 100);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setIsFinished(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800); // Allow curtain reveal animation to finish
      }
    };

    const frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070709] text-white select-none overflow-hidden"
    >
      {/* Dynamic Ambient Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[450px] h-[450px] bg-pAccent/20 blur-[140px] rounded-full pointer-events-none"
      />

      {/* Center Minimal Layout */}
      <motion.div
        animate={isFinished ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[260px]"
      >
        {/* Minimal Monogram & Name */}
        <div className="flex flex-col items-center text-center gap-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-pulse" />
            <span className="font-cormorant italic text-2xl sm:text-3xl text-white/95 tracking-wide font-normal">
              Hashim Malik
            </span>
          </div>
          <span className="font-jakarta text-[11px] tracking-[0.2em] uppercase text-white/40">
            Software & Creative
          </span>
        </div>

        {/* Minimal Scaled Hairline Progress Bar */}
        <div className="w-full h-[1.5px] bg-white/10 relative overflow-hidden rounded-full mt-1">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/60 via-white to-pAccent shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ width: `${count}%` }}
          />
        </div>

        {/* Live Percentage & Ready State */}
        <div className="flex items-center justify-between w-full px-1">
          <span className="font-clashM text-xs tracking-[0.25em] text-white/40 tabular-nums">
            {count.toString().padStart(2, "0")}%
          </span>
          <span className="font-jakarta text-[10px] tracking-[0.25em] uppercase text-white/30 font-medium">
            {count < 100 ? "Loading" : "Ready"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Preloader;