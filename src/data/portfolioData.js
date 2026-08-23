import {
  Layers,
  Palette,
  Clapperboard,
  BrainCircuit,
  Code2,
  FolderGit2,
  Sparkles,
  House,
  UserRound,
  Send,
  FileText,
  Download,
  QrCode,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";

/**
 * =============================================================================
 *                      PORTFOLIO CONFIGURATION & DATA
 * =============================================================================
 * Update all portfolio details in this single file.
 * All sections (Hero, About, Projects, Skills, Contact, Footer, Navbar)
 * pull their content directly from here.
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
    //Simple
    ambientAudioLabel: "Ambient Audio",
    ambientAudio: "/audio/ambient_4.mp3",
    //Player
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
    philosophy: {
      badge: "My Approach",
      description:
        "I like understanding things from the ground up, experimenting with different approaches, and building beyond the obvious solution. Whether it's a web app, an ML model, or a visual concept, I care about how it works, how it feels, and how it can be made better.",
    },
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
        organization: "Islamic University of Science & Technology, Pulwama",
        badge: "Education",
        description:
          "Deep focus on Data Structures & Algorithms, Object-Oriented System Design, Database Management Systems, Machine Learning pipelines, Computer architecture and Computer networks",
        tags: ["DSA", "Computer Vision", "Machine Learning", "System Design"],
      },
       {
        id: "exp-1",
        year: "2024 – Present",
        role: "UI/UX & Product Designer",
        organization: "Freelance & Design Systems",
        badge: "Design",
        description:
          "Crafting intuitive user journeys, high-fidelity interfaces, and responsive design systems with a focus on minimalist aesthetics, typography hierarchy, and fluid micro-interactions.",
        tags: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Wireframing"],
      },
      {
        id: "exp-2",
        year: "2025 – Present",
        role: "Full Stack & AI Developer",
        organization: "Independent & Freelance Engineering",
        badge: "Experience",
        description:
          "Architecting end-to-end full stack web platforms, real-time doctor-patient clinic portals (Zooncare, Dandwoat), autonomous lead generation AI agents, and IoT student safety tracking systems.",
        tags: ["React", "Node.js", "Python", "Supabase", "Flask", "AI Agents"],
      },
     
    ],
  },

  // ==========================================
  // 8. PROJECTS SECTION
  // ==========================================
  projectsSection: {
    badgeNumber: "02",
    badgeLabel: "Selected Works",
    heading: "Selected Projects",
    subheading:
      "A showcase of full-stack engineering, AI implementations, and production web platforms.",
    // Atmospheric Floating Background Canvases
    floatingImages: [
      {
        id: "float-1",
        src: "/gallery/CC.webp",
        alt: "Campus Connect",
        positionClass: "top-[8%] sm:top-[4%] -left-20 sm:left-[1%] lg:left-[3%]",
        sizeClass: "w-[280px] sm:w-[380px] lg:w-[440px]",
        rotation: -8,
        blurClass: "blur-[3px] sm:blur-[5px]",
        opacityClass: "opacity-25 sm:opacity-30",
        tintGradient: "from-black/85 via-black/30 to-pAccent/15",
        duration: 9,
        delay: 0,
      },
      {
        id: "float-2",
        src: "/gallery/intellisentry.webp",
        alt: "IntelliSentry",
        positionClass: "top-[19%] sm:top-[16%] -right-20 sm:right-[1%] lg:right-[2%]",
        sizeClass: "w-[270px] sm:w-[370px] lg:w-[430px]",
        rotation: 8.5,
        blurClass: "blur-[3px] sm:blur-[5px]",
        opacityClass: "opacity-20 sm:opacity-25",
        tintGradient: "from-black/85 via-black/30 to-cyan-400/15",
        duration: 10,
        delay: 1,
      },
      {
        id: "float-3",
        src: "/gallery/Zooncare.webp",
        alt: "Zooncare",
        positionClass: "top-[32%] sm:top-[30%] -left-24 sm:left-[0%] lg:left-[1%]",
        sizeClass: "w-[290px] sm:w-[390px] lg:w-[450px]",
        rotation: -7,
        blurClass: "blur-[4px] sm:blur-[6px]",
        opacityClass: "opacity-20 sm:opacity-25",
        tintGradient: "from-black/85 via-black/30 to-pAccent/15",
        duration: 11,
        delay: 2,
      },
      {
        id: "float-4",
        src: "/gallery/dandwoat.webp",
        alt: "Dandwoat",
        positionClass: "top-[44%] sm:top-[45%] -right-24 sm:right-[0%] lg:right-[2%]",
        sizeClass: "w-[280px] sm:w-[390px] lg:w-[450px]",
        rotation: 7.5,
        blurClass: "blur-[3px] sm:blur-[5px]",
        opacityClass: "opacity-20 sm:opacity-25",
        tintGradient: "from-black/85 via-black/30 to-emerald-400/15",
        duration: 9.5,
        delay: 1.2,
      },
      {
        id: "float-5",
        src: "/gallery/SS.webp",
        alt: "Arabic with Dr Sajad",
        positionClass: "top-[58%] sm:top-[59%] -left-20 sm:left-[1%] lg:left-[2%]",
        sizeClass: "w-[290px] sm:w-[400px] lg:w-[460px]",
        rotation: -8.5,
        blurClass: "blur-[3px] sm:blur-[5px]",
        opacityClass: "opacity-20 sm:opacity-25",
        tintGradient: "from-black/85 via-black/30 to-purple-400/15",
        duration: 9.5,
        delay: 1.5,
      },
      {
        id: "float-6",
        src: "/gallery/CC.webp",
        alt: "Agentic AI",
        positionClass: "top-[70%] sm:top-[72%] -right-20 sm:right-[1%] lg:right-[3%]",
        sizeClass: "w-[270px] sm:w-[380px] lg:w-[440px]",
        rotation: 7,
        blurClass: "blur-[3px] sm:blur-[5px]",
        opacityClass: "opacity-20 sm:opacity-25",
        tintGradient: "from-black/85 via-black/30 to-blue-400/15",
        duration: 10,
        delay: 0.8,
      },
      {
        id: "float-7",
        src: "/gallery/bus.webp",
        alt: "School Bus Tracker",
        positionClass: "top-[83%] sm:top-[84%] -left-20 sm:left-[1%] lg:left-[3%]",
        sizeClass: "w-[270px] sm:w-[370px] lg:w-[430px]",
        rotation: -7.5,
        blurClass: "blur-[4px] sm:blur-[6px]",
        opacityClass: "opacity-20 sm:opacity-25",
        tintGradient: "from-black/85 via-black/30 to-pAccent/15",
        duration: 10.5,
        delay: 0.5,
      },
    ],
    projects: [
      {
        id: "zooncare",
        title: "Role Based Clinic Management System",
        img: "/gallery/Zooncare.webp",
        img2: "/gallery/Zooncare.webp",
        category: "Full Stack",
        short_desc:
          "Full-stack clinical management platform built with role-based access architecture, secure doctor-patient records, and real-time scheduling.",
        full_desc:
          "Zooncare is a comprehensive, production-grade medical management system engineered to streamline daily outpatient workflows. It enforces granular role-based access control (RBAC) separating Doctors, Receptionists, and Patients, complete with real-time appointment booking, consultation history, and prescription generation.",
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
        img2: "/gallery/dandwoat.webp",
        category: "Web Platform",
        short_desc:
          "Comprehensive dental healthcare portal featuring online appointment bookings, treatment guides, and patient inquiry workflows.",
        full_desc:
          "A modern, patient-first web application designed for a premier dental healthcare clinic. Features interactive cosmetic dentistry showcases, an automated online appointment booking pipeline, patient inquiry management, and optimized SEO performance.",
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
        img2: "/gallery/intellisentry.webp",
        category: "Full Stack",
        short_desc:
          "Smart hostel administration platform handling automated check-ins, student records, and room allocations with custom backend logic.",
        full_desc:
          "IntelliSentry automates traditional campus hostel operations. Built with React and Supabase, it provides warden dashboards, real-time student in/out entry logging, automated room occupancy analytics, and fine management with instant ledger updates.",
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
        img2: "/gallery/CC.webp",
        category: "Social Platform",
        short_desc:
          "Closed academic social network enabling campus-wide student communication, event feeds, and peer collaborations.",
        full_desc:
          "An exclusive social and networking platform engineered for university campuses. Enables verified students to share academic updates, discover campus events, participate in subject discussions, and form study groups with instant feeds.",
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
        img2: "/gallery/SS.webp",
        category: "EdTech",
        short_desc:
          "Content-driven publishing and educational platform with integrated video course delivery, membership tiers, and payments.",
        full_desc:
          "An end-to-end e-learning and language education portal tailored for comprehensive Arabic instruction. Integrates secure video module delivery, student progress dashboards, downloadable curriculum resources, and automated subscription access.",
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
        img2: "/gallery/agentic.webp",
        category: "AI & Automation",
        short_desc:
          "Autonomous agent-driven workflow designed to extract, qualify, and route high-intent leads using machine intelligence and API pipelines.",
        full_desc:
          "An autonomous multi-agent pipeline designed to automate outbound sales research. The system leverages LLM agents with tool calling to scrape prospective leads, verify domain emails, score lead intent via custom heuristics, and compose personalized outreach drafts.",
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
        img2: "/gallery/bus.webp",
        category: "Real-Time Tracking",
        short_desc:
          "Real-time school transport and child tracking application with instant route updates and synchronized parent alerts.",
        full_desc:
          "A mission-critical real-time IoT tracking web application for student transit. Connects vehicle telemetry and GPS streams with Supabase Realtime subscriptions to render live bus trajectories on maps and trigger proactive arrival notifications for parents.",
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
    speechBubbleText: "Ask questions about me",
    inputPlaceholder: "Ask a question about Hashim...",
    welcomeMessage: "Hi! Ask me anything about Hashim's projects, technical skills, or background.",
    clearMessage: "Conversation cleared. Ask anything about Hashim!",
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
      "I'm specialized solely to answer questions about **Hashim Malik**—his software engineering background, full-stack & AI projects, skills, and contact details. Could I help you learn about his work in MERN, AI pipelines, or how to get in touch?",
      "I can only provide information related to **Hashim Malik** and his portfolio. Feel free to ask about his recent projects (like Zooncare or IntelliSentry), technical expertise, or how to collaborate with him!",
      "That topic is outside my domain! I'm dedicated exclusively to sharing info on **Hashim Malik**'s engineering experience, AI/ML background, and portfolio works. What would you like to know about Hashim?",
    ],
    systemPrompt: `You are the official AI Assistant for Hashim Malik's portfolio website.
STRICT INSTRUCTIONS:
- You ONLY answer questions about Hashim Malik, his projects, skills, contact info, and background.
- If asked anything off-topic (e.g. general trivia, unrelated code, sports, politics), decline politely and state you can only answer questions regarding Hashim Malik.
- Keep responses concise, warm, professional, formatted with clear markdown bullet points.`,
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
  // 12. WORKSTATION / DIGITAL STUDIO
  // ==========================================
  workstation: {
    status: "All systems operational",
    isOnline: true,
    tools: [
      {
        id: "resume-builder",
        name: "ATS Resume Builder",
        description:
          "High-precision ATS resume studio with AI auto-fill generation, 4 curated templates, and instant 1-page PDF export.",
        tags: ["ATS Compliant", "AI Auto-Fill", "Clean PDF", "Interactive Editor"],
        route: "/tools/resume-builder",
        icon: FileText,
      },
      {
        id: "outreach-generator",
        name: "AI Outreach & Cover Letter Studio",
        description:
          "Generate high-converting cold emails, recruiter direct messages, and tailored narrative cover letters with 1-click mail links.",
        tags: ["Cold Emails", "LinkedIn DMs", "Cover Letters", "Follow-Up Sequences"],
        route: "/tools/outreach-generator",
        icon: Send,
      },
      {
        id: "media-converter",
        name: "Image & PDF Document Studio",
        description:
          "Instant image compression, multi-format conversion (JPEG/WebP/PNG), images-to-PDF compiler, PDF merger, and page extractor.",
        tags: ["Image Compressor", "JPEG / WebP / PNG", "Images to PDF", "PDF Merger", "Split PDF"],
        route: "/tools/media-converter",
        icon: FileText,
      },
      {
        id: "qr-studio",
        name: "Smart QR Code & Link Studio",
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
