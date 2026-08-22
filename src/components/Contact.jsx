import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";
import { Send, CheckCircle2, Sparkles, Copy, Check } from "lucide-react";
import { BorderBeam } from "./ui/border-beam";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";
import { portfolioData } from "../data/portfolioData";

function Contact() {
  const { contact } = portfolioData;
  const [state, handleSubmit] = useForm(contact.formspreeFormId);
  const [showMessage, setShowMessage] = useState(false);
  const [copied, setCopied] = useState(false);

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
      className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-28 z-10 bg-c1 text-secondary selection:bg-secondary selection:text-white"
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
            <span className="font-clashM text-xs px-2.5 py-0.5 rounded-full bg-secondary text-pAccent tracking-[0.2em] uppercase font-bold shadow-sm">
              {contact.badgeNumber}
            </span>
            <span className="w-6 h-px bg-secondary/20" />
            <span className="font-jakarta text-[11px] uppercase tracking-[0.25em] text-secondary/60 font-semibold">
              {contact.badgeLabel}
            </span>
          </div>

          {/* Editorial Heading */}
          <h2 className="font-longsile text-5xl sm:text-6xl md:text-7xl text-secondary leading-[0.9]">
            {contact.heading}
          </h2>

          <p className="font-cormorant italic text-2xl sm:text-3xl text-secondary/85 font-light leading-relaxed">
            {contact.subheading}
          </p>

          <p className="font-jakarta text-sm sm:text-base text-secondary/70 leading-relaxed max-w-lg">
            {contact.description}
          </p>

          {/* Porcelain Contact Tiles */}
          <div className="flex flex-col gap-3 pt-2 w-full max-w-md">
            {/* Email Card with One-Click Copy */}
            {contact.email && (
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group relative flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xl border border-secondary/10 hover:border-secondary/25 shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <MdEmail size={20} className="text-pAccent" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[10px] font-jakarta uppercase tracking-wider text-secondary/50 font-semibold">
                      Email
                    </span>
                    <span className="text-xs sm:text-sm font-jakarta text-secondary/90 group-hover:text-secondary truncate font-medium">
                      {contact.email}
                    </span>
                  </div>
                </a>

                {/* Direct Copy Action Button (Icon Only) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(contact.email);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  aria-label="Copy email address"
                  title={copied ? "Copied!" : "Copy email"}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ml-2 cursor-pointer ${
                    copied
                      ? "bg-secondary text-white border border-secondary scale-105 shadow-sm"
                      : "bg-secondary/[0.06] hover:bg-secondary text-secondary hover:text-white border border-secondary/10 hover:border-secondary hover:scale-105 shadow-none"
                  }`}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-pAccent" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </motion.div>
            )}

            {/* Location Card */}
            {contact.location && (
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group flex items-center gap-4 p-3 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xl border border-secondary/10 hover:border-secondary/25 shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <IoLocationSharp size={20} className="text-pAccent" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-jakarta uppercase tracking-wider text-secondary/50 font-semibold">
                    Location
                  </span>
                  <span className="text-xs sm:text-sm font-jakarta text-secondary/90 font-medium">
                    {contact.location}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Social Channels Row */}
            {contact.socialLinks && contact.socialLinks.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {contact.socialLinks.map((soc, idx) => {
                  const SocIcon = soc.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-secondary hover:bg-black text-white border border-secondary shadow-[0_4px_16px_rgba(17,24,39,0.15)] transition-all duration-300 group"
                    >
                      <SocIcon size={14} className="text-pAccent group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-jakarta text-white font-medium">
                        {soc.name}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: Porcelain Glass Contact Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
          <div className="relative w-full rounded-3xl overflow-hidden bg-white/90 backdrop-blur-2xl border border-secondary/10 p-7 md:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04)]">
            <BorderBeam duration={25} size={140} colorFrom="#111827" colorTo="#a8da22" />

            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-jakarta tracking-[0.2em] uppercase text-secondary/50 font-semibold">
                Send a Direct Message
              </span>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-pAccent animate-pulse" />
              </div>
            </div>

            {/* Success Toast aligned with Site Theme */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-6 flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-secondary text-white border border-secondary/20 shadow-[0_12px_30px_rgba(17,24,39,0.18)] overflow-hidden"
                >
                  <div className="w-8 h-8 rounded-xl bg-pAccent/15 border border-pAccent/25 text-pAccent flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-clash font-bold text-xs sm:text-sm text-white tracking-wide flex items-center gap-1.5">
                      Message Delivered <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-pulse" />
                    </span>
                    <span className="font-jakarta text-[11px] sm:text-xs text-white/70 font-normal">
                      Thank you for reaching out. I'll get back to you shortly!
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-jakarta">
              <input type="text" name="_gotcha" style={{ display: "none" }} />

              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-secondary/60 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-secondary/15 focus:border-secondary text-secondary placeholder-secondary/35 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all font-medium"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-secondary/60 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-secondary/15 focus:border-secondary text-secondary placeholder-secondary/35 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all font-medium"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                  className="text-xs text-red-600 mt-0.5"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-secondary/60 font-semibold">
                  Your Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project, timeline, or idea..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-secondary/15 focus:border-secondary text-secondary placeholder-secondary/35 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all resize-none font-medium"
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                  className="text-xs text-red-600 mt-0.5"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={state.submitting}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group mt-2 w-full py-3.5 px-6 rounded-xl bg-secondary hover:bg-black text-white font-clash font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(17,24,39,0.18)] hover:shadow-[0_14px_30px_rgba(17,24,39,0.25)]"
              >
                <span>{state.submitting ? "Sending..." : "Send Message"}</span>
                <Send className="w-3.5 h-3.5 text-pAccent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;