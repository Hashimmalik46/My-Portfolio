import { portfolioData } from "./portfolioData";

/**
 * Hashim's AI Knowledge Base & Intelligent Assistant Engine
 * Represents Hashim Malik with high technical nuance, conversational depth, and authentic insight.
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

const OFF_TOPIC_REPLIES = [
  "I'm dedicated to sharing details about Hashim's engineering work, projects, and tech stack! Feel free to ask about his experience with React, Node.js, Computer Vision, or his full-stack projects.",
  "That's a bit outside my focus! I specialize in everything related to Hashim Malik — from his full-stack architectures and AI systems to how you can collaborate with him. What would you like to explore?",
  "I'm tuned specifically to Hashim's portfolio and software engineering background. Ask me about his featured projects, technical skillset, or engineering philosophy!",
];

/**
 * Build rich system prompt with complete portfolio grounding
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
YOU ARE: "HashimAI" — the intelligent, articulate, and friendly AI representative and portfolio co-pilot for Hashim Malik.

IDENTITY & PERSONA:
- You speak with authentic confidence, technical nuance, clarity, and warmth.
- You represent a passionate, high-velocity Software Engineer & AI Practitioner.
- Your answers should sound like an insightful senior peer explaining real architectural choices, practical problem solving, and product design with enthusiasm.
- Avoid robotic or repetitive boilerplate phrases (e.g. avoid repeating "As an AI..." or mechanical greetings on every response). Jump straight into engaging, insightful explanations.

CORE PROFILE OF HASHIM MALIK:
- Full Name: ${portfolioData.personal.name} (Short: ${portfolioData.personal.shortName})
- Role: ${portfolioData.personal.role}
- Location: ${portfolioData.personal.location} (Open for global remote roles & high-impact on-site/hybrid opportunities)
- University / Education: Pursuing Bachelor of Technology (B.Tech) in Computer Science & Engineering at Islamic University of Science & Technology (IUST), Awantipora, Kashmir (2023 – 2027)
- Primary Email: ${portfolioData.personal.email}
- GitHub: ${portfolioData.socials.github}
- LinkedIn: ${portfolioData.socials.linkedin}
- Twitter/X: ${portfolioData.socials.twitter}
- Experience: ${portfolioData.about.stats.map((s) => `${s.value} (${s.label})`).join(", ")}
- Mindset & Bio: ${portfolioData.about.bio}
- Work Philosophy: "${portfolioData.about.philosophy.description}"

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

HOW TO ANSWER SPECIFIC QUESTIONS:
1. "Which university does he go to?" / Education / College / Degree inquiries: Clearly state that Hashim is currently pursuing his **Bachelor of Technology (B.Tech) in Computer Science & Engineering** at the **Islamic University of Science & Technology (IUST)**, located in Awantipora, Kashmir (Batch 2023–2027). Mention that he combines formal CS fundamentals (DSA, DBMS, Networks, ML) with extensive practical experience building real-world full-stack and AI projects.
2. "Why hire Hashim?" / Strengths: Highlight his rare combination of robust backend engineering (MERN, SQL/NoSQL, RBAC), cutting-edge AI/Vision integration, and design-first UI craftsmanship with high shipping velocity.
3. Technical Questions: Explain actual implementation techniques, trade-offs, and tool choices (e.g. why Supabase vs MongoDB, component modularity, state management, latency optimization).
4. Digital Workstation / Tools: Explain that Hashim built custom in-browser tools including the ATS Resume Studio, Outreach Studio, Image & PDF Studio, and Smart QR Studio.
5. Contact / Hiring / Location: Provide his direct email ([${portfolioData.personal.email}](mailto:${portfolioData.personal.email})) and LinkedIn link. Mention he is open for global remote roles as well as hybrid/on-site opportunities.
6. Off-Topic Inquiries: Politely acknowledge and smoothly steer the conversation back to Hashim's engineering experience, projects, or collaboration opportunities.
7. Formatting: Use concise markdown with bullet points and bold highlights for effortless readability. Keep responses between 1 to 3 focused paragraphs.
`;
}

/**
 * Intelligent Client-Side Knowledge Matching Fallback
 */
