import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const Upload = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [attributes, setAttributes] = useState({});
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Cloudinary configuration
  const CLOUD_NAME = "dvaemcnki";
  const UPLOAD_PRESET = "product_images"; // Replace with your actual upload preset

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
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
      } else {
        toast.dismiss(loadingToast);
        toast.error("Upload failed! Please check your upload preset configuration.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.dismiss(loadingToast);
      toast.error("Upload failed! Please try again.");
    } finally {
      setUploading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !companyName) {
      toast.error("Product name and company name are required!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please log in to add products");
      navigate("/login");
      return;
    }
    const productData = {
      name,
      description,
      imageUrl,
      companyName,
      attributes,
      userId,
    };

    const loadingToast = toast.loading("Creating product...");
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
        toast.success("Product created successfully!");
        // Reset form
        setName("");
        setDescription("");
        setImageUrl("");
        setCompanyName("");
        setAttributes({});
        navigate("/dashboard/products");
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to create product");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.dismiss(loadingToast);
      toast.error("An error occurred while creating the product");
    }
  };

  // Handle dynamic attribute changes
  const handleAttributeChange = (key, value) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-6">
        <div className="w-full max-w-3xl bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden relative shadow-2xl">
          {/* Glowing accent elements */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]"></div>
          <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-[#00FF99] shadow-[0_0_15px_#00FF99]"></div>
          <div className="absolute bottom-20 left-1/4 w-4 h-4 rounded-full bg-[#B266FF] shadow-[0_0_15px_#B266FF]"></div>

          {/* Header */}
          <div className="bg-[#1A1A1A] border-b border-[#333333] px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00BFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_#00BFFF]"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#1E90FF]">
                Product Information
              </span>
            </h1>
            <p className="text-sm text-center text-gray-400 mt-1">
              Please add product details below
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name Field */}
              <div className="space-y-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#00BFFF]"
                >
                  Product Name *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent glow-blue-sm transition-all duration-200"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[#00FF99]"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF99] focus:border-transparent glow-green-sm transition-all duration-200"
                  rows="3"
                />
              </div>

              {/* Image Upload Field */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#00BFFF]">
                  Product Image
                </label>

                {/* Drag and Drop Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-[#00BFFF] bg-[#00BFFF]/10"
                      : "border-[#333333] hover:border-[#00BFFF]/50"
                  }`}
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploading ? (
                    <div className="space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF] mx-auto"></div>
                      <p className="text-[#00BFFF]">Uploading...</p>
                    </div>
                  ) : imageUrl ? (
                    <div className="space-y-3">
                      <img
                        src={imageUrl}
                        alt="Uploaded product"
                        className="max-h-32 mx-auto rounded-lg border border-[#333333]"
                      />
                      <p className="text-green-400 text-sm">
                        ✓ Image uploaded successfully
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl("");
                        }}
                        className="text-red-400 text-sm hover:text-red-300"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-[#333333]"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div>
                        <p className="text-white">
                          <span className="text-[#00BFFF]">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-gray-400 text-sm">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual URL Input (fallback) */}
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1">
                    Or enter image URL manually:
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#222222] border border-[#333333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] glow-blue-sm"
                  />
                </div>
              </div>

              {/* Company Name Field */}
              <div className="space-y-3">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-[#FF7F50]"
                >
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:border-transparent glow-orange-sm transition-all duration-200"
                  required
                />
              </div>

              {/* Dynamic Attributes */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-[#FFD700]">
                    Additional Attributes
                  </label>
                  <button
                    type="button"
                    onClick={() => setAttributes({ ...attributes, "": "" })}
                    className="text-xs text-[#00BFFF] hover:text-[#1E90FF]"
                  >
                    + Add Attribute
                  </button>
                </div>

                {Object.entries(attributes).map(([key, value], index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Attribute name"
                      value={key}
                      onChange={(e) => {
                        const newAttributes = { ...attributes };
                        delete newAttributes[key];
                        newAttributes[e.target.value] = value;
                        setAttributes(newAttributes);
                      }}
                      className="flex-1 px-3 py-2 bg-[#222222] border border-[#333333] rounded text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={value}
                      onChange={(e) =>
                        handleAttributeChange(key, e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-[#222222] border border-[#333333] rounded text-white placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newAttributes = { ...attributes };
                        delete newAttributes[key];
                        setAttributes(newAttributes);
                      }}
                      className="text-red-500 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center glow-blue hover:glow-blue-lg"
                style={{
                  background: "linear-gradient(to right, #00BFFF, #1E90FF)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Create Product
              </button>
            </form>
          </div>

          {/* Footer Glow */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00BFFF] via-[#B266FF] to-[#FF7F50]"></div>
        </div>

        {/* Add global styles for glow effects */}
        <style jsx>{`
          .glow-blue {
            box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
          }
          .glow-blue-lg {
            box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
          }
          .glow-blue-sm {
            box-shadow: 0 0 5px rgba(0, 191, 255, 0.3);
          }
          .glow-green {
            box-shadow: 0 0 10px rgba(0, 255, 153, 0.3);
          }
          .glow-green-sm {
            box-shadow: 0 0 5px rgba(0, 255, 153, 0.3);
          }
          .glow-purple {
            box-shadow: 0 0 10px rgba(178, 102, 255, 0.3);
          }
          .glow-purple-sm {
            box-shadow: 0 0 5px rgba(178, 102, 255, 0.3);
          }
          .glow-orange {
            box-shadow: 0 0 10px rgba(255, 127, 80, 0.3);
          }
          .glow-orange-sm {
            box-shadow: 0 0 5px rgba(255, 127, 80, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default Upload;
