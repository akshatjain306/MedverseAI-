// import React from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   FaHeartbeat,
//   FaFlask,
//   FaXRay,
//   FaRobot,
//   FaQuoteLeft,
// } from "react-icons/fa";

// // Smooth scroll helper
// const scrollToSection = (id) => {
//   document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
// };

// export default function MainPage() {
//   const [scrolled, setScrolled] = React.useState(false);

//   React.useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 30);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="relative font-inter text-gray-900 bg-gradient-to-b from-[#F8FBFF] via-[#EAF6FF] to-[#F5FAFF] overflow-x-hidden">
//       {/* ---------- STYLISH NAVBAR ---------- */}
//       <motion.nav
//         initial={{ y: -40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className={`
//           fixed top-4 left-1/2 transform -translate-x-1/2
//           w-[92%] md:w-[88%] z-50 rounded-2xl transition-all duration-500
//           ${
//             scrolled
//               ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] scale-[0.98]"
//               : "bg-white/40 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
//           }
//         `}
//       >
//         <div className="flex justify-between items-center px-6 md:px-10 py-3">
//           {/* LOGO */}
//           <motion.h1
//             whileHover={{ scale: 1.05 }}
//             className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent tracking-tight"
//           >
//             Medverse<span className="text-[#00B8D9]"> AI</span>
//           </motion.h1>

//           {/* NAV LINKS */}
//           <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">
//             {[
//               { name: "About", id: "about" },
//               { name: "Features", id: "features" },
//               { name: "DocThink", id: "docthink" },
//               { name: "Testimonials", id: "testimonials" },
//             ].map((link, i) => (
//               <motion.button
//                 key={i}
//                 onClick={() => scrollToSection(link.id)}
//                 whileHover={{ scale: 1.1 }}
//                 className="relative text-gray-700 hover:text-[#00B8D9] transition-all duration-300"
//               >
//                 {link.name}
//                 <motion.span
//                   whileHover={{ width: "100%" }}
//                   className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-[#00B8D9] to-[#006C8E] rounded-full transition-all duration-300"
//                 ></motion.span>
//               </motion.button>
//             ))}
//           </div>


//           {/* MOBILE MENU BUTTON */}
//           <div className="md:hidden flex items-center">
//             <button className="p-2 rounded-xl bg-white/40 border border-white/30 shadow-sm hover:shadow-md transition">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={2}
//                 stroke="currentColor"
//                 className="w-6 h-6 text-[#006C8E]"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </motion.nav>

//       {/* ---------- HERO SECTION ---------- */}
//       <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-32 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#E0F7FA] via-[#F0FAFF] to-[#E8F0FF] animate-gradient-slow -z-10"></div>
//         <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#00B8D9]/10 rounded-full blur-3xl animate-pulse-slow"></div>
//         <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#006C8E]/10 rounded-full blur-3xl animate-pulse-slow"></div>

//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent leading-tight"
//         >
//           Empowering Healthcare with Explainable AI
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl"
//         >
//           Revolutionizing diagnostics and healthcare insights through
//           transparency, intelligence, and human-centered AI.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-10 flex flex-col sm:flex-row gap-4"
//         >
//           <Link
//             to="/dashboard"
//             className="px-8 py-3 bg-gradient-to-r from-[#02d9ff] to-[#025e7a] text-white font-medium rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
//           >
//             Get Started
//           </Link>

//           <button
//             onClick={() => scrollToSection("about")}
//             className="px-8 py-3 bg-white/70 border border-white/30 text-[#006C8E] font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition backdrop-blur-md"
//           >
//             Learn More
//           </button>
//         </motion.div>
//       </section>

