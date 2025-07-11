// Mock data for server parameters
export const serverParameters = {
  current: {
    cpu: 78,
    memory: 67,
    disk: 82,
    network: 45,
    responseTime: 230,
    errorRate: 0.5,
    requestsPerSecond: 356,
    activeConnections: 245,
    threadCount: 89,
    queueLength: 12
  },
  history: {
    timestamps: generateTimeStamps(24),
    cpu: generateDataPoints(24, 50, 90),
    memory: generateDataPoints(24, 40, 80),
    disk: generateDataPoints(24, 60, 95, 5),
    network: generateDataPoints(24, 20, 70),
    responseTime: generateDataPoints(24, 100, 400),
    errorRate: generateDataPoints(24, 0, 3, 0.1),
    requestsPerSecond: generateDataPoints(24, 200, 500),
    activeConnections: generateDataPoints(24, 100, 300),
    threadCount: generateDataPoints(24, 50, 100),
    queueLength: generateDataPoints(24, 0, 30)
  },
  thresholds: {
    cpu: { warning: 70, critical: 85 },
    memory: { warning: 75, critical: 90 },
    disk: { warning: 80, critical: 90 },
    network: { warning: 80, critical: 95 },
    responseTime: { warning: 250, critical: 350 },
    errorRate: { warning: 1, critical: 2 },
    requestsPerSecond: { warning: 450, critical: 500 },
    activeConnections: { warning: 280, critical: 350 },
    threadCount: { warning: 90, critical: 95 },
    queueLength: { warning: 15, critical: 25 }
  }
};

// Helper functions to generate mock data
function generateTimeStamps(count) {
  const now = new Date();
  const result = [];
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    result.push(timestamp.toISOString());
  }
  return result;
}

function generateDataPoints(count, min, max, step = 1) {
  const result = [];
  let value = min + Math.floor(Math.random() * (max - min) / 2);
  
  for (let i = 0; i < count; i++) {
    // Add some randomness but keep a trend
    const change = (Math.random() - 0.5) * 15 * step;
    value = Math.max(min, Math.min(max, value + change));
    result.push(Math.round(value * (1/step)) / (1/step)); // Round to step precision
  }
  
  return result;
}

// Generate predictions for next 6 hours
export const crashPredictions = {
  timestamps: generateFutureTimeStamps(6),
  probability: generatePredictionProbability(6),
};

function generateFutureTimeStamps(count) {
  const now = new Date();
  const result = [];
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() + i);
    result.push(timestamp.toISOString());
  }
  return result;
}

function generatePredictionProbability(count) {
  const startProb = Math.random() * 0.1; // Start with low probability
  const result = [startProb];
  
  // Randomly decide if we'll show a crash trend or stable trend
  const isCrashTrend = Math.random() > 0.7;
  
  for (let i = 1; i < count; i++) {
    if (isCrashTrend) {
      // Exponential increase for crash scenario
      const multiplier = 1 + (i * 0.5);
      let newProb = result[i-1] * multiplier;
      // Cap at 0.95
      newProb = Math.min(0.95, newProb);
      result.push(newProb);
    } else {
      // Slight fluctuation for stable scenario
      const change = (Math.random() - 0.45) * 0.05;
      let newProb = result[i-1] + change;
      // Keep between 0.01 and 0.2 for stable
      newProb = Math.max(0.01, Math.min(0.2, newProb));
      result.push(newProb);
    }
  }
  
  return result;
}

// System recommendations based on current status
export const systemRecommendations = [
  {
    id: 1,
    title: "Optimize CPU Usage",
    description: "High CPU usage detected. Consider scaling up resources or optimizing workloads.",
    priority: "high",
    impact: "Server performance and stability",
    action: "Scale up CPU resources"
  },
  {
    id: 2,
    title: "Monitor Memory Leaks",
    description: "Memory usage trend indicates possible memory leaks in the application.",
    priority: "medium",
    impact: "Long-term stability",
    action: "Investigate application memory usage"
  },
  {
    id: 3,
    title: "Optimize Database Queries",
    description: "Slow database response time detected during peak usage periods.",
    priority: "medium",
    impact: "User experience and server load",
    action: "Review and optimize database queries"
  },
  {
    id: 4,
    title: "Balance Network Load",
    description: "Network traffic is unevenly distributed across available resources.",
    priority: "low",
    impact: "Network performance",
    action: "Implement better load balancing"
  }
];
