<div align="center">

  <img src="./public/gallery/favicon.webp" alt="Hash Logo" width="88" height="88" />

  # Hashim Malik
  ### Developer Portfolio & Digital Workstation Studio

  An immersive personal portfolio, interactive AI career assistant, and high-performance digital workstation engineered with React 19, Vite, Tailwind CSS 4, and Motion.

  <p align="center">
    <a href="https://hashimmalik.in" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/badge/status-live-34D399?style=flat&labelColor=374151" alt="Status" />
    </a>
    <img src="https://img.shields.io/badge/version-v2.1.0-F97316?style=flat&labelColor=374151" alt="Version" />
    <a href="https://github.com/Hashimmalik46/My-Portfolio/stargazers" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/github/stars/Hashimmalik46/My-Portfolio?style=flat&label=stars&color=0284C7&labelColor=374151" alt="Stars" />
    </a>
    <a href="#license">
      <img src="https://img.shields.io/badge/license-Custom-EC4899?style=flat&labelColor=374151" alt="License" />
    </a>
  </p>

  <p align="center">
    <a href="#features"><b>✨ Features</b></a> &nbsp;•&nbsp;
    <a href="#workstation-suite"><b>🛠️ Workstation Suite</b></a> &nbsp;•&nbsp;
    <a href="#tech-stack"><b>💻 Tech Stack</b></a> &nbsp;•&nbsp;
    <a href="#quick-start"><b>🚀 Quick Start</b></a> &nbsp;•&nbsp;
    <a href="#project-architecture"><b>📁 Architecture</b></a> &nbsp;•&nbsp;
    <a href="#author"><b>👤 Author</b></a>
  </p>

</div>

---

<a id="features"></a>
## ✨ Features

### 1. Immersive Portfolio Experience (`/`)
- **Atmospheric Audio Engine**: Generative Web Audio API ambient soundscape with floating volume controls and Vinyl / Minimalist audio player switcher.
- **Dynamic Preloader**: Interactive SVG cloud reveal with synchronized smooth scrolling via Lenis.
- **Interactive Project Modals**: Deep-dive project showcases with live demo links, architecture breakdowns, and tech pills.
- **AI Portfolio Assistant (`HeroChatbot`)**: Real-time interactive AI chat agent powered by Gemini Flash, contextual topic carousel, and localized **Dark / Light theme toggle**.
- **Responsive Floating Dock**: Quick-access global navigation with smooth anchor scrolling and instant resume triggers.
- **Physics-Based Pill Slider Theme Toggle**: Smooth spring-animated celestial slider with scoped theme isolation (`.dark-scope` / `.light-scope`) for zero background flashing.

---

<a id="workstation-suite"></a>
## 🛠️ Workstation Suite (`/tools`)
Curated standalone career acceleration and developer utilities engineered to run **100% in-browser** with zero server latency, dark/light theme support, and automatic session persistence:

- **📄 ATS Resume Builder (`/tools/resume-builder` & Modal)**:
  - High-precision ATS-compliant formatting across 4 curated styles (*Classic, Executive, Compact, Modern*) and theme color palettes (*Indigo, Emerald, Ocean, Rose*).
  - Career track presets: **Standard (Experienced)** and **Fresher (Graduate)** with tailored section ordering.
  - Multi-format export engine: Download as **Microsoft Word Document (`.docx`)** or **Print-Ready PDF (`.pdf`)** via an interactive download format selector.
  - 1-click **AI Auto-Fill** generation from raw text prompts powered by Gemini AI.
  - Interactive live editor with real-time text synchronization, ATS plain-text copy, mobile-optimized icon tabs, and localized **Dark / Light mode slider**.
  - Local session retention across page reloads.

- **✉️ AI Cold Outreach & Cover Letter Studio (`/tools/outreach-generator`)**:
  - Multi-channel campaign pack generator:
    - **Cold Emails** with 3 high-converting subject line angles and live editable subject box.
    - **LinkedIn / Twitter DMs** tailored for character limits.
    - **Formal Narrative Cover Letters** in standard 3-paragraph executive format.
    - **3–5 Day Follow-Up Sequences**.
  - **1-Click Mailto Action**: Launches your default email client (Gmail, Apple Mail, Outlook) with Recipient, Subject, and Body pre-filled.
  - Built-in starter scenarios (*Founder Pitch, High-Growth Scale-Up, Big Tech*) and instant **Clear to Scratch** / **Reset** controls.

- **🖼️ Image & PDF Document Studio (`/tools/media-converter`)**:
  - **Image Compressor & Converter**: Client-side HTML5 Canvas compression, quality slider (10%–100%), dimension scaler with aspect ratio lock, and format conversion (JPEG, WebP, PNG) with real-time byte savings calculation.
  - **Images to A4 PDF Compiler**: Multi-image drag-and-drop or tap-to-select, Portrait/Landscape orientation selector, and clean A4 `.pdf` compilation via `jsPDF`.
  - **PDF Merger**: Combine 2 or more PDF documents into a unified file via `pdf-lib`.
  - **PDF Splitter & Page Extractor**: Automatic total page count detection, quick presets (*All, Page 1, First Half, Last Page*), and custom page range extraction.

