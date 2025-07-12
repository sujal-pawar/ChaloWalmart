import React, { useState, useEffect } from "react";
import ParameterGrid from "./ParameterGrid";

export default function StatusHero() {
  const [serverStatus, setServerStatus] = useState({
    status: "Online", // Online, Warning, Critical
    probability: 0.82, // Probability from 0 to 1
    lastIncident: "12d 5h ago",
    metrics: [
      { name: "CPU Load", value: "78%", status: "warning" },
      { name: "Memory", value: "67%", status: "normal" },
      { name: "Response Time", value: "230ms", status: "critical" },
      { name: "Disk I/O", value: "28MB/s", status: "normal" },
    ],
  });

  const [showParameterGrid, setShowParameterGrid] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  // In a real app, you would fetch this data from your backend
  useEffect(() => {
    // Mock data fetch - would be replaced with actual API call
    const timer = setInterval(() => {
      // Simulate changing data
      const randomMetrics = [
        {
          name: "CPU Load",
          value: `${Math.floor(65 + Math.random() * 30)}%`,
          status:
            Math.random() > 0.7
              ? "warning"
              : Math.random() > 0.9
              ? "critical"
              : "normal",
        },
        {
          name: "Memory",
          value: `${Math.floor(60 + Math.random() * 25)}%`,
          status: Math.random() > 0.8 ? "warning" : "normal",
        },
        {
          name: "Response Time",
          value: `${Math.floor(180 + Math.random() * 150)}ms`,
          status:
            Math.random() > 0.7
              ? "critical"
              : Math.random() > 0.5
              ? "warning"
              : "normal",
        },
        {
          name: "Disk I/O",
          value: `${Math.floor(20 + Math.random() * 20)}MB/s`,
          status: Math.random() > 0.9 ? "warning" : "normal",
        },
      ];

      const probability = Math.min(
        0.95,
        Math.max(0.05, 0.7 + (Math.random() - 0.5) * 0.4)
      );
      let status =
        probability > 0.8
          ? "Online"
          : probability > 0.5
          ? "Warning"
          : "Critical";

      setServerStatus({
        ...serverStatus,
        status,
        probability,
        metrics: randomMetrics,
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(timer);
  }, []);

  // Handle scroll to show parameter grid and control scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show parameter grid when user scrolls down more than 50% of the viewport
      if (scrollPosition > windowHeight * 0.5) {
        setShowParameterGrid(true);
      } else {
        setShowParameterGrid(false);
      }

      // Hide scroll indicator when user scrolls down for the first time
      if (scrollPosition > 100 && !hasScrolled) {
        setShowScrollIndicator(false);
        setHasScrolled(true);
      }

      // Show scroll indicator when user returns to top
      if (scrollPosition < 50 && hasScrolled) {
        setShowScrollIndicator(true);
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // Handle click on scroll indicator
  const handleScrollIndicatorClick = () => {
    const windowHeight = window.innerHeight;
    window.scrollTo({
      top: windowHeight,
      behavior: "smooth",
    });
  };

  // Get status color based on current status
  const getStatusColor = () => {
    switch (serverStatus.status) {
      case "Online":
        return {
          bg: "bg-green-500",
          text: "text-green-500",
          border: "border-green-500",
          light: "bg-green-500/10",
        };
      case "Warning":
        return {
          bg: "bg-yellow-500",
          text: "text-yellow-500",
          border: "border-yellow-500",
          light: "bg-yellow-500/10",
        };
      case "Critical":
        return {
          bg: "bg-red-600",
          text: "text-red-600",
          border: "border-red-600",
          light: "bg-red-600/10",
        };
      default:
        return {
          bg: "bg-green-500",
          text: "text-green-500",
          border: "border-green-500",
          light: "bg-green-500/10",
        };
    }
  };

  // Get metric color based on status
  const getMetricColor = (status) => {
    switch (status) {
      case "normal":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  const statusColors = getStatusColor();
  const probabilityPercentage = Math.round(serverStatus.probability * 100);

  return (
    <div className="min-h-screen bg-black">
      {/* Full Screen Status Section */}
      <section
        id="status"
        className="min-h-screen flex items-center justify-center px-4 bg-black"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Server Status */}
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Server Status</h2>

              {/* Status Card */}
              <div className="bg-[#141414] rounded-xl shadow-xl p-6 border border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`h-5 w-5 rounded-full ${statusColors.bg} mr-3 animate-pulse`}
                    ></div>
                    <h3 className="text-2xl font-bold">
                      {serverStatus.status}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    Last incident: {serverStatus.lastIncident}
                  </div>
                </div>

                {/* Crash Probability */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-300">
                      Server Stability
                    </div>
                    <div className={`text-sm font-medium ${statusColors.text}`}>
                      {probabilityPercentage}%
                    </div>
                  </div>
                  <div className="h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors.bg} transition-all duration-500`}
                      style={{ width: `${probabilityPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Alert Message */}
                <div
                  className={`p-4 rounded-lg ${statusColors.light} mb-6 border ${statusColors.border} border-opacity-30`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {serverStatus.status === "Online" ? (
                        <svg
                          className="h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : serverStatus.status === "Warning" ? (
                        <svg
                          className="h-5 w-5 text-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3
                        className={`text-sm font-medium ${statusColors.text}`}
                      >
                        {serverStatus.status === "Online"
                          ? "All systems operational"
                          : serverStatus.status === "Warning"
                          ? "Performance degradation detected"
                          : "Critical issues detected - immediate action required"}
                      </h3>
                      <div className="mt-2 text-sm text-gray-300">
                        <p>
                          {serverStatus.status === "Online"
                            ? "Servers are running normally. No issues have been detected in the last 12 hours."
                            : serverStatus.status === "Warning"
                            ? "We've detected higher than normal response times and CPU load. Monitoring system closely."
                            : "Multiple critical metrics indicate potential server crash. Automatic remediation in progress."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4">
                  <button className="bg-[#0071DC] hover:bg-[#0062BD] text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Refresh Status
                  </button>
                  <button
                    className={`border ${statusColors.border} ${statusColors.text} px-4 py-2 rounded-lg transition-colors flex items-center hover:bg-opacity-10 hover:${statusColors.light}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Right column - Key Metrics */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>

              <div className="bg-[#141414] rounded-xl shadow-xl p-6 border border-[#2A2A2A]">
                <div className="space-y-6">
                  {serverStatus.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full ${getMetricColor(
                            metric.status
                          )} mr-3`}
                        ></div>
                        <span className="text-gray-300">{metric.name}</span>
                      </div>
                      <span
                        className={`font-mono font-bold ${getMetricColor(
                          metric.status
                        )}`}
                      >
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-[#2A2A2A]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">AI Prediction</h3>
                    <div
                      className={`px-2 py-1 rounded ${statusColors.light} ${statusColors.text} text-xs font-medium`}
                    >
                      {serverStatus.status === "Online"
                        ? "Stable"
                        : serverStatus.status === "Warning"
                        ? "Monitor"
                        : "Alert"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {serverStatus.status === "Online"
                      ? "Our AI models predict no issues in the next 24 hours based on current metrics."
                      : serverStatus.status === "Warning"
                      ? "Potential instability detected. There is a moderate risk of service degradation in the next 6 hours."
                      : "High probability of server crash detected. Immediate intervention recommended."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator - Only shows when showScrollIndicator is true */}
      {showScrollIndicator && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div
            className="flex flex-col items-center text-gray-400 animate-bounce cursor-pointer hover:text-gray-300 transition-colors"
            onClick={handleScrollIndicatorClick}
          >
            <span className="text-sm mb-2">Scroll for more details</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Parameter Grid - Shows on scroll */}
      {showParameterGrid && (
        <div className="transition-all duration-500 ease-in-out">
          <ParameterGrid />
        </div>
      )}
    </div>
  );
}
