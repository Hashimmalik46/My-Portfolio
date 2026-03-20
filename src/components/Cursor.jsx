import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[999]"
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        background: "#fdb144",
        boxShadow: "0 0 20px #fdb144",
      }}
    />
  );
}

export default Cursor;