- **🔲 Smart QR Code & Link Studio (`/tools/qr-studio`)**:
  - Multi-type data encoding: **Website URLs**, **Wi-Fi Networks** (with instant scan-to-connect), **Contact vCards** (direct phone save), **Plain Text**, **Email Links**, and **UPI Payments**.
  - Curated color themes (*Classic Dark, Electric Indigo, Emerald Forest, Midnight Navy, Sunset Crimson, Minimal Slate*) and custom dot/background color pickers.
  - Export to **High-Res PNG** (up to 2K resolution), **Vector SVG**, and **1-click Image Copy to Clipboard**.
  - Mobile-optimized responsive layout with **Configure** ↔ **Preview** view toggle.

---

<a id="tech-stack"></a>
## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) with Scoped CSS Theme Variants
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Document & PDF Engines**: `docx`, `pdf-lib`, `jspdf`, `html2canvas`
- **QR Engine**: `qrcode`
- **AI Providers**: Google Gemini (3.6 Flash / 3.5 Flash / Flash Latest), xAI Grok, OpenAI, DeepSeek

---

<a id="quick-start"></a>
## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Hashimmalik46/My-Portfolio.git
cd My-Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Add your optional API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

<a id="project-architecture"></a>
## 📁 Project Architecture

```
src/
├── components/          # Reusable UI & standalone workstation tool components
│   ├── StandaloneResumeBuilder.jsx # Standalone ATS Resume Studio
│   ├── OutreachStudio.jsx          # AI Cold Outreach & Cover Letter Studio
│   ├── OmniMediaStudio.jsx         # Image Compressor & PDF Document Studio
│   ├── QRCodeStudio.jsx            # Smart QR Code & Link Studio
│   ├── ResumeModal.jsx             # Portfolio embedded resume modal with theme slider
│   ├── HeroChatbot.jsx             # AI Career Assistant with isolated theme switcher
│   ├── ThemeToggle.jsx             # Spring physics pill slider toggle
│   ├── Hero.jsx                    # Hero header with ambient audio engine
│   ├── Projects.jsx                # Project showcase section
│   ├── Skills.jsx                  # Interactive skill pills & metrics
│   └── ...
├── pages/               # Top-level route pages (React Router DOM)
│   ├── HomePage.jsx                # Portfolio landing page (/)
│   ├── ToolsHub.jsx                # Workstation hub (/tools)
│   ├── ResumeBuilderPage.jsx       # ATS Resume studio (/tools/resume-builder)
│   ├── OutreachStudioPage.jsx      # Outreach studio (/tools/outreach-generator)
│   ├── OmniMediaStudioPage.jsx     # Image & PDF studio (/tools/media-converter)
│   └── QRCodeStudioPage.jsx        # Smart QR Code studio (/tools/qr-studio)
├── context/             # React Context providers
│   └── ThemeContext.jsx            # Dark/Light theme state & system sync provider
├── services/            # Client-side processing & AI generation engines
│   ├── aiResume.js                 # Universal resume generation service
│   ├── aiOutreach.js               # Universal outreach & cover letter service
│   └── imageProcessor.js           # Client-side Canvas image & PDF-lib engine
├── utils/               # Document and media export utilities
│   └── docxResumeExport.js         # ATS Microsoft Word (.docx) document generator
├── data/                # Portfolio configuration, projects, and bio data
│   └── portfolioData.js
└── App.jsx              # Main router & Lenis smooth scroll provider
```

---

<a id="author"></a>
## 👤 Author

**Hashim Malik**
- Website: <a href="https://hashimmalik.in" target="_blank" rel="noopener noreferrer">hashimmalik.in</a>
- GitHub: <a href="https://github.com/Hashimmalik46" target="_blank" rel="noopener noreferrer">@Hashimmalik46</a>
- LinkedIn: <a href="https://www.linkedin.com/in/hashim-malik-a868102b0/" target="_blank" rel="noopener noreferrer">linkedin.com/in/hashim-malik-a868102b0</a>
- Instagram: <a href="https://instagram.com/i_hash46" target="_blank" rel="noopener noreferrer">@i_hash46</a>
- X / Twitter: <a href="https://x.com/hashimm447" target="_blank" rel="noopener noreferrer">@hashimm447</a>

---

<a id="license"></a>
## 📄 License & Copyright

© 2026 **Hashim Malik**. All rights reserved.

The source code, designs, and assets in this repository are for personal portfolio and demonstration purposes. Unauthorized copying or redistribution of this project or its branding is prohibited without prior permission.
