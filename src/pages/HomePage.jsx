import { useEffect, useRef, useState } from "react";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { portfolioData } from "../data/portfolioData";
import About from "../components/About";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import Projects from "../components/Projects";
import WorkstationSection from "../components/WorkstationSection";
import Footer from "../components/Footer";
import SkillsMarquee from "../components/SkillsMarquee";

function SeamlessBackgroundVideo({ isLoading = false }) {
  const containerRef = useRef(null);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const isTransitioning = useRef(false);
  const isVisibleRef = useRef(true);

  const { hero } = portfolioData;
  const videoSrc = hero?.backgroundVideo || {
    mp4: "/gallery/bg_video_3.mp4",
    webm: "/gallery/bg_video_3.webm",
  };

  // IntersectionObserver: auto-pause video decoding when off-screen to preserve performance
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;

        if (entry.isIntersecting && !isLoading) {
          if (activeVideo === 1) {
            if (v1) {
              v1.muted = true;
              v1.play().catch(() => {});
            }
          } else {
            if (v2) {
              v2.muted = true;
              v2.play().catch(() => {});
            }
          }
        } else if (!entry.isIntersecting) {
          v1?.pause();
          v2?.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeVideo, isLoading]);

  // Continuous frame loop for precise, stutter-free 1.0s crossfade
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Start playing as soon as preloader finishes (isLoading becomes false)
    if (!isLoading && isVisibleRef.current) {
      if (activeVideo === 1) {
        v1.muted = true;
        v1.play().catch(() => {});
      } else {
        v2.muted = true;
        v2.play().catch(() => {});
      }
    }

    let rafId;
    const CROSSFADE_TIME = 1.0; // 1.0s smooth dissolve

    const checkLoop = () => {
      if (isVisibleRef.current && !isLoading) {
        const currentVid = activeVideo === 1 ? v1 : v2;
        const nextVid = activeVideo === 1 ? v2 : v1;

        // Auto-resume if video paused on mobile
        if (currentVid && currentVid.paused && currentVid.readyState >= 2) {
          currentVid.muted = true;
          currentVid.play().catch(() => {});
        }

        if (
          currentVid.duration &&
          !isNaN(currentVid.duration) &&
          currentVid.currentTime >= currentVid.duration - CROSSFADE_TIME &&
          !isTransitioning.current
        ) {
          isTransitioning.current = true;
          nextVid.currentTime = 0;
          nextVid.muted = true;
          nextVid
            .play()
            .then(() => {
              setActiveVideo((prev) => (prev === 1 ? 2 : 1));
              setTimeout(() => {
                isTransitioning.current = false;
              }, CROSSFADE_TIME * 1000);
            })
            .catch(() => {
              isTransitioning.current = false;
            });
        }
      }

      rafId = requestAnimationFrame(checkLoop);
    };

    rafId = requestAnimationFrame(checkLoop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [activeVideo, isLoading]);

  // One-time gesture listener on mobile to unlock video playback seamlessly without play button
  useEffect(() => {
    const unlockOnTouch = () => {
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      const target = activeVideo === 1 ? v1 : v2;
      if (target && target.paused) {
        target.muted = true;
        target.play().catch(() => {});
      }
    };

    window.addEventListener("touchstart", unlockOnTouch, { passive: true, once: true });
    window.addEventListener("click", unlockOnTouch, { passive: true, once: true });

    return () => {
      window.removeEventListener("touchstart", unlockOnTouch);
      window.removeEventListener("click", unlockOnTouch);
    };
  }, [activeVideo]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transform-gpu bg-black"
    >
      <video
        ref={video1Ref}
        src={videoSrc.mp4}
        autoPlay
        loop={false}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-1000 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dual crossfade video instance */}
      <video
        ref={video2Ref}
        src={videoSrc.mp4}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-1000 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default function HomePage({ isLoading = false, onNavigate }) {
  useEffect(() => {
    document.title = `${portfolioData.personal.name} — Full Stack Engineer`;
  }, []);

  return (
    <main className="relative w-full bg-black text-white selection:bg-pAccent selection:text-secondary">
      {/* Global Scroll Progress Bar */}
      <ScrollProgress />

      {/* Global Floating & Top Navbar */}
      <Navbar isLoading={isLoading} onNavigate={onNavigate} />

      {/* Hero Section */}
      <section
        id="Home"
        className="relative min-h-screen w-full flex flex-col items-center justify-between px-5 md:px-0 overflow-hidden"
      >
        {/* Seamless Crossfading Background Video */}
        <SeamlessBackgroundVideo isLoading={isLoading} />

        {/* Video Overlay & Soft Edge Gradient */}
        <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/50 via-transparent to-black/50 z-0 pointer-events-none" />

        {/* Hero Content */}
        <Hero isLoading={isLoading} />
      </section>

      {/* Infinite Skills Marquee */}
      <SkillsMarquee />

      {/* About Section */}
      <About />

      {/* Projects Section */}
      <Projects />

      {/* Workstation & Public Tools Showcase Section */}
      <WorkstationSection />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
