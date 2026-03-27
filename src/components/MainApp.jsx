import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Particles } from "@/components/ui/particles";

import About from "./About";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Contact from "./Contact";
import Projects from "./Projects";
import Cursor from "./Cursor";
import Footer from "./Footer";
import { motion } from "motion/react";

function MainApp() {
  return (
    <div>
      {/* <Cursor /> */}
      <ScrollProgress className={`h-0.75`} />
      <section
        id="Home"
        className="h-screen sticky top-0 flex flex-col items-center bg-c1 z-10 px-5 md:p-0"
      >
        {/* <div className="h-screen z-999 absolute w-full overflow-hidden">
          <Particles color="#000" quantity={200} size={10} ease={1}/>
        </div> */}
        <Navbar />
        <Hero />
      </section>

      <motion.section
        // initial={{
        //   scale: 0.5,
        //   y: 50,
        // }}
        // whileInView={{
        //   scale: 1,
        //   y: 0,
        // }}
        // viewport={{ once: false, amount: 0.3 }}
        // transition={{ duration: 0.6, ease: "easeOut" }}
        id="About"
        className="h-screen 
  sticky top-0 bg-black md:px-10 z-20 rounded-t-4xl pt-15 px-5"
      >
        <About />
      </motion.section>

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
