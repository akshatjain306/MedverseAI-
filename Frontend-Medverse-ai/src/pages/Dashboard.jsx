// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FaHeartbeat, FaFileMedical, FaXRay, FaUserMd } from "react-icons/fa";
// import UploadCard from "../components/UploadCard";

// const modules = [
//   {
//     title: "Symptom Checker",
//     icon: <FaHeartbeat className="text-[#006C8E] text-4xl" />,
//     path: "/symptom",
//     desc: "AI-assisted symptom analysis with medical accuracy.",
//   },
//   {
//     title: "Report Analyzer",
//     icon: <FaFileMedical className="text-[#006C8E] text-4xl" />,
//     path: "/report",
//     desc: "Extract structured insights from complex reports.",
//   },
//   {
//     title: "X-Ray Analyzer",
//     icon: <FaXRay className="text-[#006C8E] text-4xl" />,
//     path: "/xray",
//     desc: "Explainable radiology analysis powered by AI.",
//   },
//   {
//     title: "Healthcare Scheduler",
//     icon: <FaUserMd className="text-[#006C8E] text-4xl" />,
//     path: "/scheduler",
//     desc: "Smart scheduling system for doctors and patients.",
//   },
// ];

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] via-white to-[#F7FBFF] font-inter text-gray-800">
//       {/* Header Section */}
//       <header className="text-center pt-24 pb-12 relative overflow-hidden">
//         {/* Floating Blobs */}
//         <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#00B8D9]/10 blur-3xl rounded-full -z-10"></div>
//         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#006C8E]/10 blur-3xl rounded-full -z-10"></div>

//         <motion.h1
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-5xl md:text-6xl font-semibold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent"
//         >
//           Medverse AI Dashboard
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
//         >
//           Empowering healthcare professionals with explainable, intelligent, and
//           secure AI solutions.
//         </motion.p>
//       </header>

//       {/* Modules Grid */}
//       <main className="max-w-7xl mx-auto px-6 pb-24">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {modules.map((mod, index) => (
//             <UploadCard
//               key={index}
//               title={mod.title}
//               desc={mod.desc}
//               icon={mod.icon}
//               path={mod.path}
//               Link={Link}
//             />
//           ))}
//         </div>

//         {/* Stats Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
//         >
//           {[
//             { label: "AI Models Active", value: "3", color: "#00B8D9" },
//             { label: "System Uptime", value: "99.99%", color: "#006C8E" },
//             { label: "Reports Processed", value: "25K+", color: "#00B8D9" },
//           ].map((stat, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.03 }}
//               className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 text-center shadow-lg"
//             >
//               <h4 className="text-3xl font-bold" style={{ color: stat.color }}>
//                 {stat.value}
//               </h4>
//               <p className="text-gray-600 mt-1 text-sm font-medium">
//                 {stat.label}
//               </p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-white/30 bg-white/40 backdrop-blur-lg py-6 text-center text-gray-600 text-sm">
//         © {new Date().getFullYear()} Medverse AI • Trusted Explainable Healthcare Intelligence
//       </footer>
//     </div>
//   );
// }











import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat, FaFileMedical, FaXRay, FaUserMd } from "react-icons/fa";
import UploadCard from "../components/UploadCard";

const modules = [
  {
    title: "Symptom Checker",
    icon: <FaHeartbeat className="text-[#00B8D9] text-4xl" />,
    path: "/symptom",
    desc: "AI-assisted symptom analysis with medical accuracy.",
  },
  {
    title: "Report Analyzer",
    icon: <FaFileMedical className="text-[#00B8D9] text-4xl" />,
    path: "/report",
    desc: "Extract structured insights from complex medical reports.",
  },
  {
    title: "X-Ray Analyzer",
    icon: <FaXRay className="text-[#00B8D9] text-4xl" />,
    path: "/xray",
    desc: "Explainable radiology analysis powered by deep learning.",
  },
  {
    title: "DocThink — Healthcare Scheduler",
    icon: <FaUserMd className="text-[#00B8D9] text-4xl" />,
    path: "/scheduler",
    desc: "AI-based scheduling and doctor recommendation assistant.",
  },
];

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#E6F3FF] via-white to-[#F7FBFF] font-inter text-gray-800 overflow-hidden">
      {/* Decorative Floating Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[#00B8D9]/15 blur-3xl rounded-full animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[#006C8E]/15 blur-3xl rounded-full animate-pulse-slow -z-10"></div>

      {/* Header Section */}
      <header className="text-center pt-24 pb-12 relative">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-semibold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent"
        >
          Medverse AI Dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Your central hub for Explainable AI healthcare tools — analyze,
          interpret, and schedule seamlessly.
        </motion.p>
      </header>

      {/* Modules Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative"
            >
              <UploadCard
                title={mod.title}
                desc={mod.desc}
                icon={mod.icon}
                path={mod.path}
                Link={Link}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Healthcare Tools Active", value: "4", color: "#00B8D9" },
            { label: "System Uptime", value: "99.99%", color: "#006C8E" },
            { label: "Reports Processed", value: "25K+", color: "#00B8D9" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all"
            >
              <h4
                className="text-4xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </h4>
              <p className="text-gray-600 mt-1 text-sm font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
