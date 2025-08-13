import { useState } from "react";
import { X, Calendar, Building, FileText, Download, Trash2 } from "lucide-react";
import jsPDF from "jspdf";

const ProductModal = ({ product, isOpen, onClose, onDelete }) => {
  if (!isOpen || !product) return null;

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("Product Report", 20, 20);
    
    // Product details
    doc.setFontSize(12);
    doc.text(`Product Name: ${product.name}`, 20, 40);
    doc.text(`Company: ${product.companyName}`, 20, 50);
    doc.text(`Description: ${product.description || 'N/A'}`, 20, 60);
    doc.text(`Created: ${new Date(product.createdAt).toLocaleDateString()}`, 20, 70);
    
    // Attributes
    if (product.attributes && Object.keys(product.attributes).length > 0) {
      doc.text("Attributes:", 20, 90);
      let yPos = 100;
      Object.entries(product.attributes).forEach(([key, value]) => {
        doc.text(`• ${key}: ${value}`, 25, yPos);
        yPos += 10;
      });
    }
    
    doc.save(`${product.name}-report.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <h2 className="text-xl font-bold text-white">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {product.imageUrl && (
            <div className="text-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full h-64 object-cover rounded-lg border border-[#333333] mx-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Product Name
              </label>
              <p className="text-white text-lg font-semibold">{product.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company
              </label>
              <div className="flex items-center text-white">
                <Building size={16} className="mr-2 text-blue-400" />
                {product.companyName}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <p className="text-white">
                {product.description || "No description provided"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Created Date
              </label>
              <div className="flex items-center text-white">
                <Calendar size={16} className="mr-2 text-green-400" />
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Additional Attributes
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-[#222222] rounded-lg p-3 border border-[#333333]"
                  >
                    <div className="text-sm text-gray-400">{key}</div>
                    <div className="text-white font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#333333]">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={16} />
              Export PDF
            </button>
            
            <button
              onClick={() => onDelete(product._id, product.imageUrl)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;