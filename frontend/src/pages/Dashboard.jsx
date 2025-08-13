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
  const CLOUD_NAME = "dvaemcnki";
  const UPLOAD_PRESET = "product_images";

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

    // Delete old photo from Cloudinary if exists
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
        // Store in localStorage to persist across refreshes
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
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
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

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]"></div>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back,{" "}
                    <span className="text-[#00BFFF]">{user?.name}</span>
                  </h1>
                  <p className="text-gray-400">
                    Manage your profile and settings
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00FF99] to-[#B266FF]"></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="text-[#00BFFF] hover:text-[#1E90FF] transition-colors flex items-center gap-2"
                >
                  {editingProfile ? <X size={20} /> : <Edit size={20} />}
                  {editingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editingProfile ? (
                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full bg-[#333333] flex items-center justify-center overflow-hidden border-4 border-[#00BFFF]">
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
                      <label className="absolute bottom-0 right-0 bg-[#00BFFF] rounded-full p-2 cursor-pointer hover:bg-[#1E90FF] transition-colors">
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
                      <p className="text-[#00BFFF] text-sm mt-2">
                        Uploading...
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
                        className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF]"
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
                        className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProfileSave}
                    className="w-full bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-[#333333] flex items-center justify-center mx-auto overflow-hidden border-4 border-[#00BFFF]">
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
                    <div className="bg-[#222222] rounded-lg p-4 border border-[#333333]">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                      </label>
                      <p className="text-white text-lg font-semibold">
                        {profileData.name || "Not set"}
                      </p>
                    </div>

                    <div className="bg-[#222222] rounded-lg p-4 border border-[#333333]">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <p className="text-white text-lg font-semibold">
                        {profileData.email}
                      </p>
                    </div>

                    <div className="bg-[#222222] rounded-lg p-4 border border-[#333333] md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Company
                      </label>
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