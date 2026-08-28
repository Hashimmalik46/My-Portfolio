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
    webm: "/gallery/bg_video_3.webm",
    mp4: "/gallery/bg_video_3.mp4",
  };

  // Helper to ensure DOM properties are strictly applied for iOS Safari WebKit Autoplay policies
  const setupVideoElement = (el) => {
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");
    el.setAttribute("x5-playsinline", "true");
  };

  // Attempt playback with error handling & silent catch
  const playVideo = (el) => {
    if (!el) return;
    setupVideoElement(el);
    const promise = el.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Ignored: will retry on first user interaction or when observer triggers
      });
    }
  };

  // Configure initial video element properties on mount
  useEffect(() => {
    setupVideoElement(video1Ref.current);
    setupVideoElement(video2Ref.current);
  }, []);

  // IntersectionObserver: auto-pause video decoding when off-screen to preserve performance & battery
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;

        if (entry.isIntersecting && !isLoading) {
          if (activeVideo === 1) playVideo(v1);
          else playVideo(v2);
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

  // Main playback & crossfade controller
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Only start playing once preloader is done and section is visible
    if (!isLoading && isVisibleRef.current) {
      if (activeVideo === 1) playVideo(v1);
      else playVideo(v2);
    }

    let rafId;
    const CROSSFADE_TIME = 1.0; // 1.0s smooth dissolve

    const checkLoop = () => {
      if (isVisibleRef.current && !isLoading) {
        const currentVid = activeVideo === 1 ? v1 : v2;
        const nextVid = activeVideo === 1 ? v2 : v1;

        // Auto-recovery: if current video is unexpectedly paused on mobile (e.g. low-power mode or tab focus), resume it
        if (currentVid && currentVid.paused && currentVid.readyState >= 2) {
          playVideo(currentVid);
        }

        if (
          currentVid.duration &&
          !isNaN(currentVid.duration) &&
          currentVid.currentTime >= currentVid.duration - CROSSFADE_TIME &&
          !isTransitioning.current
        ) {
          isTransitioning.current = true;
          nextVid.currentTime = 0;
          setupVideoElement(nextVid);
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

  // iOS Safari / Mobile Unlock: First user touch, scroll, or click guarantees video start if iOS blocked initial autoplay
  useEffect(() => {
    if (isLoading) return;

    const handleFirstInteraction = () => {
      const currentVid = activeVideo === 1 ? video1Ref.current : video2Ref.current;
      if (currentVid && currentVid.paused && isVisibleRef.current) {
        playVideo(currentVid);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isVisibleRef.current && !isLoading) {
        const currentVid = activeVideo === 1 ? video1Ref.current : video2Ref.current;
        if (currentVid && currentVid.paused) {
          playVideo(currentVid);
        }
      }
    };

    window.addEventListener("touchstart", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("touchend", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("click", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("scroll", handleFirstInteraction, { passive: true, once: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("touchend", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoading, activeVideo]);

  const handleEnded = (instanceNum) => {
    if (activeVideo === instanceNum && !isTransitioning.current) {
      const nextVid = instanceNum === 1 ? video2Ref.current : video1Ref.current;
      if (nextVid) {
        nextVid.currentTime = 0;
        playVideo(nextVid);
        setActiveVideo(instanceNum === 1 ? 2 : 1);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transform-gpu bg-black"
    >
      <video
        ref={video1Ref}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        onEnded={() => handleEnded(1)}
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-1000 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc.mp4} type="video/mp4" />
        <source src={videoSrc.webm} type="video/webm" />
      </video>

      {/* Dual crossfade video instance */}
      <video
        ref={video2Ref}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        onEnded={() => handleEnded(2)}
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-1000 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc.mp4} type="video/mp4" />
        <source src={videoSrc.webm} type="video/webm" />
      </video>
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
