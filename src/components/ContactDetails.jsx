import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";

function ContactDetails() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="font-poppins mt-10 flex flex-col items-center gap-10"
    >
      <div className="flex items-center gap-3">
        <MdEmail size={35} color="#A8da22" />
        <a
          href="mailto:hashimzahoor2003@gmail.com"
          className="underline hover:text-pAccent transition-all duration-300"
        >
          hashimzahoor2003@gmail.com
        </a>
      </div>
      <div className="flex items-center gap-3 self-start">
        <IoLocationSharp size={35} color="#A8da22" />
        <p>Srinagar, Kashmir</p>
      </div>
      <div className="flex items-center gap-3">
        <a href="https://instagram.com/i_hash46" target="blank">
          <img
            src="instagram.png"
            className="w-15 hover:scale-105 transition-all duration-300"
          />
        </a>
        <a href="https://x.com/hashimm447" target="blank">
          <img
            src="twitter.png"
            className="w-15 hover:scale-105 transition-all duration-300"
          />
        </a>
      </div>
    </motion.div>
  );
}

export default ContactDetails;
