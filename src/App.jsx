import About from "./components/About";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="">
      <section id="Home" className="h-screen flex flex-col items-center bg-primary">
        <Navbar />
        <Hero />
      </section>
      <section id="About" className="h-screen bg-black pt-5 md:p-10 border drop-shadow-2xl drop-shadow-pAccent">
        <About/>
      </section>
    </div>
  );
}

export default App;
