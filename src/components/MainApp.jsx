import { useEffect, useRef, useState } from "react";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import About from "./About";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Contact from "./Contact";
import Projects from "./Projects";
import Footer from "./Footer";
import SkillsMarquee from "./SkillsMarquee";

function SeamlessBackgroundVideo() {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    v1.play().catch(() => {});

    const crossfadeDuration = 0.8;

    const handleTimeUpdate1 = () => {
      if (!v1.duration) return;
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
      if (!v2.duration) return;
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
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <video
        ref={video1Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] md:object-center transition-opacity duration-700 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/gallery/bg_video.webm" type="video/webm" />
        <source src="/gallery/bg_video.MP4" type="video/mp4" />
      </video>

      <video
        ref={video2Ref}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[25%_center] md:object-center transition-opacity duration-700 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/gallery/bg_video.webm" type="video/webm" />
        <source src="/gallery/bg_video.MP4" type="video/mp4" />
      </video>
    </div>
  );
}

function MainApp({ isLoading = false }) {
  return (
    <main className="relative w-full bg-black text-white selection:bg-pAccent selection:text-secondary">
      {/* Global Scroll Progress Bar */}
      <ScrollProgress />

      {/* Hero Section */}
      <section
        id="Home"
        className="relative min-h-screen w-full flex flex-col items-center justify-between px-5 md:px-0 overflow-hidden"
      >
        {/* Seamless Crossfading Background Video */}
        <SeamlessBackgroundVideo />

        {/* Dark Video Overlay */}
        <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

        {/* Navbar */}
        <div className="w-full relative z-50">
          <Navbar isLoading={isLoading} />
        </div>

        {/* Hero Content */}
        <Hero isLoading={isLoading} />
      </section>

      {/* Infinite Skills Marquee */}
      <SkillsMarquee />

      {/* About Section */}
      <section
        id="About"
        className="relative w-full min-h-screen flex items-center justify-center bg-black/95 px-5 md:px-0"
      >
        <About />
      </section>

      {/* Projects Section */}
      <section
        id="Projects"
        className="relative w-full min-h-screen flex items-center justify-center bg-black px-5 md:px-0"
      >
        <Projects />
      </section>

      {/* Contact Section */}
      <section
        id="Contact"
        className="relative w-full min-h-screen flex items-center justify-center bg-black/95 px-5 md:px-0"
      >
        <Contact />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default MainApp;