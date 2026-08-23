import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Copy,
  Check,
  X,
  Download,
  Layout,
  Type,
  Palette,
  RotateCcw,
  Eraser,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Briefcase,
  GraduationCap,
  User,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Target,
  Code2,
  Sparkles,
  Loader2,
  ChevronDown,
  FileCode,
} from "lucide-react";
import { generateResumeWithAI } from "../services/aiResume";
import { downloadResumeDocx } from "../utils/docxResumeExport";

export const AI_PRESET_PROMPTS = [
  {
    title: "🚀 Full-Stack / MERN Developer",
    prompt: "Full-Stack Engineer with 4+ years building production applications with React, TypeScript, Node.js, Express, PostgreSQL, and AWS. Architected healthcare management software with role-based access control, reduced API latency by 45%, and optimized SQL queries. Graduated with B.S. in Computer Science.",
  },
  {
    title: "🤖 AI / Machine Learning Specialist",
    prompt: "AI / ML Engineer specializing in Computer Vision, Python, PyTorch, LangChain, and autonomous agents. Shipped neural vision diagnostic systems, real-time object detection pipelines, and custom LLM workflows. Holds a degree in Computer Science.",
  },
  {
    title: "🎓 CS Graduate / Fresher",
    prompt: "Motivated Computer Science graduate with strong foundation in Data Structures, Algorithms, JavaScript, React, Python, and REST APIs. Built full-stack e-commerce and real-time collaborative chat applications with active GitHub projects.",
  },
  {
    title: "☁️ Cloud DevOps & SRE",
    prompt: "DevOps & Infrastructure Engineer with deep expertise in AWS, Docker, Kubernetes, Terraform, GitHub Actions CI/CD pipelines, and Prometheus monitoring. Implemented automated zero-downtime deployment pipelines.",
  },
];

export const MODERN_COLORS = {
  indigo: {
    id: "indigo",
    label: "Indigo",
    dot: "bg-indigo-600",
    hex: {
      primary: "#1e1b4b",
      accent: "#4f46e5",
      accentDark: "#4338ca",
      bgTint: "#eef2ff",
      bgBadge: "#e0e7ff",
      border: "#c7d2fe",
      borderSubtle: "#e0e7ff",
    },
    classes: {
      headerGrad: "from-indigo-50/70 via-slate-50/30 to-white",
      headerBorder: "border-indigo-200/80",
      name: "text-indigo-950",
      roleBadge: "text-indigo-700 bg-indigo-100/80 border-indigo-200/80",
      link: "text-indigo-600 hover:text-indigo-800",
      dotSeparator: "text-indigo-300",
      heading: "text-indigo-950 border-indigo-600 bg-indigo-50/75",
      subRow: "text-indigo-700",
      gradeBox: "text-slate-600 bg-indigo-50/40 border-indigo-100/50",
      skillBadge: "text-indigo-950 bg-indigo-50/80 border-indigo-100/80",
      tagPill: "text-indigo-700 bg-indigo-50 border-indigo-200/80",
      bulletMarker: "marker:text-indigo-500",
    },
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    dot: "bg-emerald-600",
    hex: {
      primary: "#064e3b",
      accent: "#059669",
      accentDark: "#047857",
      bgTint: "#ecfdf5",
      bgBadge: "#d1fae5",
      border: "#a7f3d0",
      borderSubtle: "#d1fae5",
    },
    classes: {
      headerGrad: "from-emerald-50/70 via-slate-50/30 to-white",
      headerBorder: "border-emerald-200/80",
      name: "text-emerald-950",
      roleBadge: "text-emerald-700 bg-emerald-100/80 border-emerald-200/80",
      link: "text-emerald-600 hover:text-emerald-800",
      dotSeparator: "text-emerald-300",
      heading: "text-emerald-950 border-emerald-600 bg-emerald-50/75",
      subRow: "text-emerald-700",
      gradeBox: "text-slate-600 bg-emerald-50/40 border-emerald-100/50",
      skillBadge: "text-emerald-950 bg-emerald-50/80 border-emerald-100/80",
      tagPill: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
      bulletMarker: "marker:text-emerald-500",
    },
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    dot: "bg-sky-600",
    hex: {
      primary: "#082f49",
      accent: "#0284c7",
      accentDark: "#0369a1",
      bgTint: "#f0f9ff",
      bgBadge: "#e0f2fe",
      border: "#bae6fd",
      borderSubtle: "#e0f2fe",
    },
    classes: {
      headerGrad: "from-sky-50/70 via-slate-50/30 to-white",
      headerBorder: "border-sky-200/80",
      name: "text-sky-950",
      roleBadge: "text-sky-700 bg-sky-100/80 border-sky-200/80",
      link: "text-sky-600 hover:text-sky-800",
      dotSeparator: "text-sky-300",
      heading: "text-sky-950 border-sky-600 bg-sky-50/75",
      subRow: "text-sky-700",
      gradeBox: "text-slate-600 bg-sky-50/40 border-sky-100/50",
      skillBadge: "text-sky-950 bg-sky-50/80 border-sky-100/80",
      tagPill: "text-sky-700 bg-sky-50 border-sky-200/80",
      bulletMarker: "marker:text-sky-500",
    },
  },
  rose: {
    id: "rose",
    label: "Rose",
    dot: "bg-rose-600",
    hex: {
      primary: "#4c0519",
      accent: "#e11d48",
      accentDark: "#be123c",
      bgTint: "#fff1f2",
      bgBadge: "#ffe4e6",
      border: "#fecdd3",
      borderSubtle: "#ffe4e6",
    },
    classes: {
      headerGrad: "from-rose-50/70 via-slate-50/30 to-white",
      headerBorder: "border-rose-200/80",
      name: "text-rose-950",
      roleBadge: "text-rose-700 bg-rose-100/80 border-rose-200/80",
      link: "text-rose-600 hover:text-rose-800",
      dotSeparator: "text-rose-300",
      heading: "text-rose-950 border-rose-600 bg-rose-50/75",
      subRow: "text-rose-700",
      gradeBox: "text-slate-600 bg-rose-50/40 border-rose-100/50",
      skillBadge: "text-rose-950 bg-rose-50/80 border-rose-100/80",
      tagPill: "text-rose-700 bg-rose-50 border-rose-200/80",
      bulletMarker: "marker:text-rose-500",
    },
  },
};

/**
 * Default Dummy Data for Standalone Replica
 */
