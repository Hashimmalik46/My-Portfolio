import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  ExternalLink,
  Copy,
  Check,
  Code2,
  FolderGit2,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";
import { portfolioData } from "../data/portfolioData";
import { askHashimAI } from "../data/hashimAI";
import ThemeToggle from "./ThemeToggle";

/**
 * Clean Light Glass AI Chatbot Component
 * Fully configured and editable via portfolioData.js
 */
export default function HeroChatbot() {
  const { chatbot } = portfolioData;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [isChatbotDark, setIsChatbotDark] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio_chatbot_theme");
      if (saved !== null) return saved === "dark";
    } catch (e) {}
    return false; // Independent default theme for chatbot
  });

  const toggleChatbotTheme = () => {
    setIsChatbotDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("portfolio_chatbot_theme", next ? "dark" : "light");
      } catch (e) {}
      return next;
    });
  };
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: chatbot.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const latestMessageRef = useRef(null);

  // Smart auto-scroll: show top of bot responses so users read from the beginning
  useEffect(() => {
    if (!isOpen) return;

    const lastMsg = messages[messages.length - 1];

    if (isTyping) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (lastMsg?.sender === "bot" && messages.length > 1) {
      latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Lock background body scroll and pause Lenis smooth scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      window.lenis?.stop();
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = "hidden";

      return () => {
        window.lenis?.start();
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close, Cmd+K / Ctrl+K to toggle)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = useCallback(
    async (queryText) => {
      const textToSend = queryText || inputValue.trim();
      if (!textToSend || isTyping) return;

      const userMsg = {
        id: Date.now().toString(),
        sender: "user",
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      if (!isOpen) {
        setIsOpen(true);
      }

      try {
        const response = await askHashimAI(textToSend, messages);
        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "I encountered an error retrieving that info. Please try asking again!",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, isOpen, messages]
  );

  // Global custom event listener to open chatbot from anywhere (e.g. Navbar Tools menu)
  useEffect(() => {
    const handleOpenEvent = (e) => {
      setIsOpen(true);
      if (e.detail?.prompt) {
        handleSendMessage(e.detail.prompt);
      }
    };
    window.addEventListener("open-chatbot", handleOpenEvent);
    return () => window.removeEventListener("open-chatbot", handleOpenEvent);
  }, [handleSendMessage]);

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: chatbot.clearMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleCopyText = (text, id) => {
    const plainText = text.replace(/[*#_[\]()]/g, "");
    navigator.clipboard.writeText(plainText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatInlineText = (text) => {
    const parts = [];
    let lastIdx = 0;
    const combinedRegex =
      /(\[([^\]]+)\]\((https?:\/\/[^)]+|mailto:[^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }

      if (match[1]) {
        const linkText = match[2];
        const linkUrl = match[3];
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target={linkUrl.startsWith("mailto:") ? "_self" : "_blank"}
            rel="noreferrer"
            className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 ml-0.5 mr-0.5"
          >
            {linkText}
            {!linkUrl.startsWith("mailto:") && <ExternalLink size={10} />}
          </a>
        );
      } else if (match[4]) {
        parts.push(
          <strong key={match.index} className="text-zinc-950 dark:text-white font-bold">
            {match[5]}
          </strong>
        );
      } else if (match[6]) {
        parts.push(
          <em key={match.index} className="text-zinc-800 dark:text-gray-300 italic font-medium">
            {match[7]}
          </em>
        );
      } else if (match[8]) {
        parts.push(
          <code
            key={match.index}
            className="bg-black/10 dark:bg-white/10 text-zinc-950 dark:text-white font-mono font-semibold text-[11px] px-1.5 py-0.5 rounded border border-black/15 dark:border-white/15 mx-0.5"
          >
            {match[9]}
          </code>
        );
      }

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderMessageContent = (content) => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();

      // Empty line spacing
      if (!trimmed) {
        return <div key={lineIdx} className="h-1.5" />;
      }

      // Headers (#, ##, ###)
      if (trimmed.startsWith("### ")) {
        return (
          <h4
            key={lineIdx}
            className="text-xs sm:text-[13px] font-bold text-zinc-950 dark:text-white mt-2.5 mb-1 text-left flex items-center gap-1.5"
          >
            {formatInlineText(trimmed.replace(/^###\s+/, ""))}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3
            key={lineIdx}
            className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white mt-3 mb-1.5 text-left flex items-center gap-1.5"
          >
            {formatInlineText(trimmed.replace(/^##\s+/, ""))}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2
            key={lineIdx}
            className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white mt-3 mb-1.5 text-left flex items-center gap-1.5"
          >
            {formatInlineText(trimmed.replace(/^#\s+/, ""))}
          </h2>
        );
      }

      // Bullet points (- or * or •)
      const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
      if (bulletMatch) {
        return (
          <div
            key={lineIdx}
            className="flex items-start gap-2 text-left pl-1 my-0.5 leading-relaxed"
          >
            <span className="text-zinc-900 dark:text-gray-200 font-bold text-xs mt-0.5 shrink-0 select-none">•</span>
            <div className="flex-1 text-left text-zinc-900 dark:text-gray-200 font-medium">
              {formatInlineText(bulletMatch[1])}
            </div>
          </div>
        );
      }

      // Numbered lists (1. 2. etc)
      const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numberMatch) {
        return (
          <div
            key={lineIdx}
            className="flex items-start gap-2 text-left pl-1 my-0.5 leading-relaxed"
          >
            <span className="text-zinc-900 dark:text-gray-200 font-bold text-[11px] mt-0.5 shrink-0 select-none">
              {numberMatch[1]}.
            </span>
            <div className="flex-1 text-left text-zinc-900 dark:text-gray-200 font-medium">
              {formatInlineText(numberMatch[2])}
            </div>
          </div>
        );
      }

      // Regular text line
      return (
        <p key={lineIdx} className="text-left leading-relaxed text-zinc-900 dark:text-gray-200 font-medium my-0.5">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const handleChipClick = (query) => {
    setIsOpen(true);
    setTimeout(() => {
      handleSendMessage(query);
    }, 150);
  };

  const isInitialState = messages.length <= 1;
  const pillsRef = useRef(null);

  const handlePillsWheel = (e) => {
    if (!pillsRef.current || e.deltaY === 0) return;
    pillsRef.current.scrollLeft += e.deltaY * 1.1;
  };

  return (
    <>
      {/* 1. INTERACTIVE SEARCH BAR & PROMPT CHIPS (ALL SCREENS - CENTERED) */}
      <div className="w-full max-w-[280px] sm:max-w-[300px] mx-auto flex flex-col items-center gap-2 select-none font-jakarta">
        {/* Main Search Pill (Reverted back to clean dark glass) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full bg-[#141520]/80 hover:bg-[#1a1c2a]/90 border border-white/20 hover:border-white/35 backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              <Sparkles size={11} className="text-white animate-pulse" />
            </div>
            <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors truncate">
              {`Ask ${chatbot.botName || "HashAI"}...`}
            </span>
          </div>
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-white/20 transition-all shrink-0">
            <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </motion.div>

        {/* Quick-Tap Prompt Chips (Desktop-Only, hidden on phones & tablets) */}
        <div className="hidden xl:flex items-center justify-center gap-1.5 w-full flex-wrap">
          {(chatbot.starterPrompts && chatbot.starterPrompts.length > 0
            ? chatbot.starterPrompts.slice(0, 3)
            : [
                {
                  title: "Projects",
                  icon: FolderGit2,
                  query: "What projects have you built?",
                },
                {
                  title: "Skills",
                  icon: Code2,
                  query: "What is your tech stack and expertise?",
                },
                {
                  title: "Experience",
                  icon: Briefcase,
                  query: "Tell me about your background and experience",
                },
              ]
          ).map((chip, idx) => {
            const IconComp = chip.icon || Sparkles;
            return (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleChipClick(chip.query)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:bg-white/[0.22] border border-white/15 hover:border-white/30 backdrop-blur-xl text-[11px] font-medium text-white/75 hover:text-white transition-all shadow-sm cursor-pointer whitespace-nowrap group"
              >
                <IconComp size={11} className="text-white/90 group-hover:text-white group-hover:scale-110 transition-transform shrink-0" />
                <span>{chip.title || chip.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. C1 WARM IVORY MODAL (PORTALED TO DOCUMENT.BODY) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 pointer-events-auto font-jakarta">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-0 bg-black/65 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className={`relative w-full max-w-lg h-[82dvh] sm:h-[540px] max-h-[88dvh] sm:max-h-[85dvh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#f8f7f3] dark:bg-[#11131b] border border-black/15 dark:border-white/10 overflow-hidden z-10 font-jakarta shadow-[0_25px_70px_rgba(0,0,0,0.55)] ${
                    isChatbotDark ? "dark-scope" : "light-scope"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-black/10 dark:border-white/10 bg-[#f8f7f3] dark:bg-[#11131b] shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-secondary dark:bg-white text-white dark:text-black flex items-center justify-center shadow-sm shrink-0">
                        <Bot size={15} />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white tracking-wide">
                          {chatbot.botName}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] border border-black/10 dark:border-white/15 text-[10px] font-semibold text-zinc-700 dark:text-gray-300 select-none">
                          <Sparkles size={9} className="text-zinc-600 dark:text-amber-300" />
                          Portfolio Assistant
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <ThemeToggle isDark={isChatbotDark} onToggle={toggleChatbotTheme} size="sm" />
                      <button
                        type="button"
                        onClick={handleClearChat}
                        title="Reset Conversation"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        title="Close (Esc)"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div
                    data-lenis-prevent="true"
                    className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs sm:text-[13px] bg-[#f8f7f3] dark:bg-[#0c0e14]"
                  >
                    {messages.map((msg, idx) => {
                      const isBot = msg.sender === "bot";
                      const isLatest = idx === messages.length - 1;
                      return (
                        <div
                          key={msg.id}
                          ref={isLatest ? latestMessageRef : null}
                          className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                        >
                          {isBot ? (
                            <div className="flex items-start gap-2.5 max-w-[95%]">
                              <div className="w-6 h-6 rounded-md bg-secondary dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <Bot size={13} />
                              </div>
                              <div className="flex-1 bg-white dark:bg-[#161922] border border-black/10 dark:border-white/10 rounded-2xl rounded-tl-sm p-3.5 sm:p-4 text-zinc-900 dark:text-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
                                <div className="space-y-1 text-left">
                                  {renderMessageContent(msg.text)}
                                </div>
                                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 text-[10px] text-zinc-500 dark:text-gray-400 font-medium">
                                  <span>{msg.timestamp}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyText(msg.text, msg.id)}
                                    className="flex items-center gap-1 text-zinc-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold transition-colors cursor-pointer"
                                  >
                                    {copiedId === msg.id ? (
                                      <>
                                        <Check size={11} className="text-emerald-700 dark:text-emerald-400" />
                                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={11} />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="max-w-[85%] bg-white dark:bg-white text-zinc-950 dark:text-zinc-950 border border-black/10 dark:border-white/20 rounded-2xl rounded-tr-xs px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-medium text-left">
                              <p className="leading-relaxed text-left text-zinc-950 dark:text-zinc-950 font-medium">{msg.text}</p>
                              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block text-right mt-1 font-medium">
                                {msg.timestamp}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Horizontal Smooth-Scroll Carousel (Only on initial state) */}
                    {isInitialState && (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between px-1 text-[11px] font-bold text-zinc-800 dark:text-gray-200 tracking-wide">
                          <div className="flex items-center gap-1.5">
                            <Sparkles size={11} className="text-zinc-900 dark:text-amber-300" />
                            <span className="font-bold text-zinc-900 dark:text-white">Suggested Topics</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 dark:text-gray-400 font-medium select-none">Scroll / swipe →</span>
                        </div>

                        {/* Carousel Scroll Track with wheel horizontal scroll support */}
                        <div className="relative -mx-1">
                          <div
                            ref={pillsRef}
                            onWheel={handlePillsWheel}
                            data-lenis-prevent="true"
                            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1 snap-x snap-mandatory"
                          >
                            {chatbot.starterPrompts.map((prompt, idx) => {
                              const Icon = prompt.icon;
                              return (
                                <motion.button
                                  key={idx}
                                  type="button"
                                  whileHover={{ y: -1.5, scale: 1.02 }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => handleSendMessage(prompt.query)}
                                  className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#161922] hover:bg-secondary dark:hover:bg-pAccent hover:text-white dark:hover:text-black border border-black/15 dark:border-white/10 transition-all duration-200 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] shrink-0 select-none text-left snap-start"
                                >
                                  {/* Icon badge */}
                                  <div className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-zinc-800 dark:text-gray-200 group-hover:bg-white/20 group-hover:text-white dark:group-hover:text-black transition-all shrink-0">
                                    <Icon size={11} />
                                  </div>

                                  {/* Label */}
                                  <span className="text-xs font-semibold text-zinc-900 dark:text-gray-200 group-hover:text-white dark:group-hover:text-black transition-colors whitespace-nowrap">
                                    {prompt.title}
                                  </span>

                                  {/* Mini arrow */}
                                  <ArrowUpRight
                                    size={12}
                                    className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                                  />
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-start gap-2.5 max-w-[95%]">
                        <div className="w-6 h-6 rounded-md bg-secondary dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 mt-0.5">
                          <Bot size={13} />
                        </div>
                        <div className="bg-white dark:bg-[#161922] border border-black/10 dark:border-white/10 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1 text-zinc-600 dark:text-gray-300 text-xs shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-gray-300 animate-bounce" />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-gray-300 animate-bounce"
                            style={{ animationDelay: "0.15s" }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-gray-300 animate-bounce"
                            style={{ animationDelay: "0.3s" }}
                          />
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Clean Input Area */}
                  <div className="p-3 sm:p-3.5 border-t border-black/10 dark:border-white/10 bg-[#f8f7f3] dark:bg-[#11131b] shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="relative flex items-center w-full"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={chatbot.inputPlaceholder}
                        className="w-full bg-white dark:bg-[#161922] hover:bg-white dark:hover:bg-[#161922] focus:bg-white dark:focus:bg-[#161922] text-zinc-950 dark:text-white placeholder-zinc-500 dark:placeholder-gray-500 font-medium text-[16px] sm:text-xs md:text-[13px] rounded-full pl-4 pr-11 py-2.5 sm:py-3 border border-black/15 dark:border-white/10 focus:border-zinc-950 dark:focus:border-white/30 focus:shadow-[0_0_0_2px_rgba(17,24,39,0.1)] focus:outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:bg-zinc-300 dark:disabled:bg-gray-800 disabled:text-zinc-500 dark:disabled:text-gray-600 flex items-center justify-center transition-all cursor-pointer shrink-0 z-10 shadow-sm font-semibold"
                      >
                        <Send size={12} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
