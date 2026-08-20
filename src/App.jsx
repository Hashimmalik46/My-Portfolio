import { useState } from "react";
import MainApp from "./components/MainApp";
import Preloader from "./components/Preloader";
import { AnimatePresence } from "motion/react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <MainApp isLoading={isLoading} />
    </>
  );
}

export default App;