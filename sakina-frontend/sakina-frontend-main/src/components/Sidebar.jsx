import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "chat",
      label: "Chat",
      path: "/chat",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: "exercises",
      label: "Exercises",
      path: "/exercises",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "mood",
      label: "Mood Tracking",
      path: "/mood",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      path: "/profile",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/chat")}>
          <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center flex-shrink-0">
            <img src={logo} alt="Sakina Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Sakina</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#71BCFF] text-white shadow-md shadow-blue-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={`transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>
                {item.icon}
              </span>
              <span className="text-sm font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Support Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
          <p className="text-xs font-bold text-gray-900 mb-1">Need help?</p>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">Check our help center or contact support.</p>
          <button 
            onClick={() => navigate("/profile")}
            className="w-full py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-700 hover:bg-gray-100 transition"
          >
            Get Support
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
