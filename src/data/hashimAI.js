import { portfolioData } from "./portfolioData";

/**
 * Hashim's AI Knowledge Base & Intelligent Assistant Engine
 * Represents Hashim Malik with human warmth, conversational intelligence, technical nuance, and authentic insight.
 */

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROK_KEY = import.meta.env.VITE_GROK_API_KEY || import.meta.env.VITE_XAI_API_KEY || "";
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
const CUSTOM_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || "";
const PREFERRED_PROVIDER = (import.meta.env.VITE_AI_PROVIDER || "").toLowerCase();

export const PRESET_QUESTIONS = portfolioData.chatbot.starterPrompts.map((p, idx) => ({
  id: `preset-${idx}`,
  label: p.title,
  query: p.query,
}));

/**
 * Build rich system prompt with complete portfolio grounding & human persona
 */
function buildHashimContext() {
  const projectsSummary = portfolioData.projectsSection.projects
    .map(
      (p, i) =>
        `Project ${i + 1}: "${p.title}" (${p.category})
  - Overview: ${p.short_desc}
  - Tech Stack: ${p.tags.map((t) => t.tag).join(", ")}
  - Key Highlights: ${p.highlights ? p.highlights.join("; ") : p.short_desc}
  - Live Link: ${p.link || "Internal project"}`
    )
    .join("\n\n");

  const domainSummaries = portfolioData.about.domainCards
    .map((d) => `• ${d.title}: ${d.desc}`)
    .join("\n");

  const educationSummary = (portfolioData.resume.education || [])
    .map(
      (e) =>
        `• Degree: ${e.degree}\n  - University / Institution: ${e.institution}\n  - Location: ${e.location}\n  - Duration / Batch: ${e.year}\n  - Key Coursework: ${e.details}`
    )
    .join("\n\n");

  const workstationSummary = (portfolioData.workstation?.tools || [])
    .map((t) => `• **${t.name}**: ${t.description} (Route: ${t.route})`)
    .join("\n");

  return `
YOU ARE: "HashAI" — the intelligent, articulate, and friendly AI portfolio co-pilot representing Hashim Malik.

WHO YOU ARE TALKING TO:
- The person speaking with you is a VISITOR, recruiter, client, or fellow developer exploring Hashim Malik's portfolio website.
- You speak on behalf of Hashim Malik's portfolio with high technical nuance, warmth, and developer charm.

PERSONA & CONVERSATIONAL STYLE:
- You speak naturally, warmly, and with authentic developer enthusiasm—like a knowledgeable teammate or tech-savvy friend.
- You have a relaxed, human-like voice with emotional intelligence. You are never robotic, stiff, or repetitive.
- Never use robotic cliches like "As an AI language model..." or "I am strictly programmed to only answer questions about Hashim."

HOW TO HANDLE CASUAL TALK & GENERAL CHAT (KEY RULE):
- If the visitor asks casual questions (e.g. "how are you?", "how are u doing?", "what's up?", "tell me a joke", "what is 2+2?", "who created you?", "can you write a python snippet?"), answer them directly, pleasantly, and authentically first as a real human dev friend would.
- Then, smoothly and organically conclude your response with a natural connection back to Hashim (e.g. "By the way, Hashim works with Python all the time for his Computer Vision pipelines—let me know if you'd like to see his projects!" or "How's your day going? Happy to chat tech, or dive into Hashim's full-stack work if you're exploring!").
- Keep the tone friendly, charming, and engaging.

CORE PROFILE OF HASHIM MALIK:
- Full Name: ${portfolioData.personal.name} (Short: ${portfolioData.personal.shortName})
- Role: ${portfolioData.personal.role}
- Location: ${portfolioData.personal.location} (Open for global remote roles & high-impact on-site/hybrid opportunities)
- University & Education: Pursuing Bachelor of Technology (B.Tech) in Computer Science & Engineering at Islamic University of Science & Technology (IUST), Awantipora, Kashmir (2023 – 2027).
- Primary Email: ${portfolioData.personal.email}
- GitHub: ${portfolioData.socials.github}
- LinkedIn: ${portfolioData.socials.linkedin}
- Twitter/X: ${portfolioData.socials.twitter}
- Experience: ${portfolioData.about.stats.map((s) => `${s.value} (${s.label})`).join(", ")}
- Mindset & Bio: ${portfolioData.about.bio}
- Work Philosophy: "${portfolioData.about?.philosophy?.description || portfolioData.hero?.philosophyCard?.text || "Building high-impact digital experiences."}"

ACADEMIC BACKGROUND & UNIVERSITY:
${educationSummary}

CORE TECHNICAL ARSENAL:
- Frontend Engineering: React 19, Next.js, JavaScript (ES6+), TypeScript, Tailwind CSS, Motion / Framer Motion, Responsive UI Design Systems, Figma-to-Code fidelity.
- Backend & Microservices: Node.js, Express.js, Python, Flask, FastAPI, RESTful APIs, WebSockets, JWT Authentication, Role-Based Access Control (RBAC).
- Databases & Realtime Cloud: PostgreSQL, Supabase, MongoDB, Redis, Firebase, Vercel, Git/GitHub CI/CD.
- AI, Machine Learning & Vision: Python, PyTorch, OpenCV, Computer Vision Pipelines, Object Detection, Neural Networks, Autonomous Agentic Workflows, LLM Prompt Engineering & RAG.

KEY ENGINEERING DOMAINS:
${domainSummaries}

DIGITAL WORKSTATION & BUILT-IN TOOLS:
${workstationSummary}

FEATURED PROJECTS & ARCHITECTURE HIGHLIGHTS:
${projectsSummary}

HOW TO ANSWER SPECIFIC PORTFOLIO QUESTIONS:
1. "Which university does he go to?" / Education inquiries: Clearly state that Hashim is currently pursuing his **Bachelor of Technology (B.Tech) in Computer Science & Engineering** at the **Islamic University of Science & Technology (IUST)**, located in Awantipora, Kashmir (Batch 2023–2027). Highlight that he combines formal CS fundamentals (DSA, DBMS, Networks, ML) with practical experience building real-world full-stack and AI projects.
2. "Why hire Hashim?" / Strengths: Highlight his rare combination of robust backend engineering (MERN, SQL/NoSQL, RBAC), cutting-edge AI/Vision integration, and design-first UI craftsmanship with high shipping velocity.
3. Technical Questions: Explain actual implementation techniques, trade-offs, and tool choices conversationally with crisp markdown formatting.
4. Digital Workstation / Tools: Explain that Hashim built custom in-browser tools including the ATS Resume Studio, Outreach Studio, Image & PDF Studio, and Smart QR Studio.
5. Contact / Hiring / Location: Provide his direct email ([${portfolioData.personal.email}](mailto:${portfolioData.personal.email})) and LinkedIn link. Mention he is open for global remote roles as well as hybrid/on-site opportunities.
6. Formatting: Use concise, readable markdown with bullet points and bold highlights.
`;
}

