import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FEATURES = [
  "cpu",
  "memory",
  "disk",
  "temperature",
  "errors",
  "response_time",
  "network",
  "uptime",
  "processes",
  "threads",
];
const FEATURE_LABELS = {
  cpu: "CPU",
  memory: "Memory",
  disk: "Disk",
  temperature: "Temperature",
  errors: "Errors",
  response_time: "Response Time",
  network: "Network",
  uptime: "Uptime",
  processes: "Processes",
  threads: "Threads",
};

export default function LiveGraphs() {
  const [history, setHistory] = useState([]); // Array of {timestamp, ...features}
  const intervalRef = useRef();

  // Fetch live data every 3 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/live-sequence");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (
          data.sequence &&
          Array.isArray(data.sequence) &&
          data.sequence.length > 0
        ) {
          const last = data.sequence[data.sequence.length - 1];
          // Map to feature names
          const entry = { timestamp: new Date().toLocaleTimeString() };
          let isValid = true;
          let isAllZero = true;
          FEATURES.forEach((f, i) => {
            const val = last[i];
            entry[f] = val;
            if (val === null || val === undefined) isValid = false;
            if (val !== 0) isAllZero = false;
          });
          if (isValid && !isAllZero) {
            setHistory((prev) => [...prev.slice(-29), entry]); // Keep last 30
          } else {
            console.log("Skipping invalid or all-zero data:", entry);
          }
        } else {
          console.log("No valid sequence data received:", data);
        }
      } catch (e) {
        console.error("Error fetching live data:", e);
      }
    };
    fetchData();
    intervalRef.current = setInterval(fetchData, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section id="graphs" className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <br />
        <h2 className="text-3xl font-bold mb-2">
          Live Server Parameter Graphs
        </h2>
        <p className="text-gray-400 mb-8">
          Real-time visualization of server metrics. Spikes indicate sudden
          changes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="bg-[#141414] rounded-lg border border-[#2A2A2A] p-4"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                {FEATURE_LABELS[feature]}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={history}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fill: "#aaa", fontSize: 10 }}
                    minTickGap={20}
                  />
                  <YAxis
                    tick={{ fill: "#aaa", fontSize: 10 }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#222",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={feature}
                    stroke="#FFC220"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
