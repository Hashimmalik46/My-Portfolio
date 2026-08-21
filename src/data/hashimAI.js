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

  // 5. Specific Projects
  if (
    q.includes("project") ||
    q.includes("work") ||
    q.includes("portfolio") ||
    q.includes("built") ||
    q.includes("apps")
  ) {
    const list = portfolioData.projectsSection.projects
      .map(
        (p, i) =>
          `${i + 1}. **[${p.title}](${p.link})** (*${p.category}*)\n   ${p.short_desc}\n   *Tech:* ${p.tags.map((t) => t.tag).join(", ")}`
      )
      .join("\n\n");

    return `### 🚀 Featured Projects by Hashim\n\n${list}\n\nAsk me about any specific project for deeper architecture details!`;
  }

  // Dynamic Specific Project Matcher: Checks if user query matches ANY project in portfolioData
  const matchedProject = portfolioData.projectsSection.projects.find((p) => {
    const titleWords = p.title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    return titleWords.some((word) => q.includes(word)) || (p.link && p.link !== "#" && q.includes(p.link.toLowerCase().replace(/https?:\/\/(www\.)?/, "").split(".")[0]));
  });

  if (matchedProject) {
    const techTags = matchedProject.tags.map((t) => t.tag).join(", ");
    return `🚀 **${matchedProject.title}**\n\n` +
      `- **Category:** ${matchedProject.category}\n` +
      `- **Overview:** ${matchedProject.short_desc}\n` +
      `- **Tech Stack:** ${techTags}\n` +
      (matchedProject.link && matchedProject.link !== "#" ? `- **Link:** [${matchedProject.link}](${matchedProject.link})` : "");
  }

  // Dynamic Specific Skill Matcher: Checks if user query matches ANY skill in portfolioData
  const matchedSkill = portfolioData.skills.find((s) => q.includes(s.toLowerCase()));
  if (matchedSkill) {
    return `⚡ **${matchedSkill}:** Yes! Hashim has hands-on engineering experience using **${matchedSkill}** in his full-stack and AI projects.\n\nHe uses it as part of his core technical workflow: ${portfolioData.skills.join(" • ")}.`;
  }

  // 6. Contact, Hiring & Collaboration
  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("call") ||
    q.includes("message") ||
    q.includes("work together") ||
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
 * Checks for live Gemini API Key (if provided in environment) or uses the instant local knowledge engine.
 */
export async function askHashimAI(userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // Return instant local intelligence response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateLocalResponse(userMessage));
      }, 450); // slight natural cadence
    });
  }

  // If Gemini API Key exists in .env, query Gemini with strict grounding system prompt
  try {
    const prompt = `${portfolioData.chatbot.systemPrompt}

CONTEXT ABOUT HASHIM MALIK:
${JSON.stringify(portfolioData, null, 2)}

User Question: ${userMessage}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    return generateLocalResponse(userMessage);
  } catch (error) {
    console.error("Gemini API error, falling back to local engine:", error);
    return generateLocalResponse(userMessage);
  }
}
