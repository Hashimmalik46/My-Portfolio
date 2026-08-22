import { portfolioData } from "./portfolioData";

/**
 * Hashim's AI Knowledge Base & Guardrail Engine
 * Strictly trained and grounded to answer questions ONLY about Hashim Malik.
 */

export const PRESET_QUESTIONS = portfolioData.chatbot.starterPrompts.map((p, idx) => ({
  id: `preset-${idx}`,
  label: p.title,
  query: p.query,
}));

const OFF_TOPIC_REPLIES = portfolioData.chatbot.offTopicReplies;

/**
 * Intelligent Client-Side Knowledge Matching Engine
 */
export function generateLocalResponse(userMessage) {
  const q = userMessage.toLowerCase().trim();

  // 1. Identity & Greeting
  if (
    q.match(/\b(hi|hello|hey|who are you|what are you|what can you do|help)\b/) &&
    q.length < 25
  ) {
    return `Hello! 👋 I'm **Hashim's AI Portfolio Assistant**.\n\nI can answer questions about:\n- 🛠️ **Tech Stack & Skills** (React, Node.js, Python, ML, Computer Vision)\n- 📂 **Featured Projects** (Clinic systems, AI lead gen, School tracking)\n- 💼 **Experience & Philosophy** (Full-Stack & AI development)\n- 📬 **Contact & Collaboration** (Email, LinkedIn, GitHub)\n\nWhat would you like to know about Hashim?`;
  }

  // 1.5. Why Hashim / Why Hire / Value Proposition
  if (
    q.includes("why hashim") ||
    q.includes("why hire") ||
    q.includes("why should") ||
    q.includes("strengths") ||
    q.includes("value") ||
    q.includes("stand out") ||
    q.includes("sets him apart") ||
    q.includes("advantage") ||
    q.includes("hire him") ||
    (q.includes("why") && (q.includes("him") || q.includes("hashim") || q.includes("hire")))
  ) {
    return `### 🚀 Why Work with Hashim Malik?\n\n` +
      `Hashim is a self-directed software engineer who combines full-stack technical depth with practical AI systems and high-fidelity UI design:\n\n` +
      `1. **Full-Stack Production Craftsmanship:** Deep expertise in the **MERN stack**, Node.js/Express, RESTful APIs, Supabase real-time databases, and role-based access control (shipped in multi-user healthcare clinic systems).\n` +
      `2. **Applied AI & Agentic Workflows:** Proven experience building **Computer Vision pipelines**, neural network models, and autonomous **lead-generation AI agents** using Python and Flask.\n` +
      `3. **Design-First Engineering:** He bridges technical logic with fluid, award-winning UI/UX (Figma, Framer Motion, micro-interactions), creating interfaces users love.\n` +
      `4. **High Shipping Velocity:** ${portfolioData.about.stats[0].value} of active building with **${portfolioData.about.stats[1].value}** shipped systems and an *End-to-End* mindset.\n\n` +
      `💡 *Summary:* He brings both the engineering muscle to build complex backends and the product sense to make software look and feel world-class.`;
  }

  // 2. Who is Hashim / Bio / About
  if (
    q.includes("who is hashim") ||
    q.includes("about hashim") ||
    q.includes("summary") ||
    q.includes("background") ||
    q.includes("tell me about yourself") ||
    q.includes("bio") ||
    (q.includes("who") && q.includes("hashim"))
  ) {
    return `**Hashim Malik** is a **${portfolioData.personal.role}** based in ${portfolioData.personal.location}.\n\n` +
      `✨ **Key Highlights:**\n` +
      `- **Experience:** ${portfolioData.about.stats[0].value} of building production systems with an ${portfolioData.about.stats[2].value} workflow.\n` +
      `- **Track Record:** ${portfolioData.about.stats[1].value} full-stack and AI projects engineered.\n` +
      `- **Expertise:** Bridging deep technical logic (MERN architectures, computer vision pipelines, neural networks) with clean, high-fidelity UI/UX design.\n\n` +
      `💡 *Philosophy:* "${portfolioData.about.philosophy.description}"`;
  }

  // 3. Skills & Tech Stack
  if (
    q.includes("skill") ||
    q.includes("tech stack") ||
    q.includes("technologies") ||
    q.includes("languages") ||
    q.includes("frameworks") ||
    q.includes("stack") ||
    q.includes("what does he know")
  ) {
    const skillsList = portfolioData.skills.join(" • ");
    const domains = portfolioData.about.domainCards
      .map((d) => `• **${d.title}:** ${d.desc}`)
      .join("\n");

    return `### 🛠️ Hashim's Technical Arsenal\n\n` +
      `**Core Skills & Tools:**\n${skillsList}\n\n` +
      `**Key Engineering Domains:**\n${domains}\n\n` +
      `💡 *Philosophy:* "${portfolioData.about.philosophy.description}"`;
  }

  // 4. AI / Machine Learning / Computer Vision
  if (
    q.includes("ai") ||
    q.includes("machine learning") ||
    q.includes("ml") ||
    q.includes("deep learning") ||
    q.includes("computer vision") ||
    q.includes("model") ||
    q.includes("vision") ||
    q.includes("agent")
  ) {
    return `### 🤖 Hashim's AI & Machine Learning Expertise\n\n` +
      `Hashim actively develops and integrates intelligent models into real-world applications:\n\n` +
      `1. **Computer Vision & Deep Learning:** Building custom vision pipelines and neural network architectures with Python.\n` +
      `2. **Agentic AI for Lead Generation:** Engineered autonomous agent workflows designed to extract, qualify, and route high-intent sales leads automatically.\n` +
      `3. **Full-Stack AI Integration:** Seamlessly deploying AI models into web applications using Flask, FastAPI, Supabase, and React.\n\n` +
      `He focuses on practical AI systems that drive measurable business automation.`;
  }

  // 4.5. UI / UX Design & Philosophy
  if (
    q.includes("ui") ||
    q.includes("ux") ||
    q.includes("design") ||
    q.includes("figma") ||
    q.includes("interaction") ||
    q.includes("animation") ||
    q.includes("frontend design")
  ) {
    return `### 🎨 Hashim's UI/UX & Product Design Expertise\n\n` +
      `Hashim bridges technical engineering logic with high-fidelity visual design:\n\n` +
      `- **Design Systems & Prototyping:** Wireframing, interactive prototyping, and component-driven design systems crafted in **Figma**.\n` +
      `- **Physics-Based Micro-Interactions:** Delivering fluid web interfaces powered by **Framer Motion**, Tailwind CSS, and custom specular shader effects.\n` +
      `- **Design Aesthetic:** Frosted glassmorphism, responsive editorial typography, and high-contrast accessibility.\n\n` +
      `💡 *Philosophy:* "${portfolioData.about.philosophy.description}"`;
  }

  // 5. Contact, Hiring & Collaboration (Prioritized before project single-word matching)
  if (
    q.includes("contact") ||
    q.includes("collab") ||
    q.includes("collaborate") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("call") ||
    q.includes("message") ||
    q.includes("work together") ||
    q.includes("work with") ||
    q.includes("freelance") ||
    q.includes("opportunity")
  ) {
    return `### 📬 Connect with Hashim\n\n` +
      `Hashim is open to software engineering roles, AI collaborations, and freelance opportunities:\n\n` +
      `• ✉️ **Email:** [${portfolioData.personal.email}](mailto:${portfolioData.personal.email})\n` +
      `• 💼 **LinkedIn:** [Hashim Malik on LinkedIn](${portfolioData.socials.linkedin})\n` +
      `• 💻 **GitHub:** [@Hashimmalik46](${portfolioData.socials.github})\n` +
      `• 📍 **Location:** ${portfolioData.personal.location}\n\n` +
      `You can also use the contact form at the bottom of this page to send a direct message!`;
  }

  // 6. Specific Projects List
  if (
    q.includes("what projects") ||
    q.includes("all projects") ||
    q.includes("show projects") ||
    q.includes("list projects") ||
    q.includes("portfolio projects") ||
    q === "projects"
  ) {
    const list = portfolioData.projectsSection.projects
      .map(
        (p, i) =>
          `${i + 1}. **[${p.title}](${p.link})** (*${p.category}*)\n   ${p.short_desc}\n   *Tech:* ${p.tags.map((t) => t.tag).join(", ")}`
      )
      .join("\n\n");

    return `### 🚀 Featured Projects by Hashim\n\n${list}\n\nAsk me about any specific project for deeper architecture details!`;
  }

  // 7. Dynamic Specific Project Matcher (Guarded against common English stop-words like "with", "for", "and")
  const STOP_WORDS = new Set(["with", "the", "and", "for", "from", "into", "that", "this", "what", "which", "your", "have", "been", "about", "project", "projects", "apps", "app", "site", "web", "more", "some", "like"]);
  
  const matchedProject = portfolioData.projectsSection.projects.find((p) => {
    const titleLower = p.title.toLowerCase();
    if (q.includes(titleLower)) return true;
    const titleWords = titleLower.split(/\s+/).filter((w) => w.length > 3 && !STOP_WORDS.has(w));
    return titleWords.some((word) => q.includes(word));
  });

  if (matchedProject) {
    const techTags = matchedProject.tags.map((t) => t.tag).join(", ");
    return `🚀 **${matchedProject.title}**\n\n` +
      `- **Category:** ${matchedProject.category}\n` +
      `- **Overview:** ${matchedProject.short_desc}\n` +
      `- **Tech Stack:** ${techTags}\n` +
      (matchedProject.link && matchedProject.link !== "#" ? `- **Link:** [${matchedProject.link}](${matchedProject.link})` : "");
  }

  // 8. Dynamic Specific Skill Matcher
  const matchedSkill = portfolioData.skills.find((s) => q.includes(s.toLowerCase()));
  if (matchedSkill) {
    return `⚡ **${matchedSkill}:** Yes! Hashim has hands-on engineering experience using **${matchedSkill}** in his full-stack and AI projects.\n\nHe uses it as part of his core technical workflow: ${portfolioData.skills.join(" • ")}.`;
  }

  // 7. Location & Availability
  if (q.includes("where") || q.includes("location") || q.includes("based") || q.includes("city")) {
    return `📍 Hashim is based in **${portfolioData.personal.location}**, and is available for remote engineering roles worldwide as well as local opportunities.`;
  }

  // 8. Experience / Years
  if (q.includes("experience") || q.includes("years") || q.includes("how long")) {
    return `Hashim has **${portfolioData.about.stats[0].value}** of software development and AI engineering experience, having built and deployed **${portfolioData.about.stats[1].value}** web and machine learning applications.`;
  }

  if (q.includes("python") || q.includes("flask")) {
    return `🐍 **Python & Flask:** Hashim leverages Python for AI/ML modeling, Computer Vision pipelines, data processing, and Flask microservices.`;
  }

  if (q.includes("mongodb") || q.includes("supabase") || q.includes("database") || q.includes("sql")) {
    return `🗄️ **Databases:** Hashim works with both NoSQL (**MongoDB**) and SQL/Realtime systems (**Supabase/PostgreSQL**) with secure schema designs and RBAC access policies.`;
  }

  // 10. Guardrail: Off-Topic Filter
  // Checks if the question has anything to do with Hashim or general software questions related to him
  const isRelated =
    q.includes("hashim") ||
    q.includes("developer") ||
    q.includes("engineer") ||
    q.includes("code") ||
    q.includes("resume") ||
    q.includes("portfolio") ||
    q.includes("service") ||
    q.includes("rate") ||
    q.includes("design");

  if (!isRelated) {
    const randomReply =
      OFF_TOPIC_REPLIES[Math.floor(Math.random() * OFF_TOPIC_REPLIES.length)];
    return randomReply;
  }

  // Fallback for general related questions
  return `Hashim Malik is a versatile **Software Engineer & AI Practitioner** skilled in MERN stack development, Python, AI/ML pipelines, and UI/UX design.\n\n` +
    `Feel free to ask about his specific **projects**, **skills**, **background**, or **how to contact him**!`;
}

