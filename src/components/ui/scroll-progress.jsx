import { motion, useScroll } from "motion/react";

import { cn } from "@/lib/utils"

export function ScrollProgress({
  className,
  ref,
  ...props
}) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-pAccent via-[#bbf238] to-sAccent shadow-[0_0_10px_rgba(168,218,34,0.7)]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
}
