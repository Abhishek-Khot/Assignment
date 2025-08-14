import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  User,
  Camera,
  Save,
  Menu,
  Edit,
  X,
  Package,
  Building,
  Calendar,
  Sparkles,
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company: "",
    photo: "",
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const navigate = useNavigate();
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  useEffect(() => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const photo = localStorage.getItem("photo");

    if (!email || !userId) {
      navigate("/login");
      return;
    }

    setUser({ email, userId, name });
    setProfileData({
      name: name || "",
      email: email || "",
      company: "XYZ",
      photo: photo || "",
    });
    setLoading(false);
  }, [navigate]);

  const handlePhotoUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploadingPhoto(true);

    if (profileData.photo) {
      await deleteFromCloudinary(profileData.photo);
    }

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
        setProfileData((prev) => ({ ...prev, photo: data.secure_url }));
        localStorage.setItem("photo", data.secure_url);
      } else {
        alert("Upload failed! Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed! Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const deleteFromCloudinary = async (imageUrl) => {
    try {
      const urlParts = imageUrl.split("/");
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];
      console.log("Would delete image with public_id:", publicId);
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
    }
  };

  const handleProfileSave = async () => {
    try {
      localStorage.setItem("name", profileData.name);
      localStorage.setItem("photo", profileData.photo);

      setUser((prev) => ({ ...prev, name: profileData.name }));
      setEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
        </div>
      </div>
    );
  }

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
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FF99]/10 to-[#00BFFF]/10"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00FF99] to-[#00BFFF]"></div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
                <div className="relative">
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <User
                      className="text-[#00FF99] drop-shadow-[0_0_10px_#00FF99]"
                      size={32}
                    />
                    User Dashboard
                  </h1>
                  <p className="text-gray-400">
                    Manage your profile and account settings
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/dashboard/products")}
                    className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] hover:from-[#0099CC] hover:to-[#1873CC] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <Package size={16} />
                    View Products
                  </button>
                  <button
                    onClick={() => navigate("/smart-upload")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25"
                  >
                    <Sparkles size={16} />
                    Smart Upload
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]"></div>

              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <User size={24} className="text-[#00BFFF]" />
                  Profile Information
                </h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] hover:from-[#0099CC] hover:to-[#1873CC] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  {editingProfile ? <X size={16} /> : <Edit size={16} />}
                  {editingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editingProfile ? (
                <div className="space-y-6 relative z-10">
                  {/* Photo Upload */}
                  <div className="text-center">
                    <div className="relative inline-block group">
                      <div className="w-32 h-32 rounded-full bg-[#222222] flex items-center justify-center overflow-hidden border-4 border-[#00BFFF] group-hover:border-[#00FF99] transition-all duration-300">
                        {profileData.photo ? (
                          <img
                            src={profileData.photo}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-gray-400" size={48} />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] rounded-full p-2 cursor-pointer hover:from-[#0099CC] hover:to-[#1873CC] transition-all shadow-lg">
                        <Camera size={20} className="text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files[0] &&
                            handlePhotoUpload(e.target.files[0])
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                    {uploadingPhoto && (
                      <p className="text-[#00BFFF] text-sm mt-2 flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00BFFF]"></div>
                        Uploading photo...
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="Enter company name"
                        value={profileData.company}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProfileSave}
                    className="w-full bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] hover:from-[#0099CC] hover:to-[#1873CC] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-[#222222] flex items-center justify-center mx-auto overflow-hidden border-4 border-[#00BFFF] hover:border-[#00FF99] transition-all duration-300">
                      {profileData.photo ? (
                        <img
                          src={profileData.photo}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-gray-400" size={48} />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-[#222222] to-[#333333] rounded-lg p-6 border border-[#333333] hover:border-[#00BFFF] transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <User
                          size={20}
                          className="text-[#00BFFF] group-hover:text-[#00FF99] transition-colors"
                        />
                        <label className="block text-sm font-medium text-gray-400">
                          Full Name
                        </label>
                      </div>
                      <p className="text-white text-lg font-semibold">
                        {profileData.name || "Not set"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#222222] to-[#333333] rounded-lg p-6 border border-[#333333] hover:border-[#00BFFF] transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-3">
                        <Building
                          size={20}
                          className="text-[#00BFFF] group-hover:text-[#00FF99] transition-colors"
                        />
                        <label className="block text-sm font-medium text-gray-400">
                          Email Address
                        </label>
                      </div>
                      <p className="text-white text-lg font-semibold">
                        {profileData.email}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#222222] to-[#333333] rounded-lg p-6 border border-[#333333] hover:border-[#00BFFF] transition-all duration-300 group md:col-span-2">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar
                          size={20}
                          className="text-[#00BFFF] group-hover:text-[#00FF99] transition-colors"
                        />
                        <label className="block text-sm font-medium text-gray-400">
                          Company
                        </label>
                      </div>
                      <p className="text-white text-lg font-semibold">
                        {profileData.company}
                      </p>
                    </div>
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

export default Dashboard;
