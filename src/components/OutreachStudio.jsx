import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  Copy,
  Check,
  Send,
  Building2,
  Briefcase,
  User,
  Loader2,
  Eye,
  Edit3,
  ChevronDown,
  Layers,
  Eraser,
  RotateCcw,
} from "lucide-react";
import { generateOutreachWithAI, OUTREACH_PRESETS } from "../services/aiOutreach";

const DEFAULT_OUTREACH_CAMPAIGN = {
  subjectLines: [
    "Quick idea for Linear's frontend systems — Alex",
    "Building high-performance UI at Linear — Alex Morgan",
    "Frontend Systems Engineer — Alex Morgan intro",
  ],
  coldEmail: `Hi Karri,\n\nI’ve been following Linear’s obsession with craft and micro-interaction fluidity—it’s the gold standard for developer tooling.\n\nOver the past 4+ years, I’ve specialized in building 60fps web applications in React and TypeScript. In my last role, I optimized database latency by 45% and architected design systems used by thousands of daily active users.\n\nI’d love to contribute to Linear’s frontend systems team. Are you open to a brief 10-minute chat this week?\n\nBest,\nAlex Morgan`,
  linkedinDm: "Hi Karri — love Linear's bar for visual craft and 60fps UI. I'm a full-stack frontend engineer with 4+ years scaling React/TypeScript systems. Would love to share how I can contribute to the engineering team!",
  coverLetter: `Dear Karri and the Linear Team,\n\nI am writing to express my strong interest in the Frontend Systems Engineer role at Linear. Having built and maintained high-performance web applications throughout my career, I deeply admire Linear’s uncompromising dedication to speed, keyboard-first workflows, and visual excellence.\n\nIn my previous engineering experience, I architected component design systems and real-time state synchronization engines in React, TypeScript, and Node.js. My work focused on sub-50ms interaction latencies, zero-jank animations, and robust PostgreSQL/Redis backend architectures that scaled seamlessly under high user concurrency.\n\nI am eager to bring my passion for developer experience, systems design, and craft to Linear. I welcome the opportunity to discuss how my background aligns with your engineering goals.\n\nSincerely,\nAlex Morgan`,
  followUp: `Hi Karri,\n\nFollowing up briefly on my note from earlier this week regarding the Frontend Systems role at Linear. I’d love to connect if you’re exploring candidates with deep React, TypeScript, and UI performance experience.\n\nBest,\nAlex Morgan`,
};

const DEFAULT_FORM_DATA = {
  company: "Linear",
  role: "Full-Stack Systems Engineer",
  recipient: "Karri Saarinen",
  recipientEmail: "karri@linear.app",
  targetType: "founder",
  tone: "punchy",
  jd: "Seeking an engineer with strong frontend craft, robust backend systems experience with Node.js/PostgreSQL, and a passion for high-performance developer tools.",
  userBackground: "4+ years building high-concurrency web apps. Optimized database queries reducing P99 latency by 45%. Expert in React, TypeScript, Node.js, and modern cloud architecture.",
  senderName: "Alex Morgan",
};

