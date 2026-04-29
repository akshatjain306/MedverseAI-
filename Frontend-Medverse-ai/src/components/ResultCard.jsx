import { motion } from "framer-motion";

export default function ResultCard({ title, content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 12px 30px rgba(0, 184, 217, 0.15)",
      }}
      className="
        relative
        rounded-2xl
        p-6 md:p-8
        bg-white/70 backdrop-blur-md border border-white/40
        shadow-[0_8px_30px_rgba(0,0,0,0.05)]
        transition-all duration-300
      "
    >
      {/* Accent Bar */}
      <div className="absolute left-0 top-0 h-full w-[4px] rounded-l-2xl bg-gradient-to-b from-[#00B8D9] to-[#006C8E]" />

      {/* Title */}
      <h2 className="text-lg md:text-xl font-semibold mb-3 bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent">
        {title}
      </h2>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {content || "No data available."}
      </p>

      {/* Soft Glow Hover Effect */}
      <div
        className="
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          bg-gradient-to-r from-[#E6F3FF]/40 to-[#F7FBFF]/20
        "
      ></div>
    </motion.div>
  );
}
