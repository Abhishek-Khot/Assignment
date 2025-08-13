import React, { useState, useEffect } from "react";
import CountUp from "../components/ui/CountUp";
import axios from "axios";
import SplitText from "../components/ui/SplitText";
import {
  Mail,
  AlertTriangle,
  XCircle,
  Ban,
  LogOut,
  User,
  Briefcase,
  Calendar,
  ChevronDown,
  Download,
  BarChart2,
  PieChart,
  Activity,
  X,
  TrendingUp,
  Search,
  Settings,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const RecruiterInfoCard = ({ recruiterInfo }) => (
  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="bg-cyan-500/20 p-3 rounded-full">
          <User className="w-6 h-6 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        </div>
        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">
          <SplitText
            text={recruiterInfo.name}
            // className="text-xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            // rootMargin="-100px"
            textAlign="center"
            // onLetterAnimationComplete={handleAnimationComplete}
          />
          {/* {recruiterInfo.name} */}
        </h3>
        <p className="text-gray-300">
          <SplitText
            text={recruiterInfo.email}
            // className="text-xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            // rootMargin="-100px"
            textAlign="center"
            // onLetterAnimationComplete={handleAnimationComplete}
          />
        </p>
      </div>
    </div>

    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-purple-400" />
        <span className="text-gray-200">
          <SplitText
            text={recruiterInfo.jobRole}
            // className="text-xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            // rootMargin="-100px"
            textAlign="center"
            // onLetterAnimationComplete={handleAnimationComplete}
          />
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Briefcase className="w-5 h-5 text-orange-400" />
        <span className="text-gray-200">
          <SplitText
            text={recruiterInfo.companyName}
            // className="text-xl font-semibold text-center"
            delay={100}
            duration={0.3}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            // rootMargin="-100px"
            textAlign="center"
            // onLetterAnimationComplete={handleAnimationComplete}
          />
        </span>
      </div>
    </div>

    <LogoutButton />
  </div>
);

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-colors shadow-lg hover:shadow-red-500/20"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
};

