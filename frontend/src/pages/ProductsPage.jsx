import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import ProductModal from "../components/ProductModal";
import {
  Package,
  Search,
  Filter,
  Download,
  FileText,
  Plus,
  Menu,
  Calendar,
  Building,
  Eye,
  Trash2,
  Sparkles,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, filterCompany, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${BACKEND_URL}/products?userId=${userId}`);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = !filterCompany || product.companyName === filterCompany;
      return matchesSearch && matchesCompany;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return a.name.localeCompare(b.name);
        case "company":
          return a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId, imageUrl) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const loadingToast = toast.loading("Deleting product...");
    try {
      await axios.delete(`${BACKEND_URL}/products/${productId}`);
      
      // Delete image from Cloudinary (implement server-side deletion)
      if (imageUrl) {
        await deleteFromCloudinary(imageUrl);
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setModalOpen(false);
      toast.dismiss(loadingToast);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete product");
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

  const exportToPDF = () => {
    const loadingToast = toast.loading("Generating PDF...");
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Products Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    const tableData = filteredProducts.map((product) => [
      product.name,
      product.companyName,
      product.description || "N/A",
      new Date(product.createdAt).toLocaleDateString(),
    ]);

    if (tableData.length > 0) {
      doc.autoTable({
        head: [["Product Name", "Company", "Description", "Created Date"]],
        body: tableData,
        startY: 45,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 191, 255], textColor: [255, 255, 255] },
      });
    }

    doc.save("products-report.pdf");
    toast.dismiss(loadingToast);
    toast.success("PDF exported successfully!");
  };

  const exportToExcel = () => {
    const loadingToast = toast.loading("Generating Excel file...");
    
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProducts.map((product) => ({
        "Product Name": product.name,
        Company: product.companyName,
        Description: product.description || "N/A",
        "Created Date": new Date(product.createdAt).toLocaleDateString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, `products-${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.dismiss(loadingToast);
    toast.success("Excel file exported successfully!");
  };

  const uniqueCompanies = [...new Set(products.map((p) => p.companyName))];

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
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="relative">
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Package className="text-[#00FF99] drop-shadow-[0_0_10px_#00FF99]" size={32} />
                    Products
                  </h1>
                  <p className="text-gray-400">
                    Manage and view all your products ({filteredProducts.length} total)
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={exportToPDF}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/25"
                  >
                    <FileText size={16} />
                    Export PDF
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/25"
                  >
                    <Download size={16} />
                    Export Excel
                  </button>
                  <button
                    onClick={() => navigate("/smart-upload")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25"
                  >
                    <Sparkles size={16} />
                    Smart Upload
                  </button>
                  <button
                    onClick={() => navigate("/upload")}
                    className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] hover:from-[#0099CC] hover:to-[#1873CC] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                  />
                </div>

                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                >
                  <option value="">All Companies</option>
                  {uniqueCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="company">Company A-Z</option>
                </select>

                <div className="text-gray-400 flex items-center">
                  <Filter size={16} className="mr-2" />
                  {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#333333]/10 to-transparent"></div>
                <div className="relative">
                <Package className="text-gray-400 mx-auto mb-4" size={64} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {products.length === 0 ? "No products yet" : "No products match your filters"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {products.length === 0 
                    ? "Start by adding your first product" 
                    : "Try adjusting your search or filter criteria"}
                </p>
                {products.length === 0 && (
                  <button
                    onClick={() => navigate("/upload")}
                    className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-all"
                  >
                    <Plus size={20} />
                    Add Your First Product
                  </button>
                )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] overflow-hidden hover:border-[#00BFFF] transition-all duration-300 group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Image */}
                    <div className="aspect-video bg-[#222222] relative overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="text-gray-400" size={48} />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setModalOpen(true);
                          }}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-lg transition-all shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id, product.imageUrl)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-lg transition-all shadow-lg hover:shadow-red-500/25 backdrop-blur-sm"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 relative">
                      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1 group-hover:text-[#00BFFF] transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <Building size={14} className="mr-2 text-[#00FF99]" />
                        {product.companyName}
                      </div>

                      {product.description && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1 text-[#B266FF]" />
                          {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                        
                        {product.attributes && Object.keys(product.attributes).length > 0 && (
                          <span className="bg-gradient-to-r from-[#333333] to-[#444444] px-2 py-1 rounded text-[#00BFFF] border border-[#00BFFF]/30">
                            {Object.keys(product.attributes).length} attributes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsPage;