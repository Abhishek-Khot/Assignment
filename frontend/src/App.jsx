import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Toast from "./components/ui/Toast";
import MainPage from "./pages/MainPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Upload from "./pages/Upload";
import SmartUpload from "./pages/SmartUpload";
import ProductsPage from "./pages/ProductsPage";
import Analytics from "./pages/Analytics";
import ExportHistory from "./pages/ExportHistory";

import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <>
      <Toast />
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/smart-upload" element={<SmartUpload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/products" element={<ProductsPage />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/history" element={<ExportHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
