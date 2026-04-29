// import { useState } from "react";
// import { motion } from "framer-motion";
// import axios from "../services/api";
// import Loader from "../components/Loader";
// import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";

// export default function XRayAnalyzer() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleFileChange = (e) => {
//     const uploaded = e.target.files?.[0];
//     if (uploaded) {
//       setFile(uploaded);
//       setResult(null);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const dropped = e.dataTransfer?.files?.[0];
//     if (dropped) {
//       setFile(dropped);
//       setResult(null);
//     }
//   };

//   const handleDragOver = (e) => e.preventDefault();
//   const handleDragEnter = () => setIsDragging(true);
//   const handleDragLeave = () => setIsDragging(false);

//   const handleRemoveFile = (e) => {
//     e?.stopPropagation?.();
//     setFile(null);
//     setResult(null);
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault?.();
//     if (!file) return alert("Please upload an X-ray image!");

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     try {
//       const res = await axios.analyzeXray(formData);
//       setResult(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Error analyzing X-ray. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderConfidence = (val) => {
//     if (val == null) return "N/A";
//     if (val > 1) return `${Number(val).toFixed(2)}%`;
//     return `${(Number(val) * 100).toFixed(2)}%`;
//   };

//   return (
//     <div className="pt-28 px-6 lg:px-12 bg-gradient-to-br from-[#E6F3FF] via-white to-[#C7E8F3] min-h-screen font-inter">
//       {/* Header */}
//       <motion.header
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="text-center mb-12"
//       >
//         <h1 className="text-4xl lg:text-5xl font-extrabold text-[#006C8E] mb-4">
//           X-Ray Analyzer
//         </h1>
//         <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
//           Upload your X-ray image and let our AI provide a detailed diagnosis,
//           confidence score, and visual heatmap explanation.
//         </p>
//       </motion.header>

//       {/* Upload Box */}
//       <motion.form
//         onSubmit={handleSubmit}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragEnter={handleDragEnter}
//         onDragLeave={handleDragLeave}
//         onClick={() => document.getElementById("xrayUpload")?.click()}
//         whileHover={{ scale: 1.01 }}
//         className={`mb-12 max-w-4xl mx-auto backdrop-blur-lg border-2 border-dashed rounded-3xl p-12 text-center shadow-[inset_0_0_25px_rgba(0,0,0,0.05)] transition-all duration-500 cursor-pointer ${
//           isDragging
//             ? "border-[#00B8D9] bg-[#E6F3FF]/60"
//             : "border-gray-300 bg-white/50 hover:bg-[#E6F3FF]/40"
//         }`}
//       >
//         {!file ? (
//           <>
//             <FiUploadCloud className="text-[#00B8D9] text-6xl mx-auto mb-4" />
//             <p className="text-gray-700 font-medium mb-2 text-lg">
//               Click or drag an X-ray image to upload
//             </p>
//             <p className="text-sm text-gray-500">
//               Supported formats: PNG, JPG, JPEG
//             </p>
//           </>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="flex flex-col items-center space-y-4"
//           >
//             <FiImage className="text-[#00B8D9] text-5xl" />
//             <div className="text-center">
//               <p className="text-gray-800 font-semibold">{file.name}</p>
//               <p className="text-sm text-gray-500">
//                 {(file.size / 1024 / 1024).toFixed(2)} MB
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={handleRemoveFile}
//               className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
//             >
//               <FiX /> Remove file
//             </button>
//           </motion.div>
//         )}
//         <input
//           id="xrayUpload"
//           type="file"
//           accept=".png,.jpg,.jpeg"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </motion.form>

//       {/* Analyze Button */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex justify-center"
//       >
//         <button
//           onClick={handleSubmit}
//           disabled={!file || loading}
//           className="bg-gradient-to-r from-[#00B8D9] to-[#006C8E] text-white font-semibold py-3 px-10 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50"
//         >
//           {loading ? "Analyzing..." : "Analyze X-Ray"}
//         </button>
//       </motion.div>

//       {/* Loader */}
//       {loading && (
//         <div className="mt-10">
//           <Loader />
//         </div>
//       )}

//       {/* Results */}
//       {result && (
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="mt-16 flex flex-col lg:flex-row gap-10 items-start justify-center"
//         >
//           {/* Heatmap Visualization */}
//           <div className="w-full lg:w-1/2 space-y-4">
//             <h2 className="text-2xl font-semibold text-[#006C8E] mb-2">
//               Heatmap Visualization
//             </h2>
//             <div className="relative rounded-3xl overflow-hidden bg-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-lg">
//               {file && (
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt="Uploaded X-ray"
//                   className="w-full h-auto rounded-3xl transition-transform duration-500 hover:scale-105"
//                 />
//               )}
//               {(result.heatmap || result.heatmapUrl || result.heatmapImage) && (
//                 <img
//                   src={result.heatmap || result.heatmapUrl || result.heatmapImage}
//                   alt="AI Heatmap"
//                   className="absolute top-0 left-0 w-full h-full opacity-70 mix-blend-overlay rounded-3xl"
//                 />
//               )}
//             </div>
//           </div>

//           {/* AI Analysis */}
//           <div className="w-full lg:w-1/2 space-y-6">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="p-6 rounded-3xl bg-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.07)] border border-[#E6F3FF]"
//             >
//               <h2 className="text-xl font-semibold text-[#00B8D9] mb-2">
//                 AI Diagnosis
//               </h2>
//               <p className="text-gray-800 text-lg leading-relaxed">
//                 {result.diagnosis || result.summary || "No diagnosis available."}
//               </p>
//             </motion.div>

//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="p-6 rounded-3xl bg-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.07)] border border-[#E6F3FF]"
//             >
//               <h2 className="text-xl font-semibold text-[#00B8D9] mb-2">
//                 Confidence
//               </h2>
//               <p className="text-gray-800 text-lg font-medium">
//                 {renderConfidence(result.confidence)}
//               </p>
//             </motion.div>

//             {result.recommendations && (
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 className="p-6 rounded-3xl bg-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.07)] border border-[#E6F3FF]"
//               >
//                 <h2 className="text-xl font-semibold text-[#00B8D9] mb-2">
//                   Recommendations
//                 </h2>
//                 <p className="text-gray-700 leading-relaxed">
//                   {result.recommendations}
//                 </p>
//               </motion.div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }












import { useState } from "react";
import { motion } from "framer-motion";
import axios from "../services/api";
import Loader from "../components/Loader";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";

export default function XRayAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) {
      setFile(dropped);
      setResult(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveFile = (e) => {
    e?.stopPropagation?.();
    setFile(null);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!file) return alert("Please upload an X-ray image!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.analyzeXray(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing X-ray. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderConfidence = (val) => {
    if (val == null) return "N/A";
    if (val > 1) return `${Number(val).toFixed(2)}%`;
    return `${(Number(val) * 100).toFixed(2)}%`;
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E6F3FF] via-white to-[#E0F7FA] font-inter text-gray-800 pt-28 px-6 overflow-hidden">
      {/* Floating background blobs */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#00B8D9]/10 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-[#006C8E]/10 blur-3xl rounded-full -z-10"></div>

      {/* Header */}
      <motion.header
        {...fadeUp(0)}
        className="text-center mb-14 max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent">
          X-Ray Analyzer
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Upload your X-ray scan to receive AI-driven diagnosis, confidence
          scores, and explainable heatmap insights — instantly and securely.
        </p>
      </motion.header>

      {/* Upload Box */}
      <motion.form
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("xrayUpload")?.click()}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`relative mx-auto mb-12 max-w-4xl rounded-3xl p-12 text-center backdrop-blur-xl border-2 border-dashed transition-all duration-500 cursor-pointer shadow-[inset_4px_4px_12px_rgba(255,255,255,0.6),_0_8px_30px_rgba(0,0,0,0.08)] ${
          isDragging
            ? "border-[#00B8D9] bg-[#E6F3FF]/50"
            : "border-white/50 bg-white/60 hover:bg-white/70"
        }`}
      >
        {!file ? (
          <div className="flex flex-col items-center space-y-4">
            <FiUploadCloud className="text-[#00B8D9] text-6xl" />
            <p className="text-lg font-medium text-gray-700">
              Click or drag & drop an X-ray image
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PNG, JPG, JPEG
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <FiImage className="text-[#00B8D9] text-5xl" />
            <div className="text-center">
              <p className="text-gray-800 font-semibold">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
            >
              <FiX /> Remove file
            </button>
          </motion.div>
        )}
        <input
          id="xrayUpload"
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.form>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`px-10 py-3 rounded-2xl font-semibold text-white text-lg shadow-md transition-all duration-300 ${
            file
              ? "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] hover:shadow-xl hover:-translate-y-0.5"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze X-Ray"}
        </motion.button>
      </div>

      {/* Loader */}
      {loading && (
        <motion.div {...fadeUp(0.2)} className="mt-10 max-w-3xl mx-auto">
          <Loader />
        </motion.div>
      )}

      {/* Results Section */}
      {result && (
        <motion.section
          {...fadeUp(0.3)}
          className="mt-16 flex flex-col lg:flex-row gap-10 items-start justify-center"
        >
          {/* Left - Heatmap */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold text-[#006C8E] mb-2">
              Heatmap Visualization
            </h2>
            <div className="relative rounded-3xl overflow-hidden bg-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl border border-[#E6F3FF]">
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded X-ray"
                  className="w-full h-auto rounded-3xl transition-transform duration-500 hover:scale-105"
                />
              )}
              {(result.heatmap || result.heatmapUrl || result.heatmapImage) && (
                <img
                  src={result.heatmap || result.heatmapUrl || result.heatmapImage}
                  alt="AI Heatmap"
                  className="absolute top-0 left-0 w-full h-full opacity-70 mix-blend-overlay rounded-3xl"
                />
              )}
            </div>
          </div>

          {/* Right - AI Results */}
          <div className="w-full lg:w-1/2 space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl bg-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-[#E6F3FF]"
            >
              <h2 className="text-xl font-semibold text-[#00B8D9] mb-2">
                AI Diagnosis
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">
                {result.label || "No diagnosis available."}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl bg-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-[#E6F3FF]"
            >
              <h2 className="text-xl font-semibold text-[#00B8D9] mb-2">
                Confidence
              </h2>
              <p className="text-gray-800 text-lg font-medium">
                {renderConfidence(result.confidence)}
              </p>
            </motion.div>

            {result.recommendations && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-3xl bg-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-[#E6F3FF]"
              >
                <h2 className="text-xl font-semibold text-[#00B8D9] mb-2">
                  Recommendations
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {result.recommendations}
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
}