const StatsCard = ({ candidates }) => {
  const stats = {
    total: candidates.length,
    cheating: candidates.filter((c) => c.isCheating).length,
    aptitudePassed: candidates.filter((c) => c.aptitudeStatus === "Passed")
      .length,
    techPassed: candidates.filter((c) => c.techStatus === "Passed").length,
    hrPending: candidates.filter((c) => c.hrStatus === "Pending").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {[
        {
          label: "Total Candidates",
          value: stats.total,
          border: "border-cyan-500",
          text: "text-cyan-400",
          icon: <User className="w-5 h-5" />,
        },
        {
          label: "Cheating Detected",
          value: stats.cheating,
          border: "border-red-500",
          text: "text-red-400",
          icon: <AlertTriangle className="w-5 h-5" />,
        },
        {
          label: "Aptitude Passed",
          value: stats.aptitudePassed,
          border: "border-green-500",
          text: "text-green-400",
          icon: <TrendingUp className="w-5 h-5" />,
        },
        {
          label: "Technical Passed",
          value: stats.techPassed,
          border: "border-purple-500",
          text: "text-purple-400",
          icon: <Activity className="w-5 h-5" />,
        },
        {
          label: "HR Pending",
          value: stats.hrPending,
          border: "border-orange-500",
          text: "text-orange-400",
          icon: <Calendar className="w-5 h-5" />,
        },
      ].map((stat, index) => (
        <div
          key={index}
          className={`bg-gray-800 rounded-xl p-5 border-l-4 ${
            stat.border
          } shadow-lg hover:shadow-${
            stat.border.split("-")[1]
          }-500/20 transition-all`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full bg-${
                stat.border.split("-")[1]
              }-500/20`}
            >
              {stat.icon}
            </div>
            <h3 className="text-gray-300 text-sm font-medium">{stat.label}</h3>
          </div>
          <div className="mt-3 flex items-baseline">
            <p className={`text-3xl font-bold ${stat.text}`}>
              <CountUp
                from={0}
                to={stat.value}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
            </p>
            <div className="ml-2 bg-black/30 text-white text-xs px-2 py-1 rounded-full">
              <CountUp
                from={0}
                to={
                  stats.total > 0
                    ? ((stat.value / stats.total) * 100).toFixed(1)
                    : 0
                }
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
              %
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CandidateCard = ({
  candidate,
  onReject,
  onEmail,
  onInterview,
  recruiterInfo,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Passed":
        return "text-green-400";
      case "Failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg transition-all hover:shadow-cyan-500/10 ${
        candidate.isCheating ? "border-red-500/50" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            {candidate.isCheating && (
              <button
                onClick={() => onReject(candidate)}
                className="text-red-400 hover:text-red-300 transition"
                title="View cheating evidence"
              >
                <AlertTriangle size={20} />
              </button>
            )}
            <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
          </div>
          <p className="text-cyan-400 mt-1">{candidate.email}</p>
        </div>

        <button
          onClick={() => onEmail(candidate)}
          className={`p-2 rounded-full hover:bg-gray-700 ${
            candidate.isCheating
              ? "text-red-400 hover:text-red-300"
              : "text-blue-400 hover:text-blue-300"
          } transition-colors`}
          title="Send email"
        >
          <Mail size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-gray-400 text-sm">Aptitude</p>
          <p
            className={`${getStatusColor(
              candidate.aptitudeStatus
            )} flex items-center`}
          >
            {candidate.aptitudeStatus}
            {candidate.aptitudeStatus === "Passed" && (
              <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
            {candidate.aptitudeStatus === "Failed" && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Technical</p>
          <p
            className={`${getStatusColor(
              candidate.techStatus
            )} flex items-center`}
          >
            {candidate.techStatus}
            {candidate.techStatus === "Passed" && (
              <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
            {candidate.techStatus === "Failed" && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </p>
        </div>

        <div className="col-span-2">
          <p className="text-gray-400 text-sm">HR Round</p>
          {candidate.hrStatus === "Pending" ? (
            <button
              onClick={() => {
                localStorage.setItem(
                  "interviewRecruiterEmail",
                  recruiterInfo.email
                );
                localStorage.setItem(
                  "interviewCandidateEmail",
                  candidate.email
                );
                onInterview();
              }}
              className="w-full mt-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors shadow-lg hover:shadow-cyan-500/20 text-sm"
            >
              Take Interview
            </button>
          ) : (
            <p
              className={`${getStatusColor(
                candidate.hrStatus
              )} flex items-center`}
            >
              {candidate.hrStatus}
              {candidate.hrStatus === "Passed" && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              )}
              {candidate.hrStatus === "Failed" && (
                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const RecruitmentDashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [recruiterInfo, setRecruiterInfo] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [mlCandidateEmail, setMlCandidateEmail] = useState("");
  const [mlAnalytics, setMlAnalytics] = useState(null);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlRecs, setMlRecs] = useState([]);
  const [mlAttempts, setMlAttempts] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const fetchMlAnalytics = async () => {
    try {
      const ownerUserId = localStorage.getItem("userId");
      if (!ownerUserId || !mlCandidateEmail) return;
      const res = await axios.get(`${BACKEND_URL}/getStudentAnalytics`, {
        params: { ownerUserId, candidateEmail: mlCandidateEmail },
      });
      setMlAnalytics(res.data.analytics);
      setMlPrediction(res.data.prediction);
      const rec = await axios.get(`${BACKEND_URL}/getLearningRecommendations`, {
        params: { ownerUserId, candidateEmail: mlCandidateEmail },
      });
      setMlRecs(rec.data.recommendations || []);
      const attempts = await axios.get(`${BACKEND_URL}/getStudentAttempts`, {
        params: { ownerUserId, candidateEmail: mlCandidateEmail },
      });
      setMlAttempts(attempts.data.attempts || []);
    } catch (e) {
      console.error("Failed to fetch ML analytics", e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/getUserInfo/${userId}`
        );
        setRecruiterInfo(response.data);

        const enrichedCandidates = response.data.candidateData.map(
          (candidate) => ({
            ...candidate,
            aptitudeStatus: response.data.aptitudePassesCandidates.includes(
              candidate.email
            )
              ? "Passed"
              : response.data.aptitudeFailedCandidates.includes(candidate.email)
              ? "Failed"
              : "Pending",
            techStatus: response.data.techPassesCandidates.includes(
              candidate.email
            )
              ? "Passed"
              : response.data.techFailedCandidates.includes(candidate.email)
              ? "Failed"
              : "Pending",
            hrStatus: "Pending",
            isCheating: !!(candidate.cheatImage || candidate.cheatComment),
          })
        );

        setCandidates(enrichedCandidates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRejectCandidate = async (candidate) => {
    try {
      const templateParams = {
        to_email: candidate.email,
      };

      await cheateEmail(templateParams);
      setCandidates(candidates.filter((c) => c.email !== candidate.email));
      setRejectionModalOpen(false);
      alert(`Candidate ${candidate.name} has been rejected`);
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      alert("Failed to reject candidate");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      candidates.map((candidate) => ({
        Name: candidate.name,
        Email: candidate.email,
        "Aptitude Status": candidate.aptitudeStatus,
        "Technical Status": candidate.techStatus,
        "HR Status": candidate.hrStatus,
        "Cheating Detected": candidate.isCheating ? "Yes" : "No",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, "candidates_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(34, 211, 238); // Cyan
    doc.text("Candidate Recruitment Report", 105, 20, { align: "center" });

    // Table
    doc.autoTable({
      head: [["Name", "Email", "Aptitude", "Technical", "HR", "Cheating"]],
      body: candidates.map((candidate) => [
        candidate.name,
        candidate.email,
        candidate.aptitudeStatus,
        candidate.techStatus,
        candidate.hrStatus,
        candidate.isCheating ? "Yes" : "No",
      ]),
      startY: 30,
      theme: "grid",
      headStyles: {
        fillColor: [34, 211, 238], // Cyan
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [30, 41, 59], // Dark slate
      },
    });

    doc.save("candidates_report.pdf");
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 font-['Poppins']">
      {/* Top Bar */}
      <div className="relative mb-10">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Glowing effect behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 relative z-10">
              Recruitment Dashboard
            </h1>
          </div>

          {/* Subheading with animated border */}
          {/* <div className="mt-4 relative block">
            <p className="text-xl text-gray-300 relative z-10">
              Manage candidates and track progress
            </p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
          </div> */}
        </div>

        {/* Utility icons */}
        <div className="absolute top-0 right-0 flex space-x-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Bell size={24} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {recruiterInfo && <RecruiterInfoCard recruiterInfo={recruiterInfo} />}

          <StatsCard candidates={candidates} />

          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">
                Candidate Management
              </h2>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <div className="relative flex-1 min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div className="flex space-x-3 items-center">
                  <button
                    onClick={() => setAnalysisModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center space-x-2 shadow-lg hover:shadow-purple-500/20"
                  >
                    <BarChart2 className="w-5 h-5" />
                    <span>Analytics</span>
                  </button>

                  <div className="relative group">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-cyan-500/20">
                      <Download size={18} />
                      <span>Export</span>
                      <ChevronDown
                        size={16}
                        className="transition-transform group-hover:rotate-180"
                      />
                    </button>
                    <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-xl z-10 hidden group-hover:block border border-gray-700">
                      <button
                        onClick={exportToExcel}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-t-lg flex items-center transition-colors"
                      >
                        <span>Excel</span>
                      </button>
                      <button
                        onClick={exportToPDF}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-b-lg flex items-center transition-colors"
                      >
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex bg-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 text-sm ${
                        viewMode === "grid"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-gray-400"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 text-sm ${
                        viewMode === "list"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-gray-400"
                      }`}
                    >
                      List
                    </button>
                  </div>

                  {/* ML quick analytics */}
                  <input
                    type="email"
                    value={mlCandidateEmail}
                    onChange={(e) => setMlCandidateEmail(e.target.value)}
                    placeholder="Candidate email for ML"
                    className="px-3 py-2 bg-gray-700 text-white rounded"
                  />
                  <button
                    onClick={fetchMlAnalytics}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    Load ML
                  </button>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.email}
                      candidate={candidate}
                      onReject={(c) => {
                        setSelectedCandidate(c);
                        setRejectionModalOpen(true);
                      }}
                      onEmail={(c) => {
                        setSelectedCandidate(c);
                        setEmailModalOpen(true);
                      }}
                      onInterview={() => navigate(`/hrRoundEntrance`)}
                      recruiterInfo={recruiterInfo}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    <div className="text-lg">No candidates found</div>
                    <p className="mt-2">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-200 font-semibold">
                        Candidate
                      </th>
                      <th className="px-4 py-3 text-left text-gray-200 font-semibold">
                        Aptitude
                      </th>
                      <th className="px-4 py-3 text-left text-gray-200 font-semibold">
                        Technical
                      </th>
                      <th className="px-4 py-3 text-left text-gray-200 font-semibold">
                        HR Round
                      </th>
                      <th className="px-4 py-3 text-center text-gray-200 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredCandidates.map((candidate) => (
                      <tr
                        key={candidate.email}
                        className="hover:bg-gray-750 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {candidate.isCheating && (
                              <button
                                onClick={() => {
                                  setSelectedCandidate(candidate);
                                  setRejectionModalOpen(true);
                                }}
                                className="mr-2 text-red-400 hover:text-red-300 transition"
                                title="View cheating evidence"
                              >
                                <AlertTriangle size={16} />
                              </button>
                            )}
                            <div>
                              <div className="font-medium text-white">
                                {candidate.name}
                              </div>
                              <div className="text-cyan-400 text-sm">
                                {candidate.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-4 py-3 ${
                            candidate.aptitudeStatus === "Passed"
                              ? "text-green-400"
                              : candidate.aptitudeStatus === "Failed"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {candidate.aptitudeStatus}
                        </td>
                        <td
                          className={`px-4 py-3 ${
                            candidate.techStatus === "Passed"
                              ? "text-green-400"
                              : candidate.techStatus === "Failed"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {candidate.techStatus}
                        </td>
                        <td className="px-4 py-3">
                          {candidate.hrStatus === "Pending" ? (
                            <button
                              onClick={() => {
                                localStorage.setItem(
                                  "interviewRecruiterEmail",
                                  recruiterInfo.email
                                );
                                localStorage.setItem(
                                  "interviewCandidateEmail",
                                  candidate.email
                                );
                                navigate(`/hrRoundEntrance`);
                              }}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors text-sm"
                            >
                              Take Interview
                            </button>
                          ) : (
                            <span
                              className={`${
                                candidate.hrStatus === "Passed"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {candidate.hrStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setEmailModalOpen(true);
                            }}
                            className={`p-1.5 rounded-full hover:bg-gray-700 ${
                              candidate.isCheating
                                ? "text-red-400 hover:text-red-300"
                                : "text-blue-400 hover:text-blue-300"
                            } transition-colors`}
                            title="Send email"
                          >
                            <Mail size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {mlAnalytics && (
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4">Student Analytics</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <div>Attempts: <span className="text-white font-semibold">{mlAnalytics.totalAttempts}</span></div>
                <div>Avg Accuracy: <span className="text-white font-semibold">{Math.round((mlAnalytics.avgAccuracy||0)*100)}%</span></div>
                <div>Avg Speed: <span className="text-white font-semibold">{(mlAnalytics.avgSpeedQpm||0).toFixed(2)} q/min</span></div>
                <div>Weak Areas: <span className="text-white">{(mlAnalytics.commonWeakAreas||[]).join(", ")||"None"}</span></div>
                {mlPrediction && (
                  <div>Next Difficulty: <span className="text-white font-semibold">{mlPrediction.nextTestDifficulty}</span></div>
                )}
                {mlRecs && mlRecs.length > 0 && (
                  <div className="mt-3">
                    <div className="font-semibold text-white mb-1">Recommendations</div>
                    <ul className="list-disc ml-5">
                      {mlRecs.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {mlAttempts && mlAttempts.length > 0 && (
                  <div className="mt-4">
                    <div className="font-semibold text-white mb-2">Latest Technical Attempt (per-problem)</div>
                    <div className="space-y-3 max-h-72 overflow-auto">
                      {(mlAttempts[mlAttempts.length - 1]?.questions || []).filter(q => q.questionType === 'coding').map((q, idx) => (
                        <div key={idx} className="border border-gray-700 rounded p-3">
                          <div className="text-white font-medium">{q.title || `Problem ${idx+1}`}</div>
                          <div className="text-xs text-gray-400">Difficulty: {q.complexity || 'unknown'} | Time: {q.timeSpentSeconds || 0}s | Attempts: {q.attempts || 0}</div>
                          <div className="text-xs text-gray-400 mt-1">Time: {q.timeComplexityBigO || '-'} | Space: {q.spaceComplexityBigO || '-'}</div>
                          <div className="text-xs text-gray-400 mt-1">Algo: {q.algorithmStrategy || '-'} ({q.algorithmCategory || '-'})</div>
                          <div className="text-xs text-gray-400 mt-1">DS: {(q.primaryDataStructures||[]).join(', ')}</div>
                          {q.patterns && q.patterns.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">Patterns: {q.patterns.join(', ')}</div>
                          )}
                          {q.potentialImprovements && q.potentialImprovements.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">Improvements: {q.potentialImprovements.join('; ')}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center">
                <Mail className="mr-2" size={18} />
                Send Bulk Email
              </button>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg hover:shadow-purple-500/20 flex items-center justify-center">
                <User className="mr-2" size={18} />
                Add New Candidate
              </button>
              <button
                onClick={() => setAnalysisModalOpen(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg hover:shadow-green-500/20 flex items-center justify-center"
              >
                <BarChart2 className="mr-2" size={18} />
                View Analytics
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {filteredCandidates.slice(0, 3).map((candidate, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-cyan-500/10 p-2 rounded-full">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{candidate.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {candidate.aptitudeStatus === "Passed"
                        ? "Passed aptitude test"
                        : candidate.techStatus === "Passed"
                        ? "Passed technical round"
                        : "New application"}
                    </p>
                    <p className="text-gray-500 text-xs">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">
              Status Overview
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Candidates</span>
                <span className="text-white font-bold">
                  <CountUp
                    from={0}
                    to={candidates.length}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Interviews Pending</span>
                <span className="text-orange-400 font-bold">
                  {candidates.filter((c) => c.hrStatus === "Pending").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cheating Cases</span>
                <span className="text-red-400 font-bold">
                  {candidates.filter((c) => c.isCheating).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Hired Candidates</span>
                <span className="text-green-400 font-bold">
                  {candidates.filter((c) => c.hrStatus === "Passed").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        candidateEmail={selectedCandidate?.email || ""}
      />

      <CandidateRejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        candidate={selectedCandidate || {}}
        onReject={handleRejectCandidate}
      />

      <AnalysisModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        candidates={candidates}
      />

      {!recruiterInfo && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const EmailModal = ({ isOpen, onClose, candidateEmail }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      await axios.post("/send-email", {
        to: candidateEmail,
        message,
      });
      alert("Email sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative rounded-xl overflow-hidden p-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 w-full max-w-md">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              Send Email to{" "}
              <span className="text-cyan-400">{candidateEmail}</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <textarea
            className="w-full h-40 bg-gray-700 text-white border border-gray-600 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition shadow-lg hover:shadow-cyan-500/30"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateRejectionModal = ({ isOpen, onClose, candidate, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative rounded-xl overflow-hidden p-[2px] bg-gradient-to-r from-red-500 to-pink-600 w-full max-w-2xl">
        <div className="bg-gray-800 rounded-xl overflow-y-auto max-h-[90vh]">
          <div className="bg-gradient-to-r from-red-600 to-pink-700 text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Candidate Cheating Evidence</h2>
            <button
              onClick={onClose}
              className="hover:bg-red-700/50 p-2 rounded-full transition-colors"
            >
              <XCircle size={28} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
              <div className="flex items-center space-x-4">
                <AlertTriangle
                  className="text-red-400 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                  size={40}
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {candidate.name}
                  </h3>
                  <p className="text-red-300">{candidate.email}</p>
                </div>
              </div>
            </div>

            {candidate.cheatComment && (
              <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">
                  Cheating Comment
                </h4>
                <p className="text-yellow-200">{candidate.cheatComment}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => onReject(candidate)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-lg flex items-center space-x-2 hover:from-red-700 hover:to-pink-800 transition shadow-lg hover:shadow-red-500/30"
              >
                <Ban size={20} />
                <span>Reject Candidate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisModal = ({ isOpen, onClose, candidates }) => {
  if (!isOpen) return null;

  const stats = {
    total: candidates.length,
    cheating: candidates.filter((c) => c.isCheating).length,
    aptitudePassed: candidates.filter((c) => c.aptitudeStatus === "Passed")
      .length,
    techPassed: candidates.filter((c) => c.techStatus === "Passed").length,
    hrPending: candidates.filter((c) => c.hrStatus === "Pending").length,
    hrPassed: candidates.filter((c) => c.hrStatus === "Passed").length,
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-purple-500 to-indigo-600 w-full max-w-4xl">
        <div className="bg-gray-800 rounded-2xl overflow-y-auto max-h-[90vh]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart2 className="w-6 h-6 mr-2 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                  Recruitment Analytics
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Pipeline Overview */}
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                  Pipeline Overview
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Total Candidates",
                      value: stats.total,
                      color: "bg-cyan-500",
                    },
                    {
                      label: "Aptitude Passed",
                      value: stats.aptitudePassed,
                      color: "bg-green-500",
                    },
                    {
                      label: "Technical Passed",
                      value: stats.techPassed,
                      color: "bg-purple-500",
                    },
                    {
                      label: "HR Completed",
                      value: stats.hrPassed,
                      color: "bg-blue-500",
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-white font-medium">
                          {item.value}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{
                            width: `${(item.value / stats.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion Rates */}
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Conversion Rates
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Screen to Interview",
                      value:
                        stats.total > 0
                          ? (
                              (stats.aptitudePassed / stats.total) *
                              100
                            ).toFixed(1)
                          : 0,
                      color: "text-cyan-400",
                    },
                    {
                      label: "Interview to Offer",
                      value:
                        stats.aptitudePassed > 0
                          ? (
                              (stats.techPassed / stats.aptitudePassed) *
                              100
                            ).toFixed(1)
                          : 0,
                      color: "text-purple-400",
                    },
                    {
                      label: "Overall Conversion",
                      value:
                        stats.total > 0
                          ? ((stats.techPassed / stats.total) * 100).toFixed(1)
                          : 0,
                      color: "text-green-400",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-300">{item.label}</span>
                      <span className={`${item.color} font-bold text-lg`}>
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="md:col-span-2 bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-orange-400" />
                  Status Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Aptitude Passed",
                      value: stats.aptitudePassed,
                      color: "bg-green-500",
                    },
                    {
                      label: "Aptitude Failed",
                      value: stats.total - stats.aptitudePassed,
                      color: "bg-red-500",
                    },
                    {
                      label: "Technical Passed",
                      value: stats.techPassed,
                      color: "bg-purple-500",
                    },
                    {
                      label: "Technical Failed",
                      value: stats.aptitudePassed - stats.techPassed,
                      color: "bg-yellow-500",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${item.color}`}
                      ></div>
                      <div>
                        <p className="text-gray-300 text-sm">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cheating Analysis */}
              <div className="md:col-span-2 bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Cheating Analysis
                </h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Total Cases</span>
                      <span className="text-2xl font-bold text-red-400">
                        {stats.cheating}
                      </span>
                    </div>
                    <div className="bg-gray-600 rounded-full h-4">
                      <div
                        className="bg-red-500 h-4 rounded-full"
                        style={{
                          width: `${(stats.cheating / stats.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      {stats.total > 0
                        ? ((stats.cheating / stats.total) * 100).toFixed(1)
                        : 0}
                      % of candidates
                    </p>
                  </div>
                  <div className="w-32 h-32 rounded-full border-4 border-red-500/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-400">
                      {stats.total > 0
                        ? ((stats.cheating / stats.total) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-purple-500/30"
              >
                Close Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecruitmentDashboard;
