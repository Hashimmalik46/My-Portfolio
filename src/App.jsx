import About from "./components/About";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Cursor from "./components/Cursor";

function App() {
  return (
    <div>
      <Cursor />
      <section
        id="Home"
        className="h-screen sticky top-0 flex flex-col items-center bg-primary z-10 px-5"
      >
        <Navbar />
        <Hero />
      </section>

      <section
        id="About"
        className="min-h-[70vh] sticky top-0 bg-black md:px-10 z-20 rounded-t-4xl pt-15 px-10"
      >
        <About />
      </section>

      <section
        id="Portfolio"
        className="min-h-screen relative bg-pAccent pt-16 pb-20 md:px-10 z-30 rounded-t-4xl px-5 -mt-10"
      >
        <Skills />

        <div className="mt-10">
          <Projects />
        </div>
      </section>

      <section
        id="Contact"
        className="min-h-screen bg-black pt-20 pb-16 md:px-10 z-40 relative px-5 rounded-t-4xl overflow-hidden -mt-10"
      >
        <Contact />
      </section>
    </div>
  );
}

export default App;
