import { motion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

export function ScrollProgress({
  className,
  ref,
  ...props
}) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-secondary via-secondary to-pAccent shadow-[0_0_12px_rgba(168,218,34,0.7)]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
}

export default ScrollProgress;
