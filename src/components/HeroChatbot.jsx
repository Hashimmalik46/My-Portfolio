import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  MessageSquareText,
  ExternalLink,
  Copy,
  Check,
  Code2,
  FolderGit2,
  BrainCircuit,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { portfolioData } from "../data/portfolioData";
import { askHashimAI } from "../data/hashimAI";

/**
 * Clean Light Glass AI Chatbot Component
 * Fully configured and editable via portfolioData.js
 */
export default function HeroChatbot() {
  const { chatbot } = portfolioData;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [copiedId, setCopiedId] = useState(null);
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

  const handleSendMessage = async (queryText) => {
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
      const response = await askHashimAI(textToSend);
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
  };

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
    const plainText = text.replace(/[*#_\[\]\(\)]/g, "");
    navigator.clipboard.writeText(plainText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatInlineText = (text) => {
    const parts = [];
    let lastIdx = 0;
    const combinedRegex =
      /(\[([^\]]+)\]\((https?:\/\/[^\)]+|mailto:[^\)]+)\))|(\*\*([^\*]+)\*\*)|(\*([^\*]+)\*)|(`([^`]+)`)/g;
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
            className="text-pAccent hover:underline inline-flex items-center gap-0.5 font-medium ml-0.5 mr-0.5"
          >
            {linkText}
            {!linkUrl.startsWith("mailto:") && <ExternalLink size={10} />}
          </a>
        );
      } else if (match[4]) {
        parts.push(
          <strong key={match.index} className="text-white font-semibold">
            {match[5]}
          </strong>
        );
      } else if (match[6]) {
        parts.push(
          <em key={match.index} className="text-white/85 italic">
            {match[7]}
          </em>
        );
      } else if (match[8]) {
        parts.push(
          <code
            key={match.index}
            className="bg-white/15 text-white font-mono text-[11px] px-1.5 py-0.5 rounded border border-white/20 mx-0.5"
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
            className="text-xs sm:text-[13px] font-bold text-white mt-2.5 mb-1 text-left flex items-center gap-1.5"
          >
            {formatInlineText(trimmed.replace(/^###\s+/, ""))}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3
            key={lineIdx}
            className="text-xs sm:text-sm font-bold text-white mt-3 mb-1.5 text-left flex items-center gap-1.5"
          >
            {formatInlineText(trimmed.replace(/^##\s+/, ""))}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2
            key={lineIdx}
            className="text-sm sm:text-base font-bold text-white mt-3 mb-1.5 text-left flex items-center gap-1.5"
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
            <span className="text-pAccent font-bold text-xs mt-0.5 shrink-0 select-none">•</span>
            <div className="flex-1 text-left text-white/90">
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
            <span className="text-pAccent font-semibold text-[11px] mt-0.5 shrink-0 select-none">
              {numberMatch[1]}.
            </span>
            <div className="flex-1 text-left text-white/90">
              {formatInlineText(numberMatch[2])}
            </div>
          </div>
        );
      }

      // Regular text line
      return (
        <p key={lineIdx} className="text-left leading-relaxed text-white/90 my-0.5">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const isInitialState = messages.length <= 1;

  return (
    <>
      {/* 1. FLOATING CHAT BUTTON & SPEECH BUBBLE (BOTTOM RIGHT) */}
      <div className="absolute bottom-16 sm:bottom-20 xl:bottom-18 right-6 sm:right-8 xl:right-16 z-30 flex items-center gap-2.5 sm:gap-3 pointer-events-auto select-none">
        {/* Floating Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -4, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.8 },
            x: { duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          onClick={() => setIsOpen(true)}
          className="hidden sm:flex items-center gap-1.5 bg-white/[0.12] hover:bg-white/[0.2] backdrop-blur-2xl border border-white/25 hover:border-white/40 px-3.5 py-2 rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer transition-all group font-jakarta"
        >
          <Sparkles size={13} className="text-pAccent animate-pulse" />
          <span className="text-xs text-white/90 group-hover:text-white font-medium whitespace-nowrap">
            {chatbot.speechBubbleText}
          </span>
        </motion.div>

        {/* Circular Apple Glass Chat Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white/[0.16] hover:bg-white/[0.26] border border-white/30 hover:border-white/50 backdrop-blur-2xl shadow-[0_16px_36px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] flex items-center justify-center text-white cursor-pointer group transition-all"
        >
          <MessageSquareText
            size={20}
            className="text-white group-hover:text-pAccent transition-colors group-hover:scale-105"
          />
        </motion.button>
      </div>

      {/* 2. TRANSLUCENT FROSTED GLASS MODAL (PORTALED TO DOCUMENT.BODY) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-auto font-jakarta">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-0 bg-black/50 backdrop-blur-md"
                />

                {/* Modal Card (Light VisionOS Frosted Glass) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="relative w-full max-w-lg h-[520px] max-h-[85dvh] flex flex-col rounded-2xl sm:rounded-3xl border border-white/30 overflow-hidden z-10 font-jakarta shadow-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(32, 32, 44, 0.72) 50%, rgba(18, 18, 26, 0.82) 100%)",
                    backdropFilter: "blur(32px) saturate(200%)",
                    WebkitBackdropFilter: "blur(32px) saturate(200%)",
                    boxShadow: `
                      0 24px 64px -12px rgba(0, 0, 0, 0.55),
                      0 8px 24px -4px rgba(0, 0, 0, 0.35),
                      inset 0 1.2px 1px 0 rgba(255, 255, 255, 0.5),
                      inset 0 -1px 2px 0 rgba(0, 0, 0, 0.3)
                    `,
                  }}
                >
                  {/* Clean Minimal Header */}
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/15 bg-white/[0.04] shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
                        <Bot size={15} className="text-pAccent" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                        {chatbot.botName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleClearChat}
                        title="Reset Conversation"
                        className="p-1.5 rounded-lg text-white/65 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        title="Close (Esc)"
                        className="p-1.5 rounded-lg text-white/65 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div
                    data-lenis-prevent="true"
                    className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs sm:text-[13px]"
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
                              <div className="w-6 h-6 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-pAccent shrink-0 mt-0.5">
                                <Bot size={13} />
                              </div>
                              <div className="flex-1 bg-white/[0.1] hover:bg-white/[0.14] border border-white/20 rounded-2xl rounded-tl-sm p-3 sm:p-3.5 text-white/95 shadow-sm transition-colors text-left">
                                <div className="space-y-1 text-left">
                                  {renderMessageContent(msg.text)}
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 text-[10px] text-white/50">
                                  <span>{msg.timestamp}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyText(msg.text, msg.id)}
                                    className="flex items-center gap-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {copiedId === msg.id ? (
                                      <>
                                        <Check size={11} className="text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
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
                            <div className="max-w-[85%] bg-white/[0.22] border border-white/30 text-white rounded-2xl rounded-tr-xs px-3.5 py-2 shadow-sm font-medium text-left">
                              <p className="leading-relaxed text-left">{msg.text}</p>
                              <span className="text-[9px] text-white/60 block text-right mt-0.5">
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
                        <div className="flex items-center justify-between px-1 text-[11px] font-medium text-white/50 tracking-wide">
                          <div className="flex items-center gap-1.5">
                            <Sparkles size={11} className="text-pAccent animate-pulse" />
                            <span>Suggested Topics</span>
                          </div>
                          <span className="text-[10px] text-white/35 select-none">Swipe / scroll →</span>
                        </div>

                        {/* Carousel Scroll Track with clean single-line layout */}
                        <div className="relative -mx-1">
                          <div
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
                                  className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 hover:border-pAccent/50 backdrop-blur-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] shrink-0 select-none text-left snap-start"
                                >
                                  {/* Specular sheen on hover */}
                                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                  {/* Glowing accent icon badge */}
                                  <div className="w-5 h-5 rounded-full bg-pAccent/15 border border-pAccent/25 flex items-center justify-center text-pAccent group-hover:bg-pAccent group-hover:text-black transition-all shrink-0">
                                    <Icon size={11} />
                                  </div>

                                  {/* Label */}
                                  <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                                    {prompt.title}
                                  </span>

                                  {/* Mini arrow */}
                                  <ArrowUpRight
                                    size={12}
                                    className="text-white/35 group-hover:text-pAccent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
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
                        <div className="w-6 h-6 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-pAccent shrink-0 mt-0.5">
                          <Bot size={13} />
                        </div>
                        <div className="bg-white/[0.1] border border-white/20 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1 text-white/60 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-pAccent animate-bounce" />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-pAccent animate-bounce"
                            style={{ animationDelay: "0.15s" }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-pAccent animate-bounce"
                            style={{ animationDelay: "0.3s" }}
                          />
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Clean Input Area */}
                  <div className="p-3 sm:p-3.5 border-t border-white/15 bg-white/[0.03] shrink-0">
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
                        className="w-full bg-white/[0.1] hover:bg-white/[0.14] focus:bg-white/[0.18] text-white placeholder-white/50 text-base sm:text-xs md:text-[13px] rounded-full pl-4 pr-11 py-2.5 sm:py-3 border border-white/25 focus:border-white/50 focus:outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-pAccent hover:text-black disabled:opacity-30 disabled:hover:bg-white/20 disabled:hover:text-white text-white flex items-center justify-center transition-all cursor-pointer shrink-0 z-10"
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
