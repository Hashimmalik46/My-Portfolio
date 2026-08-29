import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState, useRef } from "react";
import { Send, CheckCircle2, Mail, Copy, Check, MessageSquare } from "lucide-react";
import ArchitecturalBackground from "./ui/ArchitecturalBackground";
import ScrollFadeText from "./ui/ScrollFadeText";
import { BorderBeam } from "./ui/border-beam";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { portfolioData } from "../data/portfolioData";

function PaperGrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-[0.15] mix-blend-multiply z-0 select-none"
    >
      <img
        src="/Texturelabs_Paper_313M.jpg"
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

const DEFAULT_SUBTITLE_PHRASES = [
  "Full Stack Engineer",
  "AI Systems Developer",
  "UI/UX & Motion Design",
  "Autonomous Agent Builder",
  "Creative Web Architect",
];

function TypewriterSubtitle({ phrases = DEFAULT_SUBTITLE_PHRASES }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = phrases[currentPhraseIndex] || "";

  useEffect(() => {
    let timeout;
    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 90);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        }, 45);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 400);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhrase, phrases.length]);

  const longestPhrase = phrases.reduce(
    (a, b) => (a.length > b.length ? a : b),
    ""
  );

  return (
    <span className="relative inline-flex items-center min-h-[1.4em] leading-none text-xs font-jakarta">
      {/* Invisible Ghost Footprint ensuring zero layout jumping across all phrases */}
      <span aria-hidden="true" className="opacity-0 select-none pointer-events-none whitespace-pre">
        {longestPhrase}
      </span>

      {/* Actual Typing Animation positioned over ghost */}
      <span className="absolute inset-0 flex items-center whitespace-pre pointer-events-none">
        <span className="text-white/70 font-medium">{displayedText}</span>
        <span className="inline-block w-[1.5px] h-[0.9em] bg-pAccent ml-0.5 animate-pulse shrink-0" />
      </span>
    </span>
  );
}

