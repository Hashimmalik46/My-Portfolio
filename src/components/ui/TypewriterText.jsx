import { useState, useEffect, useRef } from "react";
import { useInView } from "motion/react";

/**
 * TypewriterText Component
 * Types out once when scrolled into view.
 * Uses a zero-shift invisible ghost layout spacer so elements below NEVER shift or jump.
 */
export default function TypewriterText({
  text = "",
  speed = 28,
  delay = 200,
  className = "",
  cursorClassName = "text-pAccent",
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px 0px" });

  const [displayedLength, setDisplayedLength] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isInView || !text) return;

    let interval;
    let currentCount = 0;

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        currentCount += 1;
        setDisplayedLength(currentCount);
        if (currentCount >= text.length) {
          clearInterval(interval);
          setIsFinished(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [isInView, text, speed, delay]);

  return (
    <span ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* 1. Ghost text spacer: instantly locks the full multi-line height & width */}
      <span className="invisible select-none pointer-events-none block" aria-hidden="true">
        {text}
      </span>

      {/* 2. Actively typed overlay */}
      <span className="absolute inset-0 block text-inherit">
        <span>{text.slice(0, displayedLength)}</span>
        {!isFinished && (
          <span
            className={`inline-block ml-0.5 w-[2px] h-[0.9em] bg-current align-middle animate-pulse ${cursorClassName}`}
            aria-hidden="true"
          />
        )}
      </span>
    </span>
  );
}