export const DEFAULT_STANDALONE_RESUME = {
  name: "Alex Morgan",
  targetRole: "Senior Full-Stack Software Engineer",
  location: "San Francisco, CA / Remote",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 234-5678",
  linkedin: "https://linkedin.com/in/alexmorgan-dev",
  github: "https://github.com/alexmorgan-dev",
  website: "https://alexmorgan.dev",
  sectionTitles: {
    summary: "Professional Summary",
    skills: "Technical Skills",
    experience: "Engineering Experience",
    projects: "Featured Projects",
    education: "Education & Credentials",
  },
  summary:
    "Results-driven Senior Full-Stack Software Engineer with 5+ years of experience architecting high-traffic web applications, scalable REST/GraphQL microservices, and distributed cloud systems. Specialized in React, TypeScript, Node.js, and AWS with a proven track record of driving 99.99% system reliability, optimizing SQL query performance by 50%, and mentoring engineering teams.",
  skillCategories: {
    "Languages & Core": "TypeScript, JavaScript (ES6+), Python, Go, SQL, HTML5/CSS3",
    "Frontend & UI": "React.js, Next.js, Tailwind CSS, Redux Toolkit, Framer Motion, Webpack, Vite",
    "Backend & Cloud": "Node.js, Express.js, NestJS, FastAPI, AWS (ECS, Lambda, S3), Docker, CI/CD",
    "Databases & Storage": "PostgreSQL, MongoDB, Redis, Supabase, Prisma ORM",
  },
  experience: [
    {
      role: "Senior Full-Stack Engineer",
      organization: "Vanguard Tech Solutions",
      location: "San Francisco, CA",
      period: "2022 – Present",
      bullets: [
        "Architected and deployed enterprise micro-frontend platforms serving 500k+ monthly active users with 99.98% uptime.",
        "Engineered real-time collaboration engine using WebSockets and Redis, decreasing data synchronization latency by 45%.",
        "Led migration of legacy monolithic services to containerized Docker and AWS ECS architectures, reducing cloud hosting costs by 30%.",
        "Mentored 6 software engineers and instituted automated end-to-end testing pipelines increasing code coverage to 92%.",
      ],
    },
    {
      role: "Full-Stack Software Engineer",
      organization: "Nexus Cloud Systems",
      location: "Austin, TX",
      period: "2020 – 2022",
      bullets: [
        "Developed role-based access control dashboards, digital reporting modules, and secure payment workflows in React and Node.js.",
        "Designed and optimized PostgreSQL indexing and schema architectures, accelerating critical API query execution times by 55%.",
        "Built automated CI/CD deployment pipelines using GitHub Actions, cutting release deployment cycles from 2 days to 15 minutes.",
      ],
    },
  ],
  projects: [
    {
      title: "OmniFlow — Real-Time Task & Workflow Engine",
      tech: "React, TypeScript, Node.js, Socket.io, PostgreSQL, Docker",
      bullets: [
        "Built full-stack project management platform with drag-and-drop kanban boards, live activity streams, and team permission tiers.",
        "Implemented optimistic UI state updates and offline synchronization queue handling 10,000+ concurrent state mutations per minute.",
      ],
    },
    {
      title: "CloudPulse — Infrastructure Telemetry & Metric Monitor",
      tech: "Next.js, Python, FastAPI, TimescaleDB, AWS, Tailwind CSS",
      bullets: [
        "Architected serverless log visualization tool tracking CPU, memory, and API endpoint performance metrics with instant alerting webhooks.",
        "Engineered responsive interactive charts with sub-second data refresh rates across 40+ microservices.",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      year: "2016 – 2020",
      grade: "GPA: 3.85 / 4.0",
      details: "Dean's Honors List. Coursework in Distributed Systems, Algorithms, Machine Learning, and Database Architecture.",
    },
  ],
};

export default function StandaloneResumeBuilder({
  isOpen = true,
  onClose = () => {},
  standalone = false,
  initialData = null,
}) {
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem("workstation_resume_category") || "standard";
  });
  const [activeStyle, setActiveStyle] = useState(() => {
    return localStorage.getItem("workstation_resume_style") || "classic";
  });
  const [modernColor, setModernColor] = useState(() => {
    return localStorage.getItem("workstation_resume_color") || "indigo";
  });
  const [activeFont, setActiveFont] = useState(() => {
    return localStorage.getItem("workstation_resume_font") || "sans";
  });
  const [activeTab, setActiveTab] = useState("customize"); // "customize" (Edit) | "preview" (View) - default to edit for standalone studio
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuccess, setAiSuccess] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const printAreaRef = useRef(null);
  const downloadMenuRef = useRef(null);

  const mc = MODERN_COLORS[modernColor]?.classes || MODERN_COLORS.indigo.classes;

  const getDefaultResumeState = useCallback(() => {
    const base = initialData ? JSON.parse(JSON.stringify(initialData)) : JSON.parse(JSON.stringify(DEFAULT_STANDALONE_RESUME));
    return {
      ...base,
      sectionTitles: {
        summary: activeCategory === "fresher" ? "Career Objective & Summary" : (base.sectionTitles?.summary || "Professional Summary"),
        skills: base.sectionTitles?.skills || "Technical Skills",
        experience: activeCategory === "fresher" ? "Experience & Internships" : (base.sectionTitles?.experience || "Engineering Experience"),
        projects: base.sectionTitles?.projects || "Featured Projects",
        education: base.sectionTitles?.education || "Education & Credentials",
        ...(base.sectionTitles || {}),
      },
    };
  }, [initialData, activeCategory]);

  const [customResume, setCustomResume] = useState(() => {
    try {
      const saved = localStorage.getItem("workstation_resume_data");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return getDefaultResumeState();
  });

  // Save session state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("workstation_resume_data", JSON.stringify(customResume));
    } catch (e) {}
  }, [customResume]);

  useEffect(() => {
    localStorage.setItem("workstation_resume_category", activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    localStorage.setItem("workstation_resume_style", activeStyle);
  }, [activeStyle]);

  useEffect(() => {
    localStorage.setItem("workstation_resume_color", modernColor);
  }, [modernColor]);

  useEffect(() => {
    localStorage.setItem("workstation_resume_font", activeFont);
  }, [activeFont]);

  // Close download dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
        setIsDownloadMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDownloadMenuOpen(false);
      }
    };
    if (isDownloadMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDownloadMenuOpen]);

  // Get section heading title with fallback
  const getSectionTitle = (key) => {
    if (customResume.sectionTitles && customResume.sectionTitles[key] !== undefined && customResume.sectionTitles[key] !== "") {
      return customResume.sectionTitles[key];
    }
    switch (key) {
      case "summary":
        return activeCategory === "fresher" ? "Career Objective & Summary" : "Professional Summary";
      case "skills":
        return "Technical Skills";
      case "experience":
        return activeCategory === "fresher" ? "Experience & Internships" : "Engineering Experience";
      case "projects":
        return "Featured Projects";
      case "education":
        return "Education & Credentials";
      default:
        return "";
    }
  };

  // Synchronize when category changes
  useEffect(() => {
    setCustomResume((prev) => ({
      ...prev,
      sectionTitles: {
        ...prev.sectionTitles,
        summary: activeCategory === "fresher" ? "Career Objective & Summary" : (prev.sectionTitles?.summary || "Professional Summary"),
        experience: activeCategory === "fresher" ? "Experience & Internships" : (prev.sectionTitles?.experience || "Engineering Experience"),
      },
    }));
  }, [activeCategory]);

  // Lock body scroll in modal mode
  useEffect(() => {
    if (!standalone && isOpen) {
      if (typeof window !== "undefined" && window.lenis) {
        window.lenis.stop();
      }
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        if (typeof window !== "undefined" && window.lenis) {
          window.lenis.start();
        }
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose, standalone]);

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

  // Generate ATS Plain Text
  const generatePlainTextResume = () => {
    const lines = [];

    // Header
    const name = customResume.name || "YOUR NAME";
    const targetRole = customResume.targetRole;
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
    if (customResume.summary) {
      lines.push(getSectionTitle("summary").toUpperCase());
      lines.push("-".repeat(30));
      lines.push(customResume.summary);
      lines.push("\n");
    }

    const renderSkillsText = () => {
      const currentSkills = customResume.skillCategories;
      if (currentSkills && Object.keys(currentSkills).length > 0) {
        lines.push(getSectionTitle("skills").toUpperCase());
        lines.push("-".repeat(30));
        Object.entries(currentSkills).forEach(([cat, val]) => {
          if (val) lines.push(`• ${cat}: ${val}`);
        });
        lines.push("\n");
      }
    };

    const renderEduText = () => {
      const currentEdu = customResume.education;
      if (currentEdu && currentEdu.length > 0) {
        lines.push(getSectionTitle("education").toUpperCase());
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
      const currentExp = customResume.experience;
      if (currentExp && currentExp.length > 0) {
        lines.push(getSectionTitle("experience").toUpperCase());
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
      const currentProj = customResume.projects;
      if (currentProj && currentProj.length > 0) {
        lines.push(getSectionTitle("projects").toUpperCase());
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
    const printContent = document.getElementById("standalone-ats-resume-doc") || printAreaRef.current;
    if (!printContent) return;

    const activePal = MODERN_COLORS[modernColor] || MODERN_COLORS.indigo;

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
          <title>${(customResume.name || "Resume").replace(/\s+/g, "_")}_Resume</title>
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
              color: ${activeStyle === "modern" ? activePal.hex.accentDark : "#111827"};
              text-decoration: ${activeStyle === "modern" ? "none" : "underline"};
            }
            h1 {
              font-size: ${activeStyle === "compact" ? "20px" : "24px"};
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: -0.3px;
              color: ${activeStyle === "modern" ? activePal.hex.primary : "#111827"};
            }
            h2 {
              font-size: ${activeStyle === "compact" ? "11px" : "12px"};
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              ${
                activeStyle === "modern"
                  ? `border-left: 3.5px solid ${activePal.hex.accent}; background: ${activePal.hex.bgTint}; padding: 2.5px 8px; border-radius: 0 4px 4px 0; color: ${activePal.hex.primary}; border-bottom: none;`
                  : "border-bottom: 1.5px solid #111827; padding-bottom: 2px; color: #111827;"
              }
              margin-top: ${activeStyle === "compact" ? "6px" : "10px"};
              margin-bottom: 4px;
            }
            .section { margin-bottom: ${activeStyle === "compact" ? "6px" : "10px"}; }
            .header-box {
              ${
                activeStyle === "modern"
                  ? `border-bottom: 2px solid ${activePal.hex.border}; background: #f8fafc; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px;`
                  : `border-bottom: 2px solid #111827; padding-bottom: ${activeStyle === "compact" ? "4px" : "8px"}; margin-bottom: ${activeStyle === "compact" ? "6px" : "10px"};`
              }
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
              color: ${activeStyle === "modern" ? activePal.hex.accentDark : "#4b5563"};
              margin-bottom: 2px;
              ${activeStyle === "modern" ? "font-weight: 500;" : ""}
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
              color: ${activeStyle === "modern" ? activePal.hex.primary : "#111827"};
              ${activeStyle === "modern" ? `background: ${activePal.hex.bgTint}; border: 1px solid ${activePal.hex.borderSubtle}; padding: 1px 6px; border-radius: 4px; display: inline-block; margin-right: 4px;` : ""}
            }
            .role-badge {
              ${activeStyle === "modern" ? `background: ${activePal.hex.bgBadge}; color: ${activePal.hex.primary}; border: 1px solid ${activePal.hex.border}; padding: 2px 8px; border-radius: 9999px; font-weight: 700; font-size: 11px; display: inline-block;` : ""}
            }
            .tag-pill {
              ${activeStyle === "modern" ? `background: ${activePal.hex.bgTint}; color: ${activePal.hex.accentDark}; border: 1px solid ${activePal.hex.border}; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;` : ""}
            }
            .date-badge {
              ${activeStyle === "modern" ? "background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;" : ""}
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
      } catch {
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

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await downloadResumeDocx(customResume, {
        activeCategory,
        activeStyle,
        modernColor,
        activeFont,
      });
    } catch (err) {
      console.error("Failed to export Word resume:", err);
    } finally {
      setIsExportingDocx(false);
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
      sectionTitles: {
        summary: "Professional Summary",
        skills: "Technical Skills",
        experience: "Engineering Experience",
        projects: "Featured Projects",
        education: "Education & Credentials",
      },
      skillCategories: {
        "Languages & Frameworks": "",
        "Tools & Technologies": "",
      },
      experience: [],
      projects: [],
      education: [],
    });
  };

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim() || isGeneratingAi) return;
    setIsGeneratingAi(true);
    setAiError("");
    setAiSuccess(false);

    try {
      const generatedResume = await generateResumeWithAI(aiPrompt, {
        name: customResume.name || DEFAULT_STANDALONE_RESUME.name || "",
        location: customResume.location || DEFAULT_STANDALONE_RESUME.location || "",
        email: customResume.email || DEFAULT_STANDALONE_RESUME.email || "",
        phone: customResume.phone || DEFAULT_STANDALONE_RESUME.phone || "",
        linkedin: customResume.linkedin || DEFAULT_STANDALONE_RESUME.linkedin || "",
        github: customResume.github || DEFAULT_STANDALONE_RESUME.github || "",
        website: customResume.website || DEFAULT_STANDALONE_RESUME.website || "",
      });
      setCustomResume(generatedResume);
      setAiSuccess(true);
      setTimeout(() => {
        setIsAiModalOpen(false);
        setAiSuccess(false);
        setActiveTab("preview");
      }, 700);
    } catch (err) {
      setAiError(err.message || "Failed to generate resume with AI. Please try again.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --------------------------------------------------------------------------
  // MAIN COMPONENT JSX (Identical styling to ResumeModal)
  // --------------------------------------------------------------------------
  const contentJSX = (
    <div
      className="relative w-full max-w-3xl h-[680px] sm:h-[720px] max-h-[88dvh] mx-auto my-2 flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-[#11131b] border border-gray-200 dark:border-white/[0.08] overflow-hidden z-10 font-jakarta shadow-2xl selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-black transform-gpu"
    >
      {/* 1. Header Main Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#11131b] shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
            <FileText size={14} />
          </div>

          {/* Edit / View Tab Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("customize")}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                activeTab === "customize"
                  ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-semibold shadow-xs"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
              }`}
              title="Edit Resume"
              aria-label="Edit Resume"
            >
              <Edit3 size={13} className="shrink-0" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-semibold shadow-xs"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
              }`}
              title="View Resume"
              aria-label="View Resume"
            >
              <Eye size={13} className="shrink-0" />
              <span>View</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Copy Plain Text Button */}
          <button
            type="button"
            onClick={handleCopyPlainText}
            className="flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white dark:bg-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.12] border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-200 font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            title="Copy ATS formatted plain text"
            aria-label="Copy plain text"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="hidden md:inline text-emerald-700 dark:text-emerald-300 text-xs font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-gray-600 dark:text-gray-400 shrink-0" />
                <span className="hidden md:inline text-xs">Copy Text</span>
              </>
            )}
          </button>

          {/* Download Multi-Format Dropdown (.docx or .pdf) */}
          <div className="relative inline-block text-left" ref={downloadMenuRef}>
            <button
              type="button"
              onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
              className="flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0 group"
              title="Download resume in Word or PDF format"
              aria-label="Download resume options"
              aria-haspopup="true"
              aria-expanded={isDownloadMenuOpen}
            >
              <Download size={13} className="shrink-0 group-hover:-translate-y-0.5 transition-transform" />
              <span className="hidden md:inline text-xs">Download</span>
              <ChevronDown
                size={11}
                className={`shrink-0 text-gray-300 dark:text-gray-600 transition-transform duration-200 ${
                  isDownloadMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isDownloadMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1.5 w-60 sm:w-64 origin-top-right bg-white dark:bg-[#161922] rounded-xl shadow-xl border border-gray-200/90 dark:border-white/10 py-1.5 z-50 overflow-hidden font-jakarta"
                >
                  <div className="px-3 py-1.5 border-b border-gray-100 dark:border-white/[0.06] mb-1">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Select Format
                    </p>
                  </div>

                  {/* PDF Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handlePrint();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 flex items-center justify-center shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-900/60 transition-colors">
                      <FileText size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-pAccent">
                          PDF Document
                        </span>
                        <span className="text-[10px] font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/70 border border-red-200/80 dark:border-red-800 px-1.5 py-0.2 rounded font-mono">
                          .pdf
                        </span>
                      </div>
                      <p className="text-[10.5px] text-gray-500 dark:text-gray-400 truncate">
                        Print-ready ATS format (1-2 pages)
                      </p>
                    </div>
                  </button>

                  {/* Word (.docx) Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handleDownloadDocx();
                    }}
                    disabled={isExportingDocx}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors cursor-pointer group disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 transition-colors">
                      {isExportingDocx ? (
                        <Loader2 size={15} className="animate-spin text-blue-600 dark:text-blue-400" />
                      ) : (
                        <FileCode size={15} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-pAccent">
                          Word Document
                        </span>
                        <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 px-1.5 py-0.2 rounded font-mono">
                          .docx
                        </span>
                      </div>
                      <p className="text-[10.5px] text-gray-500 dark:text-gray-400 truncate">
                        Editable ATS Word document
                      </p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Close Button (if in modal mode) */}
          {!standalone && (
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0 ml-0.5"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Customizer Ribbon (Active only in Preview Mode) */}
      {activeTab === "preview" && (
        <div className="px-3 sm:px-5 py-2.5 bg-gray-50 dark:bg-[#0c0e14] border-b border-gray-200 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0 transition-colors duration-200">
          {/* 1. Track / Category Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1 shrink-0 uppercase tracking-wider">
              <Target size={12} className="text-gray-600 dark:text-gray-400" /> Track:
            </span>
            <div className="flex items-center bg-gray-200/60 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setActiveCategory("standard")}
                className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                  activeCategory === "standard"
                    ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-bold shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                }`}
              >
                Experienced
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("fresher")}
                className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                  activeCategory === "fresher"
                    ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-bold shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                }`}
              >
                Fresher
              </button>
            </div>
          </div>

          {/* 2. Template Style Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1 shrink-0 uppercase tracking-wider">
              <Layout size={12} className="text-gray-600 dark:text-gray-400" /> Style:
            </span>
            <div className="flex items-center bg-gray-200/60 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
              {[
                { id: "classic", label: "Classic" },
                { id: "executive", label: "Executive" },
                { id: "compact", label: "Compact" },
                { id: "modern", label: "Modern" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStyle(s.id)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                    activeStyle === s.id
                      ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-bold shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Modern Color Palette Selector (ONLY visible when Modern style is chosen) */}
          {activeStyle === "modern" && (
            <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-200">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1 shrink-0 uppercase tracking-wider">
                <Palette size={12} className="text-gray-600 dark:text-gray-400" /> Theme:
              </span>
              <div className="flex items-center bg-gray-200/60 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10 gap-0.5">
                {Object.values(MODERN_COLORS).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setModernColor(c.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all cursor-pointer ${
                      modernColor === c.id
                        ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-bold shadow-xs"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                    }`}
                    title={`${c.label} color theme`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0 ring-1 ring-black/10`} />
                    <span className="hidden sm:inline">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Font Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1 shrink-0 uppercase tracking-wider">
              <Type size={12} className="text-gray-600 dark:text-gray-400" /> Font:
            </span>
            <div className="flex items-center bg-gray-200/60 dark:bg-white/[0.06] p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
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
                      ? "bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white font-bold shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
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
        /* CUSTOMIZE FORM VIEW */
        <div className="flex-1 flex flex-col min-h-0 bg-[#f9fafb] dark:bg-[#090b10] transition-colors duration-200">
          <div
            data-lenis-prevent="true"
            className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6 text-gray-900 dark:text-white text-left font-jakarta"
            style={{
              scrollbarColor: "rgba(0, 0, 0, 0.15) transparent",
              scrollbarWidth: "thin",
            }}
          >
            {/* Form Header & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-white/[0.08]">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight">
                  Edit & Customize Resume
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Tailor your target role, summary, skills, and projects, or build from scratch.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setIsAiModalOpen(true);
                    setAiError("");
                    setAiSuccess(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
                  title="Auto-fill resume with AI from a prompt"
                >
                  <Sparkles size={12} className="text-amber-300 animate-pulse" />
                  <span>AI Auto-Fill</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearToScratch}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300 shadow-xs transition-all cursor-pointer"
                  title="Clear all fields and build from scratch"
                >
                  <Eraser size={12} className="text-red-600 dark:text-red-400" />
                  <span>Start from Scratch</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.12] border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-xs transition-all cursor-pointer"
                  title="Reset to default dummy resume"
                >
                  <RotateCcw size={12} className="text-gray-500 dark:text-gray-400" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* 1. Personal & Contact Information */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                  <User size={13} className="text-gray-700 dark:text-gray-300" /> Personal & Contact Info
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <User size={11} className="text-gray-500 dark:text-gray-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={customResume.name || ""}
                    onChange={(e) => setCustomResume({ ...customResume, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <MapPin size={11} className="text-gray-500 dark:text-gray-400" /> Location / City
                  </label>
                  <input
                    type="text"
                    value={customResume.location || ""}
                    onChange={(e) => setCustomResume({ ...customResume, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA / Remote"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Mail size={11} className="text-gray-500 dark:text-gray-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={customResume.email || ""}
                    onChange={(e) => setCustomResume({ ...customResume, email: e.target.value })}
                    placeholder="e.g. alex.morgan@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Phone size={11} className="text-gray-500 dark:text-gray-400" /> Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={customResume.phone || ""}
                    onChange={(e) => setCustomResume({ ...customResume, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Linkedin size={11} className="text-gray-500 dark:text-gray-400" /> LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={customResume.linkedin || ""}
                    onChange={(e) => setCustomResume({ ...customResume, linkedin: e.target.value })}
                    placeholder="e.g. linkedin.com/in/alexmorgan-dev"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Github size={11} className="text-gray-500 dark:text-gray-400" /> GitHub URL
                  </label>
                  <input
                    type="text"
                    value={customResume.github || ""}
                    onChange={(e) => setCustomResume({ ...customResume, github: e.target.value })}
                    placeholder="e.g. github.com/alexmorgan-dev"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Globe size={11} className="text-gray-500 dark:text-gray-400" /> Portfolio / Website Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={customResume.website || ""}
                    onChange={(e) => setCustomResume({ ...customResume, website: e.target.value })}
                    placeholder="e.g. alexmorgan.dev"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 2. Target Role & Title */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs space-y-2.5 transition-colors duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/[0.06]">
                <label className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                  <Target size={14} className="text-gray-700 dark:text-gray-300 shrink-0" />
                  <span>Target Job Title / Role</span>
                </label>
              </div>
              <input
                type="text"
                value={customResume.targetRole || ""}
                onChange={(e) => setCustomResume({ ...customResume, targetRole: e.target.value })}
                placeholder="e.g. Senior Full-Stack Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all font-medium"
              />
            </div>

            {/* 3. Professional Summary */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <label className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                  <FileText size={14} className="text-gray-700 dark:text-gray-300 shrink-0" />
                  <span>Summary</span>
                </label>
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 focus-within:border-gray-900 dark:focus-within:border-white/40 focus-within:bg-white dark:focus-within:bg-[#0c0e14] focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
                  <span className="text-[10.5px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
                    Section Title:
                  </span>
                  <input
                    type="text"
                    value={customResume.sectionTitles?.summary !== undefined ? customResume.sectionTitles.summary : getSectionTitle("summary")}
                    onChange={(e) =>
                      setCustomResume({
                        ...customResume,
                        sectionTitles: {
                          ...(customResume.sectionTitles || {}),
                          summary: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Professional Summary"
                    className="w-44 sm:w-56 py-0.5 bg-transparent text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                  />
                </div>
              </div>
              <textarea
                rows={5}
                value={customResume.summary || ""}
                onChange={(e) => setCustomResume({ ...customResume, summary: e.target.value })}
                placeholder="Brief overview of your engineering background, core strengths, and technical specializations..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all resize-y min-h-[110px] leading-relaxed font-normal"
              />
            </div>

            {/* 4. Education Customization */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <GraduationCap size={14} className="text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Education</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 focus-within:border-gray-900 dark:focus-within:border-white/40 focus-within:bg-white dark:focus-within:bg-[#0c0e14] focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
                    <span className="text-[10.5px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
                      Section Title:
                    </span>
                    <input
                      type="text"
                      value={customResume.sectionTitles?.education !== undefined ? customResume.sectionTitles.education : getSectionTitle("education")}
                      onChange={(e) =>
                        setCustomResume({
                          ...customResume,
                          sectionTitles: {
                            ...(customResume.sectionTitles || {}),
                            education: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Education & Credentials"
                      className="w-44 sm:w-52 py-0.5 bg-transparent text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEdu = [
                      ...(customResume.education || []),
                      {
                        degree: "Bachelor of Science in Computer Science",
                        institution: "University Name",
                        period: "2020 – 2024",
                        grade: "GPA: 3.8 / 4.0",
                      },
                    ];
                    setCustomResume({ ...customResume, education: newEdu });
                  }}
                  className="flex items-center gap-1 text-[11px] sm:text-xs text-white dark:text-black bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus size={12} className="shrink-0" />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {customResume.education?.map((edu, eIdx) => (
                  <div key={eIdx} className="p-3.5 sm:p-4 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-white/[0.08]">
                      <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                        Degree #{eIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newEdu = [...customResume.education];
                          newEdu.splice(eIdx, 1);
                          setCustomResume({ ...customResume, education: newEdu });
                        }}
                        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-white/[0.06] transition-colors font-medium shrink-0 cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 size={12} className="shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Degree / Major</span>
                        <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={(e) => {
                            const newEdu = [...customResume.education];
                            newEdu[eIdx].degree = e.target.value;
                            setCustomResume({ ...customResume, education: newEdu });
                          }}
                          placeholder="e.g. B.S. in Computer Science"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs font-semibold text-gray-900 dark:text-white shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Institution & Location</span>
                        <input
                          type="text"
                          value={edu.institution || ""}
                          onChange={(e) => {
                            const newEdu = [...customResume.education];
                            newEdu[eIdx].institution = e.target.value;
                            setCustomResume({ ...customResume, education: newEdu });
                          }}
                          placeholder="e.g. University Name, City"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs font-medium text-gray-900 dark:text-white shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Period / Years</span>
                        <input
                          type="text"
                          value={edu.period || edu.year || ""}
                          onChange={(e) => {
                            const newEdu = [...customResume.education];
                            newEdu[eIdx].period = e.target.value;
                            newEdu[eIdx].year = e.target.value;
                            setCustomResume({ ...customResume, education: newEdu });
                          }}
                          placeholder="e.g. 2016 – 2020"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs font-medium text-gray-900 dark:text-white shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Grade / Honors / Coursework</span>
                        <textarea
                          rows={2}
                          value={edu.grade || edu.details || ""}
                          onChange={(e) => {
                            const newEdu = [...customResume.education];
                            newEdu[eIdx].grade = e.target.value;
                            newEdu[eIdx].details = e.target.value;
                            setCustomResume({ ...customResume, education: newEdu });
                          }}
                          placeholder="e.g. GPA: 3.85 / 4.0, Dean's Honors List"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all resize-y min-h-[58px] leading-relaxed font-normal"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Technical Skills Categories */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <Code2 size={14} className="text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Technical Skills</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 focus-within:border-gray-900 dark:focus-within:border-white/40 focus-within:bg-white dark:focus-within:bg-[#0c0e14] focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
                    <span className="text-[10.5px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
                      Section Title:
                    </span>
                    <input
                      type="text"
                      value={customResume.sectionTitles?.skills !== undefined ? customResume.sectionTitles.skills : getSectionTitle("skills")}
                      onChange={(e) =>
                        setCustomResume({
                          ...customResume,
                          sectionTitles: {
                            ...(customResume.sectionTitles || {}),
                            skills: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Technical Skills"
                      className="w-44 sm:w-52 py-0.5 bg-transparent text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
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
                  className="flex items-center gap-1 text-[11px] sm:text-xs text-white dark:text-black bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus size={12} className="shrink-0" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-3">
                {customResume.skillCategories &&
                  Object.entries(customResume.skillCategories).map(([category, items]) => (
                    <div key={category} className="p-3.5 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 space-y-2">
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
                          className="px-2.5 py-1 rounded-md bg-white dark:bg-[#131620] border border-gray-300 dark:border-white/10 focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 text-xs font-semibold text-gray-900 dark:text-white outline-none max-w-[220px] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...(customResume.skillCategories || {}) };
                            delete updated[category];
                            setCustomResume({ ...customResume, skillCategories: updated });
                          }}
                          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-white/[0.06] transition-colors font-medium shrink-0 cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 size={12} className="shrink-0" />
                          <span>Delete</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={items}
                        onChange={(e) => {
                          const updated = { ...customResume.skillCategories, [category]: e.target.value };
                          setCustomResume({ ...customResume, skillCategories: updated });
                        }}
                        placeholder="e.g. TypeScript, React, Next.js, Node.js, PostgreSQL"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all resize-y min-h-[46px] leading-relaxed font-normal"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* 6. Experience Bullets */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <Briefcase size={14} className="text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Experience</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 focus-within:border-gray-900 dark:focus-within:border-white/40 focus-within:bg-white dark:focus-within:bg-[#0c0e14] focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
                    <span className="text-[10.5px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
                      Section Title:
                    </span>
                    <input
                      type="text"
                      value={customResume.sectionTitles?.experience !== undefined ? customResume.sectionTitles.experience : getSectionTitle("experience")}
                      onChange={(e) =>
                        setCustomResume({
                          ...customResume,
                          sectionTitles: {
                            ...(customResume.sectionTitles || {}),
                            experience: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Engineering Experience"
                      className="w-44 sm:w-52 py-0.5 bg-transparent text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
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
                  className="flex items-center gap-1 text-[11px] sm:text-xs text-white dark:text-black bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus size={12} className="shrink-0" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {customResume.experience?.map((exp, expIdx) => (
                  <div key={expIdx} className="p-3.5 sm:p-4 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-white/[0.08]">
                      <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                        Position #{expIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newExp = [...customResume.experience];
                          newExp.splice(expIdx, 1);
                          setCustomResume({ ...customResume, experience: newExp });
                        }}
                        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-white/[0.06] transition-colors font-medium shrink-0 cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 size={12} className="shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Role Title</span>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const newExp = [...customResume.experience];
                            newExp[expIdx].role = e.target.value;
                            setCustomResume({ ...customResume, experience: newExp });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs font-semibold text-gray-900 dark:text-white shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Organization & Period</span>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const newExp = [...customResume.experience];
                            newExp[expIdx].period = e.target.value;
                            setCustomResume({ ...customResume, experience: newExp });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs font-medium text-gray-900 dark:text-white shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Bullets List */}
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block">Accomplishment Bullets</span>
                      {exp.bullets?.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={b}
                            onChange={(e) => {
                              const newExp = [...customResume.experience];
                              newExp[expIdx].bullets[bIdx] = e.target.value;
                              setCustomResume({ ...customResume, experience: newExp });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all resize-y min-h-[52px] leading-relaxed font-normal"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newExp = [...customResume.experience];
                              newExp[expIdx].bullets.splice(bIdx, 1);
                              setCustomResume({ ...customResume, experience: newExp });
                            }}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-gray-200/50 dark:hover:bg-white/[0.06] transition-colors cursor-pointer mt-1"
                            title="Remove bullet"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newExp = [...customResume.experience];
                          newExp[expIdx].bullets = [...(newExp[expIdx].bullets || []), "New achievement bullet point..."];
                          setCustomResume({ ...customResume, experience: newExp });
                        }}
                        className="flex items-center gap-1 text-xs text-gray-900 dark:text-white hover:text-black dark:hover:text-pAccent font-semibold cursor-pointer pt-0.5"
                      >
                        <Plus size={12} /> Add Achievement Bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Projects Bullets */}
            <div className="bg-white dark:bg-[#131620] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <Code2 size={14} className="text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Projects</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 focus-within:border-gray-900 dark:focus-within:border-white/40 focus-within:bg-white dark:focus-within:bg-[#0c0e14] focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
                    <span className="text-[10.5px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
                      Section Title:
                    </span>
                    <input
                      type="text"
                      value={customResume.sectionTitles?.projects !== undefined ? customResume.sectionTitles.projects : getSectionTitle("projects")}
                      onChange={(e) =>
                        setCustomResume({
                          ...customResume,
                          sectionTitles: {
                            ...(customResume.sectionTitles || {}),
                            projects: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Featured Projects"
                      className="w-44 sm:w-52 py-0.5 bg-transparent text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
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
                  className="flex items-center gap-1 text-[11px] sm:text-xs text-white dark:text-black bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus size={12} className="shrink-0" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {customResume.projects?.map((proj, pIdx) => (
                  <div key={pIdx} className="p-3.5 sm:p-4 rounded-lg bg-gray-50 dark:bg-[#0c0e14] border border-gray-200 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-white/[0.08]">
                      <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                        Project #{pIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newProj = [...customResume.projects];
                          newProj.splice(pIdx, 1);
                          setCustomResume({ ...customResume, projects: newProj });
                        }}
                        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded hover:bg-gray-200/50 dark:hover:bg-white/[0.06] transition-colors font-medium shrink-0 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 size={12} className="shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Project Title</span>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const newProj = [...customResume.projects];
                            newProj[pIdx].title = e.target.value;
                            setCustomResume({ ...customResume, projects: newProj });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs font-semibold text-gray-900 dark:text-white shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tech Stack</span>
                        <input
                          type="text"
                          value={proj.tech || ""}
                          onChange={(e) => {
                            const newProj = [...customResume.projects];
                            newProj[pIdx].tech = e.target.value;
                            setCustomResume({ ...customResume, projects: newProj });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs font-medium text-gray-900 dark:text-white shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Project Bullets */}
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block">Key Highlights</span>
                      {proj.bullets?.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={b}
                            onChange={(e) => {
                              const newProj = [...customResume.projects];
                              newProj[pIdx].bullets[bIdx] = e.target.value;
                              setCustomResume({ ...customResume, projects: newProj });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#131620] text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-xs focus:border-gray-900 dark:focus:border-white/40 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:outline-none transition-all resize-y min-h-[52px] leading-relaxed font-normal"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newProj = [...customResume.projects];
                              newProj[pIdx].bullets.splice(bIdx, 1);
                              setCustomResume({ ...customResume, projects: newProj });
                            }}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-gray-200/50 dark:hover:bg-white/[0.06] transition-colors cursor-pointer mt-1"
                            title="Remove bullet"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newProj = [...customResume.projects];
                          newProj[pIdx].bullets = [...(newProj[pIdx].bullets || []), "Engineered key capability..."];
                          setCustomResume({ ...customResume, projects: newProj });
                        }}
                        className="flex items-center gap-1 text-xs text-gray-900 dark:text-white hover:text-black dark:hover:text-pAccent font-semibold cursor-pointer pt-0.5"
                      >
                        <Plus size={12} /> Add Highlight Bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solid Bottom Action Bar */}
          <div className="shrink-0 px-4 sm:px-7 py-3 bg-white dark:bg-[#11131b] border-t border-gray-200 dark:border-white/[0.08] flex items-center justify-end z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Eye size={13} />
              <span>View Generated Resume</span>
            </button>
          </div>
        </div>
      ) : (
        /* LIVE PREVIEW / PRINTABLE VIEW (100% Identical to ResumeModal) */
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto bg-[#f9fafb] dark:bg-[#090b10] p-2.5 sm:p-5 flex justify-center items-start"
          style={{
            scrollbarColor: "rgba(0, 0, 0, 0.15) transparent",
            scrollbarWidth: "thin",
          }}
        >
          <div
            ref={printAreaRef}
            id="standalone-ats-resume-doc"
            className={`w-full bg-white select-text text-left rounded-xl sm:rounded-2xl shadow-xs sm:shadow-md border border-gray-200/80 dark:border-white/10 ${
              activeStyle === "compact" ? "p-4 sm:p-6" : "p-5 sm:p-8 md:p-9"
            } text-xs sm:text-[12.5px] leading-relaxed text-[#111827]`}
            style={{
              fontFamily: getFontFamily(),
            }}
          >
          {/* 1. Header Box */}
          {activeStyle === "modern" ? (
            <div className={`header-box p-3.5 sm:p-4 mb-3.5 border-b-2 ${mc.headerBorder} bg-gradient-to-r ${mc.headerGrad} rounded-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h1 className={`text-xl sm:text-2xl font-black uppercase tracking-tight font-extrabold ${mc.name}`}>
                  {customResume.name || "YOUR NAME"}
                </h1>
                {customResume.targetRole && (
                  <span className={`role-badge inline-block text-xs font-bold ${mc.roleBadge} px-2.5 py-0.5 rounded-full shadow-2xs self-start sm:self-auto`}>
                    {customResume.targetRole}
                  </span>
                )}
              </div>
              <div className="contact-links flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] mt-1.5 font-medium text-slate-600">
                {customResume.location && (
                  <span className="text-slate-700 font-medium">{customResume.location}</span>
                )}
                {customResume.location && (customResume.email || customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                  <span className={mc.dotSeparator}>•</span>
                )}
                {customResume.email && (
                  <a href={`mailto:${customResume.email}`} className={`${mc.link} underline font-medium`}>
                    {customResume.email}
                  </a>
                )}
                {customResume.email && (customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                  <span className={mc.dotSeparator}>•</span>
                )}
                {customResume.phone && (
                  <a href={`tel:${customResume.phone}`} className="text-slate-700 hover:text-black font-medium">
                    {customResume.phone}
                  </a>
                )}
                {customResume.phone && (customResume.linkedin || customResume.github || customResume.website) && (
                  <span className={mc.dotSeparator}>•</span>
                )}
                {customResume.linkedin && (
                  <a href={customResume.linkedin.startsWith("http") ? customResume.linkedin : `https://${customResume.linkedin}`} target="_blank" rel="noreferrer" className={`${mc.link} underline font-medium`}>
                    LinkedIn
                  </a>
                )}
                {customResume.linkedin && (customResume.github || customResume.website) && (
                  <span className={mc.dotSeparator}>•</span>
                )}
                {customResume.github && (
                  <a href={customResume.github.startsWith("http") ? customResume.github : `https://${customResume.github}`} target="_blank" rel="noreferrer" className={`${mc.link} underline font-medium`}>
                    GitHub
                  </a>
                )}
                {customResume.github && customResume.website && (
                  <span className={mc.dotSeparator}>•</span>
                )}
                {customResume.website && (
                  <a href={customResume.website.startsWith("http") ? customResume.website : `https://${customResume.website}`} target="_blank" rel="noreferrer" className={`${mc.link} underline font-medium`}>
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          ) : activeStyle === "compact" ? (
            <div className="header-box pb-2 mb-2.5 border-b-2 border-[#111827]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black text-[#111827] uppercase tracking-tight">
                    {customResume.name || "YOUR NAME"}
                  </h1>
                  {customResume.targetRole && (
                    <span className="text-[11px] font-bold text-[#374151] uppercase tracking-wider">
                      | {customResume.targetRole}
                    </span>
                  )}
                </div>
              </div>
              <div className="contact-links flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] text-[#4b5563] mt-0.5 font-medium">
                {customResume.location && <span>{customResume.location}</span>}
                {customResume.location && (customResume.email || customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.email && (
                  <a href={`mailto:${customResume.email}`} className="text-[#111827] underline hover:text-black">
                    {customResume.email}
                  </a>
                )}
                {customResume.email && (customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.phone && (
                  <a href={`tel:${customResume.phone}`} className="text-[#111827] hover:text-black">
                    {customResume.phone}
                  </a>
                )}
                {customResume.phone && (customResume.linkedin || customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.linkedin && (
                  <a href={customResume.linkedin.startsWith("http") ? customResume.linkedin : `https://${customResume.linkedin}`} target="_blank" rel="noreferrer" className="text-[#111827] underline hover:text-black">
                    LinkedIn
                  </a>
                )}
                {customResume.linkedin && (customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.github && (
                  <a href={customResume.github.startsWith("http") ? customResume.github : `https://${customResume.github}`} target="_blank" rel="noreferrer" className="text-[#111827] underline hover:text-black">
                    GitHub
                  </a>
                )}
                {customResume.github && customResume.website && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.website && (
                  <a href={customResume.website.startsWith("http") ? customResume.website : `https://${customResume.website}`} target="_blank" rel="noreferrer" className="text-[#111827] underline hover:text-black">
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className={`header-box pb-2 mb-3.5 border-b-2 border-[#111827] ${activeStyle === "executive" ? "text-center" : "text-left"}`}>
              <h1 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight">
                {customResume.name || "YOUR NAME"}
              </h1>
              {customResume.targetRole && (
                <p className="text-xs sm:text-sm font-bold text-[#1f2937] mt-0.5 tracking-wide">
                  {customResume.targetRole}
                </p>
              )}
              <div className={`contact-links flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#4b5563] mt-1 font-medium ${activeStyle === "executive" ? "justify-center" : "justify-start"}`}>
                {customResume.location && <span>{customResume.location}</span>}
                {customResume.location && (customResume.email || customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.email && (
                  <a href={`mailto:${customResume.email}`} className="text-[#111827] underline hover:text-black">
                    {customResume.email}
                  </a>
                )}
                {customResume.email && (customResume.phone || customResume.linkedin || customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.phone && (
                  <a href={`tel:${customResume.phone}`} className="text-[#111827] hover:text-black">
                    {customResume.phone}
                  </a>
                )}
                {customResume.phone && (customResume.linkedin || customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.linkedin && (
                  <a href={customResume.linkedin.startsWith("http") ? customResume.linkedin : `https://${customResume.linkedin}`} target="_blank" rel="noreferrer" className="text-[#111827] underline hover:text-black">
                    LinkedIn
                  </a>
                )}
                {customResume.linkedin && (customResume.github || customResume.website) && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.github && (
                  <a href={customResume.github.startsWith("http") ? customResume.github : `https://${customResume.github}`} target="_blank" rel="noreferrer" className="text-[#111827] underline hover:text-black">
                    GitHub
                  </a>
                )}
                {customResume.github && customResume.website && (
                  <span className="text-gray-400">•</span>
                )}
                {customResume.website && (
                  <a href={customResume.website.startsWith("http") ? customResume.website : `https://${customResume.website}`} target="_blank" rel="noreferrer" className="text-[#111827] underline hover:text-black">
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 2. Professional Summary / Career Objective */}
          {customResume.summary && (
            <section className={`section ${activeStyle === "compact" ? "mb-2.5" : "mb-4"}`}>
              <h2
                className={
                  activeStyle === "modern"
                    ? `text-xs font-black uppercase border-l-[3.5px] pl-2.5 py-1 rounded-r mb-2 tracking-wider shadow-2xs ${mc.heading}`
                    : activeStyle === "compact"
                    ? "text-[11px] font-black uppercase pb-0.5 mb-1 tracking-wider border-b border-[#111827] text-[#111827]"
                    : "text-xs font-black uppercase pb-0.5 mb-1.5 tracking-wider border-b-2 border-[#111827] text-[#111827]"
                }
              >
                {getSectionTitle("summary")}
              </h2>
              <p className={
                activeStyle === "modern"
                  ? "text-slate-700 leading-relaxed font-normal"
                  : activeStyle === "compact"
                  ? "text-[#374151] text-[11px] leading-snug font-normal"
                  : "text-[#374151] leading-relaxed font-normal"
              }>
                {customResume.summary}
              </p>
            </section>
          )}

          {/* Dynamic Section Ordering */}
          {(() => {
            const headingBorderClass =
              activeStyle === "modern"
                ? `text-xs font-black uppercase border-l-[3.5px] pl-2.5 py-1 rounded-r mb-2 tracking-wider shadow-2xs ${mc.heading}`
                : activeStyle === "compact"
                ? "text-[11px] font-black uppercase pb-0.5 mb-1 tracking-wider border-b border-[#111827] text-[#111827]"
                : "text-xs font-black uppercase pb-0.5 mb-1.5 tracking-wider border-b-2 border-[#111827] text-[#111827]";

            const secMarginClass = activeStyle === "compact" ? "section mb-2.5" : "section mb-4";

            const renderEducationSection = () =>
              customResume.education?.length > 0 && (
                <section className={secMarginClass} key="edu-sec">
                  <h2 className={headingBorderClass}>
                    {getSectionTitle("education")}
                  </h2>
                  {customResume.education.map((edu, idx) => (
                    <div key={idx} className={activeStyle === "compact" ? "mb-1.5" : "mb-2"}>
                      <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                        <span className={activeStyle === "compact" ? "text-[11.5px]" : ""}>{edu.degree}</span>
                        {activeStyle === "modern" ? (
                          <span className="date-badge bg-slate-100 text-slate-700 text-[10.5px] font-semibold px-2 py-0.5 rounded border border-slate-200/80">
                            {edu.period || edu.year}
                          </span>
                        ) : (
                          <span className={`font-semibold text-[#4b5563] ${activeStyle === "compact" ? "text-[10.5px]" : ""}`}>
                            {edu.period || edu.year}
                          </span>
                        )}
                      </div>
                      <div className={`sub-row text-[11px] mb-0.5 ${activeStyle === "modern" ? `font-medium ${mc.subRow}` : "text-[#4b5563]"} ${activeStyle === "compact" ? "text-[10.5px]" : ""}`}>
                        {edu.institution}{edu.location ? `, ${edu.location}` : ""}
                      </div>
                      {(edu.grade || edu.details) && (
                        <p className={
                          activeStyle === "modern"
                            ? `text-[11px] leading-relaxed px-2 py-1 rounded border mt-1 ${mc.gradeBox}`
                            : activeStyle === "compact"
                            ? "text-[10px] text-[#4b5563] leading-snug"
                            : "text-[11px] text-[#4b5563] leading-relaxed"
                        }>
                          • {edu.grade || edu.details}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              );

            const renderSkillsSection = () =>
              Object.keys(customResume.skillCategories || {}).length > 0 && (
                <section className={secMarginClass} key="skills-sec">
                  <h2 className={headingBorderClass}>
                    {getSectionTitle("skills")}
                  </h2>
                  {activeStyle === "modern" ? (
                    <div className="skills-grid space-y-1.5 text-[#374151]">
                      {Object.entries(customResume.skillCategories).map(([category, items]) => (
                        <div
                          key={category}
                          className="skill-line flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5"
                        >
                          <span className={`skill-label font-bold shrink-0 border px-2 py-0.5 rounded min-w-[170px] text-[11px] ${mc.skillBadge}`}>
                            • {category}:
                          </span>
                          <span className="text-slate-700 text-xs pl-1">
                            {items}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : activeStyle === "compact" ? (
                    <div className="skills-grid space-y-0.5 text-[#374151] text-[11px]">
                      {Object.entries(customResume.skillCategories).map(([category, items]) => (
                        <div
                          key={category}
                          className="skill-line flex flex-col sm:flex-row sm:gap-1"
                        >
                          <span className="skill-label font-bold text-[#111827] min-w-[155px] shrink-0 text-[11px]">
                            • {category}:
                          </span>
                          <span className="text-[#374151] text-[11px] leading-snug">{items}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
                </section>
              );

            const renderProjectsSection = () =>
              customResume.projects?.length > 0 && (
                <section className={secMarginClass} key="proj-sec">
                  <h2 className={headingBorderClass}>
                    {getSectionTitle("projects")}
                  </h2>
                  <div className={activeStyle === "compact" ? "space-y-1.5" : "space-y-2.5"}>
                    {customResume.projects.map((project, idx) => (
                      <div key={idx} className={activeStyle === "compact" ? "mb-1.5" : "mb-2"}>
                        <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                          <span className={activeStyle === "compact" ? "text-[11.5px]" : ""}>{project.title}</span>
                          {project.tech && (
                            activeStyle === "modern" ? (
                              <span className={`tag-pill text-[11px] font-semibold border px-2 py-0.5 rounded-md text-[10.5px] ${mc.tagPill}`}>
                                {project.tech}
                              </span>
                            ) : (
                              <span className={`text-[#4b5563] font-semibold ${activeStyle === "compact" ? "text-[10px]" : "text-[11px]"}`}>
                                {project.tech}
                              </span>
                            )
                          )}
                        </div>
                        {project.bullets && project.bullets.length > 0 && (
                          <ul className={`list-disc list-outside pl-4 space-y-0.5 ${
                            activeStyle === "modern"
                              ? `text-slate-700 ${mc.bulletMarker} mt-0.5`
                              : activeStyle === "compact"
                              ? "text-[#374151] text-[10.5px] sm:text-[11px] leading-snug mt-0.5"
                              : "text-[#374151] mt-0.5"
                          }`}>
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
                <section className={secMarginClass} key="exp-sec">
                  <h2 className={headingBorderClass}>
                    {getSectionTitle("experience")}
                  </h2>
                  {customResume.experience.map((exp, idx) => (
                    <div key={idx} className={activeStyle === "compact" ? "mb-1.5" : "mb-2.5"}>
                      <div className="item-row flex flex-wrap items-center justify-between font-bold text-[#111827]">
                        <span className={activeStyle === "compact" ? "text-[11.5px]" : ""}>{exp.role}</span>
                        {activeStyle === "modern" ? (
                          <span className="date-badge bg-slate-100 text-slate-700 text-[10.5px] font-semibold px-2 py-0.5 rounded border border-slate-200/80">
                            {exp.period}
                          </span>
                        ) : (
                          <span className={`font-semibold text-[#4b5563] ${activeStyle === "compact" ? "text-[10.5px]" : ""}`}>
                            {exp.period}
                          </span>
                        )}
                      </div>
                      {exp.organization && (
                        <div className={`sub-row text-[11px] mb-1 ${activeStyle === "modern" ? `font-medium italic ${mc.subRow}` : "text-[#4b5563] italic"} ${activeStyle === "compact" ? "text-[10.5px] mb-0.5" : ""}`}>
                          {exp.organization}{exp.location ? ` — ${exp.location}` : ""}
                        </div>
                      )}
                      {exp.bullets?.length > 0 && (
                        <ul className={`list-disc list-outside pl-4 space-y-0.5 ${
                          activeStyle === "modern"
                            ? `text-slate-700 ${mc.bulletMarker}`
                            : activeStyle === "compact"
                            ? "text-[#374151] text-[10.5px] sm:text-[11px] leading-snug"
                            : "text-[#374151]"
                        }`}>
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

            if (activeCategory === "fresher") {
              return [
                renderEducationSection(),
                renderSkillsSection(),
                renderProjectsSection(),
                renderExperienceSection(),
              ];
            }

            return [
              renderSkillsSection(),
              renderExperienceSection(),
              renderProjectsSection(),
              renderEducationSection(),
            ];
          })()}
        </div>
      </div>
    )}

    </div>
  );

  // Clean AI Resume Generator Dialog mounted at top-level body portal
  const aiModalJSX = (
    <AnimatePresence>
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-jakarta">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-white dark:bg-[#131620] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] bg-gradient-to-r from-purple-50 via-indigo-50/50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-blue-950/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    AI Resume Auto-Fill
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Instantly create your resume from a short prompt, job role, or notes.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isGeneratingAi) {
                    setIsAiModalOpen(false);
                    setAiError("");
                  }
                }}
                disabled={isGeneratingAi}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* 1. Quick Starter Presets */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Quick Starter Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AI_PRESET_PROMPTS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAiPrompt(preset.prompt);
                        setAiError("");
                      }}
                      disabled={isGeneratingAi}
                      className="text-left p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all group cursor-pointer bg-white dark:bg-[#0c0e14]"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 text-xs block truncate">
                        {preset.title}
                      </span>
                      <span className="text-[10.5px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 leading-snug">
                        {preset.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Prompt Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Your Background / Target Role / Raw Notes
                  </label>
                  {aiPrompt && (
                    <button
                      type="button"
                      onClick={() => setAiPrompt("")}
                      className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  rows={5}
                  value={aiPrompt}
                  onChange={(e) => {
                    setAiPrompt(e.target.value);
                    if (aiError) setAiError("");
                  }}
                  disabled={isGeneratingAi}
                  placeholder="e.g. Senior Frontend Engineer with 4 years of React, Next.js, and TypeScript. Built high-traffic e-commerce platforms, optimized Web Vitals, and led a team of 3 developers. Graduated with CS degree in 2020."
                  className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0c0e14] focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/10 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Error Message */}
              {aiError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
                  <X size={14} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-snug">{aiError}</div>
                </div>
              )}

              {/* Success Banner */}
              {aiSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="font-semibold">✨ Resume generated successfully!</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-5 py-3.5 bg-gray-50 dark:bg-[#0c0e14] border-t border-gray-200 dark:border-white/[0.08] flex items-center justify-between transition-colors duration-200">
              <button
                type="button"
                onClick={() => {
                  setIsAiModalOpen(false);
                  setAiError("");
                }}
                disabled={isGeneratingAi}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer ${
                  isGeneratingAi || !aiPrompt.trim()
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-75"
                    : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-white" />
                    <span>Generating Resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="text-amber-300" />
                    <span>Generate Resume</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // If standalone mode, render directly in DOM tree + portal for AI modal
  if (standalone) {
    return (
      <>
        {contentJSX}
        {typeof document !== "undefined" && createPortal(aiModalJSX, document.body)}
      </>
    );
  }

  // If modal mode, render inside portal with backdrop
  const modalJSX = (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-auto font-jakarta selection:bg-gray-900 selection:text-white isolate">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm transform-gpu cursor-pointer touch-manipulation select-none"
              style={{
                WebkitBackdropFilter: "blur(8px)",
                WebkitTransform: "translate3d(0,0,0)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="w-full flex items-center justify-center"
            >
              {contentJSX}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {typeof document !== "undefined" && createPortal(aiModalJSX, document.body)}
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(modalJSX, document.body)
    : null;
}
