import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { portfolioData } from "../data/portfolioData";

function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { personal } = portfolioData;

  const name = personal?.name || "Hashim Malik";

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1450; // Snappy, elegant 1.45s

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
        }, 750); // Smooth curtain duration
      }
    };

    const frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={isFinished ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
      className="fixed inset-0 z-[100] flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-[#08080a] text-white select-none pointer-events-auto overflow-hidden"
    >
      {/* Top minimal bar with lime pulse */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-pulse shadow-[0_0_8px_#a8da22]" />
          <span className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-white/50 font-medium">
            Portfolio
          </span>
        </div>
        <span className="font-mono text-[11px] tracking-[0.2em] text-pAccent font-semibold drop-shadow-[0_0_8px_rgba(168,218,34,0.4)]">
          {new Date().getFullYear()}
        </span>
      </div>

      {/* Center Refined Wordmark & Unique Lime Laser Bar */}
      <motion.div
        animate={isFinished ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-5 max-w-sm mx-auto w-full"
      >
        <h1 className="font-cormorant italic text-3xl sm:text-4xl md:text-5xl text-white/95 font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          {name}
        </h1>

        {/* Distinctive Precision Laser Bar with Lead Flare & Notches */}
        <div className="w-40 sm:w-48 flex flex-col items-center">
          <div className="w-full h-[2.5px] bg-white/[0.08] relative overflow-hidden rounded-full backdrop-blur-md">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-pAccent/40 via-pAccent to-pAccent shadow-[0_0_14px_rgba(168,218,34,0.9)] rounded-full"
              style={{ width: `${count}%` }}
            >
              {/* Glowing Lead Node Flare */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_12px_#a8da22]" />
            </motion.div>
          </div>

          {/* Micro Precision Tick Notches */}
          <div className="w-full flex justify-between px-0.5 mt-1.5 opacity-30">
            <span className="w-[1px] h-[3px] bg-pAccent" />
            <span className="w-[1px] h-[3px] bg-pAccent" />
            <span className="w-[1px] h-[3px] bg-pAccent" />
            <span className="w-[1px] h-[3px] bg-pAccent" />
            <span className="w-[1px] h-[3px] bg-pAccent" />
          </div>
        </div>
      </motion.div>

      {/* Bottom Minimal Status & Lime Percentage */}
      <div className="flex items-center justify-between w-full font-mono text-xs sm:text-sm tracking-[0.2em]">
        <div className="flex items-center gap-1.5">
          <span className="text-pAccent font-mono text-xs">&gt;</span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-jakarta font-medium">
            {count < 100 ? "INITIALIZING" : "READY"}
          </span>
        </div>
        <span className="tabular-nums font-semibold text-pAccent font-mono drop-shadow-[0_0_10px_rgba(168,218,34,0.5)]">
          {count.toString().padStart(2, "0")}%
        </span>
      </div>
    </motion.div>
  );
}

export default Preloader;