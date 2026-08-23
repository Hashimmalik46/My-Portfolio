/**
 * Universal AI Resume Generation & Hydration Engine
 * Universal multi-provider engine supporting Gemini, Grok, OpenAI, DeepSeek
 */

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROK_KEY = import.meta.env.VITE_GROK_API_KEY || import.meta.env.VITE_XAI_API_KEY || "";
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
const CUSTOM_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || "";
const PREFERRED_PROVIDER = (import.meta.env.VITE_AI_PROVIDER || "").toLowerCase();

function buildSystemPrompt(existingProfile = {}) {
  const profileContext = existingProfile && existingProfile.name
    ? `
CANDIDATE IDENTITY CONTEXT (Preserve this candidate name and contact information unless the user prompt explicitly specifies a different name):
- Name: "${existingProfile.name}"
- Location: "${existingProfile.location || ""}"
- Email: "${existingProfile.email || ""}"
- Phone: "${existingProfile.phone || ""}"
- LinkedIn: "${existingProfile.linkedin || ""}"
- GitHub: "${existingProfile.github || ""}"
- Website: "${existingProfile.website || ""}"
`
    : `
CANDIDATE IDENTITY CONTEXT:
- If no candidate name is specified in the prompt, set "name": "YOUR NAME" (DO NOT invent fictional names like Alex Mercer).
`;

  return `
You are an expert ATS Resume Writer and Career Strategist.
Your task is to generate a comprehensive, highly tailored, ATS-compliant resume based on the user's prompt or raw experience notes.

You MUST respond ONLY with a single valid, raw JSON object (without markdown code blocks, backticks, or extra commentary).

The JSON MUST strictly follow this exact structure:
{
  "name": "Candidate Full Name",
  "location": "City, Country / Remote",
  "email": "email@example.com",
  "phone": "+1 (555) 000-0000",
  "linkedin": "linkedin.com/in/username",
  "github": "github.com/username",
  "website": "portfolio-or-domain.com",
  "targetRole": "Target Job Title / Engineering Role",
  "summary": "Concise 2-3 sentence impactful professional summary highlighting years of experience, core technical specialties, and business impact.",
  "sectionTitles": {
    "summary": "Professional Summary",
    "skills": "Technical Skills",
    "experience": "Engineering Experience",
    "projects": "Featured Projects",
    "education": "Education & Credentials"
  },
  "skillCategories": {
    "Languages & Core": "JavaScript, TypeScript, Python, Java",
    "Frameworks & Libraries": "React, Node.js, Express, Next.js, Tailwind CSS",
    "Cloud & DevOps": "AWS, Docker, Kubernetes, CI/CD, Git",
    "Databases & Storage": "PostgreSQL, MongoDB, Redis, Supabase"
  },
  "experience": [
    {
      "role": "Role Title",
      "organization": "Company Name",
      "location": "Location / Remote",
      "period": "2022 - Present",
      "bullets": [
        "Action-oriented bullet point with quantified metrics (e.g. Improved performance by 40% using...)",
        "Engineered scalable systems or solved complex challenges...",
        "Collaborated cross-functionally to deliver..."
      ]
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "tech": "Key Technologies Used",
      "bullets": [
        "Architected and deployed full-stack system with...",
        "Implemented real-time features resulting in..."
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree and Major (e.g. B.S. in Computer Science)",
      "institution": "University / Institution Name",
      "location": "City, State / Country",
      "period": "2018 - 2022",
      "grade": "GPA or Honors (optional)",
      "details": "Relevant coursework or achievements (optional)"
    }
  ]
}

${profileContext}

Guidelines:
1. Use professional, modern technical resume phrasing (strong action verbs like Engineered, Architected, Spearheaded, Optimized).
2. Generate 2 to 4 rich bullet points per role and project with realistic metrics.
3. If the user prompt is brief, intelligently extrapolate realistic, high-quality projects, technical skills, and achievements matching the requested role/level.
4. Keep all contact and profile info aligned with the Candidate Identity Context.
`;
}

