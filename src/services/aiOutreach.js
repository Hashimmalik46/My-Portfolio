/**
 * AI Cold Outreach & Cover Letter Generation Engine
 * Universal multi-provider engine supporting Gemini, Grok, OpenAI, DeepSeek
 */

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROK_KEY = import.meta.env.VITE_GROK_API_KEY || import.meta.env.VITE_XAI_API_KEY || "";
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
const CUSTOM_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || "";
const PREFERRED_PROVIDER = (import.meta.env.VITE_AI_PROVIDER || "").toLowerCase();

export const OUTREACH_PRESETS = [
  {
    title: "⚡ Founder / Early-Stage Startup Pitch",
    company: "Supabase",
    role: "Full-Stack Engineer",
    recipient: "Antony (CEO)",
    recipientEmail: "antony@supabase.io",
    tone: "punchy",
    targetType: "founder",
    jd: "Looking for an autonomous full-stack engineer experienced with TypeScript, Node.js, PostgreSQL, and building real-time developer tooling.",
    userBackground: "4+ years building high-concurrency web apps, open-source maintainer, optimized database queries reducing P99 latency by 45%, proficient in React, Next.js, TypeScript, PostgreSQL.",
  },
  {
    title: "🚀 Scale-Up / High-Growth Team",
    company: "Linear",
    role: "Frontend Systems Engineer",
    recipient: "Karri (Head of Product)",
    recipientEmail: "karri@linear.app",
    tone: "startup",
    targetType: "eng_lead",
    jd: "Seeking a product-minded frontend engineer with extreme attention to UI details, micro-interactions, 60fps animations, and complex React state management.",
    userBackground: "Frontend engineer obsessed with visual craft, WebGL/Canvas micro-animations, design systems, and fluid physics in React/Tailwind. Created developer tools with 10k+ users.",
  },
  {
    title: "🏢 Big Tech / Corporate Cover Letter",
    company: "Stripe",
    role: "Software Engineer — Core Infrastructure",
    recipient: "Talent Acquisition Team",
    recipientEmail: "careers@stripe.com",
    tone: "formal",
    targetType: "recruiter",
    jd: "Build highly reliable distributed systems, developer APIs, and payment infrastructure handling millions of transactions per second.",
    userBackground: "Software engineer with background in distributed backend architecture, fault-tolerant microservices, AWS/Docker, and API design with 99.99% uptime guarantees.",
  },
];

function buildSystemPrompt() {
  return `You are a world-class Career Strategist and Executive Outreach Copywriter.
Your task is to generate high-converting, personalized cold outreach campaigns and cover letters based on the user's target company, role, recipient, and background.

CRITICAL RULES:
1. AVOID AI clichés like "I hope this email finds you well", "I am writing to express my enthusiasm", "thrilled to apply", "delve", "testament".
2. Focus on SPECIFIC VALUE, proof of work, and frictionless calls to action.
3. Cold emails must be ultra-concise (75–120 words).
4. LinkedIn DMs must be under 280 characters.
5. Cover letters must follow a compelling 3-paragraph executive narrative format.
6. Follow-up messages must be polite and low-pressure (35–50 words).

You MUST return ONLY a single valid raw JSON object (no markdown code blocks, backticks, or extra commentary) matching this schema:
{
  "subjectLines": [
    "Catchy, highly relevant subject line 1",
    "Direct, value-first subject line 2",
    "Curiosity / connection subject line 3"
  ],
  "coldEmail": "Full body of the cold email with clear line breaks.",
  "linkedinDm": "Short, punchy LinkedIn / Twitter direct message under 280 characters.",
  "coverLetter": "Formal, high-impact 3-paragraph narrative cover letter.",
  "followUp": "Polite follow-up message to send 3-5 days later."
}`;
}

function buildUserPrompt(params) {
  const {
    company = "the company",
    role = "Software Engineer",
    recipient = "Hiring Team",
    recipientEmail = "",
    tone = "punchy",
    targetType = "founder",
    jd = "",
    userBackground = "",
    senderName = "Alex Morgan",
  } = params;

  return `Generate a complete cold outreach pack for the following opportunity:

TARGET COMPANY: ${company}
TARGET ROLE: ${role}
RECIPIENT NAME / TITLE: ${recipient} (${targetType})
TONE OF VOICE: ${tone} (e.g. punchy = direct & founder-friendly, startup = energetic & product-focused, formal = enterprise & executive)
JOB REQUIREMENTS / JD CONTEXT:
${jd || "General software engineering and technical excellence"}

CANDIDATE BACKGROUND & HIGHLIGHTS:
${userBackground || "Full-stack engineer with strong technical track record and proven product delivery."}

SENDER NAME: ${senderName || "Alex Morgan"}
${recipientEmail ? `RECIPIENT EMAIL: ${recipientEmail}` : ""}`;
}

/**
 * Extracts and cleans JSON from raw AI text output
 */
function extractAndParseJson(rawText) {
  let cleaned = (rawText || "").trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * Universal AI Outreach Generator
 * Strictly calls the real AI providers without fake local fallbacks.
 */
export async function generateOutreachWithAI(params, signal) {
  const apiKey = GEMINI_KEY || GROK_KEY || OPENAI_KEY || DEEPSEEK_KEY;

  if (!apiKey && !CUSTOM_ENDPOINT) {
    throw new Error("AI Generation is temporarily unavailable. Please try again later.");
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(params);

  // 1. Google Gemini Provider
  if (GEMINI_KEY || PREFERRED_PROVIDER === "gemini") {
    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.7-flash",
      "gemini-2.0-flash",
    ];
    let lastGeminiErr = null;

    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal,
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${systemPrompt}\n\n${userPrompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 2500,
            },
          }),
        });

        const data = await res.json();

        if (data.error) {
          lastGeminiErr = new Error(data.error.message || "Gemini API error");
          continue;
        }

        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) continue;

        return extractAndParseJson(rawText);
      } catch (err) {
        if (signal?.aborted) throw err;
        lastGeminiErr = err;
      }
    }

    if (lastGeminiErr && !GROK_KEY && !OPENAI_KEY && !DEEPSEEK_KEY) {
      throw new Error(lastGeminiErr.message || "Failed to generate outreach with AI. Please try again.");
    }
  }

  // 2. OpenAI / Grok / DeepSeek Provider
  if (GROK_KEY || OPENAI_KEY || DEEPSEEK_KEY || CUSTOM_ENDPOINT) {
    const providerEndpoint =
      CUSTOM_ENDPOINT ||
      (GROK_KEY ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions");
    const openAiKey = GROK_KEY || OPENAI_KEY || DEEPSEEK_KEY;
    const model = GROK_KEY ? "grok-2-latest" : "gpt-4o-mini";

    const res = await fetch(providerEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        response_format: { type: "json_object" },
      }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message || "AI service error");
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Received empty response from AI service.");
    }

    return extractAndParseJson(content);
  }

  throw new Error("AI Generation failed. Please check your API key or connection and try again.");
}
