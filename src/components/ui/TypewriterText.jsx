import { useState, useEffect } from "react";

/**
 * TypewriterText Component
 * Types out once when isLoading is false.
 * Renders in-flow so that CSS text gradients (bg-clip-text) and drop-shadows
 * paint correctly with 100% visibility across all browsers.
 */
export default function TypewriterText({
  text = "",
  speed = 58,
  delay = 200,
  isLoading = false,
  className = "",
  cursorClassName = "",
  showCursor = true,
}) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isLoading || !text) {
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
  }, [isLoading, text, speed, delay]);

  const visibleText = text.slice(0, displayedLength);

  return (
    <span className={`inline-block whitespace-nowrap ${className}`}>
      <span>{visibleText}</span>
      {showCursor && !isFinished && (
        <span
          className={`inline-block ml-1 w-[3px] sm:w-[4px] h-[0.8em] bg-white align-baseline animate-pulse ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
