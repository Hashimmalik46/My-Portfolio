import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import HomePage from "./pages/HomePage";
import CloudPreloader from "./components/CloudPreloader";
import ToolsHub from "./pages/ToolsHub";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import OutreachStudioPage from "./pages/OutreachStudioPage";
import OmniMediaStudioPage from "./pages/OmniMediaStudioPage";
import QRCodeStudioPage from "./pages/QRCodeStudioPage";
import { AnimatePresence } from "motion/react";
import { ThemeProvider } from "./context/ThemeContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Only scroll to top when entering tool subpages; preserve homepage scroll on return
    if (pathname !== "/" && pathname !== "") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);
  return null;
}

function PortfolioView({ isLoading, setIsLoading, isHome }) {
  const navigate = useNavigate();

  // Smooth scroll (Lenis) active ONLY on homepage desktop
  useEffect(() => {
    if (!isHome) {
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
      return;
    }

    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) return;

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const targetId = anchor.getAttribute("href");
      if (targetId && targetId.length > 1 && targetId.startsWith("#")) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: 0,
            duration: 0.85,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      window.lenis = null;
    };
  }, [isHome]);

  // Synchronize Lenis state with preloader
  useEffect(() => {
    if (isLoading) {
      window.lenis?.stop();
    } else {
      const timer = setTimeout(() => {
        window.lenis?.start();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isHome]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <CloudPreloader onStartReveal={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <HomePage isLoading={isLoading} onNavigate={(path) => navigate(path)} />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(() => {
    // If loaded on a tool route directly, don't show the initial cloud preloader
    if (typeof window !== "undefined" && window.location.pathname !== "/" && window.location.pathname !== "") {
      return false;
    }
    return true;
  });

  const isHome = location.pathname === "/" || location.pathname === "";
  const lastScrollY = useRef(0);

  // Capture scroll position before leaving homepage
  useEffect(() => {
    const handleCaptureScroll = (e) => {
      const anchor = e.target.closest("a[href]");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && !href.startsWith("#") && href !== "/") {
          lastScrollY.current = window.scrollY;
        }
      }
    };
    window.addEventListener("click", handleCaptureScroll, { capture: true });
    return () => window.removeEventListener("click", handleCaptureScroll, { capture: true });
  }, []);

  // Restore scroll position when returning to Home
  useEffect(() => {
    if (isHome && lastScrollY.current > 0) {
      requestAnimationFrame(() => {
        if (window.lenis) {
          window.lenis.scrollTo(lastScrollY.current, { immediate: true });
        } else {
          window.scrollTo({ top: lastScrollY.current, behavior: "instant" });
        }
      });
    }
  }, [isHome]);

  return (
    <>
      <ScrollToTop />

      {/* Persistent PortfolioView: keeps DOM, videos, scroll, and all animations persistent without reloading */}
      <div style={{ display: isHome ? "block" : "none" }}>
        <PortfolioView isLoading={isLoading} setIsLoading={setIsLoading} isHome={isHome} />
      </div>

      {/* Tool & Workstation Sub-Routes */}
      {!isHome && (
        <Routes>
          {/* Workstation Directory */}
          <Route path="/tools" element={<ToolsHub />} />

          {/* Tool 1: ATS Resume Builder */}
          <Route path="/tools/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />

          {/* Tool 2: AI Cold Outreach & Cover Letter Studio */}
          <Route path="/tools/outreach-generator" element={<OutreachStudioPage />} />
          <Route path="/tools/cover-letter" element={<OutreachStudioPage />} />
          <Route path="/tools/cold-email" element={<OutreachStudioPage />} />
          <Route path="/cover-letter" element={<OutreachStudioPage />} />

          {/* Tool 3: Image & PDF Document Studio */}
          <Route path="/tools/media-converter" element={<OmniMediaStudioPage />} />
          <Route path="/tools/video-downloader" element={<OmniMediaStudioPage />} />
          <Route path="/tools/image-compressor" element={<OmniMediaStudioPage />} />
          <Route path="/media-converter" element={<OmniMediaStudioPage />} />

          {/* Tool 4: Smart QR Code & Link Studio */}
          <Route path="/tools/qr-studio" element={<QRCodeStudioPage />} />
          <Route path="/tools/qr-generator" element={<QRCodeStudioPage />} />
          <Route path="/qr-studio" element={<QRCodeStudioPage />} />
          <Route path="/qr-code" element={<QRCodeStudioPage />} />

          {/* Fallback to Home */}
          <Route
            path="*"
            element={<ToolsHub />}
          />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;