export default function OutreachStudio() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem("workstation_outreach_form");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_FORM_DATA;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("workstation_outreach_tab") || "coldEmail";
  });
  const [viewMode, setViewMode] = useState("edit"); // 'edit' | 'preview' - default to edit screen on open
  const [customSubject, setCustomSubject] = useState(() => {
    return localStorage.getItem("workstation_outreach_subject") || DEFAULT_OUTREACH_CAMPAIGN.subjectLines[0];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [outputData, setOutputData] = useState(() => {
    try {
      const saved = localStorage.getItem("workstation_outreach_output");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_OUTREACH_CAMPAIGN;
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const presetMenuRef = useRef(null);

  // Save session state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("workstation_outreach_form", JSON.stringify(formData));
    } catch (e) {}
  }, [formData]);

  useEffect(() => {
    try {
      localStorage.setItem("workstation_outreach_output", JSON.stringify(outputData));
    } catch (e) {}
  }, [outputData]);

  useEffect(() => {
    localStorage.setItem("workstation_outreach_subject", customSubject);
  }, [customSubject]);

  useEffect(() => {
    localStorage.setItem("workstation_outreach_tab", activeTab);
  }, [activeTab]);

  // Close preset dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (presetMenuRef.current && !presetMenuRef.current.contains(e.target)) {
        setIsPresetMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setErrorMessage("");
    try {
      const res = await generateOutreachWithAI(formData);
      setOutputData(res);
      if (res?.subjectLines?.[0]) {
        setCustomSubject(res.subjectLines[0]);
      }
      setViewMode("preview");
    } catch (err) {
      console.error("Error generating outreach:", err);
      setErrorMessage(err.message || "Unable to generate campaign right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearToScratch = () => {
    const emptyForm = {
      company: "",
      role: "",
      recipient: "",
      recipientEmail: "",
      targetType: "founder",
      tone: "punchy",
      jd: "",
      userBackground: "",
      senderName: "",
    };
    const emptyOutput = {
      subjectLines: [],
      coldEmail: "",
      linkedinDm: "",
      coverLetter: "",
      followUp: "",
    };
    setFormData(emptyForm);
    setOutputData(emptyOutput);
    setCustomSubject("");
    setErrorMessage("");
    try {
      localStorage.removeItem("workstation_outreach_form");
      localStorage.removeItem("workstation_outreach_output");
      localStorage.removeItem("workstation_outreach_subject");
    } catch (e) {}
  };

  const handleResetToDefault = () => {
    setFormData(DEFAULT_FORM_DATA);
    setOutputData(DEFAULT_OUTREACH_CAMPAIGN);
    setCustomSubject(DEFAULT_OUTREACH_CAMPAIGN.subjectLines[0]);
    setErrorMessage("");
    try {
      localStorage.setItem("workstation_outreach_form", JSON.stringify(DEFAULT_FORM_DATA));
      localStorage.setItem("workstation_outreach_output", JSON.stringify(DEFAULT_OUTREACH_CAMPAIGN));
      localStorage.setItem("workstation_outreach_subject", DEFAULT_OUTREACH_CAMPAIGN.subjectLines[0]);
    } catch (e) {}
  };

  const handleApplyPreset = (preset) => {
    const updated = {
      company: preset.company,
      role: preset.role,
      recipient: preset.recipient,
      recipientEmail: preset.recipientEmail || "",
      targetType: preset.targetType,
      tone: preset.tone,
      jd: preset.jd,
      userBackground: preset.userBackground,
      senderName: formData.senderName || "Alex Morgan",
    };
    setFormData(updated);
    setErrorMessage("");
    try {
      localStorage.setItem("workstation_outreach_form", JSON.stringify(updated));
    } catch (e) {}
    setIsPresetMenuOpen(false);
    setViewMode("edit");
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  // Construct mailto link with the user's active subject and body
  const activeSubject = customSubject || `${formData.role} @ ${formData.company} — ${formData.senderName}`;
  const mailSubject = activeTab === "followUp" ? `Re: ${activeSubject}` : activeSubject;
  const mailBody = activeTab === "followUp" ? (outputData?.followUp || "") : (outputData?.coldEmail || "");

  const mailtoLink = mailBody
    ? `mailto:${encodeURIComponent(formData.recipientEmail)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`
    : "#";

  const tabs = [
    { id: "coldEmail", label: "Cold Email", icon: Mail },
    { id: "linkedinDm", label: "LinkedIn DM", icon: MessageSquare },
    { id: "coverLetter", label: "Cover Letter", icon: FileText },
    { id: "followUp", label: "Follow-Up", icon: Clock },
  ];

  return (
    <div className="relative w-full max-w-4xl h-[680px] sm:h-[720px] max-h-[88dvh] mx-auto my-auto flex flex-col rounded-2xl sm:rounded-3xl bg-white border border-gray-200 overflow-hidden z-10 font-jakarta shadow-2xl selection:bg-black selection:text-white transform-gpu">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-2.5 sm:px-5 py-2 sm:py-3 border-b border-gray-200 bg-white shrink-0 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <Send size={13} />
          </div>

          {/* Desktop Title & Branding */}
          <div className="hidden md:flex items-center gap-2 font-jakarta">
            <span className="text-xs font-bold text-gray-900 tracking-wide">
              AI Outreach Studio
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-[11px] text-gray-500 font-medium">
              Emails, Cover Letters & DMs
            </span>
          </div>

          {/* Mobile View Toggle (Inputs vs Output) */}
          <div className="flex md:hidden items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                viewMode === "edit"
                  ? "bg-white text-gray-900 font-semibold shadow-xs"
                  : "text-gray-500 hover:text-gray-900 font-medium"
              }`}
              title="Edit Inputs"
              aria-label="Edit Inputs"
            >
              <Edit3 size={13} className="shrink-0" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                viewMode === "preview"
                  ? "bg-white text-gray-900 font-semibold shadow-xs"
                  : "text-gray-500 hover:text-gray-900 font-medium"
              }`}
              title="View Campaign"
              aria-label="View Campaign"
            >
              <Eye size={13} className="shrink-0" />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Custom Preset Selector Dropdown (Hidden in mobile View mode since templates are for Edit form) */}
          <div className={`relative ${viewMode === "preview" ? "hidden md:block" : "block"}`} ref={presetMenuRef}>
            <button
              type="button"
              onClick={() => setIsPresetMenuOpen(!isPresetMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200/70 border border-gray-200 text-xs font-semibold text-gray-800 transition-all cursor-pointer select-none shrink-0"
            >
              <Layers size={13} className="text-gray-600 shrink-0" />
              <span>Presets</span>
              <ChevronDown
                size={12}
                className={`text-gray-500 transition-transform duration-200 ${
                  isPresetMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Floating Dropdown Menu */}
            <AnimatePresence>
              {isPresetMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-64 sm:w-68 max-w-[88vw] p-1.5 rounded-xl bg-white border border-gray-200 shadow-xl z-50 space-y-1 font-jakarta origin-top-right"
                >
                  <div className="px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-gray-500 font-jakarta">
                    Starter Templates
                  </div>
                  {OUTREACH_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        handleApplyPreset(p);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex flex-col gap-0.5 cursor-pointer group"
                    >
                      <span className="text-xs font-semibold text-gray-900 group-hover:text-black">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">
                        {p.role} • {p.company}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Reset Action Button */}
          <button
            type="button"
            onClick={handleResetToDefault}
            className="hidden sm:flex p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200/70 text-gray-500 hover:text-gray-900 border border-gray-200 transition-colors cursor-pointer items-center justify-center shrink-0"
            title="Reset to default template"
            aria-label="Reset to default template"
          >
            <RotateCcw size={14} />
          </button>

          {/* Quick Clear to Scratch Action Button */}
          <button
            type="button"
            onClick={handleClearToScratch}
            className="hidden sm:flex p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200/70 text-gray-500 hover:text-red-600 border border-gray-200 transition-colors cursor-pointer items-center justify-center shrink-0"
            title="Clear form to scratch"
            aria-label="Clear form to scratch"
          >
            <Eraser size={14} />
          </button>
        </div>
      </div>

      {/* 2. Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Settings (Shown on Desktop, or when viewMode === 'edit' on mobile) */}
        <div
          className={`w-full md:w-[320px] lg:w-[350px] border-r border-gray-200 bg-gray-50/50 flex flex-col shrink-0 overflow-y-auto ${
            viewMode === "preview" ? "hidden md:flex" : "flex"
          }`}
        >
          <form onSubmit={handleGenerate} className="p-3.5 sm:p-4 space-y-3.5 text-xs">
            {/* Mobile Form Utility Header */}
            <div className="flex sm:hidden items-center justify-between pb-2.5 border-b border-gray-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                Campaign Inputs
              </span>
              <div className="flex items-center gap-2.5 text-[11px]">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-900 cursor-pointer font-medium"
                  title="Reset to default template"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={handleClearToScratch}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 cursor-pointer font-medium"
                  title="Clear form to scratch"
                >
                  <Eraser size={11} />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Target Role & Company */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Company
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Stripe, Linear"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-xs text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-xs text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  placeholder="e.g. Alex"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 focus:border-gray-900 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  placeholder="alex@co.com"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 focus:border-gray-900 text-xs text-gray-900"
                />
              </div>
            </div>

            {/* Tone & Target Selectors */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recipient Type
                </label>
                <select
                  value={formData.targetType}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                  className="w-full p-1.5 rounded-lg bg-white border border-gray-200 focus:border-gray-900 text-xs font-medium text-gray-800"
                >
                  <option value="founder">Founder / CEO</option>
                  <option value="eng_lead">Eng Lead / VP</option>
                  <option value="recruiter">Recruiter / HR</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full p-1.5 rounded-lg bg-white border border-gray-200 focus:border-gray-900 text-xs font-medium text-gray-800"
                >
                  <option value="punchy">Direct / Punchy</option>
                  <option value="startup">Product / Startup</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
            </div>

            {/* Job Description Excerpt */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Job Requirements / JD Excerpt
              </label>
              <textarea
                rows={4}
                value={formData.jd}
                onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
                placeholder="Paste key responsibilities or tech stack from the job post..."
                className="w-full min-h-[68px] p-2 rounded-lg bg-white border border-gray-200 focus:border-gray-900 text-xs text-gray-900 placeholder:text-gray-400 resize-none leading-relaxed"
              />
            </div>

            {/* Your Background Highlights */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Background Highlights
              </label>
              <textarea
                rows={4}
                value={formData.userBackground}
                onChange={(e) => setFormData({ ...formData, userBackground: e.target.value })}
                placeholder="Top achievements, key metrics, or relevant skills..."
                className="w-full min-h-[68px] p-2 rounded-lg bg-white border border-gray-200 focus:border-gray-900 text-xs text-gray-900 placeholder:text-gray-400 resize-none leading-relaxed"
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="font-bold underline hover:text-red-900 ml-2 cursor-pointer shrink-0"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Primary Action CTA Button */}
            <button
              type="submit"
              disabled={isGenerating || !formData.company.trim() || !formData.role.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-black active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 disabled:active:scale-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={13} className="animate-spin text-white" />
                  <span>Generating Campaign...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-amber-300 animate-pulse" />
                  <span>Generate Outreach Campaign</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output Paper View (Shown on Desktop, or when viewMode === 'preview' on mobile) */}
        <div
          className={`flex-1 bg-white flex flex-col justify-between overflow-hidden ${
            viewMode === "edit" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Format Switcher Tabs */}
          <div className="border-b border-gray-200 px-2.5 sm:px-6 py-2 bg-white flex items-center justify-between gap-1.5 shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full pb-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 border border-gray-200 shadow-2xs"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Content Canvas */}
          <div className="flex-1 p-3 sm:p-5 flex flex-col min-h-0 overflow-hidden space-y-3 bg-gray-50/40">
            {/* Subject Line Bar for Cold Email */}
            {activeTab === "coldEmail" && (
              <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-2 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-700 font-jakarta">
                    <Mail size={12} className="text-gray-500" />
                    <span>Subject Line</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(customSubject, "subject")}
                    className="text-[10.5px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer font-jakarta"
                  >
                    {copiedKey === "subject" ? (
                      <span className="text-emerald-600 font-bold">Copied Subject!</span>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Email subject line..."
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white text-xs font-medium text-gray-900 font-jakarta transition-all"
                />

                {/* AI Subject Angles */}
                {outputData?.subjectLines && outputData.subjectLines.length > 0 && (
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-gray-600">
                      <Sparkles size={11} className="text-amber-500 shrink-0" />
                      <span>AI Subject Variations:</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {outputData.subjectLines.map((subj, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCustomSubject(subj)}
                          className={`text-[10.5px] px-2.5 py-1 rounded-md border transition-all cursor-pointer truncate max-w-full ${
                            customSubject === subj
                              ? "bg-gray-900 text-white border-gray-900 font-semibold shadow-2xs"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                          title={`Select: "${subj}"`}
                        >
                          {subj}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Document Text Editor */}
            <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-700 font-jakarta">
                  {activeTab === "coldEmail" && <FileText size={12} className="text-gray-500" />}
                  {activeTab === "linkedinDm" && <MessageSquare size={12} className="text-gray-500" />}
                  {activeTab === "coverLetter" && <FileText size={12} className="text-gray-500" />}
                  {activeTab === "followUp" && <Clock size={12} className="text-gray-500" />}
                  <span>
                    {activeTab === "coldEmail"
                      ? "Email Body"
                      : activeTab === "linkedinDm"
                      ? "Direct Message Body"
                      : activeTab === "coverLetter"
                      ? "Cover Letter Body"
                      : "Follow-Up Message Body"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] text-gray-400 font-medium font-jakarta">
                    Editable Text
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col">
                {activeTab === "coldEmail" && (
                  <textarea
                    value={outputData?.coldEmail || ""}
                    onChange={(e) => setOutputData({ ...outputData, coldEmail: e.target.value })}
                    placeholder="Your generated cold email will appear here..."
                    className="w-full flex-1 min-h-0 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-[13px] text-gray-900 font-jakarta leading-relaxed resize-none selection:bg-black selection:text-white"
                  />
                )}

                {activeTab === "linkedinDm" && (
                  <textarea
                    value={outputData?.linkedinDm || ""}
                    onChange={(e) => setOutputData({ ...outputData, linkedinDm: e.target.value })}
                    placeholder="Your LinkedIn direct message will appear here..."
                    className="w-full flex-1 min-h-0 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-[13px] text-gray-900 font-jakarta leading-relaxed resize-none selection:bg-black selection:text-white"
                  />
                )}

                {activeTab === "coverLetter" && (
                  <textarea
                    value={outputData?.coverLetter || ""}
                    onChange={(e) => setOutputData({ ...outputData, coverLetter: e.target.value })}
                    placeholder="Your formal cover letter will appear here..."
                    className="w-full flex-1 min-h-0 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-[13px] text-gray-900 font-jakarta leading-relaxed resize-none selection:bg-black selection:text-white overflow-y-auto"
                  />
                )}

                {activeTab === "followUp" && (
                  <textarea
                    value={outputData?.followUp || ""}
                    onChange={(e) => setOutputData({ ...outputData, followUp: e.target.value })}
                    placeholder="Your polite follow-up nudge will appear here..."
                    className="w-full flex-1 min-h-0 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-[13px] text-gray-900 font-jakarta leading-relaxed resize-none selection:bg-black selection:text-white"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="px-3 sm:px-6 py-2.5 sm:py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-2 shrink-0">
            <div className="text-[11.5px] text-gray-500 font-medium font-jakarta flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                {activeTab === "coldEmail"
                  ? `${outputData?.coldEmail ? outputData.coldEmail.split(/\s+/).filter(Boolean).length : 0} words`
                  : activeTab === "linkedinDm"
                  ? `${outputData?.linkedinDm ? outputData.linkedinDm.split(/\s+/).filter(Boolean).length : 0} words`
                  : activeTab === "coverLetter"
                  ? `${outputData?.coverLetter ? outputData.coverLetter.split(/\s+/).filter(Boolean).length : 0} words`
                  : `${outputData?.followUp ? outputData.followUp.split(/\s+/).filter(Boolean).length : 0} words`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  const textToCopy =
                    activeTab === "coldEmail"
                      ? `Subject: ${activeSubject}\n\n${outputData?.coldEmail}`
                      : activeTab === "linkedinDm"
                      ? outputData?.linkedinDm
                      : activeTab === "coverLetter"
                      ? outputData?.coverLetter
                      : outputData?.followUp;
                  copyToClipboard(textToCopy, activeTab);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:border-gray-400 text-xs font-semibold text-gray-800 shadow-2xs transition-all cursor-pointer shrink-0"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {(activeTab === "coldEmail" || activeTab === "followUp") && (
                <a
                  href={mailtoLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-xs font-semibold text-white shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  <Send size={13} />
                  <span>Mail</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
