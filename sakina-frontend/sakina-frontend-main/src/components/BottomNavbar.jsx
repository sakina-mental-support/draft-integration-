import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const [active, setActive] = useState("chat");
  const navigate = useNavigate();

  const navItems = [
    {
      id: "chat",
      label: "CHAT",
      path: "/chat",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
      ),
    },
    {
      id: "exercises",
      label: "EXERCISES",
      path: "/exercises",
      icon: (
       <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
      ),
    },
    {
      id: "mood",
      label: "MOOD TRACKING",
      path: "/mood",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
      ),
    },
    {
      id: "profile",
      label: "PROFILE",
      path: "/profile",
      icon: (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
      ),
    },
  ];

  const handleNav = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  return (
    <div className="flex items-center justify-around max-w-sm mx-auto px-2 py-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNav(item)}
          className="flex flex-col items-center gap-1 px-3 py-1 flex-1 transition-all duration-200"
        >
          <span className={`transition-colors duration-200 ${active === item.id ? "text-[#71BCFF]" : "text-gray-400"}`}>
            {item.icon}
          </span>
          <span
            className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 leading-tight text-center ${
              active === item.id ? "text-[#71BCFF]" : "text-gray-400"
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavbar;