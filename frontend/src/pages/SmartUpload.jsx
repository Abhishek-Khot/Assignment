import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Sparkles, Upload, Image as ImageIcon, Loader } from "lucide-react";
import Sidebar from "../components/Sidebar";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Loader,
  Menu,
  Trash2,
} from "lucide-react";

const SmartUpload = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Cloudinary configuration
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEN_AI_API_KEY);

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Uploading image...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        toast.dismiss(loadingToast);
        toast.success("Image uploaded successfully!");
        await analyzeImage(data.secure_url);
      } else {
        toast.dismiss(loadingToast);
        toast.error(
          "Upload failed! Please check your upload preset configuration."
        );
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.dismiss(loadingToast);
      toast.error("Upload failed! Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const analyzeImage = async (imageUrl) => {
    setAnalyzing(true);
    const loadingToast = toast.loading("AI is analyzing your product...");

    try {
      // Convert image to base64 for Gemini
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(blob);
      });

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze this product image and provide detailed information in JSON format with the following structure:
      {
        "name": "Product name",
        "description": "Detailed product description",
        "companyName": "Estimated or visible company/brand name (or 'Unknown' if not visible)",
        "category": "Product category",
        "attributes": {
          "color": "Primary color",
          "material": "Estimated material",
          "size": "Estimated size category",
          "condition": "Estimated condition",
          "features": "Key features visible"
        }
      }
      
      Please be as detailed and accurate as possible based on what you can see in the image.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: blob.type,
            data: base64,
          },
        },
      ]);

      const responseText = result.response.text();

      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        setAnalysisResult(analysisData);
        toast.dismiss(loadingToast);
        toast.success("AI analysis completed successfully!");
      } else {
        throw new Error("Could not parse AI response");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.dismiss(loadingToast);
      toast.error(
        "Failed to analyze image. Please try again or fill details manually."
      );

      // Fallback analysis
      setAnalysisResult({
        name: "Product Analysis Failed",
        description: "Please fill in the details manually",
        companyName: "Unknown",
        category: "Unknown",
        attributes: {
          color: "Unknown",
          material: "Unknown",
          condition: "Unknown",
        },
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!analysisResult) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please log in to save products");
      navigate("/login");
      return;
    }
    setSaving(true);
    const loadingToast = toast.loading("Saving AI-analyzed product...");

    const productData = {
      name: analysisResult.name,
      description: analysisResult.description,
      imageUrl: imageUrl,
      companyName: analysisResult.companyName,
      userId,
      attributes: {
        ...analysisResult.attributes,
        category: analysisResult.category,
        aiGenerated: true,
        analyzedAt: new Date().toISOString(),
      },
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/products`,
        productData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        toast.dismiss(loadingToast);
        toast.success("Product created successfully with AI analysis!");
        navigate("/dashboard/products");
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to create product");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.dismiss(loadingToast);
      toast.error("An error occurred while creating the product");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#1A1A1A] border-b border-[#333333] p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-gray-300"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#B266FF]/10 to-[#FF69B4]/10"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#B266FF] to-[#FF69B4]"></div>

              <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Sparkles
                      className="text-[#B266FF] drop-shadow-[0_0_10px_#B266FF]"
                      size={32}
                    />
                    Smart AI Product Upload
                  </h1>
                  <p className="text-gray-400">
                    Upload an image and let AI analyze your product
                    automatically
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]"></div>

              {/* Upload Section */}
              {!imageUrl && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-[#00BFFF] bg-[#00BFFF]/10"
                      : "border-[#333333] hover:border-[#00BFFF]/50"
                  }`}
                  onClick={() =>
                    document.getElementById("smartImageInput").click()
                  }
                >
                  <input
                    id="smartImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploading ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00BFFF] mx-auto"></div>
                      <p className="text-[#00BFFF] text-lg">
                        Uploading image...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#1E90FF]/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                        <Upload className="text-[#00BFFF]" size={48} />
                      </div>
                      <div>
                        <p className="text-white text-xl font-semibold mb-2">
                          Drop your product image here
                        </p>
                        <p className="text-gray-400">
                          or{" "}
                          <span className="text-[#00BFFF]">
                            click to browse
                          </span>
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Supports PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Section */}
              {imageUrl && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <ImageIcon size={20} />
                      Uploaded Image
                    </h3>
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt="Uploaded product"
                        className="w-full h-64 object-cover rounded-lg border border-[#333333]"
                      />
                      <button
                        onClick={() => {
                          setImageUrl("");
                          setAnalysisResult(null);
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Analysis Results */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Sparkles size={20} />
                      AI Analysis
                    </h3>

                    {analyzing ? (
                      <div className="bg-[#222222] rounded-lg p-6 border border-[#333333] text-center">
                        <Loader
                          className="animate-spin text-[#00BFFF] mx-auto mb-4"
                          size={32}
                        />
                        <p className="text-[#00BFFF] font-medium">
                          Analyzing your product...
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          This may take a few seconds
                        </p>
                      </div>
                    ) : analysisResult ? (
                      <div className="bg-[#222222] rounded-lg p-6 border border-[#333333] space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Product Name
                          </label>
                          <input
                            type="text"
                            value={analysisResult.name}
                            onChange={(e) =>
                              setAnalysisResult((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded text-white focus:outline-none focus:border-[#00BFFF]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Description
                          </label>
                          <textarea
                            value={analysisResult.description}
                            onChange={(e) =>
                              setAnalysisResult((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows="3"
                            className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded text-white focus:outline-none focus:border-[#00BFFF]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              value={analysisResult.companyName}
                              onChange={(e) =>
                                setAnalysisResult((prev) => ({
                                  ...prev,
                                  companyName: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded text-white focus:outline-none focus:border-[#00BFFF]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Category
                            </label>
                            <input
                              type="text"
                              value={analysisResult.category}
                              onChange={(e) =>
                                setAnalysisResult((prev) => ({
                                  ...prev,
                                  category: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded text-white focus:outline-none focus:border-[#00BFFF]"
                            />
                          </div>
                        </div>

                        {/* Attributes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Detected Attributes
                          </label>
                          <div className="space-y-2">
                            {Object.entries(
                              analysisResult.attributes || {}
                            ).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <input
                                  type="text"
                                  value={key}
                                  onChange={(e) => {
                                    const newAttributes = {
                                      ...analysisResult.attributes,
                                    };
                                    delete newAttributes[key];
                                    newAttributes[e.target.value] = value;
                                    setAnalysisResult((prev) => ({
                                      ...prev,
                                      attributes: newAttributes,
                                    }));
                                  }}
                                  className="flex-1 px-2 py-1 bg-[#1A1A1A] border border-[#333333] rounded text-white text-sm"
                                />
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => {
                                    const newAttributes = {
                                      ...analysisResult.attributes,
                                    };
                                    newAttributes[key] = e.target.value;
                                    setAnalysisResult((prev) => ({
                                      ...prev,
                                      attributes: newAttributes,
                                    }));
                                  }}
                                  className="flex-1 px-2 py-1 bg-[#1A1A1A] border border-[#333333] rounded text-white text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleSaveProduct}
                          disabled={saving}
                          className="w-full bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <Loader className="animate-spin" size={16} />
                              Saving Product...
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} />
                              Save AI-Analyzed Product
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartUpload;
