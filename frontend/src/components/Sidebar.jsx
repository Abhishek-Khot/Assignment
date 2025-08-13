import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  BarChart3,
  Upload,
  FileText,
  LogOut,
  Menu,
  X,
  Settings,
  History,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Profile",
      icon: User,
      path: "/dashboard",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Products",
      icon: Package,
      path: "/dashboard/products",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/dashboard/analytics",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Smart Upload",
      icon: Upload,
      path: "/upload",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      name: "Export History",
      icon: History,
      path: "/dashboard/history",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-[#1A1A1A] border-r border-[#333333] transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">TransparentAI</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? `${item.bgColor} ${item.color} shadow-lg`
                        : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`${
                        isActive ? item.color : "group-hover:text-white"
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#333333]">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;