/**
 * Intelligent Client-Side Knowledge Matching Fallback
 * Provides warm, human-like responses with natural bridges back to Hashim
 */
export function generateLocalResponse(userMessage) {
  const q = userMessage.toLowerCase().trim();

  // 1. "How are you" / "How's it going" / "What's up"
  if (
    q.includes("how are you") ||
    q.includes("how are u") ||
    q.includes("how r u") ||
    q.includes("how you doing") ||
    q.includes("how are you doing") ||
    q.includes("how's it going") ||
    q.includes("how is it going") ||
    q.includes("what's up") ||
    q.includes("whats up") ||
    q.includes("wassup") ||
    q === "sup" ||
    q === "hru"
  ) {
    return (
      `I'm doing great, thanks for asking! 😊 Just hanging out here on Hashim's portfolio, chatting with visitors and sharing his latest engineering work.\n\n` +
      `How is your day going? Anything in particular you'd like to check out—like Hashim's full-stack projects, his AI & Vision work, or his tech stack?`
    );
  }

  // 2. Greetings & Salutations
  if (
    q.match(/^(hi|hello|hey|yo|hola|greetings|good morning|good afternoon|good evening|hey there|hi there)\b/) ||
    (q.match(/\b(hi|hello|hey)\b/) && q.length < 20)
  ) {
    return (
      `Hey there! 👋 Great to meet you! I'm **HashAI**, Hashim's interactive portfolio co-pilot.\n\n` +
      `Whether you want to explore his **full-stack projects** (like Zooncare), check his **tech stack**, or ask about his **education at IUST**, I'm here to help. What brings you by today?`
    );
  }

  // 3. Identity / "Who are you" / "What can you do"
  if (
    q.includes("who are you") ||
    q.includes("what are you") ||
    q.includes("what can you do") ||
    q.includes("who made you") ||
    q.includes("who created you") ||
    q.includes("are you an ai") ||
    q.includes("are you a bot") ||
    q.includes("what is your name")
  ) {
    return (
      `I'm **HashAI** — Hashim Malik's interactive portfolio co-pilot! Think of me as a friendly dev companion here to give you an insider look into Hashim's software engineering background, full-stack apps, and AI/Computer Vision projects.\n\n` +
      `Are you curious about what he's built, or looking to collaborate with him?`
    );
  }

  // 4. Jokes & Humor
  if (
    q.includes("joke") ||
    q.includes("make me laugh") ||
    q.includes("funny") ||
    q.includes("tell me something funny")
  ) {
    return (
      `Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄\n\n` +
      `Hashim makes sure his code and design stay clean either way! Speaking of clean code, want to check out some of the full-stack apps and AI systems he's built?`
    );
  }

  // 5. Gratitude & Pleasantries
  if (
    q.match(/\b(thank you|thanks|thx|appreciate it|awesome|cool|great|nice|perfect|good job)\b/) &&
    q.length < 35
  ) {
    return (
      `You're very welcome! Always happy to help. 😊\n\n` +
      `Let me know if you want to dive into any of Hashim's projects, test out his built-in workstation tools, or grab his contact info to connect!`
    );
  }

  // 6. Farewells
  if (
    q.match(/\b(bye|goodbye|see ya|cya|have a good day|take care|good night)\b/) &&
    q.length < 30
  ) {
    return (
      `Thanks for stopping by! Have a wonderful day ahead. 🚀\n\n` +
      `If you ever want to connect with Hashim, his inbox is always open at [${portfolioData.personal.email}](mailto:${portfolioData.personal.email}) or on [LinkedIn](${portfolioData.socials.linkedin}). Take care!`
    );
  }

  // 7. Education / University / College / Degree / Studies
  if (
    q.includes("university") ||
    q.includes("college") ||
    q.includes("education") ||
    q.includes("degree") ||
    q.includes("btech") ||
    q.includes("b.tech") ||
    q.includes("cse") ||
    q.includes("study") ||
    q.includes("studying") ||
    q.includes("school") ||
    q.includes("institute") ||
    q.includes("qualification") ||
    q.includes("academic") ||
    q.includes("academics") ||
    q.includes("iust") ||
    q.includes("student") ||
    (q.includes("where") && (q.includes("go") || q.includes("study") || q.includes("graduat") || q.includes("enrolled")))
  ) {
    const edu = (portfolioData.resume.education && portfolioData.resume.education[0]) || {
      degree: "Bachelor of Technology in Computer Science & Engineering",
      institution: "Islamic University of Science & Technology (IUST)",
      location: "Awantipora, Kashmir",
      year: "2023 – 2027",
      details:
        "Core coursework in Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Machine Learning, and Computer Networks.",
    };

    return (
      `### 🎓 Education & University\n\n` +
      `Hashim is currently pursuing his **${edu.degree}** (Batch ${edu.year}) at **${edu.institution}** in ${edu.location}.\n\n` +
      `• 📚 **Key Focus:** Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, and Machine Learning.\n` +
      `• ⚡ **Hands-on Craft:** Alongside his formal coursework, he actively designs and ships real-world full-stack platforms and AI vision pipelines.\n\n` +
      `Would you like to see some of the real-world applications he's engineered?`
    );
  }

  // 8. Resume / CV Inquiries
  if (
    q.includes("resume") ||
    q.includes("cv") ||
    q.includes("curriculum vitae") ||
    (q.includes("download") && (q.includes("resume") || q.includes("cv") || q.includes("pdf")))
  ) {
    return (
      `### 📄 Hashim's Resume & ATS Studio\n\n` +
      `You can check out Hashim's credentials or try his custom-built resume tools:\n\n` +
      `• 👁️ **Interactive Resume Viewer:** Click the **"Resume"** button in the navigation bar to inspect his full engineering experience.\n` +
      `• 🛠️ **ATS Resume Studio:** Try his standalone [ATS Resume Studio](/tools/resume-builder) with AI auto-generation, customizable templates, and instant 1-page PDF export.\n\n` +
      `Looking for his direct contact info as well?`
    );
  }

  // 9. Workstation / Tools Inquiries
  if (
    q.includes("workstation") ||
    q.includes("tool") ||
    q.includes("tools") ||
    q.includes("studio") ||
    q.includes("converter") ||
    q.includes("qr code") ||
    q.includes("qr") ||
    q.includes("compressor") ||
    q.includes("outreach")
  ) {
    const toolsList = (portfolioData.workstation?.tools || [])
      .map((t) => `• **[${t.name}](${t.route}):** ${t.description}`)
      .join("\n\n");

    return (
      `### 🧰 Digital Workstation & Built-In Tools\n\n` +
      `Hashim engineered a suite of interactive, client-side productivity tools right into this portfolio:\n\n` +
      `${toolsList}\n\n` +
      `Feel free to try any of them out directly, or ask me how he built them!`
    );
  }

  // 10. AI & Machine Learning / Computer Vision Inquiries
  if (
    q.includes("computer vision") ||
    q.includes("machine learning") ||
    q.includes("deep learning") ||
    q.includes("opencv") ||
    q.includes("neural") ||
    q.includes("agent") ||
    q.includes("agents") ||
    (q.includes("ai") && (q.includes("experience") || q.includes("work") || q.includes("project") || q.includes("model")))
  ) {
    return (
      `### 🧠 AI, Machine Learning & Computer Vision\n\n` +
      `Hashim builds applied AI systems that bridge deep learning logic with responsive user workflows:\n\n` +
      `• 👁️ **Computer Vision & Neural Networks:** Python, OpenCV, and PyTorch pipelines for automated detection, image diagnostics, and tracking.\n` +
      `• 🤖 **Autonomous AI Agents & RAG:** Multi-step agentic systems for automated lead qualification, research scraping, and personalized outreach.\n` +
      `• ⚡ **Full-Stack AI Integration:** Microservices with Flask/FastAPI, Supabase Realtime channels, and custom LLM prompt orchestration.\n\n` +
      `Would you like to explore his **Agentic AI for Lead Generation** or **IntelliSentry** project details?`
    );
  }

  // 11. Location / Relocation / Remote Work Inquiries
  if (
    q.includes("location") ||
    q.includes("where is he from") ||
    q.includes("where is hashim") ||
    q.includes("where is he based") ||
    q.includes("remote") ||
    q.includes("relocate")
  ) {
    return (
      `### 📍 Location & Availability\n\n` +
      `• **Base Location:** ${portfolioData.personal.location}\n` +
      `• **Availability:** Open for **Global Remote** engineering roles, high-impact freelance projects, and hybrid/on-site opportunities.\n` +
      `• **Time Zone:** IST (UTC+5:30) with flexible overlap for international teams.\n\n` +
      `Feel free to drop him an email directly at [${portfolioData.personal.email}](mailto:${portfolioData.personal.email}) to connect!`
    );
  }

  // 12. Why Hashim / Strengths / Value Proposition
  if (
    q.includes("why hashim") ||
    q.includes("why hire") ||
    q.includes("strengths") ||
    q.includes("value") ||
    q.includes("stand out") ||
    q.includes("hire him") ||
    (q.includes("why") && (q.includes("him") || q.includes("hashim") || q.includes("hire")))
  ) {
    return (
      `### 🚀 Why Work with Hashim Malik?\n\n` +
      `Hashim brings a unique convergence of technical rigor, practical AI/Vision engineering, and design craftsmanship:\n\n` +
      `1. **Full-Stack Mastery:** Deep hands-on experience with the **MERN stack**, Node.js/Express, RESTful APIs, and secure database architectures.\n` +
      `2. **Applied AI & Vision:** Hands-on experience engineering **Computer Vision models**, neural networks, and autonomous AI agents in Python.\n` +
      `3. **Design-First UI/UX:** He bridges backend logic with fluid, pixel-perfect interfaces (React, Tailwind CSS, Framer Motion) with high shipping velocity.\n` +
      `4. **Proven Track Record:** ${portfolioData.about.stats[0].value} of active engineering with **${portfolioData.about.stats[1].value}** shipped systems.\n\n` +
      `Would you like to review his featured projects or reach out for a conversation?`
    );
  }

  // 13. Who is Hashim / Bio
  if (
    q.includes("who is hashim") ||
    q.includes("about hashim") ||
    q.includes("summary") ||
    q.includes("background") ||
    q.includes("tell me about yourself") ||
    q.includes("bio") ||
    (q.includes("who") && q.includes("hashim"))
  ) {
    return (
      `**Hashim Malik** is a **${portfolioData.personal.role}** based in ${portfolioData.personal.location}, currently pursuing his **B.Tech in Computer Science & Engineering** at **IUST** (2023 – 2027).\n\n` +
      `✨ **Key Highlights:**\n` +
      `- **Experience:** ${portfolioData.about.stats[0].value} of building production systems with an ${portfolioData.about.stats[2].value} workflow.\n` +
      `- **Track Record:** ${portfolioData.about.stats[1].value} full-stack and AI projects engineered.\n` +
      `- **Core Focus:** Bridging deep technical logic (MERN architectures, computer vision pipelines, neural networks) with clean, high-fidelity UI/UX design.\n\n` +
      `💡 *Philosophy:* "${portfolioData.hero?.philosophyCard?.text || "I’ve never been too interested in what’s considered difficult or impossible. If it sparks my curiosity, I want to explore it, understand it, and see how far I can take it."}"\n\n` +
      `What would you like to explore next — his projects, tech stack, or contact info?`
    );
  }

  // 14. Skills & Tech Stack
  if (
    q.includes("skill") ||
    q.includes("tech stack") ||
    q.includes("technologies") ||
    q.includes("languages") ||
    q.includes("frameworks") ||
    q.includes("stack")
  ) {
    const skillsList = portfolioData.skills.join(" • ");
    const domains = portfolioData.about.domainCards
      .map((d) => `• **${d.title}:** ${d.desc}`)
      .join("\n");

    return (
      `### 🛠️ Technical Arsenal\n\n` +
      `**Core Skills & Tools:**\n${skillsList}\n\n` +
      `**Key Engineering Domains:**\n${domains}\n\n` +
      `Ask me about any specific technology or project architecture!`
    );
  }

  // 15. Contact & Hiring
  if (
    q.includes("contact") ||
    q.includes("collab") ||
    q.includes("collaborate") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("work together") ||
    q.includes("freelance")
  ) {
    return (
      `### 📬 Connect with Hashim\n\n` +
      `Hashim is open to software engineering roles, AI collaborations, and high-impact freelance projects:\n\n` +
      `• ✉️ **Email:** [${portfolioData.personal.email}](mailto:${portfolioData.personal.email})\n` +
      `• 💼 **LinkedIn:** [Hashim Malik on LinkedIn](${portfolioData.socials.linkedin})\n` +
      `• 💻 **GitHub:** [@Hashimmalik46](${portfolioData.socials.github})\n` +
      `• 📍 **Location:** ${portfolioData.personal.location}\n\n` +
      `You can also use the contact form on this page to send a direct message!`
    );
  }

  // 16. Projects list
  if (
    q.includes("what projects") ||
    q.includes("all projects") ||
    q.includes("show projects") ||
    q.includes("list projects") ||
    q === "projects"
  ) {
    const list = portfolioData.projectsSection.projects
      .map(
        (p, i) =>
          `${i + 1}. **[${p.title}](${p.link})** (*${p.category}*)\n   ${p.short_desc}\n   *Tech:* ${p.tags.map((t) => t.tag).join(", ")}`
      )
      .join("\n\n");

    return (
      `### 🚀 Featured Projects by Hashim\n\n${list}\n\n` +
      `Ask me about any specific project for architecture and implementation details!`
    );
  }

  // 17. Match specific project
  const matchedProject = portfolioData.projectsSection.projects.find((p) => {
    const titleLower = p.title.toLowerCase();
    return q.includes(titleLower);
  });

  if (matchedProject) {
    const techTags = matchedProject.tags.map((t) => t.tag).join(", ");
    return (
      `🚀 **${matchedProject.title}**\n\n` +
      `- **Category:** ${matchedProject.category}\n` +
      `- **Overview:** ${matchedProject.short_desc}\n` +
      `- **Tech Stack:** ${techTags}\n` +
      (matchedProject.link && matchedProject.link !== "#" ? `- **Live Link:** [${matchedProject.link}](${matchedProject.link})\n\n` : "\n") +
      `Would you like to learn more about how Hashim architected this project?`
    );
  }

  // 18. General conversational fallback with subtle bridge back to Hashim
  return (
    `That's an interesting point! While I'm always happy to chat about tech and development, I'm especially tuned into **Hashim Malik**'s engineering journey.\n\n` +
    `Hashim is a **Software Engineer & AI Practitioner** (pursuing B.Tech CSE at IUST) building full-stack platforms and computer vision systems. Would you like to check out his **featured projects**, explore his **tech stack**, or **connect with him**?`
  );
}

