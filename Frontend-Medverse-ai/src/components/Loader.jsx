import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center py-16 select-none">
      {/* Glowing Gradient Orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="
          relative
          w-16 h-16
          rounded-full
          bg-gradient-to-r from-[#00B8D9] via-[#009AC1] to-[#006C8E]
          animate-spin-slow
          shadow-[0_0_40px_rgba(0,184,217,0.3)]
          border-4 border-white/40 backdrop-blur-lg
        "
      >
        {/* Inner core */}
        <div className="absolute inset-2 rounded-full bg-white/60 blur-md"></div>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="mt-6 text-gray-600 font-medium text-sm tracking-wide"
      >
        Analyzing with Medverse AI...
      </motion.p>
    </div>
  );
}
