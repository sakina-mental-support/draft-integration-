import React from "react";
import Sidebar from "./Sidebar";
import BottomNavbar from "./BottomNavbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col relative pb-20 md:pb-0">
        <div className="w-full max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default MainLayout;
