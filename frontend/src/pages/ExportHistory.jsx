import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import {
  Download,
  FileText,
  Mail,
  Calendar,
  Search,
  Filter,
  Menu,
  Eye,
  Trash2,
  RefreshCw
} from "lucide-react";

const ExportHistory = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchReports(userId);
  }, [navigate]);

  useEffect(() => {
    filterAndSortReports();
  }, [reports, searchTerm, filterType, sortBy]);

  const fetchReports = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/export/history/${userId}`);
      setReports(response.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load export history");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReports = () => {
    let filtered = reports.filter((report) => {
      const matchesSearch = report.fileName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = !filterType || report.reportType === filterType;
      return matchesSearch && matchesType;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return a.fileName.localeCompare(b.fileName);
        case "type":
          return a.reportType.localeCompare(b.reportType);
        default:
          return 0;
      }
    });

    setFilteredReports(filtered);
  };

  const handleDownload = (report) => {
    const link = document.createElement('a');
    link.href = `${BACKEND_URL}${report.pdfUrl}`;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00BFFF] mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading export history...</p>
          </div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#B266FF]/10 to-[#FF69B4]/10"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#B266FF] to-[#FF69B4]"></div>
              
              <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Download className="text-[#B266FF] drop-shadow-[0_0_10px_#B266FF]" size={32} />
                    Export History
                  </h1>
                  <p className="text-gray-400">
                    View and manage your exported reports ({filteredReports.length} total)
                  </p>
                </div>
                
                <button
                  onClick={() => fetchReports(localStorage.getItem("userId"))}
                  className="bg-gradient-to-r from-[#B266FF] to-[#FF69B4] hover:from-[#9A4FE8] hover:to-[#E55A9C] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
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
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                >
                  <option value="">All Types</option>
                  <option value="pdf">PDF Reports</option>
                  <option value="excel">Excel Reports</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00BFFF] focus:shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="type">Type</option>
                </select>

                <div className="text-gray-400 flex items-center">
                  <Filter size={16} className="mr-2" />
                  {filteredReports.length} of {reports.length} reports
                </div>
              </div>
            </div>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#333333]/10 to-transparent"></div>
                <div className="relative">
                  <Download className="text-gray-400 mx-auto mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {reports.length === 0 ? "No reports generated yet" : "No reports match your filters"}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {reports.length === 0 
                      ? "Generate your first report from the Analytics page" 
                      : "Try adjusting your search or filter criteria"}
                  </p>
                  {reports.length === 0 && (
                    <button
                      onClick={() => navigate("/dashboard/analytics")}
                      className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-all"
                    >
                      <FileText size={20} />
                      Go to Analytics
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden group hover:border-[#00BFFF] transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative flex items-center gap-6">
                      {/* File Icon */}
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        report.reportType === 'pdf' 
                          ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30' 
                          : 'bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30'
                      }`}>
                        {report.reportType === 'pdf' ? (
                          <FileText className="text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" size={28} />
                        ) : (
                          <Download className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" size={28} />
                        )}
                      </div>

                      {/* Report Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{report.fileName}</h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              report.reportType === 'pdf' 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {report.reportType.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                          
                          {report.fileSize && (
                            <div className="flex items-center gap-1">
                              <FileText size={14} />
                              {formatFileSize(report.fileSize)}
                            </div>
                          )}
                          
                          {report.emailSent && (
                            <div className="flex items-center gap-1 text-blue-400">
                              <Mail size={14} />
                              Emailed to {report.sentToEmail}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 rounded text-xs ${
                              report.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : report.status === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownload(report)}
                          className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] hover:from-[#0099CC] hover:to-[#1873CC] text-white p-3 rounded-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                          title="Download Report"
                        >
                          <Download size={16} />
                          Download
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
  );
};

export default ExportHistory;