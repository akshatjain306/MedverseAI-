import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiActivity } from "react-icons/fi";

export default function Navbar() {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide Navbar when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Symptom Checker", path: "/symptom" },
    { name: "Report Analyzer", path: "/report" },
    { name: "X-Ray Analyzer", path: "/xray" },
    { name: "Scheduler", path: "/scheduler" },
  ];

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.nav
          key="navbar"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="
            fixed top-4 left-1/2 transform -translate-x-1/2
            w-[92%] md:w-[88%]
            z-50
            bg-white/60 backdrop-blur-lg border border-white/30
            rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          "
        >
          <div className="flex justify-between items-center px-6 md:px-10 py-3">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-semibold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent"
            >
              <FiActivity className="text-[#00B8D9]" />
              Medverse AI
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-1 transition-all duration-300 ${
                      isActive
                        ? "text-[#006C8E] font-semibold"
                        : "text-gray-700 hover:text-[#00B8D9]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="underline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00B8D9] to-[#006C8E] rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button className="text-[#006C8E] hover:text-[#00B8D9] transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
