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
    mp4: "/gallery/bg_video_3.MP4",
  };

  // IntersectionObserver: auto-pause video decoding when off-screen or while preloader is active
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;

        if (isLoading) {
          v1?.pause();
          v2?.pause();
          return;
        }

        if (entry.isIntersecting) {
          if (activeVideo === 1) v1?.play().catch(() => {});
          else v2?.play().catch(() => {});
        } else {
          v1?.pause();
          v2?.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeVideo, isLoading]);

  // Synchronize playback with preloader state: holds video paused at 0:00 until preloader finishes
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    if (isLoading) {
      v1.pause();
      v2.pause();
      v1.currentTime = 0;
      v2.currentTime = 0;
      return;
    }

    // When preloader finishes (isLoading becomes false), start active video from beginning
    if (isVisibleRef.current) {
      if (activeVideo === 1) {
        v1.currentTime = 0;
        v1.play().catch(() => {});
      } else {
        v2.currentTime = 0;
        v2.play().catch(() => {});
      }
    }

    let rafId;
    const CROSSFADE_TIME = 1.0; // 1.0s smooth dissolve

    const checkLoop = () => {
      if (isVisibleRef.current && !isLoading) {
        const currentVid = activeVideo === 1 ? v1 : v2;
        const nextVid = activeVideo === 1 ? v2 : v1;

        if (
          currentVid.duration &&
          currentVid.currentTime >= currentVid.duration - CROSSFADE_TIME &&
          !isTransitioning.current
        ) {
          isTransitioning.current = true;
          nextVid.currentTime = 0;
          nextVid
            .play()
            .then(() => {
              setActiveVideo(activeVideo === 1 ? 2 : 1);
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

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transform-gpu bg-black"
    >
      <video
        ref={video1Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-1000 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc.webm} type="video/webm" />
        <source src={videoSrc.mp4} type="video/mp4" />
      </video>

      {/* Dual crossfade video instance */}
      <video
        ref={video2Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-1000 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc.webm} type="video/webm" />
        <source src={videoSrc.mp4} type="video/mp4" />
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
