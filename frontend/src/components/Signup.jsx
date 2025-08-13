import { User, Mail, Lock, AlertTriangle } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = { name, email, password };

    try {
      const response = await axios.post(`${BACKEND_URL}/signup`, formData);
      if (response.status === 200) {
        localStorage.clear();
        localStorage.setItem("email", email);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("name", name);
        setName("");
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      console.log("Signup failed", error);
      setError("Error: Unable to sign up!");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#0D0D0D] pt-20 pb-10 px-4 overflow-hidden">
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden relative shadow-2xl">
        {/* Glowing accents */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]"></div>
        <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-[#00FF99] shadow-[0_0_15px_#00FF99]"></div>
        <div className="absolute bottom-20 left-1/4 w-4 h-4 rounded-full bg-[#B266FF] shadow-[0_0_15px_#B266FF]"></div>

        {/* Header */}
        <div className="bg-[#1A1A1A] border-b border-[#333333] px-6 py-5 text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
            <User className="text-[#00BFFF] drop-shadow-[0_0_8px_#00BFFF]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#1E90FF]">
              TransparentAI
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create your account to get started
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="text-red-400 mr-3" size={20} />
                <span className="text-red-300">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#00FF99]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF99] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#00BFFF]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#B266FF]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-[#222222] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B266FF] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center"
              style={{
                background: "linear-gradient(to right, #00BFFF, #1E90FF)",
              }}
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?
              <Link to="/login">
                <button className="ml-1 text-[#00BFFF] hover:text-[#1E90FF] font-medium focus:outline-none">
                  Sign In
                </button>
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Glow */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00BFFF] via-[#B266FF] to-[#FF7F50]"></div>
      </div>
    </div>
  );
};

export default Signup;
