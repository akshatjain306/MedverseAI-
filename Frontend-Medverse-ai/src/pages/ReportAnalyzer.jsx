// import { useState } from "react";
// import axios from "../services/api";
// import ResultCard from "../components/ResultCard";
// import Loader from "../components/Loader";
// import { motion } from "framer-motion";
// import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";

// export default function ReportAnalyzer() {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile) {
//       setFile(uploadedFile);
//       setResult(null);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) {
//       setFile(droppedFile);
//       setResult(null);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleRemoveFile = () => {
//     setFile(null);
//     setResult(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please upload a report first!");

//     const formData = new FormData();
//     formData.append("file", file);

//     setLoading(true);
//     try {
//       const res = await axios.reportAnalyze(formData);
//       setResult(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Error analyzing report. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] via-white to-[#F7FBFF] font-inter text-gray-800 pt-28 px-4">
//       {/* Header */}
//       <motion.header
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-center mb-12 max-w-3xl mx-auto"
//       >
//         <h1 className="text-5xl font-semibold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent leading-tight">
//           Report Analyzer
//         </h1>
//         <p className="mt-4 text-lg text-gray-600">
//           Upload your medical report (PDF or image) to receive AI-generated insights,
//           summaries, and recommendations — securely and transparently.
//         </p>
//       </motion.header>

//       {/* Upload Section */}
//       <motion.form
//         onSubmit={handleSubmit}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onClick={() => document.getElementById("fileUpload").click()}
//         whileHover={{ scale: 1.01 }}
//         transition={{ type: "spring", stiffness: 200 }}
//         className={`relative mx-auto mb-10 max-w-3xl text-center rounded-2xl p-12 cursor-pointer backdrop-blur-md border-2 border-dashed transition-all duration-300 ${
//           isDragging
//             ? "border-[#00B8D9] bg-[#E6F3FF]/50"
//             : "border-white/50 bg-white/60 hover:bg-white/70"
//         } shadow-[inset_6px_6px_12px_rgba(255,255,255,0.6),_0_8px_30px_rgba(0,0,0,0.05)]`}
//       >
//         {!file ? (
//           <div className="flex flex-col items-center space-y-4">
//             <FiUploadCloud className="text-[#00B8D9] text-6xl" />
//             <p className="text-lg font-medium text-gray-700">
//               Click or drag & drop your report
//             </p>
//             <p className="text-sm text-gray-500">
//               Supported formats: PDF, PNG, JPG, JPEG
//             </p>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center space-y-3">
//             <FiFileText className="text-[#006C8E] text-5xl" />
//             <div>
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
//           </div>
//         )}

//         <input
//           id="fileUpload"
//           type="file"
//           accept=".pdf,.png,.jpg,.jpeg"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </motion.form>

//       {/* Analyze Button */}
//       <div className="flex justify-center">
//         <motion.button
//           whileTap={{ scale: 0.97 }}
//           onClick={handleSubmit}
//           disabled={!file || loading}
//           className={`px-10 py-3 rounded-2xl font-semibold text-white text-lg shadow-md transition-all duration-300 ${
//             file
//               ? "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] hover:shadow-lg hover:-translate-y-0.5"
//               : "bg-gray-300 cursor-not-allowed"
//           }`}
//         >
//           {loading ? "Analyzing..." : "Analyze Report"}
//         </motion.button>
//       </div>

//       {/* Results Section */}
//       <div className="mt-12 space-y-6 max-w-3xl mx-auto">
//         {loading && <Loader />}
//         {result && (
//           <>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <ResultCard title="Summary" content={result.summary} />
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1, duration: 0.6 }}
//             >
//               <ResultCard title="Key Findings" content={result.keyFindings} />
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 40 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//             >
//               <ResultCard title="Recommendations" content={result.recommendations} />
//             </motion.div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
















import { useState } from "react";
import axios from "../services/api";
import Loader from "../components/Loader";
import ResultCard from "../components/ResultCard";
import { motion } from "framer-motion";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";

export default function ReportAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveFile = () => {
    setFile(null);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a report first!");

    setLoading(true);
    try {
      const res = await axios.uploadLabReport(file);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F3FF] via-white to-[#E0F7FA] font-inter text-gray-800 pt-28 px-6">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent">
          Report Analyzer
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Upload your medical report (PDF or Image) and let our AI deliver structured insights,
          summarized findings, and personalized recommendations — securely and transparently.
        </p>
      </motion.header>

      {/* Upload Section */}
      <motion.form
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("fileUpload").click()}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`relative mx-auto max-w-3xl rounded-3xl p-12 text-center cursor-pointer 
        backdrop-blur-xl border-2 border-dashed shadow-[inset_4px_4px_12px_rgba(255,255,255,0.6),_0_8px_30px_rgba(0,0,0,0.08)] 
        transition-all duration-500 ${
          isDragging
            ? "border-[#00B8D9] bg-[#E6F3FF]/60"
            : "border-white/40 bg-white/60 hover:bg-white/70"
        }`}
      >
        {!file ? (
          <div className="flex flex-col items-center space-y-4">
            <FiUploadCloud className="text-[#00B8D9] text-6xl" />
            <p className="text-lg font-medium text-gray-700">
              Click or drag & drop your medical report
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, PNG, JPG, JPEG
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <FiFileText className="text-[#006C8E] text-5xl" />
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
          id="fileUpload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.form>

      {/* Analyze Button */}
      <div className="flex justify-center mt-10">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`px-10 py-3 rounded-2xl font-semibold text-white text-lg shadow-md transition-all duration-300 
          ${
            file
              ? "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] hover:shadow-xl hover:-translate-y-0.5"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Report"}
        </motion.button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="mt-12 flex justify-center">
          <Loader />
        </div>
      )}

      {/* Result Section */}
      {result && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 max-w-4xl mx-auto space-y-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-xl border border-[#E6F3FF] rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-6"
          >
            <ResultCard title="Summary" content={result.summary || "No summary available."} />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-xl border border-[#E6F3FF] rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-6"
          >
            <ResultCard title="Key Findings" content={result.keyFindings || "No findings available."} />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/70 backdrop-blur-xl border border-[#E6F3FF] rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-6"
          >
            <ResultCard
              title="Recommendations"
              content={result.recommendations || "No recommendations available."}
            />
          </motion.div>
        </motion.section>
      )}

      {/* Decorative Bottom Blur Circles */}
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[#00B8D9]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 left-10 w-[400px] h-[400px] bg-[#006C8E]/10 rounded-full blur-3xl"></div>
    </div>
  );
}