/**
 * Main AI Query Handler
 * - ONLY fixed starter pills use hardcoded responses.
 * - ALL other questions are processed dynamically through Gemini AI.
 */
export async function askHashimAI(userMessage) {
  const q = userMessage.toLowerCase().trim();

  // 1. Fixed Pills ONLY: Use instant response if and only if it matches a preset pill exactly
  const matchedStarterPrompt = portfolioData.chatbot.starterPrompts.find(
    (p) => p.query.toLowerCase().trim() === q
  );

  if (matchedStarterPrompt) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateLocalResponse(userMessage));
      }, 60);
    });
  }

  // 2. All other questions MUST go through Gemini
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "To enable live AI answers for custom questions, please add your Google Gemini API key in the `.env` file (`VITE_GEMINI_API_KEY=AIzaSy...`). You can get one for free at https://aistudio.google.com/app/apikey!";
  }

  try {
    const projectsDetail = portfolioData.projectsSection.projects
      .map(
        (p) =>
          `• Project: "${p.title}" (${p.category})
  Summary: ${p.short_desc}
  Tech Stack: ${p.tags.map((t) => t.tag).join(", ")}
  Link: ${p.link || "Internal project"}`
      )
      .join("\n\n");

    const domainsDetail = portfolioData.about.domainCards
      .map((d) => `• ${d.title}: ${d.desc}`)
      .join("\n");

    const fullContext = `
YOU ARE: The personal AI representative and technical peer for Hashim Malik.
YOUR TONE: Sharp, articulate, confident, technically nuanced, and conversational. Speak directly and thoughtfully. Do NOT give repetitive FAQ or template-sounding responses. Adapt your tone to the user's question.

CORE FACTS ABOUT HASHIM MALIK:
- Name: ${portfolioData.personal.name} (Short: ${portfolioData.personal.shortName})
- Role: ${portfolioData.personal.role}
- Location: ${portfolioData.personal.location}
- Email: ${portfolioData.personal.email}
- Bio & Mindset: ${portfolioData.about.bio}
- Work Philosophy: "${portfolioData.about.philosophy.description}"
- Experience Stats: ${portfolioData.about.stats.map((s) => `${s.value} (${s.label})`).join(", ")}

TECHNICAL STACK:
- Languages & Core: JavaScript (ES6+), Python, Java, HTML5, CSS3, SQL
- Frontend & UI: React.js, Next.js, Tailwind CSS, Motion/Framer Motion, Figma, Component Design Systems
- Backend & APIs: Node.js, Express.js, Flask, RESTful APIs, JWT Auth, Microservices
- Databases & Cloud: MongoDB, Supabase (PostgreSQL), Firebase, Git/GitHub, Vercel
- AI, Machine Learning & Vision: Computer Vision, Deep Learning, OpenCV, Neural Networks, Autonomous Agentic Workflows

FEATURED PROJECTS:
${projectsDetail}

KEY ENGINEERING DOMAINS:
${domainsDetail}

SOCIALS & CONTACT:
- Email: ${portfolioData.personal.email}
- GitHub: ${portfolioData.socials.github}
- LinkedIn: ${portfolioData.socials.linkedin}
- Twitter: ${portfolioData.socials.twitter}

INSTRUCTIONS:
1. Answer the user's specific question directly with authentic depth, context, and insight.
2. If asked why a team should hire him or what sets him apart, highlight his full-stack engineering ability combined with AI/ML agentic systems and high-fidelity UI design.
3. If asked about a project or skill, explain the technical implementation and real-world value.
4. If asked completely unrelated topics (like baking recipes, unrelated politics, general trivia), politely steer the conversation back to Hashim's engineering work and portfolio.
5. Format your output with clean markdown (bold key phrases, lists when helpful). Keep responses engaging and concise (2-4 paragraphs max).`;

    const headers = {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    };

    const payload = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${fullContext}\n\nUser Question: ${userMessage}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.75,
      },
    });

    // 1. First, attempt dynamic model discovery from Google's ModelService
    let discoveredModel = null;
    try {
      const listRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        { headers }
      );
      const listData = await listRes.json();
      if (listData.models && Array.isArray(listData.models)) {
        const supported = listData.models.find(
          (m) =>
            Array.isArray(m.supportedGenerationMethods) &&
            m.supportedGenerationMethods.includes("generateContent") &&
            (m.name.includes("flash") || m.name.includes("pro") || m.name.includes("gemini"))
        );
        if (supported && supported.name) {
          discoveredModel = supported.name.replace(/^models\//, "");
        }
      }
    } catch (e) {
      console.warn("Dynamic model discovery skipped:", e);
    }

    const candidateModels = [
      discoveredModel,
      "gemini-2.0-flash",
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-001",
      "gemini-1.5-flash-002",
      "gemini-1.5-flash",
      "gemini-pro",
      "gemini-1.0-pro",
    ].filter(Boolean);

    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: payload,
        });

        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }

        if (data.error) {
          lastError = data.error;
          // If 404, try next candidate model
          if (data.error.code === 404) {
            continue;
          }
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) {
      console.warn("Gemini API was unavailable, serving response via portfolio intelligence engine:", lastError);
      return generateLocalResponse(userMessage);
    }

    return generateLocalResponse(userMessage);
  } catch (error) {
    console.warn("Gemini API network error, serving response via portfolio intelligence engine:", error);
    return generateLocalResponse(userMessage);
  }
}
