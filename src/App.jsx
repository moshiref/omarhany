import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/common/LoadingScreen";
import Navbar from "./components/common/Navbar";
import StarBackground from "./components/common/StarBackground";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Stats from "./components/sections/Stats";
import Contact from "./components/sections/Contact";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <StarBackground />
          <Navbar />
          <main className="relative z-10">
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Stats />
            <Contact />
          </main>
          <footer className="relative z-10 border-t border-white/10 bg-surface/60 py-6">
            <p className="mx-auto max-w-6xl px-6 text-center text-sm text-text-secondary">
              Designed & Developed by Mohamed Shiref
            </p>
          </footer>
        </>
      )}
    </>
  );
}

export default App;