/**
 * Validates and sanitizes the parsed JSON object to prevent runtime errors.
 */
export function sanitizeResumePayload(data, existingProfile = {}) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response format from AI. Expected a JSON object.");
  }

  // Preserve existing profile name if AI returned a placeholder or generic name
  let name = typeof data.name === "string" && data.name.trim() ? data.name.trim() : "";
  if ((!name || name.toLowerCase() === "candidate full name" || name.toLowerCase() === "full name" || name.toLowerCase() === "your name") && existingProfile?.name) {
    name = existingProfile.name;
  }
  if (!name) name = "YOUR NAME";

  return {
    name,
    location: (typeof data.location === "string" && data.location.trim()) || existingProfile?.location || "",
    email: (typeof data.email === "string" && data.email.trim()) || existingProfile?.email || "",
    phone: (typeof data.phone === "string" && data.phone.trim()) || existingProfile?.phone || "",
    linkedin: (typeof data.linkedin === "string" && data.linkedin.trim()) || existingProfile?.linkedin || "",
    github: (typeof data.github === "string" && data.github.trim()) || existingProfile?.github || "",
    website: (typeof data.website === "string" && data.website.trim()) || existingProfile?.website || "",
    targetRole: typeof data.targetRole === "string" ? data.targetRole.trim() : "Software Engineer",
    summary: typeof data.summary === "string" ? data.summary.trim() : "",
    sectionTitles: {
      summary: data.sectionTitles?.summary || "Professional Summary",
      skills: data.sectionTitles?.skills || "Technical Skills",
      experience: data.sectionTitles?.experience || "Engineering Experience",
      projects: data.sectionTitles?.projects || "Featured Projects",
      education: data.sectionTitles?.education || "Education & Credentials",
    },
    skillCategories:
      data.skillCategories && typeof data.skillCategories === "object" && !Array.isArray(data.skillCategories)
        ? data.skillCategories
        : {
            "Languages & Frameworks": "JavaScript, TypeScript, React, Node.js",
            "Tools & Technologies": "Git, Docker, REST APIs, SQL",
          },
    experience: Array.isArray(data.experience)
      ? data.experience.map((exp) => ({
          role: exp?.role || "Software Engineer",
          organization: exp?.organization || "Tech Company",
          location: exp?.location || "",
          period: exp?.period || "2023 - Present",
          bullets: Array.isArray(exp?.bullets) && exp.bullets.length > 0 ? exp.bullets : ["Contributed to core engineering development."],
        }))
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map((proj) => ({
          title: proj?.title || "Project",
          tech: proj?.tech || "",
          bullets: Array.isArray(proj?.bullets) && proj.bullets.length > 0 ? proj.bullets : ["Built key application systems."],
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((edu) => ({
          degree: edu?.degree || "B.S. in Computer Science",
          institution: edu?.institution || "University",
          location: edu?.location || "",
          period: edu?.period || "2020 - 2024",
          grade: edu?.grade || "",
          details: edu?.details || "",
        }))
      : [],
  };
}

/**
 * Extracts and parses JSON from raw text safely even if wrapped in markdown fences.
 */
export function extractAndParseJson(rawText) {
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
 * Call Google Gemini Provider
 */
async function callGemini(prompt, apiKey = GEMINI_KEY, existingProfile = {}) {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const candidateModels = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-2.0-flash",
  ];

  const systemPrompt = buildSystemPrompt(existingProfile);

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\nUSER PROMPT / BACKGROUND DETAILS:\n"${prompt.trim()}"`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 2800,
    },
  };

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.error) {
        lastError = new Error(result.error.message || "Gemini API error");
        continue;
      }

      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = extractAndParseJson(rawText);
      return sanitizeResumePayload(parsed, existingProfile);
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "Failed to generate resume with Gemini AI.");
}

/**
 * Call OpenAI-Compatible Providers (OpenAI, xAI Grok, DeepSeek, OpenRouter)
 */
async function callOpenAICompatible({ prompt, apiKey, endpoint, modelName, existingProfile = {} }) {
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }

  const systemPrompt = buildSystemPrompt(existingProfile);

  const payload = {
    model: modelName,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate an ATS resume for: "${prompt.trim()}"` },
    ],
    temperature: 0.6,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error.message || `AI service error: ${JSON.stringify(result.error)}`);
  }

  const rawText = result.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error("Received empty response from AI service.");
  }

  const parsed = extractAndParseJson(rawText);
  return sanitizeResumePayload(parsed, existingProfile);
}

