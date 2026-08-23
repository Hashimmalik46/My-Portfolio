import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import HomePage from "./pages/HomePage";
import CloudPreloader from "./components/CloudPreloader";
import ToolsHub from "./pages/ToolsHub";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import OutreachStudioPage from "./pages/OutreachStudioPage";
import { AnimatePresence } from "motion/react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function PortfolioView({ isLoading, setIsLoading }) {
  const navigate = useNavigate();

  // Smooth scroll (Lenis) initialized only on main portfolio on desktop
  useEffect(() => {
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
  }, []);

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
  }, [isLoading]);

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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <PortfolioView
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }
        />
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

        {/* Fallback to Home */}
        <Route
          path="*"
          element={
            <PortfolioView
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;