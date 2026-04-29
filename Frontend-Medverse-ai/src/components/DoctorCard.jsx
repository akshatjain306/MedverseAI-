import { motion } from "framer-motion";
import { FiMapPin, FiUser, FiStar } from "react-icons/fi";

export default function DoctorCard({ doctor, specialization, fee, address, rating = 5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      className="
        relative bg-white/70 backdrop-blur-xl
        border border-white/40
        rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        p-6 md:p-8 
        transition-all duration-500
        group
      "
    >
      {/* Decorative glow ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E6F3FF]/30 via-[#00B8D9]/10 to-[#006C8E]/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>

      {/* Doctor Info */}
      <div className="relative flex items-center mb-6">
        <div
          className="
            w-16 h-16 rounded-full 
            bg-gradient-to-tr from-[#00B8D9] to-[#006C8E]
            p-[3px] shadow-inner shadow-white/20
          "
        >
          <div className="w-full h-full rounded-full bg-white/80 backdrop-blur-lg flex items-center justify-center text-[#006C8E] font-bold text-2xl">
            {doctor.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="ml-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 leading-tight">
            {doctor}
          </h2>
          <p className="text-sm text-[#00B8D9] font-medium tracking-wide">
            {specialization}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="relative space-y-3 text-sm text-gray-700">
        <p className="flex items-center gap-2">
          <FiUser className="text-[#00B8D9]" />
          <span>Consultation Fee: <strong className="text-[#006C8E]">₹{fee}</strong></span>
        </p>

        <p className="flex items-center gap-2">
          <FiMapPin className="text-[#00B8D9]" />
          <span>{address}</span>
        </p>

        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`transition-transform duration-300 ${
                i < rating
                  ? "text-yellow-400 fill-yellow-400 scale-110"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-1 text-gray-700 font-medium">{rating}.0 / 5</span>
        </div>
      </div>

      {/* Hover badge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute top-3 right-3 bg-gradient-to-r from-[#00B8D9] to-[#006C8E] text-white text-xs px-3 py-1 rounded-full shadow-md"
      >
        Verified
      </motion.div>
    </motion.div>
  );
}
