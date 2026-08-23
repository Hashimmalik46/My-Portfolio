import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * Smooth Pill-Shaped Slider Toggle Component
 *
 * Provides a tactile, smooth spring-sliding pill switch between Light and Dark modes
 * with celestial icons, Apple glass styling, and micro-animations.
 *
 * @param {'default' | 'glass' | 'minimal' | 'pill'} variant Visual styling variant
 * @param {'sm' | 'md' | 'lg'} size Sizing presets
 * @param {boolean} showLabel Optional text label next to the toggle
 * @param {string} className Additional container CSS class names
 */
export default function ThemeToggle({
  isDark: controlledIsDark,
  onToggle: controlledOnToggle,
  variant = "default",
  size = "md",
  showLabel = false,
  className = "",
}) {
  let contextTheme = null;
  try {
    contextTheme = useTheme();
  } catch (e) {
    // Context may not exist in isolated subtrees
  }

  const isDark = controlledIsDark !== undefined ? controlledIsDark : (contextTheme?.isDark ?? false);
  const toggleTheme = controlledOnToggle !== undefined ? controlledOnToggle : (contextTheme?.toggleTheme || (() => {}));
  const [isHovered, setIsHovered] = useState(false);

  // Sizing specifications: track dimensions, knob size, travel translation, icon sizes
  const sizeConfig = {
    sm: {
      track: "w-[46px] h-[24px] p-[2px]",
      knob: "w-[18px] h-[18px]",
      travel: 22,
      iconSize: 11,
      bgIconSize: 10,
    },
    md: {
      track: "w-[54px] h-[28px] p-[2.5px]",
      knob: "w-[21px] h-[21px]",
      travel: 26,
      iconSize: 13,
      bgIconSize: 11,
    },
    lg: {
      track: "w-[64px] h-[32px] p-[3px]",
      knob: "w-[24px] h-[24px]",
      travel: 32,
      iconSize: 15,
      bgIconSize: 13,
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  // Track background styling based on variant & active theme
  let trackVariantClass = "";
  if (variant === "glass") {
    trackVariantClass = isDark
      ? "bg-[#0b0e14]/80 border-white/25 shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.6),0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-xl"
      : "bg-white/30 border-white/50 shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.6),0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-xl";
  } else {
    trackVariantClass = isDark
      ? "bg-[#121622] hover:bg-[#161c2c] border-white/12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.2)]"
      : "bg-amber-100/90 hover:bg-amber-200/80 border-amber-300/80 shadow-[inset_0_2px_4px_rgba(217,119,6,0.12),0_1px_2px_rgba(0,0,0,0.05)]";
  }

  // Sliding Knob / Thumb Styling
  const knobVariantClass = isDark
    ? "bg-gradient-to-b from-[#1e2333] to-[#0f1320] border-white/20 text-amber-300 shadow-[0_2px_8px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.35)]"
    : "bg-gradient-to-b from-white to-amber-50 border-amber-200 text-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,1)]";

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <motion.button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className={`relative isolate flex items-center rounded-full border cursor-pointer select-none transition-colors duration-300 transform-gpu overflow-hidden shrink-0 ${currentSize.track} ${trackVariantClass}`}
      >
        {/* Track Fixed Background Icons (Revealed as thumb slides across) */}
        <div className="absolute inset-0 flex items-center justify-between px-[5px] pointer-events-none z-0">
          {/* Sun icon on Left */}
          <div
            className={`flex items-center justify-center transition-opacity duration-300 ${
              isDark ? "opacity-40 text-gray-400" : "opacity-0"
            }`}
          >
            <Sun size={currentSize.bgIconSize} strokeWidth={2.2} />
          </div>

          {/* Moon icon on Right */}
          <div
            className={`flex items-center justify-center transition-opacity duration-300 ${
              isDark ? "opacity-0" : "opacity-45 text-amber-900"
            }`}
          >
            <Moon size={currentSize.bgIconSize} strokeWidth={2} />
          </div>
        </div>

        {/* Smooth Sliding Spring Thumb */}
        <motion.div
          initial={false}
          animate={{ x: isDark ? currentSize.travel : 0 }}
          transition={{
            type: "spring",
            stiffness: 520,
            damping: 30,
            mass: 0.6,
          }}
          className={`relative z-10 flex items-center justify-center rounded-full border ${currentSize.knob} ${knobVariantClass}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon-thumb"
                initial={false}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center justify-center text-amber-300"
              >
                <Moon size={currentSize.iconSize} className="fill-amber-300/30" strokeWidth={2.2} />
              </motion.div>
            ) : (
              <motion.div
                key="sun-thumb"
                initial={false}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center justify-center text-amber-500"
              >
                <Sun size={currentSize.iconSize} strokeWidth={2.4} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>

      {/* Optional Label */}
      {showLabel && (
        <span
          onClick={toggleTheme}
          className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none hover:text-gray-900 dark:hover:text-white transition-colors font-jakarta"
        >
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}

      {/* Floating Micro-Tooltip on Desktop */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.88 }}
            transition={{ duration: 0.14 }}
            className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[10.5px] font-medium tracking-wide rounded-full pointer-events-none whitespace-nowrap shadow-xl z-50 hidden sm:block font-jakarta ${
              isDark
                ? "bg-[#141722]/95 text-gray-200 border border-white/15 backdrop-blur-md"
                : "bg-gray-900/95 text-white border border-gray-800 backdrop-blur-md"
            }`}
          >
            {isDark ? "Switch to Light" : "Switch to Dark"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
