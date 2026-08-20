import {
  Layers,
  Palette,
  Clapperboard,
  BrainCircuit,
  Code2,
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
    role: "Software Engineer & AI Practitioner",
    title: "Developer, AI Practitioner & Visual Storyteller",
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
      prefix: "A software engineer crafting interfaces where",
      highlight1: "code",
      connector: "meets",
      highlight2: "pure aesthetics",
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
    "Next.js",
    "Express.js",
    "MongoDB",
    "Python",
    "Deep Learning",
    "Machine Learning",
    "Computer Vision",
    "Tailwind CSS",
    "JavaScript",
    "Supabase",
    "UI/UX Design",
    "REST APIs",
  ],

  // ==========================================
  // 7. ABOUT SECTION
  // ==========================================
  about: {
    badgeNumber: "01",
    badgeLabel: "Who I Am",
    heading: "About Me",
    subheading: "Developer, AI Practitioner & Visual Storyteller.",
    bio: "I engineer software across the stack—from scalable MERN architectures and intelligent computer vision models to intuitive UI/UX design and creative digital content.",
    stats: [
      { value: "2+", label: "Years Exp." },
      { value: "10+", label: "Projects Built" },
      { value: "End-to-End", label: "Workflow" },
    ],
    philosophy: {
      badge: "Philosophy",
      description:
        "Merging deep technical logic—from machine learning algorithms to full-stack engineering—with intuitive design and creative media production. Every project is approached with architectural rigor, scalability, and visual clarity.",
    },
    domainCards: [
      {
        icon: Layers,
        title: "Full Stack (MERN)",
        desc: "Architecting scalable web platforms with MongoDB, Express, React, and Node.js with secure APIs.",
        tag: "Domain",
      },
      {
        icon: BrainCircuit,
        title: "AI, ML & Deep Learning",
        desc: "Integrating intelligent models, computer vision pipelines, and deep neural network solutions into real-world applications.",
        tag: "Domain",
      },
      {
        icon: Palette,
        title: "UI/UX Design",
        desc: "Designing high-fidelity design systems, wireframes, and responsive user journeys that prioritize usability and clean aesthetics.",
        tag: "Domain",
      },
      {
        icon: Clapperboard,
        title: "Video Editing & Content Creation",
        desc: "Producing engaging digital content and post-production workflows that translate ideas into visual narratives.",
        tag: "Domain",
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
};

export default portfolioData;
