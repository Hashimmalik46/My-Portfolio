import { useState } from "react";
import { motion } from "motion/react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav className="w-full flex items-center justify-between px-10 md:px-30 pt-10 cursor-grab">
      <motion.h1
        drag
        whileDrag={{
          cursor:"grabbing"
        }
        }
        dragConstraints={{
          left: 0,
          top: 0,
          right: 1000,
          bottom: 1000,
        }}
        className="font-khuma text-3xl font-bold text-black"
      >
        Hash
      </motion.h1>

      <motion.ul
        initial={{
          y: -200,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          delay: 0.5,
        }}
        className="hidden md:flex gap-6 font-poppins text-[18px] font-semibold"
      >
        <li>
          <a href="#Home">Home</a>
        </li>
        <li>
          <a href="#About">About</a>
        </li>
        <li>
          <a href="#Portfolio">Portfolio</a>
        </li>
        <li>
          <a href="#Contact">Contact</a>
        </li>
      </motion.ul>

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
        <div className="absolute top-20 left-0 w-full bg-pAccent flex flex-col items-center gap-8 py-10 md:hidden font-poppins">
          <a href="#Home">Home</a>
          <a href="#About">About</a>
          <a href="#Portfolio">Portfolio</a>
          <a href="#Contact">Contact</a>

          <div className="flex gap-5 mt-4">
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
        </div>
      )}
    </motion.nav>
  );
}

export default Navbar;
