import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { VideosProvider } from "./context/VideosContext";
import LoadingScreen from "./components/common/LoadingScreen";
import Navbar from "./components/common/Navbar";
import StarBackground from "./components/common/StarBackground";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Stats from "./components/sections/Stats";
import Contact from "./components/sections/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function HomePage() {
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

function App() {
  return (
    <BrowserRouter>
      <VideosProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </VideosProvider>
    </BrowserRouter>
  );
}

export default App;
