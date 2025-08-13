import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  Package,
  Building,
  Calendar,
  Download,
  Mail,
  FileText,
  Menu,
  Activity,
  Users,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const COLORS = ['#00BFFF', '#00FF99', '#B266FF', '#FF7F50', '#FFD700', '#FF69B4'];

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    
    if (!userEmail || !userId) {
      navigate("/login");
      return;
    }
    
    setEmail(userEmail);
    fetchAnalytics(userId);
  }, [navigate]);

  const fetchAnalytics = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/analytics/${userId}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setExportType(type);
    setEmailModalOpen(true);
  };

  const confirmExport = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setExportLoading(true);
    const loadingToast = toast.loading(`Generating ${exportType.toUpperCase()} report...`);

    try {
      const response = await axios.post(`${BACKEND_URL}/export/${exportType}`, {
        userId,
        email: email || undefined
      });

      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success(`${exportType.toUpperCase()} report generated successfully!`);
        
        if (response.data.emailSent) {
          toast.success(`Report sent to ${email}`);
        }

        // Trigger download
        const link = document.createElement('a');
        link.href = `${BACKEND_URL}${response.data.downloadUrl}`;
        link.download = response.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Export error:", error);
      toast.error(`Failed to generate ${exportType.toUpperCase()} report`);
    } finally {
      setExportLoading(false);
      setEmailModalOpen(false);
      setExportType('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00BFFF] mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading analytics...</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/10 to-[#B266FF]/10"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#B266FF]"></div>
              
              <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <BarChart3 className="text-[#00BFFF] drop-shadow-[0_0_10px_#00BFFF]" size={32} />
                    Analytics Dashboard
                  </h1>
                  <p className="text-gray-400">
                    Comprehensive insights into your product data
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={exportLoading}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
                  >
                    <FileText size={16} />
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    disabled={exportLoading}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                  >
                    <Download size={16} />
                    Export Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden group hover:border-[#00BFFF] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="text-[#00BFFF] drop-shadow-[0_0_10px_#00BFFF]" size={24} />
                    <div className="text-2xl font-bold text-white">{analyticsData?.totalProducts || 0}</div>
                  </div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="text-green-400 mr-1" size={16} />
                    <span className="text-green-400 text-sm">+{analyticsData?.growthRate || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden group hover:border-[#00FF99] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF99]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <Building className="text-[#00FF99] drop-shadow-[0_0_10px_#00FF99]" size={24} />
                    <div className="text-2xl font-bold text-white">{analyticsData?.companiesCount || 0}</div>
                  </div>
                  <p className="text-gray-400 text-sm">Companies</p>
                  <div className="flex items-center mt-2">
                    <Users className="text-blue-400 mr-1" size={16} />
                    <span className="text-blue-400 text-sm">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden group hover:border-[#B266FF] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B266FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="text-[#B266FF] drop-shadow-[0_0_10px_#B266FF]" size={24} />
                    <div className="text-2xl font-bold text-white">{analyticsData?.exportHistory?.length || 0}</div>
                  </div>
                  <p className="text-gray-400 text-sm">Reports Generated</p>
                  <div className="flex items-center mt-2">
                    <Calendar className="text-purple-400 mr-1" size={16} />
                    <span className="text-purple-400 text-sm">This month</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden group hover:border-[#FF7F50] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7F50]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="text-[#FF7F50] drop-shadow-[0_0_10px_#FF7F50]" size={24} />
                    <div className="text-2xl font-bold text-white">
                      {analyticsData?.productsByMonth?.reduce((sum, item) => sum + item.count, 0) || 0}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Last 6 Months</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="text-orange-400 mr-1" size={16} />
                    <span className="text-orange-400 text-sm">Growing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Products by Month */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="text-[#00BFFF]" size={20} />
                  Products by Month
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData?.productsByMonth || []}>
                      <defs>
                        <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#00BFFF" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                      <XAxis 
                        dataKey="_id.month" 
                        stroke="#888888"
                        fontSize={12}
                      />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1A1A1A',
                          border: '1px solid #333333',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#00BFFF" 
                        fillOpacity={1} 
                        fill="url(#colorProducts)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Products by Company */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00FF99] to-[#B266FF]"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <PieChartIcon className="text-[#00FF99]" size={20} />
                  Products by Company
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.productsByCompany || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ _id, count }) => `${_id}: ${count}`}
                      >
                        {(analyticsData?.productsByCompany || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1A1A1A',
                          border: '1px solid #333333',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity & Export History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FFD700] to-[#FF7F50]"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Package className="text-[#FFD700]" size={20} />
                  Recent Products
                </h3>
                <div className="space-y-4">
                  {(analyticsData?.recentProducts || []).map((product) => (
                    <div key={product._id} className="flex items-center gap-4 p-3 bg-[#222222] rounded-lg border border-[#333333] hover:border-[#FFD700] transition-all">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-[#333333]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#333333] flex items-center justify-center">
                          <Package className="text-gray-400" size={20} />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{product.name}</h4>
                        <p className="text-gray-400 text-sm">{product.companyName}</p>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export History */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl border border-[#333333] p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#B266FF] to-[#FF69B4]"></div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Download className="text-[#B266FF]" size={20} />
                  Export History
                </h3>
                <div className="space-y-4">
                  {(analyticsData?.exportHistory || []).map((report) => (
                    <div key={report._id} className="flex items-center gap-4 p-3 bg-[#222222] rounded-lg border border-[#333333] hover:border-[#B266FF] transition-all">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        report.reportType === 'pdf' ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}>
                        {report.reportType === 'pdf' ? (
                          <FileText className="text-red-400" size={20} />
                        ) : (
                          <Download className="text-green-400" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{report.fileName}</h4>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <span>{report.reportType.toUpperCase()}</span>
                          {report.emailSent && (
                            <>
                              <span>•</span>
                              <Mail size={12} />
                              <span>Emailed</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] max-w-md w-full p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#B266FF]"></div>
            
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="text-[#00BFFF]" size={20} />
              Export {exportType.toUpperCase()} Report
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to receive report"
                  className="w-full px-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF]"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Leave empty to download only
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmExport}
                  disabled={exportLoading}
                  className="flex-1 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Generate Report
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEmailModalOpen(false)}
                  disabled={exportLoading}
                  className="px-6 py-3 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;