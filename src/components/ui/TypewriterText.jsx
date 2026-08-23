import { useState, useEffect, useRef } from "react";
import { useInView } from "motion/react";

/**
 * TypewriterText Component
 * Types out characters smoothly when scrolled into view.
 * Renders in-flow with natural multi-line text wrapping across all mobile, tablet, and desktop screens.
 */
export default function TypewriterText({
  text = "",
  speed = 36,
  delay = 200,
  isLoading = false,
  className = "",
  cursorClassName = "",
  showCursor = true,
  nowrap = false,
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20px 0px" });

  const [displayedLength, setDisplayedLength] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isLoading || !isInView || !text) {
      setDisplayedLength(0);
      setIsFinished(false);
      return;
    }

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
  }, [isLoading, isInView, text, speed, delay]);

  const visibleText = text.slice(0, displayedLength);

  return (
    <span
      ref={containerRef}
      className={`inline text-inherit break-words ${nowrap ? "whitespace-nowrap" : "whitespace-normal"} ${className}`}
    >
      <span>{visibleText}</span>
      {showCursor && !isFinished && (
        <span
          className={`inline-block ml-0.5 w-[2px] sm:w-[3px] h-[0.8em] bg-current align-baseline animate-pulse ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