//       {/* ---------- ABOUT US ---------- */}
//       <section
//         id="about"
//         className="py-24 bg-gradient-to-b from-white to-[#EAF6FF] text-center"
//       >
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-4xl font-bold text-[#006C8E]"
//         >
//           About <span className="text-[#00B8D9]">Medverse AI</span>
//         </motion.h2>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg"
//         >
//           Medverse AI is a next-generation healthcare platform designed to bring
//           explainability, trust, and precision to medical AI. From diagnostics
//           to consultations, our system empowers patients and doctors with clear,
//           AI-driven insights.
//         </motion.p>
//       </section>

//       {/* ---------- FEATURES ---------- */}
//       <section id="features" className="py-24 bg-[#F8FBFF]">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <h2 className="text-4xl font-bold text-[#006C8E] mb-12">
//             Key Features
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             {[
//               {
//                 icon: <FaHeartbeat className="text-5xl text-[#00B8D9]" />,
//                 title: "Symptom Checker",
//                 desc: "AI-driven symptom evaluation providing accurate preliminary diagnostics.",
//                 path: "/symptom",
//               },
//               {
//                 icon: <FaFlask className="text-5xl text-[#00B8D9]" />,
//                 title: "Lab Report Analyzer",
//                 desc: "Instant AI interpretation of lab results with explainable insights.",
//                 path: "/report",
//               },
//               {
//                 icon: <FaXRay className="text-5xl text-[#00B8D9]" />,
//                 title: "X-Ray Analyzer",
//                 desc: "Smart vision model that detects anomalies with detailed reasoning.",
//                 path: "/xray",
//               },
//             ].map((feature, i) => (
//               <Link
//                 key={i}
//                 to={feature.path}
//                 className="group relative block rounded-2xl overflow-hidden"
//               >
//                 <motion.div
//                   whileInView={{ opacity: 1, y: 0 }}
//                   initial={{ opacity: 0, y: 30 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.6, delay: i * 0.2 }}
//                   className="p-8 bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
//                 >
//                   <div className="flex justify-center mb-4">{feature.icon}</div>
//                   <h3 className="text-2xl font-semibold text-[#006C8E] mb-3 group-hover:text-[#00B8D9] transition">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-600">{feature.desc}</p>
//                 </motion.div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ---------- DOCTHINK ---------- */}
//       <section
//         id="docthink"
//         className="py-24 bg-gradient-to-b from-[#EAF6FF] to-[#F8FBFF] text-center"
//       >
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-4xl font-bold text-[#006C8E] mb-10"
//         >
//           Meet <span className="text-[#00B8D9]">DocThink</span>
//         </motion.h2>

//         <Link to="/scheduler">
//           <motion.div
//             whileInView={{ opacity: 1, y: 0 }}
//             initial={{ opacity: 0, y: 30 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="p-10 max-w-4xl mx-auto bg-white/70 border border-white/40 backdrop-blur-md rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer"
//           >
//             <FaRobot className="text-6xl text-[#00B8D9] mx-auto mb-4" />
//             <p className="text-gray-700 text-lg">
//               DocThink is your AI healthcare companion. It interprets your
//               reports, explains AI findings, and helps you connect with the
//               right doctor — online or offline — for a seamless healthcare
//               experience.
//             </p>
//           </motion.div>
//         </Link>
//       </section>

//       {/* ---------- TESTIMONIALS ---------- */}
//       <section id="testimonials" className="py-24 bg-[#F8FBFF] text-center">
//         <h2 className="text-4xl font-bold text-[#006C8E] mb-10">
//           What People Say
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
//           {[
//             {
//               name: "Dr. Mehta",
//               text: "DocThink transformed how I interact with patients — AI transparency at its best!",
//             },
//             {
//               name: "Anjali Sharma",
//               text: "The symptom checker was incredibly accurate and easy to use.",
//             },
//             {
//               name: "Rahul Verma",
//               text: "I booked my consultation in minutes. The AI insights saved me days of confusion.",
//             },
//           ].map((t, i) => (
//             <motion.div
//               key={i}
//               whileInView={{ opacity: 1, y: 0 }}
//               initial={{ opacity: 0, y: 30 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.2 }}
//               className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-md"
//             >
//               <FaQuoteLeft className="text-3xl text-[#00B8D9] mb-3 mx-auto" />
//               <p className="text-gray-700 italic mb-4">"{t.text}"</p>
//               <h4 className="font-semibold text-[#006C8E]">{t.name}</h4>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ---------- FOOTER ---------- */}
//       <footer className="bg-[#006C8E] text-white py-8 text-center">
//         <p>© {new Date().getFullYear()} Medverse AI. All Rights Reserved.</p>
//         <p className="text-sm text-gray-200 mt-2">
//           Built with ❤️ by the Medverse AI Team
//         </p>
//       </footer>
//     </div>
//   );
// }



























import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaFlask,
  FaXRay,
  FaRobot,
  FaQuoteLeft,
} from "react-icons/fa";

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function MainPage() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-inter text-gray-900 bg-gradient-to-b from-[#F8FBFF] via-[#EAF6FF] to-[#F5FAFF] min-h-screen overflow-x-hidden">
      {/* ---------- NAVBAR ---------- */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-[88%] px-6 md:px-10 py-3 flex justify-between items-center rounded-2xl border transition-all duration-700
          ${
            scrolled
              ? "bg-white/80 border-white/40 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] scale-[0.98]"
              : "bg-white/50 border-white/30 backdrop-blur-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)]"
          }`}
      >
        {/* Logo */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent"
        >
          Medverse<span className="text-[#00B8D9]"> AI</span>
        </motion.h1>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {["About", "Features", "DocThink", "Testimonials"].map((name) => (
            <motion.button
              key={name}
              onClick={() => scrollToSection(name.toLowerCase())}
              whileHover={{ scale: 1.05 }}
              className="relative text-gray-700 hover:text-[#00B8D9] transition"
            >
              {name}
              <motion.span
                layoutId="underline"
                className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-[#00B8D9] to-[#006C8E] rounded-full group-hover:w-full transition-all"
              />
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-32 overflow-hidden">
        {/* Gradient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0F7FA] via-[#F0FAFF] to-[#E8F0FF] -z-10"></div>
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#00B8D9]/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#006C8E]/10 rounded-full blur-3xl animate-pulse-slow"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent leading-tight"
        >
          Empowering Healthcare with Explainable AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl"
        >
          Revolutionizing diagnostics and healthcare insights through
          transparency, intelligence, and human-centered AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-gradient-to-r from-[#02d9ff] to-[#025e7a] text-white font-medium rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition"
          >
            Get Started
          </Link>
          <button
            onClick={() => scrollToSection("about")}
            className="px-8 py-3 bg-white/70 border border-white/30 text-[#006C8E] font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition backdrop-blur-md"
          >
            Learn More
          </button>
        </motion.div>
      </section>

      {/* ---------- ABOUT US ---------- */}
      <section id="about" className="py-24 bg-gradient-to-b from-white to-[#EAF6FF] text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-[#006C8E]"
        >
          About <span className="text-[#00B8D9]">Medverse AI</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg"
        >
          Medverse AI brings trust, precision, and transparency to healthcare AI.
          From diagnostics to consultations, our platform empowers patients and
          doctors with meaningful, explainable insights.
        </motion.p>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="py-24 bg-[#F8FBFF]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#006C8E] mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <FaHeartbeat className="text-5xl text-[#00B8D9]" />,
                title: "Symptom Checker",
                desc: "AI-driven evaluation for accurate preliminary diagnostics.",
                path: "/symptom",
              },
              {
                icon: <FaFlask className="text-5xl text-[#00B8D9]" />,
                title: "Lab Report Analyzer",
                desc: "Instantly interpret reports with explainable AI insights.",
                path: "/report",
              },
              {
                icon: <FaXRay className="text-5xl text-[#00B8D9]" />,
                title: "X-Ray Analyzer",
                desc: "Detect anomalies with vision-based AI and reasoning.",
                path: "/xray",
              },
            ].map((feature, i) => (
              <Link key={i} to={feature.path}>
                <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 40 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="p-8 bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold text-[#006C8E] mb-3 group-hover:text-[#00B8D9] transition">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- DOCTHINK ---------- */}
      <section id="docthink" className="py-24 bg-gradient-to-b from-[#EAF6FF] to-[#F8FBFF] text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-[#006C8E] mb-10"
        >
          Meet <span className="text-[#00B8D9]">DocThink</span>
        </motion.h2>
        <Link to="/scheduler">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 max-w-4xl mx-auto bg-white/70 border border-white/40 backdrop-blur-md rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer"
          >
            <FaRobot className="text-6xl text-[#00B8D9] mx-auto mb-4" />
            <p className="text-gray-700 text-lg">
              Your personal AI healthcare companion. It interprets reports,
              explains AI findings, and connects you with the right doctor.
            </p>
          </motion.div>
        </Link>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section id="testimonials" className="py-24 bg-[#F8FBFF] text-center">
        <h2 className="text-4xl font-bold text-[#006C8E] mb-10">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            { name: "Dr. Mehta", text: "DocThink revolutionized patient care with AI transparency!" },
            { name: "Anjali Sharma", text: "The symptom checker is precise, fast, and intuitive." },
            { name: "Rahul Verma", text: "I scheduled my consultation in minutes—brilliant experience!" },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <FaQuoteLeft className="text-3xl text-[#00B8D9] mb-3 mx-auto" />
              <p className="text-gray-700 italic mb-4">"{t.text}"</p>
              <h4 className="font-semibold text-[#006C8E]">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}















