import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Copy,
  Check,
  X,
  ExternalLink,
  Download,
  Layout,
  Type,
  Sparkles,
} from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function ResumeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("modern"); // "modern" | "executive" | "compact"
  const [activeFont, setActiveFont] = useState("sans"); // "sans" | "serif" | "mono" | "system"
  const printAreaRef = useRef(null);

  const { personal, socials, skills, projectsSection, resume } = portfolioData;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Font family mapping
  const getFontFamily = () => {
    switch (activeFont) {
      case "serif":
        return "'Times New Roman', Times, serif";
      case "system":
        return "Arial, Helvetica, sans-serif";
      case "sans":
      default:
        return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    }
  };

  // Generate plain text for ATS copy-pasting
  const generatePlainTextResume = () => {
    const lines = [];

    // Header
    lines.push(personal.name.toUpperCase());
    lines.push(resume.targetRole);
    lines.push(
      `${personal.location} | ${personal.email} | LinkedIn: ${socials.linkedin} | GitHub: ${socials.github}`
    );
    lines.push("\n" + "=".repeat(60) + "\n");

    // Summary
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("-".repeat(30));
    lines.push(resume.summary);
    lines.push("\n");

    // Technical Skills
    lines.push("TECHNICAL SKILLS");
    lines.push("-".repeat(30));
    if (resume.skillCategories) {
      Object.entries(resume.skillCategories).forEach(([cat, val]) => {
        lines.push(`• ${cat}: ${val}`);
      });
    } else {
      lines.push(`• Core Skills: ${skills.join(", ")}`);
    }
    lines.push("\n");

    // Experience
    if (resume.experience && resume.experience.length > 0) {
      lines.push("EXPERIENCE & ENGINEERING");
      lines.push("-".repeat(30));
      resume.experience.forEach((exp) => {
        lines.push(`${exp.role} | ${exp.organization} (${exp.period})`);
        exp.bullets.forEach((b) => lines.push(`  - ${b}`));
        lines.push("");
      });
    }

    // Projects
    lines.push("KEY PROJECTS");
    lines.push("-".repeat(30));
    projectsSection.projects.forEach((proj) => {
      const tech = proj.tags.map((t) => t.tag).join(", ");
      lines.push(`${proj.title.toUpperCase()} [${proj.category}]`);
      lines.push(`Tech Stack: ${tech}`);
      lines.push(`Description: ${proj.short_desc}`);
      lines.push("");
    });

    // Education
    if (resume.education && resume.education.length > 0) {
      lines.push("EDUCATION");
      lines.push("-".repeat(30));
      resume.education.forEach((edu) => {
        lines.push(`${edu.degree}`);
        lines.push(`${edu.institution}, ${edu.location} | ${edu.year}`);
        if (edu.details) lines.push(`• ${edu.details}`);
        lines.push("");
      });
    }

    return lines.join("\n");
  };

  const handleCopyPlainText = () => {
    const text = generatePlainTextResume();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-precision isolated print to fix 10-page overflow
  const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;

    // Create an isolated hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 portrait;
              margin: 0mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: ${getFontFamily()};
              color: #111827;
              background: #ffffff;
              line-height: ${activeTemplate === "compact" ? "1.3" : "1.42"};
              font-size: ${activeTemplate === "compact" ? "10.5px" : "11.5px"};
              padding: ${activeTemplate === "compact" ? "10mm 14mm" : "14mm 18mm"};
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            a {
              color: #111827;
              text-decoration: underline;
            }
            h1 {
              font-size: ${activeTemplate === "compact" ? "20px" : "24px"};
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: -0.3px;
              color: #111827;
            }
            h2 {
              font-size: ${activeTemplate === "compact" ? "11px" : "12px"};
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1.5px solid #111827;
              padding-bottom: 2px;
              margin-top: ${activeTemplate === "compact" ? "6px" : "10px"};
              margin-bottom: 4px;
              color: #111827;
            }
            .section { margin-bottom: ${activeTemplate === "compact" ? "6px" : "10px"}; }
            .header-box {
              border-bottom: 2px solid #111827;
              padding-bottom: ${activeTemplate === "compact" ? "4px" : "8px"};
              margin-bottom: ${activeTemplate === "compact" ? "6px" : "10px"};
              ${activeTemplate === "executive" ? "text-align: center;" : ""}
            }
            .contact-links {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              font-size: ${activeTemplate === "compact" ? "9.5px" : "10.5px"};
              color: #4b5563;
              margin-top: 3px;
              font-weight: 500;
              ${activeTemplate === "executive" ? "justify-content: center;" : ""}
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              font-weight: 700;
              color: #111827;
              font-size: ${activeTemplate === "compact" ? "10.5px" : "11.5px"};
            }
            .sub-row {
              font-size: ${activeTemplate === "compact" ? "9.5px" : "10.5px"};
              color: #4b5563;
              margin-bottom: 2px;
            }
            ul {
              padding-left: 14px;
              margin-top: 2px;
              margin-bottom: 4px;
            }
            li {
              margin-bottom: 2px;
              line-height: ${activeTemplate === "compact" ? "1.25" : "1.35"};
              color: #374151;
            }
            p {
              color: #374151;
              line-height: ${activeTemplate === "compact" ? "1.3" : "1.4"};
            }
            .skills-grid {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }
            .skill-line {
              font-size: ${activeTemplate === "compact" ? "10px" : "11px"};
              color: #374151;
            }
            .skill-label {
              font-weight: 700;
              color: #111827;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }, 250);
  };

  const modalJSX = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-auto font-jakarta">
          {/* Backdrop (identical to Chatbot) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Modal Outer Card (Refined Dark Frosted Glass with Crisp Contrast) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="relative w-full max-w-3xl h-[640px] max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden z-10 font-jakarta shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(26, 26, 36, 0.92) 0%, rgba(18, 18, 26, 0.95) 50%, rgba(12, 12, 18, 0.98) 100%)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              boxShadow: `
                0 24px 64px -12px rgba(0, 0, 0, 0.65),
                0 8px 24px -4px rgba(0, 0, 0, 0.4),
                inset 0 1px 1px 0 rgba(255, 255, 255, 0.25),
                inset 0 -1px 2px 0 rgba(0, 0, 0, 0.4)
              `,
            }}
          >
            {/* 1. Header Main Toolbar */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-inner">
                  <FileText size={14} className="text-pAccent" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-sm">
                  ATS Resume Builder
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy Plain Text Button */}
                <button
                  type="button"
                  onClick={handleCopyPlainText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 hover:border-white/30 text-xs text-white/90 hover:text-white font-medium transition-all cursor-pointer shadow-sm"
                  title="Copy ATS formatted plain text"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} className="text-white/70" />
                      <span className="text-[11px]">Copy Text</span>
                    </>
                  )}
                </button>

                {/* Download PDF Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pAccent hover:bg-[#bdf328] text-secondary text-xs font-semibold shadow-[0_4px_16px_rgba(168,218,34,0.25)] transition-all cursor-pointer hover:scale-105"
                  title="Download clean 1-2 page PDF"
                >
                  <Download size={12} />
                  <span className="text-[11px]">Download PDF</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  title="Close (Esc)"
                  className="p-1.5 rounded-lg text-white/65 hover:text-white hover:bg-white/15 transition-colors cursor-pointer ml-0.5"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 2. Customizer Ribbon (Templates & Fonts Selector) */}
            <div className="px-4 sm:px-5 py-2.5 bg-black/25 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              {/* Template Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-white/60 font-medium flex items-center gap-1">
                  <Layout size={12} className="text-pAccent" /> Template:
                </span>
                <div className="flex items-center bg-white/[0.08] p-0.5 rounded-lg border border-white/15">
                  {[
                    { id: "modern", label: "Modern" },
                    { id: "executive", label: "Executive" },
                    { id: "compact", label: "1-Page Tight" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTemplate(t.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                        activeTemplate === t.id
                          ? "bg-white/25 text-white shadow-sm font-semibold"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-white/60 font-medium flex items-center gap-1">
                  <Type size={12} className="text-pAccent" /> Font:
                </span>
                <div className="flex items-center bg-white/[0.08] p-0.5 rounded-lg border border-white/15">
                  {[
                    { id: "sans", label: "Sans" },
                    { id: "serif", label: "Times New Roman" },
                    { id: "system", label: "Arial / ATS" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFont(f.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                        activeFont === f.id
                          ? "bg-white/25 text-white shadow-sm font-semibold"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Scrollable Document Area (Pure Solid White) */}
            <div
              ref={printAreaRef}
              id="ats-resume-document"
              className={`flex-1 overflow-y-auto bg-white text-[#111827] select-text text-left rounded-b-2xl sm:rounded-b-3xl ${
                activeTemplate === "compact"
                  ? "p-4 sm:p-7 text-[11.5px] leading-snug"
                  : "p-6 sm:p-10 text-xs sm:text-[13px] leading-relaxed"
              }`}
              style={{
                fontFamily: getFontFamily(),
                backgroundColor: "#ffffff",
                color: "#111827",
              }}
            >
              {/* 1. Header Box */}
              <div
                className={`header-box border-b-2 border-[#111827] pb-3 mb-4 ${
                  activeTemplate === "executive" ? "text-center" : "text-left"
                }`}
              >
                <h1
                  className={`font-black text-[#111827] uppercase tracking-tight ${
                    activeTemplate === "compact"
                      ? "text-xl sm:text-2xl"
                      : "text-2xl sm:text-3xl"
                  }`}
                >
                  {personal.name}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#374151] mt-0.5 tracking-wide">
                  {resume.targetRole}
                </p>

                <div
                  className={`contact-links flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#4b5563] mt-2 font-medium ${
                    activeTemplate === "executive"
                      ? "justify-center"
                      : "justify-start"
                  }`}
                >
                  <span>{personal.location}</span>
                  <span>•</span>
                  <a
                    href={`mailto:${personal.email}`}
                    className="text-[#111827] underline hover:text-black"
                  >
                    {personal.email}
                  </a>
                  <span>•</span>
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#111827] underline hover:text-black"
                  >
                    LinkedIn
                  </a>
                  <span>•</span>
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#111827] underline hover:text-black"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              {/* 2. Professional Summary */}
              <section className="section mb-4">
                <h2 className="text-xs font-black tracking-wider text-[#111827] uppercase border-b-2 border-[#111827] pb-0.5 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-[#374151] leading-relaxed">
                  {resume.summary}
                </p>
              </section>

              {/* 3. Technical Skills */}
              <section className="section mb-4">
                <h2 className="text-xs font-black tracking-wider text-[#111827] uppercase border-b-2 border-[#111827] pb-0.5 mb-1.5">
                  Technical Skills
                </h2>
                <div className="skills-grid space-y-1 text-[#374151]">
                  {resume.skillCategories ? (
                    Object.entries(resume.skillCategories).map(
                      ([category, items]) => (
                        <div
                          key={category}
                          className="skill-line flex flex-col sm:flex-row sm:gap-1.5"
                        >
                          <span className="skill-label font-bold text-[#111827] min-w-[165px] shrink-0">
                            • {category}:
                          </span>
                          <span>{items}</span>
                        </div>
                      )
                    )
                  ) : (
                    <div>
                      <span className="skill-label font-bold text-[#111827]">
                        • Core Competencies:
                      </span>{" "}
                      {skills.join(", ")}
                    </div>
                  )}
                </div>
              </section>

              {/* 4. Engineering Experience */}
              {resume.experience && resume.experience.length > 0 && (
                <section className="section mb-4">
                  <h2 className="text-xs font-black tracking-wider text-[#111827] uppercase border-b-2 border-[#111827] pb-0.5 mb-1.5">
                    Engineering Experience
                  </h2>
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="mb-2.5">
                      <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                        <span>{exp.role}</span>
                        <span className="font-semibold text-[#4b5563]">
                          {exp.period}
                        </span>
                      </div>
                      <div className="sub-row text-[11px] text-[#4b5563] italic mb-1">
                        {exp.organization} — {exp.location}
                      </div>
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-[#374151]">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-snug">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {/* 5. Key Projects */}
              <section className="section mb-4">
                <h2 className="text-xs font-black tracking-wider text-[#111827] uppercase border-b-2 border-[#111827] pb-0.5 mb-1.5">
                  Featured Projects
                </h2>
                <div className="space-y-2.5">
                  {projectsSection.projects.slice(0, 5).map((project, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                        <span>{project.title}</span>
                        <span className="tag-pill text-[11px] font-semibold text-[#4b5563]">
                          {project.tags.map((t) => t.tag).join(" • ")}
                        </span>
                      </div>
                      <p className="text-[#374151] mt-0.5 leading-relaxed">
                        • {project.short_desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Education */}
              {resume.education && resume.education.length > 0 && (
                <section className="section mb-2">
                  <h2 className="text-xs font-black tracking-wider text-[#111827] uppercase border-b-2 border-[#111827] pb-0.5 mb-1.5">
                    Education
                  </h2>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="mb-1.5">
                      <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                        <span>{edu.degree}</span>
                        <span className="font-semibold text-[#4b5563]">
                          {edu.year}
                        </span>
                      </div>
                      <div className="sub-row text-[11px] text-[#4b5563] mb-0.5">
                        {edu.institution}, {edu.location}
                      </div>
                      {edu.details && (
                        <p className="text-[11px] text-[#4b5563] leading-relaxed">
                          {edu.details}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modalJSX, document.body)
    : null;
}
