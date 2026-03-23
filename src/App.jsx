import { useEffect,useState } from "react";
import MainApp from "./MainApp";
import Preloader from "./components/Preloader";

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return <>{isLoading ? <Preloader /> : <MainApp />}</>;
  
}

export default App;
