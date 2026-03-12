import { useEffect, useState } from "react";
import { easeOut, motion } from "motion/react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav className="w-full flex items-center justify-between px-10 md:px-30 pt-10 cursor-grab">
      <motion.h1
        // drag
        // whileDrag={{
        //   cursor: "grabbing",
        // }}
        // dragConstraints={{
        //   left: 0,
        //   top: 0,
        //   right: 1000,
        //   bottom: 700,
        // }}
        // dragDirectionLock={true}
        className="font-khuma text-3xl font-bold text-black"
      >
        Hash
      </motion.h1>

      <div className="hidden md:flex gap-6 font-poppins text-[18px] font-semibold">
        {["Home", "About", "Portfolio", "Contact"].map((link, index) => (
          <motion.a
            key={link}
            href={`#${link}`}
            initial={{ y: -20, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              ease: "easeOut",
            }}
            className="inline-block"
          >
            {link}
          </motion.a>
        ))}
      </div>

      <div className="hidden md:flex gap-5">
        <a href="https://github.com/Hashimmalik46" target="_blank">
          <img src="/github.png" className="w-8" />
        </a>
        <a
          href="https://www.linkedin.com/in/hashim-malik-a868102b0/"
          target="_blank"
        >
          <img src="/linkedin.png" className="w-8" />
        </a>
      </div>

      <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="w-6 h-[2px] bg-black mb-1"></div>
        <div className="w-6 h-[2px] bg-black mb-1"></div>
        <div className="w-6 h-[2px] bg-black"></div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 w-full bg-pAccent flex flex-col items-center gap-8 py-7 md:hidden font-poppins"
        >
          {["Home", "About", "Portfolio", "Contact"].map((link, index) => (
            <motion.a
              key={link}
              href={`#${link}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.1 * index,
                duration: 0.3,
                ease: "easeOut",
              }}
              className="text-white text-lg"
            >
              {link}
            </motion.a>
          ))}

          <motion.div
            className="flex gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <a
              href="https://github.com/Hashimmalik46"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/github.png" className="w-8" />
            </a>
            <a
              href="https://www.linkedin.com/in/hashim-malik-a868102b0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/linkedin.png" className="w-8" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
