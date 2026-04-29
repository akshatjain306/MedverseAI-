



import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiGlobe } from "react-icons/fi";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-gradient-to-b from-white/60 to-[#E6F3FF]/80 backdrop-blur-md border-t border-white/40 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] text-gray-700 font-inter"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent">
            Medverse AI
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Empowering Healthcare with Explainable AI
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-[#00B8D9] transition">Privacy Policy</a>
          <a href="#" className="hover:text-[#00B8D9] transition">Terms</a>
          <a href="#" className="hover:text-[#00B8D9] transition">Contact</a>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-5 text-gray-600 text-lg">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00B8D9] transition">
            <FiGithub />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00B8D9] transition">
            <FiLinkedin />
          </a>
          <a href="/" className="hover:text-[#00B8D9] transition">
            <FiGlobe />
          </a>
        </div>
      </div>

      <div className="border-t border-white/30 text-center py-5 text-sm text-gray-500">
        © {new Date().getFullYear()} Medverse AI — All Rights Reserved.
      </div>
    </motion.footer>
  );
}
