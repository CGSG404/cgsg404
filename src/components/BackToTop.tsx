"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop Button
 * Appears after user scrolls >500px (desktop & mobile) and scrolls smoothly to top.
 */
const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      aria-label="Back to Top"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-casino-neon-green text-casino-dark shadow-lg transition-all duration-300 hover:bg-casino-neon-green/90 focus:outline-none focus:ring-2 focus:ring-casino-neon-green/70 focus:ring-offset-2 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
