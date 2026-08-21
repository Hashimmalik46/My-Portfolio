import { useState, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import MainApp from "./components/MainApp";
import Preloader from "./components/Preloader";
import { AnimatePresence } from "motion/react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll with light, snappy response
    const lenis = new Lenis({
      duration: 0.75, // Snappy & agile response (reduced from 1.15s)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1, // Quick, direct wheel response without dragging
      touchMultiplier: 1.0, // Natural 1:1 touch response for mobile
      syncTouch: false, // Prevents mobile touch dragging lag
      infinite: false,
    });

    window.lenis = lenis;

    // RAF Loop
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global smooth anchor click interceptor
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
      window.lenis?.start();
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <MainApp isLoading={isLoading} />
    </>
  );
}

export default App;