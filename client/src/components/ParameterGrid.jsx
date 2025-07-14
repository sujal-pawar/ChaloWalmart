import React, { useState, useEffect } from "react";

export default function ParameterGrid({ history }) {
  // Feature index mapping to match backend's order
  const featureIndexMap = {
    cpu: 0,
    memory: 1,
    disk: 2,
    temperature: 3,
    errors: 4,
    responseTime: 5, // This is 'response_time' in backend
    network: 6,
    uptime: 7,
    processes: 8,
    threads: 9,
  };

  // Thresholds for determining parameter status
  const thresholds = {
    cpu: { warning: 70, critical: 85 },
    memory: { warning: 75, critical: 90 },
    disk: { warning: 80, critical: 90 },
    temperature: { warning: 52, critical: 55 },
    errors: { warning: 5, critical: 10 },
    responseTime: { warning: 180, critical: 220 },
    network: { warning: 80, critical: 95 },
    uptime: { warning: 0, critical: 0 }, // Lower is bad for uptime
    processes: { warning: 400, critical: 600 },
    threads: { warning: 150, critical: 200 },
  };

  // Units for each parameter
  const units = {
    cpu: "%",
    memory: "%",
    disk: "%",
    temperature: "°C",
    errors: "",
    responseTime: "ms",
    network: "GB",
    uptime: "days",
    processes: "",
    threads: "",
  };

  // Parameter names for display
  const paramNames = {
    cpu: "CPU Load",
    memory: "Memory Usage",
    disk: "Disk Space",
    temperature: "Temperature",
    errors: "Error Rate",
    responseTime: "Response Time",
    network: "Network Usage",
    uptime: "Uptime",
    processes: "Processes",
    threads: "Active Threads",
  };

  // Compute parameters from history
  const computeParameters = () => {
    const params = {};
    Object.keys(featureIndexMap).forEach((param) => {
      const idx = featureIndexMap[param];
      // Get last 5 values for this parameter from history
      const paramHistory = history.slice(-5).map(seq => seq[idx] ?? 0);
      const value = paramHistory[paramHistory.length - 1] ?? 0;
      const prevValue = paramHistory.length > 1 ? paramHistory[paramHistory.length - 2] : value;
      // Determine trend
      let trend = "stable";
      if (value > prevValue + (param === "uptime" ? 1 : 2)) {
        trend = "up";
      } else if (value < prevValue - 2) {
        trend = "down";
      }
      // Determine status
      let status = "normal";
      if (param === "uptime") {
        status = "normal";
      } else {
        if (value >= thresholds[param].critical) {
          status = "critical";
        } else if (value >= thresholds[param].warning) {
          status = "warning";
        }
      }
      params[param] = {
        value,
        trend,
        status,
        history: paramHistory.length === 5 ? paramHistory : Array(5 - paramHistory.length).fill(0).concat(paramHistory),
      };
    });
    return params;
  };

  const parameters = computeParameters();

  // Crash likelihood calculation based on parameter values
  const [crashLikelihood, setCrashLikelihood] = useState({
    probability: 0,
    timeFrame: "N/A",
    recommendations: ["Waiting for data..."],
  });

  // Update crash likelihood when parameters/history change
  useEffect(() => {
    const fetchPrediction = async () => {
      if (!history || history.length === 0) return;
      try {
        const res = await fetch("http://localhost:5001/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sequence: history }),
        });
        const prediction = await res.json();
        // Calculate time frame based on probability
        let timeFrame = "24 hours";
        if (prediction.probability > 0.7) {
          timeFrame = "1 hour";
        } else if (prediction.probability > 0.5) {
          timeFrame = "6 hours";
        } else if (prediction.probability > 0.3) {
          timeFrame = "12 hours";
        }
        // Generate recommendations
        const recommendations = [];
        if (prediction.reason) recommendations.push(prediction.reason);
        if (parameters.cpu.status === "critical") recommendations.push("Reduce CPU-intensive tasks immediately");
        else if (parameters.cpu.status === "warning") recommendations.push("Monitor CPU usage and prepare to scale");
        if (parameters.memory.status === "critical") recommendations.push("Increase memory allocation or check for memory leaks");
        if (parameters.disk.status === "critical" || parameters.disk.status === "warning") recommendations.push("Free up disk space or add storage");
        if (parameters.errors.status === "critical") recommendations.push("Critical: Investigate increasing error rate");
        if (parameters.responseTime.status === "critical") recommendations.push("Optimize response time - service degradation detected");
        if (parameters.temperature.status === "critical") recommendations.push("Check cooling systems immediately");
        const limitedRecommendations = recommendations.slice(0, 3);
        setCrashLikelihood({
          probability: prediction.probability,
          timeFrame,
          recommendations: limitedRecommendations.length > 0 ? limitedRecommendations : ["System operating within normal parameters"],
        });
      } catch (err) {
        setCrashLikelihood({
          probability: 0,
          timeFrame: "N/A",
          recommendations: ["Waiting for data..."],
        });
      }
    };
    fetchPrediction();
    // eslint-disable-next-line
  }, [history]);

  // Helper function to render trend indicator
  const renderTrend = (trend) => {
    switch (trend) {
      case "up":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  // Helper function to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return {
          bg: "bg-red-600",
          text: "text-red-500",
          border: "border-red-500",
          light: "bg-red-600/10",
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          text: "text-yellow-500",
          border: "border-yellow-500",
          light: "bg-yellow-500/10",
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

  // Mini sparkline chart
  const renderSparkline = (history, status) => {
    const colors = getStatusColor(status);
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;

    return (
      <div className="flex items-end h-6 gap-[2px]">
        {history.map((value, i) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={i}
              className={`w-[3px] ${colors.bg} rounded-sm`}
              style={{ height: `${Math.max(15, height)}%` }}
            ></div>
          );
        })}
      </div>
    );
  };

  // Get crash likelihood color
  const getCrashLikelihoodColor = () => {
    const probability = crashLikelihood.probability;
    if (probability >= 0.7) {
      return {
        bg: "bg-red-600",
        text: "text-red-500",
        border: "border-red-500",
        light: "bg-red-600/10",
      };
    } else if (probability >= 0.4) {
      return {
        bg: "bg-yellow-500",
        text: "text-yellow-500",
        border: "border-yellow-500",
        light: "bg-yellow-500/10",
      };
    } else {
      return {
        bg: "bg-green-500",
        text: "text-green-500",
        border: "border-green-500",
        light: "bg-green-500/10",
      };
    }
  };

  const crashColors = getCrashLikelihoodColor();
  // Safe calculation for crash probability percentage
  const crashProbabilityPercentage = Math.round(
    typeof crashLikelihood.probability === 'number' && !isNaN(crashLikelihood.probability)
      ? crashLikelihood.probability * 100
      : 1 // Show 1% if missing or invalid, to indicate stability
  );

  return (
    <section id="parameters" className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Server Parameters</h2>
        <p className="text-gray-400 mb-8">
          Real-time monitoring of critical server metrics
        </p>

        {/* Crash Likelihood Banner */}
        <div
          className={`mb-8 p-4 rounded-lg ${crashColors.light} border ${crashColors.border} border-opacity-30`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div
                className={`${crashColors.bg} h-4 w-4 rounded-full mr-3 animate-pulse`}
              ></div>
              <div>
                <h3 className="font-bold text-lg">
                  Crash Likelihood:{" "}
                  <span className={crashColors.text}>
                    {crashProbabilityPercentage}%
                  </span>
                </h3>
                <p className="text-sm text-gray-300">
                  Estimated time frame:{" "}
                  <span className="font-medium">
                    {crashLikelihood.timeFrame}
                  </span>
                </p>
              </div>
            </div>
            <div className="bg-black bg-opacity-20 px-4 py-2 rounded-lg">
              <h4 className="text-sm font-medium text-gray-200 mb-1">
                Recommendations:
              </h4>
              <ul className="text-xs text-gray-300 list-disc pl-4">
                {crashLikelihood.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.keys(parameters).map((key) => {
            const param = parameters[key];
            const colors = getStatusColor(param.status);

            return (
              <div
                key={key}
                className="bg-[#141414] rounded-lg border border-[#2A2A2A] p-4 hover:border-[#3A3A3A] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-gray-300 font-medium">
                      {paramNames[key]}
                    </h3>
                    <div className="flex items-center">
                      <span className={`text-xl font-bold ${colors.text}`}>
                        {key === "uptime"
                          ? `${(param.value / 86400).toFixed(1)}`
                          : key === "responseTime"
                          ? param.value.toFixed(2)
                          : key === "network"
                          ? `${(param.value / (1024 * 1024)).toFixed(2)}`
                          : Math.round(param.value * 10) / 10}
                        {units[key]}
                      </span>
                      <div className="ml-2">{renderTrend(param.trend)}</div>
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${colors.bg} ${
                      param.status !== "normal" ? "animate-pulse" : ""
                    }`}
                  ></div>
                </div>

                {/* Sparkline chart */}
                <div className="mt-4">
                  {renderSparkline(param.history, param.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
