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
  shortName: "Hash",
  role: "Developer, AI Explorer & Creative",
  title: "I build, experiment, and figure things out.",
  email: "hashimzahoor2003@gmail.com",
  location: "Srinagar, Kashmir",
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
    subtitle: "Software & Creative",
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
    tagline: {
      prefix: "A software and design enthusiast blending",
      highlight1: "code",
      connector: "with",
      highlight2: "creativity",
      suffix: ".",
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
      badge: "Philosophy",
      quote: "Designing with intention, building with precision.",
      highlight: "Code meets aesthetics.",
    },
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
    projects: [
      {
        title: "Role Based Clinic Management System",
        img: "/gallery/Zooncare.webp",
        category: "Full Stack",
        short_desc:
          "Full-stack clinical management platform built with a role-based access architecture, secure doctor-patient records, and real-time scheduling.",
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/tailwind.webp", tag: "Tailwind" },
        ],
        link: "https://zooncare.in",
      },
      {
        title: "Dandwoat Dental Clinic",
        img: "/gallery/dandwoat.webp",
        category: "Web Platform",
        short_desc:
          "Comprehensive dental healthcare portal featuring online appointment bookings, treatment guides, and patient inquiry workflows.",
        tags: [
          { id: 1, img: "/gallery/wordpress.webp", tag: "WordPress" },
          { id: 2, img: "/gallery/css.webp", tag: "CSS" },
        ],
        link: "https://dandwoat.com",
      },
      {
        title: "IntelliSentry Hostel Management System",
        img: "/gallery/intellisentry.webp",
        category: "Full Stack",
        short_desc:
          "Smart hostel administration platform handling automated check-ins, student records, and room allocations with custom backend logic.",
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/supabase.webp", tag: "Supabase" },
          { id: 3, img: "/gallery/flask.webp", tag: "Flask" },
        ],
        link: "https://intellisentry.vercel.app",
      },
      {
        title: "Campus Connect",
        img: "/gallery/CC.webp",
        category: "Social Platform",
        short_desc:
          "Closed academic social network enabling campus-wide student communication, event feeds, and peer collaborations.",
        tags: [
          { id: 1, img: "/gallery/html.webp", tag: "HTML" },
          { id: 2, img: "/gallery/css.webp", tag: "CSS" },
          { id: 3, img: "/gallery/js.webp", tag: "JavaScript" },
        ],
        link: "https://kwitter-nine.vercel.app/",
      },
      {
        title: "Arabic with Dr Sajad",
        img: "/gallery/SS.webp",
        category: "EdTech",
        short_desc:
          "Content-driven publishing and educational platform with integrated video course delivery, membership tiers, and payments.",
        tags: [{ id: 1, img: "/gallery/wordpress.webp", tag: "WordPress" }],
        link: "https://arabicwithdrsajad.com/",
      },
      {
        title: "Agentic AI for Lead Generation",
        img: "/gallery/agentic.webp",
        category: "AI & Automation",
        short_desc:
          "Autonomous agent-driven workflow designed to extract, qualify, and route high-intent leads using machine intelligence and API pipelines.",
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/flask.webp", tag: "Flask" },
          { id: 3, img: "/gallery/supabase.webp", tag: "Supabase" },
        ],
        link: "#",
      },
      {
        title: "Safe School Bus Tracker",
        img: "/gallery/bus.webp",
        category: "Real-Time Tracking",
        short_desc:
          "Real-time school transport and child tracking application with instant route updates and synchronized parent alerts.",
        tags: [
          { id: 1, img: "/gallery/react.webp", tag: "React" },
          { id: 2, img: "/gallery/supabase.webp", tag: "Supabase" },
          { id: 3, img: "/gallery/tailwind.webp", tag: "Tailwind" },
        ],
        link: "https://live-school-bus-tracking.vercel.app/",
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
    summary:
      "Passionate Computer Science undergraduate and developer with strong expertise in full-stack web architectures (MERN Stack), RESTful APIs, and AI/ML integrations (Computer Vision, Neural Networks, and Autonomous Agents). Proven track record of designing, building, and shipping 10+ production-ready web and automated platforms with an end-to-end build mindset and attention to detail.",
    education: [
      {
        degree: "Bachelor of Technology in Computer Science & Engineering",
        institution: "University Institute of Technology",
        location: "Srinagar, Kashmir",
        year: "2021 – Present",
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
    skillCategories: {
      "Languages & Core": "JavaScript (ES6+), Python, Java, HTML5, CSS3, SQL",
      "Frontend & Frameworks": "React.js, Next.js, Tailwind CSS, Responsive Design, Motion, Component Architecture",
      "Backend & APIs": "Node.js, Express.js, Flask, RESTful APIs, JWT Auth, Microservices",
      "Databases & Cloud": "MongoDB, Supabase (PostgreSQL), Firebase, Git & GitHub, Vercel",
      "AI & Machine Learning": "Computer Vision, Deep Learning, OpenCV, PyTorch / TensorFlow fundamentals, Autonomous Agents",
    },
  },
};

export default portfolioData;
