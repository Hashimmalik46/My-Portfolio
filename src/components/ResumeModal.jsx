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
  SlidersHorizontal,
  RotateCcw,
  Eraser,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Briefcase,
  GraduationCap,
  Code2,
  Layers,
  User,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
import { portfolioData } from "../data/portfolioData";

export default function ResumeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState("standard"); // "standard" (Experienced) | "fresher" (Graduate)
  const [activeStyle, setActiveStyle] = useState("classic"); // "classic" | "executive" | "compact" | "minimal"
  const [activeFont, setActiveFont] = useState("sans"); // "sans" | "serif" | "mono" | "system"
  const [activeTab, setActiveTab] = useState("preview"); // "preview" | "customize"
  const printAreaRef = useRef(null);

  const { personal, socials, skills, projectsSection, resume: defaultResume } = portfolioData;

  const getDefaultResumeState = () => ({
    name: personal.name || "",
    location: personal.location || "",
    email: personal.email || "",
    phone: personal.phone || "",
    linkedin: socials.linkedin || "",
    github: socials.github || "",
    website: socials.website || "",
    ...JSON.parse(JSON.stringify(defaultResume)),
  });

  const [customResume, setCustomResume] = useState(getDefaultResumeState);

  // Reset custom resume when default changes
  useEffect(() => {
    if (isOpen) {
      setCustomResume(getDefaultResumeState());
      setActiveTab("preview");
    }
  }, [isOpen]);

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
    const name = customResume.name || personal.name || "YOUR NAME";
    const targetRole = customResume.targetRole || defaultResume.targetRole;
    lines.push(name.toUpperCase());
    if (targetRole) lines.push(targetRole);

    const contactParts = [];
    if (customResume.location) contactParts.push(customResume.location);
    if (customResume.email) contactParts.push(customResume.email);
    if (customResume.phone) contactParts.push(customResume.phone);
    if (customResume.linkedin) contactParts.push(`LinkedIn: ${customResume.linkedin}`);
    if (customResume.github) contactParts.push(`GitHub: ${customResume.github}`);
    if (customResume.website) contactParts.push(`Portfolio: ${customResume.website}`);

    if (contactParts.length > 0) {
      lines.push(contactParts.join(" | "));
    }
    lines.push("\n" + "=".repeat(60) + "\n");

    // Summary
    lines.push(activeCategory === "fresher" ? "CAREER OBJECTIVE & SUMMARY" : "PROFESSIONAL SUMMARY");
    lines.push("-".repeat(30));
    lines.push(customResume.summary || defaultResume.summary);
    lines.push("\n");

    const renderSkillsText = () => {
      lines.push("TECHNICAL SKILLS");
      lines.push("-".repeat(30));
      const currentSkills = customResume.skillCategories || defaultResume.skillCategories;
      if (currentSkills) {
        Object.entries(currentSkills).forEach(([cat, val]) => {
          lines.push(`• ${cat}: ${val}`);
        });
      } else {
        lines.push(`• Core Skills: ${skills.join(", ")}`);
      }
      lines.push("\n");
    };

    const renderEduText = () => {
      const currentEdu = customResume.education || defaultResume.education;
      if (currentEdu && currentEdu.length > 0) {
        lines.push("EDUCATION & CREDENTIALS");
        lines.push("-".repeat(30));
        currentEdu.forEach((edu) => {
          lines.push(`${edu.degree}`);
          lines.push(`${edu.institution}${edu.location ? `, ${edu.location}` : ""} | ${edu.period || edu.year}`);
          if (edu.grade || edu.details) lines.push(`• ${edu.grade || edu.details}`);
          lines.push("");
        });
      }
    };

    const renderExpText = () => {
      const currentExp = customResume.experience || defaultResume.experience;
      if (currentExp && currentExp.length > 0) {
        lines.push(activeCategory === "fresher" ? "EXPERIENCE & INTERNSHIPS" : "ENGINEERING EXPERIENCE");
        lines.push("-".repeat(30));
        currentExp.forEach((exp) => {
          lines.push(`${exp.role} | ${exp.organization} (${exp.period})`);
          if (exp.bullets) {
            exp.bullets.forEach((b) => lines.push(`  - ${b}`));
          }
          lines.push("");
        });
      }
    };

    const renderProjText = () => {
      const currentProj = customResume.projects || defaultResume.projects || projectsSection?.projects;
      if (currentProj && currentProj.length > 0) {
        lines.push("FEATURED PROJECTS");
        lines.push("-".repeat(30));
        currentProj.forEach((proj) => {
          lines.push(`${proj.title.toUpperCase()}`);
          if (proj.tech) lines.push(`Tech Stack: ${proj.tech}`);
          if (proj.bullets) {
            proj.bullets.forEach((b) => lines.push(`  - ${b}`));
          } else if (proj.short_desc) {
            lines.push(`  - ${proj.short_desc}`);
          }
          lines.push("");
        });
      }
    };

    if (activeCategory === "fresher") {
      renderEduText();
      renderSkillsText();
      renderProjText();
      renderExpText();
    } else {
      renderSkillsText();
      renderExpText();
      renderProjText();
      renderEduText();
    }

    return lines.join("\n");
  };

  const handleCopyPlainText = () => {
    const text = generatePlainTextResume();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-precision isolated print to fix 10-page overflow and work on all devices
  const executePrint = () => {
    const printContent = document.getElementById("ats-resume-document") || printAreaRef.current;
    if (!printContent) return;

    // Create an isolated hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${(personal.name || "Resume").replace(/\s+/g, "_")}_Resume</title>
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
              line-height: ${activeStyle === "compact" ? "1.3" : "1.42"};
              font-size: ${activeStyle === "compact" ? "10.5px" : "11.5px"};
              padding: ${activeStyle === "compact" ? "10mm 14mm" : "14mm 18mm"};
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            a {
              color: #111827;
              text-decoration: underline;
            }
            h1 {
              font-size: ${activeStyle === "compact" ? "20px" : "24px"};
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: -0.3px;
              color: #111827;
            }
            h2 {
              font-size: ${activeStyle === "compact" ? "11px" : "12px"};
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: ${activeStyle === "minimal" ? "1px solid #d1d5db" : "1.5px solid #111827"};
              padding-bottom: 2px;
              margin-top: ${activeStyle === "compact" ? "6px" : "10px"};
              margin-bottom: 4px;
              color: #111827;
            }
            .section { margin-bottom: ${activeStyle === "compact" ? "6px" : "10px"}; }
            .header-box {
              border-bottom: ${activeStyle === "minimal" ? "1px solid #d1d5db" : "2px solid #111827"};
              padding-bottom: ${activeStyle === "compact" ? "4px" : "8px"};
              margin-bottom: ${activeStyle === "compact" ? "6px" : "10px"};
              ${activeStyle === "executive" ? "text-align: center;" : ""}
            }
            .contact-links {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              font-size: ${activeStyle === "compact" ? "9.5px" : "10.5px"};
              color: #4b5563;
              margin-top: 3px;
              font-weight: 500;
              ${activeStyle === "executive" ? "justify-content: center;" : ""}
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              font-weight: 700;
              color: #111827;
              font-size: ${activeStyle === "compact" ? "10.5px" : "11.5px"};
            }
            .sub-row {
              font-size: ${activeStyle === "compact" ? "9.5px" : "10.5px"};
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
              line-height: ${activeStyle === "compact" ? "1.25" : "1.35"};
              color: #374151;
            }
            p {
              color: #374151;
              line-height: ${activeStyle === "compact" ? "1.3" : "1.4"};
            }
            .skills-grid {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }
            .skill-line {
              font-size: ${activeStyle === "compact" ? "10px" : "11px"};
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

    const triggerPrint = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }
    };

    setTimeout(triggerPrint, 250);
  };

  const handlePrint = () => {
    if (activeTab !== "preview") {
      setActiveTab("preview");
      setTimeout(() => {
        executePrint();
      }, 150);
    } else {
      executePrint();
    }
  };

  const handleResetToDefault = () => {
    setCustomResume(getDefaultResumeState());
  };

  const handleClearToScratch = () => {
    setCustomResume({
      name: "",
      location: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      website: "",
      targetRole: "",
      summary: "",
      skillCategories: {
        "Languages & Frameworks": "",
        "Tools & Technologies": "",
      },
      experience: [],
      projects: [],
      education: [],
    });
  };

  const modalJSX = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-auto font-jakarta selection:bg-gray-900 selection:text-white">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Modal Outer Card (Industry Standard Clean SaaS Theme) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="relative w-full max-w-3xl h-[680px] max-h-[88dvh] flex flex-col rounded-2xl sm:rounded-3xl bg-white border border-gray-200 overflow-hidden z-10 font-jakarta shadow-2xl selection:bg-gray-900 selection:text-white"
          >
            {/* 1. Header Main Toolbar */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-200 bg-white shrink-0 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center shadow-xs shrink-0">
                  <FileText size={14} />
                </div>
                
                {/* View / Customize Tab Switcher */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center justify-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs transition-all cursor-pointer ${
                      activeTab === "preview"
                        ? "bg-white text-gray-900 font-semibold shadow-xs"
                        : "text-gray-600 hover:text-gray-900 font-medium"
                    }`}
                    title="Preview Resume"
                  >
                    <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("customize")}
                    className={`flex items-center justify-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs transition-all cursor-pointer ${
                      activeTab === "customize"
                        ? "bg-white text-gray-900 font-semibold shadow-xs"
                        : "text-gray-600 hover:text-gray-900 font-medium"
                    }`}
                    title="Customize Resume"
                  >
                    <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Customize</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Copy Plain Text Button */}
                <button
                  type="button"
                  onClick={handleCopyPlainText}
                  className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-xs text-gray-700 font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                  title="Copy ATS formatted plain text"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-gray-900" />
                      <span className="text-gray-900 text-xs font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} className="text-gray-500" />
                      <span className="text-xs">
                        <span className="hidden xs:inline">Copy </span>Text
                      </span>
                    </>
                  )}
                </button>

                {/* Download PDF Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  title="Download clean 1-2 page PDF"
                >
                  <Download size={12} />
                  <span className="text-xs">
                    <span className="hidden xs:inline">Download </span>PDF
                  </span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  title="Close (Esc)"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer ml-0.5"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 2. Customizer Ribbon (Active only in Preview Mode) */}
            {activeTab === "preview" && (
              <div className="px-3 sm:px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0">
                {/* 1. Track / Category Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1 shrink-0 uppercase tracking-wider">
                    <Briefcase size={12} className="text-gray-600" /> Type:
                  </span>
                  <div className="flex items-center bg-gray-200/60 p-0.5 rounded-lg border border-gray-200">
                    {[
                      { id: "standard", label: "Standard" },
                      { id: "fresher", label: "Fresher" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCategory(c.id)}
                        className={`px-2.5 sm:px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                          activeCategory === c.id
                            ? "bg-white text-gray-900 font-bold shadow-xs"
                            : "text-gray-600 hover:text-gray-900 font-medium"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Style Sub-Template Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1 shrink-0 uppercase tracking-wider">
                    <Layout size={12} className="text-gray-600" /> Style:
                  </span>
                  <div className="flex items-center bg-gray-200/60 p-0.5 rounded-lg border border-gray-200">
                    {[
                      { id: "classic", label: "Classic" },
                      { id: "executive", label: "Executive" },
                      { id: "compact", label: "Compact" },
                      { id: "minimal", label: "Minimal" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveStyle(s.id)}
                        className={`px-2 sm:px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                          activeStyle === s.id
                            ? "bg-white text-gray-900 font-bold shadow-xs"
                            : "text-gray-600 hover:text-gray-900 font-medium"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Font Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1 shrink-0 uppercase tracking-wider">
                    <Type size={12} className="text-gray-600" /> Font:
                  </span>
                  <div className="flex items-center bg-gray-200/60 p-0.5 rounded-lg border border-gray-200">
                    {[
                      { id: "sans", label: "Sans" },
                      { id: "serif", label: "Serif" },
                      { id: "system", label: "System" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveFont(f.id)}
                        className={`px-2.5 sm:px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                          activeFont === f.id
                            ? "bg-white text-gray-900 font-bold shadow-xs"
                            : "text-gray-600 hover:text-gray-900 font-medium"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Modal Body: Tab Content (Preview OR Customize Form) */}
            {activeTab === "customize" ? (
              /* CUSTOMIZE FORM VIEW (Industry Standard Clean SaaS Theme) */
              <div className="flex-1 flex flex-col min-h-0 bg-[#f9fafb]">
                <div
                  data-lenis-prevent="true"
                  className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6 text-gray-900 text-left font-jakarta"
                  style={{
                    scrollbarColor: "rgba(0, 0, 0, 0.15) transparent",
                    scrollbarWidth: "thin",
                  }}
                >
                {/* Form Header & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                      Edit & Customize Resume
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Tailor your target role, summary, skills, and projects, or build from scratch.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleClearToScratch}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-700 shadow-xs transition-all cursor-pointer"
                      title="Clear all fields and build from scratch"
                    >
                      <Eraser size={12} className="text-red-600" />
                      <span>Start from Scratch</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 shadow-xs transition-all cursor-pointer"
                      title="Reset to default resume"
                    >
                      <RotateCcw size={12} className="text-gray-500" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>
                </div>

                {/* 1. Personal & Contact Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                      <User size={13} className="text-gray-700" /> Personal & Contact Info
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <User size={11} className="text-gray-500" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={customResume.name || ""}
                        onChange={(e) =>
                          setCustomResume({ ...customResume, name: e.target.value })
                        }
                        placeholder="e.g. Hashim Malik"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <MapPin size={11} className="text-gray-500" /> Location / City
                      </label>
                      <input
                        type="text"
                        value={customResume.location || ""}
                        onChange={(e) =>
                          setCustomResume({ ...customResume, location: e.target.value })
                        }
                        placeholder="e.g. Srinagar, Kashmir / Remote"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Mail size={11} className="text-gray-500" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={customResume.email || ""}
                        onChange={(e) =>
                          setCustomResume({ ...customResume, email: e.target.value })
                        }
                        placeholder="e.g. you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Phone size={11} className="text-gray-500" /> Phone Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={customResume.phone || ""}
                        onChange={(e) =>
                          setCustomResume({ ...customResume, phone: e.target.value })
                        }
                        placeholder="e.g. +91 90300 00000"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                      />
                    </div>

                    {/* LinkedIn URL */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Linkedin size={11} className="text-gray-500" /> LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={customResume.linkedin || ""}
                        onChange={(e) =>
                          setCustomResume({ ...customResume, linkedin: e.target.value })
                        }
                        placeholder="e.g. linkedin.com/in/username"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                      />
                    </div>

                    {/* GitHub URL */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Github size={11} className="text-gray-500" /> GitHub URL
                      </label>
                      <input
                        type="text"
                        value={customResume.github || ""}
                        onChange={(e) =>
                          setCustomResume({ ...customResume, github: e.target.value })
                        }
                        placeholder="e.g. github.com/username"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                      />
                    </div>

                    {/* Portfolio / Website URL */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Globe size={11} className="text-gray-500" /> Portfolio / Website Link (Optional)
                      </label>
                      <input
                        type="text"
                        value={customResume.website || ""}
                        onChange={(e) =>
                          setCustomResume({ ...customResume, website: e.target.value })
                        }
                        placeholder="e.g. yourportfolio.dev"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Target Role & Title */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Target Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={customResume.targetRole || ""}
                    onChange={(e) =>
                      setCustomResume({ ...customResume, targetRole: e.target.value })
                    }
                    placeholder="e.g. Full Stack Developer, AI Engineer, Software Engineer"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all font-medium"
                  />
                </div>

                {/* 3. Professional Summary */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Professional Summary
                  </label>
                  <textarea
                    rows={4}
                    value={customResume.summary || ""}
                    onChange={(e) =>
                      setCustomResume({ ...customResume, summary: e.target.value })
                    }
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    placeholder="Brief overview of your engineering background and core strengths..."
                    style={{
                      resize: "none",
                      overflow: "hidden",
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all resize-none overflow-hidden no-scrollbar leading-relaxed font-normal"
                  />
                </div>

                {/* 3. Education Customization */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                      <GraduationCap size={13} className="text-gray-700" /> Education & Credentials
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newEdu = [
                          ...(customResume.education || []),
                          {
                            degree: "Bachelor of Science in Computer Science",
                            institution: "University / College Name",
                            period: "2020 – 2024",
                            grade: "CGPA: 8.5/10",
                          },
                        ];
                        setCustomResume({ ...customResume, education: newEdu });
                      }}
                      className="flex items-center gap-1.5 text-xs text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus size={12} /> Add Education
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {customResume.education?.map((edu, eIdx) => (
                      <div key={eIdx} className="p-3.5 sm:p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                          <span className="text-xs font-bold text-gray-900">
                            Degree #{eIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newEdu = [...customResume.education];
                              newEdu.splice(eIdx, 1);
                              setCustomResume({ ...customResume, education: newEdu });
                            }}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-2 py-0.5 rounded hover:bg-gray-200/50 transition-colors font-medium"
                            title="Delete entry"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Degree / Major</span>
                            <input
                              type="text"
                              value={edu.degree || ""}
                              onChange={(e) => {
                                const newEdu = [...customResume.education];
                                newEdu[eIdx].degree = e.target.value;
                                setCustomResume({ ...customResume, education: newEdu });
                              }}
                              placeholder="e.g. B.Tech / B.S. in Computer Science"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Institution & Location</span>
                            <input
                              type="text"
                              value={edu.institution || ""}
                              onChange={(e) => {
                                const newEdu = [...customResume.education];
                                newEdu[eIdx].institution = e.target.value;
                                setCustomResume({ ...customResume, education: newEdu });
                              }}
                              placeholder="e.g. University of Engineering"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Period / Years</span>
                            <input
                              type="text"
                              value={edu.period || edu.year || ""}
                              onChange={(e) => {
                                const newEdu = [...customResume.education];
                                newEdu[eIdx].period = e.target.value;
                                newEdu[eIdx].year = e.target.value;
                                setCustomResume({ ...customResume, education: newEdu });
                              }}
                              placeholder="e.g. 2020 – 2024"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Grade / Honors (Optional)</span>
                            <input
                              type="text"
                              value={edu.grade || edu.details || ""}
                              onChange={(e) => {
                                const newEdu = [...customResume.education];
                                newEdu[eIdx].grade = e.target.value;
                                newEdu[eIdx].details = e.target.value;
                                setCustomResume({ ...customResume, education: newEdu });
                              }}
                              placeholder="e.g. GPA: 3.8 / 4.0 or Dean's List"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Technical Skills Categories */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Technical Skills
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const count = Object.keys(customResume.skillCategories || {}).length + 1;
                        const newCatName = `Skill Category ${count}`;
                        setCustomResume({
                          ...customResume,
                          skillCategories: {
                            ...(customResume.skillCategories || {}),
                            [newCatName]: "Tool 1, Tool 2, Framework 1",
                          },
                        });
                      }}
                      className="flex items-center gap-1.5 text-xs text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus size={12} /> Add Category
                    </button>
                  </div>

                  <div className="space-y-3">
                    {customResume.skillCategories &&
                      Object.entries(customResume.skillCategories).map(([category, items]) => (
                        <div key={category} className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={category}
                              onChange={(e) => {
                                const newName = e.target.value;
                                const entries = Object.entries(customResume.skillCategories || {});
                                const updated = {};
                                entries.forEach(([k, v]) => {
                                  if (k === category) updated[newName] = v;
                                  else updated[k] = v;
                                });
                                setCustomResume({ ...customResume, skillCategories: updated });
                              }}
                              className="px-2.5 py-1 rounded-md bg-white border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 text-xs font-semibold text-gray-900 outline-none max-w-[220px] transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...(customResume.skillCategories || {}) };
                                delete updated[category];
                                setCustomResume({ ...customResume, skillCategories: updated });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-gray-200/50 transition-colors"
                              title="Delete category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={items}
                            onChange={(e) => {
                              const updated = { ...customResume.skillCategories, [category]: e.target.value };
                              setCustomResume({ ...customResume, skillCategories: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* 5. Experience Bullets */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Work Experience
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newExp = [
                          ...(customResume.experience || []),
                          {
                            role: "Software Engineer",
                            organization: "Tech Company",
                            location: "Remote",
                            period: "2024 – Present",
                            bullets: ["Architected scalable web workflows and microservices with high test coverage."],
                          },
                        ];
                        setCustomResume({ ...customResume, experience: newExp });
                      }}
                      className="flex items-center gap-1.5 text-xs text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus size={12} /> Add Experience
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {customResume.experience?.map((exp, expIdx) => (
                      <div key={expIdx} className="p-3.5 sm:p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                          <span className="text-xs font-bold text-gray-900">
                            Position #{expIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newExp = [...customResume.experience];
                              newExp.splice(expIdx, 1);
                              setCustomResume({ ...customResume, experience: newExp });
                            }}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-2 py-0.5 rounded hover:bg-gray-200/50 transition-colors font-medium"
                            title="Delete entry"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Role Title</span>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const newExp = [...customResume.experience];
                                newExp[expIdx].role = e.target.value;
                                setCustomResume({ ...customResume, experience: newExp });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Organization & Period</span>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => {
                                const newExp = [...customResume.experience];
                                newExp[expIdx].period = e.target.value;
                                setCustomResume({ ...customResume, experience: newExp });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Bullets List */}
                        <div className="space-y-2 pt-1">
                          <span className="text-xs font-medium text-gray-600 block">Key Accomplishments</span>
                          {exp.bullets?.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newExp = [...customResume.experience];
                                  newExp[expIdx].bullets[bIdx] = e.target.value;
                                  setCustomResume({ ...customResume, experience: newExp });
                                }}
                                placeholder="Describe accomplishment..."
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newExp = [...customResume.experience];
                                  newExp[expIdx].bullets.splice(bIdx, 1);
                                  setCustomResume({ ...customResume, experience: newExp });
                                }}
                                className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-gray-200/50 transition-colors"
                                title="Delete bullet"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newExp = [...customResume.experience];
                              newExp[expIdx].bullets.push("New accomplishment point...");
                              setCustomResume({ ...customResume, experience: newExp });
                            }}
                            className="flex items-center gap-1 text-xs text-gray-900 hover:text-black font-semibold cursor-pointer pt-0.5"
                          >
                            <Plus size={12} /> Add Accomplishment Bullet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Projects Customization */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Featured Projects
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newProj = [
                          ...(customResume.projects || []),
                          {
                            title: "New Project",
                            tech: "React, Node.js, PostgreSQL",
                            bullets: ["Engineered responsive full-stack platform with secure authentication."],
                          },
                        ];
                        setCustomResume({ ...customResume, projects: newProj });
                      }}
                      className="flex items-center gap-1.5 text-xs text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus size={12} /> Add Project
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {customResume.projects?.map((proj, pIdx) => (
                      <div key={pIdx} className="p-3.5 sm:p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                          <span className="text-xs font-bold text-gray-900">
                            Project #{pIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newProj = [...customResume.projects];
                              newProj.splice(pIdx, 1);
                              setCustomResume({ ...customResume, projects: newProj });
                            }}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-2 py-0.5 rounded hover:bg-gray-200/50 transition-colors font-medium"
                            title="Delete project"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Project Title</span>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const newProj = [...customResume.projects];
                                newProj[pIdx].title = e.target.value;
                                setCustomResume({ ...customResume, projects: newProj });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-600">Tech Stack</span>
                            <input
                              type="text"
                              value={proj.tech || ""}
                              onChange={(e) => {
                                const newProj = [...customResume.projects];
                                newProj[pIdx].tech = e.target.value;
                                setCustomResume({ ...customResume, projects: newProj });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Project Bullets */}
                        <div className="space-y-2 pt-1">
                          <span className="text-xs font-medium text-gray-600 block">Key Highlights</span>
                          {proj.bullets?.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={b}
                                onChange={(e) => {
                                  const newProj = [...customResume.projects];
                                  newProj[pIdx].bullets[bIdx] = e.target.value;
                                  setCustomResume({ ...customResume, projects: newProj });
                                }}
                                placeholder="Describe project highlight..."
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 shadow-xs focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newProj = [...customResume.projects];
                                  newProj[pIdx].bullets.splice(bIdx, 1);
                                  setCustomResume({ ...customResume, projects: newProj });
                                }}
                                className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-gray-200/50 transition-colors"
                                title="Delete bullet"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newProj = [...customResume.projects];
                              if (!newProj[pIdx].bullets) newProj[pIdx].bullets = [];
                              newProj[pIdx].bullets.push("Engineered new feature with high performance...");
                              setCustomResume({ ...customResume, projects: newProj });
                            }}
                            className="flex items-center gap-1 text-xs text-gray-900 hover:text-black font-semibold cursor-pointer pt-0.5"
                          >
                            <Plus size={12} /> Add Highlight Bullet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                </div>

                {/* Solid Bottom Action Bar (Seals completely with zero background gap) */}
                <div className="shrink-0 px-4 sm:px-7 py-3 bg-white border-t border-gray-200 flex items-center justify-end z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View Generated Resume</span>
                  </button>
                </div>
              </div>
            ) : (
              /* LIVE PREVIEW / PRINTABLE VIEW */
              <div
                ref={printAreaRef}
                id="ats-resume-document"
                data-lenis-prevent="true"
                className={`flex-1 overflow-y-auto bg-white text-[#111827] select-text text-left rounded-b-2xl sm:rounded-b-3xl ${
                  activeStyle === "compact"
                    ? "p-4 sm:p-7 text-[11.5px] leading-snug"
                    : activeStyle === "minimal"
                    ? "p-6 sm:p-10 text-xs sm:text-[12.5px] leading-relaxed"
                    : "p-6 sm:p-10 text-xs sm:text-[13px] leading-relaxed"
                }`}
                style={{
                  fontFamily: getFontFamily(),
                  scrollbarColor: "rgba(0, 0, 0, 0.15) transparent",
                  scrollbarWidth: "thin",
                }}
              >
                {/* 1. Header Box */}
                <div
                  className={`header-box pb-2 mb-3.5 ${
                    activeStyle === "minimal"
                      ? "border-b border-gray-300"
                      : "border-b-2 border-[#111827]"
                  } ${activeStyle === "executive" ? "text-center" : "text-left"}`}
                >
                  <h1 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight">
                    {customResume.name || personal.name}
                  </h1>
                  {(customResume.targetRole !== undefined ? customResume.targetRole : defaultResume.targetRole) && (
                    <p className="text-xs sm:text-sm font-bold text-[#1f2937] mt-0.5 tracking-wide">
                      {customResume.targetRole !== undefined ? customResume.targetRole : defaultResume.targetRole}
                    </p>
                  )}
                  <div
                    className={`contact-links flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#4b5563] mt-1 font-medium ${
                      activeStyle === "executive" ? "justify-center" : "justify-start"
                    }`}
                  >
                    {customResume.location && <span>{customResume.location}</span>}
                    
                    {customResume.location && (customResume.email || customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                      <span className="text-gray-400">•</span>
                    )}

                    {customResume.email && (
                      <a
                        href={`mailto:${customResume.email}`}
                        className="text-[#111827] underline hover:text-black"
                      >
                        {customResume.email}
                      </a>
                    )}

                    {customResume.email && (customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                      <span className="text-gray-400">•</span>
                    )}

                    {customResume.phone && (
                      <a
                        href={`tel:${customResume.phone}`}
                        className="text-[#111827] hover:text-black"
                      >
                        {customResume.phone}
                      </a>
                    )}

                    {customResume.phone && (customResume.linkedin || customResume.github || customResume.website) && (
                      <span className="text-gray-400">•</span>
                    )}

                    {customResume.linkedin && (
                      <a
                        href={customResume.linkedin.startsWith("http") ? customResume.linkedin : `https://${customResume.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#111827] underline hover:text-black"
                      >
                        LinkedIn
                      </a>
                    )}

                    {customResume.linkedin && (customResume.github || customResume.website) && (
                      <span className="text-gray-400">•</span>
                    )}

                    {customResume.github && (
                      <a
                        href={customResume.github.startsWith("http") ? customResume.github : `https://${customResume.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#111827] underline hover:text-black"
                      >
                        GitHub
                      </a>
                    )}

                    {customResume.github && customResume.website && (
                      <span className="text-gray-400">•</span>
                    )}

                    {customResume.website && (
                      <a
                        href={customResume.website.startsWith("http") ? customResume.website : `https://${customResume.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#111827] underline hover:text-black"
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>

                {/* 2. Professional Summary / Career Objective */}
                {(customResume.summary !== undefined ? customResume.summary : defaultResume.summary) && (
                  <section className="section mb-4">
                    <h2
                      className={`text-xs font-black uppercase pb-0.5 mb-1.5 ${
                        activeStyle === "minimal"
                          ? "tracking-widest border-b border-gray-200 text-gray-900"
                          : "tracking-wider border-b-2 border-[#111827] text-[#111827]"
                      }`}
                    >
                      {activeCategory === "fresher" ? "Career Objective & Summary" : "Professional Summary"}
                    </h2>
                    <p className="text-[#374151] leading-relaxed">
                      {customResume.summary !== undefined ? customResume.summary : defaultResume.summary}
                    </p>
                  </section>
                )}

                {/* Reusable Section Functions */}
                {(() => {
                  const headingBorderClass =
                    activeStyle === "minimal"
                      ? "tracking-widest border-b border-gray-200 text-gray-900"
                      : "tracking-wider border-b-2 border-[#111827] text-[#111827]";

                  const renderEducationSection = () =>
                    customResume.education?.length > 0 && (
                      <section className="section mb-4" key="edu-sec">
                        <h2 className={`text-xs font-black uppercase pb-0.5 mb-1.5 ${headingBorderClass}`}>
                          Education & Credentials
                        </h2>
                        {customResume.education.map((edu, idx) => (
                          <div key={idx} className="mb-2">
                            <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                              <span>{edu.degree}</span>
                              <span className="font-semibold text-[#4b5563]">
                                {edu.period || edu.year}
                              </span>
                            </div>
                            <div className="sub-row text-[11px] text-[#4b5563] mb-0.5">
                              {edu.institution}{edu.location ? `, ${edu.location}` : ""}
                            </div>
                            {(edu.grade || edu.details) && (
                              <p className="text-[11px] text-[#4b5563] leading-relaxed">
                                • {edu.grade || edu.details}
                              </p>
                            )}
                          </div>
                        ))}
                      </section>
                    );

                  const renderSkillsSection = () =>
                    Object.keys(customResume.skillCategories || {}).length > 0 && (
                      <section className="section mb-4" key="skills-sec">
                        <h2 className={`text-xs font-black uppercase pb-0.5 mb-1.5 ${headingBorderClass}`}>
                          Technical Skills
                        </h2>
                        <div className="skills-grid space-y-1 text-[#374151]">
                          {Object.entries(customResume.skillCategories).map(([category, items]) => (
                            <div
                              key={category}
                              className="skill-line flex flex-col sm:flex-row sm:gap-1.5"
                            >
                              <span className="skill-label font-bold text-[#111827] min-w-[165px] shrink-0">
                                • {category}:
                              </span>
                              <span>{items}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  const renderProjectsSection = () =>
                    customResume.projects?.length > 0 && (
                      <section className="section mb-4" key="proj-sec">
                        <h2 className={`text-xs font-black uppercase pb-0.5 mb-1.5 ${headingBorderClass}`}>
                          Featured Projects
                        </h2>
                        <div className="space-y-2.5">
                          {customResume.projects.map((project, idx) => (
                            <div key={idx} className="mb-2">
                              <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                                <span>{project.title}</span>
                                {project.tech && (
                                  <span
                                    className={`tag-pill text-[11px] font-semibold ${
                                      activeStyle === "minimal"
                                        ? "text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded"
                                        : "text-[#4b5563]"
                                    }`}
                                  >
                                    {project.tech}
                                  </span>
                                )}
                              </div>
                              {project.bullets && project.bullets.length > 0 && (
                                <ul className="list-disc list-outside pl-4 space-y-0.5 text-[#374151] mt-0.5">
                                  {project.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx} className="leading-snug">
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    );

                  const renderExperienceSection = () =>
                    customResume.experience?.length > 0 && (
                      <section className="section mb-4" key="exp-sec">
                        <h2 className={`text-xs font-black uppercase pb-0.5 mb-1.5 ${headingBorderClass}`}>
                          {activeCategory === "fresher" ? "Experience & Internships" : "Engineering Experience"}
                        </h2>
                        {customResume.experience.map((exp, idx) => (
                          <div key={idx} className="mb-2.5">
                            <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                              <span>{exp.role}</span>
                              <span className="font-semibold text-[#4b5563]">
                                {exp.period}
                              </span>
                            </div>
                            {exp.organization && (
                              <div className="sub-row text-[11px] text-[#4b5563] italic mb-1">
                                {exp.organization}{exp.location ? ` — ${exp.location}` : ""}
                              </div>
                            )}
                            {exp.bullets?.length > 0 && (
                              <ul className="list-disc list-outside pl-4 space-y-0.5 text-[#374151]">
                                {exp.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="leading-snug">
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </section>
                    );

                  // Dynamic layout based on active category track:
                  if (activeCategory === "fresher") {
                    return [
                      renderEducationSection(),
                      renderSkillsSection(),
                      renderProjectsSection(),
                      renderExperienceSection(),
                    ];
                  }

                  // Default / Standard layout:
                  return [
                    renderSkillsSection(),
                    renderExperienceSection(),
                    renderProjectsSection(),
                    renderEducationSection(),
                  ];
                })()}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modalJSX, document.body)
    : null;
}
