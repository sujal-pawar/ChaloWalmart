import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    currentMetrics: {
      cpu: 0,
      memory: 0,
      disk: 0,
      temperature: 0,
      errors: 0,
      responseTime: 0,
      network: 0,
      uptime: 0,
      processes: 0,
      threads: 0,
    },
    historicalData: [],
    trends: {
      cpu: "stable",
      memory: "stable",
      disk: "stable",
      temperature: "stable",
      errors: "stable",
      responseTime: "stable",
      network: "stable",
      uptime: "stable",
      processes: "stable",
      threads: "stable",
    },
    alerts: [],
    performanceScore: 85,
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [selectedMetric, setSelectedMetric] = useState("cpu");

  // Mock data generation - replace with real API calls
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch real data from your server
        const response = await fetch("http://localhost:5000/live-sequence");
        const data = await response.json();

        if (data.sequence && data.sequence.length > 0) {
          // Get the latest metrics from the sequence
          const latestMetrics = data.sequence[data.sequence.length - 1];

          const currentMetrics = {
            cpu: latestMetrics[0], // CPU from server
            memory: latestMetrics[1], // Memory from server
            disk: latestMetrics[2], // Disk from server
            temperature: latestMetrics[3], // Temperature from server
            errors: latestMetrics[4], // Errors from server
            responseTime: latestMetrics[5], // Response time from server
            network: latestMetrics[6], // Network from server
            uptime: latestMetrics[7], // Uptime from server
            processes: latestMetrics[8], // Processes from server
            threads: latestMetrics[9], // Threads from server
          };

          // Convert sequence to historical data format
          const historicalData = data.sequence.map((seq, index) => {
            const time = new Date(
              Date.now() - (data.sequence.length - 1 - index) * 60000
            );
            return {
              time: time.toLocaleTimeString(),
              timestamp: time.getTime(),
              cpu: seq[0],
              memory: seq[1],
              disk: seq[2],
              temperature: seq[3],
              errors: seq[4],
              responseTime: seq[5],
              network: seq[6],
              uptime: seq[7],
              processes: seq[8],
              threads: seq[9],
            };
          });

          // Calculate trends
          const trends = {};
          Object.keys(currentMetrics).forEach((metric) => {
            const recentValues = historicalData.slice(-5).map((d) => d[metric]);
            const avg =
              recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
            const current = currentMetrics[metric];

            if (current > avg * 1.1) trends[metric] = "up";
            else if (current < avg * 0.9) trends[metric] = "down";
            else trends[metric] = "stable";
          });

          // Generate alerts
          const alerts = [];
          if (currentMetrics.cpu > 80)
            alerts.push({
              type: "warning",
              message: "High CPU usage detected",
              metric: "cpu",
              value: currentMetrics.cpu,
            });
          if (currentMetrics.memory > 85)
            alerts.push({
              type: "critical",
              message: "Memory usage critical",
              metric: "memory",
              value: currentMetrics.memory,
            });
          if (currentMetrics.temperature > 70)
            alerts.push({
              type: "warning",
              message: "High temperature detected",
              metric: "temperature",
              value: currentMetrics.temperature,
            });
          if (currentMetrics.errors > 5)
            alerts.push({
              type: "critical",
              message: "High error rate",
              metric: "errors",
              value: currentMetrics.errors,
            });
          if (currentMetrics.responseTime > 400)
            alerts.push({
              type: "warning",
              message: "Slow response time",
              metric: "responseTime",
              value: currentMetrics.responseTime,
            });

          // Calculate performance score
          const performanceScore = Math.max(
            0,
            100 -
              (currentMetrics.cpu > 80 ? 20 : 0) -
              (currentMetrics.memory > 85 ? 25 : 0) -
              (currentMetrics.temperature > 70 ? 15 : 0) -
              (currentMetrics.errors > 5 ? 20 : 0) -
              (currentMetrics.responseTime > 400 ? 15 : 0)
          );

          setAnalyticsData({
            currentMetrics,
            historicalData,
            trends,
            alerts,
            performanceScore,
          });
        }
      } catch (error) {
        console.error("Failed to fetch real data:", error);
        // Fallback to mock data if API fails
        generateMockData();
      }
    };

    const generateMockData = () => {
      const now = new Date();
      const historicalData = [];

      // Generate 24 hours of data points
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        historicalData.push({
          time: time.toLocaleTimeString(),
          timestamp: time.getTime(),
          cpu: Math.floor(20 + Math.random() * 60),
          memory: Math.floor(40 + Math.random() * 40),
          disk: Math.floor(60 + Math.random() * 30),
          temperature: Math.floor(40 + Math.random() * 30),
          errors: Math.floor(Math.random() * 10),
          responseTime: Math.floor(100 + Math.random() * 300),
          network: Math.floor(20 + Math.random() * 60),
          uptime: Math.floor(1 + Math.random() * 30),
          processes: Math.floor(50 + Math.random() * 100),
          threads: Math.floor(100 + Math.random() * 200),
        });
      }

      const currentMetrics = {
        cpu: Math.floor(20 + Math.random() * 60),
        memory: Math.floor(40 + Math.random() * 40),
        disk: Math.floor(60 + Math.random() * 30),
        temperature: Math.floor(40 + Math.random() * 30),
        errors: Math.floor(Math.random() * 10),
        responseTime: Math.floor(100 + Math.random() * 300),
        network: Math.floor(20 + Math.random() * 60),
        uptime: Math.floor(1 + Math.random() * 30),
        processes: Math.floor(50 + Math.random() * 100),
        threads: Math.floor(100 + Math.random() * 200),
      };

      // Calculate trends
      const trends = {};
      Object.keys(currentMetrics).forEach((metric) => {
        const recentValues = historicalData.slice(-5).map((d) => d[metric]);
        const avg =
          recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
        const current = currentMetrics[metric];

        if (current > avg * 1.1) trends[metric] = "up";
        else if (current < avg * 0.9) trends[metric] = "down";
        else trends[metric] = "stable";
      });

      // Generate alerts
      const alerts = [];
      if (currentMetrics.cpu > 80)
        alerts.push({
          type: "warning",
          message: "High CPU usage detected",
          metric: "cpu",
          value: currentMetrics.cpu,
        });
      if (currentMetrics.memory > 85)
        alerts.push({
          type: "critical",
          message: "Memory usage critical",
          metric: "memory",
          value: currentMetrics.memory,
        });
      if (currentMetrics.temperature > 70)
        alerts.push({
          type: "warning",
          message: "High temperature detected",
          metric: "temperature",
          value: currentMetrics.temperature,
        });
      if (currentMetrics.errors > 5)
        alerts.push({
          type: "critical",
          message: "High error rate",
          metric: "errors",
          value: currentMetrics.errors,
        });
      if (currentMetrics.responseTime > 400)
        alerts.push({
          type: "warning",
          message: "Slow response time",
          metric: "responseTime",
          value: currentMetrics.responseTime,
        });

      // Calculate performance score
      const performanceScore = Math.max(
        0,
        100 -
          (currentMetrics.cpu > 80 ? 20 : 0) -
          (currentMetrics.memory > 85 ? 25 : 0) -
          (currentMetrics.temperature > 70 ? 15 : 0) -
          (currentMetrics.errors > 5 ? 20 : 0) -
          (currentMetrics.responseTime > 400 ? 15 : 0)
      );

      setAnalyticsData({
        currentMetrics,
        historicalData,
        trends,
        alerts,
        performanceScore,
      });
    };

    // Try to fetch real data first, fallback to mock data
    fetchRealData();
    const interval = setInterval(fetchRealData, 5000);
    return () => clearInterval(interval);
  }, []);

  const metricNames = {
    cpu: "CPU Usage",
    memory: "Memory Usage",
    disk: "Disk Usage",
    temperature: "Temperature",
    errors: "Error Rate",
    responseTime: "Response Time",
    network: "Network Usage",
    uptime: "Uptime",
    processes: "Processes",
    threads: "Threads",
  };

  const metricUnits = {
    cpu: "%",
    memory: "%",
    disk: "%",
    temperature: "°C",
    errors: "",
    responseTime: "ms",
    network: "%",
    uptime: "days",
    processes: "",
    threads: "",
  };

  const getMetricColor = (metric, value) => {
    const thresholds = {
      cpu: { warning: 70, critical: 85 },
      memory: { warning: 75, critical: 90 },
      disk: { warning: 80, critical: 90 },
      temperature: { warning: 60, critical: 75 },
      errors: { warning: 3, critical: 7 },
      responseTime: { warning: 300, critical: 500 },
      network: { warning: 80, critical: 95 },
      uptime: { warning: 0, critical: 0 },
      processes: { warning: 150, critical: 200 },
      threads: { warning: 250, critical: 350 },
    };

    const threshold = thresholds[metric];
    if (value >= threshold.critical) return "#ef4444"; // red
    if (value >= threshold.warning) return "#f59e0b"; // yellow
    return "#10b981"; // green
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      default:
        return "→";
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <section id="analytics" className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">System Analytics</h2>
            <p className="text-gray-400">
              Real-time system performance analysis and trends
            </p>
          </div>

          <div className="flex gap-4 mt-4 lg:mt-0">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-[#141414] border border-[#2A2A2A] text-white px-3 py-2 rounded-lg"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
            </select>

            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-[#141414] border border-[#2A2A2A] text-white px-3 py-2 rounded-lg"
            >
              {Object.keys(metricNames).map((metric) => (
                <option key={metric} value={metric}>
                  {metricNames[metric]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Performance Score</h3>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor:
                    getPerformanceColor(analyticsData.performanceScore) + "20",
                  color: getPerformanceColor(analyticsData.performanceScore),
                }}
              >
                {analyticsData.performanceScore}
              </div>
            </div>
            <div className="w-full bg-[#1F1F1F] rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${analyticsData.performanceScore}%`,
                  backgroundColor: getPerformanceColor(
                    analyticsData.performanceScore
                  ),
                }}
              ></div>
            </div>
          </div>

          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <h3 className="text-lg font-medium mb-4">Active Alerts</h3>
            <div className="text-3xl font-bold text-yellow-500">
              {analyticsData.alerts.length}
            </div>
            <p className="text-sm text-gray-400">Current warnings</p>
          </div>

          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <h3 className="text-lg font-medium mb-4">System Uptime</h3>
            <div className="text-3xl font-bold text-green-500">
              {analyticsData.currentMetrics.uptime.toFixed(1)}d
            </div>
            <p className="text-sm text-gray-400">Days running</p>
          </div>

          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <h3 className="text-lg font-medium mb-4">Active Processes</h3>
            <div className="text-3xl font-bold text-blue-500">
              {analyticsData.currentMetrics.processes}
            </div>
            <p className="text-sm text-gray-400">Running processes</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Metric Chart */}
          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <h3 className="text-xl font-medium mb-4">
              {metricNames[selectedMetric]} Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F1F1F",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={getMetricColor(
                    selectedMetric,
                    analyticsData.currentMetrics[selectedMetric]
                  )}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Metrics Overview */}
          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <h3 className="text-xl font-medium mb-4">Current Metrics</h3>
            <div className="space-y-4">
              {Object.keys(metricNames).map((metric) => (
                <div key={metric} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        backgroundColor: getMetricColor(
                          metric,
                          analyticsData.currentMetrics[metric]
                        ),
                      }}
                    ></div>
                    <span className="text-gray-300">{metricNames[metric]}</span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className="font-mono font-bold mr-2"
                      style={{
                        color: getMetricColor(
                          metric,
                          analyticsData.currentMetrics[metric]
                        ),
                      }}
                    >
                      {analyticsData.currentMetrics[metric]}
                      {metricUnits[metric]}
                    </span>
                    <span className="text-lg">
                      {getTrendIcon(analyticsData.trends[metric])}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {analyticsData.alerts.length > 0 && (
          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A] mb-8">
            <h3 className="text-xl font-medium mb-4">Active Alerts</h3>
            <div className="space-y-3">
              {analyticsData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    alert.type === "critical"
                      ? "bg-red-600/10 border-red-500/30 text-red-400"
                      : "bg-yellow-600/10 border-yellow-500/30 text-yellow-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm opacity-75">
                        {metricNames[alert.metric]}: {alert.value}
                        {metricUnits[alert.metric]}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.type === "critical"
                          ? "bg-red-600/20"
                          : "bg-yellow-600/20"
                      }`}
                    >
                      {alert.type.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Health Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <h3 className="text-xl font-medium mb-4">Resource Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "CPU",
                      value: analyticsData.currentMetrics.cpu,
                      color: getMetricColor(
                        "cpu",
                        analyticsData.currentMetrics.cpu
                      ),
                    },
                    {
                      name: "Memory",
                      value: analyticsData.currentMetrics.memory,
                      color: getMetricColor(
                        "memory",
                        analyticsData.currentMetrics.memory
                      ),
                    },
                    {
                      name: "Disk",
                      value: analyticsData.currentMetrics.disk,
                      color: getMetricColor(
                        "disk",
                        analyticsData.currentMetrics.disk
                      ),
                    },
                    {
                      name: "Network",
                      value: analyticsData.currentMetrics.network,
                      color: getMetricColor(
                        "network",
                        analyticsData.currentMetrics.network
                      ),
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {[
                    {
                      name: "CPU",
                      value: analyticsData.currentMetrics.cpu,
                      color: getMetricColor(
                        "cpu",
                        analyticsData.currentMetrics.cpu
                      ),
                    },
                    {
                      name: "Memory",
                      value: analyticsData.currentMetrics.memory,
                      color: getMetricColor(
                        "memory",
                        analyticsData.currentMetrics.memory
                      ),
                    },
                    {
                      name: "Disk",
                      value: analyticsData.currentMetrics.disk,
                      color: getMetricColor(
                        "disk",
                        analyticsData.currentMetrics.disk
                      ),
                    },
                    {
                      name: "Network",
                      value: analyticsData.currentMetrics.network,
                      color: getMetricColor(
                        "network",
                        analyticsData.currentMetrics.network
                      ),
                    },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F1F1F",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
            <h3 className="text-xl font-medium mb-4">System Load Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.historicalData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F1F1F",
                    border: "1px solid #2A2A2A",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="disk"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
