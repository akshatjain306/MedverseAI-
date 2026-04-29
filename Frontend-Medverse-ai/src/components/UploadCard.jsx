import { motion } from "framer-motion";

export default function UploadCard({ title, desc, icon, path, Link }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full"
    >
      <Link to={path} className="block h-full">
        <div
          className="
            relative overflow-hidden rounded-2xl p-6 h-full
            flex flex-col justify-between
            bg-white/70 backdrop-blur-lg border border-white/40
            shadow-[0_8px_30px_rgba(0,0,0,0.05)]
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]
            transition-all duration-300 ease-out
          "
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center w-16 h-16 rounded-xl mb-4 
            bg-gradient-to-br from-[#E6F3FF] to-[#C6E8F7] shadow-inner"
          >
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#006C8E] transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 flex-grow">{desc}</p>

          {/* Hover Glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 
            bg-gradient-to-br from-[#00B8D9]/10 to-[#006C8E]/10 rounded-2xl"
          ></div>
        </div>
      </Link>
    </motion.div>
  );
}