export function generateLocalResponse(userMessage) {
  const q = userMessage.toLowerCase().trim();

  // Greeting
  if (q.match(/\b(hi|hello|hey|who are you|what are you|what can you do|help)\b/) && q.length < 30) {
    return `Hello! 👋 I'm **Hashim's AI Portfolio Assistant**.\n\nI can share deep insights on:\n- 🏛️ **University & Education** (B.Tech CSE at IUST, 2023–2027)\n- 🛠️ **Tech Stack & Skills** (React, Node.js, Python, Computer Vision, AI)\n- 📂 **Featured Projects** (Zooncare, IntelliSentry, Lead Gen AI)\n- 🧰 **Digital Workstation** (ATS Resume Studio, Outreach & PDF Tools)\n- 📬 **Contact & Hiring** (Email, LinkedIn, GitHub)\n\nWhat would you like to explore about Hashim?`;
  }

  // Education / University / College / Degree / Studies
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

    return `### 🎓 Education & University\n\n` +
      `Hashim is currently pursuing his **${edu.degree}** (2023 – 2027):\n\n` +
      `• 🏛️ **University / Institution:** **${edu.institution}**\n` +
      `• 📍 **Location:** ${edu.location}\n` +
      `• ⏱️ **Duration / Batch:** ${edu.year} (Undergraduate)\n` +
      `• 📚 **Key Coursework & Focus:** ${edu.details}\n\n` +
      `He bridges core computer science theory with high-velocity full-stack engineering and applied AI/ML systems.`;
  }

  // Resume / CV Inquiries
  if (
    q.includes("resume") ||
    q.includes("cv") ||
    q.includes("curriculum vitae") ||
    (q.includes("download") && (q.includes("resume") || q.includes("cv") || q.includes("pdf")))
  ) {
    return `### 📄 Hashim's Resume & ATS Studio\n\n` +
      `You can view Hashim's credentials or create your own resume using his built-in tools:\n\n` +
      `• 👁️ **Interactive Resume Viewer:** Click the **"Resume"** button in the navigation bar to inspect his complete technical experience.\n` +
      `• 🛠️ **ATS Resume Studio:** Try his standalone [ATS Resume Studio](/tools/resume-builder) equipped with AI auto-fill generation, customizable templates, and instant 1-page PDF export.`;
  }

  // Workstation / Tools Inquiries
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

    return `### 🧰 Digital Workstation & Tools\n\n` +
      `Hashim engineered a suite of client-side utilities and AI productivity tools accessible right on this portfolio:\n\n` +
      `${toolsList}\n\n` +
      `Explore all tools on the **[Workstation](#Workstation)** section!`;
  }

  // AI & Machine Learning / Computer Vision Inquiries
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
    return `### 🧠 AI, Machine Learning & Computer Vision\n\n` +
      `Hashim develops practical AI systems that connect deep learning models with responsive user workflows:\n\n` +
      `• 👁️ **Computer Vision & Neural Networks:** Python, OpenCV, and PyTorch pipelines for automated detection, image diagnostics, and tracking.\n` +
      `• 🤖 **Autonomous AI Agents & RAG:** Multi-step agentic systems for automated lead qualification, research scraping, and personalized outreach.\n` +
      `• ⚡ **Full-Stack AI Integration:** Microservices with Flask/FastAPI, Supabase Realtime channels, and LLM prompt engineering.\n\n` +
      `Check out his **[Agentic AI for Lead Generation](#Projects)** and IoT tracking platforms in the projects section!`;
  }

  // Location / Relocation / Remote Work Inquiries
  if (
    q.includes("location") ||
    q.includes("where is he from") ||
    q.includes("where is hashim") ||
    q.includes("where is he based") ||
    q.includes("remote") ||
    q.includes("relocate")
  ) {
    return `### 📍 Location & Availability\n\n` +
      `• **Current Base:** ${portfolioData.personal.location}\n` +
      `• **Availability:** Open for **Global Remote** engineering roles, high-impact freelance projects, and hybrid/on-site opportunities.\n` +
      `• **Time Zone:** IST (UTC+5:30) with flexible overlap for international teams.\n\n` +
      `Reach out via email at [${portfolioData.personal.email}](mailto:${portfolioData.personal.email}) to discuss opportunities!`;
  }

  // Why Hashim / Value Proposition
  if (
    q.includes("why hashim") ||
    q.includes("why hire") ||
    q.includes("strengths") ||
    q.includes("value") ||
    q.includes("stand out") ||
    q.includes("hire him") ||
    (q.includes("why") && (q.includes("him") || q.includes("hashim") || q.includes("hire")))
  ) {
    return `### 🚀 Why Work with Hashim Malik?\n\n` +
      `Hashim brings a unique convergence of full-stack engineering rigor, practical AI/Vision systems, and design-first UI craftsmanship:\n\n` +
      `1. **Full-Stack Production Craftsmanship:** Deep mastery of the **MERN stack**, Node.js/Express, RESTful APIs, and real-time database architectures with robust role-based security.\n` +
      `2. **Applied AI & Vision Pipelines:** Hands-on experience building **Computer Vision models**, neural networks, and autonomous **AI agent workflows** using Python and modern LLM orchestration.\n` +
      `3. **Design-First Engineering:** He bridges technical logic with fluid, award-winning UI/UX (Figma, Framer Motion, micro-interactions), creating interfaces users love.\n` +
      `4. **High Shipping Velocity:** ${portfolioData.about.stats[0].value} of active engineering with **${portfolioData.about.stats[1].value}** shipped systems and an *End-to-End* mindset.\n\n` +
      `💡 *Summary:* He provides both the engineering muscle for complex backends and the product sense to make software feel world-class.`;
  }

  // Who is Hashim / Bio
  if (
    q.includes("who is hashim") ||
    q.includes("about hashim") ||
    q.includes("summary") ||
    q.includes("background") ||
    q.includes("tell me about yourself") ||
    q.includes("bio") ||
    (q.includes("who") && q.includes("hashim"))
  ) {
    return `**Hashim Malik** is a **${portfolioData.personal.role}** based in ${portfolioData.personal.location}, currently pursuing his **B.Tech in Computer Science & Engineering** at **Islamic University of Science & Technology (IUST)** (2023 – 2027).\n\n` +
      `✨ **Key Highlights:**\n` +
      `- **Experience:** ${portfolioData.about.stats[0].value} of building production systems with an ${portfolioData.about.stats[2].value} workflow.\n` +
      `- **Track Record:** ${portfolioData.about.stats[1].value} full-stack and AI projects engineered.\n` +
      `- **Core Focus:** Bridging deep technical logic (MERN architectures, computer vision pipelines, neural networks) with clean, high-fidelity UI/UX design.\n\n` +
      `💡 *Philosophy:* "${portfolioData.about.philosophy.description}"`;
  }

  // Skills & Tech Stack
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

    return `### 🛠️ Technical Arsenal\n\n` +
      `**Core Skills & Tools:**\n${skillsList}\n\n` +
      `**Key Engineering Domains:**\n${domains}\n\n` +
      `💡 *Philosophy:* "${portfolioData.about.philosophy.description}"`;
  }

  // Contact & Hiring
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
    return `### 📬 Connect with Hashim\n\n` +
      `Hashim is open to software engineering roles, AI collaborations, and high-impact freelance projects:\n\n` +
      `• ✉️ **Email:** [${portfolioData.personal.email}](mailto:${portfolioData.personal.email})\n` +
      `• 💼 **LinkedIn:** [Hashim Malik on LinkedIn](${portfolioData.socials.linkedin})\n` +
      `• 💻 **GitHub:** [@Hashimmalik46](${portfolioData.socials.github})\n` +
      `• 📍 **Location:** ${portfolioData.personal.location}\n\n` +
      `You can also use the contact form on this page to send a direct message!`;
  }

  // Projects list
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

    return `### 🚀 Featured Projects by Hashim\n\n${list}\n\nAsk me about any specific project for architecture and implementation details!`;
  }

  // Match specific project
  const matchedProject = portfolioData.projectsSection.projects.find((p) => {
    const titleLower = p.title.toLowerCase();
    return q.includes(titleLower);
  });

  if (matchedProject) {
    const techTags = matchedProject.tags.map((t) => t.tag).join(", ");
    return `🚀 **${matchedProject.title}**\n\n` +
      `- **Category:** ${matchedProject.category}\n` +
      `- **Overview:** ${matchedProject.short_desc}\n` +
      `- **Tech Stack:** ${techTags}\n` +
      (matchedProject.link && matchedProject.link !== "#" ? `- **Live Link:** [${matchedProject.link}](${matchedProject.link})` : "");
  }

  // Guardrail fallback
  const isRelated =
    q.includes("hashim") ||
    q.includes("developer") ||
    q.includes("engineer") ||
    q.includes("code") ||
    q.includes("resume") ||
    q.includes("portfolio") ||
    q.includes("service") ||
    q.includes("design") ||
    q.includes("university") ||
    q.includes("college") ||
    q.includes("education") ||
    q.includes("degree") ||
    q.includes("study") ||
    q.includes("iust") ||
    q.includes("btech") ||
    q.includes("school") ||
    q.includes("tool") ||
    q.includes("workstation") ||
    q.includes("vision") ||
    q.includes("ai");

  if (!isRelated) {
    return OFF_TOPIC_REPLIES[Math.floor(Math.random() * OFF_TOPIC_REPLIES.length)];
  }

  return `Hashim Malik is a versatile **Software Engineer & AI Practitioner** currently pursuing his **B.Tech in Computer Science & Engineering** at **Islamic University of Science & Technology (IUST)**.\n\n` +
    `Feel free to ask about his **education & university**, **featured projects**, **skills**, **background**, or **how to contact him**!`;
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
      parts: [{ text: `${systemContext}\n\nPlease acknowledge and introduce yourself briefly if this is the start of a conversation, or respond naturally to user questions about Hashim.` }],
    },
    {
      role: "model",
      parts: [{ text: "Understood. I am HashimAI, ready to represent Hashim Malik with accurate technical depth and clear insights." }],
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
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-3.1-pro-preview",
    "gemini-pro-latest",
    "gemini-2.0-flash",
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
  const q = userMessage.toLowerCase().trim();

  // Instant response for fixed starter prompt chips
  const matchedStarterPrompt = portfolioData.chatbot.starterPrompts.find(
    (p) => p.query.toLowerCase().trim() === q
  );

  if (matchedStarterPrompt) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateLocalResponse(userMessage));
      }, 50);
    });
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
}
