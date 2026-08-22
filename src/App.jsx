import { useState, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import MainApp from "./components/MainApp";
import CloudPreloader from "./components/CloudPreloader";
import { AnimatePresence } from "motion/react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only initialize Lenis on non-touch (desktop mouse/trackpad) devices.
    // Touch devices (iOS / Android) have native hardware 120Hz fling physics which feel best without virtual scroll intervention.
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.85, // Snappy & agile response for desktop mouse wheel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
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

    // Global smooth anchor click interceptor for desktop
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
      }, 400); // 400ms momentum damping buffer during cloud dissolve

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
      <MainApp isLoading={isLoading} />
    </>
  );
}

export default App;
