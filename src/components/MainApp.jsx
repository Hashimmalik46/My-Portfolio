import About from "./About";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Contact from "./Contact";
import Projects from "./Projects";
import Cursor from "./Cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import Footer from "./Footer";

function MainApp() {
  return (
    <div>
      {/* <Cursor /> */}
      <ScrollProgress className={`h-0.75`} />
      <section
        id="Home"
        className="h-screen sticky top-0 flex flex-col items-center bg-c1 z-10 px-5"
      >
        <Navbar />
        <Hero />
      </section>

      <section
        id="About"
        className="h-screen 
        sticky top-0 bg-black md:px-10 z-20 rounded-t-4xl pt-15 px-5"
      >
        <About />
      </section>

      <section
        id="Portfolio"
        className="h-screen sticky top-0 bg-c1 py-10 md:px-10 z-30 rounded-t-4xl"
      >
        <Projects />
      </section>

      <section
        id="Contact"
        className="min-h-screen bg-black pt-10 z-40 sticky top-0 rounded-t-4xl overflow-hidden -mt-10"
      >
        <Contact />

        <Footer />
      </section>
    </div>
  );
}

export default MainApp;
