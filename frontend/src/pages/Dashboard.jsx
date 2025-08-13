import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  User,
  Package,
  FileText,
  Download,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  TrendingUp,
  Calendar,
  Camera,
  Save,
  X,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company: "",
    photo: "",
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    recentProducts: 0,
    companiesCount: 0,
  });

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const CLOUD_NAME = "dvaemcnki";
  const UPLOAD_PRESET = "product_images";

  useEffect(() => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");

    if (!email || !userId) {
      navigate("/login");
      return;
    }

    setUser({ email, userId, name });
    setProfileData({
      name: name || "",
      email: email || "",
      company: "XYZ", // Default company
      photo: "",
    });

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch all products from backend
      const response = await axios.get(`${BACKEND_URL}/products`);
      const fetchedProducts = response.data || [];
      setProducts(fetchedProducts);

      // Calculate analytics
      const totalProducts = fetchedProducts.length;
      const recentProducts = fetchedProducts.filter((product) => {
        const createdAt = new Date(product.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length;

      const companies = new Set(fetchedProducts.map((p) => p.companyName));

      setAnalytics({
        totalProducts,
        recentProducts,
        companiesCount: companies.size,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      // Extract public_id from Cloudinary URL
      const urlParts = imageUrl.split("/");
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      // Note: Deleting from Cloudinary requires server-side implementation
      // This is a placeholder - you'd need to implement this in your backend
      console.log("Would delete image with public_id:", publicId);
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
    }
  };

  const handleProfileSave = async () => {
    try {
      // Update localStorage
      localStorage.setItem("name", profileData.name);

      // In a real app, you'd also update the backend
      // await axios.put(`${BACKEND_URL}/users/${user.userId}`, profileData);

      setUser((prev) => ({ ...prev, name: profileData.name }));
      setEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleDeleteProduct = async (productId, imageUrl) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Delete from backend
      await axios.delete(`${BACKEND_URL}/products/${productId}`);

      // Delete image from Cloudinary
      if (imageUrl) {
        await deleteFromCloudinary(imageUrl);
      }

      // Update local state
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Products Report", 20, 20);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    // Add user info
    doc.text(`Generated by: ${user?.name || "N/A"}`, 20, 45);

    // Prepare table data
    const tableData = products.map((product) => [
      product.name,
      product.companyName,
      product.description || "N/A",
      new Date(product.createdAt).toLocaleDateString(),
    ]);

    // Add table if products exist
    if (tableData.length > 0) {
      doc.autoTable({
        head: [["Product Name", "Company", "Description", "Created Date"]],
        body: tableData,
        startY: 55,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [0, 191, 255],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
    } else {
      doc.setFontSize(12);
      doc.text("No products found.", 20, 65);
    }

    doc.save("products-report.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      products.map((product) => ({
        "Product Name": product.name,
        Company: product.companyName,
        Description: product.description || "N/A",
        Attributes: product.attributes
          ? JSON.stringify(product.attributes)
          : "N/A",
        "Created Date": new Date(product.createdAt).toLocaleDateString(),
        "Image URL": product.imageUrl || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(
      workbook,
      `products-report-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0D0D0D] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
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
                  Manage your products and analytics
                </p>
              </div>
              <button
                onClick={() => navigate("/upload")}
                className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative">
              <div className="absolute top-4 right-4">
                <Package className="text-[#00BFFF]" size={24} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">
                Total Products
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {analytics.totalProducts}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="text-green-400 mr-1" size={16} />
                <span className="text-green-400 text-sm">All time</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative">
              <div className="absolute top-4 right-4">
                <Calendar className="text-[#00FF99]" size={24} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">
                Recent Products
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {analytics.recentProducts}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="text-green-400 mr-1" size={16} />
                <span className="text-green-400 text-sm">Last 7 days</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative">
              <div className="absolute top-4 right-4">
                <BarChart3 className="text-[#B266FF]" size={24} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Companies</h3>
              <p className="text-3xl font-bold text-white mt-2">
                {analytics.companiesCount}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="text-green-400 mr-1" size={16} />
                <span className="text-green-400 text-sm">Unique</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00FF99] to-[#B266FF]"></div>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Profile</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="text-[#00BFFF] hover:text-[#1E90FF] transition-colors"
                >
                  {editingProfile ? <X size={20} /> : <Edit size={20} />}
                </button>
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  {/* Photo Upload */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-[#333333] flex items-center justify-center overflow-hidden">
                        {profileData.photo ? (
                          <img
                            src={profileData.photo}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-gray-400" size={32} />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-[#00BFFF] rounded-full p-1 cursor-pointer hover:bg-[#1E90FF] transition-colors">
                        <Camera size={16} className="text-white" />
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

                  <input
                    type="text"
                    placeholder="Name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#222222] border border-[#333333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF]"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 bg-[#222222] border border-[#333333] rounded text-gray-400 cursor-not-allowed"
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#222222] border border-[#333333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF]"
                  />

                  <button
                    onClick={handleProfileSave}
                    className="w-full bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white py-2 rounded font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-[#333333] flex items-center justify-center mx-auto overflow-hidden">
                      {profileData.photo ? (
                        <img
                          src={profileData.photo}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-gray-400" size={32} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-400 text-sm">Name</label>
                      <p className="text-white font-medium">
                        {profileData.name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white font-medium">
                        {profileData.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Company</label>
                      <p className="text-white font-medium">
                        {profileData.company}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className="lg:col-span-2 bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#B266FF] to-[#FF7F50]"></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Products</h2>
                <div className="flex gap-2">
                  <button
                    onClick={exportToPDF}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <FileText size={16} />
                    PDF
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <Download size={16} />
                    Excel
                  </button>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="text-gray-400 mx-auto mb-4" size={48} />
                  <h3 className="text-gray-400 text-lg font-medium mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding your first product
                  </p>
                  <button
                    onClick={() => navigate("/upload")}
                    className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-all"
                  >
                    <Plus size={20} />
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-[#222222] rounded-lg p-4 border border-[#333333]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          {!product.imageUrl && (
                            <div className="w-12 h-12 rounded-lg bg-[#333333] flex items-center justify-center">
                              <Package className="text-gray-400" size={20} />
                            </div>
                          )}
                          <div>
                            <h3 className="text-white font-semibold">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {product.companyName}
                            </p>
                            {product.description && (
                              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                              Created:{" "}
                              {new Date(product.createdAt).toLocaleDateString()}
                            </p>
                            {product.attributes &&
                              Object.keys(product.attributes).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {Object.entries(product.attributes)
                                    .slice(0, 3)
                                    .map(([key, value]) => (
                                      <span
                                        key={key}
                                        className="bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded"
                                      >
                                        {key}: {value}
                                      </span>
                                    ))}
                                  {Object.keys(product.attributes).length >
                                    3 && (
                                    <span className="text-gray-400 text-xs">
                                      +
                                      {Object.keys(product.attributes).length -
                                        3}{" "}
                                      more
                                    </span>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDeleteProduct(product._id, product.imageUrl)
                            }
                            className="text-red-400 hover:text-red-300 p-2 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
