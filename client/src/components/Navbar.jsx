import React, { useState, useEffect } from "react";
import logo from "../assets/walmart-logo.webp";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serverStatus, setServerStatus] = useState("Online");
  const [isScrolled, setIsScrolled] = useState(false);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format current date
  const formattedDate = currentTime.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-black"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-2 justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            {/* Walmart Logo */}
            <img src={logo} alt="logo" width={150} />
          </div>

          {/* Desktop Nav - Right */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="hidden md:block text-sm text-gray-300 mr-4">
              {formattedDate}&nbsp;&nbsp;
            <span className="text-sm text-gray-300">{formattedTime}</span> 
            </div>
            <a
              href="#status"
              className="text-gray-300 hover:text-[#FFC220] transition font-medium"
            >
              Status
            </a>
            <a
              href="#parameters"
              className="text-gray-300 hover:text-[#FFC220] transition font-medium"
            >
              Parameters
            </a>
            <a
              href="#graphs"
              className="text-gray-300 hover:text-[#FFC220] transition font-medium"
            >
              Graphs
            </a>
            <a
              href="#analytics"
              className="text-gray-300 hover:text-[#FFC220] transition font-medium"
            >
              Analytics
            </a>
            <button className="bg-[#0071DC] hover:bg-[#0062BD] text-white px-4 py-2 rounded transition-colors">
              Dashboard
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-16 left-0 w-full transform transition-all duration-300 ease-in-out z-50 ${
          menuOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-full opacity-0 invisible"
        }`}
      >
        <div className="bg-[#141414] border-t border-[#1F1F1F] shadow-lg rounded-b-lg">
          {/* Mobile Status Display */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F1F1F]">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  serverStatus === "Online" ? "bg-green-500" : "bg-red-500"
                } mr-2`}
              ></div>
              <span className="text-white font-medium">
                Server Status: {serverStatus}
              </span>
            </div>
            <span className="text-sm text-gray-300">{formattedTime}</span>
          </div>

          {/* Mobile Navigation Links */}
          <div className="px-4 py-2 space-y-1">
            <a
              href="#status"
              className="block px-3 py-3 text-base font-medium text-white hover:bg-[#1F1F1F] hover:text-[#FFC220] rounded-md transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Status
              </div>
            </a>
            <a
              href="#parameters"
              className="block px-3 py-3 text-base font-medium text-white hover:bg-[#1F1F1F] hover:text-[#FFC220] rounded-md transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Parameters
              </div>
            </a>
            <a
              href="#graphs"
              className="block px-3 py-3 text-base font-medium text-white hover:bg-[#1F1F1F] hover:text-[#FFC220] rounded-md transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
                Graphs
              </div>
            </a>
            <a
              href="#analytics"
              className="block px-3 py-3 text-base font-medium text-white hover:bg-[#1F1F1F] hover:text-[#FFC220] rounded-md transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                Analytics
              </div>
            </a>
            <div className="pt-2 pb-4">
              <button
                className="w-full bg-[#0071DC] hover:bg-[#0062BD] text-white px-4 py-3 rounded transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </button>
            </div>
          </div>

          {/* Date display */}
          <div className="px-4 py-2 border-t border-[#1F1F1F] flex justify-center">
            <span className="text-sm text-gray-400">{formattedDate}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
