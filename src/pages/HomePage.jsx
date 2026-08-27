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
  const isTouchRef = useRef(
    typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)
  );

  const { hero } = portfolioData;
  const videoSrc = hero?.backgroundVideo || {
    webm: "/gallery/bg_video_2.webm",
    mp4: "/gallery/bg_video_2.MP4",
  };

  // IntersectionObserver: auto-pause video decoding when off-screen to preserve 60-120fps scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;

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
  }, [activeVideo]);

  // Playback lifecycle & seamless loop
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1) return;

    // Touch/mobile devices use lightweight native loop on single video
    if (isTouchRef.current) {
      v1.loop = true;
      if (isVisibleRef.current) v1.play().catch(() => {});
      return;
    }

    if (!v2) return;
    if (isVisibleRef.current) v1.play().catch(() => {});

    const crossfadeDuration = 0.8;

    const handleTimeUpdate1 = () => {
      if (!v1.duration || !isVisibleRef.current) return;
      if (v1.currentTime >= v1.duration - crossfadeDuration && !isTransitioning.current) {
        isTransitioning.current = true;
        v2.currentTime = 0;
        v2.play()
          .then(() => {
            setActiveVideo(2);
            setTimeout(() => {
              isTransitioning.current = false;
            }, crossfadeDuration * 1000);
          })
          .catch(() => {});
      }
    };

    const handleTimeUpdate2 = () => {
      if (!v2.duration || !isVisibleRef.current) return;
      if (v2.currentTime >= v2.duration - crossfadeDuration && !isTransitioning.current) {
        isTransitioning.current = true;
        v1.currentTime = 0;
        v1.play()
          .then(() => {
            setActiveVideo(1);
            setTimeout(() => {
              isTransitioning.current = false;
            }, crossfadeDuration * 1000);
          })
          .catch(() => {});
      }
    };

    v1.addEventListener("timeupdate", handleTimeUpdate1);
    v2.addEventListener("timeupdate", handleTimeUpdate2);

    return () => {
      v1.removeEventListener("timeupdate", handleTimeUpdate1);
      v2.removeEventListener("timeupdate", handleTimeUpdate2);
    };
  }, [isLoading]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transform-gpu"
    >
      <video
        ref={video1Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-700 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc.webm} type="video/webm" />
        <source src={videoSrc.mp4} type="video/mp4" />
      </video>

      {/* Dual crossfade video decoder only instantiated on non-touch desktop */}
      <video
        ref={video2Ref}
        muted
        playsInline
        preload={isTouchRef.current ? "none" : "auto"}
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] sm:object-[26%_center] md:object-[28%_center] lg:object-[32%_center] xl:object-center scale-[1.05] transition-opacity duration-700 ease-in-out ${
          isTouchRef.current
            ? "hidden"
            : activeVideo === 2
            ? "opacity-100"
            : "opacity-0"
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