/**
 * Universal Resume Generation
 * Strictly generates with real AI providers and throws clear errors if unavailable.
 */
export async function generateResumeWithAI(prompt, existingProfile = {}) {
  if (!prompt || !prompt.trim()) {
    throw new Error("Please provide a prompt or description of your background and target role.");
  }

  const activeKey = GEMINI_KEY || GROK_KEY || OPENAI_KEY || DEEPSEEK_KEY;
  if (!activeKey && !CUSTOM_ENDPOINT) {
    throw new Error("AI Generation is temporarily unavailable. Please try again later.");
  }

  // 1. Explicit provider override
  if (PREFERRED_PROVIDER === "grok" && GROK_KEY) {
    return await callOpenAICompatible({
      prompt,
      apiKey: GROK_KEY,
      endpoint: "https://api.x.ai/v1/chat/completions",
      modelName: "grok-2-latest",
      existingProfile,
    });
  }

  if (PREFERRED_PROVIDER === "openai" && OPENAI_KEY) {
    return await callOpenAICompatible({
      prompt,
      apiKey: OPENAI_KEY,
      endpoint: "https://api.openai.com/v1/chat/completions",
      modelName: "gpt-4o-mini",
      existingProfile,
    });
  }

  if (PREFERRED_PROVIDER === "deepseek" && DEEPSEEK_KEY) {
    return await callOpenAICompatible({
      prompt,
      apiKey: DEEPSEEK_KEY,
      endpoint: CUSTOM_ENDPOINT || "https://api.deepseek.com/chat/completions",
      modelName: "deepseek-chat",
      existingProfile,
    });
  }

  // 2. Cascade through available keys
  let lastErr = null;

  if (GEMINI_KEY) {
    try {
      return await callGemini(prompt, GEMINI_KEY, existingProfile);
    } catch (e) {
      lastErr = e;
      console.warn("Gemini error, attempting alternative provider:", e);
    }
  }

  if (GROK_KEY) {
    try {
      return await callOpenAICompatible({
        prompt,
        apiKey: GROK_KEY,
        endpoint: "https://api.x.ai/v1/chat/completions",
        modelName: "grok-2-latest",
        existingProfile,
      });
    } catch (e) {
      lastErr = e;
    }
  }

  if (OPENAI_KEY) {
    try {
      return await callOpenAICompatible({
        prompt,
        apiKey: OPENAI_KEY,
        endpoint: "https://api.openai.com/v1/chat/completions",
        modelName: "gpt-4o-mini",
        existingProfile,
      });
    } catch (e) {
      lastErr = e;
    }
  }

  if (DEEPSEEK_KEY) {
    try {
      return await callOpenAICompatible({
        prompt,
        apiKey: DEEPSEEK_KEY,
        endpoint: CUSTOM_ENDPOINT || "https://api.deepseek.com/chat/completions",
        modelName: "deepseek-chat",
        existingProfile,
      });
    } catch (e) {
      lastErr = e;
    }
  }

  throw new Error("Unable to generate resume right now. Please try again.");
}

/**
 * Backward compatibility alias
 */
export async function generateResumeWithGemini(prompt, existingProfile = {}) {
  return generateResumeWithAI(prompt, existingProfile);
}
