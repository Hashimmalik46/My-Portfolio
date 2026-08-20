import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";
import { Send, CheckCircle2, Sparkles } from "lucide-react";
import { BorderBeam } from "./ui/border-beam";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";

function Contact() {
  const [state, handleSubmit] = useForm("xeerdlnq");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (state.succeeded) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  return (
    <section
      id="Contact"
      className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-28 z-10 text-white"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Heading, Info & Direct Contact Channels */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 flex flex-col gap-6"
        >
          {/* Editorial Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="font-clashM text-xs text-pAccent tracking-[0.25em] uppercase font-semibold">03</span>
            <span className="w-6 h-px bg-white/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium">
              Get In Touch
            </span>
          </div>

          {/* Editorial Heading */}
          <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9]">
            Let’s Connect
          </h2>

          <p className="font-cormorant italic text-2xl sm:text-3xl text-white/85 font-light leading-relaxed">
            Have a project in mind, an opportunity, or just want to talk tech?
          </p>

          <p className="font-jakarta text-sm sm:text-base text-white/60 leading-relaxed max-w-lg">
            My inbox is always open. Whether it’s a full-stack system, AI pipeline, 
            or UI/UX design collaboration, let’s build something impactful together.
          </p>

          {/* Apple-Style Glassmorphic Contact Tiles */}
          <div className="flex flex-col gap-3 pt-2 w-full max-w-md">
            {/* Email Card */}
            <motion.a
              href="mailto:hashimzahoor2003@gmail.com"
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="group flex items-center gap-4 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/15 hover:border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)] transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MdEmail size={20} className="text-pAccent" />
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[10px] font-jakarta uppercase tracking-wider text-white/40 font-semibold">
                  Email
                </span>
                <span className="text-xs sm:text-sm font-jakarta text-white/90 group-hover:text-white truncate">
                  hashimzahoor2003@gmail.com
                </span>
              </div>
            </motion.a>

            {/* Location Card */}
            <motion.div
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.2)]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
                <IoLocationSharp size={20} className="text-pAccent" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-jakarta uppercase tracking-wider text-white/40 font-semibold">
                  Location
                </span>
                <span className="text-xs sm:text-sm font-jakarta text-white/90">
                  Srinagar, Kashmir
                </span>
              </div>
            </motion.div>

            {/* Social Channels Row */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <motion.a
                href="https://www.linkedin.com/in/hashim-malik-a868102b0/"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/10 hover:border-white/25 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] transition-colors duration-300 group"
              >
                <FaLinkedinIn size={13} className="text-white/70 group-hover:text-pAccent transition-colors" />
                <span className="text-xs font-jakarta text-white/70 group-hover:text-white font-medium">
                  LinkedIn
                </span>
              </motion.a>

              <motion.a
                href="https://instagram.com/i_hash46"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/10 hover:border-white/25 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] transition-colors duration-300 group"
              >
                <img
                  src="/gallery/instagram.webp"
                  alt="Instagram"
                  className="w-3.5 h-3.5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs font-jakarta text-white/70 group-hover:text-white font-medium">
                  Instagram
                </span>
              </motion.a>

              <motion.a
                href="https://x.com/hashimm447"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/10 hover:border-white/25 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] transition-colors duration-300 group"
              >
                <img
                  src="/gallery/twitter.webp"
                  alt="X (Twitter)"
                  className="w-3.5 h-3.5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs font-jakarta text-white/70 group-hover:text-white font-medium">
                  Twitter
                </span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Liquid Glass Contact Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#121214]/65 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/[0.18] p-7 md:p-9 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.25),inset_0_-1px_1px_0_rgba(0,0,0,0.4)]">
            <BorderBeam duration={8} size={120} />

            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-jakarta tracking-[0.2em] uppercase text-white/40 font-semibold">
                Send a Direct Message
              </span>
              <Sparkles className="w-4 h-4 text-pAccent" />
            </div>

            {/* Success Toast */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-pAccent/15 border border-pAccent/30 text-white font-jakarta text-xs sm:text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden"
                >
                  <CheckCircle2 className="w-4 h-4 text-pAccent flex-shrink-0" />
                  <span>Message delivered! I will get back to you shortly.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-jakarta">
              <input type="text" name="_gotcha" style={{ display: "none" }} />

              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/35 focus:bg-white/[0.07] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/35 focus:bg-white/[0.07] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] transition-all"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                  className="text-xs text-red-400 mt-0.5"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
                  Your Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project, timeline, or idea..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/35 focus:bg-white/[0.07] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] transition-all resize-none"
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                  className="text-xs text-red-400 mt-0.5"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={state.submitting}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 w-full py-3.5 px-6 rounded-xl bg-white hover:bg-white/90 text-black font-clash font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                <span>{state.submitting ? "Sending..." : "Send Message"}</span>
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;