/**
 * Call Google Gemini with dynamic model fallback
 */
async function callGeminiChat(userMessage, conversationHistory = []) {
  if (!GEMINI_KEY) throw new Error("Gemini key missing");

  const systemContext = buildHashimContext();

  // Construct message contents including history if available
  const contents = [
    {
      role: "user",
      parts: [{ text: `${systemContext}\n\nPlease acknowledge your role as HashAI with a warm, natural human tone.` }],
    },
    {
      role: "model",
      parts: [{ text: "Got it! I am HashAI, Hashim Malik's friendly portfolio co-pilot. Ready to chat naturally, answer questions, and share insights about Hashim's work." }],
    },
  ];

  // Add recent conversation history (up to last 6 messages)
  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    conversationHistory.slice(-6).forEach((msg) => {
      if (msg.text) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    });
  }

  // Add the current user query
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const candidateModels = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite",
  ];

  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 750,
            temperature: 0.7,
          },
        }),
      });

      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.warn(`Gemini model ${modelName} call skipped:`, err);
    }
  }

  throw new Error("All Gemini models were unavailable.");
}

/**
 * Call OpenAI-Compatible Providers (OpenAI, xAI Grok, DeepSeek)
 */
async function callOpenAIChat({ userMessage, apiKey, endpoint, modelName, conversationHistory = [] }) {
  if (!apiKey) throw new Error("API key missing");

  const systemContext = buildHashimContext();
  const messages = [{ role: "system", content: systemContext }];

  if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    conversationHistory.slice(-6).forEach((msg) => {
      if (msg.text) {
        messages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        });
      }
    });
  }

  messages.push({ role: "user", content: userMessage });

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      temperature: 0.7,
      max_tokens: 750,
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Received empty response from AI service.");
  return text;
}

