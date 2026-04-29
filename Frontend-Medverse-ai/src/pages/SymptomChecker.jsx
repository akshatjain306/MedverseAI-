// // import { useState } from "react";
// // import axios from "../services/api";
// // import ResultCard from "../components/ResultCard";
// // import Loader from "../components/Loader";
// // import { motion } from "framer-motion";
// // import { FiActivity, FiCheckCircle } from "react-icons/fi";

// // export default function SymptomChecker() {
// //   const [symptoms, setSymptoms] = useState("");
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!symptoms.trim()) return;

// //     setLoading(true);
// //     setResult(null);

// //     try {
// //       const response = await axios.symptomCheck({ symptoms });
// //       setResult(response.data); // Expected format: { disease, confidence, explanation }
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error fetching prediction. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fadeUp = (delay = 0) => ({
// //     initial: { opacity: 0, y: 24 },
// //     animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
// //   });

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] via-white to-[#F7FBFF] pt-28 px-4 font-inter text-gray-800 relative overflow-hidden">
// //       {/* Floating background blobs */}
// //       <div className="absolute -top-10 -left-10 w-[400px] h-[400px] bg-[#00B8D9]/10 blur-3xl rounded-full -z-10"></div>
// //       <div className="absolute bottom-0 -right-10 w-[400px] h-[400px] bg-[#006C8E]/10 blur-3xl rounded-full -z-10"></div>

// //       {/* Header */}
// //       <motion.header
// //         {...fadeUp(0)}
// //         className="text-center mb-10 max-w-2xl mx-auto"
// //       >
// //         <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent">
// //           Symptom Checker
// //         </h1>
// //         <p className="text-gray-600 mt-3 text-lg">
// //           Get quick, explainable AI predictions for your symptoms — powered by
// //           Medverse AI.
// //         </p>
// //         <p className="text-xs text-yellow-500 mt-2">
// //           (Mock Mode: No backend connected)
// //         </p>
// //       </motion.header>

// //       {/* Input Form */}
// //       <motion.form
// //         onSubmit={handleSubmit}
// //         {...fadeUp(0.1)}
// //         className="
// //           max-w-3xl mx-auto
// //           rounded-2xl p-6 md:p-8
// //           bg-white/70 backdrop-blur-md border border-white/50
// //           shadow-[0_8px_30px_rgba(0,0,0,0.05)]
// //           space-y-6
// //         "
// //       >
// //         <label
// //           htmlFor="symptoms"
// //           className="text-gray-700 font-medium text-lg flex items-center gap-2"
// //         >
// //           <FiActivity className="text-[#00B8D9]" /> Describe your symptoms
// //         </label>

// //         <textarea
// //           id="symptoms"
// //           placeholder="Example: Fever, sore throat, body pain, fatigue..."
// //           value={symptoms}
// //           onChange={(e) => setSymptoms(e.target.value)}
// //           rows="6"
// //           className="
// //             w-full rounded-2xl p-4
// //             bg-white/70 border border-white/50
// //             focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/50
// //             placeholder:text-gray-400
// //             shadow-inner
// //           "
// //         />

// //         <motion.button
// //           whileTap={{ scale: 0.97 }}
// //           type="submit"
// //           disabled={loading}
// //           className={`
// //             w-full py-3 px-6 rounded-2xl font-semibold text-white text-lg
// //             transition-all duration-300 shadow-md
// //             ${
// //               loading
// //                 ? "bg-gray-300 cursor-not-allowed"
// //                 : "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] hover:shadow-lg hover:-translate-y-0.5"
// //             }
// //           `}
// //         >
// //           {loading ? "Analyzing..." : "Check Symptoms"}
// //         </motion.button>
// //       </motion.form>

// //       {/* Loader */}
// //       {loading && (
// //         <motion.div {...fadeUp(0.2)} className="mt-10 max-w-3xl mx-auto">
// //           <Loader />
// //         </motion.div>
// //       )}

// //       {/* Results */}
// //       {result && (
// //         <motion.section
// //           {...fadeUp(0.3)}
// //           className="
// //             mt-12 max-w-3xl mx-auto
// //             bg-white/70 backdrop-blur-md rounded-2xl border border-white/50
// //             shadow-[0_8px_30px_rgba(0,0,0,0.05)]
// //             p-6 md:p-8
// //             space-y-6
// //           "
// //         >
// //           <h2 className="text-2xl font-semibold text-[#006C8E] text-center mb-4">
// //             <FiCheckCircle className="inline-block text-[#00B8D9] mr-2" />
// //             AI Analysis Result
// //           </h2>

// //           <ResultCard title="Predicted Disease" content={result.disease} />
// //           <ResultCard
// //             title="Confidence Level"
// //             content={`${(result.confidence * 100).toFixed(2)}%`}
// //           />
// //           <ResultCard title="Explanation" content={result.explanation} />

// //           <div className="text-center text-gray-500 text-sm mt-4">
// //             *This is an AI prediction. Please consult a certified medical professional for confirmation.
// //           </div>
// //         </motion.section>
// //       )}
// //     </div>
// //   );
// // }













// import { useState } from "react";
// import axios from "../services/api";
// import ResultCard from "../components/ResultCard";
// import Loader from "../components/Loader";
// import { motion } from "framer-motion";
// import { FiActivity, FiCheckCircle } from "react-icons/fi";

// export default function SymptomChecker() {
//   const [symptoms, setSymptoms] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!symptoms.trim()) return;

//     setLoading(true);
//     setResult(null);

//     try {
//       const response = await axios.symptomCheck({ symptoms });
//       setResult(response.data); // { disease, confidence, explanation }
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching prediction. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fadeUp = (delay = 0) => ({
//     initial: { opacity: 0, y: 24 },
//     animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
//   });

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-[#E6F3FF] via-white to-[#E0F7FA] font-inter text-gray-800 pt-28 px-6 overflow-hidden">
//       {/* Floating Background Accents */}
//       <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#00B8D9]/10 blur-3xl rounded-full -z-10"></div>
//       <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-[#006C8E]/10 blur-3xl rounded-full -z-10"></div>

//       {/* Header */}
//       <motion.header {...fadeUp(0)} className="text-center mb-14 max-w-3xl mx-auto">
//         <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent">
//           Symptom Checker
//         </h1>
//         <p className="mt-4 text-lg text-gray-600 leading-relaxed">
//           Describe your symptoms and let our Explainable AI analyze possible conditions
//           with detailed insights and confidence levels.
//         </p>
//       </motion.header>

//       {/* Input Form */}
//       <motion.form
//         onSubmit={handleSubmit}
//         {...fadeUp(0.1)}
//         className="max-w-3xl mx-auto rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-6"
//       >
//         <label
//           htmlFor="symptoms"
//           className="text-gray-700 font-medium text-lg flex items-center gap-2"
//         >
//           <FiActivity className="text-[#00B8D9] text-xl" /> Enter your symptoms
//         </label>

//         <textarea
//           id="symptoms"
//           placeholder="Example: Fever, sore throat, cough, fatigue..."
//           value={symptoms}
//           onChange={(e) => setSymptoms(e.target.value)}
//           rows="6"
//           className="w-full rounded-2xl p-4 bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/40 placeholder:text-gray-400 shadow-inner"
//         />

//         <motion.button
//           whileTap={{ scale: 0.97 }}
//           type="submit"
//           disabled={loading}
//           className={`w-full py-3 px-6 rounded-2xl font-semibold text-white text-lg transition-all duration-300 shadow-md ${
//             loading
//               ? "bg-gray-300 cursor-not-allowed"
//               : "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] hover:shadow-xl hover:-translate-y-0.5"
//           }`}
//         >
//           {loading ? "Analyzing..." : "Check Symptoms"}
//         </motion.button>
//       </motion.form>

//       {/* Loader */}
//       {loading && (
//         <motion.div {...fadeUp(0.2)} className="mt-10 max-w-3xl mx-auto">
//           <Loader />
//         </motion.div>
//       )}

//       {/* AI Results */}
//       {result && (
//         <motion.section
//           {...fadeUp(0.3)}
//           className="mt-16 max-w-3xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8 md:p-10 space-y-6"
//         >
//           <div className="text-center mb-6">
//             <h2 className="text-3xl font-semibold text-[#006C8E] flex justify-center items-center gap-2">
//               <FiCheckCircle className="text-[#00B8D9] text-2xl" /> AI Analysis Result
//             </h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Generated using Medverse Explainable AI
//             </p>
//           </div>

//           <motion.div whileHover={{ scale: 1.02 }}>
//             <ResultCard
//               title="Predicted Condition"
//               content={result.disease || "No prediction available."}
//             />
//           </motion.div>

//           <motion.div whileHover={{ scale: 1.02 }}>
//             <ResultCard
//               title="Confidence Level"
//               content={
//                 result.confidence
//                   ? `${(result.confidence * 100).toFixed(2)}%`
//                   : "N/A"
//               }
//             />
//           </motion.div>

//           <motion.div whileHover={{ scale: 1.02 }}>
//             <ResultCard
//               title="AI Explanation"
//               content={result.explanation || "No explanation available."}
//             />
//           </motion.div>

//           <div className="text-center text-gray-500 text-sm mt-4">
//             *This is an AI-based prediction. Please consult a certified doctor for professional advice.
//           </div>
//         </motion.section>
//       )}

//       {/* Decorative Blur Elements */}
//       <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00B8D9]/10 blur-3xl rounded-full -z-10"></div>
//       <div className="absolute top-[400px] left-[-150px] w-[400px] h-[400px] bg-[#006C8E]/10 blur-3xl rounded-full -z-10"></div>
//     </div>
//   );
// }



import { useState } from "react";
import axios from "../services/api";
import ResultCard from "../components/ResultCard";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { FiActivity, FiCheckCircle } from "react-icons/fi";

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // SUBMIT FUNCTION (FIXED)
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      // Backend expects: { text: "..." }
      const response = await axios.symptomCheck({ text: symptoms });

      if (response.success === true) {
        setResult(response.data); // { disease, confidence, explanation }
      } else {
        alert("Prediction error: " + (response.error || "An unknown error occurred."));
      }

    } catch (err) {
      console.error(err);
      alert("Error fetching prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E6F3FF] via-white to-[#E0F7FA] font-inter text-gray-800 pt-28 px-6 overflow-hidden">

      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#00B8D9]/10 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-[#006C8E]/10 blur-3xl rounded-full -z-10"></div>

      <motion.header {...fadeUp(0)} className="text-center mb-14 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent">
          Symptom Checker
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Describe your symptoms and let our Explainable AI analyze possible conditions
          with detailed insights and confidence levels.
        </p>
      </motion.header>

      {/* ============================== */}
      {/* FORM (UNCHANGED UI)            */}
      {/* ============================== */}
      <motion.form
        onSubmit={handleSubmit}
        {...fadeUp(0.1)}
        className="max-w-3xl mx-auto rounded-3xl p-8 md:p-10 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-6"
      >
        <label
          htmlFor="symptoms"
          className="text-gray-700 font-medium text-lg flex items-center gap-2"
        >
          <FiActivity className="text-[#00B8D9] text-xl" /> Enter your symptoms
        </label>

        <textarea
          id="symptoms"
          placeholder="Example: Fever, sore throat, cough, fatigue..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows="6"
          className="w-full rounded-2xl p-4 bg-white/80 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/40 placeholder:text-gray-400 shadow-inner"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-2xl font-semibold text-white text-lg transition-all duration-300 shadow-md ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] hover:shadow-xl hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Analyzing..." : "Check Symptoms"}
        </motion.button>
      </motion.form>

      {/* Loader */}
      {loading && (
        <motion.div {...fadeUp(0.2)} className="mt-10 max-w-3xl mx-auto">
          <Loader />
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.section
          {...fadeUp(0.3)}
          className="mt-16 max-w-3xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8 md:p-10 space-y-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-[#006C8E] flex justify-center items-center gap-2">
              <FiCheckCircle className="text-[#00B8D9] text-2xl" /> AI Analysis Result
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Generated using Medverse Explainable AI
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <ResultCard
              title="Predicted Condition"
              content={result.disease || "No prediction available."}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <ResultCard
              title="Confidence Level"
              content={
                result.confidence
                  ? `${(result.confidence * 100).toFixed(2)}%`
                  : "N/A"
              }
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <ResultCard
              title="AI Explanation"
              content={result.explanation || "No explanation available."}
            />
          </motion.div>

          <div className="text-center text-gray-500 text-sm mt-4">
            *This is an AI-based prediction. Please consult a certified doctor for professional advice.
          </div>
        </motion.section>
      )}

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00B8D9]/10 blur-3xl rounded-full -z-10"></div>
      <div className="absolute top-[400px] left-[-150px] w-[400px] h-[400px] bg-[#006C8E]/10 blur-3xl rounded-full -z-10"></div>
    </div>
  );
}

