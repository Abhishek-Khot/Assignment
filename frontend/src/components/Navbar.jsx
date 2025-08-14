import { Link } from "react-router-dom";
import Button from "./Button";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isEmail, setIsEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setIsEmail(email);
    }
  }, [isEmail]);

  return (
    <nav className="w-full bg-black shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* Logo with gradient background icon */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V5a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 0 4 6.5v13zM6.5 15A4.5 4.5 0 0 0 2 19.5V6.5A4.5 4.5 0 0 1 6.5 2H21a2 2 0 0 1 2 2v15H6.5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-purple-400">
              TransparentAI
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
            {[
              { name: "Features", path: "/features" },
              { name: "How It Works", path: "/how-it-works" },
              { name: "Reviews", path: "/reviews" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-blue-400 transition-all duration-300 hover:[text-shadow:_0_0_10px_#00f,_0_0_20px_#00f,_0_0_30px_#00f]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          {isEmail ? (
            <div className="flex items-center space-x-4">
              <Link to={"/smart-upload"}>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-md text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Smart Upload
                </Button>
              </Link>
              <Link to={"/dashboard/products"}>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-4 py-2 rounded-md text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to={"/login"}>
                <button className="font-medium text-gray-300 hover:text-white transition-colors">
                  Login
                </button>
              </Link>
              <Link to={"/signup"}>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
