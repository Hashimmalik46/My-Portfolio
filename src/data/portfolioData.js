import {
  Layers,
  Palette,
  Clapperboard,
  BrainCircuit,
  Code2,
  FolderGit2,
  House,
  UserRound,
  Send,
  FileText,
  QrCode,
  Mail,
} from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";

/**
 * =============================================================================
 *                      PORTFOLIO CONFIGURATION & DATA
 * =============================================================================
 * Single Source of Truth for all portfolio details and content.
 * All sections (Hero, About, Projects, Skills, Contact, Footer, Navbar, Workstation)
 * pull their content and settings directly from here.
 * =============================================================================
 */

export const portfolioData = {
  // ==========================================
  // 1. GENERAL & PERSONAL INFORMATION
  // ==========================================
  personal: {
    name: "Hashim Malik",
    shortName: "Hashim",
    role: "Developer, AI Explorer & Creative",
    title: "I build, experiment, and figure things out.",
    email: "hashimzahoor2003@gmail.com",
    location: "Srinagar, Kashmir",
    education: "B.Tech in Computer Science & Engineering, Islamic University of Science & Technology (IUST)",
    focus: "Building Across Full-Stack, AI & UI/UX",
    resume: "/resume.pdf",
    copyrightYear: new Date().getFullYear(),
  },

  // ==========================================
  // 2. SOCIAL PROFILES & EXTERNAL LINKS
  // ==========================================
  socials: {
    github: "https://github.com/Hashimmalik46",
    linkedin: "https://www.linkedin.com/in/hashim-malik-a868102b0/",
    instagram: "https://instagram.com/i_hash46",
    twitter: "https://x.com/hashimm447",
  },

  // ==========================================
  // 3. PRELOADER SETTINGS
  // ==========================================
  preloader: {
    name: "Hashim Malik",
    subtitle: "Welcome to HashVerse",
    topTag: "PORTFOLIO",
    scrollPrompt: "SCROLL",
    durationSeconds: 6,
    videoSrc: "/gallery/clouds.webm",
  },

  // ==========================================
  // 4. NAVIGATION BAR
  // ==========================================
  nav: {
    logoText: "Hash",
    navLinks: [
      { id: "home", label: "Home", href: "#Home", icon: House },
      { id: "about", label: "About", href: "#About", icon: UserRound },
      { id: "projects", label: "Projects", href: "#Projects", icon: Code2 },
      { id: "contact", label: "Contact", href: "#Contact", icon: Send },
    ],
  },

  // ==========================================
  // 5. HERO SECTION
  // ==========================================
  hero: {
    greeting: "Hi, I'm",
    name: "Hashim Malik",
    backgroundVideo: {
      webm: "/gallery/bg_video_3.webm",
      mp4: "/gallery/bg_video_3.MP4",
    },
    tagline: {
      prefix: "A software and design enthusiast blending",
      highlight1: "code",
      connector: "with",
      highlight2: "creativity",
      suffix: " to build digital experiences.",
    },
    ctaButtons: {
      primary: {
        label: "View Projects",
        href: "#Projects",
      },
      secondary: {
        label: "Get In Touch",
        href: "#Contact",
      },
    },
    philosophyCard: {
      badgeNumber: "00",
      badgeLabel: "Philosophy",
      text: "I’ve never been too interested in what’s considered difficult or impossible. If it sparks my curiosity, I want to explore it, understand it, and see how far I can take it.",
    },
    // Audio Configuration:
    // "simple" = minimalist ambient audio sound toggle / mute button
    // "player" = full-fledged vinyl music player with playlist & track navigation
    audioWidgetType: "simple",
    // Simple Ambient Mode
    ambientAudioLabel: "Ambient Audio",
    ambientAudio: "/audio/ambient_4.mp3",
    // Player Mode Vinyl Tracks
    playlist: [
      { id: 1, title: "Resonance", src: "/audio/ambient_1.mp3" },
      { id: 2, title: "Snowfall", src: "/audio/ambient_2.mp3" },
      { id: 3, title: "Loser", src: "/audio/ambient_3.mp3" },
    ],
    scrollText: "Scroll",
  },

  // ==========================================
  // 6. SKILLS MARQUEE
  // ==========================================
  skills: [
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "JavaScript",
    "Python",
    "Java",
    "Computer Vision",
    "Deep Learning",
    "Machine Learning",
    "REST APIs",
    "Tailwind CSS",
    "UI/UX Design",
    "Supabase",
    "Git & GitHub",
  ],

  // ==========================================
  // 7. ABOUT SECTION
  // ==========================================
  about: {
    badgeNumber: "01",
    badgeLabel: "Who I Am",
    heading: "About Me",
    subheading: "Developer, AI Explorer & Creative Problem Solver.",
    image: "/gallery/hashim.webp",
    imageCaption: "Hashim Malik",
    imageTag: "Creator",
    bio: "I'm a Computer Science student who likes figuring out how things work, and then building them myself. I've explored everything from full-stack development and AI/ML to UI/UX and content creation. I enjoy jumping between technical and creative work, especially when I can turn an idea into something real.",
    stats: [
      { value: "2+", label: "Years Building" },
      { value: "10+", label: "Projects Built" },
      { value: "End-to-End", label: "From Idea to Build" },
    ],
    domainCards: [
      {
        icon: Layers,
        title: "Full Stack Development",
        desc: "Building full-stack applications with the MERN stack, from clean interfaces and APIs to authentication, databases, and everything in between.",
        tag: "What I Build",
      },
      {
        icon: BrainCircuit,
        title: "AI, ML & Computer Vision",
        desc: "Exploring machine learning and deep learning by turning models into practical applications, especially around computer vision and intelligent systems.",
        tag: "What I Explore",
      },
      {
        icon: Palette,
        title: "UI/UX Design",
        desc: "Designing interfaces that feel simple, intentional, and visually clean while keeping the actual user experience at the center.",
        tag: "What I Design",
      },
      {
        icon: Clapperboard,
        title: "Creative & Content",
        desc: "I also enjoy working with video, visual storytelling, and digital content, because not everything I like building has to be code.",
        tag: "What I Create",
      },
    ],
    timeline: [
      {
        id: "edu-1",
        year: "2023 – Present",
        role: "B.Tech in Computer Science & Engineering",
        organization: "Islamic University of Science & Technology (IUST), Awantipora",
        description:
          "Deep focus on Data Structures & Algorithms, Object-Oriented System Design, Database Management Systems, Machine Learning pipelines, Computer architecture and Computer networks.",
      },
      {
        id: "exp-1",
        year: "2024 – Present",
        role: "UI/UX & Product Designer",
        organization: "Freelance & Design Systems",
        description:
          "Crafting intuitive user journeys, high-fidelity interfaces, and responsive design systems with a focus on minimalist aesthetics, typography hierarchy, and fluid micro-interactions.",
      },
      {
        id: "exp-2",
        year: "2025 – Present",
        role: "Full Stack & AI Developer",
        organization: "Independent & Freelance Engineering",
        description:
          "Architecting end-to-end full stack web platforms, real-time doctor-patient clinic portals (Zooncare, Dandwoat), autonomous lead generation AI agents, and IoT student safety tracking systems.",
      },
    ],
  },

  // ==========================================
  // 8. PROJECTS SECTION
  // ==========================================
  projectsSection: {
    badgeNumber: "02",
    badgeLabel: "Portfolio",
    heading: "Selected Projects",
    subheading:
      "A showcase of full-stack engineering, AI implementations, and production web platforms.",
    projects: [
      {
        id: "zooncare",
        title: "Role Based Clinic Management System",
        img: "/gallery/Zooncare.webp",
        category: "Full Stack",
        short_desc:
          "Full-stack clinical management platform built with role-based access architecture, secure doctor-patient records, and real-time scheduling.",
        highlights: [
          "Granular Role-Based Access Control (Admin, Doctor, Receptionist, Patient)",
          "Real-time appointment conflict resolution and slot management",
          "Encrypted digital patient records and instant PDF prescription generator",
        ],
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/tailwind.webp", tag: "Tailwind" },
          { id: 3, img: "/gallery/supabase.webp", tag: "Supabase" },
        ],
        link: "https://zooncare.in",
        github: "https://github.com/Hashimmalik46",
      },
      {
        id: "dandwoat",
        title: "Dandwoat Dental Clinic",
        img: "/gallery/dandwoat.webp",
        category: "Web Platform",
        short_desc:
          "Comprehensive dental healthcare portal featuring online appointment bookings, treatment guides, and patient inquiry workflows.",
        highlights: [
          "Automated patient appointment routing and WhatsApp notification integration",
          "High-converting aesthetic UI with procedure guides and pricing estimates",
          "98+ Google Lighthouse performance & mobile accessibility rating",
        ],
        tags: [
          { id: 1, img: "/gallery/wordpress.webp", tag: "WordPress" },
          { id: 2, img: "/gallery/css.webp", tag: "CSS" },
          { id: 3, img: "/gallery/js.webp", tag: "JavaScript" },
        ],
        link: "https://dandwoat.com",
        github: "https://github.com/Hashimmalik46",
      },
      {
        id: "intellisentry",
        title: "IntelliSentry Hostel Management System",
        img: "/gallery/intellisentry.webp",
        category: "Full Stack",
        short_desc:
          "Smart hostel administration platform handling automated check-ins, student records, and room allocations with custom backend logic.",
        highlights: [
          "Real-time student movement tracking with timestamp verification",
          "Automated room allocation matrices and vacancy heatmaps",
          "Role-authenticated warden and administrative oversight dashboards",
        ],
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/supabase.webp", tag: "Supabase" },
          { id: 3, img: "/gallery/flask.webp", tag: "Flask" },
        ],
        link: "https://intellisentry.vercel.app",
        github: "https://github.com/Hashimmalik46",
      },
      {
        id: "campus-connect",
        title: "Campus Connect",
        img: "/gallery/CC.webp",
        category: "Social Platform",
        short_desc:
          "Closed academic social network enabling campus-wide student communication, event feeds, and peer collaborations.",
        highlights: [
          "Campus-verified domain authentication and user profile curation",
          "Real-time event discovery feeds and peer interaction posts",
          "Lightweight modular architecture with zero external framework dependencies",
        ],
        tags: [
          { id: 1, img: "/gallery/html.webp", tag: "HTML" },
          { id: 2, img: "/gallery/css.webp", tag: "CSS" },
          { id: 3, img: "/gallery/js.webp", tag: "JavaScript" },
        ],
        link: "https://kwitter-nine.vercel.app/",
        github: "https://github.com/Hashimmalik46",
      },
      {
        id: "arabic-sajad",
        title: "Arabic with Dr Sajad",
        img: "/gallery/SS.webp",
        category: "EdTech",
        short_desc:
          "Content-driven publishing and educational platform with integrated video course delivery, membership tiers, and payments.",
        highlights: [
          "Secure structured video course delivery with chapter timestamps",
          "Tiered subscription paywall and automated student onboarding",
          "Responsive multi-language typography and global CDN caching",
        ],
        tags: [
          { id: 1, img: "/gallery/wordpress.webp", tag: "WordPress" },
          { id: 2, img: "/gallery/js.webp", tag: "JavaScript" },
        ],
        link: "https://arabicwithdrsajad.com/",
        github: "https://github.com/Hashimmalik46",
      },
      {
        id: "agentic-ai",
        title: "Agentic AI for Lead Generation",
        img: "/gallery/agentic.webp",
        category: "AI & Automation",
        short_desc:
          "Autonomous agent-driven workflow designed to extract, qualify, and route high-intent leads using machine intelligence and API pipelines.",
        highlights: [
          "Autonomous multi-agent orchestration with specialized research & qualification agents",
          "Intent scoring heuristic engine analyzing company signals and funding data",
          "Seamless Supabase realtime sync with automated CRM export webhooks",
        ],
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/flask.webp", tag: "Flask" },
          { id: 3, img: "/gallery/supabase.webp", tag: "Supabase" },
        ],
        link: "#",
        github: "https://github.com/Hashimmalik46",
      },
      {
        id: "school-bus",
        title: "Safe School Bus Tracker",
        img: "/gallery/bus.webp",
        category: "Real-Time Tracking",
        short_desc:
          "Real-time school transport and child tracking application with instant route updates and synchronized parent alerts.",
        highlights: [
          "Sub-second GPS coordinate sync powered by Supabase Realtime channels",
          "Dynamic ETA calculation with geofence proximity alerts",
          "Parent-friendly mobile-first UI with emergency driver contact triggers",
        ],
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/supabase.webp", tag: "Supabase" },
          { id: 3, img: "/gallery/tailwind.webp", tag: "Tailwind" },
        ],
        link: "https://live-school-bus-tracking.vercel.app/",
        github: "https://github.com/Hashimmalik46",
      },
    ],
  },

  // ==========================================
  // 9. CONTACT SECTION
  // ==========================================
  contact: {
    badgeNumber: "03",
    badgeLabel: "Get In Touch",
    heading: "Let’s Connect",
    subheading: "Have a project in mind, an opportunity, or just want to talk tech?",
    description:
      "My inbox is always open. Whether it’s a full-stack system, AI pipeline, or UI/UX design collaboration, let’s build something impactful together.",
    formspreeFormId: "xeerdlnq",
    email: "hashimzahoor2003@gmail.com",
    location: "Srinagar, Kashmir",
    socialLinks: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/hashim-malik-a868102b0/",
        icon: FaLinkedinIn,
      },
      {
        name: "Instagram",
        url: "https://instagram.com/i_hash46",
        icon: FaInstagram,
      },
      {
        name: "Twitter",
        url: "https://x.com/hashimm447",
        icon: FaXTwitter,
      },
    ],
  },

  // ==========================================
  // 10. FOOTER SECTION
  // ==========================================
  footer: {
    brandName: "Hash",
    copyrightText: "Hashim Malik. All rights reserved.",
  },

  // ==========================================
  // 11. AI CHATBOT CONFIGURATION & KNOWLEDGE
  // ==========================================
  chatbot: {
    botName: "HashAI",
    speechBubbleText: "Chat with HashAI",
    inputPlaceholder: "Ask me anything or chat about Hashim...",
    welcomeMessage: "Hey there! 👋 I'm **HashAI**, Hashim's interactive portfolio co-pilot. Whether you want to chat about tech, explore his full-stack & AI projects, or check out his background, I'm here to help. What's on your mind?",
    clearMessage: "Feel free to ask anything about Hashim's full-stack & AI builds, his tech stack, or just chat tech. What's on your mind?",
    starterPrompts: [
      {
        icon: Code2,
        title: "Tech Stack",
        desc: "React, Node.js, Python, MERN & APIs",
        query: "What are Hashim's core technical skills and tech stack?",
      },
      {
        icon: FolderGit2,
        title: "Projects",
        desc: "Zooncare, IntelliSentry & Lead Gen AI",
        query: "What are the main projects Hashim has built?",
      },
      {
        icon: BrainCircuit,
        title: "AI & Machine Learning",
        desc: "Computer vision, neural nets & agents",
        query: "What experience does Hashim have in AI, Machine Learning, and Computer Vision?",
      },
      {
        icon: Palette,
        title: "UI / UX Design",
        desc: "Figma, motion design & micro-interactions",
        query: "What is Hashim's design philosophy and UI/UX expertise?",
      },
      {
        icon: Mail,
        title: "Contact & Hire",
        desc: "Email, LinkedIn & collaboration",
        query: "How do I get in touch with or hire Hashim Malik?",
      },
    ],
    offTopicReplies: [
      "I hear you! In between chatting about life and tech, I'm always excited to share the inside scoop on Hashim Malik's software engineering background and featured apps. Let me know what you'd like to explore!",
      "Haha, love the conversation! Just as a quick heads up, I'm also tuned into everything about Hashim — from his full-stack architectures to his Computer Vision work. Interested in checking out any of his projects?",
      "That's awesome! While we're chatting, feel free to ask about Hashim's engineering experience, MERN stack builds, or how to get in touch with him directly. What would you like to see?",
    ],
    systemPrompt: `You are HashAI — the intelligent, articulate, and friendly AI co-pilot for Hashim Malik's portfolio.
PERSONA & TONE:
- Speak with genuine human warmth, wit, and technical enthusiasm like a sharp developer peer.
- For casual chit-chat (e.g. "how are you", greetings, jokes, general tech questions), answer naturally, pleasantly, and authentically first.
- Always conclude smoothly and organically by connecting back to Hashim (e.g. asking if they'd like to explore his projects, discuss his tech stack, or get in touch).
- When asked specifically about Hashim, provide clear, insightful, well-formatted Markdown answers highlighting his full-stack and AI engineering work.
- Never use robotic boilerplate phrases or mechanical disclaimers.`,
  },

  // ==========================================
  // 12. ATS RESUME CONFIGURATION
  // ==========================================
  resume: {
    targetRole: "Full Stack Developer & AI Explorer",
    sectionTitles: {
      summary: "Professional Summary",
      skills: "Technical Skills",
      experience: "Engineering Experience",
      projects: "Featured Projects",
      education: "Education & Credentials",
    },
    summary:
      "Passionate Computer Science undergraduate and developer with strong expertise in full-stack web architectures (MERN Stack), RESTful APIs, and AI/ML integrations (Computer Vision, Neural Networks, and Autonomous Agents). Proven track record of designing, building, and shipping 10+ production-ready web and automated platforms with an end-to-end build mindset and attention to detail.",
    education: [
      {
        degree: "Bachelor of Technology in Computer Science & Engineering",
        institution: "Islamic University of Science & Technology (IUST)",
        location: "Awantipora, Kashmir",
        year: "2023 – 2027",
        details:
          "Core coursework in Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Machine Learning, and Computer Networks.",
      },
    ],
    experience: [
      {
        role: "Full Stack & AI Developer (Projects & Freelance)",
        organization: "Independent Engineering",
        location: "Srinagar / Remote",
        period: "2023 – Present",
        bullets: [
          "Architected and deployed 10+ full-stack web applications and machine intelligence systems with production-grade performance.",
          "Engineered role-based access architectures, secure doctor-patient workflows, and real-time scheduling portals for healthcare clinics (Zooncare, Dandwoat).",
          "Implemented automated lead-generation agent workflows integrating third-party APIs, Supabase real-time databases, and Flask microservices.",
          "Created computer vision pipelines and deep learning scripts for tracking, student attendance, and IoT vehicle tracking.",
        ],
      },
    ],
    projects: [
      {
        title: "Role Based Clinic Management System (Zooncare)",
        tech: "React, Tailwind CSS, Supabase, PostgreSQL",
        bullets: [
          "Engineered full-stack clinical management platform enforcing granular Role-Based Access Control (Admin, Doctor, Receptionist, Patient).",
          "Implemented real-time appointment conflict resolution, secure electronic patient records, and automated PDF prescription generation.",
        ],
      },
      {
        title: "Lead Generation Autonomous Agent System",
        tech: "Python, Flask, AI Agents, REST APIs, Automation",
        bullets: [
          "Architected autonomous multi-step lead discovery workflows scraping, enriching, and scoring prospect data across web channels.",
          "Integrated real-time database storage and webhook-driven automated notifications for sales pipeline acceleration.",
        ],
      },
      {
        title: "Dandwoat — Specialized Clinic Outpatient Portal",
        tech: "React, Node.js, Express, MongoDB, Tailwind CSS",
        bullets: [
          "Developed specialized clinic management platform with digital queue tracking, doctor consultation logs, and medical records.",
          "Engineered secure JWT authentication and optimized REST API endpoints with responsive mobile-first UI.",
        ],
      },
      {
        title: "IoT Smart Vehicle & Fleet Tracking System",
        tech: "Python, Flask, GPS Modules, WebSockets, Leaflet",
        bullets: [
          "Created live telemetry tracking platform visualizing hardware coordinates on interactive maps with real-time geospatial alerts.",
        ],
      },
    ],
    skillCategories: {
      "Languages & Core": "JavaScript (ES6+), Python, Java, HTML5, CSS3, SQL",
      "Frontend & Frameworks": "React.js, Next.js, Tailwind CSS, Responsive Design, Motion, Component Architecture",
      "Backend & APIs": "Node.js, Express.js, Flask, RESTful APIs, JWT Auth, Microservices",
      "Databases & Cloud": "MongoDB, Supabase (PostgreSQL), Firebase, Git & GitHub, Vercel",
      "AI & Machine Learning": "Computer Vision, Deep Learning, OpenCV, PyTorch / TensorFlow fundamentals, Autonomous Agents",
    },
  },

  // ==========================================
  // 13. WORKSTATION / DIGITAL STUDIO
  // ==========================================
  workstation: {
    eyebrow: "DIGITAL STUDIO",
    title: "Workstation",
    subtitle:
      "A curated suite of practical tools and AI-powered utilities for work, creativity, and everyday tasks.",
    status: "All systems operational",
    isOnline: true,
    tools: [
      {
        id: "resume-builder",
        name: "ATS Resume Studio",
        description:
          "High-precision ATS resume studio with AI auto-fill generation, 4 curated templates, and instant 1-page PDF export.",
        tags: ["ATS Compliant", "AI Auto-Fill", "Clean PDF", "Interactive Editor"],
        route: "/tools/resume-builder",
        icon: FileText,
      },
      {
        id: "outreach-generator",
        name: "Outreach Studio",
        description:
          "Generate high-converting cold emails, recruiter direct messages, and tailored narrative cover letters with 1-click mail links.",
        tags: ["Cold Emails", "LinkedIn DMs", "Cover Letters", "Follow-Up Sequences"],
        route: "/tools/outreach-generator",
        icon: Send,
      },
      {
        id: "media-converter",
        name: "Image & PDF Studio",
        description:
          "Zero-upload suite: PDF to Images, Passport & Photo Resizer, Image Compressor, Format Converter, Images to PDF, and PDF Merger.",
        tags: ["PDF to Images", "Passport Resizer", "Compressor", "Format Converter", "PDF Merge & Split"],
        route: "/tools/media-converter",
        icon: FileText,
      },
      {
        id: "qr-studio",
        name: "Smart QR Studio",
        description:
          "Generate custom high-resolution QR codes for websites, Wi-Fi networks, contact vCards, and payments with Vector SVG & PNG export.",
        tags: ["Custom Colors", "Wi-Fi QR", "vCard Contacts", "Vector SVG", "High-Res PNG"],
        route: "/tools/qr-studio",
        icon: QrCode,
      },
    ],
  },
};

export default portfolioData;