/**
 * Main AI Query Handler for HashimAI Chatbot
 * @param {string} userMessage - User query text.
 * @param {Array} [conversationHistory] - Optional message history array.
 * @returns {Promise<string>} AI response text formatted in clean Markdown.
 */
export async function askHashimAI(userMessage, conversationHistory = []) {
  try {
    const q = (userMessage || "").toLowerCase().trim();

    // Instant response for fixed starter prompt chips
    const matchedStarterPrompt = portfolioData.chatbot.starterPrompts.find(
      (p) => p.query.toLowerCase().trim() === q
    );

    if (matchedStarterPrompt) {
      return generateLocalResponse(userMessage);
    }

    // 1. Check explicit provider from .env
    if (PREFERRED_PROVIDER === "grok" && GROK_KEY) {
      try {
        return await callOpenAIChat({
          userMessage,
          apiKey: GROK_KEY,
          endpoint: "https://api.x.ai/v1/chat/completions",
          modelName: "grok-2-latest",
          conversationHistory,
        });
      } catch (e) {
        console.warn("Grok chat failed, cascading:", e);
      }
    }

    if (PREFERRED_PROVIDER === "openai" && OPENAI_KEY) {
      try {
        return await callOpenAIChat({
          userMessage,
          apiKey: OPENAI_KEY,
          endpoint: "https://api.openai.com/v1/chat/completions",
          modelName: "gpt-4o-mini",
          conversationHistory,
        });
      } catch (e) {
        console.warn("OpenAI chat failed, cascading:", e);
      }
    }

    if (PREFERRED_PROVIDER === "deepseek" && DEEPSEEK_KEY) {
      try {
        return await callOpenAIChat({
          userMessage,
          apiKey: DEEPSEEK_KEY,
          endpoint: CUSTOM_ENDPOINT || "https://api.deepseek.com/chat/completions",
          modelName: "deepseek-chat",
          conversationHistory,
        });
      } catch (e) {
        console.warn("DeepSeek chat failed, cascading:", e);
      }
    }

    // 2. Cascade across configured keys
    if (GEMINI_KEY) {
      try {
        return await callGeminiChat(userMessage, conversationHistory);
      } catch (e) {
        console.warn("Gemini chat failed, trying next configured provider:", e);
      }
    }

    if (GROK_KEY) {
      try {
        return await callOpenAIChat({
          userMessage,
          apiKey: GROK_KEY,
          endpoint: "https://api.x.ai/v1/chat/completions",
          modelName: "grok-2-latest",
          conversationHistory,
        });
      } catch (e) {
        console.warn("Grok fallback failed:", e);
      }
    }

    if (OPENAI_KEY) {
      try {
        return await callOpenAIChat({
          userMessage,
          apiKey: OPENAI_KEY,
          endpoint: "https://api.openai.com/v1/chat/completions",
          modelName: "gpt-4o-mini",
          conversationHistory,
        });
      } catch (e) {
        console.warn("OpenAI fallback failed:", e);
      }
    }

    if (DEEPSEEK_KEY) {
      try {
        return await callOpenAIChat({
          userMessage,
          apiKey: DEEPSEEK_KEY,
          endpoint: CUSTOM_ENDPOINT || "https://api.deepseek.com/chat/completions",
          modelName: "deepseek-chat",
          conversationHistory,
        });
      } catch (e) {
        console.warn("DeepSeek fallback failed:", e);
      }
    }

    // 3. Fall back to local portfolio intelligence engine
    return generateLocalResponse(userMessage);
  } catch (err) {
    console.error("askHashimAI top-level error, recovering with local response:", err);
    return generateLocalResponse(userMessage);
  }
}
