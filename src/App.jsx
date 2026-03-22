import About from "./components/About";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Cursor from "./components/Cursor";

function App() {
  return (
    <div>
      <Cursor />
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
        sticky top-0 bg-black md:px-10 z-20 rounded-t-4xl pt-15 px-10"
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
        className="min-h-screen bg-black pt-20 pb-16 md:px-10 z-40 sticky top-0 px-5 rounded-t-4xl overflow-hidden -mt-10"
      >
        <Contact />
      </section>
    </div>
  );
}

export default App;
