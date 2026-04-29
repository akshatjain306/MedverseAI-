import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import ReportAnalyzer from "./pages/ReportAnalyzer";
import XRayAnalyzer from "./pages/XRayAnalyzer";
import Scheduler from "./pages/Scheduler";
import MainPage from "./pages/MainPage";

// ✅ Create a wrapper component to control Navbar visibility
function Layout({ children }) {
  const location = useLocation();

  // Hide Navbar only on the main landing page
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptom" element={<SymptomChecker />} />
          <Route path="/report" element={<ReportAnalyzer />} />
          <Route path="/xray" element={<XRayAnalyzer />} />
          <Route path="/scheduler" element={<Scheduler />} />
        </Routes>
        <Footer />
      </Layout>
    </Router>
  );
}
