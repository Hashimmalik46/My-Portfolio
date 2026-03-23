import { useEffect, useState } from "react";
import MainApp from "./components/MainApp";
import Preloader from "./components/Preloader";

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return <>{isLoading?<Preloader/>:<MainApp />}</>;
}

export default App;