function InteractiveContactCard({ contact, portfolioData, copied, setCopied }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 350,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 350,
    damping: 25,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = mouseX / rect.width - 0.5;
    const normY = mouseY / rect.height - 0.5;

    x.set(normX);
    y.set(normY);
    setMousePos({ x: mouseX, y: mouseY, opacity: 1 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full max-w-lg">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          rotateX: 16,
          rotateY: -6,
          scale: 0.94,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.012, y: -2 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
            transformPerspective: 1200,
          }}
          className="group relative w-full rounded-3xl bg-[#0c0d14] text-white border border-white/[0.12] hover:border-white/[0.25] p-6 sm:p-7 shadow-[0_16px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.6)] flex flex-col gap-5 mt-2 overflow-hidden cursor-default transition-colors duration-300 transform-gpu"
        >
          {/* Glass Specular Glare Sweep on Load */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            whileInView={{ x: "200%", opacity: [0, 0.35, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 1.1,
              delay: 0.2,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent z-30"
          />

          {/* Subtle Specular Cursor Light Reflection */}
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-0"
            style={{
              opacity: mousePos.opacity,
              background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 70%)`,
            }}
          />

        {/* 1. Identity Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3 className="font-clash font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-white transition-colors truncate">
              {portfolioData.personal?.name || "Hashim Malik"}
            </h3>
            <TypewriterSubtitle />
          </div>

          {/* Top-Right Modern Chat Message Bubble */}
          <motion.div
            whileHover={{ scale: 1.05, y: -1.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] rounded-bl-[3px] bg-gradient-to-r from-white/[0.1] to-white/[0.05] hover:from-white/[0.15] hover:to-white/[0.08] border border-white/15 text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] cursor-default select-none shrink-0 transition-all group/bubble"
          >
            <MessageSquare size={13} className="text-pAccent shrink-0 group-hover/bubble:scale-110 transition-transform duration-200" />
            <span className="font-jakarta font-medium text-[11px] sm:text-xs text-white/90 tracking-tight">
              Let's talk!
            </span>
          </motion.div>
        </div>

      {/* 2. Direct Details with Naked Minimal Icons */}
      <div className="relative z-10 flex flex-col gap-2.5 text-xs sm:text-sm font-jakarta">
        {/* Email Row */}
        <div className="group/item flex items-center justify-between py-2 border-b border-white/[0.06]">
          <a
            href={`mailto:${contact.email || portfolioData.personal?.email}`}
            className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors truncate"
          >
            <Mail size={16} className="text-pAccent shrink-0 group-hover/item:scale-110 transition-transform" />
            <span className="truncate font-medium">
              {contact.email || portfolioData.personal?.email}
            </span>
          </a>

          {/* Minimal 1-Click Copy */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigator.clipboard.writeText(contact.email || portfolioData.personal?.email);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            aria-label="Copy email"
            title={copied ? "Copied!" : "Copy email"}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-white/40 hover:text-pAccent hover:bg-white/[0.05] transition-all cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check size={13} className="text-pAccent" />
                <span className="text-pAccent font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Location Row */}
        <div className="flex items-center justify-between py-2 border-b border-white/[0.06] text-white/70">
          <div className="flex items-center gap-2.5">
            <IoLocationSharp size={16} className="text-pAccent shrink-0" />
            <span className="font-medium text-white/80">
              {contact.location || portfolioData.personal?.location || "Srinagar, Kashmir"}
            </span>
          </div>
          <span className="text-[11px] font-mono text-white/40">
            India • Remote
          </span>
        </div>
      </div>

      {/* 3. Minimal Social Icons Row & Response Time */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {portfolioData.socials?.github && (
            <a
              href={portfolioData.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="p-1.5 sm:p-2 rounded-xl text-white/60 hover:text-pAccent hover:bg-white/[0.06] transition-all"
            >
              <FaGithub size={16} />
            </a>
          )}

          {portfolioData.socials?.linkedin && (
            <a
              href={portfolioData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="p-1.5 sm:p-2 rounded-xl text-white/60 hover:text-pAccent hover:bg-white/[0.06] transition-all"
            >
              <FaLinkedinIn size={16} />
            </a>
          )}

          {portfolioData.socials?.twitter && (
            <a
              href={portfolioData.socials.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              title="Twitter"
              className="p-1.5 sm:p-2 rounded-xl text-white/60 hover:text-pAccent hover:bg-white/[0.06] transition-all"
            >
              <FaXTwitter size={16} />
            </a>
          )}

          {portfolioData.socials?.instagram && (
            <a
              href={portfolioData.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="p-1.5 sm:p-2 rounded-xl text-white/60 hover:text-pAccent hover:bg-white/[0.06] transition-all"
            >
              <FaInstagram size={16} />
            </a>
          )}
        </div>

        <span className="text-[10px] sm:text-[11px] font-mono text-white/50 whitespace-nowrap shrink-0">
          ⚡ Responds in ~1 day
        </span>
      </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Contact() {
  const { contact } = portfolioData;
  const [state, handleSubmit] = useForm(contact.formspreeFormId);
  const [dismissSuccess, setDismissSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const showMessage = state.succeeded && !dismissSuccess;

  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        setDismissSuccess(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  return (
    <section
      id="Contact"
      className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-16 py-28 z-10 bg-c1 text-secondary selection:bg-secondary selection:text-white overflow-hidden"
    >
      {/* Subtle Architectural Cream Background Layer */}
      <ArchitecturalBackground
        watermarkText="CONTACT"
        watermarkPosition="top-right"
      />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        {/* Left Column: Heading, Info & Direct Contact Channels (Enters from Left) */}
        <motion.div
          initial={{ opacity: 0, x: -44 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
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

          <ScrollFadeText
            text={contact.subheading}
            className="font-cormorant italic text-2xl sm:text-3xl text-secondary/85 font-light leading-relaxed"
            activeColor="text-secondary"
          />

          <p className="font-jakarta text-sm sm:text-base text-secondary/70 leading-relaxed max-w-lg">
            {contact.description}
          </p>

          {/* Interactive 3D Spotlight Hover Contact Card */}
          <InteractiveContactCard
            contact={contact}
            portfolioData={portfolioData}
            copied={copied}
            setCopied={setCopied}
          />
        </motion.div>

        {/* Right Column: Tactile Paper Contact Form (Enters from Left with Stagger) */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#FAF8F5] border border-secondary/12 p-7 md:p-9 shadow-[0_24px_60px_rgba(28,25,23,0.06),0_1px_3px_rgba(28,25,23,0.04),inset_0_1px_0_rgba(255,255,255,0.95)]">
            <PaperGrainOverlay />
            <BorderBeam duration={25} size={140} colorFrom="#111827" colorTo="#a8da22" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-jakarta tracking-[0.2em] uppercase text-secondary/50 font-semibold">
                  Send a Direct Message
                </span>
                <div className="w-8 h-8 rounded-full bg-[#0c0d14] border border-white/10 flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4 text-pAccent" />
                </div>
              </div>

              {/* Success Toast */}
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
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F0E8]/70 focus:bg-white border border-secondary/12 focus:border-secondary text-secondary placeholder-secondary/35 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all font-medium"
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
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F0E8]/70 focus:bg-white border border-secondary/12 focus:border-secondary text-secondary placeholder-secondary/35 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all font-medium"
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
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F0E8]/70 focus:bg-white border border-secondary/12 focus:border-secondary text-secondary placeholder-secondary/35 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all resize-none font-medium"
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
                  className="group mt-2 w-full py-3.5 px-6 rounded-xl bg-[#0c0d14] hover:bg-black text-white border border-white/10 hover:border-pAccent/40 font-clash font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.3)]"
                >
                  <span>{state.submitting ? "Sending..." : "Send Message"}</span>
                  <Send className="w-3.5 h-3.5 text-pAccent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;